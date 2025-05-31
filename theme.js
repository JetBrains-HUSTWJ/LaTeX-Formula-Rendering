// 主题切换功能
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.bindThemeToggle();
        this.applyTheme(this.currentTheme);
    }

    bindThemeToggle() {
        // 等待DOM完全加载后绑定按钮
        const bindButton = () => {
            const themeToggle = document.getElementById('theme-toggle-btn');
            if (themeToggle) {
                themeToggle.innerHTML = this.currentTheme === 'dark' ? '🌞 亮色模式' : '🌙 暗色模式';
                themeToggle.addEventListener('click', () => this.toggleTheme());
                console.log('主题切换按钮已绑定，当前主题:', this.currentTheme);
            } else {
                console.error('找不到主题切换按钮元素');
            }
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bindButton);
        } else {
            bindButton();
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        console.log('切换主题到:', this.currentTheme);
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        // 更新按钮文本
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (toggleBtn) {
            toggleBtn.innerHTML = this.currentTheme === 'dark' ? '🌞 亮色模式' : '🌙 暗色模式';
            console.log('按钮文本已更新');
        } else {
            console.error('找不到主题切换按钮');
        }
    }

    applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            // 暗色主题变量
            root.style.setProperty('--bg-primary', 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #1a202c 100%)');
            root.style.setProperty('--bg-secondary', '#2d3748');
            root.style.setProperty('--bg-tertiary', '#1a202c');
            root.style.setProperty('--text-primary', '#e2e8f0');
            root.style.setProperty('--text-secondary', '#cbd5e0');
            root.style.setProperty('--text-muted', '#718096');
            root.style.setProperty('--border-color', '#4a5568');
            root.style.setProperty('--border-hover', '#718096');
            root.style.setProperty('--accent-color', '#63b3ed');
            root.style.setProperty('--accent-hover', '#4299e1');
            root.style.setProperty('--success-color', '#38a169');
            root.style.setProperty('--success-hover', '#2f855a');
            
            // 暗色主题下的按钮样式已在CSS中定义
        } else {
            // 亮色主题变量
            root.style.setProperty('--bg-primary', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
            root.style.setProperty('--bg-secondary', 'white');
            root.style.setProperty('--bg-tertiary', '#f8f9fa');
            root.style.setProperty('--text-primary', '#333');
            root.style.setProperty('--text-secondary', '#555');
            root.style.setProperty('--text-muted', '#6c757d');
            root.style.setProperty('--border-color', '#ddd');
            root.style.setProperty('--border-hover', '#e9ecef');
            root.style.setProperty('--accent-color', '#667eea');
            root.style.setProperty('--accent-hover', '#764ba2');
            root.style.setProperty('--success-color', '#28a745');
            root.style.setProperty('--success-hover', '#20c997');
            
            // 亮色主题下的按钮样式已在CSS中定义
        }
        
        // 触发主题变更事件
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// 当DOM加载完成后初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// 导出主题管理器类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}