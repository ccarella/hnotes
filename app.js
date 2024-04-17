window.onload = function() {
    loadTodos();
    loadNotes();
    setupBackButton();
    registerServiceWorker();
};

function setupBackButton() {
    document.getElementById('backButton').addEventListener('click', function() {
        switchTab('note1');
    });
}

function loadNotes() {
    document.getElementById('note2').value = localStorage.getItem('note2') || '';
    document.getElementById('note2').addEventListener('input', function() {
        localStorage.setItem('note2', this.value);
    });
}

function addTodo(event) {
    if (event.key === "Enter" && event.target.value.trim() !== '') {
        const todoText = event.target.value.trim();
        createTodo(todoText, false);
        event.target.value = '';
        saveTodos();
    }
}

function createTodo(text, completed) {
    const li = document.createElement('li');
    const icon = document.createElement('i');
    const textNode = document.createElement('span');
    icon.classList.add('material-icons', 'icon');
    icon.textContent = completed ? 'check_box' : 'check_box_outline_blank';
    textNode.textContent = text;
    li.appendChild(icon);
    li.appendChild(textNode);
    li.classList.toggle('done', completed);

    li.addEventListener('click', (event) => {
        if (!event.target.classList.contains('icon') && !event.target.classList.contains('delete-icon')) {
            openDetailedNote(text);
        }
    });

    icon.onclick = function(event) {
        event.stopPropagation();
        toggleCompletion(li, icon);
    };

    document.getElementById(completed ? 'completedTodos' : 'todoList').appendChild(li);
    if (completed) {
        maybeAddDeleteIcon(li);
    }
}

function toggleCompletion(li, icon) {
    const completed = li.classList.toggle('done');
    icon.textContent = completed ? 'check_box' : 'check_box_outline_blank';
    moveItem(li, completed);
    saveTodos();
}

function moveItem(li, completed) {
    if (completed) {
        document.getElementById('completedTodos').appendChild(li);
        maybeAddDeleteIcon(li);
    } else {
        document.getElementById('todoList').appendChild(li);
        if (li.querySelector('.delete-icon')) {
            li.removeChild(li.querySelector('.delete-icon'));
        }
    }
}

function maybeAddDeleteIcon(li) {
    if (!li.querySelector('.delete-icon')) {
        const trashIcon = document.createElement('i');
        trashIcon.classList.add('material-icons', 'delete-icon');
        trashIcon.textContent = 'delete';
        li.appendChild(trashIcon);
        trashIcon.onclick = function(event) {
            event.stopPropagation();
            li.remove();
            saveTodos();
        };
    }
}

function openDetailedNote(todoTitle) {
    document.getElementById('noteTitle').textContent = todoTitle;
    document.getElementById('detailedNote').value = localStorage.getItem(todoTitle) || '';
    document.getElementById('detailedNote').addEventListener('input', function() {
        localStorage.setItem(todoTitle, this.value);
    });
    switchTab('noteDetails');
}

function switchTab(tabName) {
    document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}

function loadTodos() {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => createTodo(todo.text, todo.completed));
}

function saveTodos() {
    let todos = [];
    document.querySelectorAll('#todoList li, #completedTodos li').forEach(li => {
        todos.push({
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('done')
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(function(error) {
            console.log('Service Worker registration failed:', error);
        });
    }
}
