<template>
    <div class="BackUpsViewOne">
        <component :is='"BackUpsViewOnePage"'></component>
    </div>
</template>
  
<script>
import BackUpsViewOnePage from '@/pages/BackUpsViewOnePage/index.vue'

export default {
    name: 'BackUpsViewOne',
    components: {
        BackUpsViewOnePage
    },
    methods: {
    }
}
</script>
<style lang="scss">
.BackUpsViewOne {
    width: 100%;
    height: 100%;
}
</style>
  