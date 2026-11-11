import { supabase } from '../config/supabase';

/**
 * Universal Campus Exam Proctor Bridge
 * Broadcasts across a global room ('exam_proctor_global') as well as test-specific channels
 * so faculty see ALL active campus candidates in one consolidated War Room!
 */

const activeChannels = {};

export const ExamProctorBridge = {
  /**
   * Called by Student (TestPortal) to broadcast live webcam frame, audio & status
   */
  joinStudentSession: (testId, studentInfo, onFacultyIntervention) => {
    if (!studentInfo?.email) return null;
    const globalChannelName = 'exam_proctor_global';

    let channel = activeChannels[globalChannelName];
    if (!channel) {
      channel = supabase.channel(globalChannelName, {
        config: { broadcast: { self: false } }
      });
      activeChannels[globalChannelName] = channel;
    }

    if (onFacultyIntervention) {
      channel.on('broadcast', { event: 'proctor_action' }, ({ payload }) => {
        if (!payload) return;
        const targetEmail = (payload.targetEmail || '').toLowerCase().trim();
        const myEmail = (studentInfo.email || '').toLowerCase().trim();
        if (targetEmail === myEmail || targetEmail === 'all') {
          onFacultyIntervention(payload);
        }
      });
    }

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channel.send({
          type: 'broadcast',
          event: 'candidate_online',
          payload: {
            email: (studentInfo.email || '').toLowerCase().trim(),
            name: studentInfo.name || 'Scholar',
            roll: studentInfo.roll || studentInfo.rollNumber || 'N/A',
            department: studentInfo.department || 'CSE',
            testId: testId || 'general',
            timestamp: Date.now()
          }
        }).catch(() => {});
      }
    });

    return {
      channel,
      sendLiveFrame: (data) => {
        if (channel && channel.state === 'joined') {
          channel.send({
            type: 'broadcast',
            event: 'candidate_frame',
            payload: {
              email: (studentInfo.email || '').toLowerCase().trim(),
              name: studentInfo.name || 'Scholar',
              roll: studentInfo.roll || studentInfo.rollNumber || 'N/A',
              department: studentInfo.department || studentInfo.branch || 'CSE',
              testId: testId || 'general',
              frame: data.frame,
              warnings: data.warnings || 0,
              trustScore: data.trustScore ?? 100,
              faceStatus: data.faceStatus || 'centered',
              audioDb: data.audioDb || 0,
              currentQuestion: data.currentQuestion ?? 0,
              totalQuestions: data.totalQuestions ?? 0,
              timestamp: Date.now()
            }
          }).catch(() => {});
        }
      },
      leaveSession: () => {
        if (channel) {
          channel.send({
            type: 'broadcast',
            event: 'candidate_offline',
            payload: {
              email: (studentInfo.email || '').toLowerCase().trim(),
              timestamp: Date.now()
            }
          }).catch(() => {});
        }
      }
    };
  },

  /**
   * Called by Faculty/Founder to subscribe to all candidate live feeds across campus
   */
  joinFacultyWarRoom: (testId, onCandidateFrame, onCandidateOffline, onCandidateOnline) => {
    const globalChannelName = 'exam_proctor_global';

    let channel = activeChannels[globalChannelName];
    if (!channel) {
      channel = supabase.channel(globalChannelName, {
        config: { broadcast: { self: false } }
      });
      activeChannels[globalChannelName] = channel;
    }

    channel.on('broadcast', { event: 'candidate_frame' }, ({ payload }) => {
      if (payload && onCandidateFrame) {
        onCandidateFrame(payload);
      }
    });

    channel.on('broadcast', { event: 'candidate_offline' }, ({ payload }) => {
      if (payload && onCandidateOffline) {
        onCandidateOffline(payload);
      }
    });

    channel.on('broadcast', { event: 'candidate_online' }, ({ payload }) => {
      if (payload && onCandidateOnline) {
        onCandidateOnline(payload);
      }
    });

    channel.subscribe();

    return {
      channel,
      sendIntervention: (targetEmail, action, message) => {
        if (channel && channel.state === 'joined') {
          return channel.send({
            type: 'broadcast',
            event: 'proctor_action',
            payload: {
              targetEmail: (targetEmail || '').toLowerCase().trim(),
              action,
              message: message || '',
              timestamp: Date.now()
            }
          });
        }
        return Promise.resolve();
      },
      leaveWarRoom: () => {
        // Keep channel alive for seamless toggling
      }
    };
  }
};
