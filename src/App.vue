<template>
  <div id="app">
    <div class="NavOutbox">
      <nav>
        <router-link v-for="(item, index) in LinkUrlPath" :key="index" :to="item.path">{{ item.meta.title }}</router-link>
      </nav>
    </div>
    <div class="RouterViewOutbox">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>
<script>
export default {
  name: "app",
  data() {
    return {
      LinkUrlPath: [
        {
          path: '/',
          name: 'home',
          meta: {
            title: "首页"
          }
        },
        {
          path: '/SimpleExample',
          name: 'SimpleExample',
          meta: {
            title: "简单示例"
          }
        },
        {
          path: '/SkyBoxView',
          name: 'SkyBoxView',
          meta: {
            title: "天空盒"
          }
        }, {
          path: '/VideoTextureView',
          name: 'VideoTextureView',
          meta: {
            title: "视频贴图"
          }
        },
        {
          path: '/InfoDialogView',
          name: 'InfoDialogView',
          meta: {
            title: "信息弹框"
          }
        },
        {
          path: '/EffectComposerView',
          name: 'EffectComposerView',
          meta: {
            title: "后期处理"
          }
        },
        {
          path: '/UVAnimation',
          name: 'UVAnimation',
          meta: {
            title: "UV动画"
          }
        },
        {
          path: '/Test',
          name: 'Test',
          meta: {
            title: "测试"
          }
        },
        {
          path: '/BackUpsViewOne',
          name: 'BackUpsViewOne',
          meta: {
            title: "备份1"
          }
        },
        {
          path: '/BackUpsViewTwo',
          name: 'BackUpsViewTwo',
          meta: {
            title: "备份2"
          }
        }
      ]
    }
  }
}
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;

  .NavOutbox {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    width: 100%;
    height: 50px;

    nav {
      border: 1px #2c3e50 solid;
      padding: 5px 0px;

      a {
        padding: 5px 15px;
        font-weight: bold;
        color: #2c3e50;
        text-decoration-line: none;

        &.router-link-exact-active {
          color: #fff;
          background: #42b983;
        }
      }
    }
  }

  .RouterViewOutbox {
    width: 100%;
    height: calc(100% - 50px);
  }
}
</style>
