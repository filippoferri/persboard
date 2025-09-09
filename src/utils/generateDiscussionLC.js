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
import { createUserProfile, generatePersonalizedContext, getPersonalizedCommunicationStyle } from './profileManager';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const _generateDiscussionLC = async (advisoryDirectors, question, user) => {

    // VARIABLES - Using smart token management
    const optimizedConfig = getOptimizedModelConfig(question, advisoryDirectors.length);
    
    const { firstName, myProfile } = user;
    const MY_NAME = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    
    // Create personalized user profile from survey data
    const userProfile = createUserProfile(myProfile);
    const personalizedContext = generatePersonalizedContext(userProfile, MY_NAME);

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

    // CHAT with optimized model configuration
    const chat = new ChatOpenAI({
        openAIApiKey: OPENAI_API_KEY,
        ...optimizedConfig,
    });

    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        decisionMakingStrategy: "Outline a decision-making strategy considering values, goals, needs, and risks. Provide role-specific insights.",
        quote: "Share a motivational phrase."
    });

    const formatInstructions = parser.getFormatInstructions();

    let previousAdvice = "";
    const coveredAspects = [];

    try {

        // Process directors sequentially to avoid repetition and build context
        const responses = [];
        
        for (let i = 0; i < advisoryDirectors.length; i += 1) {
            const director = advisoryDirectors[i];

            const OPENING_SENTENCE = OPENING_SENTENCES[Math.floor(Math.random() * OPENING_SENTENCES.length)];
            const MOTIVATIONAL_PHRASE = MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];

            // Enhanced personalized prompt with role-specific focus
            const communicationStyle = getPersonalizedCommunicationStyle(userProfile, { fullName: director.fullName, type: director.role, area: director.expertise });
            
            // Define role-specific focus areas to avoid repetition
            const roleFocusMap = {
                'CEO': 'strategic vision, leadership, and organizational growth',
                'CTO': 'technology strategy, innovation, and technical implementation',
                'CFO': 'financial planning, risk management, and resource allocation',
                'CMO': 'market positioning, brand strategy, and customer engagement',
                'CHRO': 'talent development, organizational culture, and team dynamics',
                'COO': 'operational efficiency, process optimization, and execution',
                'Mentor': 'personal development, career guidance, and skill building',
                'Advisor': 'industry insights, networking, and strategic partnerships'
            };
            
            const roleFocus = roleFocusMap[director.role] || 'general business strategy';
            
            // Build context of what has been covered to avoid repetition
            const contextualGuidance = i === 0 
                ? "As the first advisor, provide foundational insights."
                : `Previous advisors have covered: ${coveredAspects.join(', ')}. Build upon their insights but focus specifically on ${roleFocus} aspects they haven't addressed.`;
            
            const chatPrompt = ChatPromptTemplate.fromPromptMessages([
                SystemMessagePromptTemplate.fromTemplate(
                    `You are ${director.fullName}, a ${director.role} with expertise in ${director.expertise}. You are part of ${MY_NAME}'s personal Board of Directors.

                    Personal Context: ${personalizedContext}

                    Your Unique Role Focus: ${roleFocus}
                    
                    ${contextualGuidance}

                    Instructions:
                    - Focus specifically on ${roleFocus} - this is your unique contribution
                    - Provide specific, actionable advice from your ${director.role} perspective
                    - Avoid repeating what previous advisors have covered
                    - Draw from your expertise in ${director.expertise}
                    - Consider ${MY_NAME}'s decision-making style and career goals
                    - Keep responses focused, practical, and personalized to your role
                    - Use an encouraging but professional tone
                    - Start your response with: "${OPENING_SENTENCE}"
                    - End with a motivational phrase starting with: "${MOTIVATIONAL_PHRASE}"${communicationStyle}

                    Previous advice context: "${previousAdvice}"`
                ),
                HumanMessagePromptTemplate.fromTemplate(
                    `Question: "${question}"

                    Please provide your personalized advice as ${director.fullName}, taking into account the personal context provided.\n{format_instructions}`
                ),
            ]);

            const chain = new LLMChain({
                prompt: chatPrompt,
                stop: ". ",
                llm: chat,
            });

            // eslint-disable-next-line no-await-in-loop
            const response = await chain.call({
                MY_NAME,
                OPENING_SENTENCE,
                MOTIVATIONAL_PHRASE,
                question,
                format_instructions: formatInstructions,
            });

            const responseText = response.text.replace(/```json\n|\n```/g, '');
            const responseJson = JSON.parse(responseText);

            // Update context for next advisor
            previousAdvice += ` ${responseJson.decisionMakingStrategy}`;
            coveredAspects.push(roleFocus);

            const advisorResponse = {
                director: director.fullName,
                role: director.role,
                decisionMakingStrategy: responseJson.decisionMakingStrategy,
                quote: responseJson.quote,
            };
            
            responses.push(advisorResponse);
        }

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

// Export cached version
export const generateDiscussionLC = withCache(_generateDiscussionLC, 'generateDiscussionLC');
