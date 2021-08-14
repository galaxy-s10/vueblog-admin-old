export default {
    name: 'TableSlot',
    functional: true,
    inject: ['demoSlot'],
    props: {
        row: Object,
        index: Number,
        column: {
            type: Object,
            default: null
        }
    },
    render: (h, ctx) => {
        // console.log(h);
        // console.log(ctx);
        // console.log(ctx.props.column.slot);
        // console.log(ctx.injections.demoSlot.$scopedSlots);
        // return h('div', {
        //     row: ctx.props.row,
        //     column: ctx.props.column,
        //     index: ctx.props.index
        // },'xx');
        return h('div', ctx.injections.demoSlot.$scopedSlots[ctx.props.column.slot]({
            row: ctx.props.row,
            column: ctx.props.column,
            index: ctx.props.index
        }));
    }
};