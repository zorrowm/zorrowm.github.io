/**
 * 通用的 V1.2,针对0.3.3以上版本
 */
const SysConfig = {
  //#region ********系统界面相关配置
  UI: {
    /*必须，系统配置标题，必须 */
    SiteTitle: '产品API开发示例',
    CopyRight: 'XXX',
    WebSite: '',
    /**是否是能访问互联网，还是内网部署应用*/
    IsInternet: true,
    LockTime: 3600, //1小时
    IsNoLogin: true //无需登录页面
  },
  //#endregion

  //#region ********后台服务地址配置
  ServiceURL: {
    /**
     * 用户登录（统一用户登录）
     */
    LoginAuthURL: '', //'http://192.168.1.18:8001',
    // LoginAuthURL: 'http://192.168.1.18:8001',
    /**
     * Axios普通WebAPI的BaseURL
     * 全局默认的http请求地址（一般与主hprose相同或不同）;文件上传地址
     */
    DefaultWebAPI: '',
    /**
     * 默认HproseAPI的服务地址
     */
    //DefaultHproseAPI: 'http://192.168.1.109:1002/ImageAdmin'
    /**
     * Hprose在线测试地址
     */
    HproseTestURL: ''
    //*********其他Hprose或API服务***********/
    // //数据管理
    // DataHproseAPI: 'http://192.168.1.109:1003/DataManage',
    // //数据集管理
    // DatasetHproseAPI: 'http://192.168.1.109:1001/DataSource',
    // //父级网站地址
    // ParentWebsiteURL: 'http://localhost:3001'

    //统一登录界面
    // UILoginURL: 'http://192.168.1.5:180#/userlogin'
  },
  //#endregion

  //#region 菜单配置项
  menus: {
    // default: {
    //   name: '首页',
    //   path: '/'
    // },
	cesium: {
      name: '三维开发',
      path: '/demo/cesium',
      config: '/config/menuConfig_cesium.js'
    },
    babylon: {
      name: '游戏引擎学习',
      path: '/demo/babylon',
      config: '/config/menuConfig_babylon.js'
    },
	
  }
  //#endregion
};
//其他可扩展执行的JS代码
//默认设置网站Title
document.title = SysConfig.UI.SiteTitle;
//设置样式
var htmlRoot = document.getElementById('htmlRoot');
var theme = window.localStorage.getItem('__APP__DARK__MODE__');
if (htmlRoot && theme) {
  htmlRoot.setAttribute('data-theme', theme);
  theme = htmlRoot = null;
}
