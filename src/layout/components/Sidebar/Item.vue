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
        },
        unit: {
            type: String,
            default: ''
        }
    },
    render(h, context) {
        const { icon, title, unit } = context.props
        const vnodes = []

        function mathUnit(unit) {

            // console.log('33', title, unit)

            if (unit && unit.trim()) {
                return (<i class='col-red f12 vertop'>{unit}</i>)
            }
        }

        if (icon) {
            vnodes.push(<svg-icon icon-class={icon} />)
        }

        if (title) {
            vnodes.push(<span slot='title'>{title} {mathUnit(unit)}</span>)
        }
        return vnodes
    }
}
</script>
