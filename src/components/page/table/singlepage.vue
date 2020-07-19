<template>
    <div class="base-content base-bg-color">
      <el-row>
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
             v-model="station_code"
             filterable
             remote
             reserve-keyword
             clearable
             placeholder="关键词"
             :loading="loading"
             :remote-method="getStations"
             @change="handleStationChange"
             style="width:220px;">
             <el-option
               v-for="item in stations"
               :key="item.station_id"
               :label="item.sim"
               :value="item.station_id">
             </el-option>
           </el-select>
           <el-select v-model="dataType" placeholder="数据类型" @change="handleDataTypeChange" style="width:180px;">
             <el-option v-for="item in dataTypes" :key="item.id" :label="item.type" :value="item.id">
             </el-option>
           </el-select>
           <el-button class="base-btn" type="primary" v-on:click="handleQueryData">
             查询
           </el-button>
          <el-date-picker
            class="dp"
            v-if="dataType == 4"
            v-model="monthValue"
            type="month"
            format="yyyy 年 MM 月"
            value-format="yyyy-MM"
            placeholder="选择月"
            :picker-options="pickerOption2"
            style="width:280px">
          </el-date-picker>
          <el-date-picker
            v-else
            class="dp"
            v-model="dayValue"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="pickerOption1"
            style="width:280px">
          </el-date-picker>
          <div v-if="dataType == 3" class="inline">
            <span>
              <el-button class="base-btn" type="primary" v-on:click="dayMinus">
                前一天
              </el-button>
            </span>
            <span>
              <el-button class="base-btn" type="primary" v-on:click="dayPlus">
                后一天
              </el-button>
            </span>
          </div>
          <div v-else-if="dataType == 4" class="inline">
            <span>
              <el-button class="base-btn" type="primary" v-on:click="monthMinus">
                前一月
              </el-button>
            </span>
            <span>
              <el-button class="base-btn" type="primary" v-on:click="monthPlus">
                后一月
              </el-button>
            </span>
          </div>
          <div v-else class="inline">
            <span>
              <el-button class="base-btn" type="primary" v-on:click="hourMinus">
                前一小时
              </el-button>
            </span>
            <span>
              <el-select v-model="hourValue" size="small" style="width:120px">
                <el-option
                  v-for="hour in hours"
                  :key="hour.id"
                  :label="hour.value"
                  :value="hour.id">
                </el-option>
              </el-select>
            </span>
            <span>
              <el-button class="base-btn" type="primary" v-on:click="hourPlus">
                后一小时
              </el-button>
            </span>
          </div>
          <div v-if="dataType != 1" class="inline lcvml">
            <span class="lcv">
              最新一条校准值{{latest_calibration_value}}
            </span>
          </div>
          <div style="float:right">
            <el-button v-if="dataType != 4" class="base-btn" type="primary" v-on:click="handleConfigDataType" style="float:right">
              配置
            </el-button>
          </div>
        </div>
        <!-- </el-col> -->
      </el-row>
    <baseline></baseline> <!--分割线-->
      <!-- 表格切换 -->
      <keep-alive>
        <component v-bind:is="dataTable"
                   :siteData="siteData"
                   :dataType="dataType"
                   :factorsAll="factorsAll"
                   :currentPage="currentPage"
                   :pageSize="pageSize"
                   :loading="loading">
        </component>
      </keep-alive>
      <el-pagination
           v-if="dataType == 1"
           background
           @current-change="handleCurrentChange"
           :current-page="currentPage"
           :page-sizes="[15]"
           :page-size="pageSize"
           layout="total, sizes, prev, pager, next, jumper"
           :total="total">
       </el-pagination>

       <!-- 配置数据项对话框 -->
       <el-dialog title="配置数据项" :visible.sync="configFactorVisible" class="base-dialog">
         <template>
           <div>
               <el-checkbox
                  v-for="factor in factorsAll"
                  v-model="factor.show"
                  v-if="factor.norm_code != 'n00100'"
                  :key="factor.norm_code"
                  border
                  size="medium"
                  class="base-factorCheckBox">
                  {{factor.norm_name}}
               </el-checkbox>
           </div>
         </template>
         <div slot="footer" class="dialog-footer">
           <!-- <el-button @click="configFactorVisible = false">取 消</el-button> -->
           <el-button type="primary" @click="configFactorVisible = false">确 定</el-button>
         </div>
       </el-dialog>
       <!-- chart中监测因子切换 -->
       <el-row id="factorSelect">
         <!-- <el-col :span="2">
           <factortitle></factortitle>
         </el-col> -->
         <el-col :span="24" style="margin-left:15px">
           <div v-if="this.dataType !=4">
             <el-button
                v-for="factor in factorsAll"
                v-if="factor.show == true"
                :key="factor.norm_code"
                size="small"
                type="danger"
                plain
                v-on:click="handleChartFactorChange(factor.norm_code, factor.norm_name)">
               {{factor.norm_name}}
             </el-button>
           </div>
           <div v-else>
             <el-button
                v-for="factor in factorsDay"
                :key="factor.norm_code"
                size="small"
                type="danger"
                plain
                v-on:click="handleChartFactorChange(factor.norm_code, factor.norm_name)">
               {{factor.norm_name}}
             </el-button>
           </div>
         </el-col>
       </el-row>
       <div id="chart"></div>
    </div>
</template>

<script>
import baseline from "../../base/baseline.vue";
import datatable from "./dataTable.vue";
import datatableday from "./dataTableDay.vue";
import city from "./city.vue"
import areaOptions from "@/components/base/areas.js";
// import factorsAllDay from "./factorsAllDay.js"
import bus from "@/components/layout/bus.js";
export default {
  name: "singlepage",
  components: {
    baseline,
    datatable,
    datatableday,
    city
  },
  data() {
    return {
      title: '单站点信息查询',

      urlData: 'environment/data/queryDataByStationIdAndDatetime',  //站点数据
      urlAllFactors: "/environment/norm/querynorm", //获取全部监测因子
      urlStations: '/environment/station/getStationLike', //模糊查询站点

      areaOptions: areaOptions,  //全部行政区
      selectedArea: '',
      dataType: 1,
      dataTable: 'datatable',
      latest_calibration_value: '',
      hourValue: 0,     //小时偏移
      dayOffset: 0,     //日偏移
      monthOffset: 0,     //月偏移
      dayValue: '',     //日
      monthValue: '',   //月
      requestTime: '',  //时间参数
      station_code: '',
      siteData: [],
      factorsAll: [],   //当前数据类型下所有的监测因子
      chartOption: {},
      systemTimeYear: '',
      systemTimeMonth: '',
      systemTimeDate: '',
      systemTimeHour: '',
      systemTimeMinute: '',
      configFactorVisible: false,
      loading: false,
      factorsDay: [
        {
          norm_code: "n00008",
          norm_name: "Ld平均值"
        },
        {
          norm_code: "n00009",
          norm_name: "Ln平均值"
        },
        {
          norm_code: "n00007",
          norm_name: "Ldn平均值"
        }
      ],
      dataTypes: [
        {
          id: 1,
          type: '实时数据'
        },
        {
          id: 2,
          type: '5分钟数据'
        },
        {
          id: 3,
          type: '小时数据'
        },
        {
          id: 4,
          type: '日数据'
        }
      ],
      hours: [
        {
          id: 0,
          value: '0:00'
        },
        {
          id: 1,
          value: '1:00'
        },
        {
          id: 2,
          value: '2:00'
        },
        {
          id: 3,
          value: '3:00'
        },
        {
          id: 4,
          value: '4:00'
        },
        {
          id: 5,
          value: '5:00'
        },
        {
          id: 6,
          value: '6:00'
        },
        {
          id: 7,
          value: '7:00'
        },
        {
          id: 8,
          value: '8:00'
        },
        {
          id: 9,
          value: '9:00'
        },
        {
          id: 10,
          value: '10:00'
        },
        {
          id: 11,
          value: '11:00'
        },
        {
          id: 12,
          value: '12:00'
        },
        {
          id: 13,
          value: '13:00'
        },
        {
          id: 14,
          value: '14:00'
        },
        {
          id: 15,
          value: '15:00'
        },
        {
          id: 16,
          value: '16:00'
        },
        {
          id: 17,
          value: '17:00'
        },
        {
          id: 18,
          value: '18:00'
        },
        {
          id: 19,
          value: '19:00'
        },
        {
          id: 20,
          value: '20:00'
        },
        {
          id: 21,
          value: '21:00'
        },
        {
          id: 22,
          value: '22:00'
        },
        {
          id: 23,
          value: '23:00'
        }
      ],
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
      currentPage: 1,
      pageSize: 15,
      total: '',
      stations: [],
      query: {},  //请求参数json
      initChartTagName: '',
      initChartTagLabel: ''
    };
  },
  mounted(){
    this.init();
    this.getData();
    //this.factorsAll = factorsAllDay.factors;
  },
  //对监测因子的配置内容进行监听，只要有变化就将新值存入 LocalStorage
  watch:{
    factorsAll:{
      handler:function(val, oldVal){
        //不同数据类型分开保存（需要将json序列化）
        switch(this.dataType){
          case 1:
            window.localStorage.setItem('favouriteFactors_Real',JSON.stringify(val));
            break;
          case 2:
            window.localStorage.setItem('favouriteFactors_Minute',JSON.stringify(val));
            break;
          case 3:
            window.localStorage.setItem('favouriteFactors_Hour',JSON.stringify(val));
            break;
          // case 4:
          //   window.localStorage.setItem('favouriteFactors_Day',JSON.stringify(val));
          //   break;
          default:
            break;
        }
      },
        deep:true //深度监视，这样就能够监测对象内部的变化
    },
    //监听路由变化
    $route:{
      handler:function(to, from){
          // this.station_code = val;
          if(to.path=='/singlepage'&&from.path=='/realtime'){
            if(this.$route.query.station_code && this.$route.query.station_code != this.station_code){
              this.station_code = this.$route.query.station_code;
              this.getData();
            }
          }
      },
      deep:true
    }
  },
  methods: {
    //让echarts窗口自适应
    init(){
      const self = this;//因为箭头函数会改变this指向，指向windows。所以先把this保存
      var chart = document.getElementById("chart");
        setTimeout(() => {
          window.onresize = function() {
              self.myChart = self.$echarts.init(chart, "purple-passion");
              self.myChart.resize();
          }
        },20)
    },
    //判断当前数据类型
    checkDataType(){
      switch (this.dataType) {
        //实时数据
        case 1:
          //this.urlData = this.urlReal;
          //this.urlFactor = this.urlFactorReal;
          this.factorsAll = JSON.parse(window.localStorage.getItem('favouriteFactors_Real') || '[]');
          //未指定日期，则默认系统日期
          if(this.dayValue == ""){
            this.getSystemTime();
            this.dayValue = this.systemTimeYear + "-" + this.systemTimeMonth + "-" + this.systemTimeDate;
          }
          this.requestTime = this.dayValue + " " + this.hourValue+":00";
          this.query = {
            station_code: this.station_code,
            data_type: this.dataType,
            time: this.requestTime
          };
          break;
        //5分钟数据
        case 2:
          //this.urlData = this.urlMinute;
          //this.urlFactor = this.urlFactorHour;
          this.factorsAll = JSON.parse(window.localStorage.getItem('favouriteFactors_Minute') || '[]');
          //未指定日期，则默认系统日期
          if(this.dayValue == ""){
            this.getSystemTime();
            this.dayValue = this.systemTimeYear + "-" + this.systemTimeMonth + "-" + this.systemTimeDate;
          }
          this.requestTime = this.dayValue + " " + this.hourValue+":00";
          this.query = {
            station_code: this.station_code,
            data_type: this.dataType,
            time: this.requestTime
          };
          break;
        //小时数据
        case 3:
          //this.urlData = this.urlHour;
          //this.urlFactor = this.urlFactorHour;
          this.factorsAll = JSON.parse(window.localStorage.getItem('favouriteFactors_Hour') || '[]');
          //未指定日期，则默认系统日期
          if(this.dayValue == ""){
            this.getSystemTime();
            this.dayValue = this.systemTimeYear + "-" + this.systemTimeMonth + "-" + this.systemTimeDate;
          }
          this.requestTime = this.dayValue;
          this.query = {
            station_code: this.station_code,
            data_type: this.dataType,
            time: this.requestTime,
            offset: this.dayOffset
          };
          break;
        //日数据
        case 4:
          //this.urlData = this.urlDay;
          //this.urlFactor = this.urlFactorDay;
          //this.factorsAll = factorsAllDay.factors;
          //未指定日期，则默认系统日期
          if(this.monthValue == ""){
            this.getSystemTime();
            this.monthValue = this.systemTimeYear + "-" + this.systemTimeMonth;
          }
          this.requestTime = this.monthValue;
          this.query = {
            station_code: this.station_code,
            data_type: this.dataType,
            time: this.requestTime,
            offset: this.monthOffset
          };
          break;
        default:
          break;
      }
    },
    //站点变化时
    handleStationChange(){
      var station_name;
      for(var i=0;i<this.stations.length;i++){
        if(this.stations[i].station_id === this.station_code){
          station_name = this.stations[i].station_name;
        }
      }
      bus.$emit("tagChange",station_name);
    },
    //模糊查询站点
    getStations(key) {
      this.$axios.post(this.urlStations, {
          "key": key,
          "area": this.selectedArea
        })
        .then(res => {
          this.stations = res.data.stations;
        });
    },
    //请求数据
    getData(){
       this.loading = true;
       //没有选择站点则提示
       if(this.station_code == ""){
         //从表单页点击跳转进入，接收站点 id
         if(this.$route.query.station_code){
           this.station_code = this.$route.query.station_code
         }
         //直接从侧边栏点击进入，则没有选择站点，不加载数据
         else{
           this.loading = false;
           return;
         }
       }
       //初始化 chartOption
       this.initChartOption();
       //根据数据类型选择相应数据和监测因子的 url
       this.checkDataType();
       //获取全部监测因子
       this.getFactors();
       // 获取当前站点数据
       this.$axios.post(this.urlData,
         this.query
       ).then((res) => {
           this.siteData = res.data.siteData.data;
           this.total = res.data.siteData.count;
           this.loading = false;
           //日期显示
           if(this.dataType == 3){
             this.dayValue = res.data.siteData.time;
           }
           if(this.dataType == 4){
             this.monthValue = res.data.siteData.time;
           }
           //最新一条校准值
           if(this.dataType == 2 || this.dataType == 3){
             this.latest_calibration_value = ' : ' + res.data.siteData.latest_calibration_value;
           }
           else if(this.dataType == 4){
             for(var i=this.siteData.length-1;i>=0;i--){
               if(this.siteData[i]['n00100']){
                 this.latest_calibration_value = ' : ' + this.siteData[i].n00100;
                 break;
               }
             }
           }
           else{}
           this.setChartOption();
           this.paintChart();
       });
    },
    //获取监测因子配置信息
    getFactors(){
      //判断浏览器是否缓存了用户喜好，如果没有，就向后端请求factors，然后手动设置所有监测因子的 show为 true
      if(this.factorsAll.length == 0){
        this.$axios.get(this.urlAllFactors).then((res) => {
            //获取全部监测因子
            var tempAllFactors = res.data;
            switch(this.dataType){
              case 1:
                for(let i=0; i<tempAllFactors['mfactors'].length; i++){
                  let factor = tempAllFactors['mfactors'][i];
                  factor.show = true;
                  this.factorsAll.push(factor);
                }
                break;
              case 2:
                for(let i=0; i<tempAllFactors['m5factors'].length; i++){
                  let factor = tempAllFactors['m5factors'][i];
                  factor.show = true;
                  this.factorsAll.push(factor);
                }
                break;
              case 3:
                for(let i=0; i<tempAllFactors['hfactors'].length; i++){
                  let factor = tempAllFactors['hfactors'][i];
                  factor.show = true;
                  this.factorsAll.push(factor);
                }
                break;
              case 4:
                for(let i=0; i<tempAllFactors['dfactors'].length; i++){
                  let factor = tempAllFactors['dfactors'][i];
                  factor.show = true;
                  this.factorsAll.push(factor);
                }
                break;
              default:
                break;
            }
        });
      }
      //设置 Chart图默认显示的监测因子————第一个 show为 true的监测因子
      if(this.dataType != 4){
        for(let i=0;i<this.factorsAll.length;i++){
          if(this.factorsAll[i].show == true){
            this.initChartTagName = this.factorsAll[i].norm_code;
            this.initChartTagLabel = this.factorsAll[i].norm_name;
            break;
          }
        }
      }
      else{
        this.initChartTagName = this.factorsDay[0].norm_code;
        this.initChartTagLabel = this.factorsDay[0].norm_name;
      }
    },
    //前一小时
    hourMinus(){
      if(this.hourValue > 0){
        this.hourValue -= 1;
      }
      this.getData();
    },
    //后一小时
    hourPlus(){
      if(this.hourValue < 23){
        this.hourValue += 1;
      }
      this.getData();
    },
    //前一日
    dayMinus(){
      this.dayOffset = -1;
      this.getData();
      this.dayOffset = 0;
    },
    //后一日
    dayPlus(){
      this.dayOffset = 1;
      this.getData();
      this.dayOffset = 0;
    },
    //前一月
    monthMinus(){
      this.monthOffset = -1;
      this.getData();
      this.monthOffset = 0;
    },
    //后一月
    monthPlus(){
      this.monthOffset = 1;
      this.getData();
      this.monthOffset = 0;
    },
    //获取当前系统时间：小时数 & 分钟数
    getSystemTime(){
      let systemDate = new Date();
      this.systemTimeYear = systemDate.getFullYear();
      this.systemTimeMonth = systemDate.getMonth() + 1;
      this.systemTimeDate = systemDate.getDate();
      this.systemTimeHour = systemDate.getHours();
      this.systemTimeMinute = systemDate.getMinutes();
      if(this.systemTimeMinute < 10){
        this.systemTimeMinute = '0' + this.systemTimeMinute;
      }
      this.requestTime = this.systemTimeYear+"-"+this.systemTimeMonth+"-"+this.systemTimeDate+" "+this.systemTimeHour+":"+this.systemTimeMinute;
    },
    //初始化 chartOption
    initChartOption(){
      this.chartOption={
            title: {
                text: '',
                textStyle: {
      	        	color: '#fff'
      	      	},
            },
            color:['#ff0000'],
            textStyle: {
              color: '#ffffff'
            },
            tooltip: {},
            grid:{
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            legend: {
                data: [],
                textStyle: {
                  color: '#ffffff'
                }
            },
            xAxis: {
                name: '',
                data: []
            },
            yAxis: {
                name: '数值',
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
            series: [{
                name: '',
                type: 'line',
                data: []
            }]
      };
    },
    //画图
    paintChart(){
      var chart = document.getElementById('chart');
      //必须设置chart容器的宽度和高度
      var resizeContainer = function () {
        //屏幕宽度
        let w = window.innerWidth;
        //屏幕高度
        let h = window.innerHeight
        chart.style.width = "98%";
        chart.style.height = h*0.36 +'px';
      };
      resizeContainer();
      this.myChart = this.$echarts.init(chart,"purple-passion");
      this.myChart.setOption(this.chartOption);
    },
    //根据当前数据类型设置 chartOption
    setChartOption(tagName=this.initChartTagName, label=this.initChartTagLabel){
      //标题
      if(this.dataType != 4){
        var obj = this.factorsAll.find(item=>{
            return item.norm_code == tagName;
        });
      }
      else{
        var obj = this.factorsDay.find(item=>{
            return item.norm_code == tagName;
        });
      }
      this.chartOption.title.text = `${obj.norm_name}`;
      //图例名称
      this.chartOption.legend.data[0] = {};
      this.chartOption.legend.data[0].name = label;
      //X轴名称
      if(this.dataType == 1){
        this.chartOption.xAxis.name = '分钟';
      }
      else if(this.dataType == 2){
        this.chartOption.xAxis.name = '分钟';
      }
      else if(this.dataType == 3){
        this.chartOption.xAxis.name = '小时';
      }
      else{
        this.chartOption.xAxis.name = '日';
      }
      //x轴坐标
      this.chartOption.xAxis.data = [];
      for(let i=0;i<this.siteData.length;i++){
        this.chartOption.xAxis.data.push(this.siteData[i].time);
      }
      //y轴名称
      //数据名称
      this.chartOption.series[0].name = label;
      //数据内容
      this.chartOption.series[0].data = [];
      for(let i=0;i<this.siteData.length;i++){
        this.chartOption.series[0].data.push(this.siteData[i][tagName]);
      }
    },
    //数据类型改变
    handleDataTypeChange(event){
      if(this.dataType != 4){
        this.dataTable = 'datatable';
      }
      else{
        this.dataTable = 'datatableday';
      }
    },
    //分页页码改变
    handleCurrentChange(val){
      this.currentPage = val;
    },
    //chart图展示的监测因子改变
    handleChartFactorChange(tagName, label){
      this.setChartOption(tagName, label);
      this.paintChart();
    },
    //配置数据项
    handleConfigDataType(){
      this.configFactorVisible = true
    },
    //查询数据
    handleQueryData(){
      this.getData();
      this.setChartOption();
      this.paintChart();
    }
  }
}
</script>

<style scoped>
.el-table{
  margin-top: 15px;
}
#chart{
  margin-top: 25px;
}
#factorSelect{
  margin-top: 25px;
}
.space_content{
  border-radius: 4px;
  min-height: 36px;
}
.bg_dark{
  background: #1F1D1D;
}
.lcv{
  background: #ffff00;
  color: #000000;
  font-size: 18px;
  font-weight: bold;
  padding: 10px 20px;
  border-width: thick;
  border-radius: 8px;
}
.inline{
  display: inline;
  margin-left: 20px;
}
.lcvml{
  margin-left: 30px;
}
.dp{
  margin-left: 20px;
}
</style>
