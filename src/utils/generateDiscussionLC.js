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
        'My advice to you is to',
        'In my experience, it is helpful to',
        'Have you considered',
        'One strategy you could try is',
        'To achieve your goals, you may want to',
        'I suggest that you',
        'When facing a challenge like this, I recommend',
        'From what I understand, it may be helpful to',
        'What has worked for me in the past is',
        'If I were in your position, I would',
    ];

    const MOTIVATIONAL_PHRASES = [
        "A mantra I live by is...",
        "One thing that keeps me going is...",
        "A quote that inspires me is...",
        "A saying I often think of is...",
        "Something I remind myself daily is...",
        "A phrase that helps me push through tough times is...",
        "A message I hold close is...",
        "A thought that drives me forward is...",
        "A maxim I believe in is...",
        "An idea that motivates me is..."
    ];

    // CHAT
    const chat = new ChatOpenAI({
        openAIApiKey: OPENAI_API_KEY, 
        temperature: TEMPERATURE,
        maxTokens: MAX_TOKENS,
        topP: 1,
        compression: true,
    });

    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        decisionMakingStrategy: "In your response, outline a decision-making strategy that takes into account role-specific sets of aspects such as personal values, long-term goals, immediate needs, and potential risks and benefits. Offer an important role-aligned insight on how to balance these factors to make a well-informed decision that reflects your specific expertise.",
        quote: "Share a personal motivational phrase with author"
    });

    const formatInstructions = parser.getFormatInstructions();

    let previousAdvice = "";

    try {

        const allResponses = [];

        const responses = await Promise.all(advisoryDirectors.map(async (director) => {

            const OPENING_SENTENCE = OPENING_SENTENCES[Math.floor(Math.random() * OPENING_SENTENCES.length)];
            const MOTIVATIONAL_PHRASE = MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];

                const chatPrompt = ChatPromptTemplate.fromPromptMessages([
                    SystemMessagePromptTemplate.fromTemplate(
                        `Act as ${director.fullName}, ${director.role} in the personal board of ${MY_NAME}. Given the previous advice: "${previousAdvice}", provide your unique advice based on your role and expertise. Share a personal motivational phrase starting with "${MOTIVATIONAL_PHRASE}". Motivate and encourage ${MY_NAME} to take action and succeed.`
                    ),
                    HumanMessagePromptTemplate.fromTemplate(
                        `what additional insights can you offer to me, as ${director.role}, when making a decision about "${question}"? Start with "${OPENING_SENTENCE}...".\n\n{format_instructions}`
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

                previousAdvice += `${responseJson.decisionMakingStrategy} ${responseJson.quote}`;

                return {
                    director: director.fullName,
                    role: director.role,
                    decisionMakingStrategy: responseJson.decisionMakingStrategy,
                    quote: responseJson.quote,
                };

            }));

            console.log('allResponses', responses)

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