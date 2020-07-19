<template>
  <div class="base-content base-bg-color">
    <el-row>
      <el-col :span="10">
        <div class="query_item">
          <p class="font_local">道路名称</p>
          <!-- <el-select v-model="district_value" placeholder="请选择" style="width:500px">
            <el-option
              v-for="distribution in distributions"
              :key="distribution"
              :label="distribution"
              :value="distribution"
            ></el-option>
          </el-select> -->
          <el-select
            v-model="district_value"
            filterable
            reserve-keyword
            placeholder="请输入关键词"
          >
            <el-option
              v-for="distribution in distributions"
              :key="distribution"
              :label="distribution"
              :value="distribution"
            ></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="query_item">
          <p class="font_local">监测日期</p>
          <el-date-picker
            v-model="datetime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOption1"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="query_item">
          <el-button @click="getData" type="primary" size="medium">查 询</el-button>
          <el-button @click="handleExport" type="primary" size="medium">导 出</el-button>
        </div>
      </el-col>
    </el-row>

    <hr color="#1a5dcf" style="height:1px;margin-top:10px">
    <div class="text" style="text-align:center">
      <h2 style="font-size:20px;">{{reportName}}</h2>
    </div>
    <div style="margin-top:8px;" class="user_info_table base-table">
      <el-table
        :data="siteData"
        style="width: 100%;"
        max-height="600"
        row-class-name="base-eltable-bgc"
        border
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column
          min-width="130px"
          :show-overflow-tooltip="true"
          class="column"
          v-for="column in columns"
          :key="column.id"
          :property="column.prop"
          :label="column.name"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "report5",
  data() {
    return {
      title: "报表5：道路交通声环境监测记录表",
      url: {
        // functionalAreaData:"./static/reportTestJson/reportdata5.json",
        functionalAreaData: "/environment/report/report5",
        street:"/environment/station/getAllStreet"
      },
      pickerOption1: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      columns: [
        {
          id: 1,
          name: "测点代码",
          prop: "station_id"
        },
        {
          id: 2,
          name: "测点名称",
          prop: "station_id"
        },
        {
          id: 3,
          name: "月",
          prop: "month"
        },
        {
          id: 4,
          name: "日",
          prop: "date"
        },
        {
          id: 5,
          name: "时",
          prop: "hour"
        },
        {
          id: 6,
          name: "分",
          prop: "minute"
        },
        {
          id: 7,
          name: "Leq",
          prop: "n00006"
        },
        {
          id: 8,
          name: "L10",
          prop: "n00002"
        },
        {
          id: 9,
          name: "L50",
          prop: "n00003"
        },
        {
          id: 10,
          name: "L90",
          prop: "n00004"
        },

        {
          id: 11,
          name: "Lmax",
          prop: "n00010"
        },
        {
          id: 12,
          name: "Lmin",
          prop: "n00011"
        },
        {
          id: 13,
          name: "标准差(SD)",
          prop: "n23Lsd"
        },
        {
          id: 14,
          name: "大型车-车流量(辆/分钟)",
          prop: "large_car"
        },
        {
          id: 15,
          name: "中小型车-车流量(辆/分钟)",
          prop: "small_car"
        },
        {
          id: 16,
          name: "备注",
          prop: "remark"
        }
      ],
      loading:false,
      district_value: "",
      date_value: "",
      report_value: "",
      reportName: "表5：道路交通声环境监测记录表",
      currentReport: [],
      currentDistrict: [],
      distributions: [],
      datetime:"",//监测日期
      siteData:[]
    };
  },
  created() {
    this.getStreet();
    this.getTime();
    // this.getData();
  },
  methods: {
    getStreet(){
      this.$axios.get(this.url.street).then(res=>{
        this.distributions = res.data;
      })
    },
    getTime() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let time = y + "-" + m.toString().padStart(2,'0') + "-" + d.toString().padStart(2,'0');
      this.datetime = time;
    },
    getData(){
      this.loading=true;
      this.$axios.post(this.url.functionalAreaData,{
        "road":this.district_value,
        "time":this.datetime
      }).then(res=>{
        // console.log(res)
        this.loading=false;
        this.siteData = res.data.roadMonitorData;
      })
    },
    //获取筛选条件
    generateReport() {
      //所选区域信息
      this.currentDistrict = this.distributions[this.district_value - 1];
      if (this.currentDistrict == null) {
        alert("请选择区域!");
      }
    },
    export2Excel() {
      this.settingVisible = false;
      require.ensure([], () => {
        //引入文件
        const {
          export_json_to_excel
        } = require("../../../vendor/Export2Excel");
        //将对应的属性名转换成中文
        let tHeader = [];
        //table表格中对应的属性名
        let filterVal = [];
        this.columns.forEach(item => {
          tHeader.push(item.name);
          filterVal.push(item.prop);
        });
        const list = this.siteData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "报表5");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    // 导出报表
    handleExport() {
      this.$confirm("确认导出该报表到EXCEL文件吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.export2Excel();
          this.$message({
            type: "success",
            message: "已成功导出报表!"
          });
          this.siteTags = [];
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
</script>


<style scoped>
.query_row {
  margin-bottom: 15px;
}
.edit_row {
  margin-top: 15px;
}
.query_box {
  display: flex;
  justify-content: space-between;
}
.query_item {
  display: flex;
  justify-content: flex-start;
  margin-left: 10px;
}
.user_info_table {
  margin-top: 50px;
}
.font_local {
  margin-top: 5px;
  margin-right: 10px;
  font-family: "Hiragino Sans GB";
  font-weight: bold;
  color: rgb(255, 255, 255);
}
.edit_btn {
  display: flex;
  justify-content: space-around;
}
.page_btn {
  display: flex;
  justify-content: center;
}
.first_page_btn {
  margin-right: 10px;
}
.last_page_btn {
  margin-left: 10px;
}
.space {
  border-radius: 4px;
  min-height: 36px;
}
.el-table .highlight-row {
  background: #ededed;
}
.table-expand {
  font-size: 10px;
}
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand-user {
  margin-right: 0;
  margin-bottom: 0;
  width: 30%;
}
.table-expand-permission {
  margin-top: 0;
  margin-left: 0;
  width: 100%;
}
.column {
  color: #fff;
  font-size: 13px;
}
</style>

