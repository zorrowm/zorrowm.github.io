import '../jslib/babylon.js';
import '../jslib/babylonjs.loaders.min.js';
export function play(createScene) {
  const canvas = document.getElementById('renderCanvas'); // 得到canvas对象的引用
  const engine = new BABYLON.Engine(canvas, true); // 初始化 BABYLON 3D engine
  const scene = createScene(canvas, engine);
  // 最后一步调用engine的runRenderLoop方案，执行scene.render()，让我们的3d场景渲染起来
  engine.runRenderLoop(function () {
    scene.render();
  });

  // 监听浏览器改变大小的事件，通过调用engine.resize()来自适应窗口大小
  window.addEventListener('resize', function () {
    engine.resize();
  });
}
