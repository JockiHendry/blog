// @ts-nocheck

function solve(left: TreeNode, right: TreeNode): boolean {
    if (left == null && right == null) {
        return true;
    }
    if (left == null || right == null) {
        return false;
    }
    return (left.val === right.val && solve(left.left, right.right) && solve(left.right, right.left));
}

const root = new TreeNode(1, new TreeNode(2), new TreeNode(2));
root.left.left = new TreeNode(3);
root.left.left.left = new TreeNode(4);
root.left.left.right = new TreeNode(5);
root.right.right = new TreeNode(3);
root.right.right.left = new TreeNode(5);
root.right.right.right = new TreeNode(4);

console.log(`Is mirror? ${solve(root.left, root.right)}`);