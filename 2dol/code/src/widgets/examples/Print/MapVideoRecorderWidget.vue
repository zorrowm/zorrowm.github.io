<template>
    <div>
        <div id="video">
            <div>
                <video controls></video>
                <span @click="closeVideo">✖</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import VideoRecorder from 'ol-ext/control/VideoRecorder';
import { onMounted, onUnmounted } from 'vue';
import { Global, jquery } from 'xframelib';
import { XMap } from 'xgis-ol';
let videoControl: any;
onMounted(() => {
    const xmap = Global.XMap as XMap;
    const prj = xmap.MapView.getProjection();
    videoControl = new VideoRecorder();
    if (videoControl)
        xmap.map.addControl(videoControl);

    videoControl.on('stop', function (e) {
        const videoElement = document.querySelector('video');
        videoElement.src = e.videoURL;
        const videoContainer=document.getElementById('video');
        jquery.addClass(videoContainer,'visible');
        const mapDiv=document.getElementById('map');
        jquery.removeClass(mapDiv,'recording');
    });

    videoControl.on('start', function (e) {
        // $('body').append(e.canvas);
        const mapDiv=document.getElementById('map');
        jquery.addClass(mapDiv,'recording');
    })
    
    videoControl.on('error', console.log)

})

function closeVideo()
{
    const videoContainer=document.getElementById('video');
    jquery.removeClass(videoContainer,'visible');
}


onUnmounted(() => {
    if (Global.XMap) {
        const xmap = Global.XMap as XMap;
        if (videoControl)
            xmap.map.removeControl(videoControl);

    }
});


</script>

<style>
#video {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .7);
    z-index: 9999;
    opacity: 0;
    pointer-events: none;
    transition: .5s;
}

#video.visible {
    opacity: 1;
    pointer-events: all;
}

#video>div {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
#video span {
      position: absolute;
      top: 50px;
      right: 0;
      margin: .25em;
      font-size: 1.5em;
      color: #fff;
      cursor: pointer;
      text-shadow: 1px 1px #000;
      width: 1em;
      height: 1em;
      line-height: 1em;
      text-align: center;
      z-index: 9999;
    }
    #video div:hover span {
      background: rgba(0,0,0,.6);
      box-shadow: 0 0 20px #000, 0 0 20px #000, 0 0 20px #000;
      border-radius: 50%;
    }
#map.recording:before {
    content: "";
    position: absolute;
    width: 50px;
    height: 50px;
    animation: blink .25s alternate infinite;
    left: -5px;
    top: -5px;
    background: #369;
    box-shadow: 560px 0 #369, 560px 360px #369, 0 360px #369;
    z-index: -1;
}

@keyframes blink {

    0%,
    50% {
        opacity: 0;
    }

    51%,
    100% {
        opacity: 1;
    }
}
</style>