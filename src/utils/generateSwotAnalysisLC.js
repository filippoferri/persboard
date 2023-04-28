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

export const generateSwotAnalysisLC = async (discussion) => {
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
            strengths: "define an array of three strengths that make the advice a good solution.",
            weaknesses: "define an array of three weaknesses that make the advice a less desirable option.",
            opportunities: "define an array of three opportunities or the potential benefits that could result from taking the advice.",
            threats: "define an array of three threats or the potential risks that could result from taking the advice.",
        });

        const formatInstructions = parser.getFormatInstructions();

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                `As a director on the personal board, please provide a SWOT analysis based on the following advice.`
            ),
            HumanMessagePromptTemplate.fromTemplate(
                `Here is the advice: "{discussion}". Be concise and direct.\n\n{format_instructions}`
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
            title: "Strenghts",
            text: responseJson.strengths,
            icon: "diagonal-arrow-right-up"
        };
            
        const weaknesses = {
            title: "Weaknesses",
            text: responseJson.weaknesses,
            icon: "diagonal-arrow-right-down"
        };

        const opportunities = {
            title: "Opportunities",
            text: responseJson.opportunities,
            icon: "radio-button-on"
        };
            
        const threats = {
            title: "Threats",
            text: responseJson.threats,
            icon: "checkmark"
        };

        return [strengths, weaknesses, opportunities, threats];

    } catch (error) {
        console.log('Error while generating SWOT analysis: ', error);
        return [
            {
                text: 'No SWOT analysis available for the discussion.',
            },
        ];
    }
};