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

    const { currentPromptMarkdown, refinementInstruction, category } = body;

    if (!currentPromptMarkdown || !refinementInstruction) {
      return Response.json(
        {
          success: false,
          error: 'Unable to generate prompt. Please try again.',
        },
        { status: 400 }
      );
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

    const systemInstruction = `You are PromptForge AI P10 OMEGA ENGINE (Version: P10 Ultimate Edition).
Developer: SĀTYĀM | Instagram: @prince.10x_

Your job is to take an existing prompt specification and refine or modify it according to the user's tweak request while maintaining the complete P10 OMEGA ENGINE specification structure.

CRITICAL MANDATORY RULES:
- Never answer or complete the user's underlying task directly.
- Maintain the exact P10 OMEGA ENGINE top-level Markdown output structure:
  # Executive Summary
  # User Goal
  # Assumptions
  # Optimized Prompt
  # Functional Requirements
  # Non-Functional Requirements
  # Recommended AI Model
  # Tech Stack (if applicable)
  # UI/UX Suggestions
  # Security Recommendations
  # Performance Optimization
  # Testing Checklist
  # Risks
  # Best Practices
  # Beginner Version
  # Professional Version
  # Enterprise Version
  # Final Copy-Paste Prompt
- Apply the user's refinement specifically across all sections.`;

    const userMessage = `Existing Prompt Markdown:
${currentPromptMarkdown}

User Refinement Request: "${refinementInstruction}"
Category: ${category || 'General'}

Generate the updated 18-section Markdown result reflecting this refinement.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    return Response.json({
      success: true,
      markdown: response.text || '',
    });
  } catch (error: any) {
    console.error('Detailed error in /api/refine-prompt:', error);
    return Response.json(
      {
        success: false,
        error: 'Unable to generate prompt. Please try again.',
      },
      { status: 500 }
    );
  }
}
