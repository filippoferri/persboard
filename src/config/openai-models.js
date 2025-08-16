// OpenAI Model Configuration
// Centralized configuration for all OpenAI API calls in the application
// Using the most economical models to minimize costs

export const OPENAI_MODELS = {
  // Most economical model for general use cases
  ECONOMICAL: 'gpt-4o-mini',
  
  // Alternative economical models (in case primary is unavailable)
  FALLBACK_ECONOMICAL: 'gpt-3.5-turbo',
  
  // Default model configuration for LangChain
  LANGCHAIN_DEFAULT: {
    modelName: 'gpt-4o-mini',
    temperature: 0,
    maxTokens: 800,
    topP: 1,
    compression: true,
  },
  
  // Default configuration for direct OpenAI API calls
  DIRECT_API_DEFAULT: {
    model: 'gpt-4o-mini',
    temperature: 0,
    max_tokens: 800,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  }
};

// Pricing information for reference (as of 2024)
// gpt-4o-mini: $0.000150 / 1K input tokens, $0.000600 / 1K output tokens
// gpt-3.5-turbo: $0.0005 / 1K input tokens, $0.0015 / 1K output tokens
// Legacy text-curie-001: DEPRECATED - much more expensive

export default OPENAI_MODELS;