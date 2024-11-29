<template>
    <div class="dataheader">
      <div class="btnMenu">
        <span title="一屏" @click="showOneMap" class="iconfont icon-a-Onescreen" :style="getBackColor(1)">一屏</span>
        <span title="双屏" @click="showTwoMap" class="iconfont icon-a-Twoscreens" :style="getBackColor(2)">二屏</span>
        <span title="四屏" @click="showFourMap" class="iconfont icon-a-Fourscreens" :style="getBackColor(4)">四屏</span>
      </div>
    </div>
    <div>
      <div v-for="(key, index) in mapArray" :key="key" :style="mapStyle">
        <one-map :key="getID(key)" :id="getMapID(key)" :num="mapArray.length" :index="index" :layerName="layerName" />
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { uuid } from 'xframelib';

import oneMap from './OneMap.vue';

    const mapArray = ref([1]);

     let current = 1;
      function showOneMap() {
        current = 1;
        mapArray.value = [1];
      }
      function showTwoMap() {
        current = 2;
        mapArray.value = [1, 2];
      }
      function showFourMap() {
        current = 4;
        mapArray.value = [1, 2, 3, 4];
      }
      function getBackColor(i: number) {
        let style = '';
        if (i === current) style = 'color:blue;font-weight:700'; //background-
        return style;
      }
  

      function getMapID(id: number) {
        return 'map' + id;
      }
      function getID(id: number) {
        return uuid();
      }
      const mapStyle = computed(() => {
        let width = '100%';
        let size = mapArray.value.length / 2;
        if (size >= 1) width = '50%';
        else size = 1;
        let cheight = document.body.clientHeight-30;
        if (size === 2) cheight = cheight - 6;
        const height = cheight / size;
        return `position:relative;display: inline-block;width:${width};height:${height}px;padding-right:1px`;
      });
      onMounted(() => {
      });
  </script>
  
  <style scoped>
  .map1div {
    display: inline-block;
    width: 50%;
    /* background: var(--map-height); */
    /* height: 400px; */
    padding-right: 1px;
  }
  
  .dataheader {
    width: 100%;
    height: 30px;
    background: #eee;
  }
  
  .btnMenu {
    width: 100px;
    display: inline-flex;
    font-size: 18px;
    justify-content: space-between;
    margin-top: 2px;
    margin-left: 5px;
  }
  </style>
  