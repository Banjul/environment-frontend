<template>
    <div class="base-content base-bg-color">
        <el-row :gutter=10>
            <!-- <el-col :span=3>
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
            </el-col>
            <el-col :span=3>
                <el-date-picker
                    v-model="dayTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOption1"
                    placeholder="选择一天">
                </el-date-picker>
            </el-col> -->
            <el-col :span=4>
              
            </el-col>
            <el-col :span=2>
                <el-button type="primary" class="base-btn" @click="getData">
                    查 询
                </el-button>
            </el-col>
        </el-row>
        <div><baseline></baseline></div>
        
        <el-row>
            <el-col :span=24>
                <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" row-class-name="base-eltable-bgc" border :height="height">
                    <el-table-column prop="station_name" label="站点名称" >
                    </el-table-column>
                    <el-table-column prop="station_id" label="站点ID">
                    </el-table-column>
                    <el-table-column prop="country_con" label="功能区" >
                    </el-table-column>
                    <el-table-column prop="district" label="行政区" >
                    </el-table-column>
                    <el-table-column prop="street" label="街道" >
                    </el-table-column>
                    <el-table-column prop="time" label="离线时间" >
                    </el-table-column>
                </el-table>
                <!-- 分页栏 -->
                <el-pagination background
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10]"
                    :page-size="pageSize"
                    layout="total,sizes,prev, pager, next,jumper"
                    :total="stationData.count">
                </el-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import baseline from "../../base/baseline.vue";
export default {
  name: "online",
  components: {
    baseline
  },
  data() {
    return {
      url: {
        stations: "/environment/station/getStationLike",
        onlinedata: ""
      },
      //   ==============下拉模糊查询================   //
      stations: [], //下拉的选择项
      siteSelected: "", //模糊查询选中的查询结果
      loading: false, //是否正在从远程获取数据
      //   ==============下拉模糊查询================   //
      dayTime: "",
      pickerOption1: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      stationData: {
          data:[],
          count:0
      },
      currentPage: 1,
      pageSize: 10,
      height:"900px"
    };
  },
  computed:{
      tableData(){
          return this.stationData.data;
      }
  },
  created(){
      this.getHieght();
      this.getTime();
      this.getData();
  },
  mounted(){
      
  },
  methods: {
      getHieght(){
        //屏幕高度
        let h = window.innerHeight;
        this.height = h * 0.83 + "px";
        console.log(this.height)
      },
    getTime() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let time = y + "-" + m + "-" + d;
      this.dayTime = time;
    },
    //   模糊查询获取站点下拉列表
    getStations(key) {
      this.$axios
        .post(this.url.stations, {
          key: key
        })
        .then(res => {
          this.stations = res.data.stations;
        });
    },
    // 处理页码变化
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
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
    getData() {
      if (this.dayTime == "") {
        this.$confirm("请选择查询时间", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {})
          .catch(() => {});
        return;
      }

      this.$axios
        .post(this.url.onlinedata, {
          query: {
            station: this.siteSelected,
            time: this.dayTime
          }
        })
        .then(res => {
          if (!res.data) {
            this.showInfo();
            return;
          }
          this.stationData = res.data;
        });
    }
  }
};
</script>


<style>
</style>
