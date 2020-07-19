<template>
  <div class="base-content base-bg-color">
    <div>
      <el-row :gutter="10">
        <!-- 操作容器 -->
        <!--模糊查询-->
        <el-col :span="4">
          <div>
            <el-select
              v-model="operationSelected"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入关键词"
              :loading="loading"
              :remote-method="getOperationsLike"
            >
              <el-option
                v-for="item in operationOptions"
                :key="item.operation_id"
                :label="item.operation_name"
                :value="item.operation_id"
              ></el-option>
            </el-select>
          </div>
        </el-col>

        <!--操作按钮-->
        <el-col :span="1.5">
          <el-button class="base-btn" type="primary" @click="handleSearch">查询</el-button>
        </el-col>
        <el-col :span="1">
          <el-button class="base-btn" type="success" @click="handleAdd">新增</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <div>
            <baseline></baseline>
            <!--分割线-->
          </div>
          <!-- 表格展示 -->
          <!-- 数据容器 -->
          <el-table
            row-class-name="base-eltable-bgc"
            :data="currentData"
            border
            style="width: 100%"
            ref="multipleTable"
          >
            <el-table-column prop="operation_id" label="运维编号"></el-table-column>
            <el-table-column prop="operation_name" label="运维单位名称"></el-table-column>
            <el-table-column prop="operation_relate" label="联系人"></el-table-column>
            <el-table-column prop="operation_tel" label="联系电话"></el-table-column>
            <!-- <el-table-column prop="operation_target" label="运维对象"></el-table-column> -->
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button class="base-btn" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  class="base-btn"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页栏 -->
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[15]"
            layout="total,sizes,prev, pager, next,jumper"
            :total="recordSize"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>

    <!-- 弹出框·基础信息-->
    <el-dialog class="base-dialog" :title="dialogTitle+' · 详细信息'" :visible.sync="editVisible.basic">
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="运维编号" prop="operation_id">
          <el-input v-if="dialogType=='edit'" v-model="form.operation_id" disabled="disabled"></el-input>
          <el-input v-else v-model="form.operation_id"></el-input>
        </el-form-item>
        <el-form-item label="运维单位名称" prop="operation_name">
          <el-input v-model="form.operation_name"></el-input>
        </el-form-item>

        <el-form-item label="联系人" prop="operation_relate">
          <el-input v-model="form.operation_relate"></el-input>
        </el-form-item>

        <el-form-item label="联系电话" prop="operation_tel">
          <el-input v-model="form.operation_tel"></el-input>
        </el-form-item>
        <!-- <el-form-item label="运维对象" prop="operation_target">
          <el-input v-model="form.operation_target"></el-input>
        </el-form-item>-->
        <el-form-item label="管辖噪声点">
          <el-select v-model="selectedArea" clearable placeholder="行政区" style="width:150px;">
            <el-option
              v-for="item in areaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="siteSelected"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="关键词"
            :loading="loading"
            :remote-method="getStationsByOperation"
            style="width:150px;"
          >
            <el-option
              v-for="item in stations"
              :key="item.stationCode"
              :label="item.stationSim"
              :value="item.stationCode"
            ></el-option>
          </el-select>
          <el-button icon="el-icon-plus" type="primary" circle @click="addStation"></el-button>
        </el-form-item>
        <el-form-item label>
          <div class="mytags">
            <el-tag
              v-for="tag in form.handle_station"
              :key="tag.stationCode"
              closable
              @close="handleCloseStation(tag)"
            >{{tag.stationSim}}</el-tag>
          </div>
        </el-form-item>
        <el-form-item label="管辖流动站点">
          <el-checkbox
            border
            v-for="gather in form.handle_gather"
            :key="gather.gatherId"
            v-model="gather.flag"
            :label="gather.gatherName"
            size="medium"
          >{{gather.gatherName}}</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button class="base-btn" @click="editVisible.basic = false">取 消</el-button> -->
        <el-button class="base-btn" v-if="dialogType=='edit'" type="success" @click="saveEdit">保 存</el-button>
        <el-button class="base-btn" v-else type="success" @click="saveAdd">完 成</el-button>
        <el-button class="base-btn" type="danger" v-if="dialogType==='edit'" @click="cancel">重 置</el-button>
        <!-- <el-button v-else @click="cancel">还原</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import areaOptions from "@/components/base/areas.js";
import baseline from "../../base/baseline.vue";
export default {
  name: "opermain",
  components: {
    baseline
  },
  data() {
    return {
      url: {
        getStationsByOperationLike: "environment/operation/getstation", //通过运维单位站点模糊查询
        getOperationsLike: "environment/operation/getoperationlike", //模糊查询
        getAllOperations: "environment/operation/getalloperation", //查询所有
        addOperation: "environment/operation/addoperation", //新增
        editOperation: "environment/operation/updateoperation", //修改
        delOperation: "environment/operation/deleteoperation", //删除
        //----------管辖运维对象API------------
        getOperationDetail: "environment/operation/getoneoperation" //获取管辖噪声点
      },
      //   ==============站点模糊查询================   //
      // 行政区的下拉
      areaOptions: areaOptions,
      // 选择的行政区
      selectedArea: "",
      // 选择的站点
      siteSelected: "",
      // 存放站点下拉列表
      stations: [],
      //   ==============运维模糊查询================   //
      operationOptions: [], //下拉的选择项
      operationSelected: "", //模糊查询选中的查询结果
      loading: false, //是否正在从远程获取数据
      //数据源
      rawData: [], //源数据
      operationData: [], //表格数据
      currentData: [], //当前页表格数据
      // 翻页
      pageSize: 15,
      currentPage: 1, //翻页页码
      recordSize: 0, //记录总数
      editVisible: {
        basic: false //基础信息
      }, //审核框是否可见
      dialogTitle: "", //对话框标题
      dialogType: "",
      form: {
        operation_id: "",
        operation_name: "",
        operation_tel: "",
        operation_relate: "",
        // operation_target: "",
        handle_station: [],
        handle_gather: [],
        u_handle_station: []
      },
      //正则校验规则
      rules: {
        operation_id: [
          { required: true, message: "请输入运维编号", trigger: "blur" }
        ],
        operation_name: [
          { required: true, message: "请输入运维单位名称", trigger: "blur" }
        ],
        operation_relate: [
          { required: true, message: "请输入联系人", trigger: "blur" }
          // {
          //   pattern: /[\u4e00-\u9fa5]{4}/,
          //   message: "请输入4位中文",
          //   trigger: "blur"
          // }
        ],
        operation_tel: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        application: [
          // { required: true, message: "请输入所属应用", trigger: "blur" }
        ],
        stationPositionx: [
          { required: true, message: "请输入纬度坐标", trigger: "blur" },
          {
            pattern: /^(\-|\+)?([0-8]?\d{1}\.\d{0,10}|90\.0{0,10}|[0-8]?\d{1}|90)$/,
            message: "输入不合法",
            trigger: "blur"
          }
        ],
        stationPositiony: [
          { required: true, message: "请输入经度坐标", trigger: "blur" },
          {
            pattern: /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,10})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,10}|180)$/,
            message: "输入不合法",
            trigger: "blur"
          }
        ],
        districtStreet: [
          {
            required: true,
            message: "请选择行政区/街镇信息",
            trigger: "change"
          }
        ],
        // stationRange:[{ required: true, message: "请输入噪声点范围", trigger: 'blur' }],
        countryCon: [
          { required: true, message: "请选择是否国控站点", trigger: "change" }
        ],
        stationSetupDate: [
          // {
          //   type: "string",
          //   required: true,
          //   message: "请选择建站日期",
          //   trigger: "change"
          // }
        ],
        operationCode: [
          // { required: true, message: "请选择企业代码", trigger: "blur" }
        ],
        climate: [
          { required: true, message: "请选择是否有气象数据", trigger: "change" }
        ],
        radar: [
          { required: true, message: "请选择是否有雷达数据", trigger: "change" }
        ]
      },
      idx: -1,
      // reback:true
      tagList: []
    };
  },
  created() {
    this.getOperationData();
  },
  methods: {
    //模糊查询获取站点下拉列表
    getStationsByOperation(key) {
      this.$axios
        .post(this.url.getStationsByOperationLike, {
          area: this.selectedArea,
          key: key,
          operationId:this.idx
        })
        .then(res => {
          this.stations = res.data;
          console.log(this.stations)
        });
    },
    // 模糊查询获取企业下拉列表
    getOperationsLike(key) {
      this.$axios
        .post(this.url.getOperationsLike, {
          target: key
        })
        .then(res => {
          this.operationOptions = res.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    // 获取企业数据
    getOperationData() {
      this.$axios
        .get(this.url.getAllOperations)
        .then(res => {
          if (!res.data.length) {
            this.$message.warning("运维商查询数据为空");
            return;
          }
          this.operationData = res.data;
          this.rawData = this.clone(this.operationData);
          this.recordSize = this.operationData.length;
          this.currentPage = 1;
          this.initPageList();
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initPageList();
    },
    // 初始化表格数据
    initPageList() {
      this.currentData = [];
      for (
        let i = (this.currentPage - 1) * this.pageSize;
        i < this.currentPage * this.pageSize;
        i++
      ) {
        if (this.operationData[i]) {
          this.currentData.push(this.operationData[i]);
        }
      }
    },
    //处理新增面板
    handleAdd() {
      //TODO获取最新站点编号
      this.dialogTitle = "新增";
      this.form = {
        operation_id: "",
        operation_name: "",
        operation_tel: "",
        operation_relate: "",
        // operation_target: "",
        handle_station: [],
        handle_gather: [],
        u_handle_station: []
      };
      // 获取管辖噪声点和流动站点
      this.$axios
        .post(this.url.getOperationDetail, {
          operationId: ""
        })
        .then(res => {
          this.form.handle_station = res.data.station_set;
          this.form.handle_gather = res.data.gather;
          this.form.u_handle_station = res.data.station_unset;

          this.dialogType = "add";
          this.editVisible.basic = true;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //克隆对象
    clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    //处理编辑面板
    handleEdit(index, row) {
      this.dialogTitle = "编辑";
      this.dialogType = "edit";
      let item = this.currentData[index];
      this.idx= item.operation_id;
      console.log(item);
      this.form = {
        operation_id: item.operation_id,
        operation_name: item.operation_name,
        operation_tel: item.operation_tel,
        operation_relate: item.operation_relate,
        // operation_target: "",
        handle_station: [],
        handle_gather: [],
        u_handle_station: []
      };
      // 获取管辖噪声点和流动站点
      this.$axios
        .post(this.url.getOperationDetail, {
          operationId: item.operation_id
        })
        .then(res => {
          this.form.handle_station = res.data.station_set;
          this.form.handle_gather = this.StrFormat(res.data.gather);
          console.log(this.form.handle_gather)
          this.form.u_handle_station = res.data.station_unset;
          //将原始数据存储在本地
          window.sessionStorage.setItem(
            "formOperationSelected",
            JSON.stringify(this.form)
          );
          this.editVisible.basic = true;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //查询方法
    handleSearch() {
      //判断是否有查询条件
      if (this.operationSelected == "") {
        console.log("重新查询");
        this.getOperationData();
      } else {
        //还原原数据
        this.operationData = this.clone(this.rawData);

        //筛选站点
        let getOperation = this.filterData();
        this.operationData = [];
        if (getOperation.length == 0) {
          this.$message.warning("当前查询运维商不存在");
        }
        this.operationData = getOperation;
        this.recordSize = this.operationData.length;
        this.currentPage = 1;
        this.initPageList();
      }
    },
    //数据过滤方法
    filterData() {
      return this.operationData.filter(d => {
        if (
          d.operation_id == this.operationSelected ||
          this.operationSelected == ""
        ) {
          return d;
        }
      });
    },

    //处理删除
    handleDelete(index, row) {
      this.$confirm("确定删除此站点?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.idx = index;
          // 获取删除对象ID
          let item = this.currentData[index];
          console.log("删除站点" + item.operation_id);
          this.$axios
            .post(this.url.delOperation, {
              operationId: item.operation_id
            })
            .then(res => {
              let result = res.data;
              if (result == "success") {
                //TODO提示
                this.$message.success(`删除成功`);
                this.getOperationData();
              } else {
                this.$message.warning(result);
              }
            });
          // this.delVisible = true;
        })
        .catch(() => {
          return;
        });
    },
    //新增管辖噪声点
    addStation() {
      if (this.siteSelected == "") {
        this.$message.warning("请先选中噪声点！");
        return;
      }
      let stationSelected = this.getStationItemById(
        this.siteSelected,
        this.form.u_handle_station
      );
      if (!stationSelected) {
        this.$message.warning("该噪声点已存在！");
        return;
      } else {
        this.form.handle_station.push(stationSelected);
        this.form.u_handle_station.splice(
          this.form.u_handle_station.indexOf(stationSelected),
          1
        );
      }
    },
    //根据stationCode获取对象
    getStationItemById(objectId, objects) {
      console.log(objects);
      for (let i = 0; i < objects.length; i++) {
        if (this.siteSelected == objects[i].stationCode) {
          return objects[i];
        }
      }
      return null;
    },
    //移除管辖噪声点
    handleCloseStation(tag) {
      this.form.handle_station.splice(this.form.handle_station.indexOf(tag), 1);
      this.form.u_handle_station.push(tag);
    },
    //保存新增
    saveAdd() {
      //表单输入校验
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        this.$axios
          .post(this.url.addOperation, this.getDataToSubmit())
          .then(res => {
            let result = res.data;
            if (result == "success") {
              //TODO提示
              this.$message.success(`添加成功`);
              this.getOperationData();
              this.editVisible.basic = false;
            } else {
              this.$message.warning(result);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    },
    // 保存编辑
    saveEdit() {
      //表单输入校验
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        //获取修改对象标识
        let target = JSON.parse(
          window.sessionStorage.getItem("formOperationSelected") || "[]"
        ).operation_id;
        //提交请求
        this.$axios
          .post(this.url.editOperation, this.getDataToSubmit(target))
          .then(res => {
            let result = res.data;
            if (result == "success") {
              //TODO提示
              this.$message.success(`编辑成功`);
              this.getOperationData();
              this.editVisible.basic = false;
            } else {
              this.$message.warning(result);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    },
    cancel() {
      this.$confirm("所做的更改将不会保留，确认还原?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //将数据还原为本地存储的原始数据
          this.form = JSON.parse(
            window.sessionStorage.getItem("formOperationSelected") || "[]"
          );
        })
        .catch(() => {
          return;
        });
    },
    //bool类型转字符串
    boolFormat(objects){
      for(let i=0;i<objects.length;i++){
        if(objects[i].flag){
          objects[i].flag="true";
        }else{
          objects[i].flag="false";
        }
      }
      return objects;
    },
    //字符串类型转bool
    StrFormat(objects){
      for(let i=0;i<objects.length;i++){
        objects[i].flag=JSON.parse(objects[i].flag);
      }
      return objects;
    },
    getIdFromStation(objects){
      let arr=[];
      for(let i=0;i<objects.length;i++){
        arr.push(objects[i].stationCode);
      }
      return arr;
    },
    //获取提交数据
    getDataToSubmit(target) {
      let addData = this.form;
      //提交数据拼接
      var resultData = {
        operationId: addData.operation_id,
        operationName: addData.operation_name,
        operationRelate: addData.operation_relate,
        operationTel: addData.operation_tel,
        stationSet: this.getIdFromStation(addData.handle_station),
        stationUnset:this.getIdFromStation(addData.u_handle_station),
        gather: this.boolFormat(addData.handle_gather)
        // operationTarget: addData.operation_target
        //------------------------
      };
      if (typeof target != "undefined" || target !== "") {
        resultData.target = target;
      }
      console.log(resultData)
      return resultData;
    }
  }
};
</script>


<style scoped>
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}

.dialog-footer {
  display: block;
  padding-right: 55px;
  padding-bottom: 20px;
}

.base-dialog .el-input {
  width: 220px;
}
.base-dialog .el-select {
  width: 220px;
}
.base-dialog .el-cascader {
  width: 220px;
}
.el-form-item {
  margin-bottom: 20px;
  /* width:80%; */
}
.mytags {
  position: relative;
  float: left;
  height: auto;
  /* height: 30px; */
  /* overflow: hidden; */
  /* background: #fff; */
  /* padding-right: 120px; */
  /* -webkit-box-shadow: 0 5px 10px #ddd; */
  /* box-shadow: 0 5px 10px #ddd; */
}
</style>
