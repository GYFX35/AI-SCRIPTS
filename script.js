document.addEventListener('DOMContentLoaded', () => {
    const desktop = document.getElementById('desktop');
    const windowContainer = document.getElementById('window-container');
    const runningApps = document.getElementById('running-apps');
    const clock = document.getElementById('clock');

    // Clock update
    function updateClock() {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateClock, 1000);
    updateClock();

    const apps = {
        keyboard: { title: 'Digital Keyboard', url: 'apps/keyboard/index.html' },
        terminal: { title: 'Terminal', url: 'apps/terminal/index.html' },
        news: { title: 'Tech News', url: 'apps/news/index.html' }
    };

    desktop.addEventListener('click', (e) => {
        const icon = e.target.closest('.icon');
        if (icon) {
            const appKey = icon.dataset.app;
            openApp(appKey);
        }
    });

    function openApp(appKey) {
        const app = apps[appKey];
        if (!app) return;

        const win = document.createElement('div');
        win.classList.add('window');
        win.style.zIndex = getTopZIndex() + 1;

        const windowId = 'win-' + Math.random().toString(36).substr(2, 9);
        win.id = windowId;

        win.innerHTML = `
            <div class="window-header">
                <div class="window-title">${app.title}</div>
                <div class="window-controls">
                    <div class="control minimize"></div>
                    <div class="control maximize"></div>
                    <div class="control close"></div>
                </div>
            </div>
            <iframe class="window-content" src="${app.url}"></iframe>
        `;

        windowContainer.appendChild(win);

        // Add to taskbar
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.textContent = app.title;
        taskItem.dataset.windowId = windowId;
        taskItem.addEventListener('click', () => {
            if (win.style.display === 'none') {
                win.style.display = 'flex';
                win.style.zIndex = getTopZIndex() + 1;
            } else {
                win.style.zIndex = getTopZIndex() + 1;
            }
        });
        runningApps.appendChild(taskItem);

        const closeBtn = win.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            win.remove();
            taskItem.remove();
        });

        const minimizeBtn = win.querySelector('.minimize');
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            win.style.display = 'none';
        });

        makeDraggable(win);
        win.addEventListener('mousedown', () => {
            win.style.zIndex = getTopZIndex() + 1;
        });
    }

    function getTopZIndex() {
        const windows = document.querySelectorAll('.window');
        let max = 0;
        windows.forEach(w => {
            const z = parseInt(window.getComputedStyle(w).zIndex);
            if (z > max) max = z;
        });
        return max;
    }

    function makeDraggable(win) {
        const header = win.querySelector('.window-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        header.onmousedown = dragMouseDown;
        header.ontouchstart = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            // For touch events
            const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
            const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY);

            if (clientX === undefined || clientY === undefined) return;

            pos3 = clientX;
            pos4 = clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
            const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY);

            if (clientX === undefined || clientY === undefined) return;

            pos1 = pos3 - clientX;
            pos2 = pos4 - clientY;
            pos3 = clientX;
            pos4 = clientY;
            win.style.top = (win.offsetTop - pos2) + "px";
            win.style.left = (win.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
        }
    }
});
