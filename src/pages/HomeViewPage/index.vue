<template>
    <div class="HomeViewPage">
        <el-button @click="() => { this.InitDrawThreeJsClass.dispose() }">销毁</el-button>
        <div class="HomeViewPageOutbox">
            <div class="mythreedemojsdiv" ref="MyThreeJsContainer">
            </div>
        </div>
    </div>
</template>
<script>
import { DrawThreeJsClass } from './jsm/index'
export default {
    name: "HomeViewPage",
    data() {
        return {
            MyThreeJsContainer: null,
            InitDrawThreeJsClass: null
        }
    },
    beforeDestroy() {
        this.DisposeFun()
    },
    mounted() {
        this.$nextTick(() => {
            this.Draw()
            this.OnWindowResize()
        })
    },
    methods: {
        Draw() {
            this.MyThreeJsContainer = this.$refs.MyThreeJsContainer
            this.InitDrawThreeJsClass = new DrawThreeJsClass(this.MyThreeJsContainer)

        },
        OnWindowResize() {
            //监听画面变化，更新渲染画面，（自适应的大小）
            window.addEventListener('resize', () => {
                if (this?.InitDrawThreeJsClass?.ParameterConfig) {
                    this.InitDrawThreeJsClass.ParameterConfig.WBGLCanvasWidth = this.MyThreeJsContainer.getBoundingClientRect().width
                    this.InitDrawThreeJsClass.ParameterConfig.WBGLCanvasHeight = this.MyThreeJsContainer.getBoundingClientRect().height
                    this.InitDrawThreeJsClass.WindowResizeResetViewFun()
                }

            })
        },
        DisposeFun() {
            if (this?.InitDrawThreeJsClass?.ThreeJsContainer) {
                this.InitDrawThreeJsClass.dispose();
                this.InitDrawThreeJsClass = null
                this.MyThreeJsContainer = null
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.HomeViewPage {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    .HomeViewPageOutbox {
        width: 60%;
        height: 60%;
        border: 2px red dashed;

        .mythreedemojsdiv {
            width: calc(100% - 0px);
            height: calc(100% - 0px);
            position: relative;
        }
    }
}
</style>