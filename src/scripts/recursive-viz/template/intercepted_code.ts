// @ts-nocheck

(function() {
    const result = [];
    const consoleOutput = [];

    const originalLog = console.log;
    console.log = (...args) => {
        const line = args.map(a => String(a)).join('\t') + '\n';
        consoleOutput.push(line);
    }

    class TreeNode {
        constructor(public val: any, public left?: TreeNode, public right?: TreeNode) {}
    }

    try {
        const fnSolveArgToString = (typeof solveArgToString === 'undefined')? (i) => structuredClone(i): solveArgToString;
        const fnSolveResultToString = (typeof solveResultToString === 'undefined')? (i) => structuredClone(i): solveResultToString;
        if (typeof solve === 'undefined') {
            console.log('Warning: recursive function not found!');
            console.log('The recursive function to visualize must be declared with name "solve"\n');
        } else {
            const originalSolveFn = solve;
            let executionCounter = 0;
            solve = new Proxy(solve, {
                apply(target, thisArg, argumentsList) {
                    const currentExecutionCounter = executionCounter++;
                    const parentExecutionCounter = thisArg?.__executionCounter__ ?? null;
                    result.push(['enter', currentExecutionCounter, parentExecutionCounter, argumentsList.map(a => fnSolveArgToString(a))]);
                    let functionResult = originalSolveFn.apply({'__executionCounter__': currentExecutionCounter}, argumentsList);
                    result.push(['exit', currentExecutionCounter, parentExecutionCounter, fnSolveResultToString(functionResult)]);
                    return functionResult;
                }
            });
        }

        // [JCK]$USER CODE HERE$[HDR]

    } catch (err) {
        console.log(err);
    } finally {
        console.log = originalLog;
    }

    return [result, consoleOutput];
})();