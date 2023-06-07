/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}


//屏幕坐标转three.js坐标

export let ScreenTransToThreeCoord = (canvas, evt, mouse) => {
  let style = window.getComputedStyle(canvas, null);
  //宽高
  let cssWidth = parseFloat(style["width"]);
  let cssHeight = parseFloat(style["height"]);
  //各个方向的边框长度
  let borderLeft = parseFloat(style["border-left-width"]);
  let borderTop = parseFloat(style["border-top-width"]);
  let paddingLeft = parseFloat(style["padding-left"]);
  let paddingTop = parseFloat(style["padding-top"]);

  let scaleX = canvas.width / cssWidth; // 水平方向的缩放因子
  let scaleY = canvas.height / cssHeight; // 垂直方向的缩放因子

  let x = evt.clientX;
  let y = evt.clientY;

  let rect = canvas.getBoundingClientRect();
  x -= (rect.left + borderLeft + paddingLeft); // 去除 borderLeft paddingLeft 后的坐标
  y -= (rect.top + borderTop + paddingTop); // 去除 borderLeft paddingLeft 后的坐标

  x *= scaleX; // 修正水平方向的坐标
  y *= scaleY; // 修正垂直方向的坐标

  mouse.x = (x / cssWidth) * 2 - 1;
  mouse.y = -(y / cssHeight) * 2 + 1;
  return mouse;
}
/* 
**ScreenTransToThreeCoord使用示例
let mouse =ScreenTransToThreeCoord(canvasDom,event,this.ParameterConfig.WBGLCanvasWidth,this.ParameterConfig.WBGLCanvasHeight,new THREE.Vector2())
*/

//three.js坐标转屏幕坐标---立方体世界坐标转屏幕坐标
/**
* 将three.js三维坐标转换成屏幕上的二维坐标
* @param THREE.Vector3 vector three.js三维坐标
* @return {x:int,y:int} 屏幕坐标
*/
export let ThreeTransToScreenCoord = (worldVector, camera, canvas) => {
  let standardVector = worldVector.project(camera);//世界坐标转标准设备坐标
  let style = window.getComputedStyle(canvas, null);
  let cssWidth = parseFloat(style["width"]);
  let cssHeight = parseFloat(style["height"]);
  let a = cssWidth / 2;
  let b = cssHeight / 2;
  let x = Math.round(standardVector.x * a + a);//标准设备坐标转屏幕坐标
  let y = Math.round(-standardVector.y * b + b);//标准设备坐标转屏幕坐标
  let screenCoord = { x, y };
  return screenCoord;
}
/* 
**ThreeTransToScreenCoord使用示例
  let canvasDom=this.ParameterConfig.renderer.domElement
 let screenCoord=ThreeTransToScreenCoord(new THREE.Vector3(),this.ParameterConfig.camera,canvasDom)
*/

/**
 * 
 * @param {dom} canvas canvas的dom对象
 * @param {event} evt 传入鼠标按下，收起或者移动事件
 * @returns {x,y} 返回鼠标在canvas里的x,y坐标 
 */
export const GetXYToCanvas = (canvas, evt) => {
  let style = window.getComputedStyle(canvas, null);
  //宽高
  let cssWidth = parseFloat(style["width"]);
  let cssHeight = parseFloat(style["height"]);
  //各个方向的边框长度
  let borderLeft = parseFloat(style["border-left-width"]);
  let borderTop = parseFloat(style["border-top-width"]);
  let paddingLeft = parseFloat(style["padding-left"]);
  let paddingTop = parseFloat(style["padding-top"]);

  let scaleX = canvas.width / cssWidth; // 水平方向的缩放因子
  let scaleY = canvas.height / cssHeight; // 垂直方向的缩放因子

  let x = evt.clientX;
  let y = evt.clientY;

  let rect = canvas.getBoundingClientRect();
  x -= (rect.left + borderLeft + paddingLeft); // 去除 borderLeft paddingLeft 后的坐标
  y -= (rect.top + borderTop + paddingTop); // 去除 borderLeft paddingLeft 后的坐标

  x *= scaleX; // 修正水平方向的坐标
  y *= scaleY; // 修正垂直方向的坐标

  return { x, y }
};
/* 
**GetXYToCanvas使用示例
    let canvasDom=this.ParameterConfig.renderer.domElement
    let Coordinate=GetXYToCanvas(canvasDom,event)
    返回 { x, y }
*/
