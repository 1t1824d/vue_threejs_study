
<template>
    <div class="Model">
      <component :is='"ModelViewPage"'></component>
    </div>
  </template>
  <script>
  import ModelViewPage from "@/pages/ModelViewPage/index.vue"
  export default {
    name: 'ModelView',
    components: {
      ModelViewPage
    },
    methods: {
    }
  }
  </script>
  <style lang="scss">
  .Model {
    width: 100%;
    height: 100%;
  }
  </style>
  