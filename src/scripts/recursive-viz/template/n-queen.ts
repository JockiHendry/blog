function isSafe(board: number[][], row: number, col: number): boolean {
    for (let i=0; i<col; i++) {
        if (board[row][i] === 1) {
            return false;
        }
    }
    for (let i=row, j=col; i>=0 && j>=0; i--, j--) {
        if (board[i][j]) {
            return false;
        }
    }
    for (let i=row,j=col; j>=0 && i<N; i++,j--) {
        if (board[i][j]) {
            return false;
        }
    }

    return true;
}

function solve(board: number[][], col: number): boolean {
    if (col >= N) {
        return true;
    }
    for (let i=0; i<N; i++) {
        if (isSafe(board, i, col)) {
            board[i][col] = 1;
            if (solve(board, col+1)) {
                return true;
            }
            board[i][col] = 0;
        }
    }
    return false;
}

function createBoard(size: number): number[][] {
    const result = new Array(size);
    for (let i=0; i<size; i++) {
        result[i] = new Array(size).fill(0);
    }
    return result;
}

const N = 6;
const board = createBoard(N);

if (solve(board, 0)) {
    console.log(`The solution for ${N} queens is:\n`);
    for (const row of board) {
        console.log(row);
    }
}
