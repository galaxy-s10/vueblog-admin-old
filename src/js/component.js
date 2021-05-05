// import 'css-loader!../css/index.css'
import '../css/index.css'
import '../css/main.less'
function component() {
    var ele = document.createElement('div')
    ele.innerHTML = ['hello', 'world'].join(" ")
    ele.className = 'content'


    // 创建一个img元素
    var imgEle = new Image()
    // imgEle.src = require('../img/img1.png').default
    imgEle.src = require('../img/img1.png')
    ele.appendChild(imgEle)

    // 创建一个放背景图的div
    var bgDivEle = document.createElement('div')
    bgDivEle.style.width = '100px'
    bgDivEle.style.height = '100px'
    bgDivEle.className = 'bg-img'
    bgDivEle.style.backgroundColor = 'red'
    ele.appendChild(bgDivEle)

    // 使用引入的字体文件
    var fontEle = document.createElement('i')
    // fontEle.innerText = '你好啊'
    // fontEle.style.fontFamily = 'webfont'
    fontEle.className = 'iconfont icon-ashbin'
    ele.appendChild(fontEle)


    return ele
}

document.body.appendChild(component())