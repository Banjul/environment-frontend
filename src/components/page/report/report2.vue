<template>
    <div class="base-content base-bg-color">
        <el-row>
            <el-col :span="2">
            <div class="edit_btn">
                <div>
                <el-button @click="handleExport" type="primary" size="medium">导  出</el-button>
                </div>
            </div>
            </el-col>
        </el-row>
        <hr color="#1a5dcf" style="height:1px;margin-top:10px"/>
        <div class="text" style="text-align:center">
          <h2 style='font-size:20px;'>{{reportName}}</h2>
        </div>
        <div style='margin-top:8px;' class="user_info_table base-table">
            <el-table
            :data="areaData"
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
            :show-overflow-tooltip="true"
            min-width="130px"
            v-for="column in columns"
            :key="column.id"
            :property="column.prop"
            :label="column.name">
            </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'report2',
    data(){
        return {
            title:"报表2：道路交通声环境监测点位基础信息表",
            url:{
              //areaData:"http://localhost:8080/static/reportTestJson/reportdata2.json",
              areaData:"/environment/report/report2",
            },
            columns:[
              {
                "id": 1,
                "name": "测点代码",
                "prop": "station_id"
              },
              {
                "id": 2,
                "name": "测点名称",
                "prop": "station_name"
              },      
              {
                "id": 3,
                "name": "测点经度",
                "prop": "station_lon"
              },      
              {
                "id": 4,
                "name": "测点纬度",
                "prop": "station_lat"
              },      
              {
                "id": 5,
                "name": "测点参照物",
                "prop": "reference"
              },   
              {
                "id": 6,
                "name": "路段名称",
                "prop": "road_name"
              }, 
              {
                "id": 7,
                "name": "路段起止点",
                "prop": "road_end"
              }, 
              {
                "id": 8,
                "name": "路段长度(m)",
                "prop": "road_length"
              },   
              {
                "id": 9,
                "name": "路幅宽度(m)",
                "prop": "road_width"
              },    
              {
                "id": 10,
                "name": "道路等级",
                "prop": "road_level"
              },     
              {
                "id": 11,
                "name": "路段覆盖人口(万人)",
                "prop": "population"
              },        
              {
                "id": 12,
                "name": "备注",
                "prop": "remark"
              }
            ],
            loading:false,
            district_value: '',
            date_value: '',
            report_value:'',
            reportName:'表2：道路交通声环境监测点位基础信息表',
            areaData:[]
      }
    },
    mounted() {
      this.getAreaData();
    },
    methods: {
     // 获取json格式的模拟数据
     getAreaData(){
       this.loading=true;
        this.$axios.get(this.url.areaData).then(res => {
          this.loading=false;
          this.areaData = res.data.areaData;
        });
     },
      export2Excel(){
      this.settingVisible = false;
      require.ensure([], () => {　　　　　　　　
      //引入文件　
      const { export_json_to_excel } = require('../../../vendor/Export2Excel');　　　　　　　
      //将对应的属性名转换成中文
      const tHeader = ['测点代码', '测点名称', '测点经度', '测点纬度', '测点参照物','路段名称','路段起止点','路段长度(m)',
                          '路幅宽度(m)','道路等级','路段覆盖人口（万人)','备注']; 　　　
      //table表格中对应的属性名
      const filterVal = ['station_id', 'station_name', 'station_lon', 'station_lat', 'reference',"road_name","road_end",
                         "road_length","road_width","road_level", 'population','remark'];　　　　　 　　　
      const list = this.areaData;　　　　　　　　
      const data = this.formatJson(filterVal, list);　　　　　　　　
      export_json_to_excel(tHeader, data, '报表2');　　　　　　
      })
    },
    formatJson(filterVal, jsonData) {
　　　　return jsonData.map(v => filterVal.map(j => v[j]))
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
}
</script>


<style scoped>
.query_row{
  margin-bottom: 15px;
}
.edit_row{
  margin-top: 15px;
}
.query_box{
  display: flex;
  justify-content: space-between;
}
.query_item{
  display: flex;
  justify-content: flex-start;
  margin-left: 10px;
}
.user_info_table{
  margin-top: 50px;
}
.font_1{
  margin-top: 5px;
  margin-right: 10px;
  font-family: "Hiragino Sans GB";
  font-weight:bold;
  color: rgb(33, 31, 38);
}
.edit_btn{
  display: flex;
  justify-content:space-around;
}
.page_btn{
  display: flex;
  justify-content: center;
}
.first_page_btn{
  margin-right: 10px;
}
.last_page_btn{
  margin-left: 10px;
}
.space {
  border-radius: 4px;
  min-height: 36px;
}
.el-table .highlight-row {
  background: #ededed;
}
.table-expand{
  font-size: 10px;
}
.table-expand label{
  width: 90px;
  color: #99a9bf;
}
.table-expand-user{
  margin-right: 0;
  margin-bottom: 0;
  width: 30%;
}
.table-expand-permission{
  margin-top: 0;
  margin-left: 0;
  width: 100%;
}
.cell{
    color: #fff;
    font-size: 13px;
}
</style>

