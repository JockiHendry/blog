import {Node} from './node';

export type RawRecord = ['enter'|'exit', number, number|null, any];
export class NodeFactory {

    create(data: RawRecord[]): Node|null {
        if (data.length === 0) return null;

        let root: Node;
        const calledNonRecursively = data.filter(a => a[0] === 'enter' && a[2] == null).length > 1;
        if (calledNonRecursively) {
            root = new Node(-1, ['(main)']);
            for (const a of data) {
                if (a[2] == null) {
                    a[2] = -1;
                }
            }
        } else {
            root = new Node(data[0][1], data[0][3]);
        }
        let cur = [root];
        while (cur.length > 0) {
            const next = [];
            for (const c of cur) {
                for (const a of data) {
                    if (a[0] === 'enter' && a[1] !== c.nodeIndex && a[2] != null && a[2] === c.nodeIndex) {
                        const child = new Node(a[1], a[3])
                        c.addChild(child);
                        next.push(child);
                    } else if (a[0] === 'exit' && a[1] === c.nodeIndex) {
                        c.returnValue = a[3];
                    }
                }
            }
            cur = next;
        }
        return root;
    }

}
