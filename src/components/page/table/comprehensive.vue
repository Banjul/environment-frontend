<template>
    <div class="base-content base-bg-color">
      <el-row>
      <div style="display:inline">
          <el-select v-model="m" style="width:130px;" @change="requestData">
            <el-option
              v-for="item in m_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="c" style="width:90px;" @change="requestData">
            <el-option
            v-for="item in c_options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="s" style="width:90px;" @change="requestData">
            <el-option
            v-for="item in s_options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="o" style="width:130px;" @change="requestData">
            <el-option
            v-for="item in o_options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
          <el-cascader :options="options" v-model="street" @change="requestData" style="width:210px;"></el-cascader>
          <!-- <el-select v-model="street" style="width:150px;" @change="requestData" placeholder="街道">
            <el-option
              >
            </el-option>
          </el-select> -->

          <el-button class="base-btn" type="primary" v-on:click="dayMinus" style="margin-left:10px;">
            前
          </el-button>
          <el-date-picker
            v-model="dayValue"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="pickerOption"
            style="width:260px">
          </el-date-picker>
          <el-button class="base-btn" type="primary" v-on:click="dayPlus">
            后
          </el-button>
          <el-select
            v-model="station_code"
            filterable
            remote
            reserve-keyword
            clearable
            placeholder="关键词"
            :remote-method="getStations"
            style="width:220px; margin-left:10px;">
            <el-option
              v-for="item in stations"
              :key="item.station_id"
              :label="item.sim"
              :value="item.station_id">
            </el-option>
          </el-select>
          <el-button
          @click="handleQuery"
          class="base-btn"
          type="primary">查询</el-button>
      </div>
    </el-row>
        <!-- <el-row id="header">
          <el-col :span="4">
            <div>
              <el-select v-model="area_id">
                <el-option
                  v-for="area in areas"
                  :key="area.id"
                  :label="area.value"
                  :value="area.id">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="2">
            <div>
              <el-button class="base-btn" type="primary" v-on:click="handleQuery">
                查询
              </el-button>
            </div>
          </el-col>
        </el-row> -->
      <!--分割线-->
      <baseline></baseline>
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          border
          style="100%"
          row-class-name="base-eltable-bgc"
          :data="sitesData">
          <el-table-column
            label="站点简称"
            align="center"
            width="150px">
            <template slot-scope="scope">
              <el-button v-if="scope.row.sim != ''"
                         type="text"
                         style="color:#4b91ed;font-size:18px"
                         v-on:click="handleClickStationName(scope.$index, scope.row)">
                         {{scope.row.sim}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="校准值"
            align="center">
            <template slot-scope="scope">
              <!-- 最新一条小时数据校准值的 flag不为 QC时，需红色显示 -->
              <div v-if="scope.row.flag != 'QC'" style="color:#ff0000">
                {{scope.row.calibration_value}}
              </div>
              <div v-else>
                {{scope.row.calibration_value}}
              </div>
            </template>
          </el-table-column>
          <!-- 实时数据 -->
          <el-table-column
            label="实时数据"
            align="center">
            <el-table-column
              prop="latest_time"
              label="最新时间"
              align="center"
              width="200px">
            </el-table-column>
            <el-table-column
              prop="count_r"
              label="数量"
              align="center">
            </el-table-column>
            <el-table-column
              prop="LA"
              label="LA"
              align="center">
            </el-table-column>
            <el-table-column
              prop="LEQ"
              label="LEQ"
              align="center">
            </el-table-column>
            <el-table-column
              prop="LMX"
              label="LMX"
              align="center">
            </el-table-column>
          </el-table-column>
          <!-- 小时数据 -->
          <el-table-column
            label="小时数据"
            align="center">
            <el-table-column
              prop="latest_time_h"
              label="最新时间"
              align="center"
              width="200px">
            </el-table-column>
            <el-table-column
              prop="count_h"
              label="数量"
              align="center">
            </el-table-column>
            <el-table-column
              prop="effective_rate_h"
              label="有效率"
              align="center">
            </el-table-column>
            <el-table-column
              prop="LEQ_h"
              label="LEQ"
              align="center">
            </el-table-column>
            <el-table-column
              prop="LMX_h"
              label="LMX"
              align="center">
            </el-table-column>
          </el-table-column>
          <!-- 日数据 -->
          <el-table-column
            label="日数据"
            align="center">
            <el-table-column
              prop="Ld"
              label="Ld"
              align="center">
            </el-table-column>
            <el-table-column
              prop="effective_rate_Ld"
              label="有效率"
              align="center">
            </el-table-column>
            <el-table-column
              prop="Ln"
              label="Ln"
              align="center">
            </el-table-column>
            <el-table-column
              prop="effective_rate_Ln"
              label="有效率"
              align="center">
            </el-table-column>
            <el-table-column
              prop="Lnm"
              label="Lnm"
              align="center">
            </el-table-column>
          </el-table-column>
        </el-table>
        <!-- 表格分页 -->
        <el-pagination background
             @current-change="handleCurrentChange"
             :current-page="currentPage"
             :page-sizes="[10]"
             :page-size="pageSize"
             layout="total, sizes, prev, pager, next, jumper"
             :total="total">
         </el-pagination>
    </div>
</template>

<script>
import baseline from "../../base/baseline.vue";
import ds_citys from "../../base/city.js";
export default {
  name: "realtime",
  components: {
    baseline
  },
  data() {
    return {
      title: "实时数据查询",
      // url_real: './static/realTimeTestJson/sitesDataReal.json',
      // url_hour: './static/realTimeTestJson/sitesDataHour.json',
      // url_day: './static/realTimeTestJson/sitesDataDay.json',
      url_real: 'environment/data/querymDataByStationsArea',
      url_hour: 'environment/data/queryhDataByStationsArea',
      url_day: 'environment/data/querydDataByStationsArea',
      options: [],
      station_code: '',
      street: [],
      urlStations: '',
      // url_stations: './static/realTimeTestJson/stations.json',
      loading: false,
      area_id: 0,
      areas: [
        {
          "id": 0,
          "value": "功能区0"
        },
        {
          "id": 1,
          "value": "功能区1"
        },
        {
          "id": 2,
          "value": "功能区2"
        },
        {
          "id": 3,
          "value": "功能区3"
        },
        {
          "id": 4,
          "value": "功能区4"
        },
        {
          "id": 5,
          "value": "全部功能区"
        }
      ],
      m:'all_m',
      m_options:[
          {
          value:"all_m",
          label:"监测定位"
        },
        {
          value:"功能区",
          label:"功能区"
        },
        {
          value:"区域环境",
          label:"区域环境"
        },
        {
          value:"道路交通",
          label:"道路交通"
        }
      ],
      c:'all_c',
      c_options:[
          {
          value:"all_c",
          label:"归属"
        },
        {
          value:"国控",
          label:"国控"
        },{
          value:"市控",
          label:"市控"
        },{
          value:"区控",
          label:"区控"
        }
      ],
      s:'all_s',
      s_options:[
           {
          value:"all_s",
          label:"状态"
        },
        {
          value:"在线",
          label:"在线"
        },{
          value:"离线",
          label:"离线"
        }
      ],
      o:'all_o',
      o_options:[
           {
          value:"all_o",
          label:"监测方式"
        },
        {
          value:"手动",
          label:"手动"
        },{
          value:"自动",
          label:"自动"
        },{
          value:"流动",
          label:"流动"
        }
      ],
      street: '',
      realInitValue : {
        "latest_time": "",
        "count_r": "",
        "LA": "",
        "LEQ": "",
        "LMX": ""
      },
      hourInitValue : {
        "calibration_value": "",
        "flag": "",
        "latest_time_h": "",
        "count_h": "",
        "effective_rate_h": "",
        "LEQ_h": "",
        "LMX_h": ""
      },
      sitesDataReal: [],
      sitesDataHour: [],
      sitesDataDay: [],
      sitesData: [],
      sitesList: [],
      stations: [],
      pageSize: 15,
      currentPage: 1,
      total: 0,
      dayValue: '',
      dayOffset: 0,
      pickerOption: {
        disabledDate(time) {
          let curDate = (new Date()).getTime()
          // 这里算出一个月的毫秒数,这里使用30的平均值,实际中应根据具体的每个月有多少天计算
          let day = 3 * 30 * 24 * 3600 * 1000;
          let dateRegion = curDate - day;
          return (time.getTime() > Date.now() + 8.64e6) || (time.getTime() < dateRegion)
        }
      },
      timerReal: null,      //实时数据请求定时器
      timerHour: null,      //小时数据请求定时器
      timerDay: null        //日数据请求定时器
    };
  },
  created(){
    //行政区街道级联选项
    this.options = ds_citys;
    //系统当前日期
    this.getSystemTime();
    //触发查询
    this.requestData();
  },
  //关闭页面时销毁定时器
  beforeDestroy() {
    //如果定时器还在运行就直接关闭
    if(this.timerReal) {
        clearInterval(this.timerReal); //关闭
    }
    if(this.timerHour) {
        clearInterval(this.timerHour);
    }
    if(this.timerDay) {
        clearInterval(this.timerDay);
    }
  },
  methods:{
    //模糊查询站点
    getStations(key) {
      this.$axios.post(this.urlStations, {
          "key": key
        })
        .then(res => {
          this.stations = res.data.stations;
        });
    },
    //前一日
    dayMinus(){
      // this.dayValue = new Date(new Date(this.dayValue).getTime() - 86400000)
      this.dayOffset = -1;
      this.requestData();
      this.dayOffset = 0;
    },
    //后一日
    dayPlus(){
      // this.dayValue = new Date(new Date(this.dayValue).getTime() + 86400000)
      this.dayOffset = 1;
      this.requestData();
      this.dayOffset = 0;
    },
    //获取当前日期
    getSystemTime(){
      let systemDate = new Date();
      let systemTimeYear = systemDate.getFullYear();
      let systemTimeMonth = systemDate.getMonth() + 1;
      let systemTimeDate = systemDate.getDate();
      this.dayValue = systemTimeYear + "-" + systemTimeMonth + "-" + systemTimeDate;
    },
    //请求数据
    requestData(){
      this.loading = true;
      //实时数据
      this.$axios.post(this.url_real, {
          "m": this.m,
          "c": this.c,
          "s": this.s,
          "o": this.o,
          "street": this.street,
          "time": this.dayValue,
          "offset": this.dayOffset,
          "each_page_num": this.pageSize,
          "current_page": this.currentPage
      }).then((res) => {
          this.sitesDataReal = res.data.sitesDataReal.data;
          this.total = parseInt(res.data.sitesDataReal.count);
          //小时数据
          this.$axios.post(this.url_hour, {
            "m": this.m,
            "c": this.c,
            "s": this.s,
            "o": this.o,
            "street": this.street,
            "time": this.dayValue,
            "offset": this.dayOffset,
            "each_page_num": this.pageSize,
            "current_page": this.currentPage
          }).then((res) => {
              this.sitesDataHour = res.data.sitesDataHour.data;
              //日数据
              this.$axios.post(this.url_day, {
                "m": this.m,
                "c": this.c,
                "s": this.s,
                "o": this.o,
                "street": this.street,
                "time": this.dayValue,
                "offset": this.dayOffset,
                "each_page_num": this.pageSize,
                "current_page": this.currentPage
              }).then((res) => {
                  this.sitesDataDay = res.data.sitesDataDay.data;
                  this.loading = false;
                  //this.dayValue = res.data.sitesDataDay.time;
                  this.combineData();
              });
          });
      });
    },
    //定时请求
    // requestInterval(){
    //   //实时数据
    //   this.timerReal = setInterval(() => {
    //     this.$axios.get(this.url_real, {
    //       query: {
    //         area_id: this.area_id,
    //         each_page_num: this.pageSize,
    //         current_page: this.currentPage
    //       }
    //     }).then((res) => {
    //         this.sitesDataReal = res.data.sitesDataReal.data;
    //         this.total = parseInt(res.data.sitesDataReal.count);
    //         this.combineData();
    //     });
    //   }, 60000);
    //   //小时数据
    //   this.timerHour = setInterval(() => {
    //     this.$axios.get(this.url_hour, {
    //       query: {
    //         area_id: this.area_id,
    //         each_page_num: this.pageSize,
    //         current_page: this.currentPage
    //       }
    //     }).then((res) => {
    //         this.sitesDataHour = res.data.sitesDataHour.data;
    //         this.combineData();
    //     });
    //   }, 3600000);
    //   //日数据
    //   this.timerDay = setInterval(() => {
    //     this.$axios.get(this.url_day, {
    //       query: {
    //         area_id: this.area_id,
    //         each_page_num: this.pageSize,
    //         current_page: this.currentPage
    //       }
    //     }).then((res) => {
    //         this.sitesDataDay = res.data.sitesDataDay.data;
    //         this.combineData();
    //     });
    //   }, 86400000);
    // },
    //组合数据
    combineData(){
      //先清空旧数据
      this.sitesData = [];
      //实时数据没接收完就令 10条为空
      // if(this.sitesDataReal.length == 0){
      //   this.sitesDataReal = [];
      //   for(let i=0; i<this.pageSize; i++){
      //     this.sitesDataReal.push(this.realInitValue);
      //   }
      // }
      //小时数据没接收完就令 10条为空
      // if(this.sitesDataHour.length == 0){
      //   this.sitesDataHour = [];
      //   for(let i=0; i<this.pageSize; i++){
      //     this.sitesDataHour.push(this.hourInitValue);
      //   }
      // }
      //组合数据
      for(let i=0; i<this.pageSize; i++){
        var currentSiteData = Object.assign(this.sitesDataReal[i], this.sitesDataHour[i], this.sitesDataDay[i]);
        this.sitesData.push(currentSiteData);
      }
      //没有数据则提示
      if(this.sitesData.length == 0){
        this.$alert('暂无数据', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
        });
        return;
      }
    },
    //查询数据
    handleQuery(){
      //页码重置为 1
      this.currentPage = 1;
      this.requestData();
    },
    //页码变化
    handleCurrentChange(val){
      //页码切换
      this.currentPage = val;
      this.requestData();
    },
    //点击站点名跳转到【单站点查询页面】
    //传参：station_code
    handleClickStationName(index, row){
      this.$router.push({
        path:"/singlepage",
        query: { station_code: row.station_code , station_name: row.station_name, status:1}
      });
    }
  }
};
</script>

<style scoped>
.el-table{
  margin-top: 15px;
}
</style>
