<template>
    <div class="BackUpsViewTwo">
        <component :is='"BackUpsViewTwoPage"'></component>
    </div>
</template>
  
<script>
// @ is an alias to /src
import BackUpsViewTwoPage from '@/pages/BackUpsViewTwoPage/index.vue'

export default {
    name: 'BackUpsViewTwo',
    components: {
        BackUpsViewTwoPage
    },
    methods: {
    }
}
</script>
<style lang="scss">
.BackUpsViewTwo {
    width: 100%;
    height: 100%;
}
</style>
  