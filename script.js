// --- 定数と変数の設定 ---
const BOARD_SIZE = 15;
const WIN_COUNT = 5;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

let board; // 碁盤の状態を保持する二次元配列
let currentPlayer; // 現在のプレイヤー (1:黒, 2:白)
let gameActive; // ゲームが進行中かどうか

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset-button');

// --- ゲームの初期化 ---
function initializeGame() {
    // 15x15の配列を全てEMPTYで初期化
    board = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(EMPTY));
    currentPlayer = BLACK; // 黒からスタート
    gameActive = true;
    boardElement.innerHTML = ''; // HTMLボードをクリア
    updateStatus();
    createBoardElements();
}

// HTMLのマス目要素を生成
function createBoardElements() {
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

// --- イベントハンドラ ---
function handleCellClick(event) {
    if (!gameActive) return;

    const cell = event.target;
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);

    // すでに石が置かれていたら何もしない
    if (board[r][c] !== EMPTY) {
        return;
    }

    // 盤面に石を置く
    placeStone(r, c);

    // 勝利判定
    if (checkWin(r, c)) {
        gameActive = false;
        statusElement.textContent = (currentPlayer === BLACK ? '黒 (●)' : '白 (○)') + ' の勝利です！';
        return;
    }

    // プレイヤー交代
    switchPlayer();
    updateStatus();
}

// --- メインロジック ---
function placeStone(r, c) {
    board[r][c] = currentPlayer;
    const cellElement = boardElement.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    cellElement.classList.add(currentPlayer === BLACK ? 'black' : 'white');
}

function switchPlayer() {
    currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
}

function updateStatus() {
    const playerText = currentPlayer === BLACK ? '黒 (●)' : '白 (○)';
    statusElement.textContent = '現在のプレイヤー: ' + playerText;
}

// 勝利判定の関数 (最も複雑な部分)
function checkWin(r, c) {
    const player = board[r][c];

    // 4方向のチェック（水平、垂直、2つの斜め方向）
    // direction: [row_change, col_change]
    const directions = [
        [0, 1],   // 水平 (右)
        [1, 0],   // 垂直 (下)
        [1, 1],   // 斜め (右下)
        [1, -1]   // 斜め (左下)
    ];

    for (const [dr, dc] of directions) {
        let count = 1;
        
        // 1. 正の方向へ数える (例: 右、下、右下、左下)
        count += countLine(r + dr, c + dc, dr, dc, player);

        // 2. 負の方向へ数える (例: 左、上、左上、右上)
        count += countLine(r - dr, c - dc, -dr, -dc, player);

        if (count >= WIN_COUNT) {
            return true;
        }
    }

    return false;
}

// 特定の方向に連続する石の数を数えるヘルパー関数
function countLine(r, c, dr, dc, player) {
    let count = 0;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        count++;
        r += dr;
        c += dc;
    }
    return count;
}

// --- 初期実行とリセットボタン ---
resetButton.addEventListener('click', initializeGame);

// ゲーム開始
initializeGame();
