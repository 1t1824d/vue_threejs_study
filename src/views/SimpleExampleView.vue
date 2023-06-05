<template>
    <div class="SimpleExampleView">
        <component :is='"SimpleExampleViewPage"'></component>
    </div>
</template>
  
<script>
// @ is an alias to /src
import SimpleExampleViewPage from '@/pages/SimpleExampleViewPage/index.vue'

export default {
    name: 'SimpleExampleView',
    components: {
        SimpleExampleViewPage
    },
    methods: {
    }
}
</script>
<style lang="scss">
.SimpleExampleView {
    width: 100%;
    height: 100%;
}
</style>
  