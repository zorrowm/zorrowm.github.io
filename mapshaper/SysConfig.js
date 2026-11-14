/**
 * 通用的 V1.4,针对0.6.1以上版本
 * 2025-4-25 规范与补充，针对0.9.5匹配，增加OnlyUserVerify
 */
const SysConfig = {
  //#region ********系统界面相关配置
  UI: {
    /*必须，系统配置标题，必须 */
    SiteTitle: "基于Widget Quasar的开发模板2",
    CopyRight: "Copyright ©XXXX  2022-2026",
    WebSite: "http://www.XXXX.com",
    /**是否是能访问互联网，还是内网部署应用*/
    IsInternet: true,
    LockTime: 3600, //1小时
    IsNoLogin: true, //无需登录页面,true时不登录
    OnlyUserVerify: false, //只用户验证，不验证角色与功能授权
    GrayMode: false, //是否启用网站暗灰模式，悼念日，默认为false
    ProductLog: false //是否在产品发布后输出开发日志记录
    // Theme:'dark'//系统的主题
  },
  //#endregion

  //#region ********后台服务地址配置
  ServiceURL: {
    /**
     * 用户登录（统一用户登录）（不能带"/"）
     * http://192.168.1.12:83
     */
    LoginAuthURL: "http://localhost:8500",
    /**
     * 图标在线服务地址（不能带"/"）
     * https://api.iconify.design
     */
    IconServiceURL: "https://api.iconify.design",
    /**
     * 文件管理服务地址（统一文件管理：后台）
     */
    FileServiceURL: "", //文件管理
    /**
     * 文件管理（统一文件管理：前台）
     */
    FileOnlineURL: "", //文件管理，在线
    /**
     * 在线日志服务
     */
    LogServiceURL: "", //日志服务
    /**
     * Axios普通WebAPI的BaseURL
     * 全局默认的http请求地址（一般与主hprose相同或不同）;文件上传地址
     */
    DefaultWebAPI: "",
    /**
     * 默认HproseAPI的服务地址http://192.168.1.120:5139/hprose
     */
    DefaultHproseAPI: ""

  }
  //#endregion

};

//#region *********其他可扩展执行的JS代码
globalThis.SysConfig = SysConfig;
//默认设置网站Title
document.title = SysConfig.UI.SiteTitle;
//设置样式
var htmlRoot = document.getElementById("htmlRoot");
//颜色变灰
if (SysConfig.UI.GrayMode) htmlRoot.className = "grayMode";
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

// 本地矢量工作台配置；保留上方完整模板配置及初始化行为。
SysConfig.Mapshaper = {
  basemapUrl: "https://t{0-7}.tianditu.gov.cn/{layer}_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER={layer}&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk={key}"
};
