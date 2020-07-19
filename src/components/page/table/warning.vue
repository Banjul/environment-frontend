<template>
  <div class="base-content base-bg-color">
    <el-row id="mainSelect">
      <el-col :span="4">
        <div>
          <el-select v-model="district_name" placeholder="请选择行政区">
            <el-option
              v-for="district in districts"
              :key="district.id"
              :label="district.value"
              :value="district.value"
            ></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="4" style="margin-left:10px">
        <div>
          <el-select v-model="domain_id" placeholder="请选择功能区">
            <el-option
              v-for="domain in domains"
              :key="domain.id"
              :label="domain.value"
              :value="domain.id"
            ></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="3" style="margin-left:10px;width:200px">
        <div>
          <el-select
            v-model="station_code"
            placeholder="请选择站点"
            clearable
            @visible-change="getStations($event)"
            :loading="loading"
          >
            <el-option
              v-for="item in stations"
              :key="item.station_id"
              :label="item.station_name"
              :value="item.station_id"
            ></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col style="width:450px">
        <div>
          <el-date-picker
            style="width:450px;margin-left:10px"
            v-model="timeValue"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            format="yyyy-MM-dd HH"
            value-format="yyyy-MM-dd HH"
          ></el-date-picker>
        </div>
      </el-col>
      <el-col :span="2">
        <div>
          <el-button
            class="base-btn"
            type="primary"
            style="margin-left:20px;font-size:14px;"
            v-on:click="handleQueryData"
          >查询</el-button>
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
      :default-sort="{prop: 'warning_start_time', order: 'descending'}"
      :data="warningData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
    >
      <el-table-column prop="norm_name" label="指标" align="center"></el-table-column>
      <el-table-column prop="threshold" label="阈值" align="center"></el-table-column>
      <el-table-column
        prop="warning_start_time"
        label="开始时间"
        :show-overflow-tooltip="true"
        align="center"
        sortable
        :width="200"
      ></el-table-column>
      <el-table-column
        prop="warning_end_time"
        label="结束时间"
        :show-overflow-tooltip="true"
        align="center"
        sortable
        :width="200"
      ></el-table-column>
      <el-table-column prop="leq" label="LeqA" align="center"></el-table-column>
      <el-table-column prop="lmx" label="Lmx" align="center"></el-table-column>
      <el-table-column prop="sd" label="SD" align="center"></el-table-column>
      <el-table-column prop="cal" label="校准值" align="center"></el-table-column>
      <el-table-column prop="vdr" label="Vdr" align="center"></el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[15]"
      :page-size="pageSize"
      layout="total,sizes,prev, pager, next,jumper"
      :total="this.total"
    ></el-pagination>
  </div>
</template>

<script>
import baseline from "../../base/baseline.vue";
import datatable from "./dataTable.vue";

export default {
  name: "warning",
  components: {
    baseline,
    datatable
  },
  data() {
    return {
      title: "超标报警查询",
      url_warning:
        "environment/warning/queryWarningByDomainAndTimeAndDistrictAndStation",
      //url_domain:"./static/test.json",
      urlStations: "/environment/station/getStationsByDistrictAndDomain",
      loading: false,
      station_code: "",
      stations: [],
      siteSelected: "", //根据功能区和行政区筛选的结果
      warningData: [],
      sitesDataWaring: [],
      domain_id: "",
      district_name: "",
      dataTable: "warning",
      domains: [
        {
          id: 0,
          value: "功能区0"
        },
        {
          id: 1,
          value: "功能区1"
        },
        {
          id: 2,
          value: "功能区2"
        },
        {
          id: 3,
          value: "功能区3"
        },
        {
          id: 4,
          value: "功能区4"
        }
        // {
        //   id: 5,
        //   value: "全部功能区"
        // }
      ],
      districts: [
        {
          id: 0,
          value: "黄浦区"
        },
        {
          id: 1,
          value: "徐汇区"
        },
        {
          id: 2,
          value: "长宁区"
        },
        {
          id: 3,
          value: "静安区"
        },
        {
          id: 4,
          value: "普陀区"
        },
        {
          id: 5,
          value: "崇明区"
        },
        {
          id: 6,
          value: "奉贤区"
        },
        {
          id: 7,
          value: "青浦区"
        },
        {
          id: 8,
          value: "松江区"
        },
        {
          id: 9,
          value: "金山区"
        },
        {
          id: 10,
          value: "浦东区"
        },
        {
          id: 11,
          value: "嘉定区"
        },
        {
          id: 12,
          value: "宝山区"
        },
        {
          id: 13,
          value: "闵行区"
        },
        {
          id: 14,
          value: "杨浦区"
        },
        {
          id: 15,
          value: "虹口区"
        }
      ],
      warningInitValue: {
        //station_id: "",
        //station_name: "",
        norm_name: "",
        threshold: "",
        warning_start_time: "",
        warning_end_time: "",
        leq: "",
        lmx: "",
        sd: "",
        cal: "",
        vdr: ""
      },
      currentPage: 1,
      pageSize: 15,
      total: 0,
      timerHour: null,
      query: {}, //请求参数json
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      timeValue: []
    };
  },
  computed: {
    requestStartTime: function() {
      return this.timeValue[0] + ":00:00";
    },
    requestEndTime: function() {
      return this.timeValue[1] + ":00:00";
    }
  },
  methods: {
    showInfo2() {
      if (this.district_name == null || this.domain_id == null) {
        this.$message({
          message: `请选择一个行政区和功能区之后选择站点`,
          type: "warning"
        });
        return true;
      } else {
        return false;
      }
    },

    IsQueryEmpty() {
      if (!this.district_name || this.domain_id ==  null || !this.station_code) {
        this.$message({
          message: `请选择一个行政区和一个功能区和一个站点之后查询`,
          type: "warning"
        });
        return true;
      } else {
        return false;
      }
    },
    IsTimeEmpty() {
      if (!this.timeValue[0] || !this.timeValue[1]) {
        this.$message({
          message: "请选择报警开始和结束时间",
          type: "warning"
        });
        return true;
      }
      return false;
    },

    //查询数据
    handleQueryData() {
      if (this.IsQueryEmpty()) {
        return;
      }
      if (this.IsTimeEmpty()) {
        return;
      }
      this.currentPage = 1;
      this.getData();
    },
    //根据选择功能区和行政区查询站点
    getStations(callback) {
      if (callback) {
        if (this.showInfo2()) {
          return;
        }
        this.$axios
          .post(this.urlStations, {
            district_name: this.district_name,
            domain_id: this.domain_id
          })
          .then(res => {
            this.stations = res.data.stations;
          });
      }
    },
    //请求数据
    getData() {
        this.loading = true;
      //小时数据
      this.$axios
        .post(this.url_warning, {
          district_name: this.district_name,
          domain_id: this.domain_id,
          station_id: this.station_code,
          requestStartTime: this.requestStartTime,
          requestEndTime: this.requestEndTime,
          each_page_num: this.pageSize,
          current_page: this.currentPage
        })
        .then(res => {
          this.warningData = res.data.warningData.data;
          this.total = parseInt(res.data.warningData.count);
          this.loading = false;
          //没有数据则提示
          if (this.total == 0) {
            this.$alert("暂无数据，请重新选择条件", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            });
            return;
          }
        });
    },
    //页码变化
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
    }
  }
};
</script>


<style scoped>
.el-table {
  margin-top: 15px;
}

#warning {
  margin-top: 2px;
}
</style>
