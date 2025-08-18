window.musicPlayer = {
    init() {
        if (!this.waitForAPlayer()) {
            console.log('等待 APlayer 加载...');
            return;
        }
        console.log('APlayer 已加载，开始初始化音乐播放器...');
        this.bindEvents();
        this.updateUI();
    },

    waitForAPlayer() {
        const meting = document.querySelector("meting-js");
        if (!meting || !meting.aplayer) {
            console.log('未找到 APlayer，1秒后重试...');
            setTimeout(() => this.init(), 1000);
            return false;
        }
        console.log('成功找到 APlayer 实例');
        this.aplayer = meting.aplayer;
        return true;
    },

    updateUI() {
        const menuMusicControl = document.getElementById('menu-music-control');
        if (!menuMusicControl || !this.aplayer) {
            console.log('更新UI失败：菜单或播放器未就绪');
            return;
        }

        const nameEl = menuMusicControl.querySelector('.menu-music-name');
        const artistEl = menuMusicControl.querySelector('.menu-music-artist');
        const playButton = menuMusicControl.querySelector('.menu-music-play');
        const pauseButton = menuMusicControl.querySelector('.menu-music-pause');
        const volumeSlider = menuMusicControl.querySelector('.volume-slider');

        try {
            // 更新歌曲信息
            if (this.aplayer.list.audios.length > 0) {
                const current = this.aplayer.list.audios[this.aplayer.list.index];
                if (nameEl) nameEl.textContent = current.name || '未知歌曲';
                if (artistEl) artistEl.textContent = current.artist || '未知歌手';
                console.log('当前播放:', current.name, '-', current.artist);
            } else {
                if (nameEl) nameEl.textContent = '未知歌曲';
                if (artistEl) artistEl.textContent = '未知歌手';
                console.log('播放列表为空');
            }

            // 更新播放/暂停按钮状态
            const isPaused = this.aplayer.audio.paused;
            if (playButton && pauseButton) {
                playButton.style.display = isPaused ? 'flex' : 'none';
                pauseButton.style.display = isPaused ? 'none' : 'flex';
                console.log('播放状态:', isPaused ? '已暂停' : '播放中');
            }

            // 更新音量
            if (volumeSlider && typeof this.aplayer.audio.volume !== 'undefined') {
                volumeSlider.value = this.aplayer.audio.volume;
                console.log('当前音量:', this.aplayer.audio.volume);
            }
        } catch (error) {
            console.error('更新UI时出错:', error);
        }
    },

    bindEvents() {
        if (!this.aplayer) {
            console.log('绑定事件失败：APlayer未就绪');
            return;
        }

        console.log('开始绑定事件...');

        // 监听APlayer事件
        const events = ['play', 'pause', 'playing', 'canplay', 'volumechange', 'loadeddata', 'loadstart', 'loadedmetadata', 'switch'];
        events.forEach(event => {
            this.aplayer.on(event, () => {
                console.log('APlayer事件触发:', event);
                this.updateUI();
            });
        });

        // 使用事件委托处理音乐控制点击事件
        const menuMusicControl = document.getElementById('menu-music-control');
        if (menuMusicControl) {
            menuMusicControl.addEventListener('click', (e) => {
                const target = e.target.closest('.rightMenu-item, .volume-slider');
                if (!target) return;

                console.log('点击音乐控制:', target.className);

                if (target.classList.contains('menu-music-play')) {
                    this.play();
                } else if (target.classList.contains('menu-music-pause')) {
                    this.pause();
                } else if (target.classList.contains('menu-music-prev')) {
                    this.skipBack();
                } else if (target.classList.contains('menu-music-next')) {
                    this.skipForward();
                }
            });
            console.log('音乐控制菜单事件已绑定');
        } else {
            console.warn('未找到音乐控制菜单元素');
        }

        // 单独处理音量滑块
        const volumeSlider = document.querySelector('.volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                console.log('音量滑块值变化:', e.target.value);
                this.volume(e.target.value);
            });
            console.log('音量滑块事件已绑定');
        } else {
            console.warn('未找到音量滑块元素');
        }

        // 监听右键菜单显示事件
        document.addEventListener('contextmenu', () => {
            if (this.aplayer) {
                console.log('右键菜单显示，更新音乐控制UI');
                setTimeout(() => this.updateUI(), 100);
            }
        });

        console.log('所有事件绑定完成');
    },

    play() {
        if (!this.aplayer) return;
        console.log('播放');
        this.aplayer.play();
        this.updateUI();
    },

    pause() {
        if (!this.aplayer) return;
        console.log('暂停');
        this.aplayer.pause();
        this.updateUI();
    },

    skipBack() {
        if (!this.aplayer) return;
        console.log('上一首');
        this.aplayer.skipBack();
        setTimeout(() => {
            this.aplayer.play();
            this.updateUI();
        }, 100);
    },

    skipForward() {
        if (!this.aplayer) return;
        console.log('下一首');
        this.aplayer.skipForward();
        setTimeout(() => {
            this.aplayer.play();
            this.updateUI();
        }, 100);
    },

    volume(value) {
        if (!this.aplayer) return;
        const vol = parseFloat(value);
        if (!isNaN(vol) && vol >= 0 && vol <= 1) {
            console.log('设置音量:', vol);
            this.aplayer.volume(vol, true);
            this.updateUI();
        }
    }
};

// 等待 meting-js 加载完成后初始化
const initObserver = new MutationObserver((mutations, observer) => {
    const meting = document.querySelector("meting-js");
    if (meting && meting.aplayer) {
        musicPlayer.init();
        observer.disconnect();
    }
});

// 开始观察
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
} else {
    initObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// 初始尝试初始化
musicPlayer.init();
