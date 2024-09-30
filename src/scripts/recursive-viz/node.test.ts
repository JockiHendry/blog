import {describe, expect, test} from 'vitest';
import {Node} from './node';

describe('Node', function () {
    const tree = new Node(1, [1]);
    const node2 = new Node(2, [2]);
    const node5 = node2.addChild(new Node(5, [5]));
    tree.addChild(node2);
    const node3 = new Node(3, [3]);
    const node7 = node3.addChild(new Node(7, [7]));
    const node8 = node3.addChild(new Node(8, [8]));
    tree.addChild(node3);
    const node4 = new Node(4, [4]);
    const node9 = node4.addChild(new Node(9, [9]));
    tree.addChild(node4);

    test('getChild', () => {
        expect(tree.getChild(0)).toEqual(node2);
        expect(tree.getChild(1)).toEqual(node3);
        expect(tree.getChild(2)).toEqual(node4);
        expect(tree.getChild(3)).toBeNull();
        expect(node7.getChild(0)).toBeNull();
    });

    test('isLeaf', () => {
        expect(tree.isLeaf()).toBeFalsy();
        expect(node2.isLeaf()).toBeFalsy();
        expect(node5.isLeaf()).toBeTruthy();
        expect(node3.isLeaf()).toBeFalsy();
        expect(node7.isLeaf()).toBeTruthy();
        expect(node8.isLeaf()).toBeTruthy();
        expect(node4.isLeaf()).toBeFalsy();
        expect(node9.isLeaf()).toBeTruthy();
    });

    test('getLeftSibling', () => {
        expect(tree.getLeftSibling()).toBeNull();
        expect(node2.getLeftSibling()).toBeNull();
        expect(node3.getLeftSibling()).toEqual(node2);
        expect(node4.getLeftSibling()).toEqual(node3);
        expect(node5.getLeftSibling()).toBeNull();
        expect(node7.getLeftSibling()).toBeNull();
        expect(node8.getLeftSibling()).toEqual(node7);
        expect(node9.getLeftSibling()).toBeNull();
    });

    test('getRightSibling', () => {
        expect(tree.getRightSibling()).toBeNull();
        expect(node2.getRightSibling()).toEqual(node3);
        expect(node3.getRightSibling()).toEqual(node4);
        expect(node4.getRightSibling()).toBeNull();
        expect(node5.getRightSibling()).toBeNull();
        expect(node7.getRightSibling()).toEqual(node8);
        expect(node8.getRightSibling()).toBeNull();
        expect(node9.getRightSibling()).toBeNull();
    });

    test('getRightNeighbor', () => {
        expect(tree.getRightNeighbor()).toBeNull();
        expect(node2.getRightNeighbor()).toBeNull();
        expect(node3.getRightNeighbor()).toBeNull();
        expect(node4.getRightNeighbor()).toBeNull();
        expect(node5.getRightNeighbor()).toEqual(node7);
        expect(node7.getRightNeighbor()).toEqual(node9);
        expect(node8.getRightNeighbor()).toEqual(node9);
        expect(node9.getRightNeighbor()).toBeNull();
    });

    test('getLeftMost', () => {
        expect(tree.getLeftMost(0,1)).toEqual(node2);
        expect(tree.getLeftMost(0,2)).toEqual(node5);
        expect(tree.getLeftMost(0,3)).toBeNull();
        expect(node2.getLeftMost(0,1)).toEqual(node5);
        expect(node2.getLeftMost(0,2)).toBeNull();
        expect(node3.getLeftMost(0,1)).toEqual(node7);
        expect(node3.getLeftMost(0,2)).toBeNull();
    });

    test('findNodeByCanvasPosition', () => {
        const tree = new Node(1,[1]);
        tree.setX(0);
        tree.setY(0);
        const child = new Node(2,[2]);
        child.setX(100);
        child.setY(100);
        tree.addChild(child);
        expect(tree.findNodeByCanvasPosition(0, 0)).toEqual(tree);
        expect(tree.findNodeByCanvasPosition(10, 10)).toEqual(tree);
        expect(tree.findNodeByCanvasPosition(50, 50)).toEqual(tree);
        expect(tree.findNodeByCanvasPosition(60,60)).toBeNull();
        expect(tree.findNodeByCanvasPosition(80, 80)).toBeNull();
        expect(tree.findNodeByCanvasPosition(100, 100)).toEqual(child);
        expect(tree.findNodeByCanvasPosition(110, 110)).toEqual(child);
        expect(tree.findNodeByCanvasPosition(150, 150)).toEqual(child);
        expect(tree.findNodeByCanvasPosition(200, 200)).toBeNull();
    });

});
