<template>
</template>

<script setup lang="ts">
import { Feature } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import { LinearRing, Polygon, MultiPolygon } from 'ol/geom';
import { fromExtent } from 'ol/geom/Polygon';
import VecLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import { onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';
import { XMap } from 'xgis-ol';
import testdata from './zhezhaotest.json';
import { getVectorContext } from 'ol/render';

//参考：https://openlayers.org/en/latest/examples/layer-clipping-vector.html
let converLayer: VecLayer;
function loadJson() {
    var fts = new GeoJSON().readFeatures(testdata);
    var ft = fts[0];
    var converGeom = erase(ft.getGeometry());

    var convertFt = new Feature({
        geometry: converGeom
    });
    if (converLayer)
        converLayer.getSource().addFeature(convertFt);
}
// 擦除操作,生产遮罩范围
function erase(geom) {
    var extent = [-180, -90, 180, 90];
    var polygonRing = fromExtent(extent);
    let isMulit = false;
    if (geom instanceof MultiPolygon) isMulit = true;

    var coords = geom.getCoordinates();
    coords.forEach(coord => {
        let arr = coord[0];
        if (!isMulit) arr = coord; //单面
        const linearRing = new LinearRing(arr);
        polygonRing.appendLinearRing(linearRing);
    });
    return polygonRing;
}
const style = new Style({
        fill: new Fill({
            color: 'black',
        }),
    });
let clipLayer:VecLayer; 
let base:any,base2:any;
let oldExtent:any;
function clipRender (e) {
        const vectorContext = getVectorContext(e);
        e.context.globalCompositeOperation = 'destination-in';
        if(clipLayer)
        clipLayer.getSource().forEachFeature(function (feature) {
            vectorContext.drawFeature(feature, style);
        });
        e.context.globalCompositeOperation = 'source-over';
    }

onMounted(() => {
    const xmap = Global.XMap as XMap;
    const group= xmap.map.getLayers().getArray();
     base =group[0];
     base2 = group[1];
    const prj=xmap.MapView.getProjection();
    var fts = new GeoJSON().readFeatures(testdata,{dataProjection:"EPSG:4326",featureProjection:prj});
    clipLayer = new VecLayer({
        style: null,
        source: new VectorSource({
            features:fts,
        }),
    });
    oldExtent=base.getExtent();
    clipLayer.getSource().on('addfeature', function () {
        base.setExtent(clipLayer.getSource().getExtent());
        base2.setExtent(clipLayer.getSource().getExtent());
    });

    base.on('postrender', clipRender);
    base2.on('postrender', clipRender);
    xmap.map.renderSync();
})
onUnmounted(() => {
    if (clipLayer) {
        if(base)
        {
            base.un('postrender', clipRender);
            base.setExtent(oldExtent);
        }
        if(base2)
        {
            base2.un('postrender', clipRender);
            base2.setExtent(oldExtent);
        }

        clipLayer.dispose();
    }
    const xmap = Global.XMap as XMap;
    if(xmap)
    xmap.map.renderSync();
})
</script>

<style scoped></style>