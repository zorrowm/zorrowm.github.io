/**
 * 通用的 V1.4,针对0.6.1以上版本
 */
const SysConfig = {
  //#region ********系统界面相关配置
  UI: {
    /*必须，系统配置标题，必须 */
     SiteTitle: '图标在线服务系统',
    CopyRight: 'Copyright ©北京宇算科技有限公司  2022-2026',
    WebSite: 'http://www.ysgis.com',
    /**是否是能访问互联网，还是内网部署应用*/
    IsInternet: true,
    LockTime: 3600, //1小时
    IsNoLogin: false, //无需登录页面,true时不登录
    GrayMode: false, //是否启用网站暗灰模式，悼念日，默认为false
    ProductLog:false//是否在产品发布后启用日志记录
  },
  //#endregion

  //#region ********后台服务地址配置
  ServiceURL: {
    /**
     * 用户登录（统一用户登录）
     */
     LoginAuthURL: "http://authservice.ysgis.com",
     /**
      * 图标在线服务地址
      */
      IconServiceURL: "http://iconservice.ysgis.com",
    
     /**
      * Axios普通WebAPI的BaseURL
      * 全局默认的http请求地址（一般与主hprose相同或不同）;文件上传地址
      */
    DefaultWebAPI: 'http://iconservice.ysgis.com',

  },
  //#endregion

  
  //#endregion

  //#region ******** API服务路径
  APIPath: {
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
else htmlRoot.className = '';

//#endregion


