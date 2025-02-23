
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-thinking-exp-01-21",
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
  }
});

export const analyzeImage = async (imageFile: File, acquisitionCost: number) => {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const chatSession = model.startChat();
    // Convert image file to proper format for Gemini
    const imageData = await imageFile.arrayBuffer();
    
    // Send image and acquisition cost to Gemini
    const result = await chatSession.sendMessage([
      { text: `Analyze this image with acquisition cost: $${acquisitionCost}` },
      {
        inlineData: {
          mimeType: imageFile.type,
          data: Buffer.from(imageData).toString('base64')
        }
      }
    ]);

    // Parse the response and extract pricing information
    const response = result.response.text();
    // TODO: Parse the response text to extract the pricing options
    // For now, return mock data
    return {
      options: [
        {
          type: 'Low',
          sellingPrice: 25.00,
          fees: 3.25,
          profit: 11.75,
          roi: 112.5,
        },
        {
          type: 'Medium',
          sellingPrice: 45.00,
          fees: 5.85,
          profit: 29.15,
          roi: 278.6,
        },
        {
          type: 'High',
          sellingPrice: 75.00,
          fees: 9.75,
          profit: 55.25,
          roi: 527.4,
        },
      ],
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};
