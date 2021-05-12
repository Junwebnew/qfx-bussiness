
import Clipboard from 'clipboard' //一键复制
import { Message } from 'element-ui';

//一键复制
export function $CliCopy(e, text) {

    var clipboard = new Clipboard(e.target || e, { text: () => text })
    clipboard.on('success', e => {
        Message.success('复制成功！')
        // 释放内存
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
    })
    clipboard.on('error', e => {

        console.error('复制功能错误', e)
        // 不支持复制
        Message.error('此浏览器不支持复制功能')
        // 释放内存
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
    })
    clipboard.onClick(e)
}