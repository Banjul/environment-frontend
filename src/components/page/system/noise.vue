<template>
  <div class="base-content base-bg-color">
    <div>
      <el-row :gutter="10">
        <!-- 操作容器 -->
        <el-col :span="3">
                  <el-select v-model="selectedArea" clearable placeholder="行政区" style="width:150px;">
            <el-option
              v-for="item in areaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
        </el-col>
        <!--模糊查询-->
        <el-col :span="3">
          <div>
            <el-select
              v-model="siteSelected"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="关键词"
              :loading="loading"
              :remote-method="getStations"
              style="width:150px;"
            >
              <el-option
                v-for="item in stations"
                :key="item.station_id"
                :label="item.sim"
                :value="item.station_id"
              ></el-option>
            </el-select>
          </div>
        </el-col>

        <!--操作按钮-->
        <el-col :span="1.5">
          <el-button class="base-btn" type="primary" @click="handleSearch">查询</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button class="base-btn" type="danger" @click="clearSelect">重置条件</el-button>
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
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <!-- <el-table-column prop="id" label="主键" >
            </el-table-column>-->
            <!-- <el-table-column prop="stationId" label="站点编号" >
            </el-table-column>-->
            <!-- <el-table-column prop="stationCode" label="站点标号" width="200">
            </el-table-column>-->
            <el-table-column prop="stationSim" label="站点简称"></el-table-column>
            <!-- <el-table-column
              prop="stationPosition"
              label="经纬度"
              width="250"
              :show-overflow-tooltip="true"
            ></el-table-column>-->
            <el-table-column prop="district" label="行政区"></el-table-column>
            <el-table-column prop="street" label="街道" width="250" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="area" label="区域环境"></el-table-column>
            <el-table-column prop="stationStatus" label="运行状态">
              <template slot-scope="scope">
                <span>{{ scope.row.stationStatus | stationStatusShow_filter }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="application" label="所属应用"></el-table-column>

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
    <el-dialog
      class="base-dialog"
      :title="dialogTitle+' · 详细信息'"
      :visible.sync="editVisible.basic"
      :fullscreen="true"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-row>
          <el-col :span="6">
            <!-- <el-form-item label="主键">
                    <el-input v-model="form.stationId"></el-input>
            </el-form-item>-->
            <el-form-item label="站点编号" prop="stationCode">
              <el-input v-if="dialogType=='edit'" v-model="form.stationCode" disabled="disabled"></el-input>
              <el-input v-else v-model="form.stationCode"></el-input>
            </el-form-item>

            <!-- <el-form-item label="站点标号" prop="stationCode">
                    <el-input   v-model="form.stationCode" ></el-input>
            </el-form-item>-->
            <el-form-item label="站点名称" prop="stationName">
              <el-input v-model="form.stationName"></el-input>
            </el-form-item>
            <el-form-item label="站点简称" prop="stationSim">
              <el-input v-model="form.stationSim"></el-input>
            </el-form-item>
            <el-form-item label="站点状态" prop="stationStatus">
              <el-select v-model="form.stationStatus">
                <el-option
                  v-for="item in optionsSets.stationStatus"
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
              <el-select v-model="form.operation_id">
                <el-option
                  v-for="item in operationOption"
                  :key="item.operation_id"
                  :label="item.operation_name"
                  :value="item.operation_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="在线标识" prop="onlineFlag">
              <el-select v-model="form.onlineFlag">
                <el-option
                  v-for="item in optionsSets.onlineFlag"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>-->
            <!-- <el-form-item label="对照码" prop="stationIdDZ">
                    <el-input v-model="form.stationIdDZ"></el-input>
            </el-form-item>-->
          </el-col>
          <el-col :span="6">
            <el-row :gutter="5">
              <el-form-item label="经纬度" style="margin-bottom:0;">
                <el-col :span="6.5">
                  <el-form-item prop="stationPositionx">
                    <el-input class="pos-style" v-model="form.stationPositionx"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1">,</el-col>
                <el-col :span="12">
                  <el-form-item prop="stationPositiony">
                    <el-input v-model="form.stationPositiony" class="pos-style"></el-input>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-row>
            <el-form-item label="行政区/街镇" prop="districtStreet">
              <el-cascader :options="options" v-model="form.districtStreet"></el-cascader>
            </el-form-item>
            <!-- <el-form-item label="行政区/街镇">
                    <district-options  :selectedOptions="form.district" @handleChangeOption="handleChangeOption($event)"></district-options>
            </el-form-item>-->
            <el-row :gutter="5">
              <el-form-item label="新增范围坐标">
                <el-col :span="6.5">
                  <el-input class="pos-style" v-model="addPositionX"></el-input>
                </el-col>
                <el-col :span="1">,</el-col>
                <el-col :span="6.5">
                  <el-input v-model="addPositionY" class="pos-style"></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button icon="el-icon-plus" type="primary" circle @click="addPosition"></el-button>
                </el-col>
              </el-form-item>
            </el-row>
            <el-form-item label="噪声点范围">
              <div class="mytags">
                <el-tag
                  v-for="tag in form.stationRange"
                  :key="tag"
                  closable
                  @close="handleClose(tag)"
                >{{tag}}</el-tag>
              </div>
            </el-form-item>
            <el-form-item label=" ">
              <div class="mytags">
                <el-tag>{{form.stationRange[0]?form.stationRange[0]:"空"}}</el-tag>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="国控" prop="countryCon">
              <el-select v-model="form.countryCon">
                <el-option
                  v-for="item in optionsSets.countryCon"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="市控" prop="cityCon">
              <el-select v-model="form.cityCon">
                <el-option
                  v-for="item in optionsSets.cityCon"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="区控" prop="domainCon">
              <el-select v-model="form.domainCon">
                <el-option
                  v-for="item in optionsSets.domainCon"
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
            <el-form-item label="功能区" prop="domain">
              <el-select v-model="form.domain">
                <el-option
                  v-for="item in optionsSets.domain"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="所用协议" prop="protocol">
                    <el-select v-model="form.protocol" >
                        <el-option v-for="item in optionsSets.protocol" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所用协议名称" prop="protocolName">
                    <el-input v-model="form.protocolName"></el-input>
            </el-form-item>-->
          </el-col>
          <el-col :span="5">
            <el-form-item label="站点性质" prop="stationAttribute">
              <el-select v-model="form.stationAttribute">
                <el-option
                  v-for="item in optionsSets.stationAttribute"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主管部门" prop="stationMajor">
              <el-input v-model="form.stationMajor"></el-input>
            </el-form-item>
            <el-form-item label="建站单位" prop="stationSetup">
              <el-input v-model="form.stationSetup"></el-input>
            </el-form-item>
            <el-form-item label="建站日期" prop="stationSetupDate">
              <el-date-picker
                v-model="form.stationSetupDate"
                type="date"
                :picker-options="pickeroption"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="企业代码" prop="companyCode">
              <el-select v-model="form.companyCode">
                <el-option
                  v-for="item in companyOption"
                  :key="item.company_code"
                  :label="item.company_name"
                  :value="item.company_code"
                ></el-option>
              </el-select>
            </el-form-item>
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
            <el-form-item label="是否有雷达数据" prop="radar">
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
import ds_citys from "../../base/city.js";
import areaOptions from "@/components/base/areas.js";
// import func from './vue-temp/vue-editor-bridge';
export default {
  name: "noise",
  components: {
    baseline
  },
  data() {
    return {
      url: {
        getStationsLike: "environment/station/getStationLike", //模糊查询
        getAllStations: "environment/station/findAllStations", //查询所有站点
        addStation: "environment/station/insertstation", //新增站点
        editStation: "environment/station/updatestation", //修改站点
        delStation: "environment/station/deletestation", //删除
        getCompanyOption: "environment/company/getallcompany", //获取企业选项
        getOperationOption: "environment/operation/getalloperation" //获取运维单位选项
      },
      //   ==============下拉模糊查询================   //
      stations: [], //下拉的选择项
      // siteSelectedId:"",
      siteSelected: "", //模糊查询选中的查询结果
      // 行政区的下拉
      areaOptions:areaOptions,
      // 选择的行政区
      selectedArea:"",
      loading: false, //是否正在从远程获取数据
      //数据源
      rawData: [], //源数据
      stationData: [], //表格数据
      currentData: [], //当前页表格数据
      // 翻页
      pageSize: 15,
      currentPage: 1, //翻页页码
      recordSize: 0, //记录总数
      del_list: [],
      editVisible: {
        basic: false, //基础信息
        geo: false, //地理信息
        feature: false, //特征信息
        extra: false //其他信息
      }, //审核框是否可见
      // delVisible: false,
      dialogTitle: "", //对话框标题
      dialogType: "",
      is_del: "",
      addPositionX: "", //新增坐标X
      addPositionY: "", //新增坐标Y
      //   ==============行政区================   //
      options: [],
      //   ==============企业代码================   //
      companyOption: [],
      //   ==============运维单位================   //
      operationOption: [],
      form: {
        // stationId: "",
        stationCode: "",
        stationName: "",
        stationSim: "",
        stationStatus: "",
        application: "",
        operation_id: "",
        // onlineFlag: "",
        // stationIdDZ: "",
        // protocol: "",
        // protocolName: "",
        stationPosition: "",
        stationPositionx: "",
        stationPositiony: "",
        districtStreet: [],
        district: "",
        street: "",
        stationRange: [],
        countryCon: "",
        cityCon: "",
        domainCon: "",
        area: "",
        domain: "",
        stationAttribute: "",
        stationMajor: "",
        stationSetup: "",
        stationSetupDate: "",
        companyCode: "",
        climate: "",
        radar: ""
      },
      //正则校验规则
      rules: {
        // stationId: [
        //   { required: true, message: "请输入站点编号", trigger: "blur" }
        // ],
        stationCode: [
          { required: true, message: "请输入站点标号", trigger: "blur" }
        ],
        stationName: [
          { required: true, message: "请输入站点名称", trigger: "blur" }
        ],
        stationSim: [
          { required: true, message: "请输入站点简称", trigger: "blur" }
          // {
          //   pattern: /[\u4e00-\u9fa5]{4}/,
          //   message: "请输入4位中文",
          //   trigger: "blur"
          // }
        ],
        stationStatus: [
          { required: true, message: "请选择站点状态", trigger: "change" }
        ],
        // application: [
        //   // { required: true, message: "请输入所属应用", trigger: "blur" }
        // ],
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
        cityCon: [
          { required: true, message: "请选择是否市控站点", trigger: "change" }
        ],
        domainCon: [
          { required: true, message: "请选择是否区控站点", trigger: "change" }
        ],
        area: [
          { required: true, message: "请选择区域环境", trigger: "change" }
        ],
        domain: [
          { required: true, message: "请选择功能区", trigger: "change" }
        ],
        stationAttribute: [
          { required: true, message: "请选择站点性质", trigger: "change" }
        ],
        // stationMajor: [
        //   // { required: true, message: "请输入主管部门", trigger: "blur" }
        // ],
        // stationSetup: [
        //   // { required: true, message: "请输入建站单位", trigger: "blur" }
        // ],
        // stationSetupDate: [
        //   // {
        //   //   type: "string",
        //   //   required: true,
        //   //   message: "请选择建站日期",
        //   //   trigger: "change"
        //   // }
        // ],
        // companyCode: [
        //   // { required: true, message: "请选择企业代码", trigger: "blur" }
        // ],
        climate: [
          { required: true, message: "请选择是否有气象数据", trigger: "change" }
        ],
        radar: [
          { required: true, message: "请选择是否有雷达数据", trigger: "change" }
        ]
      },
      //选项预先设置
      optionsSets: {
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
      pickeroption: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      idx: -1
      // reback:true
    };
  },
  filters: {
    stationStatusShow_filter(input) {
      // console.log(input)
      if (input == 1) {
        return "运营";
      }
      return "停运";
    }
  },
  created() {
    //获取选项
    this.options = ds_citys;
  
    this.getStationData();
    //获取企业代码选项+运维单位选项
    this.getCompanyOption();
    this.getOperationOption();
  },
  methods: {
    // 模糊查询获取站点下拉列表
    getStations(key) {
      this.$axios
        .post(this.url.getStationsLike, {
          area:this.selectedArea,
          key: key
        })
        .then(res => {
          this.stations = res.data.stations;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
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
    getOperationOption() {
      this.$axios
        .get(this.url.getOperationOption)
        .then(res => {
          //处理企业代码数据
          let operationData = res.data;
          if (operationData.length == 0) {
            this.$message.warning("获取运维单位信息为空");
            return;
          }

          this.operationOption = operationData;
        })
        .catch(function(error) {
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
        if (this.stationData[i]) {
          this.currentData.push(this.stationData[i]);
        }
      }
    },
    // 获取数据
    getStationData() {
      this.$axios
        .get(this.url.getAllStations)
        .then(res => {
          if (!res.data.length) {
            this.$message.warning("噪声站点查询数据为空");
            return;
          }
          this.stationData = res.data;
          this.rawData = this.clone(this.stationData);
          this.recordSize = this.stationData.length;
          this.currentPage = 1;
          this.initPageList();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //处理新增面板
    handleAdd() {
      //TODO获取最新站点编号
      this.dialogTitle = "新增";
      this.form = {
        // stationId: "",
        stationCode: "",
        stationName: "",
        stationSim: "",
        stationStatus: "",
        application: "",
        operation_id: "",
        // onlineFlag: "",
        // stationIdDZ: "",
        // protocol: "",
        // protocolName: "",
        stationPositionx: "",
        stationPositiony: "",
        districtStreet: [],
        // district:'',
        // street:'',
        stationRange: [],
        countryCon: "",
        cityCon: "",
        domainCon: "",
        area: "",
        domain: "",
        stationAttribute: "",
        stationMajor: "",
        stationSetup: "",
        stationSetupDate: "",
        companyCode: "",
        climate: "",
        radar: ""
      };
      this.addPositionX = ""; //新增坐标X
      this.addPositionY = "";
      // this.form=emptyForm;
      this.dialogType = "add";
      // this.reback = true;
      this.editVisible.basic = true;
    },
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
      //赋值给表单
      this.form={
        stationCode: item.stationCode,
        stationName:item.stationName,
        stationSim: item.stationSim,
        stationStatus: item.stationStatus,
        application: item.application,
        operation_id: item.operation_id,
        stationPositionx: item.stationPosition.split(",")[0],
        stationPositiony: item.stationPosition.split(",")[1],
        districtStreet: [item.district,item.street],
        stationRange: item.stationRange,
        countryCon: item.countryCon,
        cityCon: item.cityCon,
        domainCon: item.domainCon,
        area: item.area,
        domain: item.domain,
        stationAttribute: item.stationAttribute,
        stationMajor: item.stationMajor,
        stationSetup: item.stationSetup,
        stationSetupDate: item.stationSetupDate,
        companyCode:item.companyCode,
        climate: item.climate,
        radar:item.radar
      }
      // this.form = this.clone(item);
      //拼装行政区街道信息
      // this.form.districtStreet = [];
      // this.form.districtStreet.push(item.district);
      // this.form.districtStreet.push(item.street);
      // this.form.stationPositionx = item.stationPosition.split(",")[0];
      // this.form.stationPositiony = item.stationPosition.split(",")[1];
      this.form.stationSetupDate =
        item.stationSetupDate == "1000-01-01 00:00:00.0"
          ? ""
          : item.stationSetupDate;
      //将原始数据存储在本地
      window.sessionStorage.setItem("formSelected", JSON.stringify(this.form));
      // this.reback = true;
      this.editVisible.basic = true;
    },
    //重置查询条件
    clearSelect() {
      //重置筛选条件
      this.siteSelected = "";
      this.selectedArea = "";
    },
    //查询方法
    handleSearch() {
      //判断是否有查询条件
      console.log(this.selectedArea);
      if (this.siteSelected == "" &&( this.selectedArea == ""||this.selectedArea=="*")) {
        console.log("重新查询");
        this.getStationData();
      } else {
        //还原原数据
        this.stationData = this.clone(this.rawData);

        //筛选站点
        let getStation = this.filterData();
        this.stationData = [];
        if (getStation.length == 0) {
          this.$message.warning("当前查询站点不存在");
        }
        this.stationData = getStation;
        this.recordSize = this.stationData.length;
        this.currentPage = 1;
        this.initPageList();
      }
    },
    filterData() {
      return this.stationData.filter(d => {
        if (
          (d.stationCode == this.siteSelected || this.siteSelected == "") &&
          (d.district == this.selectedArea || this.selectedArea == ""||this.selectedArea == "*")
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
          console.log("删除站点" + item.stationCode);
          this.$axios
            .post(this.url.delStation, {
              station_id: item.stationCode
            })
            .then(res => {
              let result = res.data;
              if (result == "success") {
                //TODO提示
                this.$message.success(`删除成功`);
                this.getStationData();
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //保存新增
    saveAdd() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        // if (this.form.stationRange.length == 0) {
        //   this.$message.warning("噪声点范围不可为空");
        // }
        this.$axios
          .post(this.url.addStation, this.getDataToSubmit())
          .then(res => {
            let result = res.data;
            if (result == "success") {
              //TODO提示
              this.$message.success(`添加成功`);
              this.getStationData();
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
    // 新增地理坐标
    addPosition() {
      //判断坐标是否为空
      if (this.addPositionX != "" && this.addPositionY != "") {
        //判断经纬度是否合法
        let regX = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
        let regY = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
        if (!regX.test(this.addPositionX) || !regY.test(this.addPositionY)) {
          this.$message.warning("输入的地理坐标不合法！");
        } else {
          let pos = this.addPositionX + "," + this.addPositionY;
          //判断新增点是否重复
          if (this.form.stationRange.indexOf(pos) < 0) {
            this.form.stationRange.push(pos);
          } else {
            this.$message.warning("该坐标已存在！");
          }
        }
      } else {
        this.$message.warning("输入地理坐标不可为空！");
        return;
      }
    },

    //处理关闭标签
    handleClose(tag) {
      this.form.stationRange.splice(this.form.stationRange.indexOf(tag), 1);
    },
    // 保存编辑
    saveEdit() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        let target = JSON.parse(
          window.sessionStorage.getItem("formSelected") || "[]"
        ).stationCode;
        this.$axios
          .post(this.url.editStation, this.getDataToSubmit(target))
          .then(res => {
            let result = res.data;
            if (result == "success") {
              //TODO提示
              this.$message.success(`编辑成功`);
              this.getStationData();
              // this.reback = false;
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
    // //重置
    // resetForm(formName) {
    //     this.$confirm('所做的更改将不会保留，确认重置?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //         }).then(() => {
    //             // console.log(emptyForm);
    //             this.form={
    //             stationId:'',//站点编号（短号）
    //             stationCode:'',//站点编号
    //             stationName:'',//站点名称
    //             stationPos:'',//站点位置
    //             stationStatus:'',//站点状态
    //             application:'',//所属应用
    //             onlineFlag:'',//在线标识
    //             stationIdDZ:'',//对照码
    //             protocol:'',//所用协议
    //             scope:'',//影响范围
    //             district:[],//行政区/街道
    //             functionZone:''//功能区

    //         };
    //         }).catch(() => {
    //             return;
    //     });
    // },
    //获取提交数据
    getDataToSubmit(target) {
      let addData = this.form;
      //影响范围数据处理
      let rangeArray = "";
      for (let item in addData.stationRange) {
        rangeArray += addData.stationRange[item] + ";";
      }
      rangeArray = rangeArray.substring(0, rangeArray.length - 1);
      var resultData = {
        application: addData.application,
        operationId: addData.operation_id,
        area: addData.area,
        cityCon: addData.cityCon,
        countryCon: addData.countryCon,
        district: addData.districtStreet[0],
        domain: addData.domain,
        domainCon: addData.domainCon,
        stationCode: addData.stationCode,
        stationId: 0,
        stationIdDz: 0,
        stationName: addData.stationName,
        stationStatus: addData.stationStatus,
        stationSim: addData.stationSim,
        onlineFlag: 0,
        protocol: 0,
        protocolName: 0,
        street: addData.districtStreet[1],
        stationMajor: addData.stationMajor,
        stationSetup: addData.stationSetup,
        stationSetupDate: addData.stationSetupDate,
        companyCode: addData.companyCode,
        climate: addData.climate,
        radar: addData.radar,
        stationAttribute: addData.stationAttribute,
        stationPosition:
          addData.stationPositionx + "," + addData.stationPositiony,
        stationRange: rangeArray
      };
      if (typeof target != "undefined") {
        resultData.target = target;
      }
      return resultData;
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
.pos-style {
  width: 102px !important;
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
