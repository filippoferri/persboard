import { OPENAI_MODELS } from '../../../config/openai-models';
import { requireFirebaseUser } from '../../../lib/apiAuth';
import { createUserProfile, generatePersonalizedContext, getPersonalizedCommunicationStyle } from '../../../utils/profileManager';
import { getOptimizedModelConfig } from '../../../utils/smartTokenManager';

const OPENING_SENTENCES = [
  'My advice is to',
  'Consider',
  'One strategy is',
  'To achieve your goals,',
  'I suggest',
  'When facing this challenge,',
  'From my experience,',
  'It may help to',
  'What worked for me is',
  'In your position, I would',
];

const MOTIVATIONAL_PHRASES = [
  'A mantra I live by is',
  'One thing that keeps me going is',
  'A quote that inspires me is',
  'A saying I often think of is',
  'Something I remind myself daily is',
  'A phrase that helps me push through tough times is',
  'A message I hold close is',
  'A thought that drives me forward is',
  'A maxim I believe in is',
  'An idea that motivates me is',
];

const ROLE_FOCUS_MAP = {
  CEO: 'strategic vision, leadership, and organizational growth',
  CTO: 'technology strategy, innovation, and technical implementation',
  CFO: 'financial planning, risk management, and resource allocation',
  CMO: 'market positioning, brand strategy, and customer engagement',
  CHRO: 'talent development, organizational culture, and team dynamics',
  COO: 'operational efficiency, process optimization, and execution',
  Mentor: 'personal development, career guidance, and skill building',
  Advisor: 'industry insights, networking, and strategic partnerships',
};

const stripCodeFence = (value) => String(value || '').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

const parseJson = (content) => {
  const cleaned = stripCodeFence(content);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');

    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }

    throw error;
  }
};

const asArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value) {
    return [];
  }

  return [value];
};

const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

const getModelConfig = ({ question = '', advisoryDirectors = [], requestType = 'medium', multipleOutputs = false, maxTokens }) => {
  const optimizedConfig = getOptimizedModelConfig({
    question,
    advisoryDirectors,
    requestType,
    multipleOutputs,
  });

  return {
    model: process.env.OPENAI_MODEL || OPENAI_MODELS.ECONOMICAL,
    temperature: optimizedConfig.temperature ?? 0,
    maxTokens: maxTokens || optimizedConfig.maxTokens || OPENAI_MODELS.LANGCHAIN_DEFAULT.maxTokens,
    topP: optimizedConfig.topP ?? 1,
  };
};

const callOpenAiJson = async ({ system, user, config }) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: `${system}\n\nRespond only with valid JSON.` },
        { role: 'user', content: user },
      ],
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      top_p: config.topP,
      response_format: { type: 'json_object' },
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenAI request failed');
  }

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenAI response did not include content');
  }

  return parseJson(content);
};

const getUserContext = (user = {}) => {
  const firstName = user.firstName || 'there';
  const myName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const userProfile = createUserProfile(user.myProfile);

  return {
    myName,
    userProfile,
    personalizedContext: generatePersonalizedContext(userProfile, myName),
  };
};

const generateDiscussion = async ({ advisoryDirectors = [], question = '', user = {} }) => {
  const { myName, userProfile, personalizedContext } = getUserContext(user);
  const config = getModelConfig({ question, advisoryDirectors, requestType: 'medium' });
  const responses = [];
  let previousAdvice = '';
  const coveredAspects = [];

  for (let index = 0; index < advisoryDirectors.length; index += 1) {
    const director = advisoryDirectors[index];
    const roleFocus = ROLE_FOCUS_MAP[director.role] || 'general business strategy';
    const openingSentence = getRandomItem(OPENING_SENTENCES);
    const motivationalPhrase = getRandomItem(MOTIVATIONAL_PHRASES);
    const communicationStyle = getPersonalizedCommunicationStyle(userProfile, {
      fullName: director.fullName,
      type: director.role,
      area: director.expertise,
    });
    const contextualGuidance = index === 0
      ? 'As the first advisor, provide foundational insights.'
      : `Previous advisors have covered: ${coveredAspects.join(', ')}. Build on their insights, focusing on ${roleFocus}.`;

    // eslint-disable-next-line no-await-in-loop
    const result = await callOpenAiJson({
      config,
      system: `You are ${director.fullName}, a ${director.role} with expertise in ${director.expertise}. You are part of ${myName}'s personal Board of Directors.

Personal Context: ${personalizedContext}
Your Unique Role Focus: ${roleFocus}
${contextualGuidance}

Instructions:
- Focus on ${roleFocus}.
- Provide specific, actionable advice from your ${director.role} perspective.
- Avoid repeating prior advice.
- Draw from your expertise in ${director.expertise}.
- Use an encouraging but professional tone.
- Start the advice with: "${openingSentence}".
- End with a motivational phrase starting with: "${motivationalPhrase}".
${communicationStyle}

Previous advice context: "${previousAdvice}"

Return JSON with keys: decisionMakingStrategy, quote.`,
      user: `Question: "${question}"`,
    });

    previousAdvice += ` ${result.decisionMakingStrategy || ''}`;
    coveredAspects.push(roleFocus);

    responses.push({
      director: director.fullName,
      fullName: director.fullName,
      role: director.role,
      decisionMakingStrategy: result.decisionMakingStrategy || '',
      quote: result.quote || '',
    });
  }

  return responses;
};

const generateAdvice = async (payload) => {
  const discussion = await generateDiscussion(payload);

  return discussion.map((item) => ({
    fullName: item.fullName,
    role: item.role,
    text: [item.decisionMakingStrategy, item.quote].filter(Boolean).join('\n\n'),
  }));
};

const generateTakeaways = async ({ discussion = '', user = {} }) => {
  const { myName, personalizedContext } = getUserContext(user);
  const config = getModelConfig({ question: discussion, requestType: 'medium', maxTokens: 500 });
  const result = await callOpenAiJson({
    config,
    system: `Extract the most important action items for ${myName}. Personal Context: ${personalizedContext}. Return JSON with key takeaways as an array of 3-5 short actionable strings.`,
    user: `Discussion: "${discussion}"`,
  });

  return asArray(result.takeaways).map((text, index) => ({
    number: index + 1,
    text,
  }));
};

const generateScenarios = async ({ discussion = '', user = {} }) => {
  const { myName, personalizedContext } = getUserContext(user);
  const config = getModelConfig({ question: discussion, requestType: 'medium', maxTokens: 600 });
  const result = await callOpenAiJson({
    config,
    system: `Create best-case and worst-case scenarios for ${myName}. Personal Context: ${personalizedContext}. Return JSON with keys bestcase and worstcase.`,
    user: `Advice: "${discussion}"`,
  });

  return [
    { number: 1, title: 'Best-Case', text: result.bestcase || '' },
    { number: 2, title: 'Worst-Case', text: result.worstcase || '' },
  ];
};

const generateConsolidated = async (payload) => {
  const takeaways = await generateTakeaways(payload);
  const scenarios = await generateScenarios(payload);

  return {
    takeaways,
    scenarios,
  };
};

const generatePlusMinus = async ({ discussion = '' }) => {
  const config = getModelConfig({ question: discussion, requestType: 'medium', maxTokens: 500 });
  const result = await callOpenAiJson({
    config,
    system: 'As a director on a personal board, provide pluses and minuses for the given advice. Return JSON with keys plus and minus, both arrays of four concise strings.',
    user: `Advice: "${discussion}"`,
  });

  return [
    { number: 1, icon: 'plus', text: asArray(result.plus) },
    { number: 2, icon: 'minus', text: asArray(result.minus) },
  ];
};

const generateRationalConclusion = async ({ discussion = '' }) => {
  const config = getModelConfig({ question: discussion, requestType: 'medium', maxTokens: 300 });

  return callOpenAiJson({
    config,
    system: 'Provide a rational conclusion based on the advice. Return JSON with keys title and desc.',
    user: `Advice: "${discussion}"`,
  });
};

const generateSwot = async ({ discussion = '' }) => {
  const config = getModelConfig({ question: discussion, requestType: 'complex', maxTokens: 700 });
  const result = await callOpenAiJson({
    config,
    system: 'Provide a SWOT analysis. Return JSON with keys strengths, weaknesses, opportunities, threats, each an array of three concise strings.',
    user: `Advice: "${discussion}"`,
  });

  return [
    { title: 'Strengths', text: asArray(result.strengths), icon: 'diagonal-arrow-right-up' },
    { title: 'Weaknesses', text: asArray(result.weaknesses), icon: 'diagonal-arrow-right-down' },
    { title: 'Opportunities', text: asArray(result.opportunities), icon: 'radio-button-on' },
    { title: 'Threats', text: asArray(result.threats), icon: 'checkmark' },
  ];
};

const generateSoar = async ({ discussion = '' }) => {
  const config = getModelConfig({ question: discussion, requestType: 'complex', maxTokens: 700 });
  const result = await callOpenAiJson({
    config,
    system: 'Provide a SOAR analysis. Return JSON with keys strengths, opportunities, aspirations, results, each an array of three concise strings.',
    user: `Advice: "${discussion}"`,
  });

  return [
    { title: 'S - Inquiry Into Strengths', text: asArray(result.strengths), icon: 'checkmark-square' },
    { title: 'O - Imagine The Opportunities', text: asArray(result.opportunities), icon: 'checkmark-square' },
    { title: 'A - Innovate To Meet Aspirations', text: asArray(result.aspirations), icon: 'checkmark-square' },
    { title: 'R - Inspire To Achieve Results', text: asArray(result.results), icon: 'checkmark-square' },
  ];
};

const generateTroubleshoot = async ({ discussion = '' }) => {
  const config = getModelConfig({ question: discussion, requestType: 'medium', maxTokens: 500 });
  const result = await callOpenAiJson({
    config,
    system: 'Identify up to ten barriers to success from the given advice. Return JSON with key troubleshoot as an array of strings.',
    user: `Discussion: "${discussion}"`,
  });

  return asArray(result.troubleshoot).map((text, index) => ({
    number: index + 1,
    text,
  }));
};

const generatePestel = async ({ discussion = '' }) => {
  const config = getModelConfig({ question: discussion, requestType: 'complex', maxTokens: 800 });
  const result = await callOpenAiJson({
    config,
    system: 'Provide a PESTEL analysis. Return JSON with keys political, economic, sociocultural, technological, environmental, legal, each an array of three concise strings.',
    user: `Advice: "${discussion}"`,
  });

  return [
    { title: 'Political', text: asArray(result.political), icon: 'checkmark-square' },
    { title: 'Economic', text: asArray(result.economic), icon: 'checkmark-square' },
    { title: 'Sociocultural', text: asArray(result.sociocultural), icon: 'checkmark-square' },
    { title: 'Technological', text: asArray(result.technological), icon: 'checkmark-square' },
    { title: 'Environmental', text: asArray(result.environmental), icon: 'checkmark-square' },
    { title: 'Legal', text: asArray(result.legal), icon: 'checkmark-square' },
  ];
};

const handlers = {
  advice: generateAdvice,
  discussion: generateDiscussion,
  consolidated: generateConsolidated,
  takeaways: generateTakeaways,
  scenarios: generateScenarios,
  plusMinus: generatePlusMinus,
  rationalConclusion: generateRationalConclusion,
  swot: generateSwot,
  soar: generateSoar,
  troubleshoot: generateTroubleshoot,
  pestel: generatePestel,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { action, ...payload } = req.body || {};
  const actionHandler = handlers[action];

  if (!actionHandler) {
    res.status(400).json({ message: 'Unsupported boardroom AI action' });
    return;
  }

  try {
    await requireFirebaseUser(req);
    const result = await actionHandler(payload);
    res.status(200).json({ result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Boardroom AI request failed' });
  }
}
