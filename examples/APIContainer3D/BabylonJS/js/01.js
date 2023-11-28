/******* 创建场景环境，例子代码 ******/
let createScene = function (canvas, engine) {
  // 创建一个场景scene
  var scene = new BABYLON.Scene(engine);

  // 添加一个相机，并绑定鼠标事件
  var camera = new BABYLON.ArcRotateCamera(
    'Camera',
    Math.PI / 2,
    Math.PI / 2,
    2,
    new BABYLON.Vector3(0, 0, 5),
    scene
  );
  camera.attachControl(canvas, true);

  // 添加一组灯光到场景
  var light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), scene);
  var light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(0, 1, -1), scene);

  // 添加一个球体到场景中
  var sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2 }, scene);
  sphere.position.y = 1;
  //创建默认地面
  var ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);
  return scene;
};
export default createScene;
