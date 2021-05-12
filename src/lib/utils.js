// es6导出
console.log('引入了untils.js')
var aaa = 123
window.aaa = aaa + 123
export var name = 'tom'
export var sum = function (x, y) {
    return x + y
}
function add(x, y) {
    return x + y
}
export default { add, aaa }