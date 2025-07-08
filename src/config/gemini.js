
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyA2s_kxGE-OH7-zaoVihGUBuhNqY1avZYA",
});

async function main(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      maxOutputTokens: 500,
      temperature: 0.1,
    },
  });

  console.log(response.text);
  return response.text;
}

export default main;
