import{Ht as e,Nt as t,Ut as n,Vt as r,kt as i}from"./vendor-DOOaZF0-.js";import{L as a}from"./xframe-exp-dI2YG7VE.js";import{o,s,t as c}from"./xgis-cesium-exp-DMGvGosZ.js";var l=t({__name:`MonitorPointHtmlWidget`,setup(t){let l,u;async function d(){u=new s(`monitorPointsLayer`),l.addLayer(u);let e=await(await fetch(`./SampleData/monitor-points.geojson`)).json();console.log(`3333333333`,e),e.features.forEach(e=>{let t=e.geometry.coordinates,n=new o(t[0],t[1]),r=e.properties,i=new c(n,`
         <div class="sign-holder">
        <div class="sign-board">
      ${r.num} : ${r.name}
        </div>
        <!-- 牌子手柄 -->
        <div class="sign-handle"></div>
    </div>
        `);u.addOverlay(i)}),l.flyToPosition(new o(141.0897,37.394,1e4,347,-65.14),void 0,2)}return r(()=>{a.CesiumViewer&&(l=a.CesiumViewer,d())}),e(()=>{l&&u&&l.removeLayer(u)}),(e,t)=>(n(),i(`div`))}});export{l as default};