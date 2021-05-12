

<script>
import Global from "@/layout/components/global.js";
import takePhone from '@/assets/images/takephone.png'
import { $CliCopy } from '@/utils/installTools.js'
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
            return h('i', {
                attrs: {
                    class: 'el-icon-copy-document',
                },
                on: {
                    'click': function (e) {
                        $CliCopy(e, number)
                    }
                },
                style: {
                    width: '22px',
                    height: '22px',
                    cursor: 'pointer',
                    marginLeft: '2px',
                    color: '#999'
                },
            })
        }

        // if (number) {
        //     return h('img', {
        //         attrs: {
        //             src: takePhone,
        //         },
        //         on: {
        //             'click': function (e) {
        //                 // Global.$emit("takePhone", number);
        //             }
        //         },
        //         style: {
        //             width: '22px',
        //             height: '22px',
        //             cursor: 'pointer',
        //         },
        //     })
        // }

    }
}
</script>