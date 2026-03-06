// 任务和精力资源管理系统
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || {
            work: [],
            study: [],
            personal: []
        };
        this.documents = JSON.parse(localStorage.getItem('documents')) || [];
        this.scores = JSON.parse(localStorage.getItem('scores')) || {
            work: 0,
            study: 0,
            personal: 0
        };
        this.init();
    }

    init() {
        this.loadTasks();
        this.loadDocuments();
        this.updateScoreDisplay();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 模块切换
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click
', (e) => {
                this.switchModule(e.target.dataset.module);
});
        });

        // 文件上传
        document.getElementById('file-upload').addEventListener('change', (e) => {
this.handleFileUpload(e.target.files);
});

        // 输入框回车事件
        document.querySelectorAll('input[type="text"]').forEach(input => {
input.addEventListener('keypress', (e) => {
if (e.key === 'Enter') {
                    const module = e.target.id.split('-')[0];
this.addTask(module);
                }
});
        });
    }

    switchModule(module) {
// 更新按钮状态
        document.querySelectorAll('.nav-btn').forEach(btn => {
btn.classList.remove('active');
        });
document.querySelector(`[data-module="${module}"]`).classList.add('active');
// 显示对应模块
        document.querySelectorAll('.module-content').forEach(content => {
content.classList.add('hidden');
        });
document.getElementById(`${module}-module`).classList.remove('hidden');
}

    addTask(module) {
        const input = document.getElementById(`${module}-task-input`);
const taskText = input.value.trim();
if (taskText) {
            const task = {
id: Date.now(),
                text: taskText,
completed: false,
                createdAt: new Date().toISOString()
};

            this.tasks[module].push(task);
this.saveTasks();
            this.loadTasks();
input.value = '';
        }
    }

    completeTask(module, taskId) {
const task = this.tasks[module].find(t => t.id === taskId);
if (task) {
            task.completed = !task.completed;
this.updateScore(module, task.completed ? 10 : -10);
}
    }

    deleteTask(module, taskId) {
        this.tasks[module] = this.tasks[module].filter(t => t.id !== taskId);
this.saveTasks();
        this.loadTasks();
}

    updateScore(module, points) {
        this.scores[module] += points;
this.saveScores();
        this.updateScoreDisplay();
}

    updateScoreDisplay() {
        const totalScore = Object.values(this.scores).reduce((a, b) => a + b, 0);
document.getElementById('totalScore').textContent = totalScore;
// 更新进度条
        this.updateProgressBars();
}

    updateProgressBars() {
        const modules = ['work', 'study', 'personal'];
modules.forEach(module => {
            const progressBar = document.querySelector(`#${module}-module .progress-fill`);
if (progressBar) {
                const maxScore = 100; // 每个模块最大100分
const width = Math.min((this.scores[module] / maxScore) * 100, 100);
progressBar.style.width = `${width}%`;
}
        });
    }

    loadTasks() {
const modules = ['work', 'study', 'personal'];
modules.forEach(module => {
            const taskList = document.getElementById(`${module}-task-list`);
taskList.innerHTML = '';

            this.tasks[module].forEach(task => {
const taskItem = document.createElement('div');
taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
taskItem.innerHTML = `
                    <span>${task.text}</span>
<div class="task-actions">
                        <button class="task-btn complete-btn" onclick="taskManager.completeTask('${module}', ${task.id})">
${task.completed ? '❌' : '✅'}
</button>
                        <button class="task-btn delete-btn" onclick="taskManager.deleteTask('${module}', ${task.id})">
🗑️
                        </button>
</div>
                `;
                taskList.appendChild(taskItem);
});

            // 添加进度条
            if (!document.querySelector(`#${module}-module .progress-bar`)) {
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
progressBar.innerHTML = '<div class="progress-fill"></div>';
taskList.parentNode.insertBefore(progressBar, taskList);
}
        });
    }

    handleFileUpload(files) {
Array.from(files).forEach(file => {
            const document = {
id: Date.now(),
                name: file.name,
type: file.type,
                size: file.size,
uploadedAt: new Date().toISOString(),
url: URL.createObjectURL(file)
            };
this.documents.push(document);
            this.saveDocuments();
this.loadDocuments();
        });
    }
loadDocuments() {
        const documentList = document.getElementById('document-list');
documentList.innerHTML = '';

        this.documents.forEach(doc => {
const docItem = document.createElement('div');
docItem.className = 'document-item';
            docItem.innerHTML = `
<span>📄 ${doc.name} (${this.formatFileSize(doc.size)})</span>
<div>
                    <a href="${doc.url}" download="${doc.name}">⬇️</a>
<button onclick="taskManager.deleteDocument(${doc.id})">🗑️</button>
</div>
            `;
            documentList.appendChild(docItem);
});
    }

    deleteDocument(docId) {
        this.documents = this.documents.filter(doc => doc.id !== docId);
this.saveDocuments();
        this.loadDocuments();
}

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
const i = Math.floor(Math.log(bytes) / Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
}

    saveDocuments() {
        localStorage.setItem('documents', JSON.stringify(this.documents));
}

    saveScores() {
        localStorage.setItem('scores', JSON.stringify(this.scores));
}
}

// 初始化应用
const taskManager = new TaskManager();
