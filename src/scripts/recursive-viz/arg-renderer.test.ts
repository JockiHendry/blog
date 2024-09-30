import {describe, expect, test} from 'vitest';
import {BinaryTreeNode} from './arg-renderer';

describe('BinaryTreeNode', function () {

    test('constructor', () => {
        const source = {
            val: 1,
            left: {
                val: 2,
                left: {
                    val: 3,
                },
                right: {
                    val: 4,
                }
            },
            right: {
                val: 5
            }
        };
        const tree = new BinaryTreeNode(source);
        expect(tree.val).toEqual(1);
        expect(tree.left?.val).toEqual(2);
        expect(tree.left?.left?.val).toEqual(3);
        expect(tree.left?.right?.val).toEqual(4);
        expect(tree.right?.val).toEqual(5);
    });

    test('getChild', () => {
        const tree = new BinaryTreeNode({
           val: 2,
           left: {
               val: 3,
               left: {
                   val: 4,
               },
               right: {
                   val: 5,
               }
           }
        });
        expect(tree.getChild(0)?.val).toEqual(3);
        expect(tree.getChild(1)).toBeNull();
        expect(tree.getChild(2)).toBeNull();
        expect(tree.left?.getChild(0)?.val).toEqual(4);
        expect(tree.left?.getChild(1)?.val).toEqual(5);
        expect(tree.left?.getChild(2)).toBeNull();
    });

    test('getLeftMost', () => {
        const tree1 = new BinaryTreeNode({
            val: 2,
            left: {
                val: 3,
                left: {
                    val: 4,
                },
                right: {
                    val: 5,
                }
            }
        });
        expect(tree1.getLeftMost()?.val).toEqual(4);
        const tree2 = new BinaryTreeNode({
            val: 2,
            left: {
                val: 3,
                right: {
                    val: 4,
                    right: {
                        val: 6
                    },
                },
            }
        });
        expect(tree2.getLeftMost()?.val).toEqual(3);
    });

    test('getLeftSibling', () => {
        const tree = new BinaryTreeNode({
            val: 1,
            left: {
                val: 2,
                left: {val: 3},
                right: {val: 4},
            },
            right: {
                val: 5,
                left: {val: 6},
                right: {val: 7},
            }
        });
        expect(tree.getLeftSibling()).toBeNull();
        expect(tree.right?.getLeftSibling()).toEqual(tree.left);
        expect(tree.left?.right?.getLeftSibling()).toEqual(tree.left?.left);
        expect(tree.right?.right?.getLeftSibling()).toEqual(tree.right?.left);
    });

    test('getRightSibling', () => {
        const tree = new BinaryTreeNode({
            val: 1,
            left: {
                val: 2,
                left: {val: 3},
                right: {val: 4},
            },
            right: {
                val: 5,
                left: {val: 6},
                right: {val: 7},
            }
        });
        expect(tree.getRightSibling()).toBeNull();
        expect(tree.left?.getRightSibling()).toEqual(tree.right);
        expect(tree.left?.left?.getRightSibling()).toEqual(tree.left?.right);
        expect(tree.right?.left?.getRightSibling()).toEqual(tree.right?.right);
    });

    test('getBounds', () => {
        const tree = new BinaryTreeNode({
            val: 1,
            left: {
                val: 2,
            },
            right: {
                val: 5,
            }
        });
        tree.x = 100;
        tree.y = 100;
        tree.left!.x = 50;
        tree.left!.y = 120;
        tree.right!.x = 150;
        tree.right!.y = 120;
        const bounds = tree.getBounds();
        expect(bounds.width).toEqual(100);
        expect(bounds.height).toEqual(20);
    });

});
