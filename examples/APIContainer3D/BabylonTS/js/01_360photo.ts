/// <reference path="../lib/babylon.module.d.ts"/>
class HelloWorld {
  public static CreateScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera(
      'Camera',
      -Math.PI / 2,
      Math.PI / 2,
      5,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.inputs.attached.mousewheel.detachControl();

    var dome = new BABYLON.PhotoDome(
      'testdome',
      './textures/360photo.jpg',
      {
        resolution: 32,
        size: 1000
      },
      scene
    );
    return scene;
  }
}
