<script>
export default {
    name: 'MenuItem',
    functional: true,
    props: {
        icon: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        }
    },
    render(h, context) {
        const { icon, title } = context.props
        const vnodes = []

        function mathUnit(title) {
            let arr = ['疑似被驳回', '疑似驳回', '疑似被异议']
            if (arr.includes(title)) {
                return (<i class='col-red f12 vertop'>星</i>)
            }
        }

        if (icon) {
            vnodes.push(<svg-icon icon-class={icon} />)
        }

        if (title) {
            vnodes.push(<span slot='title'>{title} {mathUnit(title)}</span>)
        }
        return vnodes
    }
}
</script>
