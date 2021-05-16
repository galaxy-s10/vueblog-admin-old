let utils = {}

// 判断a是否在b数组里
utils.oneOf = (a, b) => {
    // console.log('判断a是否在b数组里');
    b.forEach(item => {
        console.log(item);
    })
}

// 判断数组里是否有某个值
utils.exist = (arr, val) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].name == val) {
            return true
        }
    }
    return false
}

// 获取样式
utils.getStyle = (obj, name) => {
    if (window.getComputedStyle) {
        // 非ie
        return window.getComputedStyle(obj, null)[name];
    }
    else {
        // ie
        return obj.currentStyle[name];
    }
}

// 转换时间格式
utils.formateDate = (datetime) => {
    function addDateZero(num) {
        return num < 10 ? "0" + num : num;
    }
    let d = new Date(datetime);
    let formatdatetime =
        d.getFullYear() +
        "-" +
        addDateZero(d.getMonth() + 1) +
        "-" +
        addDateZero(d.getDate()) +
        " " +
        addDateZero(d.getHours()) +
        ":" +
        addDateZero(d.getMinutes()) +
        ":" +
        addDateZero(d.getSeconds());
    return formatdatetime;
}
// 时间戳转时间
utils.formateDate1 = function (date) {
    let odate = new Date(date)
    let y = odate.getFullYear();
    let m = odate.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = odate.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = odate.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = odate.getMinutes();
    let second = odate.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    let mydate = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    return mydate
}
export default utils;