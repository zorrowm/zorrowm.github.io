<template>
    <div class="LayerSwitch">
        <q-btn round color="secondary" >
            <Icon icon = "ion:layers"  color="#fff"/>
            <q-menu  cover anchor="center left" style="min-height:80px">
                <q-list class="row" style="min-height:80px">
                    <q-item clickable class="column items-center" style="border:1px red  solid">
                        <q-item-section style="width:70px;">
                            <q-img src="img/img.jpg">
                            </q-img>
                        </q-item-section>
                        <q-item-section>  影像</q-item-section>

                    </q-item>
                    <q-item clickable class="column  items-center" >
                        <q-item-section style="width:70px;height:100%">
                            <q-img src="img/vec.jpg">
                            </q-img>

                        </q-item-section>
                        <q-item-section> 矢量</q-item-section>
                    </q-item>
                    <q-item clickable class="column  items-center">
                        <q-item-section style="width:70px;height:100%">
                            <q-img src="img/ter.jpg">
                            </q-img>
                        </q-item-section>
                        <q-item-section>地形</q-item-section>
                    </q-item>
                </q-list>
            </q-menu>

        </q-btn>

    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

onMounted(() => {

    console.log('LayerSwitcher加载了00000000')
});

</script>

<style scoped>
.LayerSwitch {
    position: absolute;
    right: 10px;
    bottom: 20px;

}

.img-caption {
    position: absolute;
    bottom: -20px;
    font-size: 14px;

}
</style>