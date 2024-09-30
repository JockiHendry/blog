import {describe, expect, test} from 'vitest';
import {NodeFactory} from './node-factory';
import {BasicValueArgRenderer} from './arg-renderer';

describe('NodeFactory', function () {
    test('convert raw data into tree', () => {
        const data: ['enter'|'exit', number, number|null, any][] = [
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
        expect((tree.getArgs()[0] as BasicValueArgRenderer).value).toEqual(3);
        expect(tree.nodeIndex).toEqual(0);
        expect(tree.numOfChildren()).toEqual(2);
        expect(tree.returnValue).toEqual(2);
        const child1 = tree.getChild(0)!;
        const child2 = tree.getChild(1)!;
        expect((child1.getArgs()[0] as BasicValueArgRenderer).value).toEqual(2);
        expect(child1.nodeIndex).toEqual(1);
        expect(child1.returnValue).toEqual(1);
        expect((child2.getArgs()[0] as BasicValueArgRenderer).value).toEqual(1);
        expect(child2.nodeIndex).toEqual(4);
        expect(child2.isLeaf()).toBeTruthy();
        expect(child2.numOfChildren()).toEqual(0);
        expect(child2.returnValue).toEqual(1);
        const grandChild1 = child1.getChild(0)!;
        const grandChild2 = child1.getChild(1)!;
        expect((grandChild1.getArgs()[0] as BasicValueArgRenderer).value).toEqual(1);
        expect(grandChild1.nodeIndex).toEqual(2);
        expect(grandChild1.isLeaf()).toBeTruthy();
        expect(grandChild1.returnValue).toEqual(1);
        expect((grandChild2.getArgs()[0] as BasicValueArgRenderer).value).toEqual(0);
        expect(grandChild2.nodeIndex).toEqual(3);
        expect(grandChild2.isLeaf()).toBeTruthy();
        expect(grandChild2.returnValue).toEqual(0);
    });

});
