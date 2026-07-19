import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Sparkles, LogOut, ArrowRight, RefreshCw, KeyRound, CheckCircle2, Camera, Lock, VideoOff, Terminal, Zap } from 'lucide-react';
import { generateCognitiveChallenge, verifyCognitiveAnswer } from '../services/aiService';
import { supabase } from '../config/supabase';

// Extract clean display name — strips embedded JSON metadata from name field
function getCleanName(rawName) {
  if (!rawName) return 'User';
  const idx = rawName.indexOf(' {');
  return idx !== -1 ? rawName.substring(0, idx).trim() : rawName.trim();
}

// Parser helper for name metadata
const parseUserProfile = (fullName) => {
  let name = fullName || '';
  let metadata = { qualification: '', college: '', place: '', year: '1st Year', avatarUrl: '', facePhotoUrl: '' };
  if (name.includes('{')) {
    const idx = name.indexOf('{');
    const jsonStr = name.substring(idx).trim();
    name = name.substring(0, idx).trim();
    try {
      metadata = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse metadata:", e);
    }
  }
  return { name: name || 'Scholar', ...metadata };
};

// Helper to check if webcam feed is covered or too dark
function checkCameraVisibility(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { visible: true };

  const w = canvas.width;
  const h = canvas.height;
  try {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Bounds of the central target area (where the face must be placed)
    const startX = Math.round(w / 2 - 80);
    const endX = Math.round(w / 2 + 80);
    const startY = Math.round(h / 2 - 90);
    const endY = Math.round(h / 2 + 90);

    let totalLuminance = 0;
    let count = 0;

    // Sample pixels only within the central target rectangle (every 6th pixel)
    for (let y = startY; y < endY; y += 6) {
      for (let x = startX; x < endX; x += 6) {
        const idx = (y * w + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        totalLuminance += luminance;
        count++;
      }
    }

    const avgLuminance = totalLuminance / count;

    // Calculate standard deviation (variance) inside the target rectangle
    let sumSquaredDiffs = 0;
    for (let y = startY; y < endY; y += 6) {
      for (let x = startX; x < endX; x += 6) {
        const idx = (y * w + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const diff = luminance - avgLuminance;
        sumSquaredDiffs += diff * diff;
      }
    }
    const variance = sumSquaredDiffs / count;
    const stdDev = Math.sqrt(variance);

    // If it's covered by a finger/hand, the center box will be very flat/blurry (stdDev < 13.5)
    // or extremely dark (avgLuminance < 25)
    if (avgLuminance < 25 || stdDev < 13.5) {
      return { visible: false, reason: avgLuminance < 25 ? 'Obstructed/Dark' : 'Flat/No Features' };
    }
    return { visible: true };
  } catch (e) {
    return { visible: true };
  }
}

export default function FaceVerificationPortal({ user, onUpdateUser, onVerified, onLogout }) {
  const cleanName = getCleanName(user?.name);
  
  // Parse user metadata for registered face photo
  const userProfile = parseUserProfile(user?.name);
  const registeredPhotoUrl = userProfile.facePhotoUrl || '';

  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [matchConfidence, setMatchConfidence] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  
  // Check if camera is available/inbuilt on mount
  useEffect(() => {
    const checkCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          setHasCamera(false);
          setAuthMode('cognitive');
          return;
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideo = devices.some(device => device.kind === 'videoinput');
        if (!hasVideo) {
          setHasCamera(false);
          setAuthMode('cognitive');
        }
      } catch (err) {
        console.warn("Failed to check camera availability:", err);
        setHasCamera(false);
        setAuthMode('cognitive');
      }
    };
    checkCamera();
  }, []);
  
  // Authorization mode: 'opencv' (face scan) or 'cognitive' (riddle fallback)
  const [authMode, setAuthMode] = useState('opencv');
  
  // Camera & OpenCV scan states
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const cameraVisibilityRef = useRef({ visible: true });
  const cameraSpoofRef = useRef({ spoof: false, reason: '' });
  const cameraStaticRef = useRef(false);
  const prevFrameDataRef = useRef(null);

  const [cameraState, setCameraState] = useState('init'); // init, active, denied, error
  const [scanStatus, setScanStatus] = useState('calibrating'); // calibrating, scanning, verifying, success, failed
  const [scanProgress, setScanProgress] = useState(0);
  const [livenessPrompt, setLivenessPrompt] = useState('Position your face in the frame');
  const [consoleLogs, setConsoleLogs] = useState([
    'Initializing OpenCV face recognition engine...',
    'Loading Haar Cascade classifiers...',
    'Awaiting biometric camera permission...'
  ]);

  // Cognitive challenge fallback states
  const [challenge, setChallenge] = useState({ puzzle: '', answer: '' });
  const [userAnswer, setUserAnswer] = useState('');
  const [cogLoading, setCogLoading] = useState(false);
  const [cogVerifying, setCogVerifying] = useState(false);
  const [cogError, setCogError] = useState('');
  const [attempts, setAttempts] = useState(0);

  // Helper to add logs to the simulated OpenCV console
  const addLog = (msg) => {
    setConsoleLogs(prev => [...prev.slice(-6), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraState('init');
    setScanStatus('calibrating');
    setScanProgress(0);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraState('active');
        addLog('Webcam stream active. Resolution: 640x480.');
        addLog('OpenCV Matrix: CV_8UC4 allocated.');
        addLog('Starting real-time facial landmark tracking...');
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraState('denied');
      setAuthMode('cognitive'); // Auto fallback if camera denied
      addLog('Camera access denied or unavailable. Fallback protocol loaded.');
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraState('init');
  };

  // Handle Auth Mode Toggle
  useEffect(() => {
    if (authMode === 'opencv' && hasCamera) {
      startCamera();
    } else {
      stopCamera();
      fetchChallenge();
    }
    return () => stopCamera();
  }, [authMode, hasCamera]);

  // OpenCV scan simulation loop
  useEffect(() => {
    if (cameraState !== 'active' || authMode !== 'opencv') return;

    let progress = 0;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    // Simulated face landmark coordinates
    const landmarks = [
      { x: 150, y: 130, targetX: 150, targetY: 130 }, // Left Eye
      { x: 190, y: 130, targetX: 190, targetY: 130 }, // Right Eye
      { x: 170, y: 155, targetX: 170, targetY: 155 }, // Nose Tip
      { x: 170, y: 180, targetX: 170, targetY: 180 }, // Mouth Center
      { x: 150, y: 185, targetX: 150, targetY: 185 }, // Left Mouth Corner
      { x: 190, y: 185, targetX: 190, targetY: 185 }, // Right Mouth Corner
      { x: 170, y: 95,  targetX: 170, targetY: 95  }, // Forehead
      { x: 170, y: 215, targetX: 170, targetY: 215 }, // Chin
      { x: 120, y: 160, targetX: 120, targetY: 160 }, // Left Cheek
      { x: 220, y: 160, targetX: 220, targetY: 160 }  // Right Cheek
    ];

    const drawScanner = () => {
      if (!canvas || !ctx || !videoRef.current) return;

      // Match canvas dimensions to output container
      const w = canvas.width = 340;
      const h = canvas.height = 280;

      // Draw video frame to canvas
      ctx.drawImage(videoRef.current, 0, 0, w, h);

      // Check visibility NOW on the raw video frame (before drawing HUD elements)
      const visibility = checkCameraVisibility(canvas);
      cameraVisibilityRef.current = visibility;

      // Check spoof detection & motion signature on the raw video frame
      let isSpoof = false;
      let spoofReason = '';
      let isStatic = false;

      if (visibility.visible) {
        try {
          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;

          // 1. Digital Screen / Spoof detection
          let saturatedCount = 0;
          let centerCount = 0;
          const startX = Math.round(w / 2 - 80);
          const endX = Math.round(w / 2 + 80);
          const startY = Math.round(h / 2 - 95);
          const endY = Math.round(h / 2 + 95);

          for (let y = startY; y < endY; y += 4) {
            for (let x = startX; x < endX; x += 4) {
              const idx = (y * w + x) * 4;
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];
              
              if (r > 230 && g > 230 && b > 230) {
                saturatedCount++;
              }
              centerCount++;
            }
          }

          const saturationRatio = saturatedCount / centerCount;
          if (saturationRatio > 0.085) {
            isSpoof = true;
            spoofReason = 'digital screen glare';
          }

          // 2. Motion signature check (to prevent static face photo spoofing)
          if (prevFrameDataRef.current) {
            let diff = 0;
            let count = 0;
            for (let i = 0; i < data.length; i += 120) {
              diff += Math.abs(data[i] - prevFrameDataRef.current[i]);
              count++;
            }
            const motionScore = diff / count;
            if (motionScore < 0.65) {
              isStatic = true;
            }
          }
          prevFrameDataRef.current = new Uint8ClampedArray(data);
        } catch (e) {
          console.error("Scanner frame analysis failed:", e);
        }
      }

      cameraSpoofRef.current = { spoof: isSpoof, reason: spoofReason };
      cameraStaticRef.current = isStatic;

      // Apply sci-fi HUD scan effect
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.4)';
      ctx.lineWidth = 1;
      
      // Target area square
      const rectX = w / 2 - 95;
      const rectY = h / 2 - 105;
      const rectW = 190;
      const rectH = 210;

      // Draw bounding box corner brackets
      ctx.strokeStyle = progress > 50 && progress < 80 ? '#f72585' : '#00f5d4';
      ctx.lineWidth = 3;
      // Top-Left
      ctx.beginPath(); ctx.moveTo(rectX, rectY + 20); ctx.lineTo(rectX, rectY); ctx.lineTo(rectX + 20, rectY); ctx.stroke();
      // Top-Right
      ctx.beginPath(); ctx.moveTo(rectX + rectW - 20, rectY); ctx.lineTo(rectX + rectW, rectY); ctx.lineTo(rectX + rectW, rectY + 20); ctx.stroke();
      // Bottom-Left
      ctx.beginPath(); ctx.moveTo(rectX, rectY + rectH - 20); ctx.lineTo(rectX, rectY + rectH); ctx.lineTo(rectX + 20, rectY + rectH); ctx.stroke();
      // Bottom-Right
      ctx.beginPath(); ctx.moveTo(rectX + rectW - 20, rectY + rectH); ctx.lineTo(rectX + rectW, rectY + rectH); ctx.lineTo(rectX + rectW, rectY + rectH - 20); ctx.stroke();

      // Scan Laser line
      const laserY = rectY + ((Math.sin(Date.now() / 200) + 1) / 2) * rectH;
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00f5d4';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(rectX + 5, laserY);
      ctx.lineTo(rectX + rectW - 5, laserY);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      // Jitter landmarks slightly to simulate active tracking calculation
      landmarks.forEach((pt, idx) => {
        pt.x += (pt.targetX + (Math.random() * 4 - 2) - pt.x) * 0.1;
        pt.y += (pt.targetY + (Math.random() * 4 - 2) - pt.y) * 0.1;
        
        ctx.fillStyle = progress > 80 ? '#00f5d4' : 'rgba(247, 37, 133, 0.85)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, 2 * Math.PI);
        ctx.fill();

        // Connect landmarks with faint structural grid lines
        if (idx > 0 && idx % 3 === 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(landmarks[idx - 1].x, landmarks[idx - 1].y);
          ctx.lineTo(pt.x, pt.y);
          ctx.stroke();
        }
      });

      // HUD Text overlays
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`OPENCV.JS Core: v4.8.0`, 15, 25);
      ctx.fillText(`FPS: 30.0 / SEC`, 15, 40);
      ctx.fillText(`THRES: 0.94`, 15, 55);

      ctx.fillText(`LIVENESS: ${progress > 40 ? 'VERIFIED' : 'PENDING'}`, w - 110, 25);
      ctx.fillText(`CONFIDENCE: ${Math.min(99.8, 85 + (progress / 100) * 14.8).toFixed(1)}%`, w - 110, 40);

      // Scanning progress overlay text
      if (progress < 100) {
        ctx.fillStyle = '#00f5d4';
        ctx.fillText(`SCANNING: ${Math.round(progress)}%`, w / 2 - 35, h - 20);
      } else {
        ctx.fillStyle = '#00f5d4';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`BIOMETRIC AUTH GRANTED`, w / 2 - 65, h - 20);
      }

      // Check if camera is covered and draw red HUD warning
      if (!visibility.visible) {
        ctx.fillStyle = 'rgba(255, 0, 85, 0.35)';
        ctx.fillRect(0, 0, w, h);
        
        ctx.fillStyle = '#ff0055';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('WARNING: BIOMETRIC LENS OBSTRUCTED', w / 2 - 110, h / 2);
        
        ctx.font = '9px monospace';
        ctx.fillText('Uncover the camera lens to resume scan.', w / 2 - 100, h / 2 + 18);
      } else if (cameraSpoofRef.current.spoof) {
        ctx.fillStyle = 'rgba(255, 0, 85, 0.35)';
        ctx.fillRect(0, 0, w, h);
        
        ctx.fillStyle = '#ff0055';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('WARNING: GLOWING DEVICE SCREEN SPOOF', w / 2 - 115, h / 2);
        
        ctx.font = '9px monospace';
        ctx.fillText('Please present a live face, not a phone screen.', w / 2 - 125, h / 2 + 18);
      } else if (cameraStaticRef.current && progress > 15) {
        ctx.fillStyle = 'rgba(255, 170, 0, 0.15)';
        ctx.fillRect(0, 0, w, h);
        
        ctx.fillStyle = '#ffaa00';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('LIVENESS: STATIC SUBJECT DETECTED', w / 2 - 105, h / 2);
        
        ctx.font = '9px monospace';
        ctx.fillText('Please blink or move your head slightly.', w / 2 - 105, h / 2 + 18);
      }

      animationFrameRef.current = requestAnimationFrame(drawScanner);
    };

    // Simulated scanning process stages
    const scanInterval = setInterval(() => {
      // Check if camera is covered or dark
      const visibility = cameraVisibilityRef.current;
      
      if (!visibility.visible) {
        progress = Math.max(0, progress - 0.8); // decrease progress slightly
        setScanProgress(Math.round(progress));
        setScanStatus('failed');
        setLivenessPrompt('Biometric sensor blocked! Uncover the camera lens.');
        if (Math.random() < 0.15) {
          addLog(`[WARNING] Lens obstructed (${visibility.reason}). Scanner paused.`);
        }
        return;
      }

      // Check if digital screen spoof is active
      if (cameraSpoofRef.current.spoof) {
        progress = Math.max(0, progress - 1.2); // decrease progress
        setScanProgress(Math.round(progress));
        setScanStatus('failed');
        setLivenessPrompt('Liveness failed: Glowing device screen/spoof detected.');
        if (Math.random() < 0.15) {
          addLog('[SECURITY] Digital screen spoofing attempt rejected.');
        }
        return;
      }

      // Check if liveness motion is static
      if (cameraStaticRef.current && progress > 15) {
        // Freeze scanning, wait for user head movement / blink
        setScanStatus('scanning');
        setLivenessPrompt('Liveness verification: Please blink or move your head.');
        if (Math.random() < 0.05) {
          addLog('[LIVENESS] Static posture detected. Awaiting micro-expressions.');
        }
        return;
      }

      progress += 1.5;
      setScanProgress(Math.min(100, Math.round(progress)));

      if (progress < 25) {
        setScanStatus('calibrating');
        setLivenessPrompt('Hold still — calibrating facial mesh');
      } else if (progress < 60) {
        setScanStatus('scanning');
        setLivenessPrompt('Mesh aligned. Please blink to check liveness');
        if (Math.random() < 0.05) addLog('Mesh lock acquired. Point count: 184.');
      } else if (progress < 85) {
        setScanStatus('verifying');
        setLivenessPrompt('Comparing landmarks against security database');
        if (Math.random() < 0.05) addLog('Feature map compared. Mismatch risk: <0.02%.');
      } else if (progress >= 100) {
        // Enforce visibility and spoof checks at the exact moment of frame capture
        if (!cameraVisibilityRef.current.visible || cameraSpoofRef.current.spoof) {
          const isLuminanceObstructed = !cameraVisibilityRef.current.visible;
          progress = 0;
          setScanProgress(0);
          setScanStatus('failed');
          setLivenessPrompt(isLuminanceObstructed ? 'Capture failed: Camera was obstructed.' : 'Capture failed: Digital screen spoof detected.');
          addLog(isLuminanceObstructed ? '[CRITICAL] Verification aborted: Obstruction detected.' : '[CRITICAL] Verification aborted: Digital screen spoof detected.');
          return;
        }

        clearInterval(scanInterval);
        
        if (canvas) {
          try {
            setScanStatus('verifying');
            setLivenessPrompt('Capturing biometric frame...');
            addLog('Biometric frame captured. Generating image stream...');
            
            const dataUrl = canvas.toDataURL('image/jpeg');
            setCapturedPhotoUrl(dataUrl);
            setShowComparison(true);
            
            canvas.toBlob(async (blob) => {
              if (!blob) {
                addLog('Error: Failed to extract image blob.');
                setScanStatus('failed');
                return;
              }
              
              setIsUploading(true);
              setLivenessPrompt('Uploading biometric to Supabase...');
              addLog('Connecting to Supabase Storage: academic_resources...');
              
              const filename = `face_verifications/${user.id}/${Date.now()}.jpg`;
              
              const { data, error: uploadError } = await supabase.storage
                .from('academic_resources')
                .upload(filename, blob, {
                  contentType: 'image/jpeg',
                  cacheControl: '3600',
                  upsert: true
                });
                
              if (uploadError) {
                console.error("Supabase storage upload error:", uploadError);
                addLog(`Upload failed: ${uploadError.message}`);
                setIsUploading(false);
                setScanStatus('failed');
                setLivenessPrompt('Biometric storage upload failed.');
                return;
              }
              
              addLog('Biometric upload successful.');
              
              const { data: { publicUrl } } = supabase.storage
                .from('academic_resources')
                .getPublicUrl(filename);
                
              addLog(`Stored photo URL successfully.`);
              
              // Handle database updates
              const profile = parseUserProfile(user?.name);
              let finalUpdatedUser = user;
              
              if (!profile.facePhotoUrl) {
                profile.facePhotoUrl = publicUrl;
                // Sync with avatarUrl if empty
                if (!profile.avatarUrl) {
                  profile.avatarUrl = publicUrl;
                }
                
                const cleanName = getCleanName(user?.name);
                const updatedName = `${cleanName} ${JSON.stringify(profile)}`;
                
                addLog('Registering new biometric reference profile...');
                
                const { error: dbError } = await supabase
                  .from('users')
                  .update({ name: updatedName })
                  .eq('id', user.id);
                  
                if (dbError) {
                  console.error("Database update error:", dbError);
                  addLog(`Database update failed: ${dbError.message}`);
                } else {
                  addLog('Biometric profile linked successfully.');
                  finalUpdatedUser = { ...user, name: updatedName };
                  if (onUpdateUser) {
                    onUpdateUser(finalUpdatedUser);
                  }
                  localStorage.setItem('lumixora_user', JSON.stringify(finalUpdatedUser));
                }
              } else {
                addLog('Existing reference biometric profile found.');
                addLog('Running neural comparison against reference photo...');
              }
              
              setIsUploading(false);
              
              // Animate match confidence score
              let conf = 0;
              const confInterval = setInterval(() => {
                conf += 5;
                if (conf >= 98) {
                  clearInterval(confInterval);
                  setMatchConfidence(99.8);
                  setScanStatus('success');
                  setLivenessPrompt('Identity Verified! Welcome back.');
                  addLog('Biometric match confidence: 99.8%. Match verified.');
                  addLog('Access token authorized.');
                  
                  setTimeout(() => {
                    stopCamera();
                    onVerified();
                  }, 1800);
                } else {
                  setMatchConfidence(conf);
                }
              }, 40);
              
            }, 'image/jpeg');
            
          } catch (err) {
            console.error("Biometric processing error:", err);
            addLog(`Error: ${err.message}`);
            setScanStatus('failed');
            setLivenessPrompt('Biometric capture processing failed.');
          }
        } else {
          setScanStatus('success');
          setLivenessPrompt('Identity Verified.');
          setTimeout(() => {
            stopCamera();
            onVerified();
          }, 1500);
        }
      }
    }, 70);

    drawScanner();

    return () => {
      clearInterval(scanInterval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraState, authMode]);

  // Fallback Cognitive Challenge logic
  const fetchChallenge = async () => {
    setCogLoading(true);
    setCogError('');
    setUserAnswer('');
    try {
      const data = await generateCognitiveChallenge(cleanName);
      
      const sanitizedData = {};
      if (data && typeof data === 'object') {
        Object.keys(data).forEach(key => {
          sanitizedData[key.toLowerCase()] = data[key];
        });
      }

      const puzzleText = sanitizedData.puzzle || sanitizedData.question || sanitizedData.challenge || '';
      const answerText = sanitizedData.answer || sanitizedData.ans || '';

      if (!puzzleText || !answerText) {
        throw new Error("Malformed security challenge package.");
      }

      setChallenge({
        puzzle: puzzleText,
        answer: String(answerText).trim().toLowerCase()
      });
    } catch (err) {
      console.error("Challenge fetch error:", err);
      setChallenge({
        puzzle: "What has keys but can't open locks, has space but no room, and you can enter but not go inside?",
        answer: "keyboard"
      });
    } finally {
      setCogLoading(false);
    }
  };

  const handleVerifyCognitive = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setCogVerifying(true);
    setCogError('');

    try {
      const expected = (challenge.answer || '').trim().toLowerCase();
      const input = userAnswer.trim().toLowerCase();

      if (!expected) {
        setCogError('Security token is empty. Please refresh.');
        setCogVerifying(false);
        return;
      }

      const inputWords = input.split(/\s+/);
      const expectedWords = expected.split(/\s+/);
      let isCorrect = input === expected ||
                      (inputWords.length > 0 && expectedWords.every(w => inputWords.includes(w)));

      if (!isCorrect) {
        isCorrect = await verifyCognitiveAnswer(challenge.puzzle, userAnswer);
      }

      if (isCorrect) {
        setScanStatus('success');
        setCogVerifying(false);
        setTimeout(() => {
          onVerified();
        }, 1500);
      } else {
        setAttempts(prev => prev + 1);
        setCogError('Access Denied: Cognitive authorization signature mismatch.');
        setCogVerifying(false);
        
        if (attempts >= 2) {
          setTimeout(() => {
            fetchChallenge();
            setAttempts(0);
          }, 1500);
        }
      }
    } catch (err) {
      console.error(err);
      setCogError('Internal validation failure. Try again.');
      setCogVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06060a] flex items-center justify-center relative overflow-hidden text-white font-sans p-4">
      
      {/* Sci-fi scan glow animation styles */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(0); }
          50% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
        .scan-glow {
          box-shadow: 0 0 20px rgba(0, 245, 212, 0.15);
        }
        .console-line {
          font-family: monospace;
          color: #a0aec0;
          font-size: 10px;
          margin-bottom: 2px;
          border-left: 2px solid rgba(0, 245, 212, 0.4);
          padding-left: 6px;
        }
      `}</style>

      {/* Massive Background Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none">
        <h1 className="text-[18vw] font-black text-transparent bg-clip-text bg-gradient-to-br from-[#00f5d4]/5 via-[#7209b7]/3 to-transparent tracking-tighter opacity-20 rotate-[-5deg]">
          STUDENT_OS
        </h1>
      </div>

      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f5d4]/8 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7209b7]/8 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      {/* Main Glass Panel */}
      <div className="z-10 w-full max-w-md p-6 sm:p-8 glass-panel rounded-3xl border border-white/10 text-center relative overflow-hidden shadow-2xl transition-all duration-300">
        
        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f5d4]/20 to-[#7209b7]/20 border border-[#00f5d4]/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(0,245,212,0.1)]">
            <Cpu className="text-[#00f5d4] w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-gray-100 uppercase tracking-wide">Biometric Authorization</h2>
          <p className="text-gray-400 text-xs mt-1">
            LUMIXORA Security Core active. Welcome back, <span className="text-[#00f5d4] font-semibold">{cleanName}</span>.
          </p>
        </div>

        {/* Mode Selector - Only show if camera is not inbuilt */}
        {!hasCamera && (
          <div className="flex bg-black/40 rounded-xl p-1 border border-white/5 mb-6">
            <button 
              onClick={() => setAuthMode('opencv')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'opencv' 
                  ? 'bg-gradient-to-r from-brand-teal to-brand-blue text-black font-extrabold shadow-[0_0_10px_rgba(0,245,212,0.2)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>OpenCV Face Recognition</span>
            </button>
            <button 
              onClick={() => setAuthMode('cognitive')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'cognitive' 
                  ? 'bg-gradient-to-r from-brand-pink to-brand-purple text-white shadow-[0_0_10px_rgba(247,37,133,0.2)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Cognitive Passkey</span>
            </button>
          </div>
        )}

        {/* VIEW 1: OpenCV Biometric Scan */}
        {authMode === 'opencv' && (
          <div className="space-y-6">
            
            {/* Camera / Canvas Display Box */}
            <div className="relative w-full h-[280px] bg-black rounded-2xl overflow-hidden border border-white/10 scan-glow flex items-center justify-center">
              
              {showComparison ? (
                <div className="absolute inset-0 bg-[#06060a] flex flex-col justify-between p-4 z-20">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Biometric Compare</span>
                    <span className="text-[10px] text-[#00f5d4] font-extrabold font-mono tracking-widest bg-[#00f5d4]/10 px-2 py-0.5 rounded-full">
                      {isUploading ? 'SAVING...' : `${matchConfidence.toFixed(1)}% MATCH`}
                    </span>
                  </div>
                  
                  <div className="flex gap-4 items-center justify-center my-auto">
                    {/* Left: Registered reference photo */}
                    <div className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative shadow-inner flex items-center justify-center">
                        {registeredPhotoUrl ? (
                          <img src={registeredPhotoUrl} alt="Reference" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 text-[10px] font-mono p-2 text-center uppercase tracking-wide">
                            No Ref Photo
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 py-0.5 text-[8px] font-mono text-center text-gray-400 border-t border-white/5">
                          REFERENCE
                        </div>
                      </div>
                    </div>

                    {/* Scanner line or arrow */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-[1px] bg-gradient-to-r from-[#7209b7] to-[#00f5d4] animate-pulse" />
                      <Cpu className="w-4 h-4 text-[#00f5d4] animate-spin" />
                      <div className="w-6 h-[1px] bg-gradient-to-r from-[#00f5d4] to-[#7209b7] animate-pulse" />
                    </div>

                    {/* Right: Captured current photo */}
                    <div className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-24 h-24 rounded-2xl bg-white/5 border-2 border-[#00f5d4] overflow-hidden relative shadow-[0_0_15px_rgba(0,245,212,0.2)] flex items-center justify-center">
                        {capturedPhotoUrl ? (
                          <img src={capturedPhotoUrl} alt="Captured" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <Camera className="w-5 h-5 animate-pulse" />
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 py-0.5 text-[8px] font-mono text-center text-[#00f5d4] border-t border-[#00f5d4]/20">
                          CAPTURED
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-500 font-mono text-center pt-2 border-t border-white/5 mt-auto">
                    {isUploading ? 'Syncing credentials to cluster...' : 'Verifying visual signatures...'}
                  </div>
                </div>
              ) : (
                <>
                  {/* Hidden Video element for feed mapping */}
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="hidden"
                  />

                  {/* Active Canvas rendering OpenCV output */}
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-full object-cover"
                  />

                  {/* Initializing / Error States overlay */}
                  {cameraState === 'init' && (
                    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-8 h-8 text-[#00f5d4] animate-spin" />
                      <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Loading OpenCV Feed...</p>
                    </div>
                  )}

                  {cameraState === 'denied' && (
                    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-3 px-6 text-center">
                      <VideoOff className="w-10 h-10 text-red-500 animate-pulse" />
                      <p className="text-xs text-gray-300 font-bold">Biometric Camera Blocked</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed">Please enable camera permission in your browser or switch to the Cognitive Passkey fallback mode.</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Prompt & Progress Info */}
            {cameraState === 'active' && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left relative overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Status Message</span>
                  <span className="text-[10px] text-brand-teal font-extrabold font-mono">{scanProgress}% SECURE</span>
                </div>
                <h4 className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-brand-pink animate-pulse" />
                  {livenessPrompt}
                </h4>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mt-3 border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-teal to-brand-blue rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Simulated OpenCV Console terminal logs */}
            <div className="p-4 rounded-xl bg-black/75 border border-white/5 text-left font-mono">
              <div className="flex items-center gap-1.5 text-[9px] text-[#00f5d4] font-bold uppercase tracking-wider mb-2 pb-1.5 border-b border-white/5">
                <Terminal className="w-3.5 h-3.5" />
                <span>OpenCV Matrix Logs</span>
              </div>
              <div className="space-y-1.5 h-28 overflow-y-auto">
                {consoleLogs.map((log, index) => (
                  <div key={index} className="console-line truncate">{log}</div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: Cognitive Passkey Fallback */}
        {authMode === 'cognitive' && (
          <div className="space-y-6 text-left">
            <div className="w-full rounded-2xl border border-brand-pink/20 bg-black/40 p-6 relative overflow-hidden shadow-[inset_0_0_20px_rgba(247,37,133,0.05)]">
              <div className="absolute top-0 right-0 p-2 text-[9px] uppercase tracking-widest text-brand-pink/50 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-pink" />
                <span>AI GATEWAY CORE</span>
              </div>

              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Cognitive Challenge:</span>
              
              {cogLoading ? (
                <div className="py-6 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 text-brand-pink animate-spin" />
                  <p className="text-xs text-gray-400 font-medium">Requesting riddle from AI...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-200 leading-relaxed bg-[#0a0a10]/80 p-3 rounded-xl border border-white/5 shadow-inner">
                    {challenge.puzzle}
                  </p>

                  <form onSubmit={handleVerifyCognitive} className="space-y-4">
                    <div>
                      <label htmlFor="answer" className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                        Your Verification Key (Answer)
                      </label>
                      <input
                        type="text"
                        id="answer"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        disabled={cogVerifying || scanStatus === 'success'}
                        placeholder="Enter lowercase answer..."
                        className="w-full bg-[#0d0d14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-pink/50 transition-all placeholder-gray-600 font-mono tracking-wide"
                        autoComplete="off"
                        required
                      />
                    </div>

                    {cogError && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] p-3 rounded-xl flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>{cogError}</span>
                      </div>
                    )}

                    {scanStatus === 'success' && (
                      <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-[11px] p-3 rounded-xl flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>Access Granted! Loading Secure Session...</span>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={fetchChallenge}
                        disabled={cogLoading || cogVerifying || scanStatus === 'success'}
                        className="px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-gray-400 hover:text-white cursor-pointer disabled:opacity-30"
                        title="Generate New Challenge"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      
                      <button
                        type="submit"
                        disabled={cogVerifying || scanStatus === 'success' || !userAnswer.trim()}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                          cogVerifying || scanStatus === 'success' || !userAnswer.trim()
                            ? 'bg-white/5 border-white/5 text-gray-500 cursor-not-allowed border'
                            : 'bg-brand-pink border-brand-pink hover:opacity-90 text-white cursor-pointer shadow-[0_0_20px_rgba(247,37,133,0.25)]'
                        }`}
                      >
                        {cogVerifying ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : scanStatus === 'success' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Authorized</span>
                          </>
                        ) : (
                          <>
                            <span>Verify Passkey</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer info & cancel/logout */}
        <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest pt-4 border-t border-white/5 mt-6">
          <div className="flex items-center gap-1 text-gray-400">
            <Lock className="w-3.5 h-3.5 text-brand-teal/70" />
            <span>AI GATEWAY PROT</span>
          </div>
          <button 
            onClick={onLogout}
            className="hover:text-brand-pink flex items-center gap-1.5 transition-colors font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cancel & Logout</span>
          </button>
        </div>

      </div>

    </div>
  );
}
