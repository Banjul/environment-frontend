<template>
    <div class="base-content base-bg-color">
        <el-row id="header">
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
        </el-row>
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
             :page-sizes="[15]"
             :page-size="pageSize"
             layout="total, sizes, prev, pager, next, jumper"
             :total="total">
         </el-pagination>
    </div>
</template>

<script>
import baseline from "../../base/baseline.vue";
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
      // url_stations: './static/realTimeTestJson/stations.json',
      loading: false,
      area_id: 5,
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
      pageSize: 15,
      currentPage: 1,
      total: 0,
      timerReal: null,      //实时数据请求定时器
      timerHour: null,      //小时数据请求定时器
      timerDay: null        //日数据请求定时器
    };
  },
  created(){
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
    //请求数据
    requestData(){
      this.loading = true;
      //实时数据
      this.$axios.post(this.url_real, {
          "area_id": this.area_id,
          "each_page_num": this.pageSize,
          "current_page": this.currentPage
      }).then((res) => {
          this.sitesDataReal = res.data.sitesDataReal.data;
          this.total = parseInt(res.data.sitesDataReal.count);
          //小时数据
          this.$axios.post(this.url_hour, {
              "area_id": this.area_id,
              "each_page_num": this.pageSize,
              "current_page": this.currentPage
          }).then((res) => {
              this.sitesDataHour = res.data.sitesDataHour.data;
              //日数据
              this.$axios.post(this.url_day, {
                  "area_id": this.area_id,
                  "each_page_num": this.pageSize,
                  "current_page": this.currentPage
              }).then((res) => {
                  this.sitesDataDay = res.data.sitesDataDay.data;
                  this.loading = false;
                  this.combineData();
              });
          });
      });
      //this.requestInterval();
    },
    //定时请求
    requestInterval(){
      //实时数据
      this.timerReal = setInterval(() => {
        this.$axios.get(this.url_real, {
          query: {
            area_id: this.area_id,
            each_page_num: this.pageSize,
            current_page: this.currentPage
          }
        }).then((res) => {
            this.sitesDataReal = res.data.sitesDataReal.data;
            this.total = parseInt(res.data.sitesDataReal.count);
            this.combineData();
        });
      }, 60000);
      //小时数据
      this.timerHour = setInterval(() => {
        this.$axios.get(this.url_hour, {
          query: {
            area_id: this.area_id,
            each_page_num: this.pageSize,
            current_page: this.currentPage
          }
        }).then((res) => {
            this.sitesDataHour = res.data.sitesDataHour.data;
            this.combineData();
        });
      }, 3600000);
      //日数据
      this.timerDay = setInterval(() => {
        this.$axios.get(this.url_day, {
          query: {
            area_id: this.area_id,
            each_page_num: this.pageSize,
            current_page: this.currentPage
          }
        }).then((res) => {
            this.sitesDataDay = res.data.sitesDataDay.data;
            this.combineData();
        });
      }, 86400000);
    },
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
