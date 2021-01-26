<template>
    <div>
        <!-- <svg-icon icon-class="international" @click="goto" /> -->
        <i class="el-icon-position" @click="goto"></i>
    </div>
</template>

<script>
export default {
    name: 'RuoYiGit',
    data() {
        return {
            url: 'https://www.qmxip.com/'
        }
    },
    methods: {
        goto() {
            window.open(this.url)
        }
    }
}
</script>