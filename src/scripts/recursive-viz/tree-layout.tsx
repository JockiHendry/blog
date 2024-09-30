export class WalkerTreeLayout {

    private readonly MAX_LEVEL = 50;

    private SIBLING_SEPARATION = 10;
    private SUBTREE_SEPARATION = 20;
    private LEVEL_SEPARATION = 10;
    private xTopAdjustment = 0;
    private yTopAdjustment = 0;

    private prevNodes: ILayoutNode[] = new Array(this.MAX_LEVEL);

    constructor(public root: ILayoutNode, rootX: number, rootY: number) {
        root.setX(rootX);
        root.setY(rootY);
    }

    layout() {
        this.firstWalk(this.root, 0);
        this.xTopAdjustment = this.root.getX() - this.root.getPrelimX();
        this.yTopAdjustment = this.root.getY();
        this.secondWalk(this.root, 0, 0);
    }

    private firstWalk(node: ILayoutNode, level: number) {
        node.setLeftNeighbor(this.prevNodes[level]);
        this.prevNodes[level] = node;
        node.setModifier(0);
        if (node.isLeaf() || level === this.MAX_LEVEL) {
            const leftSibling = node.getLeftSibling();
            if (leftSibling == null) {
                node.setPrelimX(0);
            } else {
                node.setPrelimX(leftSibling.getPrelimX() + this.SIBLING_SEPARATION + this.meanNodeSize(leftSibling, node));
            }
        } else {
            let leftMostNode = node.getChild(0)!;
            let rightMostNode = node.getChild(0)!;
            this.firstWalk(leftMostNode, level + 1);
            while (rightMostNode.getRightSibling() != null) {
                rightMostNode = rightMostNode.getRightSibling()!;
                this.firstWalk(rightMostNode, level+1);
            }
            const midPoint = (leftMostNode.getPrelimX()  + rightMostNode.getPrelimX()) / 2;
            if (node.getLeftSibling() == null) {
                node.setPrelimX(midPoint);
            } else {
                const leftSibling = node.getLeftSibling()!;
                node.setPrelimX(leftSibling.getPrelimX() + this.SIBLING_SEPARATION + this.meanNodeSize(leftSibling, node))
                node.setModifier(node.getPrelimX() - midPoint);
                this.apportion(node, level);
            }
        }
    }

    private secondWalk(node: ILayoutNode, level: number, modsum: number) {
        if (level <= this.MAX_LEVEL) {
            node.setX(this.xTopAdjustment + node.getPrelimX() + modsum);
            node.setY(this.yTopAdjustment + ((node.getParent()?.getY() ?? 0) + (node.getParent()?.getHeight() ?? 0)) + this.LEVEL_SEPARATION);
            if (!node.isLeaf()) {
                this.secondWalk(node.getChild(0)!, level+1, modsum + node.getModifier());
            }
            if (node.getRightSibling() != null) {
                this.secondWalk(node.getRightSibling()!, level, modsum);
            }

        }
    }
    private meanNodeSize(leftNode: ILayoutNode, rightNode: ILayoutNode): number {
        return Math.max(leftNode.getWidth(), rightNode.getWidth()) + 10;
    }
    private apportion(node: ILayoutNode, level: number) {
        let leftMost: ILayoutNode|null = node.getChild(0)!;
        let neighbor = leftMost.getLeftNeighbor() ?? null;
        let compareDepth = 1;

        while (leftMost != null && neighbor != null && (compareDepth <= (this.MAX_LEVEL - level))) {
            let leftModSum = 0;
            let rightModSum = 0;
            let ancestorLeftMost = leftMost;
            let ancestorNeighbor = neighbor;
            for (let i=0; i<compareDepth; i++) {
                if (ancestorLeftMost.getParent() != null) {
                    ancestorLeftMost = ancestorLeftMost.getParent()!;
                    rightModSum += ancestorLeftMost.getModifier();
                }
                if (ancestorNeighbor.getParent() != null) {
                    ancestorNeighbor = ancestorNeighbor.getParent()!;
                    leftModSum += ancestorNeighbor.getModifier();
                }
            }
            let moveDistance = (neighbor.getPrelimX() + leftModSum + this.SUBTREE_SEPARATION +
                this.meanNodeSize(leftMost, neighbor)) - (leftMost.getPrelimX() + rightModSum) ;
            if (moveDistance > 0) {
                let temp: ILayoutNode|null = node;
                let leftSiblings = 0;
                while ((temp != null) && (temp !== ancestorNeighbor)) {
                    leftSiblings++;
                    temp = temp.getLeftSibling();
                }
                if (temp != null) {
                    const portion = moveDistance / leftSiblings;
                    temp = node;
                    while (temp != null && temp !== ancestorNeighbor) {
                        temp.setPrelimX(temp.getPrelimX() + moveDistance);
                        temp.setModifier(temp.getModifier() + moveDistance);
                        moveDistance -= portion;
                        temp = temp.getLeftSibling();
                    }
                } else {
                    return;
                }
            }
            compareDepth = compareDepth + 1;
            if (leftMost.isLeaf()) {
                leftMost = node.getLeftMost(0, compareDepth);
            } else {
                leftMost = leftMost.getChild(0);
            }
            if (leftMost != null) {
                neighbor = leftMost.getLeftNeighbor();
            }
        }
    }

}

export interface ILayoutNode {
    getX(): number;
    setX(value: number): void;
    getY(): number;
    setY(value: number): void;
    getParent(): ILayoutNode|null;
    getModifier(): number;
    setModifier(value: number): void;
    getPrelimX(): number;
    setPrelimX(value: number): void;
    isLeaf(): boolean;
    getLeftSibling(): ILayoutNode|null;
    getRightSibling(): ILayoutNode|null;
    getLeftNeighbor(): ILayoutNode|null;
    setLeftNeighbor(node: ILayoutNode): void;
    getLeftMost(level: number, depth: number): ILayoutNode|null;
    getWidth(): number;
    getHeight(): number;
    getChild(index: number): ILayoutNode|null;
}
