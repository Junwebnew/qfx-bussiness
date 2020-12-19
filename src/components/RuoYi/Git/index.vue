<template>
    <div>
        <svg-icon icon-class="international" @click="goto" />
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