<template>
    <div class="InfoDialogViewPage">
        <el-button @click="() => { this.InitDrawThreeJsClass.dispose() }">销毁</el-button>
        <div class="InfoDialogViewPageOutbox">
            <div class="mythreedemojsdiv" ref="MyThreeJsContainer">
            </div>
        </div>
        <img :src="itemImg(Theme, ImgName)" alt="">
    </div>
</template>
<script>
import { DrawThreeJsClass } from './jsm/index'
export default {
    name: "InfoDialogViewPage",
    data() {
        return {
            MyThreeJsContainer: null,
            InitDrawThreeJsClass: null,
            Theme:"",
            ImgName:"logo.png"
        }
    },
    computed: {
        itemImg() {
            return (item, imgName) => {
                return require(`@/assets/img/${item}${imgName}`)
            }
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
        DomRequireImg(src) {
            return require(src)
        },
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
.InfoDialogViewPage {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    .InfoDialogViewPageOutbox {
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