<template>
  <div class="VideoTextureView">
    <component :is='"VideoTextureViewPage"'></component>
  </div>
</template>

<script>
// @ is an alias to /src
import VideoTextureViewPage from '@/pages/VideoTextureViewPage/index.vue'

export default {
  name: 'VideoTextureView',
  components: {
    VideoTextureViewPage
  },
  methods: {
  }
}
</script>
<style lang="scss">
.VideoTextureView {
  width: 100%;
  height: 100%;
}
</style>
