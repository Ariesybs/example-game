export class Loading {
    constructor() {
      this.element = document.createElement('div');
      this.element.style.position = 'absolute';
      this.element.style.width = '100%';
      this.element.style.height = '100%';
      this.element.style.backgroundColor = '#ffffff';
      this.element.style.display = 'flex';
      this.element.style.justifyContent = 'center';
      this.element.style.alignItems = 'center';
  
      // 添加 GIF 图像
      this.gifImage = new Image();
      this.gifImage.src = 'img/cxk.gif'; // 替换为你的 GIF 图像路径
      this.element.appendChild(this.gifImage);
  
      // 添加进度条
      this.progressBar = document.createElement('div');
      this.progressBar.style.width = '200px'; // 调整进度条宽度
      this.progressBar.style.height = '20px'; // 调整进度条高度
      this.progressBar.style.backgroundColor = 'blue'; // 进度条颜色
      this.progressBar.style.marginTop = '20px'; // 调整进度条与图像之间的间距
      this.element.appendChild(this.progressBar);
  
      // 创建加载进度文本
      this.loadingText = document.createElement('div');
      this.loadingText.textContent = 'Loading 0%';
      this.element.appendChild(this.loadingText);
  
      document.body.appendChild(this.element);
    }
  
    setProgress(progress) {
      this.loadingText.textContent = `Loading ${progress}%`;
      this.progressBar.style.width = `${progress * 2}px`; // 更新进度条宽度
    }
  
    complete() {
      // 添加加载完成后的动画效果，例如淡出
      this.element.style.transition = 'opacity 1s';
      this.element.style.opacity = '0';
  
      // 在动画结束后移除加载页面
      this.element.addEventListener('transitionend', () => {
        document.body.removeChild(this.element);
      });
    }
}