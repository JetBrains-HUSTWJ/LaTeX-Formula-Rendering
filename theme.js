// 主题切换功能
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.createThemeToggle();
        this.applyTheme(this.currentTheme);
    }

    createThemeToggle() {
        // 创建主题切换按钮
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.innerHTML = this.currentTheme === 'dark' ? '🌞 亮色模式' : '🌙 暗色模式';
        themeToggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 10px 15px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        
        themeToggle.addEventListener('click', () => this.toggleTheme());
        document.body.appendChild(themeToggle);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        // 更新按钮文本
        const toggleBtn = document.getElementById('theme-toggle');
        toggleBtn.innerHTML = this.currentTheme === 'dark' ? '🌞 亮色模式' : '🌙 暗色模式';
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
            
            // 更新主题切换按钮样式
            const toggleBtn = document.getElementById('theme-toggle');
            if (toggleBtn) {
                toggleBtn.style.background = 'linear-gradient(135deg, #4299e1, #3182ce)';
                toggleBtn.style.color = 'white';
            }
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
            
            // 更新主题切换按钮样式
            const toggleBtn = document.getElementById('theme-toggle');
            if (toggleBtn) {
                toggleBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                toggleBtn.style.color = 'white';
            }
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