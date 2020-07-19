<template>
  <el-table border style="100%" row-class-name="base-eltable-bgc" height="300"
    v-if="dataType == 1"
    :data="siteData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :default-sort = "{prop: 'time', order: 'descending'}">
    <el-table-column
      prop="time"
      label="时间"
      align="center"
      sortable>
    </el-table-column>
    <el-table-column
      v-for="factor in factorsAll"
      v-if="factor.show == true"
      :key="factor.norm_code"
      :property="factor.norm_code"
      :label="factor.norm_name"
      align="center">
    </el-table-column>
  </el-table>

  <el-table border style="100%" row-class-name="base-eltable-bgc" height="550"
    v-else
    :data="siteData"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :default-sort = "{prop: 'time', order: 'descending'}">
    <el-table-column
      prop="time"
      label="时间"
      align="center"
      sortable>
    </el-table-column>
    <el-table-column
      v-for="factor in factorsAll"
      v-if="factor.show == true"
      :key="factor.norm_code"
      :property="factor.norm_code"
      :label="factor.norm_name"
      align="center">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "datatable",
  props: ["siteData", "factorsAll", "currentPage", "pageSize", "loading", "dataType"],
  data(){
    return{

    }
  }
}
</script>

<style scoped>
</style>
