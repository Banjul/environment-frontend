<template>
    <div class="base-content base-bg-color">
        <div class="center">
            <el-form label-position="right" label-width="120px" :rules="rules" ref="form" :model="form">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="tel">
                    <el-input v-model="form.tel"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="mail">
                    <el-input v-model="form.mail"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="new_pwd">
                    <el-input v-model="form.new_pwd" type="password"></el-input>
                </el-form-item>
                <el-form-item label="重复密码" prop="re_pwd">
                    <el-input v-model="form.re_pwd" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="submitForm('form')">修改</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>


<script>
export default {
    name:"info",
    data(){
        return{
            url:{
                info:"/environment/user/getUserByID",
                edit:"/environment/user/addUser"
            },
            form: {
                name: '',
                tel: '',
                mail: '',
                new_pwd:'',
                frozenflag:'',
                re_pwd:'',
                operation_id:'',
                role:''
            },
            rules:{
                name: [
                    { required: true, message: '必须输入用户名', trigger: 'blur' },
                ],
                tel: [
                    { required: true, message: '请填写手机号', trigger: 'change' }
                ],
                mail: [
                    { type:'email',required: true, message: '请输入正确的email格式', trigger: 'blur' },
                ],
                new_pwd: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                ],
                re_pwd: [
                    { required: true, message: '与上一次密码相同', trigger: 'blur' },
                ],
            },
            user_id:""
        }
    },
    mounted(){
        this.user_id = sessionStorage.getItem("user_id");
        this.getInfo(this.user_id);
    },
    methods:{
        getInfo(user_id){
            this.$axios.post(this.url.info,{
                selectedUserId:user_id
            }).then(res=>{
                this.form.name = res.data.userInfoData[0].user_name;
                this.form.tel = res.data.userInfoData[0].user_tel;
                this.form.mail = res.data.userInfoData[0].user_mail;
                this.form.role = res.data.userInfoData[0].role_id;
                this.form.frozenflag = res.data.userInfoData[0].frozenflag;
                this.form.operation_id = res.data.userInfoData[0].operation_id;
            })
        },
        submitForm(formName) {
        if(this.form.new_pwd!=this.form.re_pwd){
            this.$message({
              message: "两次输入密码不一致",
              type: "error"
            });
            return
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post(this.url.edit,{
                "type":'updatePWD',
                "user_id": this.user_id+"",
                "user_name": this.form.name+"",
                "password": this.form.new_pwd+"",
                "user_tel": this.form.tel+"",
                "user_mail": this.form.mail+"",
                "role": this.form.role+"",
                "frozenflag": this.form.frozenflag+"",
                "operation_id": this.form.operation_id+""
            }).then(res=>{
                if(res.data.updateFlag == "true"){
                    this.$message({
                        message: "修改成功",
                        type: "success"
                    });
                }
            })
          } else {
            this.$message({
              message: "请检查填写内容",
              type: "error"
            });
            return false;
          }
        });
      },
    }
}
</script>
<style scoped>
.center{
    width: 600px;
    /* margin: auto; */
}
.el-form-item__label{
    font-size: 22px;
}
</style>

