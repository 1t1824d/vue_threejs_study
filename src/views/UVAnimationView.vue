<template>
  <div class="UVAnimation">
    <component :is='"UVAnimationViewPage"'></component>
  </div>
</template>
<script>
import UVAnimationViewPage from "@/pages/UVAnimationViewPage/index.vue"
export default {
  name: 'UVAnimationView',
  components: {
    UVAnimationViewPage
  },
  methods: {
  }
}
</script>
<style lang="scss">
.UVAnimation {
  width: 100%;
  height: 100%;
}
</style>
