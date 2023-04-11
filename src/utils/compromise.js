import nlp from 'compromise';

export const suggestDirectors = (directorsData, question) => {
	const doc = nlp(question);
	const keywords = doc.nouns().out('array');

	const matchingDirectors = directorsData.filter((director) => {
		const combinedText = [
		director.role,
		director.desc,
		].join(' ');

		const directorDoc = nlp(combinedText);
		const directorKeywords = directorDoc.nouns().out('array');

		const synonymKeywords = directorKeywords.reduce((acc, keyword) => {
			// const synonyms = nlp(keyword).data().reduce((innerAcc, data) => {
			// 	return data.b || innerAcc;
			// }, []);
			const synonyms = nlp(keyword).data().reduce((innerAcc, data) => data.b || innerAcc, []);
			return acc.concat(synonyms);
		}, []);
	

		return (
			directorKeywords.some((keyword) => keywords.includes(keyword)) ||
			synonymKeywords.some((synonym) => keywords.includes(synonym))
		);
		});

		if (matchingDirectors.length === 0) {
			const randomIndices = getRandomIndices(directorsData.length, 3);
			return randomIndices.map((index) => directorsData[index]);
		}

		return matchingDirectors.slice(0, 3);
	};

	// Utility function to generate three random indices in the range [0, maxIndex)
	function getRandomIndices(maxIndex, numIndices) {
	const indices = [];
	while (indices.length < numIndices) {
		const randomIndex = Math.floor(Math.random() * maxIndex);
		if (!indices.includes(randomIndex)) {
		indices.push(randomIndex);
		}
	}
	return indices;
}
