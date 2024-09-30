// @ts-nocheck

function solve(arr: number[]): number[] {
    if (arr.length < 2) {
        return arr;
    }
    const pivot = arr[Math.floor(Math.random() * arr.length)];
    const left = [];
    const right = [];
    for (const a of arr) {
        if (a < pivot) {
            left.push(a);
        } else if (a > pivot) {
            right.push(a);
        }
    }
    return [...solve(left), pivot, ...solve(right)];
}

const data = [55,23,44,77,45,90,3,8,2];
console.log(`Unsorted array is `, data);
const sorted = solve(data);
console.log(`Sorted array is `, sorted);