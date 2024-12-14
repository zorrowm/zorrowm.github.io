import{_ as s,o as a,c as n,R as i}from"./chunks/framework.6E_17U8v.js";const y=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"note/webframe/xframelib/page3.md","filePath":"note/webframe/xframelib/page3.md","lastUpdated":1703237225000}'),p={name:"note/webframe/xframelib/page3.md"},l=i(`<h2 id="xframelib结构" tabindex="-1">xframelib结构 <a class="header-anchor" href="#xframelib结构" aria-label="Permalink to &quot;xframelib结构&quot;">​</a></h2><ul><li>Global 全局对象 Global对应模型为InnerObject，全局主要对象挂节点。</li></ul><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> InnerObject</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   * axios对象</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   */</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  Axios</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> AxiosStatic</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//AxiosStatic; //必须是any，因为涉及调用方法</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  Config</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ISystemConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  EventBus</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Emitter</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  //默认HproseProxyClient</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  DefaultProxyClient</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ProxyClient</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> undefined</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  Message</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MsgHelper</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   * 布局管理对象</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   */</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  LayoutManager</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> LayoutManager</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   * 系统ID标识</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   */</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  SystemID</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   * 系统——工程项目名，分组名</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   * 例如：都是影像工程</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   */</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  SystemGroup</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   * 日志记录</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@param</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> name</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> 日志名称</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   */</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  Logger</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Logger</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  [</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">props</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> any</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><br><ol><li>Axios为默认的Axios对象</li><li>Config为网站的初始配置，对应配置文件为sysConfig.js</li><li>EventBus 为公共消息总线</li><li>DefaultProxyClient 为默认主要的HproseProxyClient调用hprose服务</li><li>Message 为弹框消息对象</li><li>Logger 为Console.log的控制台日志输出对象（可控制输出日志级别）</li></ol><ul><li><p>Global.Config为系统配置对象</p><p>对应模型对象ISystemConfig</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>export interface ISystemConfig {</span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 用户界面配置</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  UI: {</span></span>
<span class="line"><span>      /**</span></span>
<span class="line"><span>       * 网站标题</span></span>
<span class="line"><span>       */</span></span>
<span class="line"><span>      SiteTitle: string;</span></span>
<span class="line"><span>      /**</span></span>
<span class="line"><span>       * 系统的所属组名</span></span>
<span class="line"><span>       */</span></span>
<span class="line"><span>      Group?: string;</span></span>
<span class="line"><span>      /**</span></span>
<span class="line"><span>       * 版权</span></span>
<span class="line"><span>       */</span></span>
<span class="line"><span>      CopyRight: string; //&#39;Copyright ©XXX  2021-2025&#39;,</span></span>
<span class="line"><span>      /**</span></span>
<span class="line"><span>       * 官方链接</span></span>
<span class="line"><span>       */</span></span>
<span class="line"><span>      WebSite?: string; //网站链接</span></span>
<span class="line"><span>      /**</span></span>
<span class="line"><span>       * 超时锁屏时间(单位：秒s)</span></span>
<span class="line"><span>       * 自动锁屏时间，为0不锁屏。</span></span>
<span class="line"><span>       */</span></span>
<span class="line"><span>      LockTime?: number; //</span></span>
<span class="line"><span>      /**</span></span>
<span class="line"><span>       * 是否是能访问互联网，还是内网部署应用</span></span>
<span class="line"><span>       * */</span></span>
<span class="line"><span>      IsInternet?: boolean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      /**</span></span>
<span class="line"><span>       * 网站灰色模式，用于可能悼念的日期开启</span></span>
<span class="line"><span>       * 默认为false</span></span>
<span class="line"><span>       */</span></span>
<span class="line"><span>      GrayMode?: boolean;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      /**</span></span>
<span class="line"><span>       * 其他扩展的属性</span></span>
<span class="line"><span>       */</span></span>
<span class="line"><span>      [props: string]: any;</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 服务URL</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  ServiceURL: IServiceURL;</span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * 地图相关Keys</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  MapKeys?: IMapKeys;</span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>   * API服务路径</span></span>
<span class="line"><span>   */</span></span>
<span class="line"><span>  APIPath?: object; //</span></span>
<span class="line"><span>  //其他配置信息</span></span>
<span class="line"><span>  [props: string]: any;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>Hprose相关对象</p><p>HproseClient: 访问Hprose服务的对象</p><p>ProxyClient ：Hprose公开方法包装对象</p></li><li><p>permission 权限注册、权限过滤</p></li><li><p>res文件夹 存放：静态资源文件</p></li><li><p>utils文件夹 H5Tool: HTML元素相关操作方法；窗体大小发生变化、全屏、文件MD5值计算 FileUpload: 大文件分片上传 FileDownload:小文件下载，JsonDownload、HttpDownload、SaveAs BigFileDownload：大文件分片下载 IsTool :判断对象类型 ValidateTool：正则表达式验证工具 JQuery : 模仿JQuery相关方法 StorageHelper: 本地缓存相关操作方法 XXTEA ：加密解密方法 uuid ：生成唯一guid，uuid()和newGuid、shortUUID</p></li></ul>`,6),e=[l];function t(h,k,r,c,g,d){return a(),n("div",null,e)}const E=s(p,[["render",t]]);export{y as __pageData,E as default};
