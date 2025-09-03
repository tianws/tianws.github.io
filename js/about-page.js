// About Page Language Switcher Functionality
// This script handles the language switching functionality for the about page

document.addEventListener('DOMContentLoaded', function() {
    // 获取所有需要切换的元素
    var zhPostContainer = document.querySelector(".zh.post-container");
    var enPostContainer = document.querySelector(".en.post-container");
    var zhCommentTitle = document.querySelector(".zh.comment-title-container");
    var enCommentTitle = document.querySelector(".en.comment-title-container");
    
    var zhBtn = document.querySelector('a.lang-switch-btn[href="#zh"]');
    var enBtn = document.querySelector('a.lang-switch-btn[href="#en"]');
    
    // 如果元素不存在，则不执行后续逻辑
    if (!zhPostContainer || !enPostContainer || !zhCommentTitle || !enCommentTitle || !zhBtn || !enBtn) {
        return;
    }
    
    // 渲染内容的函数
    function renderContent() {
        var hash = window.location.hash;
        var isEnglish = (hash === '#en');

        // 根据语言显示或隐藏对应的模块
        // 正文部分使用 'block'
        zhPostContainer.style.display = isEnglish ? 'none' : 'block';
        enPostContainer.style.display = isEnglish ? 'block' : 'none';

        // 评论标题部分使用 'flex'
        zhCommentTitle.style.display = isEnglish ? 'none' : 'flex';
        enCommentTitle.style.display = isEnglish ? 'flex' : 'none';
        
        // 更新按钮的激活状态
        zhBtn.classList.toggle('active', !isEnglish);
        enBtn.classList.toggle('active', isEnglish);
    }
    
    // 监听 URL hash 的变化
    window.addEventListener('hashchange', renderContent);
    
    // 页面加载时立即执行一次，以保证显示正确的语言
    renderContent();
});