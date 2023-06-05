<template>
  <div class="test">
    <component :is='"TestViewPage"'></component>
  </div>
</template>

<script>
// @ is an alias to /src
import TestViewPage from '@/pages/TestViewPage/index.vue'

export default {
  name: 'TestView',
  components: {
    TestViewPage
  },
  methods: {
  }
}
</script>
<style lang="scss">
.test {
  width: 100%;
  height: 100%;
}
</style>
