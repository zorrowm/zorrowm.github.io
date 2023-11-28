/// <reference path="../lib/babylon.module.d.ts"/>
class Playground {
  public static CreateScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2,
      100,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    // const ground = BABYLON.MeshBuilder.CreateGround('myGround', {
    //   width: 50,
    //   height: 50,
    //   subdivisions: 4
    // });

    // const groundMaterial = new BABYLON.StandardMaterial('material', scene);
    // groundMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    // ground.material = groundMaterial;

    camera.attachControl(canvas, true); // 相机绑定控制
    //new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene); // 添加半球光用来模拟环境光

    const sphere = BABYLON.MeshBuilder.CreateSphere('earth', { segments: 64, diameter: 50 }, scene);

    const earthMaterial = new BABYLON.StandardMaterial('earthmaterial', scene);
    earthMaterial.diffuseTexture = new BABYLON.Texture('/BabylonTS/textures/global.jpg', scene);
    // earthMaterial.emissiveTexture = new BABYLON.Texture('/BabylonTS/textures/global.jpg', scene);
    earthMaterial.backFaceCulling = false;
    // earthMaterial.invertNormalMapY = true;
    // earthMaterial.invertNormalMapX = true;
    // earthMaterial.invertRefractionY = true;
    // earthMaterial.emissiveTexture.wrapU = 0;
    // earthMaterial.diffuseTexture.uOffset = 0;
    // earthMaterial.diffuseTexture.vOffset = 1;
    earthMaterial.diffuseTexture.vOffset = 0.1;
    earthMaterial.wireframe = true;
    sphere.material = earthMaterial;
    return scene;
  }
}
