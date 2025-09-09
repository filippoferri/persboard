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

const _generateTakeawaysLC = async (discussion, user) => {
    try {
        // VARIABLES - Using smart token management
        const optimizedConfig = getOptimizedModelConfig(discussion, 3); // Assuming 3 takeaways on average
        
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

        console.log('Discussion', discussion)

        const parser = StructuredOutputParser.fromNamesAndDescriptions({
            takeaways: "provide a array of action items",
        });

        const formatInstructions = parser.getFormatInstructions();

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                `Based on the following board discussion, extract the most important takeaways and action items for ${MY_NAME}.
                
                Personal Context: ${personalizedContext}
                
                Please provide 3-5 key takeaways that are:
                - Actionable and specific to ${MY_NAME}'s profile and goals
                - Relevant to the main topics discussed and ${MY_NAME}'s situation
                - Prioritized by importance and relevance to ${MY_NAME}'s needs
                - Clear, concise, and personalized
                - Aligned with ${MY_NAME}'s decision-making style and career objectives
                
                Format each takeaway as a brief, actionable statement tailored to ${MY_NAME}'s specific context.`
            ),
            HumanMessagePromptTemplate.fromTemplate(
                `Discussion: "{discussion}"\n{format_instructions}`
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

        const takeaways = responseJson.takeaways.map((takeaway, index) => ({
            number: index + 1,
            text: takeaway,
        }));
        
        return takeaways;

    } catch (error) {
        console.log('Error while generating takeaways: ', error);
        return [
            {
                text: 'No important points covered in the discussion.',
            },
        ];
    }
};

// Export cached version
export const generateTakeawaysLC = withCache(_generateTakeawaysLC, 'generateTakeawaysLC');