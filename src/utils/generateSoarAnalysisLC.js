import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { StructuredOutputParser } from "langchain/output_parsers";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const MAX_TOKENS = 300;
const TEMPERATURE = 0.2;

export const generateSoarAnalysisLC = async (discussion) => {
    try {

        // CHAT
        const chat = new ChatOpenAI({
            openAIApiKey: OPENAI_API_KEY, 
        modelName: 'gpt-4o-mini',
            temperature: TEMPERATURE,
            maxTokens: MAX_TOKENS,
            topP: 1,
            compression: true,
        });

        const parser = StructuredOutputParser.fromNamesAndDescriptions({
            strengths: "an array of three strengths of the advice",
            opportunities: "an array of three opportunities or potential benefits from the advice",
            aspirations: "an array of three aspirations or potential benefits from the advice",
            results: "an array of three risks or potential negative outcomes from the advice",
        });

        const formatInstructions = parser.getFormatInstructions();

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                `As a director on the personal board, please provide a SOAR analysis based on the following advice.`
            ),
            HumanMessagePromptTemplate.fromTemplate(
                `Here is the advice: "{discussion}". Please provide:\n\nStrengths: What are the strengths of this advice?\n\nOpportunities:What are the opportunities or potential benefits that could result from following this advice?\n\nAspirations: What are the aspirations or potential benefits that could result from following this advice?\n\nResults: What are the potential risks or threats that could result from following this advice? 
                \n\n{format_instructions}`
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

        const strengths = {
            title: "S - Inquiry Into Strenghts",
            text: responseJson.strengths,
            icon: "checkmark-square"
        };

        const opportunities = {
            title: "O - Imagine The Opportunities",
            text: responseJson.opportunities,
            icon: "checkmark-square"
        };
            
        const aspirations = {
            title: "A - Innovate to meet Aspirations",
            text: responseJson.aspirations,
            icon: "checkmark-square"
        };
            
        const results = {
            title: "R - Inspire to achieve Results",
            text: responseJson.results,
            icon: "checkmark-square"
        };

        return [strengths, opportunities, aspirations , results];

    } catch (error) {
        console.log('Error while generating SOAR analysis: ', error);
        return [
            {
                text: 'No relevant SOAR analysis available for the discussion.',
            },
        ];
    }
};