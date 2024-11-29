<template>
<ContextMenu v-if="xmapRef" :xmap="xmapRef" :target="contextTarget" :moreMenuList="menuList" @itemClicked="doItemClick"></ContextMenu>
</template>

<script setup lang="ts">
import { computed,onMounted,ref } from 'vue';
import { Global } from 'xframelib';
import { ContextMenu } from 'xgis-ol';

const xmapRef=ref(Global.XMap);
const menuList = [
{},
{

    id: 'other',
    label: '更多功能',
    icon: 'ic:round-other-houses'
},

{
    id: 'test',
    label: '测试功能',
    icon: 'ic:twotone-10k'
}
]
const contextTarget=ref('map')
function doItemClick(item)
{
    Global.Message.info('点击了' + item.label);

}
onMounted(()=>{
    xmapRef.value=Global.XMap;
    contextTarget.value=Global.XMap.target;
})

</script>

<style lang="scss" scoped>
</style>