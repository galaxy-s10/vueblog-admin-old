export default {
    functional: true,
    props: {
        row: Object,
        render:Function,
        index: Number,
        column: {
            type: Object,
            default: null
        }
    },
    render: (h, ctx) => {
        const params = {
            row: ctx.props ?ctx.props.row:{},
            index: ctx.props ?ctx.props.index:0,
        };
        if (ctx.props.column) params.column = ctx.props.column;
        return ctx.props.render(h, params);
    }
};