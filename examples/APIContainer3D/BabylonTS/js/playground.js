import '../lib/babylon.js';
import '../lib/babylonjs.loaders.min.js';
import '../lib/babylonjs.materials.min.js';
import '../lib/babylonjs.proceduralTextures.min.js';
import '../lib/babylonjs.postProcess.min.js';
import '../lib//babylonjs.loaders.min.js';
import '../lib/babylonjs.serializers.min.js';
import '../lib/babylon.gui.min.js';
import '../lib/babylon.inspector.bundle.js';
import '../lib/babylon.nodeEditor.js';
import '../lib/babylon.guiEditor.js';

export function play(createScene) {
  const canvas = document.getElementById('renderCanvas'); // 得到canvas对象的引用
  const engine = new BABYLON.Engine(canvas, true); // 初始化 BABYLON 3D engine // 参数1传入 canvas， 参数2指定是否开启抗锯齿
  const scene = createScene(engine, canvas);
  // 最后一步调用engine的runRenderLoop方案，执行scene.render()，让我们的3d场景渲染起来
  if (scene)
    engine.runRenderLoop(function () {
      scene.render();
    });

  // 监听浏览器改变大小的事件，通过调用engine.resize()来自适应窗口大小
  window.addEventListener('resize', function () {
    engine.resize();
  });
}
