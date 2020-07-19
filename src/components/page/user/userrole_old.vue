<template>
    <div class="base-content base-bg-color">
      <el-header>
      <el-row class="query_row">
        <el-col :span="3">
            <div>
              <el-select v-model="role_value" placeholder="请选择角色">
                <el-option v-for="role in roles" :key="role.id" :value="role.name">
                </el-option>
              </el-select>
            </div>
        </el-col>
        <el-col :span="2">
            <div>
              <el-button type="primary" icon="el-icon-search">查 询</el-button>
            </div>
        </el-col>
      </el-row>
    </el-header>
    <baseline></baseline>
    <el-header>
      <el-row class="edit_row">
        <el-col :span="4">
          <div class="edit_btn">
            <div>
              <el-button type="success" @click="handle_Add_Role" icon="el-icon-circle-plus-outline">新增角色</el-button>
            </div>
            <div>
              <el-button type="danger" @click="checkDeleteVisible_n = true" icon="el-icon-delete">删除角色</el-button>
            </div>
          </div>
        </el-col>
        <el-col>
          <div class="space_content bg_dark"></div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
        <el-table border row-class-name="base-eltable-bgc" style="width:100%; height:100%"
          :data="roles"
          @selection-change="handle_Selection_Change">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="角色编号" class="table-expand-role">
                  <span style="color:#000000">{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="角色名称" class="table-expand-role">
                  <span style="color:#000000">{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="权限" class="table-expand-permission">
                  <span style="color:#000000">{{ props.row.permissions }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            prop="id"
            label="角色编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="角色名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="permissions"
            label="权限"
            align="center"
            show-overflow-tooltip=true>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="handle_Authorize(scope.$index, scope.row)" icon="el-icon-edit-outline" size="small">授 权</el-button>
              <el-button type="info" @click="handle_Edit(scope.$index, scope.row)" icon="el-icon-edit-outline" size="small">修 改</el-button>
              <el-button type="danger" @click="handle_Delete(scope.$index, scope.row)" icon="el-icon-delete" size="small">删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-main>
    <el-dialog title="新增角色" :visible.sync="addRoleVisible" class="base-dialog">
      <el-form :model="new_role">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="new_role.name" auto-complete="off" style="width:190px" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="checkAddVisible = true">添 加</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改角色信息" :visible.sync="editRoleVisible" class="base-dialog">
      <el-form :model="edit_role" ref="edit_role">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="edit_role.name" auto-complete="off" style="width:190px" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="checkEditVisible = true">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="授 权" :visible.sync="authorizeVisible" class="base-dialog">
      <template>
        <div>
          <el-checkbox-group v-model="permissonList">
            <el-checkbox v-for="p in permissions" :key="p.url" :label="p.name" :value="p.url" border size="medium" class="permission_checkbox"></el-checkbox>
          </el-checkbox-group>
        </div>
      </template>
      <div slot="footer" class="dialog-footer-authorize">
        <div>
          <el-button size="medium" @click="clear_Permissions">清 空</el-button>
          <el-button size="medium" @click="select_All_Permissions">全 选</el-button>
        </div>
        <div>
          <el-button size="medium" @click="authorizeVisible = false">取 消</el-button>
          <el-button type="primary" size="medium" @click="checkAuthorizeVisible = true">保 存</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="确认添加？" :visible.sync="checkAddVisible" style="margin-top:100px" class="base-dialog">
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="checkAddVisible = false">否</el-button>
        <el-button type="primary" size="medium" @click="save_New_Role">是</el-button>
      </div>
    </el-dialog>

    <el-dialog title="确认删除？" :visible.sync="checkDeleteVisible_n" style="margin-top:100px" class="base-dialog">
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="checkDeleteVisible_n = false">否</el-button>
        <el-button type="primary" size="medium" @click="delete_Roles">是</el-button>
      </div>
    </el-dialog>

    <el-dialog title="确认删除？" :visible.sync="checkDeleteVisible_1" style="margin-top:100px" class="base-dialog">
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="checkDeleteVisible_1 = false">否</el-button>
        <el-button type="primary" size="medium" @click="delete_Single">是</el-button>
      </div>
    </el-dialog>

    <el-dialog title="确认修改？" :visible.sync="checkEditVisible" style="margin-top:100px" class="base-dialog">
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="checkEditVisible = false">否</el-button>
        <el-button type="primary" size="medium" @click="save_Edit">是</el-button>
      </div>
    </el-dialog>

    <el-dialog title="确认授权？" :visible.sync="checkAuthorizeVisible" style="margin-top:100px" class="base-dialog">
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="checkAuthorizeVisible = false">否</el-button>
        <el-button type="primary" size="medium" @click="save_New_Permissions">是</el-button>
      </div>
    </el-dialog>
    </div>
</template>

<script>
import baseline from "../../base/baseline.vue";
import permissions from "./permissions.js";
export default {
    name: 'userrole',
    components: {
      baseline
    },
    created(){
      this.permissions = permissions;

    },
    data(){
        return {
            title: '角色信息管理',
            role_value: '',
            addRoleVisible: false,
            editRoleVisible: false,
            authorizeVisible: false,
            checkAddVisible: false,
            checkDeleteVisible_n: false,
            checkDeleteVisible_1: false,
            checkEditVisible: false,
            checkAuthorizeVisible: false,
            multipleSelection: [],
            selectedPermissions: [],
            permissonList: [],
            formLabelWidth: '100px',
            count: '',
            index: '',
            permissions:[],
            roles: [
              {
                id: "1",
                name: "管理员1",
                permissions: this.permissions
              },
              {
                id: "2",
                name: "管理员2",
                permissions: this.permissions
              },
              {
                id: "3",
                name: "管理员3",
                permissions: this.permissions
              }
            ],
            new_role:{
              id: '',
              name: '',
            },
            edit_role:{
              index: '',
              id: '',
              name: '',
              permissions : []
            }
        }
    },
    methods: {
      handle_Add_Role(){
        this.new_role.id = this.count + 1;
        this.addRoleVisible = true;
      },
      save_New_Role(){
        this.checkAddVisible = false;
        if(this.new_role.name == ''){
          alert('填写不完整！');
          return;
        }
        this.roles.push({
          id: this.new_role.id,
          name: this.new_role.name,
          permissions: this.new_role.permissions
        });
        this.new_role.id = '';
        this.new_role.name = '';
        this.new_role.permissions = '';
        this.count = this.count + 1;
      },
      delete_Roles(){
        var role_ids = this.get_Selected_Ids();
        for(var i=0; i<role_ids.length; i++){
          var role_id = role_ids[i];
          for(var j=0; j<this.roles.length; j++){
            if(role_id == this.roles[j].id){
              this.roles.splice(j, 1);
            }
          }
        }
        this.checkDeleteVisible_n = false;
      },
      handle_Edit(index, row){
 				this.edit_role = Object.assign({}, row);
        this.edit_role.index = index;
        this.editRoleVisible = true;
 		  },
      save_Edit(){
        this.checkEditVisible = false;
        if(this.edit_role.name == ''){
          alert('填写不完整！');
          return;
        }
        var index = this.edit_role.index;
        this.roles.splice(index, 1);
        var updated_user_info = {id: this.edit_role.id,
                                 name: this.edit_role.name,
                                 permissions: this.edit_role.permissions};
        this.roles.splice(index, 0, updated_user_info);
        this.editRoleVisible = false;
      },
      handle_Authorize(index, row){
        this.authorizeVisible = true;
        this.edit_role = Object.assign({}, row);
        this.edit_role.index = index;
        // 权限字符串用 "、" 分隔开
        var old_permissions = this.edit_role.permissions.split('、');
        var k = 0;
        for(var i=0;i<old_permissions.length;i++){
          for(var j=k;j<this.permissions.length;j++){
            if(old_permissions[i] == this.permissions[j].name){
              this.permissions[j].checked = true;
              k = j + 1;
              continue;
            }
          }
        }
      },
      save_New_Permissions(){
        this.checkAuthorizeVisible = false;
        this.edit_role.permissions = '';
        var index = this.edit_role.index;
        this.roles.splice(index, 1);
        for(var i=0;i<this.permissions.length;i++){
          if(this.permissions[i].checked){
            this.selectedPermissions.push(this.permissions[i].name);
          }
        }
        for(var i=0;i<this.selectedPermissions.length;i++){
          if(i == this.selectedPermissions.length - 1){
            this.edit_role.permissions += this.selectedPermissions[i];
          }
          else{
            this.edit_role.permissions += this.selectedPermissions[i] + '、';
          }
        }
        var updated_role_info = {id: this.edit_role.id,
                                 name: this.edit_role.name,
                                 permissions: this.edit_role.permissions};
        this.roles.splice(index, 0, updated_role_info);
        this.clear_Permissions();
        this.selectedPermissions.splice(0, this.selectedPermissions.length);
        this.edit_role.permissions = '';
        this.authorizeVisible = false;
      },
      handle_Delete(index, row){
        this.index = index;
        this.checkDeleteVisible_1 = true;
      },
      delete_Single(){
        this.roles.splice(this.index, 1);
        this.checkDeleteVisible_1 = false;
      },
      handle_Selection_Change(val) {
         this.multipleSelection = val;
      },
      get_Selected_Ids(){
         let ids=[];
         this.multipleSelection.map((item)=> {
             ids.push(item.id)
         })
         return ids;
      },
      clear_Permissions(){
        for(var i=0;i<this.permissions.length;i++){
          this.permissions[i].checked = false;
        }
      },
      select_All_Permissions(){
        for(var i=0;i<this.permissions.length;i++){
          this.permissions[i].checked = true;
        }
      }
    },
    created() {
      //do something after creating vue instance
      this.count = this.roles.length;
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
  justify-content: space-between;
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
</style>
