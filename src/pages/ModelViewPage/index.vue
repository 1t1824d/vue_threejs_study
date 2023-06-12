<template>
    <div class="ModelViewPage">
        <div class="ModelViewPageOutbox">
            <div class="mythreedemojsdiv" ref="MyThreeJsContainer">
            </div>
        </div>
    </div>
</template>
<script>
import { DrawThreeJsClass } from './jsm/index'
export default {
    name: "ModelViewPage",
    data() {
        return {
            MyThreeJsContainer: null,
            InitDrawThreeJsClass: null
        }
    },
    beforeDestroy() {
        if (!this.InitDrawThreeJsClass.ThreeJsContainer) return;
        this.InitDrawThreeJsClass.dispose();
        this.InitDrawThreeJsClass = null
        this.MyThreeJsContainer = null
    },
    mounted() {
        this.$nextTick(() => {
            this.PromiseFun(this.Draw)
                .then(() => {
                    this.OnWindowResize()
                })
            // this.Draw()
            // this.OnWindowResize()
        })
    },
    methods: {
        PromiseFun(fun = fun()) {
            return new Promise((resolve, reject) => {
                let res = fun()
                resolve(res)
            })
        },
        Draw() {
            this.MyThreeJsContainer = this.$refs.MyThreeJsContainer
            this.InitDrawThreeJsClass = new DrawThreeJsClass(this.MyThreeJsContainer)

        },
        OnWindowResize() {
            //监听画面变化，更新渲染画面，（自适应的大小）
            window.addEventListener('resize', () => {
                this.InitDrawThreeJsClass.ParameterConfig.WBGLCanvasWidth = this.MyThreeJsContainer.getBoundingClientRect().width
                this.InitDrawThreeJsClass.ParameterConfig.WBGLCanvasHeight = this.MyThreeJsContainer.getBoundingClientRect().height
                this.InitDrawThreeJsClass.WindowResizeResetViewFun()

            })
        },
    }
}
</script>

<style lang="scss" scoped>
.ModelViewPage {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    .ModelViewPageOutbox {
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