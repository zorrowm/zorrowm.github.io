import{O as c}from"./vendor-qEPl7M71.js";import{B as h}from"./xframelib-exp-CBRV2soX.js";const o="measureSourceDraw",l={type:"FeatureCollection",features:[]},i=[],a=[];var d=(s=>(s[s.linestring=0]="linestring",s[s.polygon=1]="polygon",s))(d||{});class m{InitSource(e){e.getSource(o)||(e.addSource(o,{type:"geojson",data:l}),e.addLayer({id:"measure-points",type:"circle",source:o,paint:{"circle-radius":5,"circle-color":"#000"}}),e.addLayer({id:"measure-lines",type:"line",source:o,layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#000","line-width":2.5}}),e.addLayer({id:"measure-polygon",type:"fill",source:o,layout:{},paint:{"fill-color":"#000","fill-opacity":.4,"fill-outline-color":"#000"},filter:["in","$type","Polygon"]}))}InitParam(){i.length=0,this._geometry=this._mapMeasureType==0?{type:"Feature",geometry:{type:"LineString",coordinates:[]}}:{type:"Feature",geometry:{type:"Polygon",coordinates:[[]]}},l.features.push(this._geometry),this.isMovePoint=!1,this.isDblClick=!1}_mapMeasureType;isMovePoint=!1;isDblClick=!1;_map=void 0;_geometry;_mapClickHandler;_mapMoveHandler;_mapDdlClickHandler;StartMeasure(e,t){e||h.Message.info("地图组件未加载,无法进行测量"),this._map=e,this._mapMeasureType=t,this.InitParam(),this.InitSource(e),e.getCanvas().style.cursor="crosshair",e.doubleClickZoom.disable(),this._mapClickHandler=this.MapClickHandler.bind(this),e.on("click",this._mapClickHandler),this._mapMoveHandler=this.MapMoveHandler.bind(this),e.on("mousemove",this._mapMoveHandler),this._mapDdlClickHandler=this.MapDdlClickHandler.bind(this),e.once("dblclick",this._mapDdlClickHandler)}RemoveMeasure(e){a&&a.length&&(a.forEach(r=>{r.remove()}),a.length=0),e.getSource(o)&&(e.removeLayer("measure-points"),e.removeLayer("measure-lines"),e.removeLayer("measure-polygon"),e.removeSource(o)),this._mapClickHandler&&(this._map.getCanvas().style.cursor="",this._map.off("click",this._mapClickHandler),this._map.off("mousemove",this._mapMoveHandler),this._mapClickHandler=void 0,this._mapMoveHandler=void 0,this._mapDdlClickHandler=void 0,e.doubleClickZoom.enable())}async MapClickHandler(e){if(!this.isDblClick){if(this.isDblClick=!0,setTimeout(()=>{this.isDblClick=!1},350),i.push([e.lngLat.lng,e.lngLat.lat]),this._mapMeasureType==0){this._geometry.geometry.coordinates=[...i];const t=new c.Popup({closeOnClick:!1,closeButton:!1}).setLngLat([e.lngLat.lng,e.lngLat.lat]).addTo(this._map);if(i.length>1){const r=await window.turfAsync.length(this._geometry);t.setHTML(`<span>${r.toFixed(2)}公里</span>`)}else t.setHTML("<span>起点</span>");a.push(t)}else this._geometry.geometry.coordinates=[[...i]],i.length>2&&this._geometry.geometry.coordinates[0].push(i[0]);this._map?.getSource(o)?.setData(l),this.isMovePoint=!1}}MapMoveHandler(e){this._mapMeasureType==1?i.length>0&&(this._geometry.geometry.coordinates[0].length>2&&this._geometry.geometry.coordinates[0].pop(),this.isMovePoint&&this._geometry.geometry.coordinates[0].pop(),this._geometry.geometry.coordinates[0].push([e.lngLat.lng,e.lngLat.lat]),this._geometry.geometry.coordinates[0].length>2&&this._geometry.geometry.coordinates[0].push(this._geometry.geometry.coordinates[0][0]),this.isMovePoint=!0,this._map?.getSource(o)?.setData(l)):i.length>0&&(this.isMovePoint&&this._geometry.geometry.coordinates.pop(),this._geometry.geometry.coordinates.push([e.lngLat.lng,e.lngLat.lat]),this.isMovePoint=!0,this._map?.getSource(o)?.setData(l))}async MapDdlClickHandler(e){if(this._map.getCanvas().style.cursor="",this._map.off("click",this._mapClickHandler),this._map.off("mousemove",this._mapMoveHandler),this._mapClickHandler=void 0,this._mapMoveHandler=void 0,this._mapDdlClickHandler=void 0,this.isMovePoint=!1,this._mapMeasureType==1){var t=await window.turfAsync.area(this._geometry);let n=`<span>面积:${t.toFixed(2)} 平方米</span>`;t>1e6&&(t/=1e6,n=`<span>面积:${t.toFixed(2)} 平方千米</span>`);var r=await window.turfAsync.center(this._geometry);const p=new c.Popup({closeOnClick:!1,closeButton:!1}).setLngLat(r.geometry.coordinates).setHTML(n).addTo(this._map);a.push(p)}}}const y=new m;export{d as M,y as a};