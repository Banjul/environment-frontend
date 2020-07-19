<template>
  <div class="base-content base-bg-color">

    <el-row >
      <el-col :span="3">
        <div>
          <el-select
            v-model="selectedUserId"
            filterable
            placeholder="请输入关键词"
            remote
            reserve-keyword
            :remote-method="getUsers">
              <el-option
                style="width:200px"
                label="全部"
                value="*">
              </el-option>
              <el-option
                style="width:200px"
                v-for="user in userList"
                :key="user.user_id"
                :label="user.user_name"
                :value="user.user_id">
              </el-option>
          </el-select>
          <!-- <el-input v-model="user_id" placeholder="请输入关键字" style="width:150px"></el-input> -->
        </div>
      </el-col>
      <!-- <el-col :span="3">
        <div>
          用户名
          <el-input v-model="user_name" placeholder="请输入内容" style="width:150px"></el-input>
        </div>
      </el-col>
      <el-col :span="3">
        <div>
          角色类型
          <el-select v-model="role_value" placeholder="请选择" style="width:150px">
            <el-option v-for="role in roles" :key="role.label" :value="role.name">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="3">
        <div>
          用户组
          <el-select v-model="group_value" placeholder="请选择" style="width:150px">
            <el-option v-for="group in groups" :key="group.label" :value="group.name">
            </el-option>
          </el-select>
        </div>
      </el-col> -->
      <!-- <el-col :span="2">
        <div class="space_content bg_dark"></div>
      </el-col> -->
      <el-col :span="2">
        <div>
          <el-button type="primary" icon="el-icon-search" v-on:click="queryUserInfo">查 询</el-button>
        </div>
      </el-col>
    </el-row>
  <baseline></baseline>

    <el-row>
      <el-col :span="4">
        <div class="edit_btn">
          <div>
            <el-button type="success" @click="handleAddUser" icon="el-icon-circle-plus-outline">新增用户</el-button>
          </div>
          <!-- <div>
            <el-button type="danger" @click="handleDeleteMulti" icon="el-icon-delete">删除用户</el-button>
          </div> -->
        </div>
      </el-col>
      <el-col>
        <div class="space_content bg_dark"></div>
      </el-col>
    </el-row>


      <el-table border row-class-name="base-eltable-bgc" style="width:100%; height:100%"
        :data="userInfoData"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item.id"
          :property="item.id"
          :label="item.label"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <!-- 注意！！！ slot-scope 是必须存在的 -->
          <template slot-scope="scope">
            <el-button type="info" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit-outline" size="small">修 改</el-button>
            <el-button :type="scope.row.frozenflag == 1 ? 'primary' : 'danger'" @click="handleFrozeActive(scope.$index, scope.row)" :icon="scope.row.frozenflag == 1 ? 'el-icon-error' : 'el-icon-success'" size="small">{{scope.row.frozenflag == 1 ? '冻结' : '激活'}}</el-button>
          </template>
        </el-table-column>
      </el-table>

    <el-dialog title="新增用户" :visible.sync="addUserVisible" class="base-dialog">
      <el-form :model="newUser" ref="newUser" :rules="rules.add">
        <el-form-item label="登录名" :label-width="formLabelWidth" prop="user_id">
          <el-input v-model="newUser.user_id" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="user_name">
          <el-input v-model="newUser.user_name" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model="newUser.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="checkpassword">
          <el-input type="password" v-model="newUser.checkpassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth" prop="user_tel">
          <el-input v-model="newUser.user_tel" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="其他联系方式" :label-width="formLabelWidth" prop="other">
          <el-input v-model="newUser.other" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="user_mail">
          <el-input v-model="newUser.user_mail" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
          <el-select
           placeholder="请选择角色"
           v-model="newUser.role">
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.name"
              :value="role.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运维单位" :label-width="formLabelWidth" prop="operation_id">
         <el-select
            placeholder="请选择运维单位"
            v-model="newUser.operation_id">
           <el-option
             v-for="item in operationList"
             :key="item.operation_id"
             :label="item.operation_name"
             :value="item.operation_id">
           </el-option>
         </el-select>
       </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="checkAdd">添 加</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改用户信息" :visible.sync="editUserVisible" class="base-dialog">
      <el-form :model="editUser" ref="editUser" :rules="rules.edit">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="user_name">
          <el-input v-model="editUser.user_name" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth" prop="user_tel">
          <el-input v-model="editUser.user_tel" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="其他联系方式" :label-width="formLabelWidth" prop="other">
          <el-input v-model="editUser.other" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="user_mail">
          <el-input v-model="editUser.user_mail" auto-complete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select
            v-model="editSelectedRole">
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.name"
              :value="role.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运维单位" :label-width="formLabelWidth" prop="operation_id">
         <el-select v-model="editSelectedOperation">
           <el-option
             v-for="item in operationList"
             :key="item.operation_id"
             :label="item.operation_name"
             :value="item.operation_id">
           </el-option>
         </el-select>
       </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="checkEdit">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import baseline from "../../base/baseline.vue";
export default {
    name: 'userinfo',
    components: {
      baseline
    },
    data(){
        return {
            title: '用户信息管理',
            urlUserInfo: 'environment/user/getUserByID', //用户信息
            urlUserList: 'environment/user/getLikeUserIDandName', //模糊查询
            urlUserInfoDB: 'environment/user/addUser',  //新增或修改用户信息
            urlUserDelete: 'environment/user/deleteUser',   //删除用户
            urlRoleList: 'environment/role/queryRole',  //请求角色列表
            urlUserFroze: 'environment/user/frozenOrActiveUser',  //冻结/激活用户
            urlOperationOption: 'environment/operation/getalloperation', //获取运维单位选项
            addUserVisible: false,
            editUserVisible: false,
            selectedUserId: '*',
            formLabelWidth: '100px',
            frozeUserId: '',
            activeUserId: '',
            columns: [
              {
                id: 'user_id',
                label: '登录名'
              },
              {
                id: 'user_name',
                label: '用户名'
              },
              {
                id: 'user_tel',
                label: '联系方式'
              },
              {
                id: 'user_mail',
                label: '邮箱'
              },
              {
                id: 'role_name',
                label: '角色'
              },
              {
                id: 'operation_id',
                label: '运维单位'
              },
              {
                id: 'other',
                label: '其他联系方式'
              }
            ],
            userList: [],
            userInfoData:[],
            editSelectedRole: '',
            editSelectedOperation: '',
            newUser:{
              type: 'add',
              user_id: '',
              user_name: '',
              password: '',
              checkpassword: '',
              user_tel: '',
              user_mail: '',
              role: '',
              role_name: '',
              other:'',
              operation_id: '',
              frozenflag: '1'
            },
            frozeIndex: '',
            editUser:{
              type: 'edit',
              user_id: '',
              user_name: '',
              user_tel: '',
              user_mail: '',
              role: '',
              role_name: '',
              other:'',
              operation_id: ''
            },
            roleList: [],
            operationList: [],
            rules: {
              add:{
                user_id:[
                  { required: true, message: "请输入登录名", trigger: "blur" }
                ],
                user_name:[
                  { required: true, message: "请输入用户名", trigger: "blur" }
                ],
                user_tel:[
                  { required: true, message: "请输入11位手机号", trigger: "blur" },
                  {
                    pattern: /^1[34578]\d{9}$/,
                    message: "输入不合法",
                    trigger: "blur"
                  }
                ],
                other:[
                  {
                    pattern: /^1[34578]\d{9}$/,
                    message: "输入不合法",
                    trigger: "blur"
                  }
                ],
                password:[
                  { required: true, message: "请输入密码", trigger: "blur" }
                ],
                checkpassword:[
                  { required: true, message: "请确认密码", trigger: "blur" }
                ],
                user_mail:[
                  { required: true, message: "请输入合法邮箱", trigger: "blur" },
                  {
                    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                    message: "输入不合法",
                    trigger: "blur"
                  }
                ],
                role: [
                  { required: true, message: "请选择角色", trigger: "change" }
                ]
              },
              edit:{
                user_name:[
                  { required: false, message: "请输入用户名", trigger: "blur" }
                ],
                user_tel:[
                  {
                    pattern: /^1[34578]\d{9}$/,
                    message: "输入不合法",
                    trigger: "blur"
                  }
                ],
                other:[
                  {
                    pattern: /^1[34578]\d{9}$/,
                    message: "输入不合法",
                    trigger: "blur"
                  }
                ],
                user_mail:[
                  {
                    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                    message: "输入不合法",
                    trigger: "blur"
                  }
                ]
              }
            }
        }
    },
    mounted() {
      this.queryUserInfo();
    },
    methods: {
     //------------------模糊搜索用户
     getUsers(key) {
       //-------对接代码
       this.$axios.post(this.urlUserList, {
           "key": key
       })
       .then((res) => {
           this.userList = res.data.userList;
       });
     },
     getRoles(){
       this.$axios.post(this.urlRoleList, {}).then((res) => {
         this.roleList = res.data.roleList;
       });
     },
     getOperations(){
       this.$axios.get(this.urlOperationOption).then(res=>{
           //处理企业代码数据
           let operationData = res.data;
           if(operationData.length == 0){
             this.$message.warning("获取运维单位信息为空");
             return;
           }
           this.operationList = operationData;
         })
         .catch(function(error){
           console.log("获取运维单位信息失败");
         });
     },
     changeRoleIdToName(role_id){
       var role_name = this.roleList.filter((item) => {
         if(item.id === role_id){
           return item.name;
         }
       });
       return role_name[0].name;
     },
     //-----------------查询所选用户信息
     queryUserInfo(){
       //-------对接代码
       this.$axios.post(this.urlUserInfo, {
         "selectedUserId": this.selectedUserId
       })
       .then(res => {
         this.userInfoData = res.data.userInfoData;
       });
     },
     handleAddUser(){
       this.addUserVisible = true;
       this.getRoles();
       this.getOperations();
     },
     checkAdd(){
       this.$confirm('确认添加？', '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消'
       }).then(() => {
         this.$refs["newUser"].validate((valid) => {
          if (valid) {
            this.saveNewUser();
          } else {
            this.$alert('信息填写不完整或不合法！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
            });
            return false;
          }
        });
       });
     },
     //--------------------新增用户
     saveNewUser(){
       if(this.newUser.password != this.newUser.checkpassword){
         this.$alert('两次输入密码不同，请确认密码！', '提示', {
             confirmButtonText: '确定',
             type: 'warning'
         });
         return;
       }
       else{
        //-------对接代码
        this.$axios.post(this.urlUserInfoDB, this.newUser).then((res) => {
            if(res.data.addFlag){
              this.$alert('添加成功！', '提示', {
                  confirmButtonText: '确定'
              });
              if(this.selectedUserId === "*"){
                this.queryUserInfo();
              }
              // this.newUser.role_name = this.changeRoleIdToName(this.newUser.role);
              // this.userInfoData.push({
              //                          user_id: this.newUser.user_id,
              //                          user_name: this.newUser.user_name,
              //                          user_tel: this.newUser.user_tel,
              //                          user_mail: this.newUser.user_mail,
              //                          password: this.newUser.password,
              //                          other: this.newUser.other,
              //                          role_name: this.newUser.role_name
              //                      });
            }
            else{
              this.$alert('登录名已存在或不合法，添加失败！', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
              });
            }
            //复位
            this.newUser.user_id = '';
            this.newUser.user_name = '';
            this.newUser.user_tel = '';
            this.newUser.user_mail = '',
            this.newUser.password = '';
            this.newUser.checkpassword = '';
            this.newUser.other = '';
            this.newUser.role = '';
            this.newUser.role_name = '';
            this.newUser.operation_id = '';
        });
        this.addUserVisible = false;
       }

     },
     handleEdit(index, row) {
				this.editUserVisible = true;
        this.getRoles();
        this.getOperations();
				this.editUser = Object.assign({}, row);
        this.editUser.frozenflag += '';
        this.editSelectedRole = this.editUser.role_id + '';
        this.editSelectedOperation = this.editUser.operation_id + '';
        //this.editUser.checkpassword = this.editUser.password;
        this.editUser.type = 'edit';
		 },
     checkEdit(){
       this.$confirm('确认修改？', '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消'
       }).then(() => {
         this.$refs["editUser"].validate((valid) => {
          if (valid) {
            this.editUser.role = this.editSelectedRole;
            this.saveEdit();
          } else {
            this.$alert('信息填写不完整或不合法！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
            });
            return false;
          }
        });
       });
     },
     //--------------修改用户信息
     saveEdit(){
       this.$axios.post(this.urlUserInfoDB, this.editUser).then((res) => {
         if(res.data.editFlag){
           this.$alert('修改成功！', '提示', {
               confirmButtonText: '确定'
           });
           this.queryUserInfo();
         }
         else{
           this.$alert('修改失败！', '提示', {
               confirmButtonText: '确定',
               type: 'warning'
           });
         }
         this.editUserVisible = false;
       });
     },
     handleFrozeActive(index, row){
        this.frozeIndex = index;
        if(row.frozenflag){
          this.$confirm('确认冻结？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
          }).then(() => {
            this.frozeUserId = row.user_id;
            this.frozeUser();
          });
        }
        else{
          this.$confirm('确认激活？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
          }).then(() => {
            this.activeUserId = row.user_id;
            this.activeUser();
          });
        }
     },
     //-------------冻结一个用户
     frozeUser(){
       //--------对接代码
       this.$axios.post(this.urlUserFroze, {
         user_id: this.frozeUserId,
         froze: true
       }).then((res) => {
         if(res.data.frozeFlag){
           this.$alert('冻结成功！', '提示', {
               confirmButtonText: '确定'
           });
           // this.userInfoData[this.frozeIndex].froze = true;
           this.queryUserInfo();
         }
         else{
           this.$alert('冻结失败！', '提示', {
               confirmButtonText: '确定',
               type: 'warning'
           });
         }
       });
     },
     //-------------激活一个用户
     activeUser(){
       //--------对接代码
       this.$axios.post(this.urlUserFroze, {
         user_id: this.activeUserId,
         froze: false
       }).then((res) => {
         if(res.data.activeFlag){
           this.$alert('激活成功！', '提示', {
               confirmButtonText: '确定'
           });
           // this.userInfoData[this.activeIndex].froze = false;
           this.queryUserInfo();
         }
         else{
           this.$alert('激活失败！', '提示', {
               confirmButtonText: '确定',
               type: 'warning'
           });
         }
       });
     },
     //------------表格选择发生变化
     handleSelectionChange(val) {
        this.frozeUserId = val;
        var temp = [];
        this.frozeUserId.map((item, index)=> {
            temp.push(item.user_id);
        });
        this.frozeUserId = temp;
     }
   }
}
</script>

<style scoped>
.edit_row{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.query_box{
  display: flex;
  justify-content: space-between;
}
.edit_btn{
  display: flex;
  justify-content:flex-start;
}
.page_btn{
  display: flex;
  justify-content: center;
}
.space_content{
  border-radius: 4px;
  min-height: 5px;
}
.bg_dark{
  background: #1F1D1D;
}
.table-expand{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 50%;
}
.el-table__expanded-cell{
  background: #e4e976;
}
.el-table__expanded-cell:hover{
  background: #e4e976;
}
.table-expand .el-form-item{
  display: flex;
  justify-content: flex-start;
  height: 15%;
  width: 50%;
  margin: 0 0;
  padding: 5px 0;
}
.table-expand .el-form-item__label{
  color: #1b60e9;
  font-weight: bold;
  font-size: 20px;
  width: 30%;
}
.table-expand span{
  color: #000000;
  font-size: 20px;
}
.el-form-item .el-input{
  width: 280px;
}
.el-main{
  padding-left: 0;
  padding-right: 0;
}
</style>
