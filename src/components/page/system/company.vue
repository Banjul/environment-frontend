<template>
  <div class="base-content base-bg-color">
    <div>
      <el-row :gutter="10">
        <!-- 操作容器 -->
        <!--模糊查询-->
        <el-col :span="4">
          <div>
            <el-select
              v-model="companySelected"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入关键词"
              :loading="loading"
              :remote-method="getCompaniesLike"
            >
              <el-option
                v-for="item in companyOptions"
                :key="item.company_code"
                :label="item.company_name"
                :value="item.company_code"
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
            <el-table-column prop="company_name" label="企业名称"></el-table-column>
            <el-table-column
              prop="company_place"
              label="企业地址"
              width="250"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="represent" label="法人代表"></el-table-column>
            <el-table-column prop="represent_tel" label="联系电话"></el-table-column>
            <el-table-column prop="protection" label="环保负责人"></el-table-column>
            <el-table-column prop="protection_tel" label="负责人电话"></el-table-column>
            <!-- <el-table-column prop="stationStatus" label="运行状态">
              <template slot-scope="scope"> 
                <span>{{ scope.row.stationStatus | stationStatusShow_filter }}</span>
              </template>
            </el-table-column>-->
            <!-- <el-table-column prop="computedStationStatus" label="站点状态" >
            </el-table-column>-->
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
    <el-dialog class="base-dialog" :title="dialogTitle+' · 详细信息'" :visible.sync="editVisible.basic" width="60%">
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <!-- <el-form-item label="主键">
                    <el-input v-model="form.stationId"></el-input>
        </el-form-item>-->
        <el-row>
          <el-col :span="10">
            <el-form-item label="企业代码" prop="company_code">
              <el-input v-if="dialogType=='edit'" v-model="form.company_code" disabled="disabled"></el-input>
              <el-input v-else v-model="form.company_code"></el-input>
            </el-form-item>

            <!-- <el-form-item label="站点标号" prop="stationCode">
                    <el-input   v-model="form.stationCode" ></el-input>
            </el-form-item>-->
            <el-form-item label="企业名称" prop="company_name">
              <el-input v-model="form.company_name"></el-input>
            </el-form-item>

            <el-form-item label="企业类型" prop="company_type">
              <el-select v-model="form.company_type">
                <el-option
                  v-for="item in optionsSets.company_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属行业" prop="industry">
              <el-select v-model="form.industry">
                <el-option
                  v-for="item in optionsSets.industry"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业地址" prop="company_place">
              <el-input v-model="form.company_place"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业规模" prop="company_range">
              <el-select v-model="form.company_range">
                <el-option
                  v-for="item in optionsSets.company_range"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="法人代表" prop="represent">
              <el-input v-model="form.represent"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="represent_tel">
              <el-input v-model="form.represent_tel"></el-input>
            </el-form-item>
            <el-form-item label="环保负责人" prop="protection">
              <el-input v-model="form.protection"></el-input>
            </el-form-item>
            <el-form-item label="负责人电话" prop="protection_tel">
              <el-input v-model="form.protection_tel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
import baseline from "../../base/baseline.vue";
// import ds_citys from "../../base/city.js";
import company_type from "./configuration/company_type.js";
import company_range from "./configuration/company_range.js";
// import func from './vue-temp/vue-editor-bridge';
export default {
  name: "company",
  components: {
    baseline
  },
  data() {
    return {
      url: {
        getCompaniesLike: "environment/company/getcompanylike", //模糊查询
        getAllCompanies: "environment/company/getallcompany", //查询所有
        addCompany: "environment/company/addcompany", //新增
        editCompany: "environment/company/updatecompany", //修改
        delCompany: "environment/company/deletecompany" //删除
      },
      //   ==============下拉模糊查询================   //
      companyOptions: [], //下拉的选择项
      companySelected: "", //模糊查询选中的查询结果
      loading: false, //是否正在从远程获取数据
      //数据源
      rawData: [], //源数据
      companyData: [], //表格数据
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
        company_code: "",
        company_name: "",
        company_type: "",
        industry: "",
        company_place: "",
        company_range: "",
        represent: "",
        represent_tel: "",
        protection: "",
        protection_tel: ""
      },
      //正则校验规则
      rules: {
        company_code: [
          { required: true, message: "请输入企业代码", trigger: "blur" }
        ],
        company_name: [
          { required: true, message: "请输入企业名称", trigger: "blur" }
        ],
        company_place: [
          { required: true, message: "请输入企业地址", trigger: "blur" }
          // {
          //   pattern: /[\u4e00-\u9fa5]{4}/,
          //   message: "请输入4位中文",
          //   trigger: "blur"
          // }
        ],
        company_type: [
          { required: true, message: "请选择企业类型", trigger: "change" }
        ],
        company_range: [
          { required: true, message: "请选择企业规模", trigger: "change" }
        ],
        // application: [
        //   // { required: true, message: "请输入所属应用", trigger: "blur" }
        // ],
        industry: [
          {
            required: true,
            message: "请选择所属行业",
            trigger: "change"
          }
        ],
         represent: [
          { required: true, message: "请输入法人代表", trigger: "blur" }
        ],
        represent_tel: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        protection: [
          { required: true, message: "请输入环保负责人", trigger: "blur" }
        ],
        protection_tel: [
          { required: true, message: "请输入负责人电话", trigger: "blur" }
        ]
       
      },
      //TODO-选项预先设置
      optionsSets: {
        company_type: [],
        industry: [{ value: "1", label: "测试行业1" },{value:"10001",label:"10001"}],
        company_range: [],
        stationStatus: [
          { value: 1, label: "运营" },
          { value: 0, label: "停运" }
        ],
        // onlineFlag: [{ value: 0, label: "断线" }, { value: 1, label: "在线" }],
        // protocol: [
        //   { value: 1, label: "老协议" },
        //   { value: 2, label: "新协议" }
        // ],
        countryCon: [{ value: 1, label: "是" }, { value: 0, label: "否" }],
        cityCon: [{ value: 1, label: "是" }, { value: 0, label: "否" }],
        domainCon: [{ value: 1, label: "是" }, { value: 0, label: "否" }],
        area: [
          { value: 0, label: "0" },
          { value: 1, label: "1" },
          { value: 2, label: "2" },
          { value: 3, label: "3" },
          { value: 4, label: "4" }
        ],
        domain: [
          { value: 0, label: "0" },
          { value: 1, label: "1" },
          { value: 2, label: "2" },
          { value: 3, label: "3" },
          { value: 4, label: "4" }
        ],
        stationAttribute: [
          { value: 1, label: "自动" },
          { value: 0, label: "手工" },
          { value: "2", label: "其他" }
        ],
        climate: [{ value: 1, label: "有" }, { value: 0, label: "无" }],
        radar: [{ value: 1, label: "有" }, { value: 0, label: "无" }]
      },
      idx: -1
      // reback:true
    };
  },
  filters: {
    //TODO-过滤器
    stationStatusShow_filter(input) {
      // console.log(input)
      if (input == 1) {
        return "运营";
      }
      return "停运";
    }
  },
  created() {
    //加载公司类型选项
    this.optionsSets.company_type = company_type;
    this.optionsSets.company_range = company_range;
    console.log(this.optionsSets.company_type);
    this.getCompanyData();
  },
  methods: {
    // 模糊查询获取企业下拉列表
    getCompaniesLike(key) {
      this.$axios
        .post(this.url.getCompaniesLike, {
          target: key
        })
        .then(res => {
          this.companyOptions = res.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    // 获取企业数据
    getCompanyData() {
      this.$axios
        .get(this.url.getAllCompanies)
        .then(res => {
          if (!res.data.length) {
            this.$message.warning("企业查询数据为空");
            return;
          }
          this.companyData = res.data;
          this.rawData = this.clone(this.companyData);
          this.recordSize = this.companyData.length;
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
        if (this.companyData[i]) {
          this.currentData.push(this.companyData[i]);
        }
      }
    },
    //处理新增面板
    handleAdd() {
      //TODO获取最新站点编号
      this.dialogTitle = "新增";
      this.form = {
        company_code: "",
        company_name: "",
        company_type: "",
        industry: "",
        company_place: "",
        company_range: "",
        represent: "",
        represent_tel: "",
        protection: "",
        protection_tel: ""
      };
      this.dialogType = "add";
      this.editVisible.basic = true;
    },
    //克隆对象
    clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    //处理编辑面板
    handleEdit(index, row) {
      this.dialogTitle = "编辑";
      this.dialogType = "edit";
      this.idx = index;
      let item = this.currentData[index];
      console.log(item);
      this.form = {
        company_code: item.company_code,
        company_name: item.company_name,
        company_type: item.company_type,
        industry: item.industry,
        company_place: item.company_place,
        company_range: item.company_range,
        represent: item.represent,
        represent_tel: item.represent_tel,
        protection: item.protection,
        protection_tel: item.protection_tel
      };
      //将原始数据存储在本地
      window.sessionStorage.setItem(
        "formCompanySelected",
        JSON.stringify(this.form)
      );
      this.editVisible.basic = true;
    },
    //查询方法
    handleSearch() {
      //判断是否有查询条件
      if (this.companySelected == "") {
        console.log("重新查询");
        this.getCompanyData();
      } else {
        //还原原数据
        this.companyData = this.clone(this.rawData);

        //筛选站点
        let getCompany = this.filterData();
        this.companyData = [];
        if (getCompany.length == 0) {
          this.$message.warning("当前查询企业不存在");
        }
        this.companyData = getCompany;
        this.recordSize = this.companyData.length;
        this.currentPage = 1;
        this.initPageList();
      }
    },
    //数据过滤方法
    filterData() {
      return this.companyData.filter(d => {
        if (d.company_code == this.companySelected || this.companySelected == "") {
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
          console.log("删除站点" + item.company_code);
          this.$axios
            .post(this.url.delCompany, {
              companyCode: item.company_code
            })
            .then(res => {
              let result = res.data;
              if (result == "success") {
                //TODO提示
                this.$message.success(`删除成功`);
                this.getCompanyData();
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
    //保存新增
    saveAdd() {
      //表单输入校验
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        this.$axios
          .post(this.url.addCompany, this.getDataToSubmit())
          .then(res => {
            let result = res.data;
            if (result == "success") {
              //TODO提示
              this.$message.success(`添加成功`);
              this.getCompanyData();
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
          window.sessionStorage.getItem("formCompanySelected") || "[]"
        ).company_code;
        //提交请求
        this.$axios
          .post(this.url.editCompany, this.getDataToSubmit(target))
          .then(res => {
            let result = res.data;
            if (result == "success") {
              //TODO提示
              this.$message.success(`编辑成功`);
              this.getCompanyData();
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
            window.sessionStorage.getItem("formCompanySelected") || "[]"
          );
        })
        .catch(() => {
          return;
        });
    },
    //获取提交数据
    getDataToSubmit(target) {
      let addData = this.form;
      //提交数据拼接
      var resultData = {
        companyCode: addData.company_code,
        companyName: addData.company_name,
        companyType: addData.company_type,
        industry: addData.industry,
        companyPlace: addData.company_place,
        companyRange: addData.company_range,
        represent: addData.represent,
        representTel: addData.represent_tel,
        protection: addData.protection,
        protectionTel: addData.protection_tel
      };
      if (typeof target != "undefined"||target !== "") {
        resultData.target = target;
      }
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

</style>
