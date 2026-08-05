import fs from 'fs';
import path from 'path';

async function listModels() {
  try {
    const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
    const match = envContent.match(/VITE_GROQ_API_KEY\s*=\s*([^\r\n]*)/);
    const apiKey = match ? match[1].trim() : '';

    if (!apiKey) {
      console.error("VITE_GROQ_API_KEY is missing in .env!");
      return;
    }

    console.log("Listing active Groq models...");
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });

    const data = await response.json();
    console.log("Models:");
    data.data.forEach(m => {
      console.log(`- ${m.id} (${m.object})`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

listModels();
