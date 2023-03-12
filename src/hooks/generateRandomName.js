import { useState } from 'react';

const RandomFullName = () => {
    const [fullName, setFullName] = useState('');

    const firstNames = ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace'];
    const lastNames = ['Smith', 'Johnson', 'Brown', 'Lee', 'Garcia', 'Wilson', 'Taylor'];

    const generateName = () => {
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const randomFullName = `${randomFirstName} ${randomLastName}`;
        setFullName(randomFullName);
        };

    return [fullName, generateName];
};

export default RandomFullName;