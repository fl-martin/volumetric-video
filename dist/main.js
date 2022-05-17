/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/ar-button.js":
/*!*****************************!*\
  !*** ./src/js/ar-button.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createARBtn": () => (/* binding */ createARBtn)
/* harmony export */ });
const createARBtn = (renderer) => {
	class ARButton {
		static createButton(renderer, sessionInit = {}) {
			const button = document.createElement("button");

			function showStartAR(/*device*/) {
				if (sessionInit.domOverlay === undefined) {
					const overlay = document.createElement("div");
					overlay.style.display = "none";
					document.body.appendChild(overlay);

					const svg = document.createElementNS(
						"http://www.w3.org/2000/svg",
						"svg"
					);
					svg.setAttribute("width", 38);
					svg.setAttribute("height", 38);
					svg.style.position = "absolute";
					svg.style.right = "20px";
					svg.style.top = "20px";
					svg.addEventListener("click", function () {
						currentSession.end();
						window.location.reload();
					});
					overlay.appendChild(svg);

					const path = document.createElementNS(
						"http://www.w3.org/2000/svg",
						"path"
					);
					path.setAttribute("d", "M 12,12 L 28,28 M 28,12 12,28");
					path.setAttribute("stroke", "#fff");
					path.setAttribute("stroke-width", 2);
					svg.appendChild(path);

					if (sessionInit.optionalFeatures === undefined) {
						sessionInit.optionalFeatures = [];
					}

					sessionInit.optionalFeatures.push("dom-overlay");
					sessionInit.domOverlay = { root: overlay };
				}

				//

				let currentSession = null;

				async function onSessionStarted(session) {
					session.addEventListener("end", onSessionEnded);

					renderer.xr.setReferenceSpaceType("local");

					await renderer.xr.setSession(session);

					button.textContent = "STOP AR";
					sessionInit.domOverlay.root.style.display = "";

					currentSession = session;
				}

				function onSessionEnded(/*event*/) {
					currentSession.removeEventListener("end", onSessionEnded);

					button.textContent = "START AR";
					sessionInit.domOverlay.root.style.display = "none";

					currentSession = null;
				}

				button.style.display = "";

				button.style.cursor = "pointer";
				button.style.left = "calc(50% - 50px)";
				button.style.width = "100%";

				button.textContent = "START AR";

				button.onmouseenter = function () {
					button.style.opacity = "1.0";
				};

				button.onmouseleave = function () {
					button.style.opacity = "0.8";
				};

				button.onclick = function () {
					if (currentSession === null) {
						navigator.xr
							.requestSession("immersive-ar", sessionInit)
							.then(onSessionStarted);
					} else {
						currentSession.end();
					}
				};
			}

			function disableButton() {
				button.style.display = "";

				button.style.cursor = "auto";
				button.style.left = "calc(50% - 75px)";
				button.style.width = "150px";

				button.onmouseenter = null;
				button.onmouseleave = null;

				button.onclick = null;
			}

			function showARNotSupported() {
				disableButton();

				button.textContent = "AR NOT SUPPORTED";
			}

			function showARNotAllowed(exception) {
				disableButton();

				console.warn(
					"Exception when trying to call xr.isSessionSupported",
					exception
				);

				button.textContent = "AR NOT ALLOWED";
			}

			function stylizeElement(element) {
				element.style.padding = "1em 0.2em";
				element.style.border = "1px solid #fff";
				element.style.borderRadius = "15px";
				element.style.background = "#d9af2b";
				element.style.color = "#fff";
				element.style.font = "normal 3.5em sans-serif";
				element.style.textAlign = "center";
				element.style.opacity = "1";
				element.style.outline = "none";
				element.style.zIndex = "999";
			}

			if ("xr" in navigator) {
				button.id = "ARButton";
				button.style.display = "none";

				stylizeElement(button);

				navigator.xr
					.isSessionSupported("immersive-ar")
					.then(function (supported) {
						supported ? showStartAR() : showARNotSupported();
					})
					.catch(showARNotAllowed);

				return button;
			} else {
				const message = document.createElement("a");

				if (window.isSecureContext === false) {
					message.href = document.location.href.replace(
						/^http:/,
						"https:"
					);
					message.innerHTML = "WEBXR NEEDS HTTPS"; // TODO Improve message
				} else {
					message.href = "https://immersiveweb.dev/";
					message.innerHTML = "WEBXR NOT AVAILABLE";
				}

				message.style.left = "calc(50% - 90px)";
				message.style.width = "180px";
				message.style.textDecoration = "none";

				stylizeElement(message);

				return message;
			}
		}
	}

	const button = ARButton.createButton(renderer, {
		requiredFeatures: ["hit-test"],
	});

	document.getElementById("ui-container").appendChild(button);

	return { button };
};




/***/ }),

/***/ "./src/js/lights.js":
/*!**************************!*\
  !*** ./src/js/lights.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ambient": () => (/* binding */ ambient),
/* harmony export */   "spotLight": () => (/* binding */ spotLight)
/* harmony export */ });
const ambient = new Tetavi.THREE.AmbientLight(0x999999);

const spotLight = new Tetavi.THREE.SpotLight(0xffffff);
spotLight.position.set(0, 5, 0);
spotLight.castShadow = false;
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.1;
spotLight.decay = 2;
spotLight.distance = 200;




/***/ }),

/***/ "./src/js/play-stop.js":
/*!*****************************!*\
  !*** ./src/js/play-stop.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "playVideo": () => (/* binding */ playVideo)
/* harmony export */ });
const playVideo = (button, tetavi, scene) => {
	let firstPlay = true;

	const playStop = () => {
		if (firstPlay) {
			firstPlay = false;

			console.log(tetavi.getSrcVideo());

			tetavi.getSrcVideo().muted = true;

			tetavi.play();

			const pivot = new Tetavi.THREE.Object3D();

			pivot.add(tetavi.getScene());

			pivot.visible = false;

			scene.add(pivot);
		}
	};
	button.addEventListener("click", playStop);
};




/***/ }),

/***/ "./src/js/renderer.js":
/*!****************************!*\
  !*** ./src/js/renderer.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createRenderer": () => (/* binding */ createRenderer)
/* harmony export */ });
const createRenderer = (camera) => {
	const renderer = new Tetavi.THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.xr.enabled = true;
	document.body.appendChild(renderer.domElement);

	const controls = new TetaviExt.libOrbitControls(
		camera,
		renderer.domElement
	);
	controls.target.set(0, 1.5, 0);

	camera.position.z = 5;
	camera.position.y = 1.5;
	controls.update();

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	window.addEventListener("resize", onWindowResize);

	return { renderer };
};




/***/ }),

/***/ "./src/js/scene-camera.js":
/*!********************************!*\
  !*** ./src/js/scene-camera.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "camera": () => (/* binding */ camera),
/* harmony export */   "scene": () => (/* binding */ scene)
/* harmony export */ });
const scene = new Tetavi.THREE.Scene();

const camera = new Tetavi.THREE.PerspectiveCamera(
	70,
	window.innerWidth / window.innerHeight,
	0.01,
	20
);




/***/ }),

/***/ "./src/js/tetavi-setup.js":
/*!********************************!*\
  !*** ./src/js/tetavi-setup.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createTetavi": () => (/* binding */ createTetavi)
/* harmony export */ });
const createTetavi = (camera, renderer) => {
	const loadingPage = document.getElementById("loading-page");

	function onLog(log) {
		console.log(log);
	}

	function setBar(width, widthPlay) {
		if (tetavi != null) {
			if (widthPlay / width > 0.01 && tetavi.isReady()) {
				loadingPage.classList.add("hide");
			}
		}
	}

	const tetavi = Tetavi.create(
		renderer,
		camera,
		"./tvmodel/texturesVideo.mp4",
		"./tvmodel/Geometry.manifest"
	)
		.onSetBar(setBar)
		.setFadeAlpha(false)
		//.setShadowAngle(0.4)
		.onLog(onLog);

	tetavi.setShadowVisible(false);

	function require(str) {
		return "./tvmodel/" + str;
	}

	return { tetavi };
};




/***/ }),

/***/ "./src/js/three-animate.js":
/*!*********************************!*\
  !*** ./src/js/three-animate.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "callAnimation": () => (/* binding */ callAnimation)
/* harmony export */ });
const callAnimation = (tetavi, scene, camera, renderer) => {
	let pivot;
	let video;
	const geometry = new Tetavi.THREE.RingGeometry(0.08, 0.1, 32).rotateX(
		-Math.PI / 2
	);
	let material = new Tetavi.THREE.MeshBasicMaterial();
	const reticle = new Tetavi.THREE.Mesh(geometry, material);
	reticle.matrixAutoUpdate = false;
	reticle.visible = true;
	scene.add(reticle);

	let hitTestSource = null;
	let hitTestSourceRequested = false;

	const controller = renderer.xr.getController(0);

	async function requestHitTestSource() {
		const session = renderer.xr.getSession();
		session.addEventListener("end", () => {
			hitTestSourceRequested = false;
			hitTestSource = null;
		});
		const referenceSpace = await session.requestReferenceSpace("viewer");
		hitTestSource = await session.requestHitTestSource({
			space: referenceSpace,
		});
		hitTestSourceRequested = true;
	}

	function getHitTestResults(frame) {
		const hitTestResults = frame.getHitTestResults(hitTestSource);
		if (hitTestResults.length) {
			const hit = hitTestResults[0];
			const pose = hit.getPose(renderer.xr.getReferenceSpace());
			reticle.visible = true;
			reticle.matrix.fromArray(pose.transform.matrix);
		} else {
			reticle.visible = false;
		}
	}

	function onSelect() {
		if (reticle.visible) {
			video = tetavi.getSrcVideo();
			video.muted = false;
			video.pause();
			video.currentTime = 0;
			video.play();
			pivot.position.setFromMatrixPosition(reticle.matrix);
			pivot.position.y -= 0.3;
			pivot.visible = true;
		}
	}

	controller.addEventListener("select", onSelect);

	function three_animate(_, frame) {
		if (tetavi != null) {
			tetavi.animate();
			if (!pivot && scene.children[3]) {
				pivot = scene.children[3];
			}
		}

		if (frame) {
			if (hitTestSourceRequested === false) {
				requestHitTestSource();
			}
			if (hitTestSource) {
				getHitTestResults(frame);
			}
		}

		renderer.render(scene, camera);
	}

	renderer.setAnimationLoop(three_animate);
};




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_ar_button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/ar-button */ "./src/js/ar-button.js");
/* harmony import */ var _js_lights__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/lights */ "./src/js/lights.js");
/* harmony import */ var _js_play_stop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/play-stop */ "./src/js/play-stop.js");
/* harmony import */ var _js_renderer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./js/renderer */ "./src/js/renderer.js");
/* harmony import */ var _js_scene_camera__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./js/scene-camera */ "./src/js/scene-camera.js");
/* harmony import */ var _js_tetavi_setup__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./js/tetavi-setup */ "./src/js/tetavi-setup.js");
/* harmony import */ var _js_three_animate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./js/three-animate */ "./src/js/three-animate.js");








_js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.scene.add(_js_lights__WEBPACK_IMPORTED_MODULE_1__.ambient);
_js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.scene.add(_js_lights__WEBPACK_IMPORTED_MODULE_1__.spotLight);

const renderer = (0,_js_renderer__WEBPACK_IMPORTED_MODULE_3__.createRenderer)(_js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.camera).renderer;

const tetavi = (0,_js_tetavi_setup__WEBPACK_IMPORTED_MODULE_5__.createTetavi)(_js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.camera, renderer).tetavi;

const enterBtn = (0,_js_ar_button__WEBPACK_IMPORTED_MODULE_0__.createARBtn)(renderer).button;

(0,_js_play_stop__WEBPACK_IMPORTED_MODULE_2__.playVideo)(enterBtn, tetavi, _js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.scene);

(0,_js_three_animate__WEBPACK_IMPORTED_MODULE_6__.callAnimation)(tetavi, _js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.scene, _js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.camera, renderer);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0M7QUFDaEM7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOOztBQUVBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUMsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7O0FBRUY7O0FBRUEsVUFBVTtBQUNWOztBQUV1Qjs7Ozs7Ozs7Ozs7Ozs7OztBQzNMdkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRThCOzs7Ozs7Ozs7Ozs7Ozs7QUNWOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFcUI7Ozs7Ozs7Ozs7Ozs7OztBQ3pCckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsVUFBVTtBQUNWOztBQUUwQjs7Ozs7Ozs7Ozs7Ozs7OztBQ2hDMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUV5Qjs7Ozs7Ozs7Ozs7Ozs7O0FDVHpCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxVQUFVO0FBQ1Y7O0FBRXdCOzs7Ozs7Ozs7Ozs7Ozs7QUNuQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRXlCOzs7Ozs7O1VDaEZ6QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTjZDO0FBQ0k7QUFDTjtBQUNJO0FBQ0c7QUFDRDtBQUNFOztBQUVuRCx1REFBUyxDQUFDLCtDQUFPO0FBQ2pCLHVEQUFTLENBQUMsaURBQVM7O0FBRW5CLGlCQUFpQiw0REFBYyxDQUFDLG9EQUFNOztBQUV0QyxlQUFlLDhEQUFZLENBQUMsb0RBQU07O0FBRWxDLGlCQUFpQiwwREFBVzs7QUFFNUIsd0RBQVMsbUJBQW1CLG1EQUFLOztBQUVqQyxnRUFBYSxTQUFTLG1EQUFLLEVBQUUsb0RBQU0iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvYXItYnV0dG9uLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy9saWdodHMuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL3BsYXktc3RvcC5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvcmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL3NjZW5lLWNhbWVyYS5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvdGV0YXZpLXNldHVwLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy90aHJlZS1hbmltYXRlLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBjcmVhdGVBUkJ0biA9IChyZW5kZXJlcikgPT4ge1xuXHRjbGFzcyBBUkJ1dHRvbiB7XG5cdFx0c3RhdGljIGNyZWF0ZUJ1dHRvbihyZW5kZXJlciwgc2Vzc2lvbkluaXQgPSB7fSkge1xuXHRcdFx0Y29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcblxuXHRcdFx0ZnVuY3Rpb24gc2hvd1N0YXJ0QVIoLypkZXZpY2UqLykge1xuXHRcdFx0XHRpZiAoc2Vzc2lvbkluaXQuZG9tT3ZlcmxheSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRcdFx0b3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KTtcblxuXHRcdFx0XHRcdGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcblx0XHRcdFx0XHRcdFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcblx0XHRcdFx0XHRcdFwic3ZnXCJcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHN2Zy5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCAzOCk7XG5cdFx0XHRcdFx0c3ZnLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCAzOCk7XG5cdFx0XHRcdFx0c3ZnLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHRcdFx0XHRcdHN2Zy5zdHlsZS5yaWdodCA9IFwiMjBweFwiO1xuXHRcdFx0XHRcdHN2Zy5zdHlsZS50b3AgPSBcIjIwcHhcIjtcblx0XHRcdFx0XHRzdmcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uLmVuZCgpO1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG92ZXJsYXkuYXBwZW5kQ2hpbGQoc3ZnKTtcblxuXHRcdFx0XHRcdGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG5cdFx0XHRcdFx0XHRcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG5cdFx0XHRcdFx0XHRcInBhdGhcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0cGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwiTSAxMiwxMiBMIDI4LDI4IE0gMjgsMTIgMTIsMjhcIik7XG5cdFx0XHRcdFx0cGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgXCIjZmZmXCIpO1xuXHRcdFx0XHRcdHBhdGguc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIDIpO1xuXHRcdFx0XHRcdHN2Zy5hcHBlbmRDaGlsZChwYXRoKTtcblxuXHRcdFx0XHRcdGlmIChzZXNzaW9uSW5pdC5vcHRpb25hbEZlYXR1cmVzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHNlc3Npb25Jbml0Lm9wdGlvbmFsRmVhdHVyZXMgPSBbXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzZXNzaW9uSW5pdC5vcHRpb25hbEZlYXR1cmVzLnB1c2goXCJkb20tb3ZlcmxheVwiKTtcblx0XHRcdFx0XHRzZXNzaW9uSW5pdC5kb21PdmVybGF5ID0geyByb290OiBvdmVybGF5IH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL1xuXG5cdFx0XHRcdGxldCBjdXJyZW50U2Vzc2lvbiA9IG51bGw7XG5cblx0XHRcdFx0YXN5bmMgZnVuY3Rpb24gb25TZXNzaW9uU3RhcnRlZChzZXNzaW9uKSB7XG5cdFx0XHRcdFx0c2Vzc2lvbi5hZGRFdmVudExpc3RlbmVyKFwiZW5kXCIsIG9uU2Vzc2lvbkVuZGVkKTtcblxuXHRcdFx0XHRcdHJlbmRlcmVyLnhyLnNldFJlZmVyZW5jZVNwYWNlVHlwZShcImxvY2FsXCIpO1xuXG5cdFx0XHRcdFx0YXdhaXQgcmVuZGVyZXIueHIuc2V0U2Vzc2lvbihzZXNzaW9uKTtcblxuXHRcdFx0XHRcdGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU1RPUCBBUlwiO1xuXHRcdFx0XHRcdHNlc3Npb25Jbml0LmRvbU92ZXJsYXkucm9vdC5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblxuXHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uID0gc2Vzc2lvbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIG9uU2Vzc2lvbkVuZGVkKC8qZXZlbnQqLykge1xuXHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlbmRcIiwgb25TZXNzaW9uRW5kZWQpO1xuXG5cdFx0XHRcdFx0YnV0dG9uLnRleHRDb250ZW50ID0gXCJTVEFSVCBBUlwiO1xuXHRcdFx0XHRcdHNlc3Npb25Jbml0LmRvbU92ZXJsYXkucm9vdC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cblx0XHRcdFx0XHRjdXJyZW50U2Vzc2lvbiA9IG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cblx0XHRcdFx0YnV0dG9uLnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUubGVmdCA9IFwiY2FsYyg1MCUgLSA1MHB4KVwiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcblxuXHRcdFx0XHRidXR0b24udGV4dENvbnRlbnQgPSBcIlNUQVJUIEFSXCI7XG5cblx0XHRcdFx0YnV0dG9uLm9ubW91c2VlbnRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRidXR0b24uc3R5bGUub3BhY2l0eSA9IFwiMS4wXCI7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0YnV0dG9uLm9ubW91c2VsZWF2ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRidXR0b24uc3R5bGUub3BhY2l0eSA9IFwiMC44XCI7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0YnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKGN1cnJlbnRTZXNzaW9uID09PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRuYXZpZ2F0b3IueHJcblx0XHRcdFx0XHRcdFx0LnJlcXVlc3RTZXNzaW9uKFwiaW1tZXJzaXZlLWFyXCIsIHNlc3Npb25Jbml0KVxuXHRcdFx0XHRcdFx0XHQudGhlbihvblNlc3Npb25TdGFydGVkKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y3VycmVudFNlc3Npb24uZW5kKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBkaXNhYmxlQnV0dG9uKCkge1xuXHRcdFx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cblx0XHRcdFx0YnV0dG9uLnN0eWxlLmN1cnNvciA9IFwiYXV0b1wiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUubGVmdCA9IFwiY2FsYyg1MCUgLSA3NXB4KVwiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUud2lkdGggPSBcIjE1MHB4XCI7XG5cblx0XHRcdFx0YnV0dG9uLm9ubW91c2VlbnRlciA9IG51bGw7XG5cdFx0XHRcdGJ1dHRvbi5vbm1vdXNlbGVhdmUgPSBudWxsO1xuXG5cdFx0XHRcdGJ1dHRvbi5vbmNsaWNrID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gc2hvd0FSTm90U3VwcG9ydGVkKCkge1xuXHRcdFx0XHRkaXNhYmxlQnV0dG9uKCk7XG5cblx0XHRcdFx0YnV0dG9uLnRleHRDb250ZW50ID0gXCJBUiBOT1QgU1VQUE9SVEVEXCI7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHNob3dBUk5vdEFsbG93ZWQoZXhjZXB0aW9uKSB7XG5cdFx0XHRcdGRpc2FibGVCdXR0b24oKTtcblxuXHRcdFx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcdFx0XCJFeGNlcHRpb24gd2hlbiB0cnlpbmcgdG8gY2FsbCB4ci5pc1Nlc3Npb25TdXBwb3J0ZWRcIixcblx0XHRcdFx0XHRleGNlcHRpb25cblx0XHRcdFx0KTtcblxuXHRcdFx0XHRidXR0b24udGV4dENvbnRlbnQgPSBcIkFSIE5PVCBBTExPV0VEXCI7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHN0eWxpemVFbGVtZW50KGVsZW1lbnQpIHtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5wYWRkaW5nID0gXCIxZW0gMC4yZW1cIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZCAjZmZmXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIxNXB4XCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IFwiI2Q5YWYyYlwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmNvbG9yID0gXCIjZmZmXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuZm9udCA9IFwibm9ybWFsIDMuNWVtIHNhbnMtc2VyaWZcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5vdXRsaW5lID0gXCJub25lXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCI5OTlcIjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKFwieHJcIiBpbiBuYXZpZ2F0b3IpIHtcblx0XHRcdFx0YnV0dG9uLmlkID0gXCJBUkJ1dHRvblwiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG5cdFx0XHRcdHN0eWxpemVFbGVtZW50KGJ1dHRvbik7XG5cblx0XHRcdFx0bmF2aWdhdG9yLnhyXG5cdFx0XHRcdFx0LmlzU2Vzc2lvblN1cHBvcnRlZChcImltbWVyc2l2ZS1hclwiKVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChzdXBwb3J0ZWQpIHtcblx0XHRcdFx0XHRcdHN1cHBvcnRlZCA/IHNob3dTdGFydEFSKCkgOiBzaG93QVJOb3RTdXBwb3J0ZWQoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChzaG93QVJOb3RBbGxvd2VkKTtcblxuXHRcdFx0XHRyZXR1cm4gYnV0dG9uO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuXG5cdFx0XHRcdGlmICh3aW5kb3cuaXNTZWN1cmVDb250ZXh0ID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdG1lc3NhZ2UuaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYucmVwbGFjZShcblx0XHRcdFx0XHRcdC9eaHR0cDovLFxuXHRcdFx0XHRcdFx0XCJodHRwczpcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0bWVzc2FnZS5pbm5lckhUTUwgPSBcIldFQlhSIE5FRURTIEhUVFBTXCI7IC8vIFRPRE8gSW1wcm92ZSBtZXNzYWdlXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVzc2FnZS5ocmVmID0gXCJodHRwczovL2ltbWVyc2l2ZXdlYi5kZXYvXCI7XG5cdFx0XHRcdFx0bWVzc2FnZS5pbm5lckhUTUwgPSBcIldFQlhSIE5PVCBBVkFJTEFCTEVcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG1lc3NhZ2Uuc3R5bGUubGVmdCA9IFwiY2FsYyg1MCUgLSA5MHB4KVwiO1xuXHRcdFx0XHRtZXNzYWdlLnN0eWxlLndpZHRoID0gXCIxODBweFwiO1xuXHRcdFx0XHRtZXNzYWdlLnN0eWxlLnRleHREZWNvcmF0aW9uID0gXCJub25lXCI7XG5cblx0XHRcdFx0c3R5bGl6ZUVsZW1lbnQobWVzc2FnZSk7XG5cblx0XHRcdFx0cmV0dXJuIG1lc3NhZ2U7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgYnV0dG9uID0gQVJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyLCB7XG5cdFx0cmVxdWlyZWRGZWF0dXJlczogW1wiaGl0LXRlc3RcIl0sXG5cdH0pO1xuXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidWktY29udGFpbmVyXCIpLmFwcGVuZENoaWxkKGJ1dHRvbik7XG5cblx0cmV0dXJuIHsgYnV0dG9uIH07XG59O1xuXG5leHBvcnQgeyBjcmVhdGVBUkJ0biB9O1xuIiwiY29uc3QgYW1iaWVudCA9IG5ldyBUZXRhdmkuVEhSRUUuQW1iaWVudExpZ2h0KDB4OTk5OTk5KTtcblxuY29uc3Qgc3BvdExpZ2h0ID0gbmV3IFRldGF2aS5USFJFRS5TcG90TGlnaHQoMHhmZmZmZmYpO1xuc3BvdExpZ2h0LnBvc2l0aW9uLnNldCgwLCA1LCAwKTtcbnNwb3RMaWdodC5jYXN0U2hhZG93ID0gZmFsc2U7XG5zcG90TGlnaHQuYW5nbGUgPSBNYXRoLlBJIC8gNDtcbnNwb3RMaWdodC5wZW51bWJyYSA9IDAuMTtcbnNwb3RMaWdodC5kZWNheSA9IDI7XG5zcG90TGlnaHQuZGlzdGFuY2UgPSAyMDA7XG5cbmV4cG9ydCB7IGFtYmllbnQsIHNwb3RMaWdodCB9O1xuIiwiY29uc3QgcGxheVZpZGVvID0gKGJ1dHRvbiwgdGV0YXZpLCBzY2VuZSkgPT4ge1xuXHRsZXQgZmlyc3RQbGF5ID0gdHJ1ZTtcblxuXHRjb25zdCBwbGF5U3RvcCA9ICgpID0+IHtcblx0XHRpZiAoZmlyc3RQbGF5KSB7XG5cdFx0XHRmaXJzdFBsYXkgPSBmYWxzZTtcblxuXHRcdFx0Y29uc29sZS5sb2codGV0YXZpLmdldFNyY1ZpZGVvKCkpO1xuXG5cdFx0XHR0ZXRhdmkuZ2V0U3JjVmlkZW8oKS5tdXRlZCA9IHRydWU7XG5cblx0XHRcdHRldGF2aS5wbGF5KCk7XG5cblx0XHRcdGNvbnN0IHBpdm90ID0gbmV3IFRldGF2aS5USFJFRS5PYmplY3QzRCgpO1xuXG5cdFx0XHRwaXZvdC5hZGQodGV0YXZpLmdldFNjZW5lKCkpO1xuXG5cdFx0XHRwaXZvdC52aXNpYmxlID0gZmFsc2U7XG5cblx0XHRcdHNjZW5lLmFkZChwaXZvdCk7XG5cdFx0fVxuXHR9O1xuXHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHBsYXlTdG9wKTtcbn07XG5cbmV4cG9ydCB7IHBsYXlWaWRlbyB9O1xuIiwiY29uc3QgY3JlYXRlUmVuZGVyZXIgPSAoY2FtZXJhKSA9PiB7XG5cdGNvbnN0IHJlbmRlcmVyID0gbmV3IFRldGF2aS5USFJFRS5XZWJHTFJlbmRlcmVyKHtcblx0XHRhbnRpYWxpYXM6IHRydWUsXG5cdFx0YWxwaGE6IHRydWUsXG5cdH0pO1xuXHRyZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcblx0cmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcblx0cmVuZGVyZXIueHIuZW5hYmxlZCA9IHRydWU7XG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cblx0Y29uc3QgY29udHJvbHMgPSBuZXcgVGV0YXZpRXh0LmxpYk9yYml0Q29udHJvbHMoXG5cdFx0Y2FtZXJhLFxuXHRcdHJlbmRlcmVyLmRvbUVsZW1lbnRcblx0KTtcblx0Y29udHJvbHMudGFyZ2V0LnNldCgwLCAxLjUsIDApO1xuXG5cdGNhbWVyYS5wb3NpdGlvbi56ID0gNTtcblx0Y2FtZXJhLnBvc2l0aW9uLnkgPSAxLjU7XG5cdGNvbnRyb2xzLnVwZGF0ZSgpO1xuXG5cdGZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuXHRcdGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcblx0XHRjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG5cdFx0cmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcblx0fVxuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uV2luZG93UmVzaXplKTtcblxuXHRyZXR1cm4geyByZW5kZXJlciB9O1xufTtcblxuZXhwb3J0IHsgY3JlYXRlUmVuZGVyZXIgfTtcbiIsImNvbnN0IHNjZW5lID0gbmV3IFRldGF2aS5USFJFRS5TY2VuZSgpO1xuXG5jb25zdCBjYW1lcmEgPSBuZXcgVGV0YXZpLlRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuXHQ3MCxcblx0d2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG5cdDAuMDEsXG5cdDIwXG4pO1xuXG5leHBvcnQgeyBzY2VuZSwgY2FtZXJhIH07XG4iLCJjb25zdCBjcmVhdGVUZXRhdmkgPSAoY2FtZXJhLCByZW5kZXJlcikgPT4ge1xuXHRjb25zdCBsb2FkaW5nUGFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZGluZy1wYWdlXCIpO1xuXG5cdGZ1bmN0aW9uIG9uTG9nKGxvZykge1xuXHRcdGNvbnNvbGUubG9nKGxvZyk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRCYXIod2lkdGgsIHdpZHRoUGxheSkge1xuXHRcdGlmICh0ZXRhdmkgIT0gbnVsbCkge1xuXHRcdFx0aWYgKHdpZHRoUGxheSAvIHdpZHRoID4gMC4wMSAmJiB0ZXRhdmkuaXNSZWFkeSgpKSB7XG5cdFx0XHRcdGxvYWRpbmdQYWdlLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGNvbnN0IHRldGF2aSA9IFRldGF2aS5jcmVhdGUoXG5cdFx0cmVuZGVyZXIsXG5cdFx0Y2FtZXJhLFxuXHRcdFwiLi90dm1vZGVsL3RleHR1cmVzVmlkZW8ubXA0XCIsXG5cdFx0XCIuL3R2bW9kZWwvR2VvbWV0cnkubWFuaWZlc3RcIlxuXHQpXG5cdFx0Lm9uU2V0QmFyKHNldEJhcilcblx0XHQuc2V0RmFkZUFscGhhKGZhbHNlKVxuXHRcdC8vLnNldFNoYWRvd0FuZ2xlKDAuNClcblx0XHQub25Mb2cob25Mb2cpO1xuXG5cdHRldGF2aS5zZXRTaGFkb3dWaXNpYmxlKGZhbHNlKTtcblxuXHRmdW5jdGlvbiByZXF1aXJlKHN0cikge1xuXHRcdHJldHVybiBcIi4vdHZtb2RlbC9cIiArIHN0cjtcblx0fVxuXG5cdHJldHVybiB7IHRldGF2aSB9O1xufTtcblxuZXhwb3J0IHsgY3JlYXRlVGV0YXZpIH07XG4iLCJjb25zdCBjYWxsQW5pbWF0aW9uID0gKHRldGF2aSwgc2NlbmUsIGNhbWVyYSwgcmVuZGVyZXIpID0+IHtcblx0bGV0IHBpdm90O1xuXHRsZXQgdmlkZW87XG5cdGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRldGF2aS5USFJFRS5SaW5nR2VvbWV0cnkoMC4wOCwgMC4xLCAzMikucm90YXRlWChcblx0XHQtTWF0aC5QSSAvIDJcblx0KTtcblx0bGV0IG1hdGVyaWFsID0gbmV3IFRldGF2aS5USFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xuXHRjb25zdCByZXRpY2xlID0gbmV3IFRldGF2aS5USFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cdHJldGljbGUubWF0cml4QXV0b1VwZGF0ZSA9IGZhbHNlO1xuXHRyZXRpY2xlLnZpc2libGUgPSB0cnVlO1xuXHRzY2VuZS5hZGQocmV0aWNsZSk7XG5cblx0bGV0IGhpdFRlc3RTb3VyY2UgPSBudWxsO1xuXHRsZXQgaGl0VGVzdFNvdXJjZVJlcXVlc3RlZCA9IGZhbHNlO1xuXG5cdGNvbnN0IGNvbnRyb2xsZXIgPSByZW5kZXJlci54ci5nZXRDb250cm9sbGVyKDApO1xuXG5cdGFzeW5jIGZ1bmN0aW9uIHJlcXVlc3RIaXRUZXN0U291cmNlKCkge1xuXHRcdGNvbnN0IHNlc3Npb24gPSByZW5kZXJlci54ci5nZXRTZXNzaW9uKCk7XG5cdFx0c2Vzc2lvbi5hZGRFdmVudExpc3RlbmVyKFwiZW5kXCIsICgpID0+IHtcblx0XHRcdGhpdFRlc3RTb3VyY2VSZXF1ZXN0ZWQgPSBmYWxzZTtcblx0XHRcdGhpdFRlc3RTb3VyY2UgPSBudWxsO1xuXHRcdH0pO1xuXHRcdGNvbnN0IHJlZmVyZW5jZVNwYWNlID0gYXdhaXQgc2Vzc2lvbi5yZXF1ZXN0UmVmZXJlbmNlU3BhY2UoXCJ2aWV3ZXJcIik7XG5cdFx0aGl0VGVzdFNvdXJjZSA9IGF3YWl0IHNlc3Npb24ucmVxdWVzdEhpdFRlc3RTb3VyY2Uoe1xuXHRcdFx0c3BhY2U6IHJlZmVyZW5jZVNwYWNlLFxuXHRcdH0pO1xuXHRcdGhpdFRlc3RTb3VyY2VSZXF1ZXN0ZWQgPSB0cnVlO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0SGl0VGVzdFJlc3VsdHMoZnJhbWUpIHtcblx0XHRjb25zdCBoaXRUZXN0UmVzdWx0cyA9IGZyYW1lLmdldEhpdFRlc3RSZXN1bHRzKGhpdFRlc3RTb3VyY2UpO1xuXHRcdGlmIChoaXRUZXN0UmVzdWx0cy5sZW5ndGgpIHtcblx0XHRcdGNvbnN0IGhpdCA9IGhpdFRlc3RSZXN1bHRzWzBdO1xuXHRcdFx0Y29uc3QgcG9zZSA9IGhpdC5nZXRQb3NlKHJlbmRlcmVyLnhyLmdldFJlZmVyZW5jZVNwYWNlKCkpO1xuXHRcdFx0cmV0aWNsZS52aXNpYmxlID0gdHJ1ZTtcblx0XHRcdHJldGljbGUubWF0cml4LmZyb21BcnJheShwb3NlLnRyYW5zZm9ybS5tYXRyaXgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXRpY2xlLnZpc2libGUgPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBvblNlbGVjdCgpIHtcblx0XHRpZiAocmV0aWNsZS52aXNpYmxlKSB7XG5cdFx0XHR2aWRlbyA9IHRldGF2aS5nZXRTcmNWaWRlbygpO1xuXHRcdFx0dmlkZW8ubXV0ZWQgPSBmYWxzZTtcblx0XHRcdHZpZGVvLnBhdXNlKCk7XG5cdFx0XHR2aWRlby5jdXJyZW50VGltZSA9IDA7XG5cdFx0XHR2aWRlby5wbGF5KCk7XG5cdFx0XHRwaXZvdC5wb3NpdGlvbi5zZXRGcm9tTWF0cml4UG9zaXRpb24ocmV0aWNsZS5tYXRyaXgpO1xuXHRcdFx0cGl2b3QucG9zaXRpb24ueSAtPSAwLjM7XG5cdFx0XHRwaXZvdC52aXNpYmxlID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJzZWxlY3RcIiwgb25TZWxlY3QpO1xuXG5cdGZ1bmN0aW9uIHRocmVlX2FuaW1hdGUoXywgZnJhbWUpIHtcblx0XHRpZiAodGV0YXZpICE9IG51bGwpIHtcblx0XHRcdHRldGF2aS5hbmltYXRlKCk7XG5cdFx0XHRpZiAoIXBpdm90ICYmIHNjZW5lLmNoaWxkcmVuWzNdKSB7XG5cdFx0XHRcdHBpdm90ID0gc2NlbmUuY2hpbGRyZW5bM107XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGZyYW1lKSB7XG5cdFx0XHRpZiAoaGl0VGVzdFNvdXJjZVJlcXVlc3RlZCA9PT0gZmFsc2UpIHtcblx0XHRcdFx0cmVxdWVzdEhpdFRlc3RTb3VyY2UoKTtcblx0XHRcdH1cblx0XHRcdGlmIChoaXRUZXN0U291cmNlKSB7XG5cdFx0XHRcdGdldEhpdFRlc3RSZXN1bHRzKGZyYW1lKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG5cdH1cblxuXHRyZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKHRocmVlX2FuaW1hdGUpO1xufTtcblxuZXhwb3J0IHsgY2FsbEFuaW1hdGlvbiB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBjcmVhdGVBUkJ0biB9IGZyb20gXCIuL2pzL2FyLWJ1dHRvblwiO1xuaW1wb3J0IHsgYW1iaWVudCwgc3BvdExpZ2h0IH0gZnJvbSBcIi4vanMvbGlnaHRzXCI7XG5pbXBvcnQgeyBwbGF5VmlkZW8gfSBmcm9tIFwiLi9qcy9wbGF5LXN0b3BcIjtcbmltcG9ydCB7IGNyZWF0ZVJlbmRlcmVyIH0gZnJvbSBcIi4vanMvcmVuZGVyZXJcIjtcbmltcG9ydCB7IHNjZW5lLCBjYW1lcmEgfSBmcm9tIFwiLi9qcy9zY2VuZS1jYW1lcmFcIjtcbmltcG9ydCB7IGNyZWF0ZVRldGF2aSB9IGZyb20gXCIuL2pzL3RldGF2aS1zZXR1cFwiO1xuaW1wb3J0IHsgY2FsbEFuaW1hdGlvbiB9IGZyb20gXCIuL2pzL3RocmVlLWFuaW1hdGVcIjtcblxuc2NlbmUuYWRkKGFtYmllbnQpO1xuc2NlbmUuYWRkKHNwb3RMaWdodCk7XG5cbmNvbnN0IHJlbmRlcmVyID0gY3JlYXRlUmVuZGVyZXIoY2FtZXJhKS5yZW5kZXJlcjtcblxuY29uc3QgdGV0YXZpID0gY3JlYXRlVGV0YXZpKGNhbWVyYSwgcmVuZGVyZXIpLnRldGF2aTtcblxuY29uc3QgZW50ZXJCdG4gPSBjcmVhdGVBUkJ0bihyZW5kZXJlcikuYnV0dG9uO1xuXG5wbGF5VmlkZW8oZW50ZXJCdG4sIHRldGF2aSwgc2NlbmUpO1xuXG5jYWxsQW5pbWF0aW9uKHRldGF2aSwgc2NlbmUsIGNhbWVyYSwgcmVuZGVyZXIpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9