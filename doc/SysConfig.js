/**
 * 通用的 V1.4,针对0.6.1以上版本
 */
const SysConfig = {
  //#region ********系统界面相关配置
  UI: {
    /*必须，系统配置标题，必须 */
    SiteTitle: 'MD文档在线浏览',
    CopyRight: 'Copyright ©XXXX  2022-2026',
    WebSite: 'http://www.XXXX.com',
    /**是否是能访问互联网，还是内网部署应用*/
    IsInternet: true,
    LockTime: 3600, //1小时
    IsNoLogin: true, //无需登录页面,true时不登录
    GrayMode: false, //是否启用网站暗灰模式，悼念日，默认为false
    ProductLog: false, //是否在产品发布后输出开发日志记录
    // Theme:'dark'//系统的主题
  },
  //#endregion

  //#region ********后台服务地址配置
  ServiceURL: {
    /**
     * 图标在线服务地址（不能带"/"）
     * https://gis-icon.digsur.com/online
     */
    // IconServiceURL: 'https://gis-icon.digsur.com/online',
  },
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