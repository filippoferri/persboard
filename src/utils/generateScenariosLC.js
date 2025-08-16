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

export const generateScenariosLC = async (discussion) => {
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
            bestcase: "define the best-case scenario",
            worstcase: "define the worst-case scenario",
        });

        const formatInstructions = parser.getFormatInstructions();

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                `As a director on the personal board, provide the best-case scenario as pipe dream and worst-case scenario as apocalypse for action items recovered from a given advice.`
            ),
            HumanMessagePromptTemplate.fromTemplate(
                `Here is the advice: "{discussion}". Talk directly to me and be concise.\n\n{format_instructions}`
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