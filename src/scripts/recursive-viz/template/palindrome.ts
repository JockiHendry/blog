// @ts-nocheck

function solve(text: string): boolean {
    if (text.length <= 1) {
        return true;
    }
    return text[0] === text[text.length-1] && solve(text.slice(1, -1));
}

const word = 'tattarrattat';
console.log(`${word} is a palindrome: ${solve(word) ? 'yes' : 'no'}`);
