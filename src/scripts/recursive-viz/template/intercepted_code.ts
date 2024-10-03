// @ts-nocheck

(function() {
    const JCHHDR_INTERNAL_result = [];
    const JCHHDR_INTERNAL_consoleOutput = [];

    const JCHHDR_INTERNAL_originalLog = console.log;
    console.log = (...args) => {
        const line = args.map(a => String(a)).join('\t') + '\n';
        JCHHDR_INTERNAL_consoleOutput.push(line);
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
            const JCHHDR_INTRNAL_originalSolveFn = solve;
            let JCHHDR_INTERNAL_executionCounter = 0;
            solve = new Proxy(solve, {
                apply(target, thisArg, argumentsList) {
                    const JCHHDR_INTERNAL_currentExecutionCounter = JCHHDR_INTERNAL_executionCounter++;
                    const JCHHDR_INTERNAL_parentExecutionCounter = thisArg?.__executionCounter__ ?? null;
                    JCHHDR_INTERNAL_result.push(['enter', JCHHDR_INTERNAL_currentExecutionCounter, JCHHDR_INTERNAL_parentExecutionCounter, argumentsList.map(a => fnSolveArgToString(a))]);
                    let functionResult = JCHHDR_INTRNAL_originalSolveFn.apply({'__executionCounter__': JCHHDR_INTERNAL_currentExecutionCounter}, argumentsList);
                    JCHHDR_INTERNAL_result.push(['exit', JCHHDR_INTERNAL_currentExecutionCounter, JCHHDR_INTERNAL_parentExecutionCounter, fnSolveResultToString(functionResult)]);
                    return functionResult;
                }
            });
        }

        // [JCK]$USER CODE HERE$[HDR]

    } catch (err) {
        console.log(err);
    } finally {
        console.log = JCHHDR_INTERNAL_originalLog;
    }

    return [JCHHDR_INTERNAL_result, JCHHDR_INTERNAL_consoleOutput];
})();