<template>
    <div class="base-content base-bg-color">
        <div class="tools" style="display:inline">
          <el-select v-model="selectedArea" clearable placeholder="行政区" style="width:150px;">
            <el-option
              v-for="item in areaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
            :label="item.station_name"
            :value="item.station_id">
            </el-option>
          </el-select>
            <el-select 
              v-model="timeSize" 
              placeholder="请选择时间粒度" 
              @change="handleSelectChange"
              style="width:150px;"
              >
                <el-option
                    label="5分钟数据"
                    value="three">
                </el-option>
                <el-option
                    label="日比较"
                    value="one">
                </el-option>
                <el-option
                    label="月比较"
                    value="two">
                </el-option>
            </el-select>
                <el-date-picker
                    v-if="timeSize=='one'"
                    v-model="timeRange1.time1"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOption1"
                    placeholder="选择一天"
                    style="width:175px;">
                    </el-date-picker>
                    <span style="color:#fff" v-if="timeSize == 'two'">&</span>
                    <el-date-picker
                    v-if="timeSize=='one'"
                    v-model="timeRange1.time2"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOption2"
                    placeholder="选择一天"
                    style="width:175px;">
                </el-date-picker>
                <el-date-picker
                    v-if="timeSize == 'two'"
                    v-model="timeRange2.time1"
                    type="month"
                    value-format="yyyy-MM"
                    placeholder="选择月份"
                    style="width:150px;">
                    </el-date-picker>
                    <span style="color:#fff" v-if="timeSize == 'two'">&</span>
                    <el-date-picker
                    v-if="timeSize == 'two'"
                    v-model="timeRange2.time2"
                    type="month"
                    value-format="yyyy-MM"
                    placeholder="选择月份"
                    style="width:150px;">
                </el-date-picker>
                <el-date-picker
                      v-if="timeSize !='one' && timeSize!='two'"
                      v-model="daypart"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOption1"
                      placeholder="选择一天"
                      style="width:175px;">
                    </el-date-picker > 
                    <span v-if="timeSize !='one' && timeSize!='two'">|</span>
                    <el-time-select
                    v-if="timeSize!='one' && timeSize!='two'"
                      v-model="hourpart2"
                      :picker-options="{
                        start: '00:00',
                        step: '01:00',
                        end: '23:00'
                      }"
                      placeholder="选择时间"
                      style="width:150px;">
                    </el-time-select>
                    <span style="color:#fff" v-if="timeSize!='one' && timeSize!='two'">&</span>
                    <el-time-select
                      v-if="timeSize!='one' && timeSize!='two'"
                      v-model="hourpart1"
                      :picker-options="{
                        start: '00:00',
                        step: '01:00',
                        end: '23:00'
                      }"
                      placeholder="选择时间"
                      style="width:150px;">
                    </el-time-select>
        <!-- <el-col :span=2>
            <el-button class="base-btn" type="warning" @click="superVisible = true" >高级搜索</el-button>
        </el-col> -->
            <el-button class="base-btn" type="primary" @click="handleSearch">查询</el-button>
            <el-button class="base-btn" type="primary" @click="settingVisible = true" style="float:right">配置</el-button>
        </div>
        <div>
            <!-- 配置弹出框 -->
            <el-dialog title="配置数据项" :visible.sync="settingVisible" class="base-dialog">
                <div v-if="timeSize=='one'">
                <el-checkbox
                    v-for="item in hfactors"
                    :key="item.norm_code"
                    :label="item.norm_name"
                    v-model="item.show"
                    border
                    size="medium"
                    class="base-factorCheckBox"
                    >
                    {{item.norm_name}}
                </el-checkbox>
                </div>
                <div v-if="timeSize=='two'">
                <el-checkbox
                    v-for="item in dfactors"
                    :key="item.norm_code"
                    :label="item.norm_name"
                    v-model="item.show"
                    border
                    size="medium"
                    class="base-factorCheckBox"
                    >
                    {{item.norm_name}}
                </el-checkbox>
                </div>
                <div v-if="timeSize=='three'">
                <el-checkbox
                    v-for="item in m5factors"
                    :key="item.norm_code"
                    :label="item.norm_name"
                    v-model="item.show"
                    border
                    size="medium"
                    class="base-factorCheckBox"
                    >
                    {{item.norm_name}}
                </el-checkbox>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleSetting" class="base-btn">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <el-row :gutter=10>
            <el-col :span=24>
                <div>
                     <baseline></baseline> <!--分割线-->
                </div>
                <!-- 表格展示 -->
                <div class="base-table">
                    <el-table
                    v-loading="loading2"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)" 
                      fit
                      :default-sort = "{prop: 'time', order: 'descending'}"
                    :data="siteData.slice((currentPage-1)*pageSize,currentPage*pageSize)" border row-class-name="base-eltable-bgc">
                        <el-table-column label="时间" prop="time" :show-overflow-tooltip="true" sortable min-width="110px">
                          <template slot-scope="scope">
                
                          <span v-if="timeSize=='one'">{{ scope.row.time | hourdate }}</span>
                          <span v-else-if="timeSize=='two'">{{ scope.row.time | daydate }}</span>
                          <span v-else>{{ scope.row.time | mindate }}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                            min-width="110px"
                            :show-overflow-tooltip="true"
                            v-for="factor in factors"
                            v-if="factor.show"
                            :key="factor.norm_code"
                            :property="factor.norm_code"
                            :label="factor.norm_name">
                        </el-table-column>
                    </el-table>
                    <!-- 分页栏 -->
                    <el-pagination background
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[15]"
                        :page-size="pageSize"
                        layout="total,sizes,prev, pager, next,jumper"
                        :total="rawData.count">
                    </el-pagination>
                </div>
                <div class="factors">
                    <!-- <factortitle style="width:200px;float:left"></factortitle> -->
                    <div>
                        <el-button
                            v-for="factor in factors"
                            :key="factor.norm_code"
                            v-if="factor.show"
                            size="small"
                            type="danger"
                            plain
                            v-on:click="handleChartFactorChange(factor.norm_code)">
                        {{factor.norm_name}}
                        </el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter=10>
            <el-col :span=24>
                <!-- echarts -->
                <div id="compare2"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import baseline from "../../base/baseline.vue";
import factortitle from "../../base/factorTitle.vue";
import "../../../../theme/purple-passion.js";
import areaOptions from "@/components/base/areas.js";
export default {
  name: "compare2",
  components: {
    baseline,
    factortitle
  },
  data() {
    return {
      areaOptions:areaOptions,
      title: "单站点不同时间段监测因子对比图",
      // url: {
      //   stations: "./static/compare2testjson/siteOptions.json",
      //   checkFactors: "./static/compare2testjson/factor.json",
      //   siteDataDay:"./static/compare2testjson/siteDataDay.json",
      //   siteDataYear: "./static/compare2testjson/siteDataYear.json",
      //   siteDataMonth: "./static/compare2testjson/siteDataMonth.json",
      //   allfactors:"./static/compare2testjson/allfactors.json"
      // },
      url: {
        stations: "/environment/station/getStationLike",
        // checkFactors: "/environment/norm/querynorm",
        siteDataDay: "/environment/data/getStationsDataByDays",
        siteDatam5: "/environment/data/getM5StationsData",
        siteDataMonth: "/environment/data/getStationsData",
        allfactors: "/environment/norm/querynorm"
      },
      //   ==============下拉模糊查询================   //
      stations: [], //下拉的选择项
      siteSelected: "", //模糊查询选中的查询结果
      loading: false, //是否正在从远程获取数据
      //   ==============下拉模糊查询================   //
      //   =============== 时间粒度 ============== //
      timeSize: "three",
      timeRange1: {
        //日粒度
        time1: "",
        time2: ""
      },
      timeRange2: {
        //月粒度
        time1: "",
        time2: ""
      },
    //   timeRange3: {
    //     //5分钟粒度
    //     time1: "",
    //     time2: ""
    //   },
      hourpart1:"",
      hourpart2:"",
      daypart:"",
      pickerOption1:{
        disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6;
          }
      },
      pickerOption2:{
        disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6;
          }
      },
      //   ==================配置======================  //
      allfactors: {},
      hfactors: [],
      dfactors: [],
      m5factors: [],
      settingVisible: false,
      checkFactors: [], //用户偏好
      //================站点数据相关================//
      //获取到的原始数据
      rawData: {},
      // 翻页
      pageSize: 15,
      currentPage: 1, //翻页页码
      // ===========柱状图============== //
      chartOption: {}, //echarts配置项

      loading2:false, // 正在加载数据
      selectedArea:"*",//选择的行政区
    };
  },
  filters: {
        mindate:function(input){
          let arr = input.split(":")
          console.log(arr)
          return arr[1]
        },
        hourdate:function(input){
          let arr = input.split(":")
          console.log(arr)
          return arr[1]
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
    tbTtitle() {
      if (this.siteSelected == "") {
        return "站点监测因子对比";
      }
      let obj = this.stations.find(item => {
        return (item.station_id = this.siteSelected);
      });
      return (
        obj.station_name +
        "站点" +
        this.timeRange.time1 +
        "~" +
        this.timeRange.time2 +
        "监测因子对比"
      );
    },
    siteData() {
      try {
        return this.rawData.time1.data.concat(this.rawData.time2.data);
      } catch (e) {
        return [];
      }
    },
    timeRange3(){
        let time1 = this.daypart + " " + this.hourpart1.substr(0,2);
        let time2 = this.daypart + " " + this.hourpart2.substr(0,2);
        return {
            "time1":time1,
            "time2":time2
        }
    },
    timeRange() {
      switch (this.timeSize) {
        case "one":
          return this.timeRange1;
          break;
        case "two":
          return this.timeRange2;
          break;
        case "three":
          return this.timeRange3;
          break;
        default:
          break;
      }
    },
    factors() {
      switch (this.timeSize) {
        case "one":
          return this.hfactors;
          break;
        case "two":
          return this.dfactors;
          break;
        case "three":
          return this.m5factors;
          break;
        default:
          break;
      }
    },
    defaulttag: function() {
      if(this.factors.length == 0){
        return ""
      } 
      let obj = this.factors.find(item => {
        return item.show == true;
      });
      return obj.norm_code;
    }
  },
  watch: {
    hfactors: {
      handler(val, oldVal) {
        window.localStorage.setItem("compare2hour", JSON.stringify(val));
      },
      deep: true // 深度监视，只有这样才能监视成员内部的变化
    },
    dfactors: {
      handler(val, oldVal) {
        window.localStorage.setItem("compare2day", JSON.stringify(val));
      },
      deep: true // 深度监视，只有这样才能监视成员内部的变化
    },
    m5factors: {
      handler(val, oldVal) {
        window.localStorage.setItem("compare2m5", JSON.stringify(val));
      },
      deep: true // 深度监视，只有这样才能监视成员内部的变化
    }
  },
  mounted() {
    // 获取所有的监测因子
    this.getAllFactors();
    this.init();
    // 获取表格信息
    // this.getSiteData();
  },
  methods: {
    handleSelectChange(){
      this.timeRange1 = {
        //日粒度
        time1: "",
        time2: ""
      };
      this.timeRange2 = {
        //月粒度
        time1: "",
        time2: ""
      };
      this.hourpart1 = "";
      this.hourpart2 = "";
      this.daypart = "";
      this.rawData = [];
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
    //   模糊查询获取站点下拉列表
    getStations(key) {
      this.$axios
        .post(this.url.stations, {
          area:this.selectedArea,
          key: key
        })
        .then(res => {
          this.stations = res.data.stations;
        });
    },
    // 获取所有的喜好
    getAllFactors() {
      this.$axios.get(this.url.allfactors).then(res => {
        if(!res.data){
          this.showInfo()
          return
        }
        this.allfactors = res.data;
        let hour_tmp = JSON.parse(
          window.localStorage.getItem("compare2hour") || "[]"
        );
        if (hour_tmp.length == 0) {
          for (let i = 0; i < this.allfactors["hfactors"].length; i++) {
            let obj = this.allfactors["hfactors"][i];
            obj.show = true;
            hour_tmp.push(obj);
          }
        }
        this.hfactors = hour_tmp;

        let day_tmp = JSON.parse(
          window.localStorage.getItem("compare2day") || "[]"
        );
        if (day_tmp.length == 0) {
          for (let i = 0; i < this.allfactors["dfactors"].length; i++) {
            let obj = this.allfactors["dfactors"][i];
            obj.show = true;
            day_tmp.push(obj);
          }
        }
        this.dfactors = day_tmp;

        let m5_tmp = JSON.parse(
          window.localStorage.getItem("compare2m5") || "[]"
        );
        if (m5_tmp.length == 0) {
          for (let i = 0; i < this.allfactors["m5factors"].length; i++) {
            let obj = this.allfactors["m5factors"][i];
            obj.show = true;
            m5_tmp.push(obj);
          }
        }
        this.m5factors = m5_tmp;

      });
    },
    // 判断数据是否为空
    IsQueryEmpty() {
      console.log(this.timeRange)
      if (
        !this.siteSelected  ||
        !this.timeRange.time1  ||
        !this.timeRange.time2 
      ) {
        this.$message({
          message: `请选择一个站点和一组时间范围之后点击查询`,
          type: "warning"
        });
        return true;
      } else {
        return false;
      }
    },
    // 获取站点表格数据
    IsTimeEqual() {
      if (this.timeRange.time1 == this.timeRange.time2) {
        this.$message({
          message: "请选择不同的时间",
          type: "warning"
        });
        return true;
      }
      return false;
    },
    getSiteData() {
      let url = "";
      if (this.timeSize == "one") {
        url = this.url.siteDataDay;
      } else if (this.timeSize == "two") {
        url = this.url.siteDataMonth;
      } else if (this.timeSize == "three") {
        url = this.url.siteDatam5;
      }
      this.loading2 = true;
      this.$axios
        .post(url, {
          station_id: this.siteSelected, //选择的站点
          timeRange: this.timeRange
        })
        .then(res => {
          if(!res.data){
            this.showInfo()
            return
          }
          this.rawData = res.data;
          // 初始化表格
          this.initChartOption();
          this.setChartOption();
          this.paintChart();
          this.loading2 = false;
        });
    },

    // 处理时间粒度改变
    handleTimeSizeChange() {
      this.timeRange1 = {
        //日粒度
        time1: "",
        time2: ""
      };
      this.timeRange2 = {
        //月粒度
        time1: "",
        time2: ""
      };
      this.timeRange3 = {
        //年粒度
        time1: "",
        time2: ""
      };
    },
    // =================处理高级搜索============== //
    // area
    handleAreaCheckedAll(val) {
      this.form.areas_checkedAll = val; // 改变全选的状态
      this.form.areas = val ? this.area_list : []; // 如果是全选就为全部列表，如果不是全选就制空
    },
    handleAreasChange(val) {
      let checkedCount = val.length; //选择的数量
      this.form.areas_checkedAll = checkedCount === this.area_list.length; //选择数量等于选项长度的时候就设置为全选
    },
    // typecode
    handleTypeCodeCheckedAll(val) {
      this.form.type_codes_checkedAll = val;
      this.form.type_codes = val ? this.type_code_list : [];
    },
    handleTypeCodeChange(val) {
      let checkedCount = val.length; // 选择的数量
      this.form.type_codes_checkedAll =
        checkedCount === this.type_code_list.length;
    },
    // control code
    handleControlCodeCheckedAll(val) {
      this.form.control_codes_checkedAll = val;
      this.form.control_codes = val ? this.control_code_list : [];
    },
    handleControlCodeChange(val) {
      let checkedCount = val.length; // 选择的数量
      this.form.control_codes_checkedAll =
        checkedCount === this.control_code_list.length;
    },
    // flow code
    handleFlowCodeCheckedAll(val) {
      this.form.flow_codes_checkedAll = val;
      this.form.flow_codes = val ? this.flow_code_list : [];
    },
    handleFlowCodeChange(val) {
      let checkedCount = val.length; // 选择的数量
      this.form.flow_codes_checkedAll =
        checkedCount === this.flow_code_list.length;
    },
    // online code
    handleOnlineCodeCheckedAll(val) {
      this.form.online_codes_checkedAll = val;
      this.form.online_codes = val ? this.online_code_list : [];
    },
    handleOnlineCodeChange(val) {
      let checkedCount = val.length; // 选择的数量
      this.form.online_codes_checkedAll =
        checkedCount === this.online_code_list.length;
    },

    // 查询
    handleSearch() {
      if (this.IsQueryEmpty()) {
        return;
      }
      if (this.IsTimeEqual()) {
        return;
      }
      this.getSiteData();
    },
    // 分页导航
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
    },
    // ===============chart=================//
    // 切换监测因子
    handleChartFactorChange(val) {
      this.setChartOption(val);
      this.paintChart();
    },
    init(){//让echarts窗口自适应
      const self = this;//因为箭头函数会改变this指向，指向windows。所以先把this保存
      var chart = document.getElementById("compare2");
        setTimeout(() => {
          window.onresize = function() {
              self.myChart = self.$echarts.init(chart, "purple-passion");
              self.myChart.resize();
          }
        },20)
    }, 
    paintChart() {
      var chart = document.getElementById("compare2");
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
      this.myChart.setOption(this.chartOption,true);
    },
    //初始化 chartOption
    initChartOption() {
      this.chartOption = {
        title: {
          text: ""
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
          axisTick:{
            length:3
          }
        },
        series: [
          {
            name: "",
            type: "line",
            data: []
          },
          {
            name: "",
            type: "line",
            data: []
          }
        ]
      };
    },
    //根据当前数据情况设置 chartOption
    setChartOption(tagName = this.defaulttag) {
      let time1 = this.rawData.time1.time;
      let time2 = this.rawData.time2.time;
      let data1 = this.rawData.time1.data;
      let data2 = this.rawData.time2.data;
      // this.chartOption.color.push("red");
      //标题
      let obj = this.factors.find(item=>{
          return item.norm_code == tagName;
        });
      this.chartOption.title.text = `${obj.norm_name}对比图`;
      //图例名称
      this.chartOption.legend.data = [time1, time2];
      // x轴
      if (this.timeSize == "one") {
        // x轴名称
        this.chartOption.xAxis.name = "小时";
        //x轴坐标
        this.chartOption.xAxis.data = [];
        for (let i = 0; i <= 23; i++) {
          this.chartOption.xAxis.data.push(i);
        }
      } else if (this.timeSize == "two") {
        // x轴名称
        this.chartOption.xAxis.name = "天";
        //x轴坐标
        this.chartOption.xAxis.data = [];
        for (let i = 1; i <= 31; i++) {
          this.chartOption.xAxis.data.push(i);
        }
      } else {
        // x轴名称
        this.chartOption.xAxis.name = "分钟";
        //x轴坐标
        this.chartOption.xAxis.data = [];
        for (let i = 0; i <= 55; i+=5) {
          this.chartOption.xAxis.data.push(i);
        }
      }
      //数据名称
      this.chartOption.series[0].name = time1;
      //数据内容
      this.chartOption.series[0].data = [];
      for (let i = 0; i < data1.length; i++) {
        this.chartOption.series[0].data.push(data1[i][tagName]);
      }
      //数据名称
      this.chartOption.series[1].name = time2;
      //数据内容
      this.chartOption.series[1].data = [];
      for (let i = 0; i < data2.length; i++) {
        // console.log(time2.data[i][tagName])
        this.chartOption.series[1].data.push(data2[i][tagName]);
      }
      // // 动态计算刻度
      // let max_num =
      //   Math.max.apply(Math, this.chartOption.series[0]) >
      //   Math.max.apply(Math, this.chartOption.series[1])
      //     ? Math.max.apply(Math, this.chartOption.series[0])
      //     : Math.max.apply(Math, this.chartOption.series[1]);
      // let min_num =
      //   Math.min.apply(Math, this.chartOption.series[0]) <
      //   Math.min.apply(Math, this.chartOption.series[1])
      //     ? Math.min.apply(Math, this.chartOption.series[0])
      //     : Math.min.apply(Math, this.chartOption.series[1]);
      // this.chartOption.yAxis.min = min_num - 10;
      // this.chartOption.yAxis.max = max_num + 10;
    },
    // 刷新
    reFlash() {
      this.getAllFactors();
      this.getSiteData();
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
      this.setChartOption();
      this.paintChart();
      this.settingVisible = false;
    }
  }
};
</script>

<style scoped>
.tools {
  /* margin-top: 20px; */
}
.el-table {
  margin-top: 15px;
}
.factorCheckBox {
  margin-left: 10px;
  width: 180px;
}
.factors {
  margin-top: 5px;
}
#compare2 {
  margin-top: 10px;
}
</style>

