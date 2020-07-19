<template>
    <div class="dialog" v-show="showMask">
        <div class="dialog-container">
            <!-- <div class="dialog-title">{{title}}</div> -->
            <div class="content_" v-html="content"></div>
            <div class="content1_" v-html="content1"></div>
            <div class="content2_" v-html="content2"></div>
            <div class="content3_" >
                <el-button class="content_button"
                         type="text"
                         style="color:#4b91ed;font-size:18px"
                         v-on:click="handleClickStationName()">
                         {{content3.station_name}} - 站点详情页
                </el-button>
            </div>
            <!-- <div class="btns">
                <div v-if="type == 'cancel'" class="default-btn" @click="closeBtn">
                    {{cancelText}}
                </div>
                <div v-if="type == 'danger'" class="danger-btn" @click="dangerBtn">
                    {{dangerText}}
                </div>
                <div v-if="type == 'confirm'" class="confirm-btn" @click="confirmBtn">
                    {{confirmText}}
                </div>
            </div>
            <div class="close-btn" @click="closeMask"><i class="iconfont icon-close"></i></div> -->
        </div>
        
    </div>
</template>
<script>
export default {
    props: {
        value: {},
        // 类型包括 defalut 默认， danger 危险， confirm 确认，
        type:{
            type: String,
            default: 'default'
        },
        content: {
            type: String,
            default: ''
        }, 
        content1: {
            type: String,
            default: ''
        },
        content2: {
            type: String,
            default: ''
        },
        content3: {
            type: Object,
            default: { }
        },
        title: {
            type: String,
            default: ''
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        dangerText: {
            type: String,
            default: '删除'
        },
        confirmText: {
            type: String,
            default: '确认'
        },
    },
    data(){
        return{
            showMask: false,
        }
    },
    methods:{
        closeMask(){
            this.showMask = false;
        },
        closeBtn(){
            this.$emit('cancel');
            this.closeMask();
        },
        dangerBtn(){
            this.$emit('danger');
            this.closeMask();
        },
        confirmBtn(){
            this.$emit('confirm');
            this.closeMask();
        },
        handleClickStationName(){
            if(this.content3.O_status=="流动"){
                this.$router.push({
                    path:"/trackmap",
                    query:{gather_id:this.content3.id,gather_name:this.content3.name}
                });
                return
            }
            this.$router.push({
                path:"/singlepage",
                query: this.content3
            });
        }
    },
    mounted(){
        this.showMask = this.value;
    },
    watch:{
        value(newVal, oldVal){
            this.showMask = newVal;
        },
        showMask(val) {
            this.$emit('input', val);
        }
    },
}
</script>
<style  lang="less" scoped>
    .dialog{
        width: 500px;
        height: 250px;
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 8px;
        background: rgba(0, 0, 0, 0);
        z-index: 9999;
        .dialog-container{
            width: 500px;
            height: 250px;
            background: rgba(0, 0, 0, 0.7);
            position: absolute;
            display: grid;
            grid-template-columns: 1fr 1fr;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 8px;
            position: relative;
            .dialog-title{
                width: 100%;
                height: 64px;
                font-size: 17px;
                color: #dddcdc;
                font-weight: 450;
                font-family:"微软雅黑";
                padding: 15px 0 0% 50%;
                transform: translate(-10%, -0%);
                box-sizing: border-box;
            }
            .content_{
                color: #dddcdc;
                // display: inline-block;
                // width:47%;
                line-height: 37px;
                font-size: medium;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                padding: 0px 0px 0px 30px;
                transform: translate(-0%, 20%);
                box-sizing: border-box;
            }
            .content1_{
                color: #dddcdc;
                // display: inline-block;
                // width:47%;
                line-height: 37px;
                font-size: medium;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                padding: 0px 0px 0px 20px;
                transform: translate(0%, 20%);
                box-sizing: border-box;
            }
            .content2_{
                color: #dddcdc;
                // display: inline-block;
                width:150px;
                // grid-column-start: 1;
                // grid-column-end: 4;
                line-height: 37px;
                font-size: medium;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                padding: 0px 0px 0px 30px;
                transform: translate(0%, 15%);
                box-sizing: border-box;
            }
            .content3_{
                color: #dddcdc;
                // grid-column-start: 2;
                // grid-column-end: 4;
                line-height: 37px;
                font-size: medium;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin:0px 0px 0px -140px;
                transform: translate(0%, 15%);
                box-sizing: border-box;
            }
            .content_button{
                font-size: medium !important;
            }
            .inp{
                margin: 10px 0 0 20px;
                width: 200px;
                height: 40px;
                padding-left: 4px;
                border-radius: 4px;
                border: none;
                background: #efefef;
                outline: none;
                &:focus{
                    border: 1px solid #509EE3;
                }
            }
            .btns{
                width: 100%;
                height: 60px;
                //line-height: 60px;
                position: absolute;
                bottom: 0;
                left: 0;
                text-align: right;
                padding: 0 16px;
                box-sizing: border-box;
                & > div{
                    display: inline-block;
                    height: 40px;
                    line-height: 40px;
                    padding: 0 14px;
                    color: #ffffff;
                    background: #f1f1f1;
                    border-radius: 8px;
                    margin-right: 12px;
                    cursor: pointer;
                }
                .default-btn{
                    color: #787878;
                    &:hover{
                        color: #509EE3; 
                    }
                }
                .danger-btn{
                    background: #EF8C8C;
                    &:hover{
                        background: rgb(224, 135, 135);
                    }
                    &:active{
                        background: #EF8C8C;
                    }
                }
                .confirm-btn{
                    color: #ffffff;
                    background: #509EE3;
                    &:hover{
                        background: #6FB0EB;
                    }
                }
            }
            .close-btn{
                display: none;
                color: #ee0b0b;
                position: absolute;
                top: 0px;
                right: 0px;
                width: 35px;
                height: 35px;
                line-height: 35px;
                text-align: center;
                font-size: 20px;
                cursor: pointer;
                &:hover{
                    font-weight: 600;
                }
                &:after {
                    color: rgb(252, 252, 252);
                    content: "×";
                }
            }
        }
    }
</style>
