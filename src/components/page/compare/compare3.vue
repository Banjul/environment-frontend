<template>
    <div class="base-content base-bg-color">
        <div >
            <!-- 工具栏 -->
                <el-row>
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
                    <!--选择查看的日期-->
                    <el-col :span="5">
                        <el-date-picker
                            v-model="dateSelected"
                            type="date"
                            :picker-options="pickeroption"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-col>
                    <!--操作按钮-->
                    <el-col :span=1>
                        <el-button class="base-btn" type="primary" @click="handleSearch">查询</el-button>
                    </el-col>

                </el-row>
            <baseline></baseline> <!--分割线-->
                <!-- 表格展示 -->
                <!-- <tabletitle>{{tbTtitle}}</tabletitle> -->
                <el-table :data="currentData" border row-class-name="base-eltable-bgc"  :default-sort = "{prop: 'time', order: 'descending'}">
                    <el-table-column prop="time" label="时间" width="150" sortable >
                    </el-table-column>
                    <el-table-column
                        v-for="factor in checkFactors"
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
                <el-row>
                <el-col :span=24>
                <!-- <factortitle style="width:150px;float:left;"></factortitle> -->
              
                </el-col>

                </el-row> 
                <el-row>
                    <!-- 图标部分 -->
                    <el-col :span=24>
                        <div id="compare3"></div>
                    </el-col>
                </el-row>
        </div>
    </div>
</template>

<script>
// import tabletitle from "../../../common/tableTitle.vue";
// import factortitle from "../../base/factorTitle.vue";
import baseline from "../../base/baseline.vue";
import "../../../../theme/purple-passion.js";
import areaOptions from "@/components/base/areas.js";
export default {
  name: "compare3",
  components: {
    baseline
    // tabletitle,
    // factortitle
  },
  data() {
    return {
      url: {
        getStationsLike: "environment/station/getStationLike", //下拉站点
        checkFactors: "environment/norm/querynorm",
        siteData: "environment/data/getddatabystationanddate"
      },
      title: "单站点日监测数据对比",

      //   ==============下拉模糊查询================   //
      stations: [], //下拉的选择项
      siteSelectedId:"",
      siteSelected: "", //模糊查询选中的查询结果
      // 行政区的下拉
      areaOptions:areaOptions,
      // 选择的行政区
      selectedArea:"",
      loading: false, //是否正在从远程获取数据
      stationId: "", // station_id
      //   ==============日期选择================   //
      dateSelected: "",
      pickeroption:{
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      //   =============表格数据=============   //
      checkFactors: [
        {
          norm_name: "LeqA",
          norm_code: "n00006"
        },
        {
          norm_name: "昼阈值",
          norm_code: "dlimit"
        },
        {
          norm_name: "夜阈值",
          norm_code: "nlimit"
        }
      ], //用户查看的监控因子

      //获取到的原始数据
      rawData: {},
      siteData: [], //表格数据
      currentData: [], //当前页表格数据
      // 翻页
      pageSize: 15,
      currentPage: 1, //翻页页码
      recordSize: "", //记录总数
      // ===========柱状图============== //
      chartOption: {}//echarts配置项
    };
  },
  computed: {
    tbTtitle() {
      if (this.siteSelected == "") {
        return "站点日监测数据";
      }
      return this.siteSelected + "站点" + this.dateSelected + "日监测数据表";
    }
  },
  mounted() {
    //初始化图表
    this.init();
    this.getCheckFactors();
    //获取初始化参数
    // this.getInitData();
    //获取站点数据
    // this.handleSearch();
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
    //获取用户关注指标
    getCheckFactors() {
      // 获取用户偏好
      this.$axios.get(this.url.checkFactors).then(res => {
        // this.checkFactors = res.data.hfactors;
        // this.checkFactors=this.facorsTemplate;
        // console.log(this.checkFactors);
      }).catch(function(error) {
          console.log(error);
        });
    },
    //预处理请求参数
    getInitData() {
      if (
        null == this.$route.query.station ||
        "undefined" == typeof this.$route.query.station ||
        "" == this.$route.query.station
      ) {
      } else {
        this.siteSelected = this.$route.query.station;
        this.dateSelected =
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate();
      }
    },
    // dataInit(sData){
    //   //按时间倒序排列
    //   sData.sort(function(a,b){
    //     console.log(a.time<b.time);
    //       return !(a.time- b.time);//时间正序
    //   });
    //   return sData;
    // },
    getSiteData() {
      console.log("获取站点数据");
      console.log(this.siteSelected);
      this.$axios
        .post(this.url.siteData, {
          query: {
            station: this.siteSelected, //选择的站点
            date: this.dateSelected //选中日期
            // station: "31010702330051", //选择的站点
            // date: "2018-10-27"//选中日期
          }
        })
        .then(res => {
          console.log(res.data);
          if(res.data!=""){
             this.rawData = res.data;
          // console.log(res.data);
          this.siteData =res.data.data_list;
          // this.siteSelected = res.data.station_name; //获取返回站点名
          // this.dateSelected = res.data.date; //获取返回日期
          // 初始化表格
          // console.log(this.siteData);
          this.initPageList();
          this.initChartOption("line");
          this.setChartOption();
          this.paintChart();
          }else{
             
             this.$message({
          message: `所选站点暂无数据`,
          type: "warning"
        });
        //查询为空后清空数据表
          // this.rawData = res.data;
          // this.siteData =res.data.data_list;
          // this.initPageList();
          }
         
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //查询方法
    handleSearch() {
      //1.判断查询条件是否完整
      if (this.siteSelected == "" ||this.dateSelected == "" ||this.dateSelected == null ) {

        this.$message({
          message: `请选择站点和日期之后再查询`,
          type: "warning"
        });
        return;
      } 
      
      this.getSiteData();
    },
    // 初始化表格数据
    initPageList() {
      this.currentData = [];
      for (
        let i = (this.currentPage - 1) * this.pageSize;
        i < this.currentPage * this.pageSize;
        i++
      ) {
        if (this.siteData[i]) {
          this.currentData.push(this.siteData[i]);
        }
      }
    },
    //切换页码方法
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initPageList();
    },
    init(){//让echarts窗口自适应
      const self = this;//因为箭头函数会改变this指向，指向windows。所以先把this保存
      var chart = document.getElementById("compare3");
        setTimeout(() => {
          window.onresize = function() {
              self.myChart = self.$echarts.init(chart, "purple-passion");
              self.myChart.resize();
          }
        },20)
    }, 
    // ===============chart=================//
    paintChart() {
      var chart = document.getElementById("compare3");
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
      this.myChart.setOption(this.chartOption);
    },
    //初始化 chartOption
    initChartOption(chartType) {
      //根据监控因子数量初始化
      let mySeries = [];
      for (let i = 0; i < this.checkFactors.length; i++) {
        let singleSerie = {
          name: "",
          type: chartType,
          data: []
        };
        mySeries.push(singleSerie);
      }
      this.chartOption = {
        color: [],
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
          name: "数值"
        },
        series: mySeries
      };
    },
    //根据当前数据情况设置 chartOption
    setChartOption(tagName = "LeqA") {
      //加载图表名称
      this.chartOption.title.text ='昼夜对比图';
      let data = this.siteData;
      let factorNames = [];
      console.log(this.checkFactors);
      for (let i = 0; i < this.checkFactors.length; i++) {
        factorNames.push(this.checkFactors[i].norm_name);
      }
      console.log(factorNames);
      this.chartOption.legend.data = factorNames;
      //图例名称

      //X、Y轴
      this.chartOption.xAxis.name = "小时";
      this.chartOption.xAxis.data = [];
      for (let i = 0; i < data.length; i++) {
        this.chartOption.xAxis.data.push(data[i].time);
      }
      //数据加载
      for (let n = 0; n < factorNames.length; n++) {
        //初始化数据名称、内容
        this.chartOption.series[n].name = factorNames[n];
        this.chartOption.series[n].data = [];
        for (let m = 0; m < data.length; m++) {
          let factorCode = this.checkFactors[n].norm_code.toString();
          this.chartOption.series[n].data.push(data[m][factorCode]);
        }
      }
    },
    //显示错误提示
    showResultInfo(info) {
      this.$confirm(info + "查询数据为空 ", "提示", {
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
/* .handle-box {
  margin-bottom: 10px;
}

.el-row {
  margin-top: 20px;
} */

.el-table {
  margin-top: 15px;
}

.factorCheckBox {
  margin-left: 10px;
  margin-top: 20px;
  width: 180px;
}

</style>
