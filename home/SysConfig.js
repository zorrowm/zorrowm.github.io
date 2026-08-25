const SysConfig = {
  //#region ********系统界面相关配置
  UI: {
    /*必须，系统配置标题，必须 */
    SiteTitle: '无痕客技术小站',
    CopyRight: 'Copyright ©XXXX 2026-2030',
    WebSite: 'http://www.XXXX.com',
    /**是否是能访问互联网，还是内网部署应用*/
    IsInternet: true,
    LockTime: 3600, //1小时
    IsNoLogin: false, //无需登录页面,true时不登录
    OnlyUserVerify: false, //只用户验证，不验证角色与功能授权
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
    LoginAuthURL: '',
    /**
     * 图标在线服务地址（不能带"/"）
     */
    IconServiceURL: 'https://api.iconify.design',
    
    /**
     * Axios普通WebAPI的BaseURL
     * 全局默认的http请求地址（一般与主hprose相同或不同）;文件上传地址
     */
    DefaultWebAPI: '',
    /**
     * 默认HproseAPI的服务地址
     */
    DefaultHproseAPI: '',
  },
  //#endregion

};

//#region *********其他可扩展执行的JS代码
globalThis.SysConfig=SysConfig;
//默认设置网站Title
document.title = SysConfig.UI.SiteTitle;
//设置样式
var htmlRoot = document.getElementById('htmlRoot');
//颜色变灰
if (SysConfig.UI.GrayMode) htmlRoot.className = 'grayMode';
//#endregion
//设置主题样式
if (SysConfig.UI.Theme) {
  const link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = './theme/' + SysConfig.UI.Theme + '.css';
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(link);
}
