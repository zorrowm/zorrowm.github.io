<template>
  <ul class="tool-container">
    <li
      v-if="!isGuestComputed"
      @click="changedataPanel"
      :style="dataPanelSelected"
    >
      <span title="列表"><Icon icon="gis:map-legend-o" /></span>
    </li>
    <li v-if="!isGuestComputed" @click="drawSelect" :style="backSelectStyle">
      <span title="反向定位">
        <Icon icon="teenyicons:drag-outline" />
      </span>
    </li>
    <li @click="toggleRowGrid" :style="vectorbackStyle">
      <span title="网格图层">
        <Icon icon="geo:turf-point-grid" />
      </span>
    </li>
    <li @click="selectXYZ" :style="backgroundStyle">
      <span title="瓦片链接">
        <Icon icon="arcticons:urlsanitizer" />
      </span>
    </li>
  </ul>
</template>

<script lang="ts">
import { Feature } from "ol";
import { platformModifierKeyOnly } from "ol/events/condition";
import { GeoJSON } from "ol/format";
import { DragBox } from "ol/interaction";
import {
  computed,
  defineComponent,
  h,
  onMounted,
  PropType,
  ref,
  watch,
} from "vue";
import { bool } from "vue-types";
import { getProxyClient, Global, H5Tool } from "xframelib";
import { mapMenuState, XMap } from "xgis-ol";
import { EmitMsg } from "@/events";
import SystemsEvent from "@/events/modules/SystemsEvent";

export default defineComponent({
  name: "otherTool",
  props: {
    xmap: {
      type: Object as PropType<XMap>,
      // required: true
    },
    isguest: bool().def(false), //是否是游客
  },
  emits: ["dragBoxFeature"],
  components: {  },
  setup(props, { emit }) {

    const backgroundStyle = ref("");
    const vectorbackStyle = ref("");
    const backSelectStyle = ref("");

    //地图被重置，工具状态也得重置
    watch(
      () => props.xmap,
      () => {
        isGridLayer = false;
        isBoxSelectEnable = false;
        isSelectEnable = false;
      }
    );

    let isGridLayer = false;
    function toggleRowGrid() {
      if (isGridLayer) {
        vectorbackStyle.value = "background-color:#fff";
      } else {
        vectorbackStyle.value = "background-color:#808080";
      }
      isGridLayer = !isGridLayer;

      if (Global.DebugLayer) {
        Global.Logger().info(Global.DebugLayer, isGridLayer, "调试网格图层");
        Global.DebugLayer.setVisible(isGridLayer);
      }
    }
    let isSelectEnable = false;
    function selectXYZ() {
      if (!props.xmap) return;
      const thismap = props.xmap.map;
      if (isSelectEnable) {
        thismap?.un("click", showPosition);
        backgroundStyle.value = "background-color:#fff";
      } else {
        thismap?.on("click", showPosition);
        backgroundStyle.value = "background-color:#808080";
      }

      isSelectEnable = !isSelectEnable;
    }

    function showPosition(evt: any) {
    }

    const dataPanelSelected = computed(() => {
      let style = "";
      if (mapMenuState.dataPanel) {
        style = "background-color:#ccc";
      }
      return style;
    });
    function changedataPanel() {
      const isvisible = mapMenuState.dataPanel;
      mapMenuState.dataPanel = !isvisible;
    }
    //是否是游客模式
    const isGuestComputed = computed(() => {
      return props.isguest;
    });

    //选中要素进行查询
    function dragBoxSelected() {
      if (!dragBox) return;
      console.log(dragBox.getGeometry(), Global.DrawFeatureTool);

      const extentPolygon = dragBox.getGeometry();
      const fea = new Feature(extentPolygon);
      console.log(fea, "fea");

      if (Global.DrawFeatureTool) {
        const drawFeaTool = Global.DrawFeatureTool;
        drawFeaTool.addFeature(fea);
      }
      const featureGeoJson = new GeoJSON().writeFeature(fea);
      console.log(featureGeoJson, "featureGeoJson");
      mapMenuState.dataPanel = true;
      emit("dragBoxFeature", featureGeoJson);
    }
    function dragBoxStarted() {
      if (Global.DrawFeatureTool) {
        const drawFeaTool = Global.DrawFeatureTool;
        drawFeaTool.clear();
      }
    }
    let isBoxSelectEnable = false;
    let dragBox: DragBox;
    function drawSelect() {
      if (!props.xmap) return;
      const thismap = props.xmap.map;
      if (isBoxSelectEnable) {
        if (thismap) {
          if (dragBox) {
            dragBox.un("boxend", dragBoxSelected);
            dragBox.un("boxstart", dragBoxStarted);
            thismap.removeInteraction(dragBox);
          }
          //置空
          dragBoxStarted();
          //置空左侧列表
          EmitMsg(SystemsEvent.System_ImageKeyWord, "");
        }
        backSelectStyle.value = "background-color:#fff";
      } else {
        if (thismap) {
          Global.Message?.info("请按住Ctrl+鼠标左键拉框查询");
          dragBox = new DragBox({
            condition: platformModifierKeyOnly,
          });
          thismap.addInteraction(dragBox);
          dragBox.on("boxend", dragBoxSelected);
          dragBox.on("boxstart", dragBoxStarted);
        }
        backSelectStyle.value = "background-color:#808080";
      }

      isBoxSelectEnable = !isBoxSelectEnable;
    }
    return {
      selectXYZ,
      backgroundStyle,
      backSelectStyle,
      notification,
      toggleRowGrid,
      vectorbackStyle,
      dataPanelSelected,
      changedataPanel,
      isGuestComputed,
      drawSelect,
    };
  },
});
</script>

<style scoped>
.tool-container {
  border-radius: 4px;
  z-index: 10;
  font-size: 10px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 0;
  padding: 0 0;
  margin-top: -10px;
  border: 3px solid rgba(255, 255, 255, 0.4);
}

.tool-container > li {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  /* border-radius: 50%; */
  background: rgb(255, 255, 255);
  cursor: pointer;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
  border-bottom: 1px solid rgba(0, 0, 0, 0.6);
}
span {
  width: 20px;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
