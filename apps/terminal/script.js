const output = document.getElementById('output');
const input = document.getElementById('command-input');

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = input.value.trim();
        input.value = '';
        executeCommand(command);
    }
});

function print(text) {
    output.textContent += text + '\n';
    output.scrollTop = output.scrollHeight;
}

function executeCommand(cmd) {
    print(`jules@ai-os:~$ ${cmd}`);
    const parts = cmd.split(' ');
    const baseCmd = parts[0].toLowerCase();

    switch (baseCmd) {
        case 'help':
            print('Available commands: help, clear, ls, run game');
            break;
        case 'clear':
            output.textContent = '';
            break;
        case 'ls':
            print('apps/  cpp/  LICENSE  README.md');
            break;
        case 'run':
            if (parts[1] === 'game') {
                runGameLoop();
            } else {
                print(`Error: Cannot run ${parts[1]}`);
            }
            break;
        case '':
            break;
        default:
            print(`Command not found: ${baseCmd}`);
    }
}

function runGameLoop() {
    print('Starting simple game loop...');
    let frame = 1;
    const interval = setInterval(() => {
        print(`Frame: ${frame}`);
        frame++;
        if (frame > 10) {
            clearInterval(interval);
            print('Game loop finished.');
        }
    }, 500);
}
