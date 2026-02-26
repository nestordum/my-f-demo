const API_BASE = 'src/api.php';

const app = {
    currentTab: 'schedule',
    scheduleData: [],
    linksData: [],

    init() {
        this.renderApp();
        this.attachEventListeners();
        this.loadInitialData();
    },

    renderApp() {
        const appDiv = document.getElementById('app');
        appDiv.innerHTML = `
            <header>
                <div class="header-container">
                    <div class="header-brand">
                        <div class="brand-icon">📚</div>
                        <div class="brand-text">
                            <h1>Гуманітарний факультет</h1>
                            <p>Розклад занять та корисні ресурси</p>
                        </div>
                    </div>
                    <nav class="navbar-nav">
                        <button class="nav-button active" data-tab="schedule">
                            📅 Розклад
                        </button>
                        <button class="nav-button" data-tab="links">
                            🔗 Корисні посилання
                        </button>
                        <button class="nav-button" data-tab="edit">
                            ⚙️ Редагування
                        </button>
                    </nav>
                    <button class="btn-hamburger d-lg-none" id="menuBtn">☰</button>
                </div>
            </header>

            <main>
                <div class="section-header">
                    <h2 id="pageTitle">Розклад занять</h2>
                    <p id="pageDesc">Перегляньте розклад занять для вашої групи</p>
                </div>

                <div id="content"></div>
            </main>

            <footer>
                <div class="footer-content">
                    <div class="footer-text">
                        <p><strong>© ${new Date().getFullYear()} Гуманітарний факультет</strong></p>
                        <p style="font-size: 0.875rem;">Всі права захищено</p>
                    </div>
                    <button class="btn btn-primary" id="editFooterBtn">
                        ⚙️ Редагувати розклад
                    </button>
                </div>
            </footer>
        `;
    },

    attachEventListeners() {
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.closest('.nav-button').dataset.tab));
        });

        document.getElementById('editFooterBtn').addEventListener('click', () => this.switchTab('edit'));
    },

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        const titles = {
            schedule: { title: 'Розклад занять', desc: 'Перегляньте розклад занять для вашої групи' },
            links: { title: 'Корисні посилання', desc: 'Швидкий доступ до навчальних матеріалів та ресурсів' },
            edit: { title: 'Редагування розкладу', desc: 'Керуйте розкладом занять - додавайте, редагуйте та видаляйте заняття' }
        };

        document.getElementById('pageTitle').textContent = titles[tab].title;
        document.getElementById('pageDesc').textContent = titles[tab].desc;

        if (tab === 'schedule') this.renderSchedule();
        else if (tab === 'links') this.renderLinks();
        else if (tab === 'edit') this.renderEditor();
    },

    async loadInitialData() {
        try {
            const [schedule, links] = await Promise.all([
                fetch(`${API_BASE}?action=get_schedule`).then(r => r.json()),
                fetch(`${API_BASE}?action=get_links`).then(r => r.json())
            ]);
            this.scheduleData = Array.isArray(schedule) ? schedule : [];
            this.linksData = Array.isArray(links) ? links : [];
            this.renderSchedule();
        } catch (err) {
            console.error('Error loading data:', err);
        }
    },

    renderSchedule() {
        const content = document.getElementById('content');

        if (!this.scheduleData.length) {
            content.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><p>Немає занять за обраними критеріями</p></div>';
            return;
        }

        const days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'];
        const groups = [...new Set(this.scheduleData.map(s => s.group_name))].sort();

        let html = `
            <div class="filter-buttons">
                <button class="filter-btn active" data-day="all">Всі дні</button>
                ${days.map(day => `<button class="filter-btn" data-day="${day}">${day}</button>`).join('')}
            </div>
            <div class="filter-buttons">
                <button class="filter-btn active" data-group="all">Всі групи</button>
                ${groups.map(g => `<button class="filter-btn" data-group="${g}">${g}</button>`).join('')}
            </div>
            <div id="scheduleContent"></div>
        `;

        content.innerHTML = html;

        let selectedDay = 'all';
        let selectedGroup = 'all';

        const updateSchedule = () => {
            const filtered = this.scheduleData.filter(s =>
                (selectedDay === 'all' || s.day_of_week === selectedDay) &&
                (selectedGroup === 'all' || s.group_name === selectedGroup)
            );

            const byDay = {};
            filtered.forEach(lesson => {
                if (!byDay[lesson.day_of_week]) byDay[lesson.day_of_week] = [];
                byDay[lesson.day_of_week].push(lesson);
            });

            const scheduleContent = document.getElementById('scheduleContent');
            if (!Object.keys(byDay).length) {
                scheduleContent.innerHTML = '<div class="empty-state"><p>Немає занять за обраними критеріями</p></div>';
                return;
            }

            const dayOrder = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'];
            scheduleContent.innerHTML = dayOrder.filter(d => byDay[d]).map(day => `
                <div class="day-section">
                    <div class="day-header">
                        📅 ${day}
                    </div>
                    ${byDay[day].map(lesson => `
                        <div class="lesson-item">
                            <div class="lesson-time">⏰ ${lesson.time_slot}</div>
                            <div class="lesson-subject">${lesson.subject}</div>
                            <div class="lesson-badges">
                                <span class="badge type-${lesson.lesson_type.toLowerCase()}">${lesson.lesson_type}</span>
                                <span class="badge group">${lesson.group_name}</span>
                            </div>
                            <div class="lesson-details">
                                <div class="detail-item">👨‍🏫 ${lesson.teacher}</div>
                                <div class="detail-item">🏛️ Аудиторія ${lesson.room}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('');
        };

        content.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const attr = e.target.dataset.day ? 'data-day' : 'data-group';
                const value = e.target.dataset[attr.replace('data-', '')];
                content.querySelectorAll(`[${attr}]`).forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                if (attr === 'data-day') selectedDay = value;
                else selectedGroup = value;

                updateSchedule();
            });
        });

        updateSchedule();
    },

    renderLinks() {
        const content = document.getElementById('content');

        if (!this.linksData.length) {
            content.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔗</div><p>Немає посилань</p></div>';
            return;
        }

        const categories = [...new Set(this.linksData.map(l => l.category))];
        let selectedCategory = 'all';

        const renderLinks = () => {
            const filtered = selectedCategory === 'all' ? this.linksData : this.linksData.filter(l => l.category === selectedCategory);
            const byCategory = {};
            filtered.forEach(link => {
                if (!byCategory[link.category]) byCategory[link.category] = [];
                byCategory[link.category].push(link);
            });

            const categoryNames = ['Бібліотека', 'Електронні ресурси', 'Документи', 'Навчання', 'Дослідження'];
            const categoryClasses = ['library', 'resources', 'documents', 'learning', 'research'];

            let html = `
                <div class="filter-buttons">
                    <button class="filter-btn active" data-cat="all">Всі категорії</button>
                    ${categories.map(cat => `<button class="filter-btn" data-cat="${cat}">${cat}</button>`).join('')}
                </div>
            `;

            html += categoryNames.filter(cat => byCategory[cat]).map((cat, idx) => `
                <div class="links-category">
                    <div class="category-header ${categoryClasses[idx]}">
                        📌 ${cat}
                    </div>
                    <div class="links-grid">
                        ${byCategory[cat].map(link => `
                            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-card">
                                <div class="link-card-header">
                                    <div>
                                        <div class="link-card-title">${link.title}</div>
                                        ${link.description ? `<div class="link-card-description">${link.description}</div>` : ''}
                                    </div>
                                    <span class="external-link-icon">↗️</span>
                                </div>
                            </a>
                        `).join('')}
                    </div>
                </div>
            `).join('');

            content.innerHTML = html;

            content.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    selectedCategory = e.target.dataset.cat;
                    content.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    renderLinks();
                });
            });
        };

        renderLinks();
    },

    renderEditor() {
        const content = document.getElementById('content');
        const days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'];
        const lessonTypes = ['Лекція', 'Семінар', 'Практика'];
        let editingId = null;

        const renderForm = (data = null) => {
            editingId = data?.id || null;
            const isEditing = !!editingId;

            return `
                <form class="editor-form" id="scheduleForm">
                    <div class="form-header">
                        <h3>${isEditing ? 'Редагування заняття' : 'Додавання нового заняття'}</h3>
                        <button type="button" class="close-btn" id="closeForm">✕</button>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>День тижня</label>
                            <select name="day_of_week" required>
                                ${days.map(d => `<option value="${d}" ${data?.day_of_week === d ? 'selected' : ''}>${d}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Час</label>
                            <input type="text" name="time_slot" placeholder="09:00-10:30" value="${data?.time_slot || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Предмет</label>
                            <input type="text" name="subject" placeholder="Назва предмету" value="${data?.subject || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Викладач</label>
                            <input type="text" name="teacher" placeholder="ПІБ викладача" value="${data?.teacher || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Аудиторія</label>
                            <input type="text" name="room" placeholder="Номер аудиторії" value="${data?.room || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Група</label>
                            <input type="text" name="group_name" placeholder="Назва групи" value="${data?.group_name || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Тип заняття</label>
                            <select name="lesson_type" required>
                                ${lessonTypes.map(t => `<option value="${t}" ${data?.lesson_type === t ? 'selected' : ''}>${t}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">${isEditing ? 'Зберегти зміни' : 'Додати'}</button>
                        <button type="button" class="btn btn-secondary" id="cancelForm">Скасувати</button>
                    </div>
                </form>
            `;
        };

        const renderList = () => {
            if (!this.scheduleData.length) {
                return '<div class="empty-state"><p>Немає занять. Додайте перше заняття.</p></div>';
            }

            return `
                <div class="schedule-list">
                    ${this.scheduleData.map(item => `
                        <div class="schedule-card">
                            <div class="schedule-info">
                                <div class="schedule-badges">
                                    <span class="badge type-${item.lesson_type.toLowerCase()}">${item.lesson_type}</span>
                                    <span class="badge group">${item.group_name}</span>
                                </div>
                                <div style="font-weight: 600; margin-bottom: 0.5rem;">${item.subject}</div>
                                <div class="schedule-details">
                                    <div><strong>День:</strong> ${item.day_of_week}, ${item.time_slot}</div>
                                    <div><strong>Викладач:</strong> ${item.teacher}</div>
                                    <div><strong>Аудиторія:</strong> ${item.room}</div>
                                </div>
                            </div>
                            <div class="schedule-actions">
                                <button class="btn btn-warning btn-small edit-btn" data-id="${item.id}">✏️ Редагувати</button>
                                <button class="btn btn-danger btn-small delete-btn" data-id="${item.id}">🗑️ Видалити</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        };

        content.innerHTML = `
            ${!editingId ? `<button class="btn btn-primary" id="addBtn">➕ Додати заняття</button>` : ''}
            <div id="formContainer"></div>
            <div id="listContainer">${renderList()}</div>
        `;

        if (!editingId) {
            document.getElementById('addBtn').addEventListener('click', () => {
                document.getElementById('formContainer').innerHTML = renderForm();
                this.attachFormListeners();
            });
        }

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.edit-btn').dataset.id;
                const item = this.scheduleData.find(s => s.id === id);
                document.getElementById('formContainer').innerHTML = renderForm(item);
                this.attachFormListeners();
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (!confirm('Ви впевнені?')) return;
                const id = e.target.closest('.delete-btn').dataset.id;
                try {
                    await fetch(`${API_BASE}?action=delete_schedule&id=${id}`, { method: 'DELETE' });
                    this.scheduleData = this.scheduleData.filter(s => s.id !== id);
                    this.renderEditor();
                } catch (err) {
                    console.error('Error:', err);
                }
            });
        });
    },

    attachFormListeners() {
        const form = document.getElementById('scheduleForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            try {
                const isEditing = !!form.closest('.editor-form')?.querySelector('[data-id]');
                const editingId = isEditing ? this.scheduleData.find(s => s.subject === data.subject)?.id : null;

                const response = await fetch(`${API_BASE}?action=${editingId ? 'update_schedule' : 'add_schedule'}&id=${editingId || ''}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    await this.loadInitialData();
                    this.renderEditor();
                }
            } catch (err) {
                console.error('Error:', err);
            }
        });

        document.getElementById('closeForm')?.addEventListener('click', () => {
            document.getElementById('formContainer').innerHTML = '';
        });

        document.getElementById('cancelForm')?.addEventListener('click', () => {
            document.getElementById('formContainer').innerHTML = '';
        });
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
