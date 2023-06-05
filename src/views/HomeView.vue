<template>
  <div class="home">
    <component :is='"HomeViewPage"'></component>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeViewPage from '@/pages/HomeViewPage/index.vue'

export default {
  name: 'HomeView',
  components: {
    HomeViewPage
  },
  methods: {
  }
}
</script>
<style lang="scss">
.home {
  width: 100%;
  height: 100%;
}
</style>
