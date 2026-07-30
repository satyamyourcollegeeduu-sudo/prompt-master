import { GoogleGenAI } from '@google/genai';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return Response.json(
      {
        success: false,
        error: 'Unable to generate prompt. Please try again.',
      },
      { status: 405 }
    );
  }

  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { promptText, variables } = body;

    if (!promptText || typeof promptText !== 'string') {
      return Response.json(
        {
          success: false,
          error: 'Unable to generate prompt. Please try again.',
        },
        { status: 400 }
      );
    }

    let finalPrompt = promptText;
    if (variables && typeof variables === 'object') {
      Object.entries(variables).forEach(([key, val]) => {
        if (typeof val === 'string' && val.trim().length > 0) {
          const regex = new RegExp(`\\[${key}\\]|\\[${key.replace(/\s+/g, '_')}\\]`, 'gi');
          finalPrompt = finalPrompt.replace(regex, val);
        }
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY environment variable is missing.');
      return Response.json(
        {
          success: false,
          error: 'Unable to generate prompt. Please try again.',
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: finalPrompt,
    });

    return Response.json({
      success: true,
      testResult: response.text || '',
      executedPrompt: finalPrompt,
    });
  } catch (error: any) {
    console.error('Detailed error in /api/test-prompt:', error);
    return Response.json(
      {
        success: false,
        error: 'Unable to generate prompt. Please try again.',
      },
      { status: 500 }
    );
  }
}
