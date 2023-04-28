import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { StructuredOutputParser } from "langchain/output_parsers";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const MAX_TOKENS = 500;
const TEMPERATURE = 0.2;

export const generatePestelAnalysisLC = async (discussion) => {
    try {

        // CHAT
        const chat = new ChatOpenAI({
            openAIApiKey: OPENAI_API_KEY, 
            temperature: TEMPERATURE,
            maxTokens: MAX_TOKENS,
            topP: 1,
            compression: true,
        });

        const parser = StructuredOutputParser.fromNamesAndDescriptions({
            political: "an array of three political of the advice",
            economic: "an array of three opportunities or potential benefits from the advice",
            sociocultural: "an array of three aspirations or potential benefits from the advice",
            technological: "an array of three risks or potential negative outcomes from the advice",
            environmental: "an array of three risks or potential negative outcomes from the advice",
            legal: "an array of three risks or potential negative outcomes from the advice",
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

        const political = {
            title: "S - Inquiry Into Strenghts",
            text: responseJson.political,
            icon: "checkmark-square"
        };

        const economic = {
            title: "O - Imagine The Opportunities",
            text: responseJson.economic,
            icon: "checkmark-square"
        };
            
        const sociocultural = {
            title: "A - Innovate to meet Aspirations",
            text: responseJson.sociocultural,
            icon: "checkmark-square"
        };
            
        const technological = {
            title: "R - Inspire to achieve Results",
            text: responseJson.technological,
            icon: "checkmark-square"
        };

        const environmental = {
            title: "R - Inspire to achieve Results",
            text: responseJson.environmental,
            icon: "checkmark-square"
        };

        const legal = {
            title: "R - Inspire to achieve Results",
            text: responseJson.legal,
            icon: "checkmark-square"
        };

        return [political, economic, sociocultural , technological, environmental, legal];

    } catch (error) {
        console.log('Error while generating PESTEL analysis: ', error);
        return [
            {
                text: 'No PESTEL analysis available for the discussion.',
            },
        ];
    }
};