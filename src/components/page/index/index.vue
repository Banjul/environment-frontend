<template>
    <div id="home" class="base-content base-bg-color">
          <div>
            <el-form :inline="true">
              <div>
                  <el-form-item>
                      <el-select v-model="m">
                        <el-option
                          v-for="item in m_options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="c">
                      <el-option
                      v-for="item in c_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="s">
                      <el-option
                      v-for="item in s_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="o">
                      <el-option
                      v-for="item in o_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="r">
                      <el-option
                      v-for="item in r_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  
                  <el-form-item>
                  <el-button 
                  @click="screening"
                  class="base-btn"
                  type="primary"
                  >筛选</el-button>
                  </el-form-item>
                  <!-- <el-form-item>
                  <el-button 
                  @click="goToBijiao"
                  class="base-btn"
                  type="primary"
                  >比较</el-button>
                  </el-form-item> -->
              </div>
            </el-form>
          </div>
          
        <div id="indexmap">
          <dialog-bar id="dialog" class="text-wrapper" v-model="sendVal" :content="info" :content1="info1" :content2="info2" :content3="info3"></dialog-bar>
          <div id="message">
            <el-collapse v-model="activeName" accordion class="f-collapse">
              <el-collapse-item title="噪声站点监测" name="1">
                  <ul>
                      <li v-for="item in infoOptions" v-bind:key="item.label">{{item.label}}: {{item.value}}</li>
                  </ul>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
    </div> 
</template>


<script>
import "ol/ol.css";
import Vue from 'vue';
import Map from "ol/Map.js";
import View from "ol/View.js";
import XYZ from 'ol/source/XYZ';
import {easeOut} from 'ol/easing.js';
import Feature from "ol/Feature.js";
import Overlay from "ol/Overlay.js";
import Point from 'ol/geom/Point.js';
import {transform, transformExtent} from 'ol/proj.js';
import PluggableMap from 'ol/PluggableMap.js';
import {getEventPixel, forEachFeatureAtPixel} from 'ol/PluggableMap.js';
import {fromExtent as fe} from 'ol/geom/Polygon.js';
import Icon from 'ol/style/Icon.js';
import IconOptions from 'ol/style/Icon.js';
import Style from 'ol/style/Style.js';
import {Text, Fill, Circle, Stroke} from 'ol/style.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {Cluster, OSM, Vector as VectorSource} from 'ol/source.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import OverViewMap from "ol/control/OverviewMap.js";
import dialogBar from "./dialog.vue";
export default {
components:{
    'dialog-bar': dialogBar,
},
    name:"index",
data() {
    return {
      title:"系统首页",
      activeName:1,
      // 区域环境，道路交通，功能区选择一个
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
          label:"归属管理"
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
          label:"站点"
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
      r:'all_r',
      r_options:[
           {
          value:"all_r",
          label:"全市"
        },
        {
          value:"徐汇区",
          label:"徐汇"
        },{
          value:"长宁区",
          label:"长宁"
        },{
          value:"静安区",
          label:"静安"
        },{
          value:"黄浦区",
          label:"黄浦"
        },{
          value:"浦东区",
          label:"浦东"
        },{
          value:"普陀区",
          label:"普陀"
        },{
          value:"虹口区",
          label:"虹口"
        },{
          value:"杨浦区",
          label:"杨浦"
        },{
          value:"闵行区",
          label:"闵行"
        },{
          value:"宝山区",
          label:"宝山"
        },{
          value:"嘉定区",
          label:"嘉定"
        },{
          value:"金山区",
          label:"金山"
        },{
          value:"松江区",
          label:"松江"
        },{
          value:"青浦区",
          label:"青浦"
        },{
          value:"奉贤区",
          label:"奉贤"
        },{
          value:"崇明区",
          label:"崇明"
        }
      ],
      infoOptions:[
          {
              label:"总计",
              value:"1"
          },
          {
              label:"国控",
              value:"1"
          },
          {
              label:"市控",
              value:"1"
          },
          {
              label:"区控",
              value:"1"
          },
          {
              label:"手动",
              value:"1"
          },
          {
              label:"自动",
              value:"1"
          },
          {
              label:"流动",
              value:"1"
          },
          {
              label:"在线",
              value:"1"
          },
          {
              label:"离线",
              value:"1"
          },
          {
              label:"超标",
              value:"1"
          }
      ],
      datetime: "",
      vectorSource : "",
      vector_point : "",
      cluster_vector_point : "",
      jsons1 : {"type":"FeatureCollection","features":[
        {"type":"Feature","id":"001","name":"1","region":"静安区","time":"1","LeqA":"123","OverLimit":"否","M_type":"区域环境","C_type":"国控","S_type":"在线","O_status":"手动","geometry":{"type":"Point","coordinates":[121.47, 31.23]}},
        {"type":"Feature","id":"002","name":"2","region":"闵行区","time":"1","LeqA":"234","OverLimit":"否","M_type":"道路交通","C_type":"国控","S_type":"离线","O_status":"手动","geometry":{"type":"Point","coordinates":[121.386891, 31.118842]}},
        {"type":"Feature","id":"003","name":"3","region":"徐汇区","time":"1","LeqA":"453","OverLimit":"是","M_type":"功能区","C_type":"国控","S_type":"在线","O_status":"流动","geometry":{"type":"Point","coordinates":[121.443233, 31.193997]}},
        {"type":"Feature","id":"004","name":"4","region":"静安区","time":"1","LeqA":"343","OverLimit":"是","M_type":"区域环境","C_type":"市控","S_type":"离线","O_status":"手动","geometry":{"type":"Point","coordinates":[121.43116, 31.226612]}},
        {"type":"Feature","id":"005","name":"5","region":"虹口区","time":"1","LeqA":"464","OverLimit":"是","M_type":"道路交通","C_type":"市控","S_type":"在线","O_status":"流动","geometry":{"type":"Point","coordinates":[121.509923, 31.269586]}},
        {"type":"Feature","id":"006","name":"6","region":"浦东区","time":"1","LeqA":"245","OverLimit":"是","M_type":"功能区","C_type":"市控","S_type":"离线","O_status":"手动","geometry":{"type":"Point","coordinates":[121.550167, 31.226118]}},
        {"type":"Feature","id":"007","name":"7","region":"松江区","time":"1","LeqA":"234","OverLimit":"否","M_type":"区域环境","C_type":"区控","S_type":"在线","O_status":"流动","geometry":{"type":"Point","coordinates":[121.233964, 31.038181]}},
        {"type":"Feature","id":"008","name":"8","region":"奉贤区","time":"1","LeqA":"234","OverLimit":"否","M_type":"道路交通","C_type":"区控","S_type":"离线","O_status":"手动","geometry":{"type":"Point","coordinates":[121.480028, 30.923255]}},
        {"type":"Feature","id":"009","name":"9","region":"青浦区","time":"1","LeqA":"548","OverLimit":"否","M_type":"功能区","C_type":"区控","S_type":"在线","O_status":"流动","geometry":{"type":"Point","coordinates":[121.131054, 31.15346]}},
        // {"C_type": ["国控"],"S_type": "在线","name": "31010702330053","O_status": "自动","OverLimit":"否","M_type": ["4","2"],"geometry": {"coordinates": [121.449455,31.272007],"type": "Point"},"id":"31010702330053","time":"2018-11-19 20:00:00.0","type":"Feature","region": "普陀区","LeqA":"48.62"},
        ]},
      jsons :{},
      url: 'environment/station/GEOJson',
      jsons_s:　{},
      map: {}, //地图控件
      mycluster: {},
      center: [121.47, 31.23], // 地图中心
      kw: "", //搜索关键字
      select_time: "", //选择的时间
      radio: "1" ,//左边选择项
      sendVal: false,
      info:'info',
      info1:'',
      info2:'站点链接：',
      info3:{},//链接跳转的地址
    };
  },
created: function() {
    // console.log(1223);      
},
mounted: function() {
    this.res();
    
    setInterval(this.res,3600000); 
    setInterval(this.screening,3600000);
},
methods: {
    res(){
        this.$axios
             .post(
                this.url,{"type":"all"}
            ).then(
                res =>{
                    // console.log(res.data);
                    this.jsons = res.data;
                    // console.log(this.jsons);  
                    this.initMap();
                    this.screening();
                }
            ).catch(
                error => console.log(error)
            );
        console.log("res");
    },
    clickCancel(){
        console.log('点击了取消');
    },
    clickDanger(){
        console.log('这里是danger回调')
    },
    clickConfirm(){
        console.log('点击了confirm');
    },
    addOverViewMap() {
      //鹰眼控件
      var overviewMapControl = new OverViewMap({
        className: "ol-overviewmap ol-custom-overviewmap",
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        view: new View({
          projection: "EPSG:4326",
          zoom: 20
        }),
        collapseLabel: "\u00AB",
        label: "\u00BB",
        collapsed: true
      });
      // 添加控件
      this.map.addControl(overviewMapControl);
    },
    read_gjson(Gjson){
        var point = (new GeoJSON()).readFeatures(Gjson);
        // console.log(point);
        return point;
    },
    vector(p){
        var self = this;
        var P = self.read_gjson(p);   
        var svgR = "static/svgRK.svg";       
        var svgB = "static/svgBK.svg";
        var styleFunction = function(feature) {
            function svg(){
                var f = self.getItem(p.features,{"id": feature.id_});
                if (f.OverLimit=="是") return svgR;
                if (f.OverLimit=="否") return svgB;
            } 
            var styles = {"Point":[
                    new Style({
                        image: new Icon({
                            src: svg(),    
                            imgSize: [40, 40],
                            anchor: [0.375, 0.65]
                        })
                    })
            ]};

            

        return styles[feature.getGeometry().getType()];};
        self.vectorSource = new VectorSource({
            wrapX: false
        });
        self.vectorSource.addFeatures(P);
 
        self.vector_point = new VectorLayer({
        source: self.vectorSource,
        style: styleFunction
        });
        self.map.addLayer(self.vector_point);
        var radius = 0;
        // console.log(self.vectorSource);
        var start = new Date().getTime();
        var ovlist = self.getItemsindex(p.features,{"OverLimit":"是"});
        self.map.on('postcompose', function(event){
            radius+=0.2;
            radius = radius %20;
            var opacity = easeOut(2-radius/10);
            for (var j = 0,len=ovlist.length; j < len; j++){
            P[ovlist[j]].setStyle([
                new Style({
                image: new Circle({
                    radius: radius,
                    stroke: new Stroke({
                        color: 'rgba(255, 10, 10, ' + opacity + ')',
                        width: 0.3+opacity
                        })
                    })
                }),
                new Style({
                        image: new Icon({
                            src: svgR,    
                            imgSize: [40, 40], 
                            anchor: [0.375, 0.65]
                        })
                    })
            ]);
            };
        })
        // //   console.log(123413)
    },
    count(f){
        var self = this;
        function list(f,key){
            var list = [];
            for (var i=0; i<f.length; i++){
                list.push(f[i][key]);
            }
            // console.log(list);
            return list;
        };
        function count_f(list,value_list){
            var count = new Array();
            for (var i=0; i<value_list.length; i++){
                count.push(0)
            };
            for (var n=0; n<list.length; n++){
                for (var i=0; i<value_list.length; i++){    
                    if (list[n]==value_list[i]) count[i]++;
                }
            };
            // console.log(count);
            return count;
        };
        var count = new Array();
        count.push(f.length);
        count = count.concat(count_f(list(f,"C_type"),["国控","市控","区控"]));
        count = count.concat(count_f(list(f,"O_status"),["手动","自动","流动"]));
        count = count.concat(count_f(list(f,"S_type"),["在线","离线"]));
        count = count.concat(count_f(list(f,"OverLimit"),["是"]));
        for (var i=0; i<10; i++){
            self.infoOptions[i]["value"] = count[i]; 
        };
    },
    screening(){
        console.log("1")
        var self =this;
        // console.log(self.m+self.c+self.s+self.o);
        // console.log(self.getItem(self.jsons.features,{"M_type":self.m,"C_type":self.c,"S_type":self.s,"O_status":self.o}));
        var t = self.getItem_s(self.jsons.features,{"M_type":[self.m],"C_type":[self.c],"S_type":[self.s],"O_status":[self.o],"region":[self.r]})
        self.jsons_s = {"type":"FeatureCollection","features":t}; 
        self.map.removeLayer(self.vector_point);
        self.vector(self.jsons_s);
        self.map.removeLayer(self.cluster_vector_point);
        self.addCluster();
        self.visible();
        self.count(t);
        console.log("reflash");
        // console.log(self.jsons)
        //console.log(self.getItem(self.jsons.features,{"id":"009"}).geometry.coordinates);
    },
    getItem_s(arr,obj) {
        function array_contain(array, obj){
            if (array[0] == "all_m") array = ["功能区","区域环境","道路交通"];
            if (array[0] == "all_c") array = ["国控","市控","区控"];
            if (array[0] == "all_s") array = ["在线","离线"];
            if (array[0] == "all_o") array = ["手动","自动","流动"];
            if (array[0] == "all_r") array = ["徐汇区","长宁区","静安区","黄浦区","浦东区","普陀区","虹口区","杨浦区","闵行区","宝山区","嘉定区","金山区","松江区","青浦区","奉贤区","崇明区"];
            // console.log(array);
            // obj = Array.from(obj);
            if (typeof(obj) != "object") obj = [obj];
            // console.log(obj);
            for (var i = 0; i < array.length; i++){
                for (var j = 0; j< obj.length; j++){
                    // if (obj.findIndex(function(value){ return value==array[i]})) return true;}
                    // console.log(array[i],obj[j]);
                    if (array[i]==obj[j]) {return true;}}
            };
            // console.log("false");
            return false;
        };
        var t = new Array();
        arrFor: for (var i = 0; i < arr.length; i++) {
            var a=0;
            for (var n in obj){
                // console.log(arr[i][n],obj[n])
                // if (arr[i][n] == obj[n]){
                // console.log(array_contain(obj[n],arr[i][n]));        
                if (array_contain(obj[n],arr[i][n])){
                    a++;
                    // console.log(i,a);
                    if (a==5){
                        // console.log(arr[i]);
                        t.push(arr[i])}
                }
            };
        }
        // console.log(t);
        return t;
    },
    getItem(arr,obj) {
        arrFor: for (var i = 0; i < arr.length; i++) {
        for (var n in obj)
            if (arr[i][n]!=obj[n])
                continue arrFor;
        return arr[i];
        }
    }, 
    getItemsindex(arr,obj) {
        var t= new Array();
        arrFor: for (var i = 0; i < arr.length; i++) {
            for (var n in obj){
                if (arr[i][n]!=obj[n])
                    continue;
                else {t.push(i)};}
        }
        // console.log(t);
        return t;
    },
    dialog(){
        var self = this;
        self.map.on('click',function(e){
            var pixel = self.map.getEventPixel(e.originalEvent);
            // console.log(pixel);
            if (self.sendVal) self.sendVal = false;
            self.map.forEachFeatureAtPixel(pixel,function(feature){
                var p = self.getItem(self.jsons.features,{"id":feature.id_});
                var splitt = function(A){
                    var a='';
                    for(var i=0;i<A.length;i++){
                        a+=A[i]
                        if(i!=A.length-1){a+='/'}
                    }
                    return a
                };
                var m_transform = function(A){
                    for(var i=0;i<A.length;i++){
                        var B=[];
                        // console.log(A);
                        if(A[i] =='0') B.push('区域环境 0');
                        if(A[i] =='1') B.push('道路交通 1');
                        if(A[i] =='2') B.push('功能区 2');
                        // console.log(B)
                        return B
                    }
                };
                self.info  = "站点名称："+ p.name + '\n' +
                             "功能类型："+ splitt(m_transform(p.M_type))+ '\n'+
                             "LeqA值："+ p.LeqA+ '\n'+
                             "当前报警指标：" + p.OverLimitIndex;
                
                self.info1 = "时间："+ p.time + '\n'+
                             "区域属性："+ splitt(p.C_type) +'\n'+
                             "Vdr值："+ p.Vdr + '\n'+
                             "报警指标数值：" + p.OverLimitNum;
                             
                // self.info2 = ；
                             
                self.info3 = { 
                    station_code: p.id , 
                    station_name: p.name, 
                    status:p.O_status
                }
                            // "流动状态："+ p.O_status +
                // console.log(feature);
                if (!self.sendVal) self.sendVal = true;  
                });
        });
    },
    addCluster(){  
        var self = this;
        var v_features = self.vector_point.getSource().getFeatures();
        var count = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        for (var n in v_features){
            // console.log(v_features[n].id_);
            var item = self.getItem(self.jsons.features,{"id": v_features[n].id_});
            if (item.region == "黄浦区")　count[0]++;
            if (item.region == "徐汇区")　count[1]++;
            if (item.region == "长宁区")　count[2]++;
            if (item.region == "静安区")　count[3]++;
            if (item.region == "普陀区")　count[4]++;
            if (item.region == "虹口区")　count[5]++;
            if (item.region == "杨浦区")　count[6]++;
            if (item.region == "浦东区")　count[7]++;
            if (item.region == "闵行区")　count[8]++;
            if (item.region == "宝山区")　count[9]++;
            if (item.region == "嘉定区")　count[10]++;
            if (item.region == "金山区")　count[11]++;
            if (item.region == "松江区")　count[12]++;
            if (item.region == "青浦区")　count[13]++;
            if (item.region == "奉贤区")　count[14]++;
            if (item.region == "崇明区")　count[15]++
        };
        // console.log(count);
        
        
        var cluster_jsons = {"type":"FeatureCollection","features":[
            {"type":"Feature","id":"1", "name":"黄浦区","count":count[0],"geometry":{"type":"Point","coordinates":[121.49105,31.237369]}},
            {"type":"Feature","id":"2", "name":"徐汇区","count":count[1],"geometry":{"type":"Point","coordinates":[121.442685,31.194751]}},
            {"type":"Feature","id":"3", "name":"长宁区","count":count[2],"geometry":{"type":"Point","coordinates":[121.430876,31.226667]}},
            {"type":"Feature","id":"4", "name":"静安区","count":count[3],"geometry":{"type":"Point","coordinates":[121.453761,31.23405]}},
            {"type":"Feature","id":"5", "name":"普陀区","count":count[4],"geometry":{"type":"Point","coordinates":[121.402129,31.255592]}},
            {"type":"Feature","id":"6", "name":"虹口区","count":count[5],"geometry":{"type":"Point","coordinates":[121.51112,31.270402]}},
            {"type":"Feature","id":"7", "name":"杨浦区","count":count[6],"geometry":{"type":"Point","coordinates":[121.531921,31.265522]}},
            {"type":"Feature","id":"8", "name":"浦东区","count":count[7],"geometry":{"type":"Point","coordinates":[121.550822,31.227763]}},
            {"type":"Feature","id":"9", "name":"闵行区","count":count[8],"geometry":{"type":"Point","coordinates":[121.387518,31.118477]}},
            {"type":"Feature","id":"10","name":"宝山区","count":count[9],"geometry":{"type":"Point","coordinates":[121.495955,31.410914]}},
            {"type":"Feature","id":"11","name":"嘉定区","count":count[10],"geometry":{"type":"Point","coordinates":[121.271855,31.381305]}},
            {"type":"Feature","id":"12","name":"金山区","count":count[11],"geometry":{"type":"Point","coordinates":[121.34828,30.748958]}},
            {"type":"Feature","id":"13","name":"松江区","count":count[12],"geometry":{"type":"Point","coordinates":[121.234117,31.038521]}},
            {"type":"Feature","id":"14","name":"青浦区","count":count[13],"geometry":{"type":"Point","coordinates":[121.130489,31.156506]}},
            {"type":"Feature","id":"15","name":"奉贤区","count":count[14],"geometry":{"type":"Point","coordinates":[121.480461,30.924288]}},
            {"type":"Feature","id":"16","name":"崇明区","count":count[15],"geometry":{"type":"Point","coordinates":[121.40388,31.629301]}},
        ]};
        // console.log(cluster_jsons.features);
 
        var styleFunction = function(feature) {
            // console.log(feature.id_);
            var f = self.getItem(cluster_jsons.features,{"id": feature.id_});
            // console.log(f.count);
            return new Style({ 
            image : new Circle({
                    radius : 25,
                    fill : new Fill({color: [255, 153, 0, 0.6]}) }),
            text : new Text({text: f.count.toString() ,fill:new Fill({color: '#fff'}),stroke: new Stroke({color: 'rgba(0, 0, 0, 0.6)',width: 3})})
            });
        };
        var cluster_vectorSource = new VectorSource({
            features: self.read_gjson(cluster_jsons)
        });
        self.cluster_vector_point = new VectorLayer({
            source: cluster_vectorSource,
            style: styleFunction
        });
        self.map.addLayer(self.cluster_vector_point);
        // self.cluster_vector_point.setVisible(false)
    },  
    visible() {
        var self =this;
        self.cluster_vector_point.setVisible(self.map.getView().getZoom() <=11);
        self.vector_point.setVisible(self.map.getView().getZoom() >11);
    },
    initMap() {
        // 创建地图实例                                                             
        var self = this;
       
        function zeroFill(num, len, radix) {
            var str = num.toString(radix || 10) ;
            while (str.length < len) {
                str = "0" + str;
            }
            return str;
        };
        self.map = new Map({
        target: "indexmap",
        layers: [
            new TileLayer({
            // source: new OSM(),
                source: new XYZ({
                    //  url:'http://webrd03.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
                    tileUrlFunction: function (coordinate) {
                        var x = 'C' + zeroFill(coordinate[1], 8, 16);
                        var y = 'R' + zeroFill(-coordinate[2] - 1, 8, 16);
                        var z = 'L' + zeroFill(coordinate[0], 2, 10);
                        // console.log( "_alllayers/" + z + "/" + y + "/" + x + ".png");//这里可以修改地图路径
                        return "http://139.196.200.37:9090/map/" + z + "/" + y + "/" + x + ".jpg";//这里可以修改地图路径
                        
                    },
                    projection: 'EPSG:3857'
                })
            })
        ],
        view: new View({
            // center: transform(self.center, 'EPSG:4326', 'EPSG:3857'),
            center: self.center,
            projection: "EPSG:4326",
            zoom: 12,
            minzoom: 11,
            maxzoom: 17
        })
        });
        // console.log(self.jsons);
        self.vector(self.jsons);
        self.addOverViewMap();
        self.dialog();
        self.addCluster();
        self.cluster_vector_point.setVisible(false);
        self.map.getView().on('change:resolution', function(){
        self.cluster_vector_point.setVisible(this.getZoom() <=11);
        self.vector_point.setVisible(this.getZoom() >11)})
        self.count(self.jsons.features);
    }, 
    handleSearchBtn() {},
    search() {
      this.is_search = true;
      this.$router.push("/historysitetoday");
      console.log("search");
    },
    goToForm() {
      alert("表单");
    },
    goToBijiao() {
      alert("比较");
    },
    showTongji() {
      this.tongji = !this.tongji;
    }
  }
}
</script>

<style scoped>
/*工具栏*/
/* .tools{
  margin-top:5px;
  margin-bottom: 3px;
} */
#indexmap {
  width: 100%;
}
.ol-custom-overviewmap .ol-custom-overviewmap .ol-uncollapsible {
  bottom: auto;
  left: auto;
  right: 0;
  top: 0;
}
.ol-custom-overviewmap:not(.ol-collapsed) {
  border: 1px solid black;
}
.ol-custom-overviewmap .ol-overviewmap-map {
  border: none;
  width: 300px;
}
.ol-custom-overviewmap .ol-overviewmap-box {
  border: 2px solid red;
}
.ol-custom-overviewmap:not(.ol-uncollapsed) button {
  bottom: auto;
  left: auto;
  right: 1px;
  top: 1px;
}
/*小框*/
#message {
  position: absolute;
  top: 5px;
  right: 10px;
  z-index: 999; 
  text-align: center;
}
#indexmap{
    position: relative
}
.el-collapse-item__header,.el-collapse,.el-collapse-item__content,.el-collapse-item__wrap{
  color:yellow;
  /* border-radius: 10px; */
  font-size: 22px;
  background-color: rgba(0,0,0, 0.3)
}
.el-collapse-item__arrow .el-icon-arrow-right{
  padding: 0;
  margin: 0;
}
.text-wrapper {
  white-space: pre-wrap;
}
.el-form-item {
    width: 200px;
    margin-bottom: 0px;
}
</style>
