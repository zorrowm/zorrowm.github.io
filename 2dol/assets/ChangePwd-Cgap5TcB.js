import{ag as c,ae as g,a5 as m,as as C}from"./vendor-h8ZYNSbd.js";import{O as v,f as F,_ as S}from"./index-CQjc0PZC.js";import{B as n,q as b}from"./xframelib-exp-Dmuc0LeW.js";import{d as V,b as h,D as y,r as M,e as O,X as $,$ as j,c as u,a6 as E}from"./@vue-exp-DTehQd6t.js";import"./@hprose-exp-CjxVQ5zB.js";import"./monaco-editor-exp-B01XOe8A.js";import"./vue-router-exp-B0kidEOa.js";import"./axios-exp-B_zfNCMU.js";import"./@iconify/vue-exp-Ct1khs4G.js";const w="changeMyPWD";let q;const f={validateForm:q,name:w,props:{data:c([Boolean,Object]).def(!1),extra:g().isRequired},setup(r,{emit:a}){function d(l){l?p():t.value.resetFields()}h(()=>{v(w,d)}),y(()=>{F(w,d)});const t=M(),s=O({oldPassword:"",newPassword:"",newPassword2:"",showLevel:!1}),B={newPassword:[{required:!0,validator:async(l,o)=>o===""?Promise.reject("输入新密码"):o===s.oldPassword?Promise.reject("新旧密码不能一样!"):Promise.resolve(),trigger:"change"}],newPassword2:[{required:!0,validator:async(l,o)=>o===""?Promise.reject("请再次输入密码"):o!==s.newPassword?Promise.reject("两次输入的不一致!"):Promise.resolve(),trigger:"change"}]};f.validateForm=()=>t.value.validate();function p(){if(s.newPassword!=s.newPassword2){n.Message.warn("两次新密码不一致");return}const l=s.oldPassword,o=s.newPassword;b({oldpwd:l,newpwd:o}).then(i=>{i?.data?n.Message.info("修改密码成功！"):n.Message.warn("修改密码失败！")}).catch(i=>{n.Message.warn("修改密码失败:"+i.message)})}return{rules:B,formState:s,formRef:t,labelCol:{span:6},wrapperCol:{span:14},onSubmit:p}}},U=V(f);function k(r,a,d,t,s,P){return $(),j("div",null,[u(C,{ref:"formRef",validation:"",model:r.formState,"label-col":r.labelCol,"wrapper-col":r.wrapperCol,rules:r.rules},{default:E(()=>[u(m,{modelValue:r.formState.oldPassword,"onUpdate:modelValue":a[0]||(a[0]=e=>r.formState.oldPassword=e),type:"password",label:"旧密码","lazy-rules":"",rules:[e=>e&&e.length>0||"请输入密码"]},null,8,["modelValue","rules"]),u(m,{modelValue:r.formState.newPassword,"onUpdate:modelValue":a[1]||(a[1]=e=>r.formState.newPassword=e),label:"新密码",type:"password",hint:"请输入新密码","lazy-rules":"",rules:[e=>e&&e.length>0&&e!=r.formState.oldPassword||"请输入新密码"]},null,8,["modelValue","rules"]),u(m,{modelValue:r.formState.newPassword,"onUpdate:modelValue":a[2]||(a[2]=e=>r.formState.newPassword=e),label:"确认密码",type:"password",hint:"再次输入新密码",rules:[e=>e&&e.length>0&&e!=r.formState.newPassword||"请输入新密码"]},null,8,["modelValue","rules"])]),_:1},8,["model","label-col","wrapper-col","rules"])])}const W=S(U,[["render",k],["__file","ChangePwd.vue"]]);export{W as default};