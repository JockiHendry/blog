import {WalkerTreeLayout} from './tree-layout';
import type {ILayoutNode} from './tree-layout';

export interface ArgRenderer {
    getDimension(ctx: CanvasRenderingContext2D): Dimension;
    render(ctx: CanvasRenderingContext2D, x: number, y: number, width: number): void;
}

export interface Dimension {
    width: number;
    height: number;
}

export class BasicValueArgRenderer implements ArgRenderer {

    public static readonly WIDTH_PADDING = 20;

    constructor(public value: any) {}

    getDimension(ctx: CanvasRenderingContext2D): Dimension {
        const measurement = ctx.measureText(` ${String(this.value)} `);
        return {
            width: Math.max(measurement.width + BasicValueArgRenderer.WIDTH_PADDING, 30),
            height: Math.max(measurement.actualBoundingBoxAscent + measurement.actualBoundingBoxDescent, 30),
        };
    }

    render(ctx: CanvasRenderingContext2D, x: number, y: number, width: number): void {
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        ctx.fillText(String(this.value), x + width / 2, y);
    }

}

export class ArrayRowArgRenderer implements ArgRenderer {

    private boxWidth = 0;
    private boxHeight = 0;


    constructor(public value: any[]) {}

    getDimension(ctx: CanvasRenderingContext2D): Dimension {
        let maximumWidth = 0;
        let maximumHeight = 0;
        for (const v of this.value) {
            const measurement = ctx.measureText(` ${String(v)} `);
            maximumHeight = Math.max(maximumHeight, measurement.actualBoundingBoxAscent + measurement.actualBoundingBoxDescent);
            maximumWidth = Math.max(maximumWidth, measurement.width);
        }
        this.boxWidth = maximumWidth + 5;
        this.boxHeight = maximumHeight + 10;
        return {
            width: Math.max(this.boxWidth * this.value.length + 10, 30),
            height: Math.max(this.boxHeight, 30),
        }
    }

    render(ctx: CanvasRenderingContext2D, x: number, y: number, width: number): void {
        ctx.save();
        x += 5;
        for (const v of this.value) {
            ctx.strokeRect(x, y, this.boxWidth, this.boxHeight);
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText(` ${String(v)} `, x+(this.boxWidth)/2, y+this.boxHeight/2);
            x += this.boxWidth;
        }
        ctx.restore();
    }

}

export class MatrixArgRenderer implements ArgRenderer {

    private cellWidth = 0;
    private cellHeight = 0;

    constructor(public value: any[][]) {}

    getDimension(ctx: CanvasRenderingContext2D): Dimension {
        let maxHeight = 0;
        let maxWidth = 0;
        for (const row of this.value) {
            for (const v of row) {
                const measurement = ctx.measureText(` ${String(v)} `);
                maxHeight = Math.max(maxHeight, measurement.actualBoundingBoxAscent + measurement.actualBoundingBoxDescent);
                maxWidth = Math.max(maxWidth, measurement.width);
            }
        }
        this.cellWidth = maxWidth + 5;
        this.cellHeight = maxHeight + 10;
        return {
            width: Math.max(this.value.length === 0 ? 0 : this.value[0].length * this.cellWidth + 10, 30),
            height: Math.max(this.value.length * this.cellHeight + 5, 30),
        };
    }

    render(ctx: CanvasRenderingContext2D, x: number, y: number, width: number): void {
        ctx.save();
        let cy = y;
        for (const row of this.value) {
            let cx = x + 5
            for (const v of row) {
                ctx.strokeRect(cx, cy, this.cellWidth, this.cellHeight);
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.fillText(` ${String(v)} `, cx + this.cellWidth/2, cy + this.cellHeight/2);
                cx += this.cellWidth;
            }
            cy += this.cellHeight;
        }
        ctx.restore();
    }

}

export interface IBinaryTreeNode {
    val: any;
    left?: IBinaryTreeNode;
    right?: IBinaryTreeNode;
}

export class BinaryTreeNode implements ILayoutNode {
    public x = 0;
    public y = 0;
    public val: any;
    public left: BinaryTreeNode|null = null;
    public right: BinaryTreeNode|null = null;
    private prelimX = 0;
    private leftNeighbor: BinaryTreeNode|null = null;
    private modifier = 0;
    private parent: BinaryTreeNode|null = null;

    constructor(node: IBinaryTreeNode) {
        this.val = node.val;
        if (node.left != null) {
            this.left = new BinaryTreeNode(node.left);
            this.left.parent = this;
        }
        if (node.right != null) {
            this.right = new BinaryTreeNode(node.right);
            this.right.parent = this;
        }
    }

    getChild(index: number): BinaryTreeNode|null {
        if (index === 0) {
            return this.left ?? this.right;
        } else if (index === 1) {
            return this.right ?? null;
        } else {
            return null;
        }
    }

    getHeight(): number {
        return 10;
    }

    getLeftMost(): BinaryTreeNode {
        let node: BinaryTreeNode = this;
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }

    getLeftSibling(): ILayoutNode | null {
        if (this.parent == null || this.parent.left == null || this.parent.left === this) {
            return null;
        }
        return this.parent.left ?? null;
    }

    getRightSibling(): ILayoutNode | null {
        if (this.parent == null || this.parent.right == null || this.parent.right === this) {
            return null;
        }
        return this.parent.right ?? null;
    }
    getWidth(): number {
        return 10;
    }

    getBounds(): Dimension {
        const queue: BinaryTreeNode[] = [this];
        let minX = this.x;
        let minY = this.y;
        let maxX = this.x;
        let maxY = this.y;
        while (queue.length > 0) {
            const node = queue.shift()!;
            if (node.x < minX) {
                minX = node.x;
            } else if (node.x > maxX) {
                maxX = node.x;
            }
            if (node.y < minY) {
                minY = node.y;
            } else if (node.y > maxY) {
                maxY = node.y;
            }
            if (node.left != null) {
                queue.push(node.left);
            }
            if (node.right != null) {
                queue.push(node.right);
            }
        }
        return {
            width: maxX - minX,
            height: maxY - minY,
        };
    }

    isLeaf(): boolean {
        return this.left == null && this.right == null;
    }

    getLeftNeighbor(): BinaryTreeNode | null {
        return this.leftNeighbor;
    }

    getModifier(): number {
        return this.modifier;
    }

    getParent(): BinaryTreeNode | null {
        return this.parent;
    }

    getPrelimX(): number {
        return this.prelimX;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    setLeftNeighbor(node: BinaryTreeNode): void {
        this.leftNeighbor = node;
    }

    setModifier(value: number): void {
        this.modifier = value;
    }

    setPrelimX(value: number): void {
        this.prelimX = value;
    }

    setX(value: number): void {
        this.x = value;
    }

    setY(value: number): void {
        this.y = value;
    }
}

export class TreeArgRenderer implements ArgRenderer {

    private readonly root: BinaryTreeNode;
    private readonly width: number = 100;
    private readonly height: number = 100;

    private readonly RADIUS = 10;

    constructor(public value: IBinaryTreeNode) {
        this.root = new BinaryTreeNode(value);
        new WalkerTreeLayout(this.root, 50, 10).layout();
        const bounds = this.root.getBounds();
        this.width = Math.max(bounds.width, 100);
        this.height = 20 + bounds.height + 2 * this.RADIUS;
    }

    getDimension(ctx: CanvasRenderingContext2D): Dimension {
        return {
            width: Math.max(this.width, 30),
            height: Math.max(this.height, 30),
        }
    }

    render(ctx: CanvasRenderingContext2D, x: number, y: number, width: number): void {
        ctx.save();
        this.renderNode(ctx, this.root, x, y);
        ctx.beginPath();
        ctx.moveTo(x, y + this.height);
        ctx.lineTo(x + width, y + this.height);
        ctx.stroke();
        ctx.restore();
    }

    renderNode(ctx: CanvasRenderingContext2D, node: BinaryTreeNode, x: number, y: number) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + node.x, y + node.y,10, 0, 2*Math.PI);
        ctx.stroke();
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(node.val, x + node.x, y + node.y);
        if (node.getParent() != null) {
            this.renderConnectionLine(ctx, 10, x + node.x, y + node.y, x + node.getParent()!.getX(), y + node.getParent()!.getY());
        }
        if (node.left != null) {
            this.renderNode(ctx, node.left, x, y);
        }
        if (node.right != null) {
            this.renderNode(ctx, node.right, x, y);
        }
        ctx.restore();
    }

    renderConnectionLine(ctx: CanvasRenderingContext2D, radius: number, sourceX: number, sourceY: number, targetX: number, targetY: number) {
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const L = Math.sqrt(dx*dx + dy*dy);
        const rL = radius/L;
        ctx.beginPath();
        ctx.moveTo(sourceX + dx * rL, sourceY + dy * rL);
        ctx.lineTo(targetX - dx * rL, targetY - dy * rL);
        ctx.stroke();
    }
}
