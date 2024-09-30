import {describe, expect, test} from 'vitest';
import type {RawRecord} from './node-factory';
import {NodeFactory} from './node-factory';
import {WalkerTreeLayout} from './tree-layout';

describe('TreeLayout', function () {

    test('layout', () => {
        const data: RawRecord[] = [
            ["enter",0,null,[8]],["enter",1,0,[7]],["enter",2,1,[6]],["enter",3,2,[5]],["enter",4,3,[4]],["enter",5,4,[3]],
            ["enter",6,5,[2]],["enter",7,6,[1]],["exit",7,6,1],["enter",8,6,[0]],["exit",8,6,0],["exit",6,5,1],["enter",9,5,[1]],
            ["exit",9,5,1],["exit",5,4,2],["enter",10,4,[2]],["enter",11,10,[1]],["exit",11,10,1],["enter",12,10,[0]],
            ["exit",12,10,0],["exit",10,4,1],["exit",4,3,3],["enter",13,3,[3]],["enter",14,13,[2]],["enter",15,14,[1]], ["exit",15,14,1],
        ];
        const root  = (new NodeFactory()).create(data)!;
        const layout = new WalkerTreeLayout(root, 500, 500);
        layout.layout();
        expect(root.getX()).toMatchInlineSnapshot(`500`);
        expect(root.getY()).toMatchInlineSnapshot(`510`);
        const node1 = root.getChild(0)!;
        expect(node1.getX()).toMatchInlineSnapshot(`500`);
        expect(node1.getY()).toMatchInlineSnapshot(`1070`);
        const node2 = node1.getChild(0)!;
        expect(node2.getX()).toMatchInlineSnapshot(`500`);
        expect(node2.getY()).toMatchInlineSnapshot(`1630`);
        const node3 = node2.getChild(0)!;
        expect(node3.getX()).toMatchInlineSnapshot(`500`);
        expect(node3.getY()).toMatchInlineSnapshot(`2190`);
        const node4 = node3.getChild(0)!;
        expect(node4.getX()).toMatchInlineSnapshot(`405`);
        expect(node4.getY()).toMatchInlineSnapshot(`2750`);
        const node5 = node4.getChild(0)!;
        expect(node5.getX()).toMatchInlineSnapshot(`330`);
        expect(node5.getY()).toMatchInlineSnapshot(`3310`);
        const node6 = node5.getChild(0)!;
        expect(node6.getX()).toMatchInlineSnapshot(`295`);
        expect(node6.getY()).toMatchInlineSnapshot(`3870`);
        const node7 = node6.getChild(0)!;
        expect(node7.getX()).toMatchInlineSnapshot(`260`);
        expect(node7.getY()).toMatchInlineSnapshot(`4430`);
        const node8 = node6.getChild(1)!;
        expect(node8.getX()).toMatchInlineSnapshot(`330`);
        expect(node8.getY()).toMatchInlineSnapshot(`4430`);
        const node9 = node5.getChild(1)!;
        expect(node9.getX()).toMatchInlineSnapshot(`365`);
        expect(node9.getY()).toMatchInlineSnapshot(`3870`);
        const node10 = node4.getChild(1)!;
        expect(node10.getX()).toMatchInlineSnapshot(`480`);
        expect(node10.getY()).toMatchInlineSnapshot(`3310`);
        const node11 = node10.getChild(0)!;
        expect(node11.getX()).toMatchInlineSnapshot(`445`);
        expect(node11.getY()).toMatchInlineSnapshot(`3870`);
        const node12 = node10.getChild(1)!;
        expect(node12.getX()).toMatchInlineSnapshot(`515`);
        expect(node12.getY()).toMatchInlineSnapshot(`3870`);
        const node13 = node3.getChild(1)!;
        expect(node13.getX()).toMatchInlineSnapshot(`595`);
        expect(node13.getY()).toMatchInlineSnapshot(`2750`);
        const node14 = node13.getChild(0)!;
        expect(node14.getX()).toMatchInlineSnapshot(`595`);
        expect(node14.getY()).toMatchInlineSnapshot(`3310`);
        const node15 = node14.getChild(0)!;
        expect(node15.getX()).toMatchInlineSnapshot(`595`);
        expect(node15.getY()).toMatchInlineSnapshot(`3870`);
    });

});
