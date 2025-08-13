/**
 * 相册功能管理
 * 利用solitude主题内置的fancybox功能
 */

class AlbumManager {
  constructor() {
    this.config = {
      // 瀑布流配置 - 禁用以避免干扰gallery布局
      waterfall: {
        enable: false,
        column_count: 3,
        responsive: {
          tablet: 2,
          mobile: 1
        }
      },
      // 灯箱配置
      lightbox: {
        enable: true,
        type: "fancybox"
      },
      // 懒加载配置
      lazyload: {
        enable: true,
        threshold: 0.1
      }
    };
    
    this.init();
  }

  // 初始化瀑布流布局 - 利用主题内置功能
  initWaterfall() {
    if (!this.config.waterfall.enable) return;

    // 不要干扰gallery瀑布流布局
    const waterfall = document.querySelector('#waterfall.list');
    if (!waterfall) return;

    // 使用主题内置的waterfall功能
    if (typeof window.sco !== 'undefined' && window.sco.refreshWaterFall) {
      // 等待DOM完全加载后初始化
      setTimeout(() => {
        window.sco.refreshWaterFall();
      }, 100);
    } else if (typeof waterfall === 'function') {
      // 直接使用waterfall函数
      waterfall(waterfall);
    } else {
      console.warn('Waterfall function not available');
    }
  }

  // 初始化justified gallery布局
  initJustifiedGallery() {
    const galleries = document.querySelectorAll('.fj-gallery');
    if (galleries.length === 0) return;

    // 等待插件加载完成
    if (typeof fjGallery !== 'undefined') {
      galleries.forEach(gallery => {
        const rowHeight = gallery.getAttribute('data-rowHeight') || 220;
        const limit = gallery.getAttribute('data-limit') || 10;
        const dataElement = gallery.querySelector('.gallery-data');
        
        if (dataElement) {
          try {
            const data = JSON.parse(dataElement.textContent);
            fjGallery(gallery, {
              rowHeight: parseInt(rowHeight),
              maxRowsCount: parseInt(limit),
              margins: 5,
              lastRow: 'justify'
            });
          } catch (e) {
            console.error('Failed to parse gallery data:', e);
          }
        }
      });
    } else {
      // 如果插件还没加载，等待一下再试
      setTimeout(() => this.initJustifiedGallery(), 500);
    }
  }

  // 初始化灯箱效果 - 利用主题内置功能
  initLightbox() {
    if (!this.config.lightbox.enable) return;
    
    // 不重复绑定Fancybox，使用主题内置功能
    // 主题已经在utils.js中处理了Fancybox绑定
  }

  // 初始化懒加载
  initLazyLoad() {
    if (!this.config.lazyload.enable) return;
    
    // 使用主题内置的懒加载功能
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      }, {
        threshold: this.config.lazyload.threshold
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // 绑定事件
  bindEvents() {
    // 移除自定义的图片点击事件，使用主题内置的Fancybox
    // 主题已经通过data-fancybox属性自动处理了图片预览
    
    // 响应式处理
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  // 处理响应式布局
  handleResize() {
    const waterfall = document.querySelector('#waterfall.list');
    if (!waterfall) return;
    
    // 根据屏幕宽度调整列数
    const width = window.innerWidth;
    if (width <= 768) {
      // 移动端：单列
      waterfall.style.setProperty('--column-count', '1');
    } else if (width <= 1200) {
      // 平板：双列
      waterfall.style.setProperty('--column-count', '2');
    } else {
      // 桌面：三列
      waterfall.style.setProperty('--column-count', '3');
    }
  }

  // 刷新相册
  refresh() {
    this.initWaterfall();
    this.initJustifiedGallery();
    this.initLightbox();
    this.initLazyLoad();
  }

  // 清理Fancybox
  cleanupFancybox() {
    // 清理可能残留的Fancybox元素
    if (typeof Fancybox !== 'undefined') {
      // 关闭所有打开的Fancybox实例
      Fancybox.close();
      
      // 清理焦点守卫元素
      const guards = document.querySelectorAll('.fancybox-focus-guard');
      guards.forEach(guard => guard.remove());
      
      // 清理多余的容器
      const containers = document.querySelectorAll('.fancybox__container');
      if (containers.length > 1) {
        // 保留第一个，删除其他的
        for (let i = 1; i < containers.length; i++) {
          containers[i].remove();
        }
      }
    }
  }

  // 初始化函数
  init() {
    // 先清理可能残留的Fancybox
    this.cleanupFancybox();
    
    this.initWaterfall();
    this.initJustifiedGallery();
    this.initLightbox();
    this.initLazyLoad();
    this.bindEvents();
    this.handleResize();
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  window.albumManager = new AlbumManager();
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  if (window.albumManager) {
    window.albumManager.cleanupFancybox();
  }
});

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AlbumManager;
}
