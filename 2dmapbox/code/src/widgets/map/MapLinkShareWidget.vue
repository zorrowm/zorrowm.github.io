<template>
    <div class="contentPanel">
        <q-btn-group push>
            <q-btn color="primary" push label="获取地址" icon="mdi-share-variant" @click="GetStyleParam()" />
            <q-btn color="primary" push label="获取二维码" icon="mdi-qrcode" @click="GetShareQrcode()" />
        </q-btn-group>
        <q-img v-if="imgUrl" :src="imgUrl" spinner-color="white" style="height: 150px; max-width: 150px" />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted,inject } from 'vue';
import { Global } from 'xframelib';
import QRCode from 'qrcode';
import { Map } from "mapbox-gl";

let map:Map;

const imgUrl = ref('');
const currentUrl =inject('$AppURL');

async function GetShareQrcode() {
    const text = await GetStyleParam(false);
    // 清除之前的二维码
    const element = document.getElementById('qrcode')
    if (element) {
        element.innerHTML = "";
    }

    // 创建新的二维码
    var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        quality: 0.3,
        // margin: 1,
        // color: {
        //     dark: "#010599FF",
        //     light: "#FFBF60FF"
        // }
    }
    QRCode.toDataURL(text, opts, (err, url) => {
        if (err){
            Global.Message.err(`构建二维码出现异常:${err}`)
            return;
        } 
        imgUrl.value = url
    });
}

//获取样式参数
async function GetStyleParam(isCopy=true) {
    if (!map) {
        Global.Message.info('当前地图未加载')
        return;
    }

    const style = map.getStyle();
    const center = map.getCenter();
    const zoom = map.getZoom();
    const param = {
        center,
        zoom,
        style
    }
    const url = currentUrl + `#/product/apiexamples?wid=SharePageWidget&style=${JSON.stringify(param)}`;
    if (isCopy) {
        await navigator.clipboard.writeText(url);
        Global.Message.success('内容已复制到剪贴板')
    }else{
        return currentUrl + `#/product/apiexamples?wid=SharePageWidget&style={key})}`
        // return url;
    }
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
.contentPanel {
    position: absolute;
    top: 2%;
    right: 5%;
}
</style>