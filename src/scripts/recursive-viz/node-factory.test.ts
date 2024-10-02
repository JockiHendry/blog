import {describe, expect, test} from 'vitest';
import {NodeFactory} from './node-factory';
import type {RawRecord} from './node-factory';


describe('NodeFactory', function () {
    test('convert raw data into tree', () => {
        const data: RawRecord[] = [
            ["enter",0,null,[3]],
            ["enter",1,0,[2]],
            ["enter",2,1,[1]],
            ["exit",2,1,1],
            ["enter",3,1,[0]],
            ["exit",3,1,0],
            ["exit",1,0,1],
            ["enter",4,0,[1]],
            ["exit",4,0,1],
            ["exit",0,null,2]
        ];
        const tree = new NodeFactory().create(data)!;
        expect(tree.getArg(0)?.getValue()).toEqual(3);
        expect(tree.nodeIndex).toEqual(0);
        expect(tree.numOfChildren()).toEqual(2);
        expect(tree.returnValue).toEqual(2);
        const child1 = tree.getChild(0)!;
        const child2 = tree.getChild(1)!;
        expect(child1.getArg(0)?.getValue()).toEqual(2);
        expect(child1.nodeIndex).toEqual(1);
        expect(child1.returnValue).toEqual(1);
        expect(child2.getArg(0)?.getValue()).toEqual(1);
        expect(child2.nodeIndex).toEqual(4);
        expect(child2.isLeaf()).toBeTruthy();
        expect(child2.numOfChildren()).toEqual(0);
        expect(child2.returnValue).toEqual(1);
        const grandChild1 = child1.getChild(0)!;
        const grandChild2 = child1.getChild(1)!;
        expect(grandChild1.getArg(0)?.getValue()).toEqual(1);
        expect(grandChild1.nodeIndex).toEqual(2);
        expect(grandChild1.isLeaf()).toBeTruthy();
        expect(grandChild1.returnValue).toEqual(1);
        expect(grandChild2.getArg(0)?.getValue()).toEqual(0);
        expect(grandChild2.nodeIndex).toEqual(3);
        expect(grandChild2.isLeaf()).toBeTruthy();
        expect(grandChild2.returnValue).toEqual(0);
    });

    test('group unrelated root calls (non-recursive) under one virtual root node', () => {
        const data: RawRecord[] = [
            ["enter",0,null,[1]],
            ["exit",0,null,9],
            ["enter",1,null,[2]],
            ["exit",1,null,8],
            ["enter",2,null,[3]],
            ["exit",2,null,7],
        ];
        const tree = new NodeFactory().create(data)!;
        expect(tree.getArg(0)?.getValue()).toEqual('(main)');
        expect(tree.nodeIndex).toEqual(-1);
        expect(tree.numOfChildren()).toEqual(3);
        expect(tree.returnValue).toBeNull();
        const child1 = tree.getChild(0)!;
        expect(child1.getArg(0)?.getValue()).toEqual(1);
        expect(child1.nodeIndex).toEqual(0);
        expect(child1.numOfChildren()).toEqual(0);
        expect(child1.returnValue).toEqual(9);
        const child2 = tree.getChild(1)!;
        expect(child2.getArg(0)?.getValue()).toEqual(2);
        expect(child2.nodeIndex).toEqual(1);
        expect(child2.numOfChildren()).toEqual(0);
        expect(child2.returnValue).toEqual(8);
        const child3 = tree.getChild(2)!;
        expect(child3.getArg(0)?.getValue()).toEqual(3);
        expect(child3.nodeIndex).toEqual(2);
        expect(child3.numOfChildren()).toEqual(0);
        expect(child3.returnValue).toEqual(7);
    });

});
