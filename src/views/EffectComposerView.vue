<template>
    <div class="EffectComposerView">
        <component :is='"EffectComposerViewPage"'></component>
    </div>
</template>
  
<script>
// @ is an alias to /src
import EffectComposerViewPage from '@/pages/EffectComposerViewPage/index.vue'

export default {
    name: 'EffectComposerView',
    components: {
        EffectComposerViewPage
    },
    methods: {
    }
}
</script>
<style lang="scss">
.EffectComposerView {
    width: 100%;
    height: 100%;
}
</style>
  