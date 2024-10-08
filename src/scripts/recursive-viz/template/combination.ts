// @ts-nocheck

function solve(result: number[][], current: number[], start: number, n: number, k: number) {
    if (current.length === k) {
        result.push(Array.from(current));
    }
    for (let i=start; i<=n; i++) {
        current.push(i);
        solve(result, current, i+1,n,k);
        current.pop();
    }
}
function start(n: number, k: number): number[][] {
    const result = []
    solve(result, [], 1,n,k);
    return result;
}

const n = 4;
const k = 2;
start(n,k).forEach(a => console.log(a));
