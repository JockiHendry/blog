import {CodeRunner} from './runner';
import fibonacciCodeTemplate from './template/fibonacci?raw';
import nQueenCodeTemplate from './template/n-queen?raw';
import palindromeCodeTemplate from './template/palindrome?raw';
import quicksortCodeTemplate from './template/quicksort?raw';
import mirrorBinaryTreeTemplate from './template/binary-tree-mirror?raw';
import {Visualization} from './visualization';


// HTML Elements
const editorContainerElement = document.getElementById('container');
const outputElement = document.getElementById('runOutput');
const codeTemplateMenu = document.getElementById('codeTemplateMenu');
const codeTemplateButton = document.getElementById('codeTemplateBtn');
const fibonacciTemplateMenu = document.getElementById('fibonacciTemplateMenu');
const mirrorBinaryTreeTemplateMenu = document.getElementById('mirrorBinaryTreeTemplateMenu');
const nQueenTemplateMenu = document.getElementById('nQueenTemplateMenu');
const palindromeTemplateMenu = document.getElementById('palindromeTemplateMenu');
const quicksortTemplateMenu = document.getElementById('quicksortTemplateMenu');
const runButton = document.getElementById('runBtn');
const clearOutputButton = document.getElementById('clearBtn');
const canvas = document.getElementById('visualization') as HTMLCanvasElement;
const prevStepButton = document.getElementById("prevStepBtn");
const stepLabel = document.getElementById("stepLabel");
const nextStepButton = document.getElementById("nextStepBtn");
const resetButton = document.getElementById("resetBtn");
const zoomOutButton = document.getElementById("zoomOutBtn");
const zoomInButton = document.getElementById("zoomInBtn");
const downloadButton = document.getElementById("downloadBtn");

let visualization: Visualization;

if ((editorContainerElement == null) || (outputElement == null) || (codeTemplateButton == null) ||
    (codeTemplateMenu == null) || (runButton == null) || (clearOutputButton == null) || (canvas == null) ||
    (prevStepButton == null) || (stepLabel == null) || (resetButton == null) || (nextStepButton == null) ||
    (zoomOutButton == null) || (zoomInButton == null) || (downloadButton == null)) {
    alert('Required UI element is not found.  Please reload the page and try again!');
} else {
    const codeEditor = setupCodeEditor(editorContainerElement);
    visualization = setupVisualization(canvas, prevStepButton, stepLabel, nextStepButton, resetButton, zoomOutButton, zoomInButton, downloadButton);
    addCodeTemplateActionBinding(codeTemplateButton, codeTemplateMenu, codeEditor);
    addRunActionBinding(runButton, clearOutputButton, outputElement, codeEditor, visualization, stepLabel);
}

// Controller

//@ts-ignore
function setupCodeEditor(editorContainerElement: HTMLElement): editor.ICodeEditor {
    //@ts-ignore
    const typescriptDefaults = monaco.languages.typescript.typescriptDefaults;
    typescriptDefaults.setEagerModelSync(true);
    typescriptDefaults.addExtraLib(`
        class TreeNode {
            constructor(public val: any, public left?: TreeNode, public right?: TreeNode) {}
        }
    `);
    //@ts-ignore
    return monaco.editor.create(editorContainerElement, {
        language: 'typescript',
        automaticLayout: true,
    });
}

function setupVisualization(canvas: HTMLCanvasElement, prevStepButton: HTMLElement, stepLabel: HTMLElement, nextStepButton: HTMLElement,
                            resetButton: HTMLElement, zoomOutButton: HTMLElement, zoomInButton: HTMLElement,
                            downloadButton: HTMLElement): Visualization {
    const ctx = canvas.getContext('2d', {alpha: false});
    if (ctx == null) {
        alert('Canvas is not supported in this browser!');
        throw new Error('Canvas is not supported');
    }
    canvas.addEventListener("mousedown", e => visualization.onMouseDown(e));
    canvas.addEventListener("mouseup", e => visualization.onMouseUp(e));
    canvas.addEventListener("mousemove", e => visualization.onMouseMove(e));
    canvas.addEventListener("mouseout", e => visualization.onMouseOut(e));
    const visualization = new Visualization(ctx, canvas.width, canvas.height);
    visualization.reset();
    visualization.clear();
    prevStepButton.addEventListener('click', () => {
        visualization.prevStep();
        stepLabel.innerText = `Step #${visualization.getCurrentStep()}`;
        visualization.draw();
    });
    nextStepButton.addEventListener('click', () => {
        visualization.nextStep();
        stepLabel.innerText = `Step #${visualization.getCurrentStep()}`;
        visualization.draw();
    })
    zoomOutButton.addEventListener('click', () => {
        visualization.decreaseFontSize();
        visualization.draw();
    });
    zoomInButton.addEventListener('click', () => {
        visualization.increaseFontSize();
        visualization.draw();
    });
    resetButton.addEventListener('click', () => {
        visualization.reset();
        visualization.draw();
        stepLabel.innerText = `Step #${visualization.getCurrentStep()}`;
    })
    downloadButton.addEventListener('click', () => {
        visualization.save();
    })
    return visualization;
}

function addCodeTemplateActionBinding(codeTemplateButton: HTMLElement, codeTemplateMenu: HTMLElement, codeEditor: any) {
    codeTemplateButton.addEventListener('click', () => toggleCodeTemplateMenu(codeTemplateMenu));
    codeTemplateMenu.addEventListener('mouseleave', () => {
        if (codeTemplateMenu.classList.contains('opacity-100')) {
            codeTemplateMenu.classList.remove('opacity-100', 'scale-100');
            codeTemplateMenu.classList.add('opacity-0', 'scale-95');
            codeTemplateMenu.classList.add('hidden');
        }
    });
    fibonacciTemplateMenu?.addEventListener('click', () => {
        selectTemplate(fibonacciCodeTemplate, codeEditor);
        toggleCodeTemplateMenu(codeTemplateMenu);
    });
    mirrorBinaryTreeTemplateMenu?.addEventListener('click', () => {
        selectTemplate(mirrorBinaryTreeTemplate, codeEditor);
        toggleCodeTemplateMenu(codeTemplateMenu);
    });
    nQueenTemplateMenu?.addEventListener('click', () => {
        selectTemplate(nQueenCodeTemplate, codeEditor);
        toggleCodeTemplateMenu(codeTemplateMenu);
    });
    palindromeTemplateMenu?.addEventListener('click', () => {
        selectTemplate(palindromeCodeTemplate, codeEditor);
        toggleCodeTemplateMenu(codeTemplateMenu);
    });
    quicksortTemplateMenu?.addEventListener('click', () => {
       selectTemplate(quicksortCodeTemplate, codeEditor);
       toggleCodeTemplateMenu(codeTemplateMenu);
    });
}

function toggleCodeTemplateMenu(codeTemplateMenu: HTMLElement) {
    if (codeTemplateMenu.classList.contains('opacity-0')) {
        codeTemplateMenu.classList.remove('hidden');
        codeTemplateMenu.classList.remove('opacity-0', 'scale-95')
        codeTemplateMenu.classList.add('opacity-100', 'scale-100');
    } else {
        codeTemplateMenu.classList.remove('opacity-100', 'scale-100');
        codeTemplateMenu.classList.add('opacity-0', 'scale-95');
        codeTemplateMenu.classList.add('hidden');
    }
}

function selectTemplate(template: string, codeEditor: any) {
    codeEditor.setValue(template.replace(`// @ts-nocheck`, '').trimStart());
}

function addRunActionBinding(runButton: HTMLElement, clearOutputButton: HTMLElement, outputElement: HTMLElement,
                             codeEditor: any, visualization: Visualization, stepLabel: HTMLElement) {
    runButton.addEventListener('click', () => {
        const runner = new CodeRunner(codeEditor.getValue(), (message) => {
            outputElement.textContent = message;
        });
        const result = runner.execute();
        visualization.setSource(result);
        const root = visualization.draw();
        if (root != null) {
            canvas.parentElement?.scrollTo(root.getX() - 100, 0);
            stepLabel.innerText = `Step #${visualization.getCurrentStep()}`;
        }
    });
    clearOutputButton.addEventListener('click', () => {
        outputElement.textContent = '';
        stepLabel.innerText = '';
        visualization?.clearSource();
    });
}
