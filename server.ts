import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client server-side
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoint 1: Generate Optimized Prompt
app.post('/api/generate-prompt', async (req, res) => {
  try {
    const { idea, category, targetModel, tone, complexity, customConstraints } = req.body;

    if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a valid idea or topic.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are PromptForge AI P10 OMEGA ENGINE (Version: P10 Ultimate Edition).
Developer: SÃTYÃM
Official Instagram: @prince.10x_

YOUR SYSTEM ROLE & MISSION:
You are PromptForge AI P10 OMEGA ENGINE, created by SÃTYÃM (@prince.10x_). Your mission is to convert every user idea into the highest-quality professional AI prompt possible.
Never generate low-quality prompts.
Never ignore user intent.
Always optimize for clarity, accuracy, creativity, and usefulness.

CORE OBJECTIVES:
• Understand user intent.
• Detect missing information.
• Improve prompt quality.
• Keep the original meaning.
• Create production-ready prompts.
• Generate copy-paste-ready output.

WORKFLOW:
1. Analyze the user's request.
2. Detect missing information.
3. Make reasonable assumptions if needed.
4. Build a complete optimized prompt.
5. Improve the prompt before returning it.

OUTPUT FORMAT REQUIREMENTS:
Your response MUST be in clear Markdown and MUST contain EXACTLY these top-level headings in this strict order:

# Executive Summary
High-level summary of the prompt architecture and enhancement strategy.

# User Goal
Clear analysis of user intent, core goal, target audience, and success criteria.

# Assumptions
Key intelligent assumptions made regarding missing details, constraints, defaults, or environment.

# Optimized Prompt
The main complete, production-ready prompt inside a single markdown code block (\`\`\`markdown ... \`\`\`). Include role definition, objectives, context, constraints, output structure, and bracketed variables (e.g. \`[Target Audience]\`, \`[Tech Stack]\`).

# Functional Requirements
Bulleted list of core functional capabilities, features, and operational logic required.

# Non-Functional Requirements
Reliability, maintainability, scalability, quality standards, and performance benchmarks.

# Recommended AI Model
Recommended AI model (e.g., Gemini 3.6 Flash, Claude 3.5 Sonnet, GPT-4o, DeepSeek R1) with reasoning for selection based on task needs.

# Tech Stack (if applicable)
Recommended technologies, frameworks, libraries, APIs, and database solutions (or "N/A - Non-Technical Task").

# UI/UX Suggestions
Design guidelines, layout recommendations, user flows, and interaction patterns (or "N/A - Non-UI Task").

# Security Recommendations
Authentication, input validation, rate limiting, data privacy, and security guardrails.

# Performance Optimization
Resource efficiency, token density, latency benchmarks, caching, and execution speed.

# Testing Checklist
Comprehensive testing checklist including unit, integration, edge-case, and functional verification.

# Risks
Potential failure modes, edge cases, hallucination risks, and mitigation strategies.

# Best Practices
Pro tips, best practices, prompt priming, and context optimization guidelines.

# Beginner Version
A simple, direct, beginner-friendly version of the prompt inside a single markdown code block (\`\`\`markdown ... \`\`\`).

# Professional Version
A balanced, feature-rich professional version of the prompt inside a single markdown code block (\`\`\`markdown ... \`\`\`).

# Enterprise Version
An enterprise-grade, highly constrained version with strict validation and edge-case guards inside a single markdown code block (\`\`\`markdown ... \`\`\`).

# Final Copy-Paste Prompt
The ultimate, complete, zero-friction copy-paste-ready prompt inside a single markdown code block (\`\`\`markdown ... \`\`\`).

SUPPORTED CATEGORIES:
AI, Flutter, Android, Websites, React, HTML, CSS, JavaScript, Python, Firebase, APIs, AI Agents, Automation, Writing, Marketing, Business, Research, Education, Image Generation, Video Generation.

QUALITY CHECK:
Verify that the prompt is: Clear, Accurate, Complete, Practical, Structured, Production Ready.
If improvements are possible, refine automatically before presenting the final result.

CREDITS:
Developer: SÃTYÃM | Instagram: @prince.10x_ | PromptForge AI – P10 OMEGA ENGINE

DOMAIN & METADATA CONTEXT:
- Category: ${category || 'Auto-Detect'}
- Target Model Preference: ${targetModel || 'Auto-Select'}
- Tone: ${tone || 'Professional'}
- Complexity: ${complexity || 'Detailed'}
- Custom Constraints: ${customConstraints || 'None'}`;

    const userContent = `User Raw Idea/Topic: "${idea.trim()}"

Please transform this idea into an optimized professional prompt according to all the mandatory PromptForge AI rules above.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userContent,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const markdownOutput = response.text || '';

    return res.json({
      markdown: markdownOutput,
      category: category || 'Auto-Detect',
      originalIdea: idea,
    });
  } catch (error: any) {
    console.error('Error generating prompt:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate prompt. Please check your API configuration or try again.',
    });
  }
});

// API Endpoint 2: Refine / Polish Prompt
app.post('/api/refine-prompt', async (req, res) => {
  try {
    const { currentPromptMarkdown, refinementInstruction, category } = req.body;

    if (!currentPromptMarkdown || !refinementInstruction) {
      return res.status(400).json({ error: 'Missing current prompt or refinement instruction.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are PromptForge AI P10 OMEGA ENGINE (Version: P10 Ultimate Edition).
Developer: SÃTYÃM | Instagram: @prince.10x_

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

    return res.json({
      markdown: response.text || '',
    });
  } catch (error: any) {
    console.error('Error refining prompt:', error);
    return res.status(500).json({ error: error.message || 'Failed to refine prompt.' });
  }
});

// API Endpoint 3: Test Prompt in AI Sandbox
app.post('/api/test-prompt', async (req, res) => {
  try {
    const { promptText, variables } = req.body;

    if (!promptText || typeof promptText !== 'string') {
      return res.status(400).json({ error: 'Please provide prompt text to test.' });
    }

    // Fill variables if provided
    let finalPrompt = promptText;
    if (variables && typeof variables === 'object') {
      Object.entries(variables).forEach(([key, val]) => {
        if (typeof val === 'string' && val.trim().length > 0) {
          const regex = new RegExp(`\\[${key}\\]|\\[${key.replace(/\s+/g, '_')}\\]`, 'gi');
          finalPrompt = finalPrompt.replace(regex, val);
        }
      });
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: finalPrompt,
    });

    return res.json({
      testResult: response.text || '',
      executedPrompt: finalPrompt,
    });
  } catch (error: any) {
    console.error('Error testing prompt:', error);
    return res.status(500).json({ error: error.message || 'Failed to execute test prompt.' });
  }
});

// Start Express & Vite setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PromptForge AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
