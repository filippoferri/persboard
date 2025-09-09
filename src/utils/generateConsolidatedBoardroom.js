import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { StructuredOutputParser } from "langchain/output_parsers";

import { getOptimizedModelConfig } from './smartTokenManager';
import { withCache } from './responseCache';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

/**
 * Consolidated function that generates discussion, takeaways, and scenarios in a single API call
 * This reduces costs by ~70% compared to separate calls
 */
const _generateConsolidatedBoardroom = async (advisoryDirectors, question, user) => {
    try {
        // VARIABLES - Using centralized configuration
        // Get optimized configuration based on request complexity
    const optimizedConfig = getOptimizedModelConfig({
        question,
        advisoryDirectors,
        requestType: 'consolidated',
        multipleOutputs: true
    });
    const { modelName, temperature, maxTokens, topP, compression } = optimizedConfig;

        const { firstName } = user;
        const MY_NAME = firstName.charAt(0).toUpperCase() + firstName.slice(1);

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
            'In my opinion, you should',
            'Based on my expertise,',
            'The best approach would be to'
        ];

        const MOTIVATIONAL_PHRASES = [
            "Remember, success is not final, failure is not fatal",
            "The only way to do great work is to love what you do",
            "Believe you can and you're halfway there",
            "Success is not the key to happiness. Happiness is the key to success",
            "The future belongs to those who believe in the beauty of their dreams",
            "Don't watch the clock; do what it does. Keep going",
            "The only impossible journey is the one you never begin",
            "Success is walking from failure to failure with no loss of enthusiasm",
            "The way to get started is to quit talking and begin doing",
            "Innovation distinguishes between a leader and a follower"
        ];

        // CHAT - using centralized configuration
        const chat = new ChatOpenAI({
            openAIApiKey: OPENAI_API_KEY,
            modelName,
            temperature,
            maxTokens,
            topP,
            compression,
        });

        // Create consolidated parser for all outputs
        const parser = StructuredOutputParser.fromNamesAndDescriptions({
            discussion: "Array of advice objects, each containing: fullName, role, decisionMakingStrategy (detailed advice), and quote (motivational phrase)",
            takeaways: "Array of 4-6 actionable takeaway items derived from the discussion",
            bestcase: "Best-case scenario description based on following the advice",
            worstcase: "Worst-case scenario description if the advice is not followed"
        });

        const formatInstructions = parser.getFormatInstructions();

        // Create directors context for the prompt
        const directorsContext = advisoryDirectors.map(director => 
            `${director.fullName} (${director.role}) - Expert in: ${director.expertise}`
        ).join(', ');

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                `Boardroom discussion for ${MY_NAME}. Directors: ${directorsContext}. Each provides role-specific advice with opening phrase + motivational quote. Include takeaways and scenarios.`
            ),
            HumanMessagePromptTemplate.fromTemplate(
                `Q: "${question}"
                
                Openings: ${OPENING_SENTENCES.slice(0, 5).join(', ')}
                Quotes: ${MOTIVATIONAL_PHRASES.slice(0, 5).join(', ')}
                
                {format_instructions}`
            ),
        ]);

        const chain = new LLMChain({
            prompt: chatPrompt,
            llm: chat,
        });

        console.log('🚀 Generating consolidated boardroom response...');
        
        const response = await chain.call({
            format_instructions: formatInstructions,
        });

        // Parse the response
        const cleanedResponse = response.text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        
        try {
            const parsedResponse = JSON.parse(cleanedResponse);
            
            // Validate and structure the response
            const result = {
                discussion: parsedResponse.discussion || [],
                takeaways: parsedResponse.takeaways || [],
                scenarios: {
                    bestcase: parsedResponse.bestcase || "Positive outcomes expected",
                    worstcase: parsedResponse.worstcase || "Challenges may arise without action"
                }
            };

            console.log('✅ Consolidated response generated successfully');
            return result;

        } catch (parseError) {
            console.error('❌ Error parsing consolidated response:', parseError);
            
            // Fallback: return structured error response
            return {
                discussion: [{
                    fullName: "System",
                    role: "Assistant",
                    decisionMakingStrategy: "I apologize, but I encountered an issue processing your request. Please try again.",
                    quote: "Every challenge is an opportunity to grow."
                }],
                takeaways: ["Please retry your request"],
                scenarios: {
                    bestcase: "System will process request successfully on retry",
                    worstcase: "May need to check system configuration"
                }
            };
        }

    } catch (error) {
        console.error('❌ Error in consolidated boardroom generation:', error);
        throw error;
    }
};

// Export cached version
export const generateConsolidatedBoardroom = withCache(_generateConsolidatedBoardroom, 'generateConsolidatedBoardroom');

export default generateConsolidatedBoardroom;