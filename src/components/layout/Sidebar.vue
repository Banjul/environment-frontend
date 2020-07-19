<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#1f1d1d"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title" class="sidebar-font-size">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title" class="sidebar-font-size">{{ subItem.title }}</template>
                <el-menu-item
                  v-if="subItem.checked"
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                  class="sidebar-font-size"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item
                v-else-if="subItem.checked"
                :index="subItem.index"
                :key="subItem.index"
                class="sidebar-font-size"
              >{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" v-if="item.checked">
            <i :class="item.icon"></i>
            <span slot="title" class="sidebar-font-size">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "./bus.js";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "fa fa-home color",
          index: "index",
          title: "系统首页",
          checked: true
        },
        {
          icon: "fa fa-area-chart color",
          index: "2",
          title: "比较统计",
          subs: [
            {
              index: "compare1",
              title: "多站点对比",
              checked: true
            },
            {
              index: "compare2",
              title: "单站点对比",
              checked: true
            },
            {
              index: "compare3",
              title: "昼夜对比",
              checked: true
            }
          ]
        },
        {
          icon: "fa fa-list color",
          index: "comprehensive",
          title: "综合查询",
          checked: true
        },
        {
          icon: "fa fa-table color",
          index: "4",
          title: "数据表格",
          subs: [
            {
              index: "realtime",
              title: "实时数据表",
              checked: true
            },
            {
              index: "singlepage",
              title: "单站点信息查询",
              checked: true
            },
            {
              index: "warning",
              title: "报警信息查询",
              checked: true
            }
          ]
        },
        {
          icon: "fa fa-map-o color",
          index: "5",
          title: "流动站点",
          subs: [
            {
              index: "trackmap",
              title: "流动站点轨迹图",
              checked: true
            }
          ]
        },
        {
          icon: "fa fa-user-o color",
          index: "user",
          title: "用户管理",
          checked: true,
          subs: [
            {
              index: "userinfo",
              title: "用户信息管理",
              checked: true
            },
            {
              index: "userrole",
              title: "角色信息管理",
              checked: true
            }
          ]
        },
        {
          icon: "fa fa-table fa-fw color",
          index: "report",
          title: "报表管理",
          subs: [
            {
              index: "report1",
              title: "01-报表",
              checked: true
            },
            {
              index: "report2",
              title: "02-报表",
              checked: true
            },
            {
              index: "report3",
              title: "03-报表",
              checked: true
            },
            {
              index: "report4",
              title: "04-报表",
              checked: true
            },
            {
              index: "report5",
              title: "05-报表",
              checked: true
            },
            {
              index: "report6",
              title: "06-报表",
              checked: true
            },
            {
              index: "report7",
              title: "07-报表",
              checked: true
            },
            {
              index: "report8",
              title: "08-报表",
              checked: true
            },
            {
              index: "report9",
              title: "09-报表",
              checked: true
            }
          ]
        },
        {
          icon: "fa fa-cog color",
          index: "system",
          title: "系统管理",
          subs: [
            // {
            //   index:"dataverify",
            //   title:"数据审核"
            // },{
            //   index:"indexconfig",
            //   title:"监测指标配置"
            // },{
            //   index:"missdata",
            //   title:"缺失值补充"
            // },
            {
              index: "noise",
              title: "噪声点管理",
              checked: true
            },
            {
              index: "noisecar",
              title: "流动站点管理",
              checked: true
            },
            {
              index: "company",
              title: "企业信息管理",
              checked: true
            },
            {
              index: "opermain",
              title: "运维商管理",
              checked: true
            }
          ]
        }
      ],
      checkedmenu: []
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
      console.log(this.items)
    });
    // console.log(this.items);
      let menuList = JSON.parse(sessionStorage.getItem("menu_list") || "[]");
      menuList.forEach(menu => {
        if (!menu.checked) {
          console.log(menu.checked)
          this.items.forEach(item => {
            if (item.subs) {
              item.subs.forEach(sub => {
                if (sub.title === menu.name) {
                  console.log(sub.title)
                  sub.checked = menu.checked;
                }
              });
            } else {
              item.checked = menu.checked;
            }
          });
        }
      });
  }
};
</script>

<style scoped>
.color {
  color: #ffdd03;
}
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 50px;
  bottom: 0;
  overflow-y: scroll;
  background-color: #1f1d1d;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.sidebar > ul {
  height: auto;
}
.sidebar-font-size {
  font-size: 20px;
  color: #ffffff;
}
</style>
