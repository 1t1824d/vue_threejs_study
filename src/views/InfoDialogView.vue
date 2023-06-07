<template>
    <div class="InfoDialogView">
        <component :is='"InfoDialogViewPage"'></component>
    </div>
</template>
  
<script>
// @ is an alias to /src
import InfoDialogViewPage from '@/pages/InfoDialogViewPage/index.vue'

export default {
    name: 'InfoDialogView',
    components: {
        InfoDialogViewPage
    },
    methods: {
    }
}
</script>
<style lang="scss">
.InfoDialogView {
    width: 100%;
    height: 100%;
}
</style>
  