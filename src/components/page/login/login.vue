<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" icon="fa fa-user-circle"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="fa fa-key"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
import bus from "../../layout/bus.js"
import menu from "./menu.js"
export default {
  data() {
    return {
        url:"/environment/user/login",
        url2role:"/environment/user/123",
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm() {
      this.$axios
        .get(this.url, {
          params: {
            user_id: this.ruleForm.username,
            password: this.ruleForm.password
          }
        })
        .then(res => {
          let status = res.data.status; //状态码
          let flag = res.data.frozeflag;//是否冻结
          let msg = "";
          if (status == 200) {
            if(flag!=1){
              this.$message({
                message: "你的账号已经冻结",
                type: "error"
              });
              return
            }
            msg = "登陆成功";
            sessionStorage.setItem("user_id", res.data.user_id);
            sessionStorage.setItem("user_name", res.data.user_name);
            // 存储路由权限
            let permissionList = res.data.permissionList[0].split(", ");
            sessionStorage.setItem("permissionList", JSON.stringify(permissionList));
            // 菜单权限
            let menu_list = JSON.parse(res.data.menuList[0])
            // let menu_list = menu.menu;
            sessionStorage.setItem("menu_list", JSON.stringify(menu_list));
            this.$message({
              message: msg,
              type: "success"
            });
            setTimeout(()=>{

              this.$router.push("/index"); //跳转到主页
            },1000)
          } else {
            msg = "用户名或者密码错误";
            this.$message({
              message: msg,
              type: "error"
            });
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(./login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
