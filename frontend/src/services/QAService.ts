const qaAPI = process.env.REACT_APP_BACKEND_QA;

export const askGpt = async (question: string, subtitles: string): Promise<string> =>   {
    console.log(`Asking GPT: ${question} with subtitles: ${subtitles}`)
    console.log(`process.env.REACT_APP_BACKEND_QA: ${process.env.REACT_APP_BACKEND_QA}`)
    console.log(`QA API: ${qaAPI}/qa`)
    try {
        const response = await fetch(`${qaAPI}/qa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subtitles, question }),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch answer');
        }
        const answer: string = await response.json();
        return answer;
    } catch (error) {
        console.error('Failed to fetch answer:', error);
    }
    return `Error: Failed to fetch answer`;
}