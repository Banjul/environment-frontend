import Vue from 'vue';
import Router from 'vue-router';
import { resolve } from 'url';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/',
            component: resolve => require(['../components/layout/Home.vue'], resolve),
            meta: { title: '描述' },
            children: [
                {
                    path: '/index',
                    component: resolve => require(['../components/page/index/index.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/compare1',
                    component: resolve => require(['../components/page/compare/compare1.vue'], resolve),
                    meta: { title: '多站点对比' }
                },
                {
                    path: '/compare2',
                    component: resolve => require(['../components/page/compare/compare2.vue'], resolve),
                    meta: { title: '单站点对比' }
                },
                {
                    path: '/compare3',
                    component: resolve => require(['../components/page/compare/compare3.vue'], resolve),
                    meta: { title: '昼夜对比' }
                },
                {
                    path: '/trackmap',
                    component: resolve => require(['../components/page/graph/trackmap.vue'], resolve),
                    meta: { title: '轨迹车' }
                },
                {
                    path: '/hotmap',
                    component: resolve => require(['../components/page/graph/hotmap.vue'], resolve),
                    meta: { title: '影响范围' }
                },
                {
                    path: '/realtime',
                    component: resolve => require(['../components/page/table/realtime.vue'], resolve),
                    meta: { title: '实时数据' }
                },
                {
                    path: '/singlepage',
                    component: resolve => require(['../components/page/table/singlepage.vue'], resolve),
                    meta: { title: '实时报警' }
                },
                {
                    path: '/realwarning',
                    component: resolve => require(['../components/page/table/realwarning.vue'], resolve),
                    meta: { title: '综合查询' }
                },
                {
                    path: '/comprehensive',
                    component: resolve => require(['../components/page/table/comprehensive.vue'], resolve),
                    meta: { title: '综合查询' }
                },
                {
                    path: '/warning',
                    component: resolve => require(['../components/page/table/warning.vue'], resolve),
                    meta: { title: '报警信息查询' }
                },
                {
                    path: '/online',
                    component: resolve => require(['../components/page/table/online.vue'], resolve),
                    meta: { title: '离线记录查询' }
                },
                {
                    path:'/userinfo',
                    component: resolve => require(['../components/page/user/userinfo.vue'],resolve),
                    meta:{title:'用户信息管理'}
                },
                {
                    path:'/userrole',
                    component: resolve => require(['../components/page/user/userrole.vue'],resolve),
                    meta:{title:'角色信息管理'}
                },
                {
                    path:'/usergroup',
                    component: resolve => require(['../components/page/user/usergroup.vue'],resolve),
                    meta:{title:'用户组管理'}
                },
                {
                    path:'/noise',
                    component: resolve => require(['../components/page/system/noise.vue'],resolve),
                    meta:{title:'噪声点管理'}
                },
                {
                    path:'/noisecar',
                    component: resolve => require(['../components/page/system/noisecar.vue'],resolve),
                    meta:{title:'流动站点管理'}
                },
                {
                    path:'/company',
                    component: resolve => require(['../components/page/system/company.vue'],resolve),
                    meta:{title:'企业信息管理'}
                },
                {
                    path:'/opermain',
                    component: resolve => require(['../components/page/system/opermain.vue'],resolve),
                    meta:{title:'运维商管理'}
                },
                {
                    path: '/report1',
                    component: resolve => require(['../components/page/report/report1.vue'], resolve),
                    meta: { title: '01-报表' }
                },
                {
                    path: '/report2',
                    component: resolve => require(['../components/page/report/report2.vue'], resolve),
                    meta: { title: '02-报表' }
                },
                {
                    path: '/report3',
                    component: resolve => require(['../components/page/report/report3.vue'], resolve),
                    meta: { title: '03-报表' }
                },
                {
                    path: '/report4',
                    component: resolve => require(['../components/page/report/report4.vue'], resolve),
                    meta: { title: '04-报表' }
                },
                {
                    path: '/report5',
                    component: resolve => require(['../components/page/report/report5.vue'], resolve),
                    meta: { title: '05-报表' }
                },
                {
                    path: '/report6',
                    component: resolve => require(['../components/page/report/report6.vue'], resolve),
                    meta: { title: '06-报表' }
                },
                {
                    path: '/report7',
                    component: resolve => require(['../components/page/report/report7.vue'], resolve),
                    meta: { title: '07-报表' }
                },
                {
                    path: '/report8',
                    component: resolve => require(['../components/page/report/report8.vue'], resolve),
                    meta: { title: '08-报表' }
                },
                {
                    path: '/report9',
                    component: resolve => require(['../components/page/report/report9.vue'], resolve),
                    meta: { title: '09-报表' }
                },
                {
                    path: '/demo',
                    component: resolve => require(['../components/page/demo/demo.vue'], resolve),
                    meta: { title: 'demo页面' }
                },
                {
                    path: '/echarts',
                    component: resolve => require(['../components/page/demo/vecharts.vue'], resolve),
                    meta: { title: 'echarts' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/404/403.vue'], resolve),
                    meta: { title: '403' }
                },
                {
                    path: '/info',
                    component: resolve => require(['../components/page/login/info.vue'], resolve),
                    meta: { title: '个人信息' }
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/login/login.vue'], resolve),
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
