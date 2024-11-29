<template></template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';

let maskDiv;
function AddMask() {
    maskDiv = document.createElement("div")
    maskDiv.className = "maskDiv"
    document.body.appendChild(maskDiv)
    maskDiv.style.cssText = `
    position: absolute;
    top:0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index:199;
    background-image: radial-gradient(rgba(139, 138, 138, 0.219) 50%,
    rgba(65, 57, 57, 0.658) 70%,
    rgba(17, 16, 16, 1) 90%);`

}

onMounted(() => {
    //加载时处理
    if(Global.map){
        AddMask();
    }
})
onUnmounted(() => {
    //卸载时处理
    if(maskDiv){
        document.removeChild(maskDiv);
    }
})
</script>
<style lang="scss" scoped></style>