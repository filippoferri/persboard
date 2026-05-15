import { OPENAI_MODELS } from '../config/openai-models';

/**
 * Smart token management utility that dynamically adjusts token limits
 * based on request complexity and content length
 */

// Base token limits for different request types
const TOKEN_LIMITS = {
    simple: 150,      // Basic advice, short responses
    medium: 300,      // Standard discussions, takeaways
    complex: 600,     // Detailed analysis, multiple scenarios
    consolidated: 1200 // Multiple outputs in one call
};

// Complexity factors
const COMPLEXITY_FACTORS = {
    questionLength: {
        short: 1.0,    // < 50 chars
        medium: 1.2,   // 50-150 chars
        long: 1.5      // > 150 chars
    },
    directorsCount: {
        few: 1.0,      // 1-3 directors
        many: 1.3      // 4+ directors
    },
    requestType: {
        single: 1.0,   // Single output type
        multiple: 1.4  // Multiple output types
    }
};

/**
 * Calculate optimal token limit based on request complexity
 * @param {Object} params - Request parameters
 * @param {string} params.question - The question being asked
 * @param {Array} params.advisoryDirectors - Array of directors
 * @param {string} params.requestType - Type of request (simple, medium, complex, consolidated)
 * @param {boolean} params.multipleOutputs - Whether multiple outputs are requested
 * @returns {number} Optimized token limit
 */
export const calculateOptimalTokens = (params) => {
    const {
        question = '',
        advisoryDirectors = [],
        requestType = 'medium',
        multipleOutputs = false
    } = params;

    // Start with base limit
    let tokenLimit = TOKEN_LIMITS[requestType] || TOKEN_LIMITS.medium;

    // Apply question length factor
    const questionLength = question.length;
    let lengthFactor = COMPLEXITY_FACTORS.questionLength.short;
    if (questionLength > 150) {
        lengthFactor = COMPLEXITY_FACTORS.questionLength.long;
    } else if (questionLength > 50) {
        lengthFactor = COMPLEXITY_FACTORS.questionLength.medium;
    }

    // Apply directors count factor
    const directorsCount = advisoryDirectors.length;
    const directorsFactor = directorsCount > 3 
        ? COMPLEXITY_FACTORS.directorsCount.many 
        : COMPLEXITY_FACTORS.directorsCount.few;

    // Apply multiple outputs factor
    const outputsFactor = multipleOutputs 
        ? COMPLEXITY_FACTORS.requestType.multiple 
        : COMPLEXITY_FACTORS.requestType.single;

    // Calculate final token limit
    tokenLimit = Math.round(tokenLimit * lengthFactor * directorsFactor * outputsFactor);

    // Ensure we don't exceed reasonable limits
    const maxLimit = OPENAI_MODELS.LANGCHAIN_DEFAULT.maxTokens || 2000;
    const minLimit = 100;

    return Math.max(minLimit, Math.min(tokenLimit, maxLimit));
};



/**
 * Get optimized model configuration with smart token management
 * @param {Object} params - Request parameters (same as calculateOptimalTokens)
 * @returns {Object} Optimized model configuration
 */
export const getOptimizedModelConfig = (params) => {
    const optimalTokens = calculateOptimalTokens(params);
    
    return {
        ...OPENAI_MODELS.LANGCHAIN_DEFAULT,
        maxTokens: optimalTokens
    };
};

/**
 * Estimate input token count (rough approximation)
 * @param {string} text - Input text
 * @returns {number} Estimated token count
 */
export const estimateTokenCount = (text) => 
    // Rough approximation: 1 token ≈ 4 characters for English text
    Math.ceil(text.length / 4);

/**
 * Check if request is within token budget
 * @param {string} inputText - Input text
 * @param {number} maxTokens - Maximum allowed tokens
 * @returns {Object} Budget check result
 */
export const checkTokenBudget = (inputText, maxTokens) => {
    const estimatedInputTokens = estimateTokenCount(inputText);
    const remainingTokens = maxTokens - estimatedInputTokens;
    
    return {
        withinBudget: remainingTokens > 50, // Leave buffer for output
        estimatedInputTokens,
        remainingTokens,
        recommendation: remainingTokens < 50 
            ? 'Consider shortening input or increasing token limit'
            : 'Token budget looks good'
    };
};

export default {
    calculateOptimalTokens,
    getOptimizedModelConfig,
    estimateTokenCount,
    checkTokenBudget
};