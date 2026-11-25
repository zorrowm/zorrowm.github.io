const menuConfigSxkj = [
  {
    name: '内网访问方式',
    icon: 'icon-a-Layermanagement_3',
    key: 'innerAccess',
    children: [
      {
        name: '自研',
        key: 'innerAccess-selfDeveloped',
        children: [
          {
            name: 'skysight综合展示系统',
            path: 'http://192.168.10.97:1000/login.html',
            info: '研发负责人：戴龙｜客户：四象科技｜备注：admin/123456'
          },
          {
            name: 'skysight卫星运控系统 - 新',
            path: '【孙强重构测试版】http://192.168.10.26:81',
            info: '研发负责人：孙强｜客户：四象科技'
          },
          {
            name: 'skysight卫星需求筹划系统',
            path: 'http://192.168.10.97:1014/',
            info: '研发负责人：戴龙｜客户：四象科技'
          },
          {
            name: '【四象爱数3D地球家】三维球',
            path: 'http:// 192.168.10.103:80/',
            info: '研发负责人：戴龙｜客户：四象科技｜备注：http://223.94.44.23:5100/'
          },
          {
            name: '【四象爱数3D地球家】-城市白膜',
            path: 'http:// 192.168.10.103:80/AsGlobe-buildings/',
            info: '研发负责人：戴龙｜客户：四象科技｜备注：http://223.94.44.23:5100/AsGlobe-buildings/'
          },
          {
            name: '卫星过境分析+卫星仿真列表',
            path: 'http://192.168.3.44:1007/',
            info: '研发负责人：戴龙｜客户：四象科技｜备注：(仅北京网络访问)上海信息中心demo成型后，可以地址更新'
          },
          {
            name: '卫星过境分析+卫星仿真列表',
            path: 'http://192.168.3.44:1012/',
            info: '研发负责人：戴龙｜客户：四象科技｜备注：(仅北京网络访问)上海信息中心demo成型后，可以地址更新'
          },
          {
            name: '智能遥感数据应用平台',
            path: 'http://192.168.10.5:8018/#/business/data',
            info: '研发负责人：戴龙｜客户：四象科技｜备注：admin/12345678'
          },
          {
            name: 'ASMap遥感数据综合处理软件',
            path: 'ASMap-桌面应用',
            info: '研发负责人：康曼｜客户：四象科技'
          },
          {
            name: 'osgearth应用平台',
            path: '桌面应用',
            info: '研发负责人：周瑶｜客户：四象科技'
          },
          {
            name: '扬尘源',
            path: 'http://192.168.10.5:8072/',
            info: '研发负责人：戴龙｜客户：四象科技｜备注：admin/12345678'
          },
          {
            name: 'Sea-Sight',
            path: 'http://192.168.0.200:8063/',
            info: '研发负责人：戴龙｜客户：四象科技｜备注：admin/123456  ；研发中'
          }
        ]
      },
      {
        name: '项目',
        key: 'innerAccess-project',
        children: [
          {
            name: '卫星仿真（雷）',
            path: 'http://map.sxastech.com:3014/webWXFZ/',
            info: '研发负责人：戴龙｜客户：四象科技｜备注：项目已经结束，维护成本高，已经废弃'
          },
          {
            name: '地面雷达三维场景辅助软件',
            path: 'http://192.168.3.100:4008/',
            info: '研发负责人：张宇航｜客户：二十九所｜备注：机子已废弃'
          },
          {
            name: '军医大风险项目',
            path: 'http://192.168.3.100:6600/asglobe-jz/',
            info: '研发负责人：戴龙｜客户：军医大｜备注：机子已废弃'
          },
          {
            name: '多源情报融合处理系统',
            path: 'http://192.168.10.53:8058/',
            info: '研发负责人：康曼｜客户：中航（成都）无人机系统股份有限公司｜备注：admin/123456（重新部署中）'
          },
          {
            name: '舰船目标标注工具',
            path: 'ShpImageLabel-桌面应用',
            info: '研发负责人：康曼｜客户：中国人民解放军战略支援部队航天工程大学'
          },
          {
            name: '智能目标检测软件',
            path: '桌面应用-北京电脑部署',
            info: '研发负责人：康曼｜客户：中国人民解放军军事科学院（61所）'
          },
          {
            name: '四川军高分',
            path: '桌面应用',
            info: '研发负责人：康曼｜客户：二十九所'
          },
          {
            name: '上海军高分',
            path: '北京部署，远程访问',
            info: '研发负责人：康曼｜客户：遥聚信息服务（上海）有限公司'
          },
          {
            name: '保险行业农险信息系统',
            path: 'http://192.168.10.101:8099',
            info: '研发负责人：康曼｜客户：锦泰财产保险股份有限公司｜备注：admin/Ejintai.com'
          },
          {
            name: '四象银保遥感应用系统',
            path: 'http://192.168.10.5:7077/#/presentation',
            info: '研发负责人：周瑶｜客户：太保｜备注：研发中'
          },
          {
            name: '数据管理系统',
            path: '网页',
            info: '研发负责人：周瑶｜客户：上海信息中心｜备注：未部署'
          },
          {
            name: '轨道仿真推演平台',
            path: '网页',
            info: '研发负责人：周瑶｜客户：上海信息中心｜备注：研发中'
          },
          {
            name: '目标识别系统',
            path: '目标识别系统-桌面应用',
            info: '研发负责人：康曼｜客户：四川天奥空天信息技术有限公司'
          },
          {
            name: '基于雷达干涉测量技术的地质灾害设施形变监测系统',
            path: 'Mainmodule-桌面应用',
            info: '研发负责人：周瑶｜客户：二十九所'
          },
          {
            name: '电网二期项目',
            path: '网页',
            info: '研发负责人：周瑶｜客户：国家电网｜备注：未部署'
          },
          {
            name: '矿大数字底座',
            path: '网页',
            info: '研发负责人：周瑶｜客户：中国矿业大学｜备注：研发中'
          },
          {
            name: '济南机场',
            path: 'http://192.168.10.101:8020/',
            info: '研发负责人：戴龙｜客户：济南大学'
          },
          {
            name: '绵阳科技城新区卫星遥感监测平台',
            path: 'http://192.168.10.146:8017',
            info: '研发负责人：康曼｜客户：绵阳新区政府｜备注：admin/123456，更新4/24期'
          },
          {
            name: '中科大脑 - 土壤墒情监测系统',
            path: 'http://192.168.10.8:8031/#/login',
            info: '研发负责人：周瑶｜客户：长清基地'
          },
          {
            name: '中科大脑 - 虫情监测系统',
            path: 'http://192.168.10.8:8032/#/login',
            info: '研发负责人：周瑶｜客户：长清基地'
          },
          {
            name: '中科大脑 - 灾害风险监测系统',
            path: 'http://192.168.10.8:8033/#/login',
            info: '研发负责人：周瑶｜客户：长清基地'
          },
          {
            name: '中科大脑 - 苗情监测系统',
            path: 'http://192.168.10.8:8034/#/login',
            info: '研发负责人：周瑶｜客户：长清基地'
          },
          {
            name: '中科大脑 - 农业资源调查系统',
            path: 'http://192.168.10.8:8035/#/login',
            info: '研发负责人：周瑶｜客户：长清基地'
          },
          {
            name: '中科大脑 - 收后综合跟踪评估系统',
            path: 'http://192.168.10.8:8036/#/login',
            info: '研发负责人：周瑶｜客户：长清基地'
          },
          {
            name: '中科大脑 - 农业保险精细化管理系统',
            path: 'http://192.168.10.8:8037/#/login',
            info: '研发负责人：周瑶｜客户：长清基地'
          },
          {
            name: '中科大脑 - 作物类型自动识别系统',
            path: 'http://192.168.10.8:8038/#/login',
            info: '研发负责人：周瑶｜客户：长清基地'
          },
          {
            name: '中科大脑 - 作物综合估产系统',
            path: 'http://192.168.10.8:8039/#/login',
            info: '研发负责人：周瑶｜客户：长清基地'
          },
          {
            name: '中科大脑 - 收后综合调查系统',
            path: 'http://192.168.10.8:8040/#/login',
            info: '研发负责人：周瑶｜客户：长清基地'
          },
          {
            name: '中科大脑 - 气象监测系统',
            path: 'http://192.168.10.8:8041/#/login',
            info: '研发负责人：周瑶｜客户：长清基地'
          },
          {
            name: '德胜论坛',
            path: 'http://192.168.10.5:8301/',
            info: '研发负责人：周瑶｜客户：德胜论坛'
          },
          {
            name: '目标库二期',
            path: 'https://192.168.10.33',
            info: '研发负责人：周瑶｜客户：四象科技'
          },
          {
            name: '中储粮',
            path: 'http://192.168.10.5:8549',
            info: '研发负责人：未填写负责人｜客户：四象科技'
          },
          {
            name: '鹤山农场',
            path: 'http://192.168.10.5:8547',
            info: '研发负责人：未填写负责人｜客户：四象科技'
          },
          {
            name: '中科飞鹏',
            path: 'http://192.168.10.9:8043',
            info: '研发负责人：未填写负责人｜客户：四象科技'
          }
        ]
      },
      {
        name: '售前方案',
        key: 'innerAccess-presale',
        children: [
          {
            name: '风险专题图',
            path: 'http://192.168.10.103/FXPG',
            info: '研发负责人：戴龙'
          },
          {
            name: '交通银行-卫星遥感-农业贷款',
            path: 'http://192.168.10.103:8080/BocomCode/',
            info: '研发负责人：戴龙｜客户：交通银行'
          },
          {
            name: '地产信贷',
            path: 'http://192.168.10.5:8032/#/gis',
            info: '研发负责人：戴龙'
          },
          {
            name: '遥感及多源数据境外投资孪生平台',
            path: 'http://192.168.10.103/abordAssetRisk/',
            info: '研发负责人：戴龙'
          },
          {
            name: '智慧矿山',
            path: 'http://192.168.10.5:8035/#/data-screen/homeScreen',
            info: '研发负责人：周瑶｜客户：四象科技'
          },
          {
            name: '矿区数据综合展示',
            path: 'http://192.168.10.103/3.4v/?config=kuangqu.json',
            info: '研发负责人：戴龙｜客户：中国矿业大学'
          },
          {
            name: '矿宇宙',
            path: 'http://192.168.10.103/kuangMeta/',
            info: '研发负责人：戴龙｜客户：中国矿业大学'
          },
          {
            name: '桂林森林防火',
            path: 'http://192.168.10.103:82/',
            info: '研发负责人：戴龙'
          },
          {
            name: '绵茂高速',
            path: 'http://192.168.10.103/3.4v/?config=mianmao.json',
            info: '研发负责人：康曼｜客户：德阳桥梁隧道事务中心'
          },
          {
            name: 'AsIntelli',
            path: '桌面应用',
            info: '研发负责人：康曼｜客户：马来西亚'
          }
        ]
      },
      {
        name: '合作',
        key: 'innerAccess-cooperation',
        children: [
          {
            name: '数据资产对接',
            path: '数据接口',
            info: '研发负责人：周瑶｜客户：企企云'
          },
          {
            name: 'PIE-Engine平台数据对接',
            path: '数据接口',
            info: '研发负责人：周瑶｜客户：航天宏图'
          }
        ]
      }
    ]
  },
  {
    name: '外网访问方式',
    icon: 'icon-a-Layermanagement_3',
    key: 'outerAccess',
    children: [
      {
        name: '自研',
        key: 'outerAccess-selfDeveloped',
        children: [
          {
            name: 'skysight卫星运控系统 - 新',
            path: 'http://223.94.44.23:818',
            info: '研发负责人：孙强｜客户：四象科技'
          },
          {
            name: 'skysight卫星运控系统 - 旧',
            path: '【李强版】 http://controls.sxastech.com',
            info: '研发负责人：孙强｜客户：四象科技'
          },
          {
            name: 'skysight共享服务分系统',
            path: 'https://share.skysight.com.cn/query',
            info: '研发负责人：周瑶｜客户：四象科技'
          },
          {
            name: '【四象爱数3D地球家】三维球',
            path: 'http://map.sxastech.com:5100/',
            info: '研发负责人：戴龙｜客户：四象科技｜备注：http://223.94.44.23:5100/'
          },
          {
            name: '【四象爱数3D地球家】-城市白膜',
            path: 'http://map.sxastech.com:5100/AsGlobe-buildings/',
            info: '研发负责人：戴龙｜客户：四象科技｜备注：http://223.94.44.23:5100/AsGlobe-buildings/'
          },
          {
            name: '智能遥感数据应用平台',
            path: 'http://223.94.44.23:8018/#/business/data',
            info: '研发负责人：戴龙｜客户：四象科技｜备注：admin/12345678'
          },
          {
            name: 'skysight官网',
            path: 'https://skysight.com.cn/',
            info: '研发负责人：周瑶｜客户：四象科技'
          },
          {
            name: '扬尘源',
            path: 'http://223.94.44.23:8072/',
            info: '研发负责人：戴龙｜客户：四象科技｜备注：admin/12345678'
          },
          {
            name: 'Sea-Sight',
            path: 'http://223.94.44.23:28063',
            info: '研发负责人：戴龙｜客户：四象科技｜备注：admin/123456  ；研发中'
          }
        ]
      },
      {
        name: '项目',
        key: 'outerAccess-project',
        children: [
          {
            name: '保险行业农险信息系统',
            path: 'http://223.94.44.23:8099/#/home',
            info: '研发负责人：康曼｜客户：锦泰财产保险股份有限公司｜备注：admin/Ejintai.com'
          },
          {
            name: '遥感影像数据应用处理系统',
            path: 'http://101.39.206.138:8015/',
            info: '研发负责人：康曼｜客户：北京观势空间信息技术有限公司｜备注：暂时无法访问，待更新【admin/12345678】'
          },
          {
            name: '济南机场',
            path: 'http://223.94.44.23:8020/',
            info: '研发负责人：戴龙｜客户：济南大学'
          },
          {
            name: '绵阳科技城新区卫星遥感监测平台',
            path: 'http://223.94.44.23:8013/',
            info: '研发负责人：康曼｜客户：绵阳新区政府｜备注：admin/123456，更新4/24期'
          },
          {
            name: '德胜论坛',
            path: 'http://223.94.44.23:8301/',
            info: '研发负责人：周瑶｜客户：德胜论坛'
          },
          {
            name: '宏观大数据平台二期',
            path: 'https://datax.skysight.com.cn/#/welcome',
            info: '研发负责人：周瑶｜客户：四象科技'
          },
          {
            name: '中储粮',
            path: 'http://223.94.44.23:18549',
            info: '研发负责人：未填写负责人｜客户：四象科技'
          },
          {
            name: '鹤山农场',
            path: 'http://223.94.44.23:18547',
            info: '研发负责人：未填写负责人｜客户：四象科技'
          },
          {
            name: '中科飞鹏',
            path: 'http://223.94.44.23:28043',
            info: '研发负责人：未填写负责人｜客户：四象科技'
          }
        ]
      },
      {
        name: '售前方案',
        key: 'outerAccess-presale',
        children: [
          {
            name: '沉降水淹分析',
            path: 'http://map.sxastech.com:5100/3.4v/?config=chenjiang.json',
            info: '研发负责人：康曼｜客户：中移物联网'
          },
          {
            name: '遥感及多源数据境外投资孪生平台',
            path: 'http://map.sxastech.com:5100/abordAssetRisk/',
            info: '研发负责人：戴龙'
          },
          {
            name: '矿区数据综合展示',
            path: 'http://map.sxastech.com:5100/3.4v/?config=kuangqu.json',
            info: '研发负责人：戴龙｜客户：中国矿业大学'
          },
          {
            name: '矿宇宙',
            path: 'http://map.sxastech.com:5100/kuangMeta/',
            info: '研发负责人：戴龙｜客户：中国矿业大学'
          },
          {
            name: '绵茂高速',
            path: 'http://map.sxastech.com:5100/3.4v/?config=mianmao.json',
            info: '研发负责人：康曼｜客户：德阳桥梁隧道事务中心'
          }
        ]
      }
    ]
  }
];

// window.menus = menuConfigSxkj;
export default menuConfigSxkj;
