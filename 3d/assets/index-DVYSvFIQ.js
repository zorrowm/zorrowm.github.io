import{cx as x,cy as _,w as ee}from"./vendor-CDV5M84i.js";import{B as ne}from"./rotate-Ba5UGUAD.js";import{l as te,u as oe,g as se,n as ie,o as le,_ as ae}from"./index-DPO_t7vI.js";import{j as n,N as M,O as ue,T as re,Q as ge,g as de,e as ce}from"./xframelib-exp-CvTEfE5n.js";import{u as pe,b as fe}from"./vue-router-exp-BeFgxScw.js";import{d as me,r as u,a as ve,v as he,O as Se,R as f,M as m,L as t,N as w,z as N,ad as O,a0 as ye,Q as P,a9 as q}from"./@vue-exp-YaP0LnBg.js";import"./@hprose-exp-DifMA6AO.js";import"./domTool-Dunoo3KF.js";import"./axios-exp-BH40TtQM.js";const Ce=me({components:{BasicDragVerify:ne},setup(){const o=u(!0);n.Loading("end");const e=ve({username:"",password:""}),v=u(),h=u(),B=u("");B.value=n.Config.UI?.SiteTitle;const k=u("");k.value=n.Config.UI?.CopyRight;const a=pe(),i=fe();let r=decodeURIComponent(i.query?.redirect||"/");const W=M();let S;if(W){ue(),a&&a.replace(r).then(l=>{i.name=="login"&&a.replace("/")});return}const b=u(null);let d=!0,R=!1;const H=async()=>{if(!R){n.Message?.warn("请先人机验证！");return}if(!d){n.Logger().debug("频繁点击登录******");return}if(d=!1,e.username.trim()===""||e.password.trim()=="")return setTimeout(()=>{d=!0},2e3),n.Message?.warn("用户名或密码不能为空！");let l={username:e.username.trim(),pwd:e.password.trim()};const s=await de(l).catch(y=>{n.Message?.warn(`登录失败:${y.message}!`),d=!0,b.value&&(R=!1,b.value.resume())});s&&await U(s)};function J(l){R=!0;const{time:s}=l;n.Message?.info(`校验成功,耗时${s}秒`)}async function U(l){const s=oe();s.init(l),n.User=s.id;const y=se(),Z=s.DefaultMaxRoleLevel===0;let V=!0;const E=await ce(y,Z).catch(g=>{V=!1,n.Message?.err("该系统未注册！")});if(d=!0,!V)return;if(n.Logger().debug(E,"登录后的系统权限"),E){const g=ie();n.Logger().debug(g,"系统路由权限");let C;g?.forEach(Q=>{C||(C=Q),a.addRoute(Q)}),C&&le(a,C)}else{n.Message?.warn(e.username+"无系统权限，无法登录！");return}const p=decodeURIComponent(i.query?.redirect||"/");if(a)if(n.Logger().debug(p,"toPath"),p.startsWith("http://")||p.startsWith("https://")){const g=M();window.open(p+"#/?tk="+g.token,"_self")}else a.replace(p).then(g=>{i.name=="login"&&a.replace("/")});n.Message?.msg("登录成功")}he(async()=>{if(S=void 0,r&&(S=i.query?.tk?.toString()),S&&await te(S)){const s=M();s&&(r?.indexOf("?")>0?r+="&tk="+s.token:r+="?tk="+s.token,a.replace(r).then(y=>{i.name=="login"&&a.replace("/")}))}});function K(){v.value&&(v.value.placeholder="请输入账号"),h.value&&(h.value.placeholder="请输入密码")}async function j(l){o.value=l,await G()}let D=null,T="",L=u(),F=u(),c;const z=1e3*60*2;let I=!0,$=n.Config.ServiceURL.LoginAuthURL;async function G(){n.authSignalConnection==null&&(n.authSignalConnection=new x().withUrl(`${$}/chathub`,{skipNegotiation:!0,transport:_.WebSockets}).withAutomaticReconnect().build(),n.authSignalConnection.serverTimeoutInMilliseconds=24e4,n.authSignalConnection.keepAliveIntervalInMilliseconds=12e4,n.authSignalConnection.on("ReturnConnectionId",l=>{T=l,A()}),n.authSignalConnection.on("QRCodeCheckMessage",(l,s)=>{F.value=l}),n.authSignalConnection.on("QRCodeSendMessage",async l=>{var s=JSON.parse(l);s.success&&s.userinfo!=null?(X(!0),c&&clearTimeout(c),re(s.userinfo.doubletoken),await U(s.userinfo)):(n.Message.info("授权登录取消"),F.value="")}),n.authSignalConnection.on("ExitLoginMessage",async(l,s)=>{n.authSignalConnection=null,ge(),a.replace("login")}),await n.authSignalConnection.start(),D=n.authSignalConnection)}function A(){if(T){if(!I)return;I=!1,Y(),L.value=`${$}/api/getqrcode?connId=${T}`;return}n.Message.err("获取二维码失败")}async function X(l){try{await D.invoke("LoginSuccessMessage",l)}catch{}}function Y(){n.Logger().log("重新开始计时……"),c&&clearTimeout(c),c=setTimeout(()=>{I=!0,L.value=""},z)}return{formState:e,systemTitle:B,handleSubmit:H,onblur:K,nameInput:v,pwdInput:h,copyRightInfo:k,handleSuccess:J,elDragRef:b,pwdLogin:o,changeLoginType:j,imageUrl:L,scanUser:F,getQRCodeImage:A}}}),we={class:"container"},Be={class:"login-logo"},ke={class:"login-title"},be={key:0,class:"login"},Re={class:"login-center clearfix"},Te={class:"login-center-input"},Le={class:"login-center clearfix"},Fe={class:"login-center-input"},Ie={class:"login-center clearfix",style:{"margin-bottom":"5px"}},Me={class:"login-bottom-line"},Ue={key:1,class:"login"},De={class:"login-top-append"},$e={class:"login-center loginQRCode"},Ae={key:0},Ve=["src"],Ee={class:"login-copyright"};function Qe(o,e,v,h,B,k){const a=Se("BasicDragVerify");return f(),m("div",we,[t("div",Be,[e[9]||(e[9]=t("img",{src:"/img/logo.png",alt:""},null,-1)),t("span",ke,w(o.systemTitle),1)]),o.pwdLogin?(f(),m("div",be,[e[17]||(e[17]=t("div",{class:"login-top"},"用户登录",-1)),t("div",{class:"righttop-login",onClick:e[0]||(e[0]=i=>o.changeLoginType(!1))},e[10]||(e[10]=[t("img",{src:"/img/login/code.png",alt:"",width:"50",height:"50"},null,-1)])),t("div",Re,[e[12]||(e[12]=t("div",{class:"login-center-img"},[t("img",{src:"/img/login/name.png"})],-1)),t("div",Te,[N(t("input",{ref:"nameInput","onUpdate:modelValue":e[1]||(e[1]=i=>o.formState.username=i),type:"text",placeholder:"请输入账号",onfocus:"this.placeholder=''",onBlur:e[2]||(e[2]=i=>o.onblur())},null,544),[[O,o.formState.username]]),e[11]||(e[11]=t("div",{class:"login-center-input-text"},"账号",-1))])]),t("div",Le,[e[14]||(e[14]=t("div",{class:"login-center-img"},[t("img",{src:"/img/login/password.png"})],-1)),t("div",Fe,[N(t("input",{ref:"pwdInput","onUpdate:modelValue":e[3]||(e[3]=i=>o.formState.password=i),type:"password",placeholder:"请输入密码",onfocus:"this.placeholder=''",onBlur:e[4]||(e[4]=i=>o.onblur()),onKeyup:e[5]||(e[5]=ye((...i)=>o.handleSubmit&&o.handleSubmit(...i),["enter"]))},null,544),[[O,o.formState.password]]),e[13]||(e[13]=t("div",{class:"login-center-input-text"},"密码",-1))])]),t("div",Ie,[P(a,{ref:"elDragRef",width:270,barStyle:{backgroundColor:"#018ffb"},onSuccess:o.handleSuccess},null,8,["onSuccess"])]),t("div",{class:"login-button",onClick:e[6]||(e[6]=(...i)=>o.handleSubmit&&o.handleSubmit(...i))},"登录"),t("div",Me,[e[15]||(e[15]=t("span",null,"忘记密码",-1)),P(ee,{vertical:""}),e[16]||(e[16]=t("span",null,"注册新账号",-1))])])):(f(),m("div",Ue,[e[21]||(e[21]=t("div",{class:"login-top"},"扫码登录",-1)),t("div",De,w(o.imageUrl?"请打开 授权宝APP 扫一扫登录":"请点击刷新二维码"),1),t("div",{class:"righttop-login",onClick:e[7]||(e[7]=i=>o.changeLoginType(!0))},e[18]||(e[18]=[t("img",{src:"/img/login/pwd.png",alt:"",width:"50",height:"50"},null,-1)])),t("div",$e,[o.scanUser?(f(),m("div",Ae,[q("用户:"+w(o.scanUser),1),e[19]||(e[19]=t("br",null,null,-1)),e[20]||(e[20]=q("请在手机端确认登录"))])):(f(),m("img",{key:1,src:o.imageUrl,alt:"",width:"200",height:"200",style:{cursor:"pointer"},onClick:e[8]||(e[8]=i=>o.getQRCodeImage())},null,8,Ve))])])),t("div",Ee,w(o.copyRightInfo),1)])}const ze=ae(Ce,[["render",Qe],["__file","index.vue"]]);export{ze as default};