<template></template>

<script>
import baseline from "../../base/baseline.vue";
export default {
  name: "realwarning",
  components: {
    baseline
  },
  data() {
    return {
      urlnewwarning: "environment/warning/queryNewWarning",
      timeid: "", //一个定时器Id
      warningStationData: [],
    };
  },
  mounted() {
    var timeid = this.timeid; //在下面的函数中this指向会发生变化
    // 刷新页面的时候删除之前设置的定时器
    window.onbeforeunload = function(event) {
      window.clearTimeout(timeid);
    };
    this.getdata();
  },
  methods: {
    getdata() {
      // 刷新定时器
      var timeid = this.timeid;
      window.clearTimeout(timeid);
      this.$axios.get(this.urlnewwarning).then(res => {
        this.warningStationData = res.data.realWarning;
      });
      console.log(timeid);
      var timeout = 1200000; //设置定时器时间
      this.timeid = setTimeout(this.getdata, timeout);
    }
  }
};
</script>


