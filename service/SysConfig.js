/**
 * 通用的 V1.3,针对0.5.7以上版本
 */
const SysConfig = {
  //#region ********系统界面相关配置
  UI: {
    /*必须，系统配置标题，必须 */
    SiteTitle: '后台业务服务平台',
    CopyRight: 'Copyright ©xx  2022-2026',
    WebSite: 'http://www.xxxx.com',
    /**是否是能访问互联网，还是内网部署应用*/
    IsInternet: true,
    LockTime: 3600, //1小时
    IsNoLogin: true, //无需登录页面,true时不登录
    GrayMode: false //是否启用网站暗灰模式，悼念日，默认为false
  },
  //#endregion

  //#region ********后台服务地址配置
  ServiceURL: {
    /**
     * 用户登录（统一用户登录）
     */
     LoginAuthURL: 'http://user.ysgis.com',
    /**
     * 文件管理服务地址（统一文件管理：后台）
     */
    FileServiceURL: '', //文件管理
    /**
     * 文件管理（统一文件管理：前台）
     */
    FileOnlineURL: '', //文件管理，在线
    /**
     * 在线日志服务
     */
    LogServiceURL: '', //日志服务
    /**
     * Axios普通WebAPI的BaseURL
     * 全局默认的http请求地址（一般与主hprose相同或不同）;文件上传地址
     */
    DefaultWebAPI: 'http://192.168.1.23:5000',
    /**
     * 默认HproseAPI的服务地址
     */
    DefaultHproseAPI: '' //http://192.168.1.109:1002/ImageAdmin

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

  //#region ********地图配置（天地图KEY）
  /**
   * 地图Key
   */
  MapKeys: {
    /**
     * 天地图服务的授权Key
     */
    TDTKey: '5d27dc75ca0c3bdf34f657ffe1e9881d',
    /**
     * MapboxKey
     * pk.eyJ1IjoiemdlbyIsImEiOiJja3E2MGE2NmIxbm45Mm5vNHpnOWZlZ3BlIn0.lDaMkti77XPv0_so0J9apQ
     */
    MapboxKey:
      'pk.eyJ1IjoiY2hyaXNuaW5nIiwiYSI6ImNrZzk3dmNveTA2cGUycXAyNXJ3bWNsOHMifQ._4oFj3iqj5yWWvbuONDYnw',
    /**
     * Cesium Key
     */
    CesiumKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZjdkOGRkYi1hYzIxLTQ4MDMtYjZiMC0zODg5YjI2ZTRlZjIiLCJpZCI6MjgyLCJzY29wZXMiOlsiYXNsIiwiYXNyIiwiYXN3IiwiZ2MiXSwiaWF0IjoxNTYyMDEyNTIyfQ.aVsGtowVeK_5C25G5-WCK7bZHyfXUl_zQ5Ud7TKsq0U'
    /**
     * Google地图Key
     */
    // GoogleKe?: string;
  },
  //#endregion

  //#region ******** API服务路径
  APIPath: {
    //获取系统用户权限 *必须的
    GET_AUTH_ROLE_RIGHT: '/api/Check/GetAuthorizationFunc'
  }
  //#endregion
};
//其他可扩展执行的JS代码
//默认设置网站Title
document.title = SysConfig.UI.SiteTitle;
//设置样式
var htmlRoot = document.getElementById('htmlRoot');
//颜色变灰
if (SysConfig.UI.GrayMode) htmlRoot.className = 'grayMode';
else htmlRoot.className = '';
var theme = window.localStorage.getItem('__APP__DARK__MODE__');
if (htmlRoot && theme) {
  htmlRoot.setAttribute('data-theme', theme);
  theme = htmlRoot = null;
}
