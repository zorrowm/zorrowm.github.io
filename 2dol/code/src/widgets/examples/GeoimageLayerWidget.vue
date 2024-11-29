<template>
    <div class="GeoImageLayer">
 这是 GeoImage图层使用示例
    </div>
</template>

<script setup lang="ts">
import {ref,onMounted,onUnmounted} from 'vue';
import {Global} from 'xframelib';
import { XMap } from 'xgis-ol';
import GeoImage from 'ol-ext/layer/GeoImage';
import GeoImageSource from 'ol-ext/source/GeoImage';
import ImageStatic from 'ol/source/ImageStatic';
import {Image as ImageLayer} from 'ol/layer';

let geoimg:GeoImage;
onMounted(()=>{
   const xmap=Global.XMap as XMap;

   geoimg = new GeoImage({
    name: "Georef",
    opacity: 1,
    source: new GeoImageSource({
      url: './SampleData/IGNF_PVA_1-0__1976-03-24_pt.jpg',
      imageCenter: [2.46840,48.8170],
      imageScale: [(2.4835-2.4535)/5526 ,(48.8258-48.8078)/5000],
      imageCrop: [0,0,5526,5000],
      //imageMask: [[273137.343,6242443.14],[273137.343,6245428.14],[276392.157,6245428.14],[276392.157,6242443.14],[273137.343,6242443.14]],
      imageRotate: Number(7.44*Math.PI/180),
      projection: 'EPSG:4326',
      attributions: [ "<a href='http://www.geoportail.gouv.fr/actualite/181/telechargez-les-cartes-et-photographies-aeriennes-historiques'>Photo historique &copy; IGN</a>" ]
    })
  });
  xmap.map.addLayer(geoimg);
  xmap.MapView.setCenter( [2.46840,48.8170]);
  xmap.MapView.setZoom( 14);
});

onUnmounted(()=>{
    if(geoimg)
    {
        const xmap=Global.XMap as XMap;
        xmap.map.removeLayer(geoimg);
    }

});

</script>

<style scoped>
.GeoImageLayer
{
    position: absolute;
    left:30px;
    top:30px;
    font-weight: 600;
    background-color: #eee;
}

</style>