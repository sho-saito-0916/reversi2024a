document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('reversiboard');
    const ctx = canvas.getContext('2d');
    const boardSize = 8;
    const cellSize = canvas.width / boardSize;
    const board = [
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','⚫︎','⚪︎','','',''],
        ['','','','⚪︎','⚫︎','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','','']
    ];

    let currentPlayer = '⚫︎';

    canvas.addEventListener('click', handleCanvasClick);

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // キャンバス全体をクリア
        ctx.fillStyle = 'green';  // 塗りつぶしの色を緑色に設定
        ctx.fillRect(0, 0, canvas.width, canvas.height);  // キャンバス全体を緑色で塗りつぶす

        ctx.beginPath();
        for (let i = 1; i < boardSize; i++) {
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, canvas.height);
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(canvas.width, i * cellSize);
        }
        ctx.strokeStyle = 'black';
        ctx.stroke();

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const cellValue = board[i][j];
                if (cellValue !== '') {
                    const x = j * cellSize + cellSize / 2;
                    const y = i * cellSize + cellSize / 2;

                    ctx.font = '48px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'black';
                    ctx.fillText(cellValue, x, y);
                }
            }
        }
    }

    function handleCanvasClick(event){
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const col = Math.floor(mouseX / cellSize);
        const row = Math.floor(mouseY / cellSize);

        if (board[row][col] === '' && isValidMove(row, col, currentPlayer)) {
            makeMove(row, col, currentPlayer);
            currentPlayer = currentPlayer === '⚫︎' ? '⚪︎' : '⚫︎';
            drawBoard();
            checkWinner();
        } else {
            alert('ここには配置できません');
        }
    }

    function isValidMove(row, col, player) {
        return getFlippedCells(row, col, player).length > 0;
    }

    function makeMove(row, col, player) {
        const flippedCells = getFlippedCells(row, col, player);
        flippedCells.forEach(([r, c]) => {
            board[r][c] = player;
        });
        board[row][col] = player;
    }

    function getFlippedCells(row, col, player) {
        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        const opponent = player === '⚫︎' ? '⚪︎' : '⚫︎';
        const flippedCells = [];

        directions.forEach(([dr, dc]) => {
            const tempFlipped = [];
            let r = row + dr;
            let c = col + dc;
            while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === opponent) {
                tempFlipped.push([r, c]);
                r += dr;
                c += dc;
            }
            if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === player) {
                flippedCells.push(...tempFlipped);
            }
        });

        return flippedCells;
    }

    function checkWinner() {
        const counts = {'⚫︎': 0, '⚪︎': 0};
        board.forEach(row => row.forEach(cell => {
            if (cell === '⚫︎' || cell === '⚪︎') counts[cell]++;
        }));

        if (counts['⚫︎'] + counts['⚪︎'] === boardSize * boardSize || !isMovePossible('⚫︎') && !isMovePossible('⚪︎')) {
            const winner = counts['⚫︎'] > counts['⚪︎'] ? '⚫︎の勝ち' : counts['⚪︎'] > counts['⚫︎'] ? '⚪︎の勝ち' : '引き分け';
            alert(winner);
        }
    }

    function isMovePossible(player) {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (board[row][col] === '' && isValidMove(row, col, player)) {
                    return true;
                }
            }
        }
        return false;
    }

    drawBoard();
});


