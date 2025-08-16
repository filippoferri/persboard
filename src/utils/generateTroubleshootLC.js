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

export const generateTroubleshootLC = async (discussion) => {
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
            troubleshoot: "provide a array of barriers to success",
        });

        const formatInstructions = parser.getFormatInstructions();

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                `As a director on the personal board, identify maximum top ten barriers to success from a given advice.`
            ),
            HumanMessagePromptTemplate.fromTemplate(
                `Given the following discussion: "{discussion}", identify the troubleshoot\n\n{format_instructions}`
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

        const troubleshoot = responseJson.troubleshoot.map((barrier, index) => ({
            number: index + 1,
            text: barrier,
        }));
        
        return troubleshoot;

    } catch (error) {
        console.log('Error while generating a troubleshoot: ', error);
        return [
            {
                text: 'No troubleshoot found in the discussion.',
            },
        ];
    }
};