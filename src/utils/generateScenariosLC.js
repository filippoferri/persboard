import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { StructuredOutputParser } from "langchain/output_parsers";

import { withCache } from './responseCache';
import { getOptimizedModelConfig } from './smartTokenManager';
import { createUserProfile, generatePersonalizedContext } from './profileManager';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const _generateScenariosLC = async (discussion, user) => {
    try {

        // VARIABLES - Using smart token management
        const optimizedConfig = getOptimizedModelConfig(discussion, 2); // Best and worst case scenarios
        
        const { firstName, myProfile } = user;
        const MY_NAME = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        
        // Create personalized user profile from survey data
        const userProfile = createUserProfile(myProfile);
        const personalizedContext = generatePersonalizedContext(userProfile, MY_NAME);

        // CHAT with optimized model configuration
        const chat = new ChatOpenAI({
            openAIApiKey: OPENAI_API_KEY,
            ...optimizedConfig,
        });

        const parser = StructuredOutputParser.fromNamesAndDescriptions({
            bestcase: "define the best-case scenario",
            worstcase: "define the worst-case scenario",
        });

        const formatInstructions = parser.getFormatInstructions();

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                `Based on the following takeaways from a board discussion, create two personalized scenarios for ${MY_NAME}:
                
                Personal Context: ${personalizedContext}
                
                Generate best/worst case scenarios from advice considering their profile and goals.`
            ),
            HumanMessagePromptTemplate.fromTemplate(
                `Advice: "{discussion}"\n
                Please provide:
                1. **Best Case Scenario**: What could happen if ${MY_NAME} follows all advice successfully, considering their profile and goals
                2. **Worst Case Scenario**: What risks or challenges might arise if ${MY_NAME} ignores the advice, given their specific situation
                
                Each scenario should be:
                - Realistic and specific to ${MY_NAME}'s context and career goals
                - Directly related to the takeaways and ${MY_NAME}'s profile
                - Actionable (showing clear cause and effect relevant to ${MY_NAME})
                - Motivating (best case) or cautionary (worst case) for ${MY_NAME}'s situation
                - Aligned with ${MY_NAME}'s decision-making style and preferences
                
                Format as two distinct scenarios with clear headings, personalized for ${MY_NAME}.
                
                {format_instructions}`
            ),
        ]);

        const chain = new LLMChain({
            prompt: chatPrompt,
            stop: ". ",
            llm: chat,
        });

        const response = await chain.call({
            discussion,
            format_instructions: formatInstructions,
        });

        const responseText = response.text.replace(/```json\n|\n```/g, '');
        const responseJson = JSON.parse(responseText);

        const bestCaseScenario = {
            number: 1,
            title: "Best-Case",
            text: responseJson.bestcase,
        };
            
        const worstCaseScenario = {
            number: 2,
            title: "Worst-Case",
            text: responseJson.worstcase,
        };
            
        return [bestCaseScenario, worstCaseScenario];

    } catch (error) {
        console.log('Error while generating scenarios: ', error);
        return [
            {
                text: 'No scenarios discovered in the discussion.',
            },
        ];
    }
};

// Export cached version
export const generateScenariosLC = withCache(_generateScenariosLC, 'generateScenariosLC');