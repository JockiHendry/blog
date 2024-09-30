import {Node} from './node';
import {WalkerTreeLayout} from './tree-layout';
import type {RawRecord} from './node-factory';
import {NodeFactory} from './node-factory';

export class Visualization {

    public static readonly DEFAULT_FONT_SIZE = 18;
    public static readonly MAXIMUM_FONT_SIZE = 40;
    public static readonly MINIMUM_FONT_SIZE = 6;

    private rawSource: RawRecord[] = [];

    private lastDragX = 0;
    private lastDragY = 0;
    private isDragging = false;

    private root: Node|null = null;

    private highlightedNode: Node|null = null;

    constructor(private ctx: CanvasRenderingContext2D, private width: number, private height: number, private step = 0,
                private fontSize = Visualization.DEFAULT_FONT_SIZE) {}

    getCurrentStep(): number {
        return this.step;
    }

    prevStep() {
        this.step = (this.step === 0) ? this.maxSteps() : (this.step - 1);
    }

    nextStep() {
        this.step = (this.step === this.maxSteps()) ? 0 : (this.step + 1);
    }

    getFontSize(): number {
        return this.fontSize;
    }

    decreaseFontSize() {
        if (this.fontSize > Visualization.MINIMUM_FONT_SIZE) {
            this.fontSize -= 2;
        }
    }

    increaseFontSize() {
        if (this.fontSize < Visualization.MAXIMUM_FONT_SIZE) {
            this.fontSize += 2;
        }
    }

    setSource(rawSource: RawRecord[]) {
        this.rawSource = rawSource;
        this.reset();
        this.clear();
    }

    clearSource() {
        this.setSource([]);
        this.root = null;
    }

    draw(): Node|null {
        if (this.rawSource == null) {
            return null;
        }
        this.clear();
        const root = new NodeFactory().create(this.rawSource.filter(r => r[1] <= this.step));
        if (root == null) {
            return null;
        }
        this.root = root;
        this.ctx.font = `${this.fontSize}px monospace`;
        this.measureSize(root);
        new WalkerTreeLayout(root, this.width / 2, 50).layout();
        this.render(root);
        return root;
    }

    private measureSize(node: Node) {
        this.ctx.font = `${this.fontSize}px Roboto`;
        node.measureSize(this.ctx);
        for (const c of node) {
            this.measureSize(c);
        }
    }

    render(node: Node) {
        node.render(this.ctx, node === this.highlightedNode);
        for (const c of node) {
            this.render(c);
        }
    }

    clear() {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    reset() {
        this.step = this.maxSteps();
        this.fontSize = 18;
    }

    maxSteps(): number {
        if (this.rawSource.length === 0) {
            return 0;
        }
        return Math.max.apply(null, this.rawSource.map(s => s[1]));
    }

    save() {
        if (this.rawSource.length === 0) {
            return;
        }
        const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        let minY = 0, maxY = 0;
        let minX = this.width, maxX = 0;
        for (let i=0; i<imageData.data.length; i++) {
            if (imageData.data[i] !== 255) {
                minY = Math.floor(i/(4*imageData.width));
                break;
            }
        }
        for (let i=imageData.data.length-1; i>=0; i--) {
            if (imageData.data[i] !== 255) {
                maxY = Math.floor(i/(4*imageData.width));
                break;
            }
        }
        for (let y=0; y<imageData.height; y++) {
            for (let x=0; x<imageData.width; x++) {
                const i = 4*x + 4*imageData.width*y;
                if (imageData.data[i] !== 255 || imageData.data[i+1] !== 255 ||
                    imageData.data[i+2] !== 255 || imageData.data[i+3] !== 255) {
                        if (x < minX) {
                            minX = x;
                        }
                        break;
                }
            }
            for (let x=imageData.width-1; x>=0; x--) {
                const i = 4*x + 4*imageData.width*y;
                if (imageData.data[i] !== 255 || imageData.data[i+1] !== 255 ||
                    imageData.data[i+2] !== 255 || imageData.data[i+3] !== 255) {
                    if (x > maxX) {
                        maxX = x;
                    }
                    break;
                }
            }
        }
        if (minY === maxY || minX === maxX) {
            return;
        }
        const contentWidth = (maxX - minX) + 1;
        const contentHeight = (maxY - minY) + 1;
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = contentWidth + 20;
        tmpCanvas.height = contentHeight + 20;
        const tmpCtx = tmpCanvas.getContext('2d', {alpha: false});
        if (tmpCtx == null) {
            alert('Canvas is not supported in this browser!');
            throw new Error("Can't get canvas context!");
        }
        tmpCtx.fillStyle = 'rgb(255,255,255)';
        tmpCtx.fillRect(0, 0, contentWidth + 20, contentHeight + 20)
        tmpCtx.drawImage(this.ctx.canvas, minX, minY, contentWidth, contentHeight, 10, 10, contentWidth, contentHeight);

        const a = document.createElement('a');
        a.setAttribute('href', tmpCanvas.toDataURL());
        a.setAttribute('download', 'recursive_visualizer.png');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    onMouseDown(mouseEvent: MouseEvent) {
        if (mouseEvent.button === 0) {
            const canvas = this.ctx.canvas;
            if (canvas.parentElement != null) {
                canvas.style.cursor = 'grab';
                this.lastDragX = canvas.parentElement.scrollLeft + mouseEvent.clientX;
                this.lastDragY = canvas.parentElement.scrollTop + mouseEvent.clientY;
                this.isDragging = true;
            }
        }
    }

    onMouseUp(_: MouseEvent) {
        const canvas = this.ctx.canvas;
        canvas.style.cursor = 'auto';
        this.isDragging = false;
    }

    onMouseMove(mouseEvent: MouseEvent) {
        const canvas = this.ctx.canvas;
        if (this.isDragging && canvas.parentElement != null) {
            canvas.parentElement.scrollTo(this.lastDragX - mouseEvent.clientX, this.lastDragY - mouseEvent.clientY);
            return;
        }
        const rect = canvas.getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left;
        const y = mouseEvent.clientY - rect.top;
        const node = this.root?.findNodeByCanvasPosition(x, y);
        if (node == null) {
            if (this.highlightedNode) {
                this.highlightedNode = null;
            }
        } else if (this.highlightedNode == null) {
            this.highlightedNode = node;
        }
        this.clear();
        if (this.root != null) {
            this.render(this.root);
        }

    }

    onMouseOut(_: MouseEvent) {
        const canvas = this.ctx.canvas;
        canvas.style.cursor = 'auto';
        this.isDragging = false;
        this.highlightedNode = null;
        this.clear();
        if (this.root != null) {
            this.render(this.root);
        }
    }

}
