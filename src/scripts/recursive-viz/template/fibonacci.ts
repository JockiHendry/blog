// @ts-nocheck

function solve(n: number): number {
    if (n < 2) {
        return n;
    }
    return solve(n-1) + solve(n-2);
}

const n = 8;
console.log(`The ${n}-th Fibonacci number is ${solve(n)}`);