<template>
  <div class="base-content base-bg-color">
    <el-row>
      <div class="tools">
        <el-form :inline="true">
          <el-form-item>
            <!-- 日期选择控件 -->
            <div class="block">
              <!--<span class="condition-label">时间:</span>-->
              <el-date-picker value-format="yyyy-MM-dd" v-model="selectedDay" type="date"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item>
            <!-- 采集车选择列表-单选	 -->
            <el-select v-model="carSelected" @change="handleStationChange">
              <el-option
                v-for="car in carsData"
                :key="car.carName"
                :label="car.carName"
                :value="car.carName"
              ></el-option>
            </el-select>
            <!-- <div >
                                <el-checkbox-group v-model="checkedCars" :max="1" @change="handleChecked">
                                    <el-checkbox border v-for="car in carsData" :label="car.carName" :key="car.carName">{{car.carName}}
                                    </el-checkbox>
                                </el-checkbox-group>
            </div>-->
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSearchBtn">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-row>
    <!-- 地图 -->
    <div id="base-map">
      <dialog-bar id="dialog" class="text-wrapper" v-model="sendVal" title="轨迹点信息" :content="info"></dialog-bar>
      <!-- <div style="position:absolute;z-index:2; top:0px; left:88px;"><img src="static/img/trackpic.png"></div> -->
    </div>
  </div>
</template>

<script>
// 导入地图组件
import "ol/ol.css";
import Map from "ol/Map.js";
import View from "ol/View.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { XYZ, Vector as VectorSource } from "ol/source.js";
import Feature from "ol/Feature.js";
import { fromLonLat } from "ol/proj.js";
import Style from "ol/style/Style.js";
import Stroke from "ol/style/Stroke.js";
import Fill from "ol/style/Fill.js";
import Icon from "ol/style/Icon.js";
import Point from "ol/geom/Point.js";
import Circle from "ol/style/Circle.js";
import LineString from "ol/geom/LineString.js";
import dialogBar from "./dialog.vue";
import GeoJSON from "ol/format/GeoJSON.js";
import bus from "@/components/layout/bus.js"
export default {
  components: {
    "dialog-bar": dialogBar
  },
  name: "trackmap",
  data() {
    return {
      title: "轨迹",
      url: {
        carOptions: "environment/gather/getallgather", //采集车选项信息
        trackData: "environment/gather/getgatherdata" //采集车轨迹信息
        // trackData:"./static/trackmaptestjson/trackmap.json"
      },
      map: {}, //地图
      center: [121.47, 31.23], // 地图初始化中心点：上海东方明珠
      tracksData: [null], //采集车轨迹数据
      carsData: [], //采集车数据
      carSelected: "",
      selectedDay: "",
      vectorSource: "", //地图矢量资源
      vectorLayer: "", //地图矢量图层
      jsons: {},
      jsons_s: {},
      sendVal: false,
      timeLoadPoint: "", //加载坐标点定时器
      info: "info"
    };
  },
  created() {
    //获取采集车数据
    this.getCars();
  },
  mounted() {
    this.initMap();
    //日期控件默认选择今天
    var today = new Date();
    this.selectedDay =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
  },
  watch:{
    //监听路由变化
    $route:{
      handler:function(to){
          console.log(to);
          if(to.path=='/trackmap'){
            console.log("this.$route.query.gather_id");
            if(this.$route.query.gather_id && 
               this.$route.query.gather_id != this.carSelected){
                 this.carSelected = this.$route.query.gather_id;
                 let today=new Date();
                let tTime=today.getFullYear() + 
                "-" +
                (today.getMonth() + 1) +
                "-" +
                today.getDate();
                 this.selectedDay=tTime;
                 this.handleSearchBtn();
            }
          }
      },
      immediate:true,
      deep:true
    }
  },
  computed: {
    checkedCars() {
      return [this.carSelected];
    }
  },
  methods: {
    //获取采集车数据json
    getCars() {
      this.$axios.get(this.url.carOptions).then(res => {
        if (!res.data.carList.length) {
          this.$message({
            message: `未查询到流动采集车信息`,
            type: "warning"
          });
          return;
        }
        this.carsData = res.data.carList;
        console.log(this.carsData);
      });
    },
    handleJudge() {
      if (this.selectedDay == ""||this.selectedDay==null) {
        this.$message({
          message: `请选择日期`,
          type: "warning"
        });
        return true;
      }
      if (this.carSelected == "") {
        this.$message({
          message: `请选择采集车`,
          type: "warning"
        });
        return true;
      }
      return false;
    },
    //查询按钮事件
    handleSearchBtn() {
      var self = this;
      if (self.handleJudge()) return;
      var selectedTrack = [];
      //根据获取的采集车获取轨迹信息
      self.$axios
        .post(self.url.trackData, {
          query: {
            date: self.selectedDay,
            cars: self.checkedCars
          }
        })
        .then(res => {
          //TODO 判断有返回信息
          console.log(res.data);
          if (res.data.features.length == 0) {
            this.$message({
              message: `该采集车此日无数据`,
              type: "warning"
            });
            return;
          }
          self.jsons = res.data;
          // console.log(selectedTrack);
          self.vector(self.read_gjson(self.jsons));
          self.dialog();
        });
    },
    //读取Gjson方法
    read_gjson(Gjson) {
      var self = this;
      var point = new GeoJSON().readFeatures(Gjson);
      return point;
    },
    //地图添加矢量元素
    vector(P) {
      var self = this;
      console.log(self.timeLoadPoint);
      if (self.timeLoadPoint != "") {
        clearInterval(self.timeLoadPoint);
        console.log("清除定时器");
      }
      //清空矢量图层
      if (self.vectorLayer != "") {
        self.map.removeLayer(self.vectorLayer);
      }

      // self.vectorLayer ={};

      var svgGK =
        '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">' +
        '<path fill="#e72a23" d="M22.906,10.438c0,4.367-6.281,14.312-7.906,17.031c-1.719-2.75-7.906-12.665-7.906-17.031S10.634,2.531,15,2.531S22.906,6.071,22.906,10.438z"/>' +
        '<circle fill="#FFFFFF" cx="15" cy="10.677" r="4.291"/></svg>';
      var svgSK =
        '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">' +
        '<path fill="#5041ea" d="M22.906,10.438c0,4.367-6.281,14.312-7.906,17.031c-1.719-2.75-7.906-12.665-7.906-17.031S10.634,2.531,15,2.531S22.906,6.071,22.906,10.438z"/>' +
        '<circle fill="#FFFFFF" cx="15" cy="10.677" r="4.291"/></svg>';
      var mysvg = new Image();
      mysvg.src = "data:image/svg+xml," + escape(svgGK);
      var styles = {
        Point: new Style({
          image: new Icon({
            img: mysvg,
            imgSize: [40, 40]
          })
        })
      };
      var styleFunction = function(feature) {
        return styles[feature.getGeometry().getType()];
      };
      self.vectorSource = new VectorSource({
        features: [] //绑定元素集合
      });
      self.vectorLayer = new VectorLayer({
        source: self.vectorSource,
        style: styleFunction //添加坐标点样式
      });
      self.map.addLayer(self.vectorLayer);
      self.loadPointWithTime(P);
    },
    //轨迹点加载定时器方法
    loadPointWithTime(anchorArray) {
      var m = 0;
      var _this = this;
      _this.timeLoadPoint = setInterval(function() {
        //在图层上load点
        console.log(_this);
        console.log(" vectorLayers:" + _this.vectorLayer);
        console.log(" anchorArray:" + anchorArray[m]);
        _this.vectorLayer.getSource().addFeature(anchorArray[m]);
        m = m + 1;
        console.log(m);
        if (m >= anchorArray.length) {
          //加载完毕清除定时器
          clearInterval(_this.timeLoadPoint);
        }
      }, 1000);
      // 设置定时器5
    },
    //根据获取项目
    getItem(arr, obj) {
      arrFor: for (var i = 0; i < arr.length; i++) {
        for (var n in obj) if (arr[i][n] != obj[n]) continue arrFor;
        return arr[i];
      }
    },
    //对话框点击
    dialog() {
      var self = this;
      self.map.on("click", function(e) {
        console.log("点击");
        var pixel = self.map.getEventPixel(e.originalEvent);
        console.log(pixel);
        if (self.sendVal) self.sendVal = false;
        self.map.forEachFeatureAtPixel(pixel, function(feature) {
          console.log(feature);
          //根据id获取对象
          var p = self.getItem(self.jsons.features, { id: feature.id_ });
          console.log(p);
          self.info =
            "id: " +
            p.id +
            "\n" +
            "坐标: " +
            p.geometry.coordinates +
            "\n" +
            "时间: " +
            p.time +
            "\n" +
            "N23LEQ: " +
            p.N23LEQ;
          console.log(feature);
          if (!self.sendVal) self.sendVal = true;
        });
      });
    },
    // 初始化地图方法
    initMap() {
      var self = this;
      //自动补0方法
      function zeroFill(num, len, radix) {
        var str = num.toString(radix || 10);
        while (str.length < len) {
          str = "0" + str;
        }
        return str;
      }
      self.map = new Map({
        target: "base-map",
        layers: [
          new TileLayer({
            // source: new OSM()
            source:new XYZ({
              tileUrlFunction:function(coordinate){
                var x = 'C' + zeroFill(coordinate[1], 8, 16);
                var y = 'R' + zeroFill(-coordinate[2] - 1, 8, 16);
                var z = 'L' + zeroFill(coordinate[0], 2, 10);
                return "http://139.196.200.37:9090/map/" + z + "/" + y + "/" + x + ".jpg";//这里可以修改地图路径
              },
              projection:'EPSG:3857'
            })
          })
        ],
        view: new View({
          center: self.center,
          projection: "EPSG:4326",
          zoom: 12,
          maxZoom:16,
          minZoom:10
        })
      });
      //初始化地图时用户没有选择，地图为空。
    },
    //显示错误提示
    showResultInfo(info) {
      this.$confirm(info, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {});
    },
    //站点变化时
    handleStationChange(){
      bus.$emit("carChange",this.carSelected);
    },
  }
};
</script>


<style scoped>
#base-map {
  position: relative;
  width: 100%;
}
.condition-label {
  font-size: 16px;
}
#message {
  position: absolute;
  top: 40px;
  right: 40px;
  z-index: 999;
  text-align: center;
}
.text-wrapper {
  white-space: pre-wrap;
}
.el-form-item {
  margin-bottom: 0px;
}
</style>

</style>
