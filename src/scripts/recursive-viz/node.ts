import type {ArgRenderer, IBinaryTreeNode} from './arg-renderer';
import {ArrayRowArgRenderer, BasicValueArgRenderer, MatrixArgRenderer, TreeArgRenderer} from './arg-renderer';
import type {ILayoutNode} from './tree-layout';
import {ArrowDirection} from './visualization';

export class Node implements Iterable<Node>, ILayoutNode {

    private static readonly WIDTH_SEPARATOR = 5;
    private width = 50;
    private height = 50;

    private readonly args: ArgRenderer[];

    constructor(public nodeIndex: number, value: any[], public parent: Node|null = null, private children: Node[] = [],
                private x = 0, private y = 0, private modifier = 0, private prelimX = 0,
                private leftNeighbor: Node|null = null, public returnValue: any = null) {
        this.args = value.map(a => {
            if (Array.isArray(a)) {
                if (a.length > 0 && Array.isArray(a[0])) {
                    return new MatrixArgRenderer(a);
                } else {
                    return new ArrayRowArgRenderer(a);
                }
            }
            if (a != null && typeof a === 'object' && 'val' in a && 'left' in a && 'right' in a) {
                return new TreeArgRenderer(a as IBinaryTreeNode);
            }
            return new BasicValueArgRenderer(a)
        });
    }

    getX(): number {
        return this.x;
    }

    setX(value: number) {
        this.x = value;
    }

    getY(): number {
        return this.y;
    }

    setY(value: number) {
        this.y = value;
    }

    getParent(): Node|null {
        return this.parent;
    }

    getModifier(): number {
        return this.modifier;
    }

    setModifier(value: number) {
        this.modifier = value;
    }

    getPrelimX(): number {
        return this.prelimX;
    }

    setPrelimX(value: number) {
        this.prelimX = value;
    }

    isLeaf(): boolean {
        return this.children.length === 0;
    }

    addChild(node: Node) {
        this.children.push(node);
        node.parent = this;
        return node;
    }

    *[Symbol.iterator](): IterableIterator<Node> {
        yield* this.children;
    }

    getChild(index: number): Node|null {
        if (this.children.length === 0 || index < 0 || index > this.children.length - 1) {
            return null;
        }
        return this.children[index] ?? null;
    }

    numOfChildren(): number {
        return this.children.length;
    }

    getLeftSibling(): Node|null {
        if (this.parent == null || this.parent.children.length === 1) {
            return null;
        }
        const index = this.parent.children.indexOf(this);
        return (index === 0) ? null : this.parent.children[index-1];
    }

    getRightSibling(): Node|null {
        if (this.parent == null || this.parent.children.length === 1) {
            return null;
        }
        const index = this.parent.children.indexOf(this);
        return (index === this.parent.children.length - 1) ? null : this.parent.children[index+1];
    }

    setLeftNeighbor(node: Node) {
        this.leftNeighbor = node;
    }

    getLeftNeighbor(): Node|null {
        return this.leftNeighbor;
    }

    getRightNeighbor(): Node|null {
        if ((this.parent == null) || (this.parent.parent == null)) {
            return null;
        }
        const parentIndex = this.parent.parent.children.indexOf(this.parent);
        if (parentIndex === this.parent.parent.children.length-1) {
            return null;
        }
        const siblingParent = this.parent.parent.children[parentIndex+1];
        return siblingParent.children.length === 0 ? null : siblingParent.children[0];
    }

    getLeftMost(level: number, depth: number): Node|null {
        if (level >= depth) {
            return this;
        } else if (this.isLeaf()) {
            return null;
        } else {
            let child = this.getChild(0)!;
            let leftMost = child.getLeftMost(level + 1, depth) ?? null;
            while (leftMost == null && child.getRightSibling() != null) {
                child = child.getRightSibling()!;
                leftMost = child.getLeftMost(level+1, depth);
            }
            return leftMost;
        }
    }

    getArgs(): ArgRenderer[] {
        return this.args;
    }

    getArg(index: number): ArgRenderer|null {
        return this.args[index] ?? null;
    }

    measureSize(ctx: CanvasRenderingContext2D) {
        let maxWidth = 0;
        let maxHeight = 10;
        for (const a of this.args) {
            const dimension = a.getDimension(ctx);
            maxWidth += dimension.width + Node.WIDTH_SEPARATOR;
            maxHeight = Math.max(maxHeight, dimension.height);
        }
        this.height = maxHeight;
        this.width = maxWidth;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    render(ctx: CanvasRenderingContext2D, highlight = false, direction = ArrowDirection.FROM_PARENT) {
        ctx.save();
        if (highlight) {
            ctx.lineWidth = 2;
        }
        let curX = this.x;
        ctx.fillStyle = highlight ? "blue": "black";
        for (const a of this.args) {
            ctx.beginPath();
            const dimension = a.getDimension(ctx);
            a.render(ctx, curX, this.y, dimension.width, dimension.height);
            curX += dimension.width + Node.WIDTH_SEPARATOR;
            ctx.moveTo(curX, this.y);
            ctx.lineTo(curX, this.y + this.height);
            ctx.stroke();
        }
        ctx.strokeStyle = highlight ? "rgb(10,10,200)": "rgb(50,50,50)";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        if (highlight) {
            direction = (direction === ArrowDirection.FROM_PARENT) ? ArrowDirection.TO_PARENT : ArrowDirection.FROM_PARENT;
        }
        let text = '(null)';
        if (direction === ArrowDirection.FROM_PARENT) {
            text = `#${this.nodeIndex}`;
        } else if (direction === ArrowDirection.TO_PARENT) {
            text = `${this.returnValue == null ? '(null)' : String(this.returnValue)}`;
        }
        this.drawConnector(ctx, highlight, text, direction);
        ctx.restore();
    }

    private drawConnector(ctx: CanvasRenderingContext2D, highlight: boolean, text?: string, direction = ArrowDirection.FROM_PARENT) {
        if (this.parent == null) return;
        ctx.save();
        ctx.beginPath();
        let sourceX = 0, sourceY = 0, targetX = 0, targetY = 0;
        if (direction === ArrowDirection.FROM_PARENT) {
            sourceX = this.parent.x + this.parent.getWidth() / 2;
            sourceY = this.parent.y + this.parent.getHeight();
            targetX = this.x + this.getWidth() / 2;
            targetY = this.y - 5;
        } else if (direction === ArrowDirection.TO_PARENT) {
            sourceX = this.x + this.getWidth() / 2;
            sourceY = this.y;
            targetX = this.parent.x + this.parent.getWidth() / 2;
            targetY = this.parent.y + this.parent.getHeight() + 3;
        }
        let angle = Math.atan2(targetY - sourceY, targetX - sourceX);
        ctx.lineCap = "round";
        ctx.moveTo(sourceX, sourceY);
        ctx.lineTo(targetX, targetY);
        ctx.lineTo(targetX - 7 * Math.cos(angle - Math.PI / 6), targetY - 7 * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(targetX - 7 * Math.cos(angle + Math.PI / 6), targetY - 7 * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        if (text != null) {
            ctx.textBaseline =  "bottom";
            let middleX = Math.abs(sourceX + (targetX - sourceX) / 2);
            if ((angle < 0 ? angle + Math.PI : angle) > (Math.PI / 2)) {
                ctx.textAlign = "end";
                middleX -= 10;
            } else {
                ctx.textAlign = "start";
                middleX += 10;
            }
            ctx.font = highlight ? "14px monospace": "12px monospace";
            ctx.fillStyle = highlight ? "rgb(10,10,200)": "rgb(50,50,50)";
            ctx.fillText(text, middleX, Math.abs(sourceY + (targetY - sourceY) / 2));
        }
        ctx.restore();
    }

    findNodeByCanvasPosition(x: number, y: number): Node|null {
        if (x >= this.x && x <= this.x + this.getWidth() &&
            y >= this.y && y <= this.y + this.getHeight()) {
                return this;
        }
        if (this.isLeaf()) {
            return null;
        }
        for (const c of this.children) {
            const result = c.findNodeByCanvasPosition(x, y);
            if (result != null) {
                return result;
            }
        }
        return null;
    }

}