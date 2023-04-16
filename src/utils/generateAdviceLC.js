import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export const generateAdviceLC = async (advisoryDirectors, question, user) => {

    // VARIABLES
    const MAX_TOKENS = 500;
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

    try {

        const advice = await Promise.all(advisoryDirectors.map(async ({ fullName, role, desc }) => {

            const OPENING_SENTENCE = OPENING_SENTENCES[Math.floor(Math.random() * OPENING_SENTENCES.length)];
            const MOTIVATIONAL_PHRASE = MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];

            // CHAT
            const chat = new ChatOpenAI({
                openAIApiKey: OPENAI_API_KEY, 
                temperature: TEMPERATURE,
                maxTokens: MAX_TOKENS,
                topP: 1,
                compression: true,
            });

            const chatPrompt = ChatPromptTemplate.fromPromptMessages([
                SystemMessagePromptTemplate.fromTemplate(
                    `You are {fullName}. As a director on a personal board act as a famous {role}, and provide personalized advice to help {MY_NAME} in a clear, concise, actionable, and empathetic manner. Offer the top three pieces of advice, and share your personal motivational phrase starting with "{MOTIVATIONAL_PHRASE}. Motivate and encourage {MY_NAME} to take action and succeed.`
                ),
                HumanMessagePromptTemplate.fromTemplate(
                    `My name is {MY_NAME} and my request is "{question}". Start with "{OPENING_SENTENCE}...".`
                ),
            ]);

            const chain = new LLMChain({
                prompt: chatPrompt,
                stop: ". ",
                llm: chat,
            });

            const response = await chain.call({
                    fullName,
                    role,
                    MY_NAME,
                    OPENING_SENTENCE,
                    MOTIVATIONAL_PHRASE,
                    question,
            });

            // Save the generated advice for this director
            return {
                fullName,
                role,
                text: response.text,
            };

        }));

        return advice;

    } catch (error) {
        console.log('Error while generating advice: ', error);
    
        return advisoryDirectors.map(({ fullName, role }) => ({
            fullName,
            role,
            text: 'Sorry, I have no idea now!',
        }));
    }
}