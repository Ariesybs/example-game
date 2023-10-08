export class Cursor{
    constructor(){
        this.initCursor()
    }

    initCursor = ()=>{
        const customCursor = document.createElement('img');
        customCursor.src = '/cursor.png'; // 替换为实际卡通鼠标图案的文件路径
        customCursor.style.position = 'absolute';
        customCursor.style.pointerEvents = 'none';
        customCursor.style.width = "80px"
        customCursor.style.height = "80px"
        customCursor.style.zIndex = '9999';
        document.body.appendChild(customCursor);
        // 监听鼠标移动事件
        document.addEventListener('mousemove', (e) => {
          console.log(e)
          customCursor.style.left = `${e.clientX-20}px`;
          customCursor.style.top = `${e.clientY-20}px`;
        });
      }
}