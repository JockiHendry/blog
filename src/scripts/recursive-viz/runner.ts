import * as ts from "typescript";
import codeTemplate from './template/intercepted_code?raw';
import type {RawRecord} from './node-factory';

export class CodeRunner {
    public readonly completeCode: string;

    constructor(private code: string, private log: (msg: string)=>void) {
        this.completeCode = codeTemplate.replace(`// [JCK]$USER CODE HERE$[HDR]`, this.addContextToSolveFunction(code));
    }

    addContextToSolveFunction(code: string): string {
        const matches = code.match(/function\s+solve\(/);
        if (matches == null || matches.length === 0) {
            return code;
        }
        const startFrom = code.indexOf(matches[0]) + matches[0].length;
        return code.slice(0, startFrom) + code.slice(startFrom).replaceAll(/solve\(/g, 'solve.call(this, ');
    }

    execute(): RawRecord[] {
        this.log('Running...');
        const transpiledCode = ts.transpile(this.completeCode);
        const [result, consoleOutput] = eval(transpiledCode);
        this.log(consoleOutput.join(''));
        return result;
    }

}
