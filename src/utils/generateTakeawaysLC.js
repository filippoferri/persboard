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

export const generateTakeawaysLC = async (discussion) => {
    try {

        // CHAT with most economical model
        const chat = new ChatOpenAI({
            openAIApiKey: OPENAI_API_KEY,
        modelName: 'gpt-4o-mini',
            temperature: TEMPERATURE,
            maxTokens: MAX_TOKENS,
            topP: 1,
            compression: true,
        });

        console.log('Discussion', discussion)

        const parser = StructuredOutputParser.fromNamesAndDescriptions({
            takeaways: "provide a array of action items",
        });

        const formatInstructions = parser.getFormatInstructions();

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                `As a director on the personal board, provide the the action items from a given advice.`
            ),
            HumanMessagePromptTemplate.fromTemplate(
                `Given the following discussion: "{discussion}", provide a list of action items\n\n{format_instructions}`
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