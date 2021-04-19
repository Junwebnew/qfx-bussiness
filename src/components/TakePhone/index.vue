

<script>
import Global from "@/layout/components/global.js";
import takePhone from '@/assets/images/takephone.png'
export default {
    name: 'TelPhone',
    functional: true,
    props: {
        number: {
            type: String | Number,
            default: ''
        }
    },
    render(h, context) {
        const { number } = context.props

        if (number) {
            return h('img', {
                attrs: {
                    src: takePhone,
                },
                on: {
                    'click': function () {
                        Global.$emit("takePhone", number);
                    }
                },
                style: {
                    width: '22px',
                    height: '22px',
                    cursor: 'pointer',
                },
            })
        }

    }
}
</script>