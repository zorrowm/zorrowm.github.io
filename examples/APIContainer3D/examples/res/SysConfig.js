/**
 * 通用的 V1.2,针对0.3.3以上版本
 */
const SysConfig = {
  //#region ********系统界面相关配置
  UI: {
    /*必须，系统配置标题，必须 */
    SiteTitle: '在线HtmlCoding',
    CopyRight: '',
    WebSite: '',
    /**是否是能访问互联网，还是内网部署应用*/
    IsInternet: true,
    LockTime: 3600 //1小时
  },
  //#endregion

  //#region ********后台服务地址配置
  ServiceURL: {
    /**
     * 用户登录（统一用户登录）
     */
    //LoginAuthURL: 'http://192.168.1.5:181', //'http://192.168.1.18:8001',
    // LoginAuthURL: 'http://192.168.1.18:8001',
    /**
     * Axios普通WebAPI的BaseURL
     * 全局默认的http请求地址（一般与主hprose相同或不同）;文件上传地址
     */
    DefaultWebAPI: ''
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
