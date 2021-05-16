export default {
    isPhone: [
        {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
        },
    ],
    isParseInt: [
        {
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur"
        },
    ],
    isEmail: [
        {
            required: true,
            type: "email",
            message: "请输入正确的邮箱",
            trigger: "blur"
        },
    ],
    isWord: [
        {
            pattern: /^[\u4e00-\u9fa5]+$/gi,
            message: "只能是文字",
            trigger: "blur"
        },
    ]
}