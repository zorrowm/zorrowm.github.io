<template>
  <div class="earth" @click="clickEarth">
    <Icon icon="mdi-layers" color="#fff" />
  </div>
  <div class="radioClass" v-if="showEarth">
    <div class="switchingMap_vec" ref="vec" @click="handleChange(TDTBaceMapType.TDT_Vec)" tabindex="1">
      <span>矢量</span>
    </div>
    <div class="switchingMap_image" ref="image" @click="handleChange(TDTBaceMapType.TDT_Img)" tabindex="1">
      <span>影像</span>
    </div>
    <div class="switchingMap_ter" ref="ter" @click="handleChange(TDTBaceMapType.TDT_Ter)" tabindex="1">
      <span>地形</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';
import MapTool,{ TDTBaceMapType } from "./MapTool";

let map;
const showEarth = ref(false);
function clickEarth() {
  showEarth.value = !showEarth.value;
}
function handleChange(type: TDTBaceMapType) {
  console.log(`type`, type,map);
  MapTool.ChangeBaseLayer(map,type)
}
onMounted(() => {
  //加载时处理
  if (Global.map) {
    map = Global.map;
  }
})
onUnmounted(() => {
  //卸载时处理

})
</script>
<style lang="scss" scoped>
.earth {
  width: 2.875rem;
  height: 2.875rem;
  background: url("img/baselayer/btngaoliang.png") no-repeat;
  background-size: 100%;
  position: absolute;
  right: 3rem;
  bottom: 12.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;
}

.earth svg {
  font-size: 1.75rem;
}

.radioClass {
  position: absolute;
  right: 5.5525rem;
  bottom: 8.75rem;
  width: 29rem;
  height: 6.625rem;
  background: #FFFFFF;
  box-shadow: 0px 0px 7px 0px rgba(66, 66, 66, 0.18);
  opacity: 0.9;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.switchingMap_vec,
.switchingMap_image,
.switchingMap_ter {
  width: 6.875rem;
  height: 5.625rem;
  background: pink;
  border-radius: 5px;
  background: url("img/baselayer/vec_c.png") no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  color: #fff;
  font-size: 1rem;
}

.switchingMap_vec:focus,
.switchingMap_vec:active,
.switchingMap_image:focus,
.switchingMap_image:active,
.switchingMap_ter:focus,
.switchingMap_ter:active {
  outline: 2px solid #2156B2;
  border-radius: 5px;
}

.switchingMap_vec:focus span,
.switchingMap_vec:active span,
.switchingMap_image:focus span,
.switchingMap_image:active span,
.switchingMap_ter:focus span,
.switchingMap_ter:active span,

.switchingMap_image {
  background: url("img/baselayer/image.jpg") no-repeat;
}

.switchingMap_ter {
  background: url("img/baselayer/ter_c.png") no-repeat;
}

.switchingMap_3d {
  background: url("img/baselayer/ele_c.jpg") no-repeat;
}

.switchingMap_vec {
  z-index: 99;
  border: 1px solid #1F4583;
}
</style>