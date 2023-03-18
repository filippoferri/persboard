import React, { useState, useEffect } from 'react';

const TypingEffect = ({ text, delay = 30 }) => {
const [displayedText, setDisplayedText] = useState('');

useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
    setDisplayedText((prevText) => prevText + text[index]);
    index++;
    if (index >= text.length) clearInterval(timer);
    }, delay);

    return () => {
    clearInterval(timer);
    };
}, [text, delay]);

return <>{displayedText}</>;
};

export default TypingEffect;
