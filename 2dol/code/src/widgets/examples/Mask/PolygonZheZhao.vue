<template>
</template>

<script setup lang="ts">
import { Feature } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import { LinearRing,Polygon, MultiPolygon } from 'ol/geom';
import { fromExtent } from 'ol/geom/Polygon';
import VecLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import { onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';
import { XMap } from 'xgis-ol';
import testdata from './zhezhaotest.json';

let converLayer: VecLayer;
function loadJson(xmap:XMap) {
    const prj=xmap.MapView.getProjection();
    var fts = new GeoJSON().readFeatures(testdata,{dataProjection:"EPSG:4326",featureProjection:prj});
    var ft = fts[0];
    var converGeom = erase(ft.getGeometry());

    var convertFt = new Feature({
        geometry:converGeom
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
onMounted(() => {

    const xmap = Global.XMap as XMap;
    var mystyle = new Style({
        fill: new Fill({
            color: 'rgba(0,0,0, 0.6)'
        }),
        stroke: new Stroke({
            color: '#BDBDBD',
            width: 2
        }),
        zIndex: 10,
    });
    converLayer = new VecLayer({
        source: new VectorSource(),
        style: mystyle,
        declutter: ''
    });
    xmap.map.addLayer(converLayer);
    loadJson(xmap);
})
onUnmounted(() => {
    const xmap = Global.XMap as XMap;
    if (converLayer) {
        xmap.map.removeLayer(converLayer);
    }
})
</script>

<style scoped></style>