/**
 * 通用的 V1.4,针对0.6.1以上版本
 */
const SysConfig = {
  //#region ********系统界面相关配置
  UI: {
    /*必须，系统配置标题，必须 */
    SiteTitle: '基于OpenLayers的GIS平台',
    CopyRight: 'Copyright ©帝测科技  2024-2030',
    WebSite: 'http://www.digsur.com',
    /**是否是能访问互联网，还是内网部署应用*/
    IsInternet: true,
    LockTime: 3600, //1小时
    IsNoLogin: false, //无需登录页面,true时不登录
    GrayMode: false, //是否启用网站暗灰模式，悼念日，默认为false
    ProductLog: false, //是否在产品发布后输出开发日志记录
    // Theme:'dark'//系统的主题
  },
  //#endregion

  //#region ********后台服务地址配置
  ServiceURL: {
    /**
     * 用户登录（统一用户登录）（不能带"/"）
     * http://192.168.1.12:83
     */
    LoginAuthURL: 'https://auth.gis.digsur.com',
    /**
     * 图标在线服务地址（不能带"/"）
     * https://gis-icon.digsur.com/online
     */
    IconServiceURL: '',
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
    DefaultWebAPI: '',
    /**
     * 默认HproseAPI的服务地址
     * (影像后端)
     */
    DefaultHproseAPI: 'https://gis-image.digsur.com/ImageAdmin', //
    //数据集管理http://192.168.1.33:1001/DataSource
    DatasetHproseAPI: 'https://gis-image.digsur.com/DataSource',
    // DatasetHproseAPI: 'http://192.168.1.47:1001/DataSource',

    //渲染样式色带图片
    DefaultStyleColorImage: 'https://gis-image.digsur.com',
    //后台瓦片服务地址
    WMTSService: 'https://gis-image.digsur.com/IMGWMTS'
  },
  //#endregion

  //#region ********地图配置（天地图KEY）
  /**
   * 地图Key,值为string或array
   */
  MapKeys: {
    /**
     * 天地图服务的授权Key
     */
    TDTKey: [
      'f9b51cc0282fa69451df24be416107b6',
      '5d27dc75ca0c3bdf34f657ffe1e9881d',
      'a90b856f2ade4b97f683cbc9c3c2702e',
      '3566b0e50b26951da109cfea07e583c4',
      '4ed383c68a325d012da2f0195b9609fe'
    ],
    /**
     * MapboxKey
     * pk.eyJ1IjoiemdlbyIsImEiOiJja3E2MGE2NmIxbm45Mm5vNHpnOWZlZ3BlIn0.lDaMkti77XPv0_so0J9apQ
     */
    MapboxKey: 'pk.eyJ1IjoiY2hyaXNuaW5nIiwiYSI6ImNrZzk3dmNveTA2cGUycXAyNXJ3bWNsOHMifQ._4oFj3iqj5yWWvbuONDYnw',
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
    SignalR: '/chathub'
  },
  //#endregion

  //#region **********用于控制功能是否启用
  Enables:{
    TurfAsync:true,
    CesiumOfflineCache:false,//Cesium缓存
  }
  //#endregion
};

//#region *********其他可扩展执行的JS代码

//默认设置网站Title
document.title = SysConfig.UI.SiteTitle;
//设置样式
var htmlRoot = document.getElementById('htmlRoot');
//颜色变灰
if (SysConfig.UI.GrayMode) htmlRoot.className = 'grayMode';
//#endregion
//设置主题样式
if (SysConfig.UI.Theme) {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = "./theme/" + SysConfig.UI.Theme + ".css";
  const head = document.getElementsByTagName("head")[0];
  head.appendChild(link);
}