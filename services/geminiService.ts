import { GoogleGenAI, Type } from "@google/genai";
import { OrderConfig } from '../types';

let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

const schema = {
    type: Type.OBJECT,
    description: "Suggested print settings based on user's request. All fields are optional.",
    properties: {
        paperSize: { type: Type.STRING, enum: ['A3', 'A4', 'A5'], description: "The paper size." },
        printQuality: { type: Type.STRING, enum: ['bw', 'color-b', 'color-c'], description: "The print quality. 'bw' for black and white, 'color-b' for standard color, 'color-c' for high quality full color." },
        sided: { type: Type.STRING, enum: ['single', 'double'], description: "Single or double-sided printing." },
        service: { type: Type.STRING, enum: ['none', 'simple', 'spring'], description: "Binding service. 'none' for no binding, 'simple' for simple binding, 'spring' for spring binding." },
    },
};

const systemInstruction = `You are an expert assistant for an online printing service.
Your task is to analyze the user's request and suggest the best print settings by returning a JSON object.
- Analyze the user's text to extract values for paperSize, printQuality, sided, and service.
- If a value is not mentioned, omit it from the JSON.
- For print quality: if user mentions "سیاه سفید" or "black and white", use "bw". If they mention "رنگی" or "color", infer "color-b" for simple color documents (like text with some charts) and "color-c" for documents with full-page images or photos. Default to "color-b" if unsure about color quality.
- For sided: if user mentions "پشت و رو", "دو رو" or "double-sided", use "double". Otherwise, assume "single".
- For service: if user mentions "صحافی", "فنر", "سیمی" or "spring", use "spring".
- Only return a valid JSON object matching the provided schema. Do not add any other text or explanations.`;


export async function getPrintSuggestion(prompt: string): Promise<Partial<OrderConfig>> {
    try {
        const genAI = getAIClient();
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User request: "${prompt}"`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonText = response.text.trim();
        const suggestion = JSON.parse(jsonText);
        
        console.log("AI Suggestion:", suggestion);
        return suggestion as Partial<OrderConfig>;

    } catch (error) {
        console.error("Error getting suggestion from Gemini:", error);
        throw new Error("Could not get a suggestion from the AI assistant.");
    }
}
