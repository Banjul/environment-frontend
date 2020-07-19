<template>
    <div>
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
        :label="item.sim"
        :value="item.station_id">
        </el-option>
      </el-select>
    </div>
</template>

<script>
import areaOptions from "@/components/base/areas.js";
export default {
    data(){
        return {
            // 模糊查询接口
            url:"/environment/station/getStationLike",
            // 行政区的下拉
            areaOptions:areaOptions,
            // 选择的行政区
            selectedArea:"",
            // 选择的站点
            siteSelected:"",
            // 存放站点下拉列表
            stations:[]

        }
    },
    methods:{
        //   模糊查询获取站点下拉列表
        getStations(key) {
        this.$axios
            .post(this.url, {
                area:this.selectedArea,
                key: key
            })
            .then(res => {
            this.stations = res.data.stations;
            });
        },
    }
}
</script>
