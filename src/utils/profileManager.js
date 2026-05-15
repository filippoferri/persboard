/**
 * Profile Manager - Gestisce i profili utente e personalizza i prompt
 * Integra le informazioni del survey iniziale per creare prompt più efficaci
 */

// Mappatura delle caratteristiche del profilo per personalizzare i prompt
const PROFILE_CHARACTERISTICS = {
  // Domanda 1: Obiettivi di carriera
  careerGoals: {
    'would advance to leadership position in current field/industry': {
      context: 'aspira a posizioni di leadership nel proprio settore',
      promptEnhancement: 'Considera che sto lavorando per avanzare verso ruoli di leadership nel mio campo attuale.',
      advisorFocus: 'leadership development, strategic thinking, team management'
    },
    'would transition to career that aligns with passions/interests': {
      context: 'cerca una transizione verso una carriera più allineata alle proprie passioni',
      promptEnhancement: 'Sto considerando una transizione di carriera per allinearmi meglio alle mie passioni e interessi.',
      advisorFocus: 'career transition, passion discovery, skill transferability'
    },
    'would start an own business/become entrepreneur': {
      context: 'ha ambizioni imprenditoriali',
      promptEnhancement: 'Il mio obiettivo è avviare la mia attività o diventare imprenditore.',
      advisorFocus: 'entrepreneurship, business planning, risk management'
    },
    'would achieve specific degree/certification': {
      context: 'punta al raggiungimento di specifici traguardi formativi',
      promptEnhancement: 'Sto lavorando per ottenere una specifica qualifica o certificazione.',
      advisorFocus: 'education planning, skill development, certification strategy'
    },
    'is still exploring career options': {
      context: 'è ancora in fase di esplorazione delle opzioni di carriera',
      promptEnhancement: 'Sto ancora esplorando diverse opzioni di carriera per trovare il percorso giusto per me.',
      advisorFocus: 'career exploration, self-discovery, opportunity assessment'
    }
  },

  // Domanda 2: Stile decisionale
  decisionStyle: {
    'weighs the pros and cons, and makes a logical decision based on the facts.': {
      context: 'prende decisioni in modo analitico e basato sui fatti',
      promptEnhancement: 'Il mio approccio decisionale è analitico: valuto pro e contro basandomi sui fatti.',
      communicationStyle: 'data-driven, logical reasoning, structured analysis'
    },
    'relies on the instincts and gut feelings to guide decisions': {
      context: 'si affida all\'intuito nelle decisioni',
      promptEnhancement: 'Tendo a fidarmi del mio istinto e delle sensazioni viscerali quando prendo decisioni.',
      communicationStyle: 'intuitive insights, emotional intelligence, pattern recognition'
    },
    'seeks input and advice from others before making a decision.': {
      context: 'cerca il confronto con altri prima di decidere',
      promptEnhancement: 'Preferisco cercare input e consigli da altri prima di prendere decisioni importanti.',
      communicationStyle: 'collaborative approach, multiple perspectives, consensus building'
    },
    'tends to make decisions quickly without much thought.': {
      context: 'tende a decidere rapidamente',
      promptEnhancement: 'Tendo a prendere decisioni rapidamente, spesso senza troppa riflessione.',
      communicationStyle: 'quick actionable advice, clear priorities, decisive guidance'
    },
    'tends to delay making decisions until the last minute.': {
      context: 'tende a procrastinare nelle decisioni',
      promptEnhancement: 'Tendo a rimandare le decisioni fino all\'ultimo momento.',
      communicationStyle: 'structured timelines, decision frameworks, accountability measures'
    }
  },

  // Domanda 3: Livello di attività fisica
  activityLevel: {
    'has a mostly inactive lifestyle': {
      context: 'ha uno stile di vita prevalentemente sedentario',
      wellnessContext: 'Attualmente ho uno stile di vita piuttosto sedentario.'
    },
    'engages in light physical activity occasionally': {
      context: 'pratica attività fisica leggera occasionalmente',
      wellnessContext: 'Pratico attività fisica leggera di tanto in tanto.'
    },
    'engages in moderate physical activity a few times a week': {
      context: 'pratica attività fisica moderata alcune volte a settimana',
      wellnessContext: 'Pratico attività fisica moderata alcune volte a settimana.'
    },
    'engages in regular physical activity most days of the week': {
      context: 'pratica attività fisica regolare',
      wellnessContext: 'Sono abbastanza attivo fisicamente, pratico esercizio regolarmente.'
    },
    'is not sure about the current level of physical activity': {
      context: 'non è sicuro del proprio livello di attività fisica',
      wellnessContext: 'Non sono sicuro del mio attuale livello di attività fisica.'
    }
  },

  // Domanda 4: Linguaggio dell'amore/comunicazione preferita
  communicationPreference: {
    'loves hearing kind, encourage, or supporte words from the partner': {
      context: 'apprezza le parole di incoraggiamento',
      communicationStyle: 'encouraging words, positive affirmations, verbal support'
    },
    'loves when the partner does things that help out or make their life easier': {
      context: 'apprezza i gesti concreti di aiuto',
      communicationStyle: 'practical solutions, actionable steps, concrete help'
    },
    'loves getting thoughtful or meaningful gifts from the partner': {
      context: 'apprezza i gesti simbolici e i riconoscimenti',
      communicationStyle: 'meaningful insights, valuable resources, thoughtful recommendations'
    },
    'loves spending undivided, focused time with the partner, doing things together': {
      context: 'apprezza il tempo di qualità e l\'attenzione dedicata',
      communicationStyle: 'detailed guidance, thorough explanations, comprehensive support'
    },
    'loves feeling connected and loved through physical touch, like holding hands, hugging, or cuddling': {
      context: 'apprezza il contatto e la vicinanza emotiva',
      communicationStyle: 'empathetic approach, emotional connection, supportive tone'
    }
  }
};

/**
 * Crea un profilo personalizzato basato sui dati del survey
 * @param {Object} surveyData - Dati del survey utente
 * @returns {Object} Profilo personalizzato
 */
export const createUserProfile = (surveyData) => {
  if (!surveyData || !Array.isArray(surveyData) || surveyData.length < 4) {
    return null;
  }

  const [careerGoal, decisionStyle, activityLevel, communicationPref] = surveyData;

  return {
    careerGoal: PROFILE_CHARACTERISTICS.careerGoals[careerGoal] || null,
    decisionStyle: PROFILE_CHARACTERISTICS.decisionStyle[decisionStyle] || null,
    activityLevel: PROFILE_CHARACTERISTICS.activityLevel[activityLevel] || null,
    communicationPreference: PROFILE_CHARACTERISTICS.communicationPreference[communicationPref] || null,
    rawData: surveyData
  };
};

/**
 * Genera un contesto personalizzato per i prompt basato sul profilo utente
 * @param {Object} userProfile - Profilo utente creato da createUserProfile
 * @param {string} userName - Nome dell'utente
 * @returns {string} Contesto personalizzato
 */
export const generatePersonalizedContext = (userProfile, userName) => {
  if (!userProfile) {
    return `Il mio nome è ${userName}.`;
  }

  const contextParts = [`Il mio nome è ${userName}.`];

  // Aggiungi contesto degli obiettivi di carriera
  if (userProfile.careerGoal?.promptEnhancement) {
    contextParts.push(userProfile.careerGoal.promptEnhancement);
  }

  // Aggiungi contesto dello stile decisionale
  if (userProfile.decisionStyle?.promptEnhancement) {
    contextParts.push(userProfile.decisionStyle.promptEnhancement);
  }

  // Aggiungi contesto del benessere se rilevante
  if (userProfile.activityLevel?.wellnessContext) {
    contextParts.push(userProfile.activityLevel.wellnessContext);
  }

  return contextParts.join(' ');
};

/**
 * Personalizza lo stile di comunicazione del consulente basato sul profilo
 * @param {Object} userProfile - Profilo utente
 * @param {Object} advisor - Informazioni del consulente
 * @returns {string} Istruzioni di stile personalizzate
 */
export const getPersonalizedCommunicationStyle = (userProfile, advisor) => {
  const styleInstructions = [];

  // Stile basato sulle preferenze di comunicazione
  if (userProfile?.communicationPreference?.communicationStyle) {
    styleInstructions.push(`Adatta il tuo stile di comunicazione a: ${userProfile.communicationPreference.communicationStyle}`);
  }

  // Stile basato sul metodo decisionale
  if (userProfile?.decisionStyle?.communicationStyle) {
    styleInstructions.push(`Fornisci consigli utilizzando: ${userProfile.decisionStyle.communicationStyle}`);
  }

  // Focus specifico basato sugli obiettivi di carriera
  if (userProfile?.careerGoal?.advisorFocus) {
    styleInstructions.push(`Concentrati su: ${userProfile.careerGoal.advisorFocus}`);
  }

  return styleInstructions.length > 0 
    ? `\n\nIstruzioni di stile: ${styleInstructions.join('. ')}.`
    : '';
};

/**
 * Ottimizza il prompt per un consulente specifico basato sul profilo utente
 * @param {string} basePrompt - Prompt base
 * @param {Object} userProfile - Profilo utente
 * @param {Object} advisor - Informazioni del consulente
 * @param {string} question - Domanda dell'utente
 * @returns {string} Prompt ottimizzato
 */
export const optimizePromptForUser = (basePrompt, userProfile, advisor, question) => {
  if (!userProfile) {
    return basePrompt;
  }

  // Genera contesto personalizzato
  const personalizedContext = generatePersonalizedContext(userProfile, 'l\'utente');
  
  // Ottieni stile di comunicazione personalizzato
  const communicationStyle = getPersonalizedCommunicationStyle(userProfile, advisor);

  // Crea prompt ottimizzato
  const optimizedPrompt = `${basePrompt}

Contesto personale: ${personalizedContext}${communicationStyle}

La mia domanda è: "${question}"`;

  return optimizedPrompt;
};

/**
 * Suggerisce miglioramenti per i prompt basati sull'analisi del profilo
 * @param {Object} userProfile - Profilo utente
 * @returns {Object} Suggerimenti di ottimizzazione
 */
export const getPromptOptimizationSuggestions = (userProfile) => {
  const suggestions = {
    contextEnhancements: [],
    communicationAdjustments: [],
    focusAreas: []
  };

  if (!userProfile) {
    suggestions.contextEnhancements.push('Raccogli più informazioni sul profilo utente tramite il survey');
    return suggestions;
  }

  // Suggerimenti basati sugli obiettivi di carriera
  if (userProfile.careerGoal) {
    suggestions.focusAreas.push(`Focus su: ${userProfile.careerGoal.advisorFocus}`);
    suggestions.contextEnhancements.push(`Includi contesto: ${userProfile.careerGoal.context}`);
  }

  // Suggerimenti basati sullo stile decisionale
  if (userProfile.decisionStyle) {
    suggestions.communicationAdjustments.push(`Stile comunicativo: ${userProfile.decisionStyle.communicationStyle}`);
  }

  // Suggerimenti basati sulle preferenze di comunicazione
  if (userProfile.communicationPreference) {
    suggestions.communicationAdjustments.push(`Preferenze: ${userProfile.communicationPreference.communicationStyle}`);
  }

  return suggestions;
};

/**
 * Determina l'ordine ottimale dei direttori per massimizzare la diversità dei consigli
 * @param {Array} directors - Array dei direttori disponibili
 * @returns {Array} Array dei direttori ordinati per complementarità
 */
export const getOptimalDirectorOrder = (directors) => {
  if (!directors || directors.length <= 1) {
    return directors;
  }

  // Definisce i gruppi di ruoli complementari
  const roleGroups = {
    strategic: ['CEO', 'COO', 'Strategy Director', 'Business Development Director'],
    operational: ['Operations Director', 'Project Manager', 'Process Improvement Director'],
    financial: ['CFO', 'Finance Director', 'Investment Director', 'Risk Management Director'],
    people: ['CHRO', 'HR Director', 'Talent Development Director', 'Culture Director'],
    technical: ['CTO', 'Technology Director', 'Innovation Director', 'Digital Transformation Director'],
    marketing: ['CMO', 'Marketing Director', 'Brand Director', 'Customer Experience Director'],
    creative: ['Creative Director', 'Design Director', 'Content Director', 'Innovation Director']
  };

  // Funzione per determinare il gruppo di un ruolo
  const getRoleGroup = (role) => {
    const foundEntry = Object.entries(roleGroups).find(([, roles]) => 
      roles.some(r => role.toLowerCase().includes(r.toLowerCase()))
    );
    return foundEntry ? foundEntry[0] : 'other';
  };

  // Ordina i direttori per massimizzare la diversità
  const orderedDirectors = [...directors];
  const usedGroups = new Set();
  const result = [];

  // Prima passata: seleziona un direttore per ogni gruppo
  orderedDirectors.forEach((director) => {
    const group = getRoleGroup(director.role || director.title || '');
    if (!usedGroups.has(group)) {
      result.push(director);
      usedGroups.add(group);
    }
  });

  // Seconda passata: aggiungi i rimanenti direttori
  orderedDirectors.forEach((director) => {
    if (!result.includes(director)) {
      result.push(director);
    }
  });

  return result;
};

export default {
  createUserProfile,
  generatePersonalizedContext,
  getPersonalizedCommunicationStyle,
  optimizePromptForUser,
  getPromptOptimizationSuggestions,
  getOptimalDirectorOrder
};