<template>
  <div class="base-content base-bg-color">
    <!-- 工具栏 -->
    <div class="tools" style="display:inline">
          <el-select 
            v-model="timeSize" 
            placeholder="请选择时间粒度" 
            @change="handleSelectChange"
            style="width:150px;">
            <el-option label="分钟比较" value="three"></el-option>
            <el-option label="5分钟比较" value="four"></el-option>
            <el-option label="日比较" value="one"></el-option>
            <el-option label="月比较" value="two"></el-option>
          </el-select>
            <el-date-picker
              v-if="timeSize=='one'"
              v-model="dayTime"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOption1"
              placeholder="选择一天"
              style="width:200px;"
            ></el-date-picker>
            <el-date-picker
              v-else-if="timeSize=='two'"
              v-model="monthTime"
              type="month"
              value-format="yyyy-MM"
              :picker-options="pickerOption2"
              placeholder="选择一个月"
              style="width:200px;"
            ></el-date-picker>
            <el-date-picker
              v-else
              v-model="daypart"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOption3"
              placeholder="选择一天"
              style="width:200px;"
            ></el-date-picker>
            <el-time-select
            v-if="timeSize!='one'&& timeSize!='two'"
              v-model="hourpart"
              :picker-options="{
                                start: '00:00',
                                step: '01:00',
                                end: '23:00'
                              }"
              placeholder="选择时间"
              style="width:150px;"
            ></el-time-select>
          <el-button class="base-btn" type="warning" @click="superVisible = true">站点选择</el-button>
          <el-button class="base-btn" type="primary" @click="handleSearch">查询</el-button>
          <el-button
            class="base-btn"
            type="primary"
            @click="settingVisible = true"
            style="float:right"
          >配置</el-button>
      <el-row>
        <el-col :span="24">
          <div class="base-tip" v-if="false">
            <el-tag
              v-for="tag in stationTags"
              :key="tag"
              closable
              type="warning"
              @close="handleTagClose(tag)"
            >{{tag}}</el-tag>
          </div>
          <!-- 图表部分 -->
        </el-col>
      </el-row>
    </div>
    <!-- 配置弹出框 -->
    <el-dialog title="配置数据项" :visible.sync="settingVisible" class="base-dialog">
      <div v-if="timeSize=='one'">
        <el-checkbox
          v-for="item in hourFactor"
          :key="item.norm_name"
          :label="item.norm_name"
          v-model="item.show"
          border
          size="medium"
          class="base-factorCheckBox"
        >{{item.norm_name}}</el-checkbox>
      </div>
      <div v-if="timeSize=='two'">
        <el-checkbox
          v-for="item in dayFactor"
          :key="item.norm_name"
          :label="item.norm_name"
          v-model="item.show"
          border
          size="medium"
          class="base-factorCheckBox"
        >{{item.norm_name}}</el-checkbox>
      </div>
      <div v-if="timeSize=='three'">
        <el-checkbox
          v-for="item in mfactor"
          :key="item.norm_name"
          :label="item.norm_name"
          v-model="item.show"
          border
          size="medium"
          class="base-factorCheckBox"
        >{{item.norm_name}}</el-checkbox>
      </div>
      <div v-if="timeSize=='four'">
        <el-checkbox
          v-for="item in m5factor"
          :key="item.norm_name"
          :label="item.norm_name"
          v-model="item.show"
          border
          size="medium"
          class="base-factorCheckBox"
        >{{item.norm_name}}</el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSetting" class="base-btn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 配置高级搜索 -->
    <div>
      <el-dialog title="高级搜索" :visible.sync="superVisible" class="base-dialog" :fullscreen="true">
        <div class="query-box">
          <el-form ref="from" :model="form" label-width="80px" style="font-size=24px;">
            <el-form-item label="行政区:">
              <el-checkbox
                class="base-checkbox"
                v-model="form.areas_checkedAll"
                @change="handleAreaCheckedAll"
              >全选</el-checkbox>
              <el-checkbox-group v-model="form.areas" @change="handleAreasChange">
                <el-row :gutter="10">
                  <el-col :span="3" v-for="item in area_list" :key="item">
                    <el-checkbox :label="item">{{item}}</el-checkbox>
                  </el-col>
                </el-row>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="功能区">
              <el-checkbox
                class="base-checkbox"
                v-model="form.funcCodes_checkedAll"
                @change="handleFunCodeCheckedAll"
              >全选</el-checkbox>
              <el-checkbox-group v-model="form.funcCodes" @change="handleFunCodeChange">
                <el-row :gutter="10">
                  <el-col :span="3" v-for="item in func_codes_list" :key="item">
                    <el-checkbox class="base-checkbox" :label="item">{{item}}</el-checkbox>
                  </el-col>
                </el-row>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div style="margin-bottom:10px;">
            <el-row>
              <el-col :span="4" :offset="20">
                <el-button
                  @click="getDialogStation"
                  class="base-btn"
                  type="primary"
                  style="float:right"
                >筛选站点</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <div>
          <hr>
        </div>
        <div>
          <el-row :gutter="10">
            <el-checkbox-group v-model="stationTags" @change="handleStationTagsChange">
              <el-col :span="6" :key="item.station_id" v-for="item in dialog_stations">
                <el-checkbox
                  class="checkbox-item"
                  :label="item.station_name"
                  :value="item.station_name"
                >{{item.station_name}}</el-checkbox>
              </el-col>
            </el-checkbox-group>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="superVisible = false" class="base-btn">取 消</el-button>
          <el-button @click="handleStationClean" class="base-btn" type="danger">清 空</el-button>
          <el-button type="primary" @click="handleSearch" class="base-btn">查 询</el-button>
        </span>
      </el-dialog>
    </div>
    <el-row :gutter="10">
      <el-col :span="24">
        <div>
          <baseline></baseline>
          <!--分割线-->
        </div>
        <div>
          <el-table
            v-loading="loading2"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            fit
            :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            row-class-name="base-eltable-bgc"
            border
            :default-sort = "{prop: 'time', order: 'descending'}"
          >
            <el-table-column prop="time" label="时间" :show-overflow-tooltip="true" min-width="110px" sortable>
              <template slot-scope="scope">
                <span v-if="timeSize=='one'">{{ scope.row.time | hourdate }}</span>
                <span v-else-if="timeSize=='two'">{{ scope.row.time | daydate }}</span>
                <span v-else>{{ scope.row.time | mindate }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="station_name" label="站点名称" show-overflow-tooltip="true">
                            <el-table-column prop="station_id" label="站点ID" show-overflow-tooltip="true">
            </el-table-column>-->
            <el-table-column prop="station_Sim" label="站点简称" :show-overflow-tooltip=true min-width="110px"></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              min-width="110px"
              v-for="factor in factors"
              :key="factor.norm_code"
              v-if="factor.show"
              :property="factor.norm_code"
              :label="factor.norm_name"
            ></el-table-column>
          </el-table>
          </div>
          <!-- 分页栏 -->
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[15]"
            :page-size="pageSize"
            layout="total,sizes,prev, pager, next,jumper"
            :total="siteData.count"
          ></el-pagination>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="factors">
          <!-- <factortitle style="width:200px;float:left;"></factortitle> -->
          <div class="factorBtn">
            <el-button
              v-for="factor in factors"
              :key="factor.norm_name"
              v-if="factor.show"
              size="small"
              type="danger"
              plain
              v-on:click="handleChartFactorChange(factor.norm_code)"
            >{{factor.norm_name}}</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <div id="compare1"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import factortitle from "../../base/factorTitle.vue";
import baseline from "../../base/baseline.vue";
import "../../../../theme/purple-passion.js";
export default {
  name: "compare1",
  components: {
    baseline,
    factortitle
  },
  data() {
    return {
      title: "多站点同一时间监测因子对比",
      // url: {
      //   allfactors: "./static/compare1testjson/allfactors.json", //获取全部偏好
      //   dayType: "./static/compare1testjson/dayType.json", // 日比较
      //   monthType: "./static/compare1testjson/monthType.json", // 日比较
      //   dialogStations: "./static/compare1testjson/stations.json", //对话框中的站点列表
      //   funcCodes:"./static/compare1testjson/funcCode.json" //功能区编号
      // },
      url: {
        allfactors: "/environment/norm/querynorm", //获取全部偏好
        dayType: "/environment/data/getmanyhdatabystationanddate", // 日比较
        monthType: "/environment/data/getmanyddatabystationanddate", // 月比较
        mType: "/environment/data/getmanyMdatabystationanddate",
        m5Type: "/environment/data/getmanyM5databystationanddate",
        dialogStations: "/environment/station/getStationsByAreasAndFuncCodes", //对话框中的站点列表
        funcCodes: "/environment/station/getfunc" //功能区编号
      },
      //   ================以经选择的站点===============  //
      stationTags: [], //已经选择的站点name
      stationIds: [], // station_id
      stationNum: {
        //站点个数限制
        maxNum: 4,
        minNum: 2
      },
      timeSize: "three", // one-日比较 two-月比较 three-分钟 four-5分钟
      dayTime: "",
      monthTime: "",
      daypart: "",
      hourpart: "",
      pickerOption1: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      pickerOption2: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      pickerOption3: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      //   ==================配置======================  //
      settingVisible: false,
      checkFactors: [], //用户偏好
      // ==================高级搜索====================== //
      superVisible: false, //打开高级搜索对话框
      area_list: [
        "黄浦区",
        "徐汇区",
        "长宁区",
        "静安区",
        "普陀区",
        "虹口区",
        "杨浦区",
        "闵行区",
        "宝山区",
        "嘉定区",
        "浦东区",
        "金山区",
        "松江区",
        "青浦区",
        "奉贤区",
        "崇明区"
      ], //行政区划分
      func_codes_list: [], //需要从数据库获取
      form: {
        areas: [], //行政区选择列表
        areas_checkedAll: false, //是否全选
        funcCodes: [], //功能区
        funcCodes_checkedAll: false //是否全选
      },
      dialog_stations: [], //对话框中的站点列表
      dialog_stations_checked: [], //在高级搜索下选择的站点id
      // =============表格数据========== //
      siteData: [], //表格数据
      siteNum: {
        //站点个数限制
        maxNum: 4,
        minNum: 2
      },
      // 翻页
      pageSize: 15,
      currentPage: 1, //翻页页码
      //=================================//
      tbTitle: "多站点监测因子对比表",
      allfactors: {}, //选择的监测因子

      chartOption: {}, //echarts配置项
      tableData: [],
      // ===========用户偏好========
      hourFactor: [],
      dayFactor: [],
      m5factor: [],
      mfactor: [],
      settingVisible: false, //点开配置对话框
      timeout: 60 * 1000,
      tbTtitle: "多站点监测因子对比",
      loading2: false, //正在加载数据
    };
  },
  filters: {
        mindate:function(input){
          let arr = input.split(":")
          // console.log(arr)
          return arr[1]
        },
        hourdate:function(input){
          let arr = input.split(":")
          // console.log(arr)
          return arr[0]
        },
        daydate:function(input){
          var d = new Date(input);
          var year = d.getFullYear();
          var month = d.getMonth() + 1;
          var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
          var hour = d.getHours();
          var minutes = d.getMinutes();
          var seconds = d.getSeconds();
          // return  year+ '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
          return day
        }
      },
  computed: {
    factors: function() {
      switch (this.timeSize) {
        case "one":
          return this.hourFactor;
          break;
        case "two":
          return this.dayFactor;
          break;
        case "three":
          return this.mfactor;
          break;
        case "four":
          return this.m5factor;
          break;
        default:
          break;
      }
    },
    defaulttag: function() {
      if(this.factors.length==0){
        return ""
      }
      let obj = this.factors.find(item => {
        return item.show == true;
      });
      return obj.norm_code;
    },
    mtime: function() {
      return this.daypart + " " + this.hourpart;
    }
  },
  mounted() {
    // this.getTime();
    this.init();
    // 获取功能区代码
    this.getFuncCode();
    //   获取用户偏好
    // this.getSiteData();
    this.getCheckFactors();
    // this.interval=setInterval(this.reFlash,this.timeout);//一分钟刷新一次
  },
  // beforeDestroy(){
  //   clearInterval(this.interval);//销毁定时器删除定时器
  // },
  watch: {
    hourFactor: {
      handler(val, oldVal) {
        window.localStorage.setItem("compare1hour", JSON.stringify(val));
      },
      deep: true // 深度监视，只有这样才能监视成员内部的变化
    },
    dayFactor: {
      handler(val, oldVal) {
        window.localStorage.setItem("compare1day", JSON.stringify(val));
      },
      deep: true // 深度监视，只有这样才能监视成员内部的变化
    },
    m5factor: {
      handler(val, oldVal) {
        window.localStorage.setItem("compare1m5", JSON.stringify(val));
      },
      deep: true
    },
    mfactor: {
      handler(val, oldVal) {
        window.localStorage.setItem("compare1m", JSON.stringify(val));
      },
      depp: true
    }
  },
  methods: {
    handleSelectChange(){
      this.hourpart = "";
      this.dayTime = "";
      this.monthTime = "";
      this.daypart = "";
      this.hourpart = "";
      this.siteData = [];
      this.tableData = [];
    },
    showInfo() {
      this.$confirm("查询数据为空, 重新选择条件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {});
    },
    getTime() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let time = y + "-" + m + "-" + d;
      this.dayTime = time;
      this.daypart = time;
      time = y + "-" + m;
      this.monthTime = time;
    },
    // 获取功能区的分类编号
    getFuncCode() {
      this.$axios.get(this.url.funcCodes).then(res => {
        if (!res.data) {
          this.showInfo();
          return;
        }
        this.func_codes_list = res.data.funcCodes; //获取功能区代码
      });
    },
    handdleJude() {
      if (
        (!this.dayTime  && this.timeSize == "one") ||
        (!this.monthTime&& this.timeSize == "two") ||
        (!this.daypart && (this.timeSize == "three" || this.timeSize == "four"))
      ) {
        this.$message({
          message: `请先选择一天`,
          type: "warning"
        });
        return true;
      }
      else if(this.daypart&& !this.hourpart){
        this.$message({
          message: `请选择时间`,
          type: "warning"
        });
        return true
      }
      else if (this.stationTags.length < this.siteNum.minNum) {
        this.$message({
          message: `至少选择${this.siteNum.minNum}个站点`,
          type: "warning"
        });
        return true;
      }
      return false;
    },
    // 获取表格信息
    getSiteData() {
      let url = "";
      let time = "";
      switch (this.timeSize) {
        case "one":
          url = this.url.dayType;
          time = this.dayTime.slice(0, 13);
          break;
        case "two":
          url = this.url.monthType;
          time = this.monthTime.slice(0, 13);
          break;
        case "three":
          url = this.url.mType;
          time = this.mtime.slice(0, 13);
          break;
        case "four":
          url = this.url.m5Type;
          time = this.mtime.slice(0, 13);
          break;
        default:
          break;
      }
      this.loading2 = true;
      this.$axios
        .post(url, {
          query: {
            stations: this.stationIds,
            time: time
          }
        })
        .then(res => {
          if (!res.data) {
            this.showInfo();
            this.loading2 = false;
            return;
          }
          this.siteData = res.data.stationData;
          let tmp = [];
          for (let i = 0; i < this.siteData.datas.length; i++) {
            tmp = tmp.concat(this.siteData.datas[i].data);
          }
          this.tableData = tmp;
          this.initChartOption();
          this.setChartOption();
          this.paintChart();
          this.loading2 = false;
        });
    },
    // 获取用户偏好
    getCheckFactors() {
      this.$axios
        .get(this.url.allfactors)
        .then(res => {
          if (!res.data) {
            this.showInfo();
            return;
          }
          this.allfactors = res.data; //获取总的因子
          let hour_tmp = JSON.parse(
            window.localStorage.getItem("compare1hour") || "[]"
          );
          if (hour_tmp.length == 0) {
            for (let i = 0; i < this.allfactors["hfactors"].length; i++) {
              let obj = this.allfactors["hfactors"][i];
              obj.show = true;
              hour_tmp.push(obj);
            }
          }
          this.hourFactor = hour_tmp;

          let day_tmp = JSON.parse(
            window.localStorage.getItem("compare1day") || "[]"
          );
          if (day_tmp.length == 0) {
            for (let i = 0; i < this.allfactors["dfactors"].length; i++) {
              let obj = this.allfactors["dfactors"][i];
              obj.show = true;
              day_tmp.push(obj);
            }
          }
          this.dayFactor = day_tmp;

          let m_tmp = JSON.parse(
            window.localStorage.getItem("compare1m") || "[]"
          );
          if (m_tmp.length == 0) {
            for (let i = 0; i < this.allfactors["mfactors"].length; i++) {
              let obj = this.allfactors["mfactors"][i];
              obj.show = true;
              m_tmp.push(obj);
            }
          }
          this.mfactor = m_tmp;

          let m5_tmp = JSON.parse(
            window.localStorage.getItem("compare1m5") || "[]"
          );
          if (m5_tmp.length == 0) {
            for (let i = 0; i < this.allfactors["mfactors"].length; i++) {
              let obj = this.allfactors["m5factors"][i];
              obj.show = true;
              m5_tmp.push(obj);
            }
          }
          this.m5factor = m5_tmp;
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    // =================处理高级搜索============== //
    // 获取对话框中的站点信息
    getDialogStation() {
      let _this = this;
      _this.$axios
        .post(this.url.dialogStations, {
          query: _this.form
        })
        .then(res => {
          if (!res.data.stations.length) {
            this.showInfo();
            return;
          }
          this.dialog_stations = res.data.stations;
        });
    },
    // area
    handleAreaCheckedAll(val) {
      this.form.areas_checkedAll = val; // 改变全选的状态
      this.form.areas = val ? this.area_list : []; // 如果是全选就为全部列表，如果不是全选就制空
    },
    handleAreasChange(val) {
      let checkedCount = val.length; //选择的数量
      this.form.areas_checkedAll = checkedCount === this.area_list.length; //选择数量等于选项长度的时候就设置为全选
    },
    // funcCode
    handleFunCodeCheckedAll(val) {
      this.form.funcCodes_checkedAll = val; // 改变全选的状态
      this.form.funcCodes = val ? this.func_codes_list : []; // 如果是全选就为全部列表，如果不是全选就制空
    },
    handleFunCodeChange(val) {
      let checkedCount = val.length; //选择的数量
      this.form.funcCodes_checkedAll =
        checkedCount === this.func_codes_list.length; //选择数量等于选项长度的时候就设置为全选
    },
    // 当选择的站点发生变化的时候
    handleStationTagsChange(val) {
      if (val.length > this.siteNum.maxNum) {
        this.$alert(
          `已经达到选择的上限，${this.siteNum.maxNum}个站点`,
          "提示",
          {
            confirmButtonText: "确定"
          }
        );
        this.stationTags.pop(); //移除多选的那个站点
        return;
      }
    },
    // 将站点名称转换为站点id
    handleStationNameToId() {
      if (this.stationTags.length == 0) {
        return;
      }
      this.stationIds = [];
      for (let i = 0; i < this.stationTags.length; i++) {
        let obj = this.dialog_stations.find(item => {
          return item.station_name == this.stationTags[i];
        });
        if (obj && !this.stationIds.includes(obj.station_id)) {
          this.stationIds.push(obj.station_id);
        }
      }
    },
    //===================end==================== //
    // 情况选择的所有站点
    handleStationClean() {
      this.$confirm("确认是否清空已选站点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "返回",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "清空所选站点!"
          });
          this.stationTags = [];
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 查询所选站点的信息
    handleSearch() {
      if (this.handdleJude()) {
        return;
      }
      this.handleStationNameToId();
      this.getSiteData();
      this.superVisible = false;
    },
    // 删除标签
    handleTagClose(tag) {
      this.stationTags.splice(this.stationTags.indexOf(tag), 1);
      // let obj = this.dialog_stations.find(item=>{
      //     return item.station_name == tag
      //   });
      //   console.log(obj)
      // this.stationIds.splice(this.stationIds.indexOf(obj.station_id), 1);
      // console.log(this.stationIds);
    },
    // ===============chart=================//
    // 切换监测因子
    handleChartFactorChange(val) {
      this.setChartOption(val);
      this.paintChart();
    },
    init(){//让echarts窗口自适应
      const self = this;//因为箭头函数会改变this指向，指向windows。所以先把this保存
      var chart = document.getElementById("compare1");
        setTimeout(() => {
          window.onresize = function() {
              self.myChart = self.$echarts.init(chart, "purple-passion");
              self.myChart.resize();
          }
        },20)
    }, 
    paintChart() {
      var chart = document.getElementById("compare1");
      //必须设置chart容器的宽度和高度
      var resizeContainer = function() {
        //屏幕宽度
        let w = window.innerWidth;
        //屏幕高度
        let h = window.innerHeight;
        chart.style.width = "98%";
        chart.style.height = h * 0.36 + "px";
      };
      resizeContainer();
      this.myChart = this.$echarts.init(chart, "purple-passion");
      this.myChart.setOption(this.chartOption, true);
    },
    //初始化 chartOption
    initChartOption() {
      this.chartOption = {
        color: [],
        title: {
          // left:'center'
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "3%",
          containLabel: true
        },
        legend: {
          data: []
        },
        xAxis: {
          name: "",
          data: []
        },
        yAxis: {
          name: "数值",
          min: function(value) {
            return (value.min - 10).toFixed(2);
          },
          max: function(value) {
            return (value.max + 10).toFixed(2);
          },
          axisTick: {
            length: 3
          }
        },
        series: []
      };
    },
    //根据当前数据情况设置 chartOption
    setChartOption(tagid = this.defaulttag) {
      let data = this.siteData.datas;
      //图例名称
      this.chartOption.legend.data = this.stationTags;

      let obj = this.factors.find(item => {
        return item.norm_code == tagid;
      });
      this.chartOption.title.text = `${obj.norm_name}对比图`;
      //x轴坐标
      switch (this.timeSize) {
        case "one":
          this.chartOption.xAxis.data = [];
          //X轴名称
          this.chartOption.xAxis.name = "小时";
          for (let i = 0; i < 24; i++) {
            this.chartOption.xAxis.data.push(i);
          }
          break;
        case "two":
          this.chartOption.xAxis.data = [];
          //X轴名称
          this.chartOption.xAxis.name = "天";
          for (let i = 1; i <= 31; i++) {
            this.chartOption.xAxis.data.push(i);
          }
          break;
        case "four":
          this.chartOption.xAxis.data = [];
          //X轴名称
          this.chartOption.xAxis.name = "分钟";
          for (let i = 0; i <= 55; i = i + 5) {
            this.chartOption.xAxis.data.push(i);
          }
          break;
        case "three":
          this.chartOption.xAxis.data = [];
          //X轴名称
          this.chartOption.xAxis.name = "分钟";
          for (let i = 1; i <= 59; i++) {
            this.chartOption.xAxis.data.push(i);
          }
          break;
        default:
          break;
      }

      //数据名称
      this.chartOption.series = [];
      for (let i = 0; i < data.length; i++) {
        let obj = {
          name: data[i].data[0]["station_Sim"],
          type: "line",
          data: []
        };
        for (let j = 0; j < data[i].data.length; j++) {
          obj.data.push(data[i].data[j][tagid]);
        }
        this.chartOption.series.push(obj);
      }
    },
    // 用户喜好设置
    handleSetting() {
      if (this.siteData.length == 0) {
        this.$message({
          message: "请先加载数据",
          type: "info"
        });
        this.settingVisible = false;
        return;
      }
      this.initChartOption();
      this.setChartOption();
      this.paintChart();
      this.settingVisible = false;
    },
    // 刷新页面
    reFlash() {
      this.getFuncCode();
      this.getCheckFactors();
      this.getSiteData();
    },
    // 处理页码变化
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style scoped>
.el-tag {
  font-size: 20px;
  margin-right: 10px;
  margin-top: 5px;
}
.checkbox-item {
  font-size: 24px;
}
.factorCheckBox {
  margin-left: 10px;
  margin-top: 20px;
  width: 180px;
}
.el-table {
  margin-top: 15px;
}
.factors {
  margin-top: 2px;
}
#compare1 {
  margin-top: 2px;
}
</style>

