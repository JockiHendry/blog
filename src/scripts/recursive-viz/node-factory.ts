import {Node} from './node';

export type RawRecord = ['enter'|'exit', number, number|null, any];
export class NodeFactory {

    create(data: RawRecord[]): Node|null {
        if (data.length === 0) return null;

        const root = new Node(data[0][1], data[0][3]);
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
