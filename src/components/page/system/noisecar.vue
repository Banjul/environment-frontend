<template>
  <div class="base-content base-bg-color">
    <div>
      <el-row :gutter="10">
        <!-- 操作容器 -->
        <!-- <el-col :span=4>
                        <div>
                            <el-select
                                v-model="siteSelected"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入关键词"
                                :loading="loading"
                                :remote-method="getStations"
                            >
                                <el-option
                                    v-for="item in stations"
                                    :key="item.station_id"
                                    :label="item.station_name"
                                    :value="item.station_id">
                                </el-option>
                            </el-select>
                        </div>
        </el-col>-->
        <!--操作按钮-->
        <!-- <el-col :span=1.5>
                        <el-button class="base-btn" type="primary" @click="handleSearch">查询</el-button>
                    
        </el-col>-->
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
          >
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <!-- <el-table-column prop="id" label="主键" >
            </el-table-column>-->
            <el-table-column prop="gather_id" label="采集车编号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="gather_name" label="采集车名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="gather_major" label="主管部门" width="200"></el-table-column>
            <!-- <el-table-column prop="computedStationStatus" label="站点状态" >
            </el-table-column>-->
             <el-table-column prop="district" label="行政区"></el-table-column>
            <el-table-column prop="street" label="街道" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="area" label="区域环境"></el-table-column>
            <el-table-column prop="gather_status" label="采集车状态">
              <template slot-scope="scope"> 
                <span>{{ scope.row.gather_status | stationStatusShow_filter }}</span>
              </template>
            </el-table-column>
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
    <el-dialog
      class="base-dialog"
      :title="dialogTitle+' · 详细信息'"
      :visible.sync="editVisible.basic"
      :fullscreen="true"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-row>
          <el-col :span="8">
        <!-- <el-form-item label="主键">
                    <el-input v-model="form.stationId"></el-input>
        </el-form-item>-->
        <el-form-item label="采集车编号" prop="gather_id">
          <el-input v-if="dialogType=='edit'" v-model="form.gather_id" disabled="disabled"></el-input>
          <el-input v-else v-model="form.gather_id"></el-input>
        </el-form-item>

        <el-form-item label="采集车标号" prop="gather_code">
          <el-input v-model="form.gather_code"></el-input>
        </el-form-item>
        <el-form-item label="采集车名称" prop="gather_name">
          <el-input v-model="form.gather_name"></el-input>
        </el-form-item>
        <el-form-item label="采集车状态" prop="gather_status">
          <el-select v-model="form.gather_status">
            <el-option
              v-for="item in optionsSets.gather_status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属应用" prop="application">
          <el-input v-model="form.application"></el-input>
        </el-form-item>
         <el-form-item label="运维单位" prop="operation_id">
              <el-select v-model="form.operation_id"
              >
                <el-option
                  v-for="item in operationOption"
                  :key="item.operation_id"
                  :label="item.operation_name"
                  :value="item.operation_id"
                ></el-option>
              </el-select>
            </el-form-item>
        <!-- <el-form-item label="在线标识">
          <el-select v-model="form.online_flag">
            <el-option
              v-for="item in optionsSets.online_flag"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->

        <!-- <el-form-item label="对照码">
          <el-input v-model="form.gather_id_dz"></el-input>
        </el-form-item>
        <el-form-item label="所用协议">
          <el-select v-model="form.protocol">
            <el-option
              v-for="item in optionsSets.protocol"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所用协议名称">
          <el-input v-model="form.protocol_name"></el-input>
        </el-form-item> -->
    </el-col>
    <!-- 弹出框·特征信息-->
       <el-col :span="8">
        <el-form-item label="行政区/街镇" prop="districtStreet">
          <el-cascader :options="options" v-model="form.districtStreet"></el-cascader>
        </el-form-item>
        <el-form-item label="国控" prop="country_con">
          <el-select v-model="form.country_con">
            <el-option
              v-for="item in optionsSets.country_con"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市控" prop="city_con">
          <el-select v-model="form.city_con">
            <el-option
              v-for="item in optionsSets.city_con"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区控" prop="domain_con">
          <el-select v-model="form.domain_con">
            <el-option
              v-for="item in optionsSets.domain_con"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域环境" prop="area">
          <el-select v-model="form.area">
            <el-option
              v-for="item in optionsSets.area"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能区"  prop="domain">
          <el-select v-model="form.domain">
            <el-option
              v-for="item in optionsSets.domain"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
     </el-col>

    <!-- 弹出框·其他信息-->
  <el-col :span="8">
        <el-form-item label="主管部门"  prop="gather_major">
          <el-input v-model="form.gather_major"></el-input>
        </el-form-item>
        <el-form-item label="建站单位" prop="gather_setup">
          <el-input v-model="form.gather_setup"></el-input>
        </el-form-item>
        <el-form-item label="建站日期" prop="gather_setupdate">
          <el-date-picker
            v-model="form.gather_setupdate"
            type="date"
            :picker-options="pickeroption"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="企业代码" prop="company_code">
          <el-select v-model="form.company_code">
            <el-option
              v-for="item in companyOption"
              :key="item.company_code"
              :label="item.company_name"
              :value="item.company_code"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="企业代码">
                    <el-input v-model="form.company_code"></el-input>
        </el-form-item>-->
        <el-form-item label="是否有气象数据" prop="climate">
          <el-select v-model="form.climate">
            <el-option
              v-for="item in optionsSets.climate"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有雷达数据"  prop="radar">
          <el-select v-model="form.radar">
            <el-option
              v-for="item in optionsSets.radar"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
  </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button class="base-btn"  @click="editVisible.extra = false">取 消</el-button> -->
        <!-- <el-button
          class="base-btn"
          @click="editVisible.extra = false, editVisible.feature =true"
        >上一步</el-button> -->
        <el-button class="base-btn" v-if="dialogType=='edit'" type="success" @click="saveEdit">保 存</el-button>
        <el-button class="base-btn" v-else type="success" @click="saveAdd">完 成</el-button>
        <el-button class="base-btn" type="danger" v-if="dialogType==='edit'" @click="cancel">重 置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import baseline from "../../base/baseline.vue";
import ds_citys from "../../base/city.js";
export default {
  name: "noisecar",
  components: {
    baseline
  },
  data() {
    return {
      url: {
        // getStationsLike: "environment/station/getStationLike",//模糊查询
        getAllGathers: "environment/gather/getallgatherInfo", //查询所有采集车
        addGather: "environment/gather/insertgather", //新增采集车
        editGather: "environment/gather/updategather", //修改采集车
        delGather: "environment/gather/deletegather", //删除
        getCompanyOption: "environment/company/getallcompany", //获取企业选项
        getOperationOption:"environment/operation/getalloperation"//获取运维单位选项
      },
      //   ==============下拉模糊查询================   //
      // stations: [], //下拉的选择项
      // siteSelected: "", //模糊查询选中的查询结果
      // loading: false, //是否正在从远程获取数据
      //数据源
      gatherData: [], //表格数据
      currentData: [], //当前页表格数据
      // 翻页
      pageSize: 15,
      currentPage: 1, //翻页页码
      recordSize: 0, //记录总数
      del_list: [],
      //   ==============企业代码================   //
      companyOption: [],
      //   ==============运维单位================   //
      operationOption:[],
      editVisible: {
        basic: false //基础信息
        // geo:false,//地理信息
        // feature: false, //特征信息
        // extra: false //其他信息
      }, //审核框是否可见
      // delVisible: false,
      dialogTitle: "", //对话框标题
      dialogType: "",
      is_del: "",
      options: [],
      form: {
        gather_id: "",
        gather_code: "",
        gather_name: "",
        gather_status: "",
        application: "",
        operation_id:"",
        // online_flag: "",
        // gather_id_dz: "",
        // protocol: "",
        // protocol_name: "",
        districtStreet: [],
        district: "",
        street: "",
        country_con: "",
        city_con: "",
        domain_con: "",
        area: "",
        domain: "",
        gather_major: "",
        gather_setup: "",
        gather_setupdate: "",
        company_code: "",
        climate: "",
        radar: ""
      },
            //正则校验规则
      rules: {
        // stationId: [
        //   { required: true, message: "请输入站点编号", trigger: "blur" }
        // ],
        gather_id: [
          { required: true, message: "请输入采集车编号", trigger: "blur" }
        ],
        gather_code: [
          { required: true, message: "请输入采集车标号", trigger: "blur" }
        ],
        gather_name: [
          { required: true, message: "请输入采集车名称", trigger: "blur" }
        ],
       
        gather_status: [
          { required: true, message: "请选择采集车状态", trigger: "change" }
        ],
        application: [
          // { required: true, message: "请输入所属应用", trigger: "blur" }
        ],
        // onlineFlag: [
        //   { required: true, message: "请选择在线标识", trigger: "change" }
        // ],
        // stationIdDZ: [
        //   { required: true, message: "请输入站点编号", trigger: "blur" }
        // ],
        // protocol: [
        //   { required: true, message: "请选择所用协议", trigger: "change" }
        // ],
        // protocolName: [
        //   { required: true, message: "请输入所用协议名称", trigger: "blur" }
        // ],
      
        districtStreet: [
          {
            required: true,
            message: "请选择行政区/街镇信息",
            trigger: "change"
          }
        ],
        // stationRange:[{ required: true, message: "请输入噪声点范围", trigger: 'blur' }],
        country_con: [
          { required: true, message: "请选择是否国控站点", trigger: "change" }
        ],
        city_con: [
          { required: true, message: "请选择是否市控站点", trigger: "change" }
        ],
        domain_con: [
          { required: true, message: "请选择是否区控站点", trigger: "change" }
        ],
        area: [
          { required: true, message: "请选择区域环境", trigger: "change" }
        ],
        domain: [
          { required: true, message: "请选择功能区", trigger: "change" }
        ],
        gather_major: [
          // { required: true, message: "请输入主管部门", trigger: "blur" }
        ],
        gather_setup: [
          // { required: true, message: "请输入建站单位", trigger: "blur" }
        ],
        gather_setupdate: [
          // {
          //   type: "string",
          //   required: true,
          //   message: "请选择建站日期",
          //   trigger: "change"
          // }
        ],
        company_code: [
          // { required: true, message: "请选择企业代码", trigger: "blur" }
        ],
        climate: [
          { required: true, message: "请选择是否有气象数据", trigger: "change" }
        ],
        radar: [
          { required: true, message: "请选择是否有雷达数据", trigger: "change" }
        ]
      },
      //选项预先设置
      optionsSets: {
        gather_status: [
          { value: 1, label: "运营" },
          { value: 0, label: "停运" }
        ],
        // online_flag: [{ value: 0, label: "断线" }, { value: 1, label: "在线" }],
        protocol: [
          { value: 1, label: "老协议" },
          { value: 2, label: "新协议" }
        ],
        country_con: [{ value: 1, label: "是" }, { value: 0, label: "否" }],
        city_con: [{ value: 1, label: "是" }, { value: 0, label: "否" }],
        domain_con: [{ value: 1, label: "是" }, { value: 0, label: "否" }],
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
        climate: [{ value: 1, label: "有" }, { value: 0, label: "无" }],
        radar: [{ value: 1, label: "有" }, { value: 0, label: "无" }]
      },
      pickeroption: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      idx: -1
    };
  },
   filters:{
    stationStatusShow_filter(input){
      // console.log(input)
      if(input==1){
        return "运营"
      }
      return "停运"
    }
  },
  created() {
    this.options = ds_citys;
    this.getGatherData();
    this.getCompanyOption();
    this.getOperationOption();
  },
  // computed:{
  //     currentData.computedStationStatus:function(){
  //         console.log(this.currentData.stationStatus);
  //         return this.currentData.stationStatus?"运营":"停运";
  //     }
  // },
  methods: {
    // 模糊查询获取站点下拉列表
    // getStations(key) {
    // this.$axios
    //     .post(this.url.getStationsLike, {
    //     key: key
    //     })
    //     .then(res => {
    //     this.stations = res.data.stations;
    //     })
    //     .catch(function(error) {
    //     console.log(error);
    //     });
    // },
    // 获取企业代码选项
    getCompanyOption() {
      this.$axios
        .get(this.url.getCompanyOption)
        .then(res => {
          //处理企业代码数据
          let companyData = res.data;
          if (companyData.length == 0) {
            this.$message.warning("获取企业代码信息为空");
            return;
          }

          this.companyOption = companyData;
        })
        .catch(function(error) {
          console.log("获取企业代码信息失败");
        });
    },
     // 获取企业代码选项
    getOperationOption(){
      this.$axios
        .get(this.url.getOperationOption)
        .then(res=>{
          //处理企业代码数据
          let operationData=res.data;
          if(operationData.length==0){
            this.$message.warning("获取运维单位信息为空");
            return;
          }
          
          this.operationOption=operationData;

        }) 
        .catch(function(error){
          console.log("获取企业代码信息失败");
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
        if (this.gatherData[i]) {
          this.currentData.push(this.gatherData[i]);
        }
      }
    },
    // 获取数据
    getGatherData() {
      this.$axios
        .get(this.url.getAllGathers)
        .then(res => {
          if (!res.data.length) {
            var info = "噪声采集车查询数据为空";
            this.showResultInfo(info);
            return;
          }
          this.gatherData = res.data;
          console.log(this.gatherData);
          this.recordSize = this.gatherData.length;
          this.currentPage = 1;
          this.initPageList();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //处理新增面板
    handleAdd() {
      //TODO获取最新采集车编号
      this.dialogTitle = "新增";
      this.form = {
        gather_id: "",
        gather_code: "",
        gather_name: "",
        gather_status: "",
        application: "",
        operation_id:"",
        // online_flag: "",
        // gather_id_dz: "",
        // protocol: "",
        // protocol_name: "",
        districtStreet: [],
        // district:'',
        // street:'',
        country_con: "",
        city_con: "",
        domain_con: "",
        area: "",
        domain: "",
        gather_major: "",
        gather_setup: "",
        gather_setupdate: "",
        company_code: "",
        climate: "",
        radar: ""
      };
      this.dialogType = "add";
      this.editVisible.basic = true;
    },
    //处理编辑面板
    handleEdit(index, row) {
      this.dialogTitle = "编辑";
      this.dialogType = "edit";
      this.idx = index;
      let item = this.currentData[index];
      console.log(item);
      // this.form = item;
      this.form = {
        gather_id: item.gather_id,
        gather_code: item.gather_code,
        gather_name: item.gather_name,
        gather_status: item.gather_status,
        application: item.application,
        operation_id:item.operation_id,
        districtStreet: [item.district,item.street],
        country_con: item.country_con,
        city_con: item.city_con,
        domain_con: item.domain_con,
        area: item.area,
        domain: item.domain,
        gather_major: item.gather_major,
        gather_setup: item.gather_setup,
        gather_setupdate: item.gather_setupdate,
        company_code: item.company_code,
        climate: item.climate,
        radar: item.radar
      };
      // console.log(this.form.districtStreet);
      this.form.gather_setupdate = (item.gather_setupdate=="1000-01-01 00:00:00.0")?"":item.gather_setupdate;
      //将原始数据存储在本地
      window.sessionStorage.setItem("formSelected", JSON.stringify(this.form));
      this.editVisible.basic = true;
    },
    // //查询方法
    // handleSearch() {
    // //1.查询具体站点
    // if (this.siteSelected == "" ) {
    //     console.log("重新查询");
    //     this.getStationData();
    // }else{
    //     let getStation=this.getStationById(this.siteSelected);
    //     this.currentData=[];
    //     if(!getStation){
    //         this.showResultInfo("当前查询站点不存在");
    //         return;
    //     }
    //     this.currentData.push(getStation);
    //     this.recordSize=1;
    // // this.getSiteData();
    // }
    // // console.log(this.siteSelected);
    // //重置选中站点属性
    // this.siteSelected="";
    // },
    // getGatherById(id){
    //     console.log(this.gatherData)
    //     for(let i=0;i<this.gatherData.length;i++){
    //         if(this.gatherData[i].gatherCode==id){
    //             return this.gatherData[i];
    //         }
    //     }
    //     return null;
    // },
    //处理删除
    handleDelete(index, row) {
      this.$confirm("确定删除此采集车?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.idx = index;
          // 获取删除对象ID
          let item = this.currentData[index];
          this.$axios
            .post(this.url.delGather, {
              gatherId: item.gather_id
            })
            .then(res => {
              let result = res.data;
              if (result == "success") {
                //TODO提示
                this.$message.success(`删除成功`);
                this.getGatherData();
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
    // handleSelectionChange(val) {
    //     this.multipleSelection = val;

    // },
    //保存新增
    saveAdd() {
      console.log(11);
    this.$refs["form"].validate(valid => {
      console.log("开始");
          if (!valid) {
            return;
          }
        console.log(this.getDataToSubmit());
        this.$axios
          .post(this.url.addGather, this.getDataToSubmit())
          .then(res => {
            let result = res.data;
            if (result == "success") {
              //TODO提示
              this.$message.success(`添加成功`);
              this.getGatherData();
              this.editVisible.basic = false;
            } else {
              this.$message.warning(result);
            }
          })
          .catch(function(error) {
            console.log(error);
          });
       });
      // this.$message.success(`添加成功`);
    },
    // //处理关闭标签
    // handleClose(tag){
    //     this.form.stationRange.splice(this.form.stationRange.indexOf(tag), 1);
    // },
    // 保存编辑
    saveEdit() {
       this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
      let target = JSON.parse(
        window.sessionStorage.getItem("formSelected") || "[]"
      ).gather_id;

      console.log(this.getDataToSubmit(target));
      this.$axios
        .post(this.url.editGather, this.getDataToSubmit(target))
        .then(res => {
          let result = res.data;
          if (result == "success") {
            //TODO提示
            this.$message.success(`编辑成功`);
            this.getGatherData();
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
            window.sessionStorage.getItem("formSelected") || "[]"
          );
        })
        .catch(() => {
          return;
        });
    },
    //获取提交数据
    getDataToSubmit(target) {
      let addData = this.form;
      //影响范围数据处理
      // let rangeArray="";
      // for(let item in addData.stationRange){
      //     rangeArray+=addData.stationRange[item]+";";
      // }
      // rangeArray= rangeArray.substring(0,rangeArray.length-1);
      var resultData = {
        application: addData.application,
        operationId:addData.operation_id,
        area: addData.area,
        cityCon: addData.city_con,
        countryCon: addData.country_con,
        district: addData.districtStreet[0],
        domain: addData.domain,
        domainCon: addData.domain_con,
        gatherCode: addData.gather_code,
        gatherId: addData.gather_id,
        gatherIdDz: 0,
        gatherName: addData.gather_name,
        gatherStatus: addData.gather_status,
        onlineFlag:0,
        protocol: 0,
        protocolName: 0,
        street: addData.districtStreet[1],
        gatherMajor: addData.gather_major,
        gatherSetup: addData.gather_setup,
        gatherSetupDate: addData.gather_setupdate,
        companyCode: addData.company_code,
        climate: addData.climate,
        radar: addData.radar
      };
      if (typeof target != "undefined") {
        resultData.target = target;
      }
      return resultData;
    },
    //校验数据完整性
    checkDataCompleted() {
      for (var item in this.form) {
        if (this.form[item].length == 0) {
          console.log(item + "为空");
          return false;
        }
      }
      return true;
    },
    //显示错误提示
    showResultInfo(info) {
      this.$confirm(info, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {});
    }
  }
};
</script>


<style scoped>
/* .handle-input {
        width: 300px;
        display: inline-block;
    } */
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
/* .double-column .el-form-item {
    width: 45%;
    float: left;
	} */
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
