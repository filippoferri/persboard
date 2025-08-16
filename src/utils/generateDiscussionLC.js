import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { StructuredOutputParser } from "langchain/output_parsers";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export const generateDiscussionLC = async (advisoryDirectors, question, user) => {

    // VARIABLES
    const MAX_TOKENS = 800;
    const TEMPERATURE = 0;

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
        'In your position, I would',
    ];

    const MOTIVATIONAL_PHRASES = [
        "A mantra I live by is",
        "One thing that keeps me going is",
        "A quote that inspires me is",
        "A saying I often think of is",
        "Something I remind myself daily is",
        "A phrase that helps me push through tough times is",
        "A message I hold close is",
        "A thought that drives me forward is",
        "A maxim I believe in is",
        "An idea that motivates me is"
    ];

    // CHAT with most economical model
    const chat = new ChatOpenAI({
        openAIApiKey: OPENAI_API_KEY,
        modelName: 'gpt-4o-mini',
        temperature: TEMPERATURE,
        maxTokens: MAX_TOKENS,
        topP: 1,
        compression: true,
    });

    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        decisionMakingStrategy: "Outline a decision-making strategy considering values, goals, needs, and risks. Provide role-specific insights.",
        quote: "Share a motivational phrase."
    });

    const formatInstructions = parser.getFormatInstructions();

    let previousAdvice = "";

    try {

        const responses = await Promise.all(advisoryDirectors.map(async (director) => {

            const OPENING_SENTENCE = OPENING_SENTENCES[Math.floor(Math.random() * OPENING_SENTENCES.length)];
            const MOTIVATIONAL_PHRASE = MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];

            const chatPrompt = ChatPromptTemplate.fromPromptMessages([
                SystemMessagePromptTemplate.fromTemplate(
                    `Act as ${director.fullName}, ${director.role} for ${MY_NAME}. With expertise in ${director.expertise}, provide advice considering previous: "${previousAdvice}". Share an unique motivational phrase starting with "${MOTIVATIONAL_PHRASE}". Encourage ${MY_NAME} to succeed.`
                ),
                HumanMessagePromptTemplate.fromTemplate(
                    `What insights can you offer, as ${director.role}, on "${question}"? Start with "${OPENING_SENTENCE}".\n\n{format_instructions}`
                ),
            ]);

            const chain = new LLMChain({
                prompt: chatPrompt,
                stop: ". ",
                llm: chat,
            });

            const response = await chain.call({
                MY_NAME,
                OPENING_SENTENCE,
                MOTIVATIONAL_PHRASE,
                question,
                format_instructions: formatInstructions,
            });

            const responseText = response.text.replace(/```json\n|\n```/g, '');
            const responseJson = JSON.parse(responseText);

            previousAdvice += ` ${responseJson.decisionMakingStrategy} ${responseJson.quote}`;

            return {
                director: director.fullName,
                role: director.role,
                decisionMakingStrategy: responseJson.decisionMakingStrategy,
                quote: responseJson.quote,
            };

        }));

        console.log('allResponses', responses);

        // Save the generated advice for this director
        return responses;

    } catch (error) {
        console.log('Error while generating advice: ', error);
    
        return advisoryDirectors.map(({ fullName, role }) => ({
            fullName,
            role,
            text: 'Sorry, I have no idea now!',
        }));
    }
}
