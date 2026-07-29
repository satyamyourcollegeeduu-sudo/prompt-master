export interface ParsedP10Sections {
  rawMarkdown: string;
  executiveSummary: string;
  userGoal: string;
  assumptions: string[];
  optimizedPrompt: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  recommendedAiModel: string;
  techStack: string;
  uiUxSuggestions: string;
  securityRecommendations: string[];
  performanceOptimization: string;
  testingChecklist: string[];
  risks: string[];
  bestPractices: string[];
  beginnerVersion: string;
  professionalVersion: string;
  enterpriseVersion: string;
  finalCopyPastePrompt: string;
  variables: string[];

  // Aliases for backward compatibility
  userIntent?: string;
  objectives?: string;
  deliverables?: string[];
  architectureRecommendations?: string;
  uiUxRecommendations?: string;
  technicalStack?: string;
  securityChecklist?: string[];
  accessibilityChecklist?: string[];
  performanceChecklist?: string;
  testingPlan?: string[];
  deploymentPlan?: string;
  documentationPlan?: string;
  maintenanceStrategy?: string;
  risksAndMitigations?: string[];
  optimizationSuggestions?: string[];
  architecture?: string;
  uiUxGuidelines?: string;
  testingStrategy?: string[];
  deploymentStrategy?: string;
  optimizationTips?: string[];
  privacyConsiderations?: string;
}

// Type aliases for backward compatibility
export type ParsedP9Sections = ParsedP10Sections;
export type ParsedP8Sections = ParsedP10Sections;
export type ParsedP7Sections = ParsedP10Sections;

export function parsePromptMarkdown(rawMarkdown: string): ParsedP10Sections {
  let executiveSummary = '';
  let userGoal = '';
  const assumptions: string[] = [];
  let optimizedPrompt = '';
  const functionalRequirements: string[] = [];
  const nonFunctionalRequirements: string[] = [];
  let recommendedAiModel = '';
  let techStack = '';
  let uiUxSuggestions = '';
  const securityRecommendations: string[] = [];
  let performanceOptimization = '';
  const testingChecklist: string[] = [];
  const risks: string[] = [];
  const bestPractices: string[] = [];
  let beginnerVersion = '';
  let professionalVersion = '';
  let enterpriseVersion = '';
  let finalCopyPastePrompt = '';

  // Secondary/compatibility buffers
  let userIntent = '';
  let objectives = '';
  const deliverables: string[] = [];
  let architectureRecommendations = '';
  let uiUxRecommendations = '';
  let technicalStack = '';
  const securityChecklist: string[] = [];
  const accessibilityChecklist: string[] = [];
  let performanceChecklist = '';
  const testingPlan: string[] = [];
  let deploymentPlan = '';
  let documentationPlan = '';
  let maintenanceStrategy = '';

  if (!rawMarkdown) {
    return {
      rawMarkdown: '',
      executiveSummary: '',
      userGoal: '',
      assumptions: [],
      optimizedPrompt: '',
      functionalRequirements: [],
      nonFunctionalRequirements: [],
      recommendedAiModel: '',
      techStack: '',
      uiUxSuggestions: '',
      securityRecommendations: [],
      performanceOptimization: '',
      testingChecklist: [],
      risks: [],
      bestPractices: [],
      beginnerVersion: '',
      professionalVersion: '',
      enterpriseVersion: '',
      finalCopyPastePrompt: '',
      variables: [],
    };
  }

  // Split markdown by top-level section headings (# Section)
  const rawSections = rawMarkdown.split(/(?=^#\s+)/m);

  const parseListItems = (text: string): string[] => {
    const list: string[] = [];
    text.split('\n').forEach((line) => {
      const clean = line.replace(/^[\s*\-•\d.]+\s*/, '').trim();
      if (clean.length > 0) list.push(clean);
    });
    return list;
  };

  const parseCodeOrText = (trimmed: string): string => {
    const codeMatch = trimmed.match(/```(?:markdown|prompt|text)?\n?([\s\S]*?)```/i);
    if (codeMatch && codeMatch[1]) {
      return codeMatch[1].trim();
    }
    return trimmed.replace(/^#+\s+.*$/m, '').trim();
  };

  rawSections.forEach((sec) => {
    const trimmed = sec.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();

    // 1. Executive Summary
    if (lower.startsWith('# executive summary')) {
      executiveSummary = trimmed.replace(/^#+\s+.*$/m, '').trim();
    }
    // 2. User Goal (or User Intent)
    else if (lower.startsWith('# user goal') || lower.startsWith('# user intent')) {
      userGoal = trimmed.replace(/^#+\s+.*$/m, '').trim();
      userIntent = userGoal;
    }
    // Objectives (compat)
    else if (lower.startsWith('# objectives') || lower.startsWith('# objective')) {
      objectives = trimmed.replace(/^#+\s+.*$/m, '').trim();
    }
    // 3. Assumptions
    else if (lower.startsWith('# assumptions')) {
      const text = trimmed.replace(/^#+\s+.*$/m, '').trim();
      assumptions.push(...parseListItems(text));
    }
    // 4. Optimized Prompt
    else if (lower.startsWith('# optimized prompt') || (lower.startsWith('# final optimized prompt') && !finalCopyPastePrompt)) {
      optimizedPrompt = parseCodeOrText(trimmed);
    }
    // Deliverables (compat)
    else if (lower.startsWith('# deliverables')) {
      const text = trimmed.replace(/^#+\s+.*$/m, '').trim();
      deliverables.push(...parseListItems(text));
    }
    // 5. Functional Requirements
    else if (lower.startsWith('# functional requirements') || lower.startsWith('# features')) {
      const text = trimmed.replace(/^#+\s+.*$/m, '').trim();
      functionalRequirements.push(...parseListItems(text));
    }
    // 6. Non-Functional Requirements
    else if (lower.startsWith('# non-functional requirements')) {
      const text = trimmed.replace(/^#+\s+.*$/m, '').trim();
      nonFunctionalRequirements.push(...parseListItems(text));
    }
    // 7. Recommended AI Model
    else if (lower.startsWith('# recommended ai model') || lower.startsWith('# ai model')) {
      recommendedAiModel = trimmed.replace(/^#+\s+.*$/m, '').trim();
    }
    // 8. Tech Stack (if applicable) / Technical Stack / Architecture
    else if (lower.startsWith('# tech stack') || lower.startsWith('# technical stack') || lower.startsWith('# technical recommendations')) {
      techStack = trimmed.replace(/^#+\s+.*$/m, '').trim();
      technicalStack = techStack;
    }
    else if (lower.startsWith('# architecture recommendations') || lower.startsWith('# architecture')) {
      architectureRecommendations = trimmed.replace(/^#+\s+.*$/m, '').trim();
    }
    // 9. UI/UX Suggestions / UI/UX Recommendations
    else if (lower.startsWith('# ui/ux suggestions') || lower.startsWith('# ui/ux recommendations') || lower.startsWith('# ui/ux guidelines')) {
      uiUxSuggestions = trimmed.replace(/^#+\s+.*$/m, '').trim();
      uiUxRecommendations = uiUxSuggestions;
    }
    // 10. Security Recommendations / Security Checklist
    else if (lower.startsWith('# security recommendations') || lower.startsWith('# security checklist')) {
      const text = trimmed.replace(/^#+\s+.*$/m, '').trim();
      const list = parseListItems(text);
      if (list.length > 0) {
        securityRecommendations.push(...list);
        securityChecklist.push(...list);
      } else {
        const fullText = trimmed.replace(/^#+\s+.*$/m, '').trim();
        securityRecommendations.push(fullText);
        securityChecklist.push(fullText);
      }
    }
    // Accessibility (compat)
    else if (lower.startsWith('# accessibility checklist') || lower.startsWith('# accessibility')) {
      const text = trimmed.replace(/^#+\s+.*$/m, '').trim();
      accessibilityChecklist.push(...parseListItems(text));
    }
    // 11. Performance Optimization / Performance Checklist
    else if (lower.startsWith('# performance optimization') || lower.startsWith('# performance checklist') || lower.startsWith('# performance recommendations')) {
      performanceOptimization = trimmed.replace(/^#+\s+.*$/m, '').trim();
      performanceChecklist = performanceOptimization;
    }
    // 12. Testing Checklist / Testing Plan
    else if (lower.startsWith('# testing checklist') || lower.startsWith('# testing plan') || lower.startsWith('# testing strategy')) {
      const text = trimmed.replace(/^#+\s+.*$/m, '').trim();
      testingChecklist.push(...parseListItems(text));
      testingPlan.push(...parseListItems(text));
    }
    // Deployment / Documentation / Maintenance (compat)
    else if (lower.startsWith('# deployment plan') || lower.startsWith('# deployment strategy')) {
      deploymentPlan = trimmed.replace(/^#+\s+.*$/m, '').trim();
    }
    else if (lower.startsWith('# documentation plan') || lower.startsWith('# documentation')) {
      documentationPlan = trimmed.replace(/^#+\s+.*$/m, '').trim();
    }
    else if (lower.startsWith('# maintenance strategy') || lower.startsWith('# maintenance')) {
      maintenanceStrategy = trimmed.replace(/^#+\s+.*$/m, '').trim();
    }
    // 13. Risks / Risks & Mitigations
    else if (lower.startsWith('# risks') || lower.startsWith('# possible risks')) {
      const text = trimmed.replace(/^#+\s+.*$/m, '').trim();
      risks.push(...parseListItems(text));
    }
    // 14. Best Practices / Optimization Suggestions
    else if (lower.startsWith('# best practices') || lower.startsWith('# optimization suggestions') || lower.startsWith('# optimization tips')) {
      const text = trimmed.replace(/^#+\s+.*$/m, '').trim();
      bestPractices.push(...parseListItems(text));
    }
    // 15. Beginner Version
    else if (lower.startsWith('# beginner version') || lower.startsWith('# beginner prompt')) {
      beginnerVersion = parseCodeOrText(trimmed);
    }
    // 16. Professional Version
    else if (lower.startsWith('# professional version') || lower.startsWith('# professional prompt')) {
      professionalVersion = parseCodeOrText(trimmed);
    }
    // 17. Enterprise Version
    else if (lower.startsWith('# enterprise version') || lower.startsWith('# enterprise prompt')) {
      enterpriseVersion = parseCodeOrText(trimmed);
    }
    // 18. Final Copy-Paste Prompt
    else if (lower.startsWith('# final copy-paste prompt') || lower.startsWith('# final version')) {
      finalCopyPastePrompt = parseCodeOrText(trimmed);
    }
  });

  // Fallbacks
  if (!optimizedPrompt) {
    const codeBlocks = [...rawMarkdown.matchAll(/```(?:markdown|prompt|text)?\n?([\s\S]*?)```/gi)];
    if (codeBlocks.length > 0) {
      optimizedPrompt = codeBlocks[0][1].trim();
    } else {
      optimizedPrompt = rawMarkdown;
    }
  }

  if (!finalCopyPastePrompt) {
    finalCopyPastePrompt = optimizedPrompt;
  }

  // Extract variables like [Target Audience], [Tech Stack]
  const targetForVars = finalCopyPastePrompt || optimizedPrompt;
  const varMatches = [...targetForVars.matchAll(/\[([A-Za-z0-9_\s\-]{2,30})\]/g)];
  const variablesSet = new Set<string>();
  varMatches.forEach((m) => {
    if (m[1]) {
      const varName = m[1].trim();
      if (
        !varName.startsWith('http') &&
        !/^\d+$/.test(varName) &&
        !['markdown', 'role', 'context', 'task', 'constraints', 'output', 'format', 'beginner', 'professional', 'expert', 'enterprise'].includes(varName.toLowerCase())
      ) {
        variablesSet.add(varName);
      }
    }
  });

  const parsedObject: ParsedP10Sections = {
    rawMarkdown,
    executiveSummary: executiveSummary || 'Executive prompt architecture blueprint generated under P10 Omega Engine standards.',
    userGoal: userGoal || 'Analyze user concept, core goal, target audience, and success criteria.',
    assumptions: assumptions.length > 0 ? assumptions : ['Standard operational and platform assumptions applied.'],
    optimizedPrompt,
    functionalRequirements,
    nonFunctionalRequirements,
    recommendedAiModel: recommendedAiModel || 'Gemini 3.6 Flash / Claude 3.5 Sonnet / GPT-4o optimized for tasks.',
    techStack: techStack || technicalStack || 'N/A - Non-Technical Task',
    uiUxSuggestions: uiUxSuggestions || uiUxRecommendations || 'N/A - Non-UI Task',
    securityRecommendations: securityRecommendations.length > 0 ? securityRecommendations : ['Standard security, input sanitization, and access guardrails applied.'],
    performanceOptimization: performanceOptimization || performanceChecklist || 'Resource efficiency, token density, and speed benchmarks.',
    testingChecklist: testingChecklist.length > 0 ? testingChecklist : ['Verify response accuracy, structure compliance, and edge-case handling.'],
    risks: risks.length > 0 ? risks : ['Identify potential failure modes, model hallucination risks, and apply mitigations.'],
    bestPractices: bestPractices.length > 0 ? bestPractices : ['Use system prompt priming, structured output formatting, and context constraints.'],
    beginnerVersion,
    professionalVersion,
    enterpriseVersion,
    finalCopyPastePrompt,
    variables: Array.from(variablesSet),

    // Backward compatibility aliases
    userIntent: userGoal,
    objectives: 'Achieve user goal with zero ambiguity and maximum accuracy.',
    deliverables: ['Production-ready prompt specification', 'Prompt variations', 'Security & quality controls'],
    architectureRecommendations: techStack || architectureRecommendations || 'N/A',
    uiUxRecommendations: uiUxSuggestions,
    technicalStack: techStack,
    securityChecklist: securityRecommendations,
    accessibilityChecklist: ['WCAG 2.1 AA/AAA compliance rules and keyboard accessibility.'],
    performanceChecklist: performanceOptimization,
    testingPlan: testingChecklist,
    deploymentPlan: deploymentPlan || 'Deployment readiness verification and container configuration.',
    documentationPlan: documentationPlan || 'User instructions and prompt documentation.',
    maintenanceStrategy: maintenanceStrategy || 'Long-term maintenance and prompt updates.',
    risksAndMitigations: risks,
    optimizationSuggestions: bestPractices,
    architecture: techStack || architectureRecommendations || 'N/A',
    uiUxGuidelines: uiUxSuggestions,
    testingStrategy: testingChecklist,
    deploymentStrategy: deploymentPlan || 'Deployment readiness',
    optimizationTips: bestPractices,
    privacyConsiderations: 'Data privacy and security controls.',
  };

  return parsedObject;
}
