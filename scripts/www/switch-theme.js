// 主题切换脚本
class ThemeSwitcher {
    constructor() {
        this.themes = {
            'original': 'styles.css',
            'modern': 'styles-modern.css',
            'light': 'styles-light.css'
        };
        
        this.currentTheme = localStorage.getItem('selectedTheme') || 'original';
        this.init();
    }

    // Simple haptic feedback simulation
    static lightTap() {
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(6);
        }
    }

    init() {
        // 应用保存的主题
        this.applyTheme(this.currentTheme);
        
        // 创建主题切换按钮
        this.createThemeSwitcher();
    }

    applyTheme(themeName) {
        const styleLink = document.querySelector('link[rel="stylesheet"]');
        if (styleLink && this.themes[themeName]) {
            styleLink.href = this.themes[themeName];
            this.currentTheme = themeName;
            localStorage.setItem('selectedTheme', themeName);
            
            // 更新主题切换器的状态
            this.updateSwitcherState();
        }
    }

    createThemeSwitcher() {
        // 创建主题切换按钮
        const switcherContainer = document.createElement('div');
        switcherContainer.className = 'theme-switcher';
        switcherContainer.innerHTML = `
            <button class="theme-toggle-btn" onclick="themeSwitcher.toggleSwitcher()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
                </svg>
            </button>
            <div class="theme-options" id="themeOptions" style="display: none;">
                <div class="theme-option" data-theme="original">
                    <span class="theme-preview original-preview"></span>
                    <span class="theme-name">古风</span>
                </div>
                <div class="theme-option" data-theme="modern">
                    <span class="theme-preview modern-preview"></span>
                    <span class="theme-name">深色</span>
                </div>
                <div class="theme-option" data-theme="light">
                    <span class="theme-preview light-preview"></span>
                    <span class="theme-name">浅色</span>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .theme-switcher {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1001;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }

            .theme-toggle-btn {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                border: none;
                background: rgba(255, 255, 255, 0.06);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                color: rgba(255, 255, 255, 0.7);
                font-size: 18px;
                cursor: pointer;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid rgba(255, 255, 255, 0.08);
            }

            .theme-toggle-btn:active {
                transform: scale(0.9);
                background: rgba(255, 255, 255, 0.1);
            }

            .theme-options {
                position: absolute;
                top: 52px;
                right: 0;
                background: rgba(23, 23, 31, 0.92);
                backdrop-filter: blur(24px);
                -webkit-backdrop-filter: blur(24px);
                border-radius: 12px;
                padding: 6px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                min-width: 130px;
                animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid rgba(255, 255, 255, 0.06);
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-8px) scale(0.96);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .theme-option {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                color: rgba(255, 255, 255, 0.6);
            }

            .theme-option:hover {
                background: rgba(255, 255, 255, 0.06);
                color: rgba(255, 255, 255, 0.9);
            }

            .theme-option.active {
                background: rgba(108, 92, 231, 0.15);
                color: #6c5ce7;
            }

            .theme-preview {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                flex-shrink: 0;
                border: 1.5px solid rgba(255, 255, 255, 0.1);
            }

            .original-preview {
                background: #eef3f8;
                border-color: rgba(30, 77, 122, 0.4);
            }

            .modern-preview {
                background: #06080f;
                border-color: rgba(124, 92, 252, 0.4);
            }

            .light-preview {
                background: #f5f5f9;
                border-color: rgba(91, 74, 208, 0.4);
            }

            .theme-name {
                font-size: 13px;
                font-weight: 500;
                letter-spacing: 0.01em;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(switcherContainer);

        // 绑定点击事件
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                ThemeSwitcher.lightTap();
                this.applyTheme(theme);
                this.toggleSwitcher();
            });
        });

        // 更新初始状态
        this.updateSwitcherState();
    }

    toggleSwitcher() {
        const options = document.getElementById('themeOptions');
        if (options) {
            options.style.display = options.style.display === 'none' ? 'block' : 'none';
        }
    }

    updateSwitcherState() {
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === this.currentTheme) {
                option.classList.add('active');
            }
        });
    }
}

// 页面加载完成后初始化主题切换器
document.addEventListener('DOMContentLoaded', function() {
    window.themeSwitcher = new ThemeSwitcher();
});

// 点击外部关闭主题选择器
document.addEventListener('click', function(e) {
    if (!e.target.closest('.theme-switcher')) {
        const options = document.getElementById('themeOptions');
        if (options) {
            options.style.display = 'none';
        }
    }
});