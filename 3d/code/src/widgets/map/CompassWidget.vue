<template>
    <q-item-section v-drag class="compassgroup">
      <q-item-label class="infoAngel">
        {{ angel }}
      </q-item-label>
      <q-item-label  class="infoAngel2">
        <div></div>
      </q-item-label>
      <q-item-label
        caption :style="rotateStyle" @mouseup="resetBearing" @touchstart="handelmovestart"
        @touchmove="handelmove">
        <Icon icon="mylocal:compass"></Icon>
      </q-item-label>
    </q-item-section>
  
  </template>
  
  <script setup lang="ts">
  import { onMounted,onUnmounted,ref } from 'vue';
  import { Global } from 'xframelib';
  
  let map;
  
  const resetBearing = () => {
    map.setBearing(0);
  };
  
  let rotateStyle = ref();
  let angel = ref();
  const rotateCompassArrow = () => {
    const rotate = map.transform.angle * (180 / Math.PI);
    rotateStyle.value = `transform: rotate(${rotate}deg)`;
    angelCalculate(rotate);
  };
  const angelCalculate = (rotate) => {
    let deg;
    if (rotate < 0) deg =(360 + Math.floor(rotate));
    else deg =Math.floor(rotate);
    if(deg>0)
     deg=Math.floor(360-deg);
    let orientation;
    if (deg >= 340 || deg < 20) {
      orientation = '北';
    } else if (deg >= 20 && deg < 70) {
      orientation = '东北';
    } else if (deg >= 70 && deg < 110) {
      orientation = '东';
    } else if (deg >= 110 && deg < 160) {
      orientation = '东南';
    } else if (deg >= 160 && deg < 200) {
      orientation = '南';
    } else if (deg >= 200 && deg < 250) {
      orientation = '西南';
    } else if (deg >= 250 && deg < 290) {
      orientation = '西';
    } else if (deg >= 290 && deg < 340) {
      orientation = '西北';
    }
    if(deg===0)
    angel.value = `${orientation}`;
    else
    angel.value = `${deg}°${orientation}`;
  };
  
  let startX:number=0;
  const handelmovestart = (e) => {
    startX = e.changedTouches[0].pageX.toFixed(0);
  };
  const handelmove = (e) => {
    const moveX = e.changedTouches[0].pageX.toFixed(0);
    const subX = moveX - startX;
    map.setBearing(subX)
  };
  
  onMounted(async()=>{
    MapInit();
  })
  
  function MapInit() {
    if (Global.map) {
        map = Global.map;
        if(map){
          map.on('rotate', rotateCompassArrow);
        }
    }
  }
  
  onUnmounted(()=>{
    if(map){
      map.off('rotate', rotateCompassArrow);
    }
  })
  </script>
  
  <style lang="scss" scoped>
  .compassgroup {
    position: absolute;
    top: 3.8rem;
    left: 0;
    pointer-events: all;
  
    & .iconify {
      width: 6rem;
      height: 6rem;
      /* 图片文字的基线对齐，必须要有 */
      vertical-align: middle;
    }
    .infoAngel {
      text-align: center;
      font-weight: 500;
      font-size: 0.8rem;
    }
    .infoAngel2 {
      display: flex;
      justify-content: center;
      margin-bottom: -2rem;
      div {
        border: 2px solid red;
        width:0;
         height: 1rem;
        font-size: 0;
      }
    }
  }
  </style>
  