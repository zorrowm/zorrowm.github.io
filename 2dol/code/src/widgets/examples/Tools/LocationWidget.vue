<template>
    <div class="location">
      <span title="定位"> <Icon icon = "gis:position-o" /></span>
        <q-popup-proxy :model-value="locationVisible" transition-show="flip-up" transition-hide="flip-down">
          <div class="q-pa-sm">
            <div class="text-h6 text-center q-mb-md">坐标定位</div>
            <div class="sjz">
                  <div class="xcoor">
                    <q-input  dense style="width: 200px;" v-model="xRef" label="经度:" placeholder="经度十进制" />
                  </div>
                  <div class="ycoor">
                    <q-input   dense style="width: 200px;" v-model="yRef" label="纬度:" placeholder="纬度十进制" />
                  </div>
                  <div>
                    <q-input 
                        id="inputNumber"
                        label="级别:"
                        v-model.number="zRef"
                        type="number"
                        dense
                        style="max-width: 200px"
                        :min="1"
                        :max="22"
                      />
                  </div>
                  <div style="margin:0 auto">
                     <q-btn color="primary" text-color="black" label="确定" @click="locatePostion" />
                  </div>
                 
                </div>
          </div>
        </q-popup-proxy>
    </div>
</template>

<script setup lang="ts">
import { XMap,PrjGridTool } from 'xgis-ol';
import { onMounted,ref } from 'vue';
import { Global } from 'xframelib';
const mapRef=ref<XMap>();
  const locationVisible=ref(false);
onMounted(()=>{
  if(Global.XMap)
  {
    mapRef.value=Global.XMap as XMap;
  }
})

const xRef = ref<number>();
      const yRef = ref<number>();
      const zRef = ref<number>();
      //定位
      function locatePostion() {
        if (xRef.value != undefined && yRef.value != undefined)
        doLocation( xRef.value, yRef.value, zRef.value);
      }

function doLocation(x: number, y: number, z: number | undefined) {
          const xMap=Global.XMap;
            if (xMap.map) {
                const view = xMap.MapView;
                const prj = view.getProjection();
                const targetPoint = PrjGridTool.transformCoordinate([x, y], 'EPSG:4326', prj); //fromLonLat(, prj); 
                view.setCenter(targetPoint);
                if (z && z >= 0) view.setZoom(z);
            }
        }
</script>
<style>
.location
{
  position: absolute;
  right:10px;
  top:20px;
  z-index: 100;
}
</style>