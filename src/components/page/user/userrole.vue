<template>
  <div class="base-content base-bg-color">
      <el-row>
        <el-col :span="3">
            <div>
              <el-select v-model="selectedRoleId" placeholder="请选择角色">
                <!-- <el-option label="全部" value="*">
                </el-option> -->
                <el-option label="全部" value="*">
                </el-option>
                <el-option v-for="role in roleList" :key="role.id" :value="role.id" :label="role.name">
                </el-option>
              </el-select>
            </div>
        </el-col>
        <el-col :span="2">
            <div>
              <el-button type="primary" icon="el-icon-search" @click="queryRoleInfo">查 询</el-button>
            </div>
        </el-col>
      </el-row>
      <baseline></baseline>
      <el-row>
        <el-col :span="4">
          <div class="edit_btn">
            <div>
              <el-button type="success" @click="addRoleVisible = true" icon="el-icon-circle-plus-outline">新增角色</el-button>
            </div>
            <div>
              <el-button type="danger" @click="handleDeleteN" icon="el-icon-delete">删除角色</el-button>
            </div>
          </div>
        </el-col>
        <el-col>
          <div class="space_content bg_dark"></div>
        </el-col>
      </el-row>
        <el-table border row-class-name="base-eltable-bgc" style="width:100%; height:100%"
          :data="roles"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            prop="id"
            label="角色编号"
            width="200px"
            align="center"
            v-if="show">
          </el-table-column>
          <el-table-column
            prop="name"
            label="角色名称"
            width="300px"
            align="center">
          </el-table-column>
          <el-table-column
            prop="describe"
            label="权限描述"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            width="400px"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleAuthorize(scope.$index, scope.row)" icon="el-icon-edit-outline" size="small">授 权</el-button>
              <el-button type="info" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit-outline" size="small">修 改</el-button>
              <el-button type="danger" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" size="small">删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
    <el-dialog title="新增角色" :visible.sync="addRoleVisible" class="base-dialog">
      <el-form :model="newRole" ref="newRole" :rules="rules">
        <!-- <el-form-item label="角色编号" :label-width="formLabelWidth">
          <el-input v-model="newRole.id" auto-complete="off" style="width:190px" clearable></el-input>
        </el-form-item> -->
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="newRole.name" auto-complete="off" style="width:190px" clearable></el-input>
        </el-form-item>
        <el-form-item label="权限描述" :label-width="formLabelWidth" prop="describe">
          <el-input v-model="newRole.describe" auto-complete="off" style="width:250px" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="handleAddRole">添 加</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改角色信息" :visible.sync="editRoleVisible" class="base-dialog">
      <el-form :model="editRole" ref="editRole" :rules="rules">
        <!-- <el-form-item label="角色编号" :label-width="formLabelWidth">
          <el-input v-model="editRole.id" auto-complete="off" style="width:190px" clearable></el-input>
        </el-form-item> -->
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="editRole.name" auto-complete="off" style="width:190px" clearable></el-input>
        </el-form-item>
        <el-form-item label="权限描述" :label-width="formLabelWidth" prop="describe">
          <el-input v-model="editRole.describe" auto-complete="off" style="width:250px" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="handleEditRole">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="授 权" :visible.sync="authorizeVisible" class="base-dialog" :fullscreen=true>
      <template>
        <div>
          <span class="span">基本权限</span>
          <el-checkbox  :indeterminate="isIndeterminate_basic" v-model="checkAll_basic" disabled>全选</el-checkbox>
          <el-checkbox-group v-model="permissionList_basic">
              <el-checkbox v-for="p in permissions.basic" :key="p.url" :label="p.url" v-model="p.checked" border size="medium" class="permission_checkbox" disabled>{{p.name}}</el-checkbox>
          </el-checkbox-group>
          <span class="span">比较统计</span>
          <el-checkbox  :indeterminate="isIndeterminate_compare" v-model="checkAll_compare" @change="handleCheckAllChange_compare">全选</el-checkbox>
          <el-checkbox-group v-model="permissionList_compare" @change="handleCheckedChange_compare">
              <el-checkbox v-for="p in permissions.compare" :key="p.url" :label="p.url" v-model="p.checked" border size="medium" class="permission_checkbox">{{p.name}}</el-checkbox>
          </el-checkbox-group>
          <span class="span">数据表格</span>
          <el-checkbox  :indeterminate="isIndeterminate_table" v-model="checkAll_table" @change="handleCheckAllChange_table">全选</el-checkbox>
          <el-checkbox-group v-model="permissionList_table" @change="handleCheckedChange_table">
              <el-checkbox v-for="p in permissions.table" :key="p.url" :label="p.url" v-model="p.checked" border size="medium" class="permission_checkbox">{{p.name}}</el-checkbox>
          </el-checkbox-group>
          <span class="span">流动站点</span>
          <el-checkbox-group v-model="permissionList_trackmap">
              <el-checkbox v-for="p in permissions.trackmap" :key="p.url" :label="p.url" v-model="p.checked" border size="medium" class="permission_checkbox">{{p.name}}</el-checkbox>
          </el-checkbox-group>
          <span class="span">用户管理</span>
          <el-checkbox  :indeterminate="isIndeterminate_user" v-model="checkAll_user" @change="handleCheckAllChange_user">全选</el-checkbox>
          <el-checkbox-group v-model="permissionList_user" @change="handleCheckedChange_user">
              <el-checkbox v-for="p in permissions.user" :key="p.url" :label="p.url" v-model="p.checked" border size="medium" class="permission_checkbox">{{p.name}}</el-checkbox>
          </el-checkbox-group>
          <span class="span">报表管理</span>
          <el-checkbox  :indeterminate="isIndeterminate_report" v-model="checkAll_report" @change="handleCheckAllChange_report">全选</el-checkbox>
          <el-checkbox-group v-model="permissionList_report" @change="handleCheckedChange_report">
              <el-checkbox v-for="p in permissions.report" :key="p.url" :label="p.url" v-model="p.checked" border size="medium" class="permission_checkbox">{{p.name}}</el-checkbox>
          </el-checkbox-group>
          <span class="span">系统管理</span>
          <el-checkbox  :indeterminate="isIndeterminate_system" v-model="checkAll_system" @change="handleCheckAllChange_system">全选</el-checkbox>
          <el-checkbox-group v-model="permissionList_system" @change="handleCheckedChange_system">
              <el-checkbox v-for="p in permissions.system" :key="p.url" :label="p.url" v-model="p.checked" border size="medium" class="permission_checkbox">{{p.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </template>
      <div slot="footer" class="dialog-footer-authorize">
        <div>
          <el-button size="medium" @click="authorizeVisible = false">取 消</el-button>
          <el-button type="primary" size="medium" @click="handleSaveAuthorize">保 存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import permissions from "./permissions.js";
import menu from "./menu2.js";
import baseline from "../../base/baseline.vue";
export default {
    name: 'inco',
    components: {
      baseline
    },
    created(){
        this.permissions = permissions;
        this.menuList2 = menu.menu;
        this.getRoles();  //请求角色列表
        this.queryRoleInfo(); //初次进入请求全部角色信息
    },
    data(){
        return {
            title: '角色信息管理',
            urlAuthorize: 'environment/role/updateMenulistAndPermissionList',   //角色授权URL
            urlRole: 'environment/role/addRole',               //新增/修改角色信息URL
            urlRoleDelete: 'environment/role/deleteRole',         //删除角色URL
            urlRoleList: 'environment/role/queryRole',           //请求角色列表URL
            urlRoleInfo: 'environment/role/queryRoleByRoleID',           //查询角色信息URL
            addRoleVisible: false,
            editRoleVisible: false,
            authorizeVisible: false,
            multipleSelection: [],
            formLabelWidth: '100px',
            count: '',
            deleteIndex: '',
            roleList: [],
            permissions:[],
            newRole:{
              type: 'add',
              name: '',
              describe: ''
            },
            editRole:{
              type: 'edit',
              id: '',
              name: '',
              describe: ''
            },
            selectedRoleId: '*',
            editId : '',
            editIndex: '',
            //请求到的角色信息
            roles:[],
            isIndeterminate_basic: false,
            isIndeterminate_compare: true,
            isIndeterminate_table: true,
            isIndeterminate_user: true,
            isIndeterminate_report: true,
            isIndeterminate_system: true,
            checkAll_basic: true,
            checkAll_compare: false,
            checkAll_table: false,
            checkAll_user: false,
            checkAll_report: false,
            checkAll_system: false,
            permissionList_basic: ["/login","/403","/404","/index","/info"],
            permissionList_compare: [],
            permissionList_compare_all: ["/compare1","/compare2","/compare3"],
            permissionList_table: [],
            permissionList_table_all: ["/realtime","/singlepage","/warning","/comprehensive"],
            permissionList_trackmap: [],
            permissionList_trackmap_all: ["/trackmap"],
            permissionList_user: [],
            permissionList_user_all: ["/userinfo","/userrole"],
            permissionList_report: [],
            permissionList_report_all: ["/report1","/report2","/report3","/report4","/report5","/report6","/report7","/report8","/report9"],
            permissionList_system: [],
            permissionList_system_all: ["/noise","/noisecar"],
            permissionList: [],   //管理员指定的权限列表
            menuList2: [],         //菜单 List
            deleteRoleList: [],   //删除的角色列表
            rules:{
                name:[
                  { required: true, message: "请输入角色名", trigger: "blur" }
                ],
                describe:[
                  { required: true, message: "请输入权限描述", trigger: "blur" }
                ]
            }
        }
    },
    methods: {
      extractUrl(array){
        let temp = [];
        for(let i=0;i<array.length;i++){
          temp.push(array[i].url);
        }
        return temp;
      },
      handleCheckAllChange_compare(val){
        this.permissionList_compare = val ? this.extractUrl(this.permissions.compare) : [];
        this.isIndeterminate_compare = false;
      },
      handleCheckedChange_compare(value) {
        let checkedCount = value.length;
        this.checkAll_compare = checkedCount === this.permissions.compare.length;
        this.isIndeterminate_compare = checkedCount > 0 && checkedCount < this.permissions.compare.length;
      },
      handleCheckAllChange_table(val){
        this.permissionList_table = val ? this.extractUrl(this.permissions.table) : [];
        this.isIndeterminate_table = false;
      },
      handleCheckedChange_table(value) {
        let checkedCount = value.length;
        this.checkAll_table = checkedCount === this.permissions.table.length;
        this.isIndeterminate_table = checkedCount > 0 && checkedCount < this.permissions.table.length;
      },
      handleCheckAllChange_user(val){
        this.permissionList_user = val ? this.extractUrl(this.permissions.user) : [];
        this.isIndeterminate_user = false;
      },
      handleCheckedChange_user(value) {
        let checkedCount = value.length;
        this.checkAll_user = checkedCount === this.permissions.user.length;
        this.isIndeterminate_user = checkedCount > 0 && checkedCount < this.permissions.user.length;
      },
      handleCheckAllChange_report(val){
        this.permissionList_report = val ? this.extractUrl(this.permissions.report) : [];
        this.isIndeterminate_report = false;
      },
      handleCheckedChange_report(value) {
        let checkedCount = value.length;
        this.checkAll_report = checkedCount === this.permissions.report.length;
        this.isIndeterminate_report = checkedCount > 0 && checkedCount < this.permissions.report.length;
      },
      handleCheckAllChange_system(val){
        this.permissionList_system = val ? this.extractUrl(this.permissions.system) : [];
        this.isIndeterminate_system = false;
      },
      handleCheckedChange_system(value) {
        let checkedCount = value.length;
        this.checkAll_system = checkedCount === this.permissions.system.length;
        this.isIndeterminate_system = checkedCount > 0 && checkedCount < this.permissions.system.length;
      },
      //去掉字符串首尾空格
      trim(str){
        return str.replace(/(^\s*)|(\s*$)/g,"");
      },
      //获取角色列表
      getRoles(){
        this.$axios.post(this.urlRoleList, {}).then((res) => {
          this.roleList = res.data.roleList;
        });
      },
      //查询某个角色信息
      queryRoleInfo(){
        //-----------------对接代码
        this.$axios.post(this.urlRoleInfo, {
          selectedRoleId: this.selectedRoleId
        }).then((res) => {
          this.roles = res.data.roleList;
        });
      },
      handleAddRole(){
        this.$confirm('确认添加？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(() => {
          this.$refs["newRole"].validate((valid) => {
           if (valid) {
             this.saveNewRole();
           } else {
             this.$alert('信息填写不完整！', '提示', {
                 confirmButtonText: '确定',
                 type: 'warning'
             });
             return false;
           }
         });
        });
      },
      //新增角色
      saveNewRole(){
        //-----------对接代码
        this.$axios.post(this.urlRole, this.newRole).then((res) => {
          if(res.data.addRoleFlag){
            this.$alert('添加成功！', '提示', {
                confirmButtonText: '确定'
            });
            if(this.selectedRoleId === "*"){
              this.queryRoleInfo();
            }
          }
          else{
            this.$alert('角色名已存在或不合法，添加失败！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
            });
          }
            this.newRole.name = '';
            this.newRole.describe = '';
            this.getRoles();
            this.addRoleVisible = false;
        });
      },
      handleEdit(index, row){
 				this.editRole = Object.assign({}, row);
        this.editIndex = index;
        this.editRoleVisible = true;
 		  },
      handleEditRole(){
        this.$confirm('确认修改？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(() => {
          this.$refs["editRole"].validate((valid) => {
           if (valid) {
             this.saveEdit();
           } else {
             this.$alert('信息填写不完整！', '提示', {
                 confirmButtonText: '确定',
                 type: 'warning'
             });
             return false;
           }
         });
        });
      },
      //修改角色名称
      saveEdit(){
        //------------------对接代码
        this.$axios.post(this.urlRole, {
           type: 'edit',
           id: this.editRole.id,
           describe: this.editRole.describe,
           name: this.editRole.name
        }).then((res) => {
          if(res.data.editRoleFlag){
            this.$alert('修改成功！', '提示', {
                confirmButtonText: '确定'
            });
            this.queryRoleInfo();
          }
          else{
            this.$alert('修改失败！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
            });
          }
          this.editRoleVisible = false;
          this.getRoles();
        });
      },
      handleAuthorize(index, row){
        this.editRole = Object.assign({}, row);
        this.permissionList_compare = [];
        this.permissionList_table = [];
        this.permissionList_trackmap = [];
        this.permissionList_user = [];
        this.permissionList_report = [];
        this.permissionList_system = [];
        for(var k=0;k<this.editRole.permissions.length;k++){
          var temp = this.trim(this.editRole.permissions[k]);
          if(this.permissionList_basic.indexOf(temp) != -1){
            continue;
          }
          else if(this.permissionList_compare_all.indexOf(temp) != -1){
            this.permissionList_compare.push(temp);
          }
          else if(this.permissionList_table_all.indexOf(temp) != -1){
            this.permissionList_table.push(temp);
          }
          else if(this.permissionList_trackmap_all.indexOf(temp) != -1){
            this.permissionList_trackmap.push(temp);
          }
          else if(this.permissionList_user_all.indexOf(temp) != -1){
            this.permissionList_user.push(temp);
          }
          else if(this.permissionList_report_all.indexOf(temp) != -1){
            this.permissionList_report.push(temp);
          }
          else{
            this.permissionList_system.push(temp);
          }
        }
        //手动初始化为 false
        for(var i=0;i<this.menuList2.length;i++){
          this.menuList2[i].checked = false;
        }
        this.authorizeVisible = true;
      },
      handleSaveAuthorize(){
        this.$confirm('确认授权？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(() => {
          this.handlePermission();
        });
      },
      //处理 permissionList和 menuList
      handlePermission(){
        this.permissionList = this.permissionList_basic.concat(this.permissionList_compare).concat(this.permissionList_table).concat(this.permissionList_trackmap).concat(this.permissionList_user).concat(this.permissionList_report).concat(this.permissionList_system);
        for(var i=0;i<this.permissionList.length;i++){
          for(var j=0;j<this.menuList2.length;j++){
            if(this.menuList2[j].url === this.permissionList[i]){
              this.menuList2[j].checked = true;
              break;
            }
          }
        }
        this.saveNewPermissions();
      },
      //授权
      saveNewPermissions(){
        //---------------对接代码
        this.$axios.post(this.urlAuthorize, {
           "role_id": this.editRole.id,
           "role_permissions": this.permissionList,
           "menu_list": this.menuList2
        }).then((res) => {
          if(res.data.authorizeFlag){
            this.$alert('授权成功！', '提示', {
                confirmButtonText: '确定'
            });
            this.queryRoleInfo();
            this.permissionList = [];
            this.authorizeVisible = false;
          }
        });
      },
      handleDelete(index, row){
        this.deleteIndex = index;
        this.$confirm('确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(() => {
          this.deleteRoleList.push(row.id);
          this.deleteSingle();
        });
      },
      //删除某个角色
      deleteSingle(){
        //--------------对接代码
        this.$axios.post(this.urlRoleDelete, {
          deleteRoleList: this.deleteRoleList
        }).then((res) => {
          if(res.data.deleteFlag){
            this.roles.splice(this.deleteIndex, 1);
            this.getRoles();
          }
          else{
            this.$alert('删除失败！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
            });
          }
        });
        this.deleteRoleList = [];
      },
      handleDeleteN(){
        this.$confirm('确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(() => {
          this.deleteRoles();
        });
      },
      //删除多个角色
      deleteRoles(){
        //------------对接代码
        this.$axios.post(this.urlRoleDelete, {
          deleteRoleList: this.deleteRoleList
        }).then((res) => {
          if(res.data.deleteFlag){
            var deleteRoleList = this.deleteRoleList;
            for(var i=0; i<deleteRoleList.length; i++){
              var role_id = deleteRoleList[i];
              for(var j=0; j<this.roles.length; j++){
                if(role_id == this.roles[j].id){
                  this.roles.splice(j, 1);
                }
              }
            }
            this.getRoles();
          }
          else{
            this.$alert('删除失败！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
            });
          }
        });
        this.deleteRoleList = [];
      },
      //选中的角色id列表
      handleSelectionChange(val) {
         this.deleteRoleList = val;
         var temp = [];
         this.deleteRoleList.map((item, index)=> {
             temp.push(item.id);
         });
         this.deleteRoleList = temp;
      }
    }
}
</script>

<style scoped>
.query_item{
  display: flex;
  justify-content: flex-start;
  margin-left: 10px;
}
.edit_btn{
  display: flex;
  justify-content:flex-start;
}
.el-table .highlight-row{
  background: #ededed;
}
.table-expand{
  font-size: 10px;
}
.table-expand label{
  width: 90px;
  color: #99a9bf;
}
.table-expand-role{
  margin-right: 0;
  margin-bottom: 0;
  width: 20%;
}
.table-expand-permission{
  margin-top: 0;
  margin-left: 0;
  width: 100%;
}
.permission_checkbox{
  margin-left: 10px;
  margin-top: 15px;
  width: 170px;
  color: #000000;
}
.dialog-footer-authorize{
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.space_content{
  border-radius: 4px;
  min-height: 5px;
}
.bg_dark{
  background: #1F1D1D;
}
.el-main{
  padding-left: 0;
  padding-right: 0;
}
.span{
  display: inline-block;
  margin: 20px 20px 0 10px;
  font-size: 18px;
  font-weight: bold;
}
</style>
