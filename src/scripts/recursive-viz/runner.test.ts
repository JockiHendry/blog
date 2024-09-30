import {describe, expect, test} from 'vitest';
import {CodeRunner} from './runner.js';
import interceptedCode from './template/intercepted_code?raw';

describe('CodeRunner', function () {
    test('the executed code should include interceptors', () => {
        const runner = new CodeRunner('console.log("test");', () => {});
        expect(runner.completeCode).toContain(interceptedCode.slice(0, 100));
    });

    test('add context to "solve" function', () => {
        const code = `function solve(n: number): number {return solve(n) + solve(n-1);}\nconsole.log(solve(n));\n`;
        const runner = new CodeRunner('', () => {});
        expect(runner.addContextToSolveFunction(code)).eq(`function solve(n: number): number {return solve.call(this, n) + solve.call(this, n-1);}\nconsole.log(solve.call(this, n));\n`);
    });

    test('add context to "solve" function in the middle of code', () => {
        const code = `console.log('test'); function solve(n: number): number {return solve(n) + solve(n-1);}\nconsole.log(solve(n));\n`;
        const runner = new CodeRunner('', () => {});
        expect(runner.addContextToSolveFunction(code)).eq(`console.log('test'); function solve(n: number): number {return solve.call(this, n) + solve.call(this, n-1);}\nconsole.log(solve.call(this, n));\n`);
    });

    test('execute fibonacci', () => {
        const runner = new CodeRunner(`
            function solve(n: number): number {
                if (n < 2) {
                    return n;
                }
                return solve(n-1) + solve(n-2);
            }
            solve(3);        
        `, () => {});
        const result = runner.execute();
        expect(result).toHaveLength(10);
        expect(result).toEqual([
            ['enter', 0, null, [3]],
            ['enter', 1, 0, [2]],
            ['enter', 2, 1, [1]],
            ['exit',  2, 1, 1],
            ['enter', 3, 1, [0]],
            ['exit',  3, 1, 0],
            ['exit',  1, 0, 1],
            ['enter', 4, 0, [1]],
            ['exit',  4, 0, 1],
            ['exit',  0, null, 2],
        ]);
    });
});
