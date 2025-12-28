// services/Ai_Service.ts
// Fixed: Using correct Gemini model name
// Google Gemini AI integration for product analysis

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProductInfo } from '../types/ProductInfo';

// Get your free API key from: https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = 'AIzaSyB5N_4ymVnKBRPXsD1LGPSFHnot5MpXEsE';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// services/Ai_Service.ts
// Unified Gemini AI service (TEXT + IMAGE supported)









// ⚠️ Move to ENV later



export async function Ai_Service(
  input: string,
  type: 'text' | 'image' = 'text'
): Promise<ProductInfo> {
  try {
    console.log(`🤖 Gemini called in ${type.toUpperCase()} mode`);

    // ✅ SELECT CORRECT MODEL
    const model = genAI.getGenerativeModel({
      model: type === 'image' ? 'gemini-pro-vision' : 'gemini-pro',
    });

    const basePrompt = `
You are an agricultural expert helping grape and other farmers in Karnataka, India.

Respond ONLY with valid JSON.
No markdown.
No explanation.

Exmpale JSON format in kannada languag eonly:
{
  "productName": "",
  "productNameKn": "",
  "type": "",
  "typeKn": "",
  "benefits": [],
  "benefitsKn": [],
  "usage": "",
  "usageKn": "",
  "dosage": "",
  "dosageKn": "",
  "timing": "",
  "timingKn": "",
  "safety": [],
  "safetyKn": [],
  "sprayWeather": "",
  "sprayWeatherKn": ""
}
`;

    let result: Awaited<ReturnType<typeof model.generateContent>> | undefined;

    // 🧪 TEXT MODE
    if (type === 'text') {
      const prompt = `
${basePrompt}

Product name:
"${input}"

If exact details are unknown, give best practical agricultural guidance.
`;
      result = await model.generateContent(prompt);
    }

    // 📷 IMAGE MODE
    if (type === 'image') {
      const imagePart = {
        inlineData: {
          data: input,
          mimeType: 'image/jpeg',
        },
      };

      result = await model.generateContent([basePrompt, imagePart]);
    }

    if (!result || !result.response) {
      throw new Error('No response received from AI model');
    }
    const response = result.response;
    let text = response.text();

    console.log('📥 Raw response:', text.slice(0, 200));

    // Clean markdown if any
    text = text.replace(/```json|```/g, '').trim();

    const parsed: ProductInfo = JSON.parse(text);

    if (!parsed.productName || !parsed.productNameKn) {
      throw new Error('Invalid AI response');
    }

    console.log('✅ Gemini success:', parsed.productName);
    return parsed;
  } catch (error: any) {
    console.error('❌ Gemini AI Error:', error);

    if (error.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key');
    }

    if (error.message?.includes('quota')) {
      throw new Error('Gemini free quota exceeded');
    }

    if (error instanceof SyntaxError) {
      throw new Error('AI returned invalid JSON');
    }

    throw new Error('Failed to analyze product. Please retry.');
  }
}
