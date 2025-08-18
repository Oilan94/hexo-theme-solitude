// 音乐控制模块 - 统一管理音乐播放器控制
const musicControl = {
    player: null,
    aplayer: null,
    menuElement: null,
    initialized: false,

    // 初始化
    init() {
        console.log('初始化音乐控制模块...');
        
        // 获取菜单元素
        this.menuElement = document.getElementById('menu-music-control');
        if (!this.menuElement) {
            console.warn('未找到音乐控制菜单元素');
            return this;
        }

        // 获取播放器实例
        this.player = document.querySelector('meting-js');
        this.aplayer = this.player && this.player.aplayer;
        
        if (!this.aplayer) {
            console.log('等待播放器加载...');
            setTimeout(() => this.init(), 1000);
            return this;
        }

        if (!this.initialized) {
            this.initializeEvents();
            this.initialized = true;
        }

        this.updateInterface();
        console.log('音乐控制模块初始化完成');
        return this;
    },

    // 获取当前播放的歌曲信息
    getCurrentSong() {
        if (!this.aplayer) return {};
        try {
            const currentList = this.aplayer.list.audios;
            const currentIndex = this.aplayer.list.index;
            return currentList[currentIndex] || {};
        } catch (error) {
            console.error('获取当前歌曲信息失败:', error);
            return {};
        }
    },

    // 播放/暂停切换
    toggle() {
        if (!this.aplayer) return;
        try {
            if (this.aplayer.audio.paused) {
                this.play();
            } else {
                this.pause();
            }
        } catch (error) {
            console.error('切换播放状态失败:', error);
        }
    },

    // 播放
    play() {
        if (!this.aplayer) return;
        try {
            console.log('播放音乐');
            this.aplayer.play();
            this.updateInterface();
        } catch (error) {
            console.error('播放失败:', error);
        }
    },

    // 暂停
    pause() {
        if (!this.aplayer) return;
        try {
            console.log('暂停播放');
            this.aplayer.pause();
            this.updateInterface();
        } catch (error) {
            console.error('暂停失败:', error);
        }
    },

    // 上一首
    prev() {
        if (!this.aplayer) return;
        try {
            console.log('切换到上一首');
            this.aplayer.skipBack();
            setTimeout(() => {
                this.play();
                this.updateInterface();
            }, 100);
        } catch (error) {
            console.error('切换上一首失败:', error);
        }
    },

    // 下一首
    next() {
        if (!this.aplayer) return;
        try {
            console.log('切换到下一首');
            this.aplayer.skipForward();
            setTimeout(() => {
                this.play();
                this.updateInterface();
            }, 100);
        } catch (error) {
            console.error('切换下一首失败:', error);
        }
    },

    // 设置音量
    setVolume(value) {
        if (!this.aplayer) return;
        try {
            const vol = parseFloat(value);
            if (!isNaN(vol) && vol >= 0 && vol <= 1) {
                console.log('设置音量:', vol);
                this.aplayer.volume(vol, true);
                this.updateInterface();
            }
        } catch (error) {
            console.error('设置音量失败:', error);
        }
    },

    // 获取当前音量
    getVolume() {
        if (!this.aplayer) return 0;
        try {
            return this.aplayer.audio.volume;
        } catch (error) {
            console.error('获取音量失败:', error);
            return 0;
        }
    },

    // 更新界面
    updateInterface() {
        if (!this.menuElement || !this.aplayer) return;
        
        try {
            const elements = {
                name: this.menuElement.querySelector('.menu-music-name'),
                artist: this.menuElement.querySelector('.menu-music-artist'),
                play: this.menuElement.querySelector('.menu-music-play'),
                pause: this.menuElement.querySelector('.menu-music-pause'),
                volume: this.menuElement.querySelector('.volume-slider')
            };

            // 更新歌曲信息
            const currentSong = this.getCurrentSong();
            if (elements.name) elements.name.textContent = currentSong.name || '未知歌曲';
            if (elements.artist) elements.artist.textContent = currentSong.artist || '未知歌手';

            // 更新播放/暂停按钮状态
            const isPaused = this.aplayer.audio.paused;
            if (elements.play && elements.pause) {
                elements.play.style.display = isPaused ? 'flex' : 'none';
                elements.pause.style.display = isPaused ? 'none' : 'flex';
            }

            // 更新音量滑块
            if (elements.volume) {
                elements.volume.value = this.getVolume();
            }

            console.log('界面已更新:', {
                song: currentSong.name,
                artist: currentSong.artist,
                isPaused: isPaused,
                volume: this.getVolume()
            });
        } catch (error) {
            console.error('更新界面失败:', error);
        }
    },

    // 初始化事件监听
    initializeEvents() {
        if (!this.aplayer || !this.menuElement) return;

        try {
            // 播放器事件
            ['play', 'pause', 'playing', 'canplay', 'volumechange', 'loadeddata', 'loadstart', 'loadedmetadata', 'switch']
            .forEach(event => {
                this.aplayer.on(event, () => {
                    console.log('播放器事件:', event);
                    this.updateInterface();
                });
            });

            // 控制按钮事件
            const controls = {
                '.menu-music-prev': () => this.prev(),
                '.menu-music-next': () => this.next(),
                '.menu-music-play': () => this.play(),
                '.menu-music-pause': () => this.pause()
            };

            Object.entries(controls).forEach(([selector, handler]) => {
                const element = this.menuElement.querySelector(selector);
                if (element) {
                    element.onclick = (e) => {
                        e.preventDefault();
                        console.log('点击控制按钮:', selector);
                        handler();
                    };
                }
            });

            // 音量控制
            const volumeSlider = this.menuElement.querySelector('.volume-slider');
            if (volumeSlider) {
                volumeSlider.addEventListener('input', (e) => {
                    this.setVolume(e.target.value);
                });
            }

            // 右键菜单显示时更新状态
            document.addEventListener('contextmenu', () => {
                setTimeout(() => this.updateInterface(), 100);
            });

            console.log('事件监听初始化完成');
        } catch (error) {
            console.error('初始化事件监听失败:', error);
        }
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    musicControl.init();
});

// 使用 MutationObserver 监听播放器加载
const initObserver = new MutationObserver((mutations, observer) => {
    const meting = document.querySelector('meting-js');
    if (meting && meting.aplayer) {
        console.log('检测到播放器加载完成');
        musicControl.init();
        observer.disconnect();
    }
});

// 开始观察
initObserver.observe(document.body, {
    childList: true,
    subtree: true
});

// 导出模块
export default musicControl;
