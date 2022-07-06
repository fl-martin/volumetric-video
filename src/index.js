import { createARBtn } from "./js/ar-button";
import { ambient, spotLight } from "./js/lights";
import { playVideo } from "./js/play-stop";
import { createRenderer } from "./js/renderer";
import { scene, camera } from "./js/scene-camera";
import { createTetavi } from "./js/tetavi-setup";
import { callAnimation } from "./js/three-animate";
import { ObjectControls } from "threeJS-object-controls";

scene.add(ambient);
scene.add(spotLight);

const body = document.body;

const { renderer } = createRenderer(camera);

const tetavi = createTetavi(camera, renderer).tetavi;

const enterBtn = createARBtn(renderer).button;

const { pivot } = playVideo(enterBtn, tetavi, scene);

callAnimation(tetavi, scene, camera, pivot, renderer);

const objControls = new ObjectControls(camera, body, pivot);
objControls.enableHorizontalRotation();

console.log(objControls);
