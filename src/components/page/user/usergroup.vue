<template>
    <div class="base-content base-bg-color">
      <el-header>
      <el-row class="query_row">
        <el-col :span="3">
            <div>
              <el-select v-model="group_value" placeholder="请选择用户组">
                <el-option v-for="group in groups" :key="group.id" :value="group.name">
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
              <el-button type="success" @click="handle_Add_Group" icon="el-icon-circle-plus-outline">新增用户组</el-button>
            </div>
            <div>
              <el-button type="danger" @click="checkDeleteVisible_n = true" icon="el-icon-delete">删除用户组</el-button>
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
          :data="groups"
          @selection-change="handle_Selection_Change">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            prop="id"
            label="用户组编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="用户组名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="members"
            label="用户组成员"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="handle_Edit(scope.$index, scope.row)" icon="el-icon-edit-outline" size="small">修 改</el-button>
              <el-button type="danger" @click="handle_Delete(scope.$index, scope.row)" icon="el-icon-delete" size="small">删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-main>
    <el-dialog title="新增用户组" :visible.sync="addGroupVisible" class="base-dialog">
      <el-form :model="new_group">
        <el-form-item label="用户组名称" :label-width="formLabelWidth">
          <el-input v-model="new_group.name" auto-complete="off" style="width:190px" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户组成员" :label-width="formLabelWidth">
          <el-input v-model="new_group.members" auto-complete="off" style="width:190px" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="addGroupVisible = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="checkAddVisible = true">添 加</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改用户组信息" :visible.sync="editGroupVisible" class="base-dialog">
      <el-form :model="edit_group">
        <el-form-item label="用户组名称" :label-width="formLabelWidth">
          <el-input v-model="edit_group.name" auto-complete="off" style="width:190px" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户组成员" :label-width="formLabelWidth">
          <el-input v-model="edit_group.members" auto-complete="off" style="width:190px" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="editGroupVisible = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="checkEditVisible = true">添 加</el-button>
      </div>
    </el-dialog>

    <el-dialog title="确认添加？" :visible.sync="checkAddVisible" style="margin-top:100px" class="base-dialog">
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="checkAddVisible = false">否</el-button>
        <el-button type="primary" size="medium" @click="save_New_Group">是</el-button>
      </div>
    </el-dialog>

    <el-dialog title="确认删除？" :visible.sync="checkDeleteVisible_n" style="margin-top:100px" class="base-dialog">
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="checkDeleteVisible_n = false">否</el-button>
        <el-button type="primary" size="medium" @click="delete_Groups">是</el-button>
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
    </div>
</template>

<script>
import baseline from "../../base/baseline.vue";
export default {
    name: 'usergroup',
    components: {
      baseline
    },
    data(){
        return {
            title: '用户组管理',
            group_value: '',
            addGroupVisible: false,
            editGroupVisible: false,
            checkAddVisible: false,
            checkDeleteVisible_n: false,
            checkDeleteVisible_1: false,
            checkEditVisible: false,
            multipleSelection: [],
            count: '',
            index: '',
            groups:[
              {
                id: 1,
                name: 'A',
                members: 'aaaaaa'
              },
              {
                id: 2,
                name: 'B',
                members: 'bbbbbb'
              },
              {
                id: 3,
                name: 'C',
                members: 'ccccccc'
              },
              {
                id: 4,
                name: 'D',
                members: 'ddddddd'
              }
            ],
            new_group:{
              id: '',
              name: '',
              members: ''
            },
            edit_group:{
              index: '',
              id: '',
              name: '',
              members: ''
            }
        }
    },
    methods: {
      handle_Add_Group(){
        this.new_group.id = this.count + 1;
        this.addGroupVisible = true;
      },
      save_New_Group(){
        this.checkAddVisible = false;
        if(this.new_group.name == '' || this.new_group.members == ''){
          alert('填写不完整！');
          return;
        }
        this.groups.push({
          id: this.new_group.id,
          name: this.new_group.name,
          describe: this.new_group.describe
        });
        this.new_group.id = '';
        this.new_group.name = '';
        this.new_group.members = '';
        this.count = this.count + 1;
      },
      delete_Groups(){
        var group_ids = this.get_Selected_Ids();
        for(var i=0; i<group_ids.length; i++){
          var group_id = group_ids[i];
          for(var j=0; j<this.groups.length; j++){
            if(group_id == this.groups[j].id){
              this.groups.splice(j, 1);
            }
          }
        }
        this.checkDeleteVisible_n = false;
      },
      handle_Edit(index, row){
 				this.edit_group = Object.assign({}, row);
        this.edit_group.index = index;
        this.editGroupVisible = true;
 		  },
      save_Edit(){
        this.checkEditVisible = false;
        if(this.edit_group.name == ''|| this.edit_group.members == ''){
          alert('填写不完整！');
          return;
        }
        var index = this.edit_group.index;
        this.groups.splice(index, 1);
        var updated_group_info = {id: this.edit_group.id,
                                  name: this.edit_group.name,
                                  members: this.edit_group.members};
        this.groups.splice(index, 0, updated_group_info);
        this.editGroupVisible = false;
      },
      handle_Delete(index, row){
         this.index = index;
         this.checkDeleteVisible_1 = true;
      },
      delete_Single(){
        this.groups.splice(this.index, 1);
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
      }
    },
    created() {
      //do something after creating vue instance
      this.count = this.groups.length;
    }
}
</script>

<style scoped>
.edit_btn{
  display: flex;
  justify-content:flex-start;
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
