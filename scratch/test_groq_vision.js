import fs from 'fs';
import path from 'path';

async function testGroqVision() {
  try {
    const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
    const match = envContent.match(/VITE_GROQ_API_KEY\s*=\s*([^\r\n]*)/);
    const apiKey = match ? match[1].trim() : '';

    if (!apiKey) {
      console.error("VITE_GROQ_API_KEY is missing in .env!");
      return;
    }

    const imagePath = path.join(process.cwd(), 'nexora_logo.jpg');
    if (!fs.existsSync(imagePath)) {
      console.error("nexora_logo.jpg does not exist in workspace!");
      return;
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

    console.log("Image size (base64 length):", base64Image.length);

    const systemPrompt = `You are a secure biometric facial verification assistant. You must respond with a JSON object containing the comparison results.`;

    console.log("Sending request to Groq Vision...");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-27b",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Compare these two face images. Image 1 is the registered student reference. Image 2 is the newly captured login attempt.

Analyze their facial features (eyes, nose, mouth shape, jawline, and overall structure) to determine if they show the exact same person.
Ignore variations in lighting, background, camera angle, and facial expression. Focus purely on whether it is the same individual.

Return a JSON object with three keys:
1. "match": set to true if they are the same person, or false if they are different people or one of them is not a face.
2. "confidence": a number from 0 to 100 representing your confidence level.
3. "reason": a single sentence explaining the outcome.

Do not write anything else. Do not add markdown code block formatting.`
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image
                }
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    console.log("HTTP Status:", response.status);
    const text = await response.text();
    console.log("Response text:", text);
  } catch (err) {
    console.error("Execution error:", err);
  }
}

testGroqVision();
