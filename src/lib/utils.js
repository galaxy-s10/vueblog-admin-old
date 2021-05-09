// es6导出
console.log('引入了untils.js')
export var name = 'tom'
export var sum = function (x, y) {
    return x + y
}
function add(x, y) {
    return x + y
}
export default { add }