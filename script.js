// 简化版任务管理器
let taskManager = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || {
work: [],
        study: [],
        personal: []
},
    scores: JSON.parse(localStorage.getItem('scores')) || {
work: 0,
        study: 0,
        personal: 0
    },
documents: JSON.parse(localStorage.getItem('documents')) || [],
init() {
        this.loadTasks();
        this.updateScores();
this.setupEventListeners();
    },

    setupEventListeners() {
// 导航按钮
        document.querySelectorAll('.nav-btn').forEach(btn => {
btn.addEventListener('click', (e) => {
this.switchModule(e.currentTarget.dataset.module);
});
        });

        // 文件上传
        document.getElementById('file-upload').addEventListener('change', (e) => {
this.handleFileUpload(e.target.files);
});
    },

    switchModule(module) {
        // 更新导航
document.querySelectorAll('.nav-btn').forEach(btn => {
btn.classList.remove('active');
        });
document.querySelector(`[data-module="${module}"]`).classList.add('active');
// 显示对应模块
        document.querySelectorAll('.module').forEach(mod => {
mod.classList.remove('active');
        });
document.getElementById(`${module}-module`).classList.add('active');
},

    addTask(module) {
        const input = document.getElementById(`${module}-task-input`);
const text = input.value.trim();
        
        if (text) {
const task = {
                id: Date.now(),
text: text,
                completed: false,
createdAt: new Date().toISOString()
};
            
            this.tasks[module].push(task);
this.saveTasks();
            this.loadTasks();
input.value = '';
        }
    },

    completeTask(module, taskId) {
const task = this.tasks[module].find(t => t.id === taskId);
if (task) {
            task.completed = !task.completed;
this.scores[module] += task.completed ? 10 : -10;
this.saveTasks();
            this.saveScores();
this.loadTasks();
            this.updateScores();
}
    },

    deleteTask(module, taskId) {
this.tasks[module] = this.tasks[module].filter(t => t.id !== taskId);
this.saveTasks();
        this.loadTasks();
},

    loadTasks() {
        ['work', 'study', 'personal'].forEach(module => {
const list = document.getElementById(`${module}-task-list`);
if (list) {
                list.innerHTML = '';
this.tasks[module].forEach(task => {
const item = document.createElement('div');
item.className = `task-item ${task.completed ? 'completed' : ''}`;
item.innerHTML = `
                        <span class="task-text">${task.text}</span>
<div class="task-actions">
<button class="task-btn complete-btn" onclick="taskManager.completeTask('${module}', ${task.id})">
${task.completed ? '❌' : '✅'}
</button>
                            <button class="task-btn delete-btn" onclick="taskManager.deleteTask('${module}', ${task.id})">
🗑️
                            </button>
</div>
                    `;
list.appendChild(item);
                });
}
        });
    },

    updateScores() {
const total = Object.values(this.scores).reduce((a, b) => a + b, 0);
document.getElementById('totalScore').textContent = total;
['work', 'study', 'personal'].forEach(module => {
const scoreEl = document.getElementById(`${module}-score`);
if (scoreEl) {
                scoreEl.textContent = this.scores[module];
}
        });
    },

    handleFileUpload(files) {
Array.from(files).forEach(file => {
            const doc = {
id: Date.now(),
                name: file.name,
size: file.size,
                url: URL.createObjectURL(file)
};
            this.documents.push(doc);
this.saveDocuments();
            this.loadDocuments();
});
    },

    loadDocuments() {
        const list = document.getElementById('document-list');
if (list) {
            list.innerHTML = '';
this.documents.forEach(doc => {
                const item = document.createElement('div');
item.className = 'document-item';
                item.innerHTML = `
<span>📄 ${doc.name} (${this.formatSize(doc.size)})</span>
<div>
                        <a href="${doc.url}" download="${doc.name}">⬇️</a>
<button onclick="taskManager.deleteDocument(${doc.id})">🗑️</button>
</div>
                `;
                list.appendChild(item);
});
        }
    },

    deleteDocument(id) {
this.documents = this.documents.filter(doc => doc.id !== id);
this.saveDocuments();
        this.loadDocuments();
},

    formatSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
},

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
},

    saveScores() {
        localStorage.setItem('scores', JSON.stringify(this.scores));
},

    saveDocuments() {
        localStorage.setItem('documents', JSON.stringify(this.documents));
}
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
taskManager.init();
});

// 全局函数供HTML调用
function addTask(module) {
taskManager.addTask(module);
}
