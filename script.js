// DOM 元素
const latexInput = document.getElementById('latex-input');
const mathOutput = document.getElementById('math-output');
const renderBtn = document.getElementById('render-btn');
const clearBtn = document.getElementById('clear-btn');
const exportPngBtn = document.getElementById('export-png');
const exportSvgBtn = document.getElementById('export-svg');
const exampleBtns = document.querySelectorAll('.example-btn');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始渲染
    renderMath();
    
    // 绑定事件
    renderBtn.addEventListener('click', renderMath);
    clearBtn.addEventListener('click', clearInput);
    exportPngBtn.addEventListener('click', exportToPNG);
    exportSvgBtn.addEventListener('click', exportToSVG);
    
    // 实时渲染（延迟执行）
    let renderTimeout;
    latexInput.addEventListener('input', function() {
        clearTimeout(renderTimeout);
        renderTimeout = setTimeout(renderMath, 500);
    });
    
    // 示例按钮事件
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const formula = this.getAttribute('data-formula');
            latexInput.value = formula;
            renderMath();
        });
    });
    
    // 键盘快捷键
    latexInput.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            renderMath();
        }
    });
});

// 渲染数学公式
function renderMath() {
    const latex = latexInput.value.trim();
    
    if (!latex) {
        mathOutput.innerHTML = '';
        mathOutput.classList.remove('has-content');
        return;
    }
    
    // 显示加载状态
    mathOutput.classList.add('loading');
    
    // 包装 LaTeX 代码
    const wrappedLatex = `$$${latex}$$`;
    
    // 设置内容并渲染
    mathOutput.innerHTML = wrappedLatex;
    mathOutput.classList.add('has-content');
    
    // 使用 MathJax 渲染
    if (window.MathJax) {
        MathJax.typesetPromise([mathOutput]).then(() => {
            mathOutput.classList.remove('loading');
            console.log('数学公式渲染完成');
        }).catch((err) => {
            console.error('渲染错误:', err);
            mathOutput.innerHTML = '<div style="color: red; font-family: monospace;">渲染错误: ' + err.message + '</div>';
            mathOutput.classList.remove('loading');
        });
    } else {
        mathOutput.classList.remove('loading');
        mathOutput.innerHTML = '<div style="color: orange;">MathJax 正在加载中...</div>';
    }
}

// 清空输入
function clearInput() {
    latexInput.value = '';
    mathOutput.innerHTML = '';
    mathOutput.classList.remove('has-content');
    latexInput.focus();
}

// 导出为 PNG
function exportToPNG() {
    if (!mathOutput.innerHTML.trim() || mathOutput.innerHTML.includes('公式将在这里显示')) {
        alert('请先输入并渲染公式');
        return;
    }
    
    // 查找SVG元素
    const svgElement = mathOutput.querySelector('svg');
    if (!svgElement) {
        alert('未找到可导出的公式，请确保公式已正确渲染');
        return;
    }
    
    // 等待MathJax完全渲染完成
    setTimeout(() => {
        try {
            // 使用SVG转Canvas的方法
            convertSVGToPNG(svgElement);
        } catch (err) {
            console.error('PNG 导出失败:', err);
            alert('导出失败: ' + err.message);
        }
    }, 100);
}

// SVG转PNG的新方法
function convertSVGToPNG(svgElement) {
    // 获取SVG的尺寸
    const rect = svgElement.getBoundingClientRect();
    const width = rect.width || 200;
    const height = rect.height || 100;
    
    // 创建canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置高分辨率
    const scale = 3;
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    // 设置白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 缩放上下文
    ctx.scale(scale, scale);
    
    // 克隆SVG并序列化
    const clonedSvg = svgElement.cloneNode(true);
    clonedSvg.setAttribute('width', width);
    clonedSvg.setAttribute('height', height);
    
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    // 创建图片对象
    const img = new Image();
    img.onload = function() {
        // 绘制到canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // 转换为PNG并下载
        canvas.toBlob(function(blob) {
            if (blob) {
                const link = document.createElement('a');
                link.download = `latex-formula-${getTimestamp()}.png`;
                link.href = URL.createObjectURL(blob);
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // 清理URL
                URL.revokeObjectURL(link.href);
                URL.revokeObjectURL(url);
                
                console.log('PNG 导出完成');
            } else {
                alert('PNG 生成失败，请重试');
            }
        }, 'image/png', 1.0);
    };
    
    img.onerror = function() {
        URL.revokeObjectURL(url);
        alert('图片加载失败，请重试');
    };
    
    img.src = url;
}

// 导出为 SVG
function exportToSVG() {
    if (!mathOutput.innerHTML.trim() || mathOutput.innerHTML.includes('公式将在这里显示')) {
        alert('请先输入并渲染公式');
        return;
    }
    
    try {
        // 查找 MathJax 渲染的 SVG 元素
        const svgElement = mathOutput.querySelector('svg');
        
        if (!svgElement) {
            alert('未找到 SVG 元素，请确保公式已正确渲染。\n提示：请等待公式完全加载后再尝试导出。');
            return;
        }
        
        // 克隆 SVG 元素
        const clonedSvg = svgElement.cloneNode(true);
        
        // 设置 SVG 属性
        clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        
        // 获取计算后的样式
        const computedStyle = window.getComputedStyle(svgElement);
        
        // 获取 SVG 的实际尺寸
        const rect = svgElement.getBoundingClientRect();
        const width = rect.width || svgElement.clientWidth || parseFloat(svgElement.getAttribute('width')) || 100;
        const height = rect.height || svgElement.clientHeight || parseFloat(svgElement.getAttribute('height')) || 50;
        
        // 设置尺寸和视图框
        clonedSvg.setAttribute('width', width);
        clonedSvg.setAttribute('height', height);
        clonedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        
        // 确保字体样式被保留
        clonedSvg.style.fontFamily = computedStyle.fontFamily || 'Times, serif';
        clonedSvg.style.fontSize = computedStyle.fontSize || '16px';
        
        // 添加XML声明和DOCTYPE
        const svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                         '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
                         new XMLSerializer().serializeToString(clonedSvg);
        
        // 创建 Blob 和下载链接
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = `latex-formula-${getTimestamp()}.svg`;
        link.href = url;
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 清理 URL
        URL.revokeObjectURL(url);
        
        console.log('SVG 导出完成');
    } catch (err) {
        console.error('SVG 导出失败:', err);
        alert('SVG 导出失败: ' + err.message + '\n请重试或联系技术支持');
    }
}

// 创建用于导出的容器
function createExportContainer(svgElement) {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.background = '#ffffff';
    container.style.padding = '30px';
    container.style.margin = '0';
    container.style.border = 'none';
    container.style.boxShadow = 'none';
    container.style.transform = 'none';
    container.style.zIndex = '-1';
    
    // 克隆SVG元素而不是复制HTML
    const clonedSvg = svgElement.cloneNode(true);
    
    // 确保SVG样式正确
    const rect = svgElement.getBoundingClientRect();
    clonedSvg.style.display = 'block';
    clonedSvg.style.margin = '0';
    clonedSvg.style.padding = '0';
    clonedSvg.style.border = 'none';
    clonedSvg.style.background = 'transparent';
    
    container.appendChild(clonedSvg);
    document.body.appendChild(container);
    return container;
}

// 工具函数：获取当前时间戳
function getTimestamp() {
    const now = new Date();
    return now.getFullYear() + 
           String(now.getMonth() + 1).padStart(2, '0') + 
           String(now.getDate()).padStart(2, '0') + '_' +
           String(now.getHours()).padStart(2, '0') + 
           String(now.getMinutes()).padStart(2, '0') + 
           String(now.getSeconds()).padStart(2, '0');
}

// 错误处理
window.addEventListener('error', function(e) {
    console.error('全局错误:', e.error);
});

// MathJax 配置检查
window.addEventListener('load', function() {
    if (!window.MathJax) {
        console.warn('MathJax 未加载');
        mathOutput.innerHTML = '<div style="color: red;">MathJax 加载失败，请检查网络连接</div>';
    }
});

// 添加一些有用的快捷功能
document.addEventListener('keydown', function(e) {
    // Ctrl+S 导出 PNG
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        exportToPNG();
    }
    
    // Ctrl+Shift+S 导出 SVG
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        exportToSVG();
    }
    
    // Escape 清空
    if (e.key === 'Escape') {
        clearInput();
    }
});