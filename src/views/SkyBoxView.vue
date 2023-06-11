<template>
  <div class="SkyBoxView">
    <component :is='"SkyBoxViewPage"'></component>
  </div>
</template>

<script>
// @ is an alias to /src
import SkyBoxViewPage from '@/pages/SkyBoxViewPage/index.vue'

export default {
  name: 'SkyBoxView',
  components: {
    SkyBoxViewPage
  },
  methods: {
  }
}
</script>
<style lang="scss">
.SkyBoxView {
  width: 100%;
  height: 100%;
}
</style>
