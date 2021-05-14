// es6导出
console.log('引入了untils.js')
var ten = 10
var aaa = 123
// window.aaa = aaa + 123
export var name = 'tom'
export var sum = function (x, y) {
    console.log('33333', aaa)
    return x + y
}
function add(x, y) {
    console.log(ten, '44444')
    return x + y
}
export default { add }