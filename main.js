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
						button.classList.add("hide");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0M7QUFDaEM7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047O0FBRUE7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QyxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjs7QUFFQSxVQUFVO0FBQ1Y7O0FBRXVCOzs7Ozs7Ozs7Ozs7Ozs7O0FDNUx2Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFOEI7Ozs7Ozs7Ozs7Ozs7OztBQ1Y5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVxQjs7Ozs7Ozs7Ozs7Ozs7O0FDekJyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxVQUFVO0FBQ1Y7O0FBRTBCOzs7Ozs7Ozs7Ozs7Ozs7O0FDaEMxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRXlCOzs7Ozs7Ozs7Ozs7Ozs7QUNUekI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjs7QUFFd0I7Ozs7Ozs7Ozs7Ozs7OztBQ25DeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFeUI7Ozs7Ozs7VUNoRnpCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNONkM7QUFDSTtBQUNOO0FBQ0k7QUFDRztBQUNEO0FBQ0U7O0FBRW5ELHVEQUFTLENBQUMsK0NBQU87QUFDakIsdURBQVMsQ0FBQyxpREFBUzs7QUFFbkIsaUJBQWlCLDREQUFjLENBQUMsb0RBQU07O0FBRXRDLGVBQWUsOERBQVksQ0FBQyxvREFBTTs7QUFFbEMsaUJBQWlCLDBEQUFXOztBQUU1Qix3REFBUyxtQkFBbUIsbURBQUs7O0FBRWpDLGdFQUFhLFNBQVMsbURBQUssRUFBRSxvREFBTSIsInNvdXJjZXMiOlsid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy9hci1idXR0b24uanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL2xpZ2h0cy5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvcGxheS1zdG9wLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy9yZW5kZXJlci5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvc2NlbmUtY2FtZXJhLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy90ZXRhdmktc2V0dXAuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL3RocmVlLWFuaW1hdGUuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNyZWF0ZUFSQnRuID0gKHJlbmRlcmVyKSA9PiB7XG5cdGNsYXNzIEFSQnV0dG9uIHtcblx0XHRzdGF0aWMgY3JlYXRlQnV0dG9uKHJlbmRlcmVyLCBzZXNzaW9uSW5pdCA9IHt9KSB7XG5cdFx0XHRjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXG5cdFx0XHRmdW5jdGlvbiBzaG93U3RhcnRBUigvKmRldmljZSovKSB7XG5cdFx0XHRcdGlmIChzZXNzaW9uSW5pdC5kb21PdmVybGF5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdFx0XHRvdmVybGF5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJsYXkpO1xuXG5cdFx0XHRcdFx0Y29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuXHRcdFx0XHRcdFx0XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuXHRcdFx0XHRcdFx0XCJzdmdcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0c3ZnLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIDM4KTtcblx0XHRcdFx0XHRzdmcuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIDM4KTtcblx0XHRcdFx0XHRzdmcuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdFx0XHRcdFx0c3ZnLnN0eWxlLnJpZ2h0ID0gXCIyMHB4XCI7XG5cdFx0XHRcdFx0c3ZnLnN0eWxlLnRvcCA9IFwiMjBweFwiO1xuXHRcdFx0XHRcdHN2Zy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0Y3VycmVudFNlc3Npb24uZW5kKCk7XG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3ZlcmxheS5hcHBlbmRDaGlsZChzdmcpO1xuXG5cdFx0XHRcdFx0Y29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcblx0XHRcdFx0XHRcdFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcblx0XHRcdFx0XHRcdFwicGF0aFwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJNIDEyLDEyIEwgMjgsMjggTSAyOCwxMiAxMiwyOFwiKTtcblx0XHRcdFx0XHRwYXRoLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBcIiNmZmZcIik7XG5cdFx0XHRcdFx0cGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgMik7XG5cdFx0XHRcdFx0c3ZnLmFwcGVuZENoaWxkKHBhdGgpO1xuXG5cdFx0XHRcdFx0aWYgKHNlc3Npb25Jbml0Lm9wdGlvbmFsRmVhdHVyZXMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0c2Vzc2lvbkluaXQub3B0aW9uYWxGZWF0dXJlcyA9IFtdO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHNlc3Npb25Jbml0Lm9wdGlvbmFsRmVhdHVyZXMucHVzaChcImRvbS1vdmVybGF5XCIpO1xuXHRcdFx0XHRcdHNlc3Npb25Jbml0LmRvbU92ZXJsYXkgPSB7IHJvb3Q6IG92ZXJsYXkgfTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vXG5cblx0XHRcdFx0bGV0IGN1cnJlbnRTZXNzaW9uID0gbnVsbDtcblxuXHRcdFx0XHRhc3luYyBmdW5jdGlvbiBvblNlc3Npb25TdGFydGVkKHNlc3Npb24pIHtcblx0XHRcdFx0XHRzZXNzaW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJlbmRcIiwgb25TZXNzaW9uRW5kZWQpO1xuXG5cdFx0XHRcdFx0cmVuZGVyZXIueHIuc2V0UmVmZXJlbmNlU3BhY2VUeXBlKFwibG9jYWxcIik7XG5cblx0XHRcdFx0XHRhd2FpdCByZW5kZXJlci54ci5zZXRTZXNzaW9uKHNlc3Npb24pO1xuXG5cdFx0XHRcdFx0YnV0dG9uLnRleHRDb250ZW50ID0gXCJTVE9QIEFSXCI7XG5cdFx0XHRcdFx0c2Vzc2lvbkluaXQuZG9tT3ZlcmxheS5yb290LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXG5cdFx0XHRcdFx0Y3VycmVudFNlc3Npb24gPSBzZXNzaW9uO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gb25TZXNzaW9uRW5kZWQoLypldmVudCovKSB7XG5cdFx0XHRcdFx0Y3VycmVudFNlc3Npb24ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImVuZFwiLCBvblNlc3Npb25FbmRlZCk7XG5cblx0XHRcdFx0XHRidXR0b24udGV4dENvbnRlbnQgPSBcIlNUQVJUIEFSXCI7XG5cdFx0XHRcdFx0c2Vzc2lvbkluaXQuZG9tT3ZlcmxheS5yb290LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuXHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uID0gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblxuXHRcdFx0XHRidXR0b24uc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5sZWZ0ID0gXCJjYWxjKDUwJSAtIDUwcHgpXCI7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuXG5cdFx0XHRcdGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU1RBUlQgQVJcIjtcblxuXHRcdFx0XHRidXR0b24ub25tb3VzZWVudGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGJ1dHRvbi5zdHlsZS5vcGFjaXR5ID0gXCIxLjBcIjtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRidXR0b24ub25tb3VzZWxlYXZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGJ1dHRvbi5zdHlsZS5vcGFjaXR5ID0gXCIwLjhcIjtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAoY3VycmVudFNlc3Npb24gPT09IG51bGwpIHtcblx0XHRcdFx0XHRcdG5hdmlnYXRvci54clxuXHRcdFx0XHRcdFx0XHQucmVxdWVzdFNlc3Npb24oXCJpbW1lcnNpdmUtYXJcIiwgc2Vzc2lvbkluaXQpXG5cdFx0XHRcdFx0XHRcdC50aGVuKG9uU2Vzc2lvblN0YXJ0ZWQpO1xuXHRcdFx0XHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50U2Vzc2lvbi5lbmQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGRpc2FibGVCdXR0b24oKSB7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblxuXHRcdFx0XHRidXR0b24uc3R5bGUuY3Vyc29yID0gXCJhdXRvXCI7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5sZWZ0ID0gXCJjYWxjKDUwJSAtIDc1cHgpXCI7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS53aWR0aCA9IFwiMTUwcHhcIjtcblxuXHRcdFx0XHRidXR0b24ub25tb3VzZWVudGVyID0gbnVsbDtcblx0XHRcdFx0YnV0dG9uLm9ubW91c2VsZWF2ZSA9IG51bGw7XG5cblx0XHRcdFx0YnV0dG9uLm9uY2xpY2sgPSBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBzaG93QVJOb3RTdXBwb3J0ZWQoKSB7XG5cdFx0XHRcdGRpc2FibGVCdXR0b24oKTtcblxuXHRcdFx0XHRidXR0b24udGV4dENvbnRlbnQgPSBcIkFSIE5PVCBTVVBQT1JURURcIjtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gc2hvd0FSTm90QWxsb3dlZChleGNlcHRpb24pIHtcblx0XHRcdFx0ZGlzYWJsZUJ1dHRvbigpO1xuXG5cdFx0XHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFx0XHRcIkV4Y2VwdGlvbiB3aGVuIHRyeWluZyB0byBjYWxsIHhyLmlzU2Vzc2lvblN1cHBvcnRlZFwiLFxuXHRcdFx0XHRcdGV4Y2VwdGlvblxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiQVIgTk9UIEFMTE9XRURcIjtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gc3R5bGl6ZUVsZW1lbnQoZWxlbWVudCkge1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLnBhZGRpbmcgPSBcIjFlbSAwLjJlbVwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkICNmZmZcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjE1cHhcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjZDlhZjJiXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuY29sb3IgPSBcIiNmZmZcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5mb250ID0gXCJub3JtYWwgMy41ZW0gc2Fucy1zZXJpZlwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLm91dGxpbmUgPSBcIm5vbmVcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjk5OVwiO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoXCJ4clwiIGluIG5hdmlnYXRvcikge1xuXHRcdFx0XHRidXR0b24uaWQgPSBcIkFSQnV0dG9uXCI7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cblx0XHRcdFx0c3R5bGl6ZUVsZW1lbnQoYnV0dG9uKTtcblxuXHRcdFx0XHRuYXZpZ2F0b3IueHJcblx0XHRcdFx0XHQuaXNTZXNzaW9uU3VwcG9ydGVkKFwiaW1tZXJzaXZlLWFyXCIpXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHN1cHBvcnRlZCkge1xuXHRcdFx0XHRcdFx0c3VwcG9ydGVkID8gc2hvd1N0YXJ0QVIoKSA6IHNob3dBUk5vdFN1cHBvcnRlZCgpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKHNob3dBUk5vdEFsbG93ZWQpO1xuXG5cdFx0XHRcdHJldHVybiBidXR0b247XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cblx0XHRcdFx0aWYgKHdpbmRvdy5pc1NlY3VyZUNvbnRleHQgPT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0bWVzc2FnZS5ocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZi5yZXBsYWNlKFxuXHRcdFx0XHRcdFx0L15odHRwOi8sXG5cdFx0XHRcdFx0XHRcImh0dHBzOlwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRtZXNzYWdlLmlubmVySFRNTCA9IFwiV0VCWFIgTkVFRFMgSFRUUFNcIjsgLy8gVE9ETyBJbXByb3ZlIG1lc3NhZ2Vcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZXNzYWdlLmhyZWYgPSBcImh0dHBzOi8vaW1tZXJzaXZld2ViLmRldi9cIjtcblx0XHRcdFx0XHRtZXNzYWdlLmlubmVySFRNTCA9IFwiV0VCWFIgTk9UIEFWQUlMQUJMRVwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bWVzc2FnZS5zdHlsZS5sZWZ0ID0gXCJjYWxjKDUwJSAtIDkwcHgpXCI7XG5cdFx0XHRcdG1lc3NhZ2Uuc3R5bGUud2lkdGggPSBcIjE4MHB4XCI7XG5cdFx0XHRcdG1lc3NhZ2Uuc3R5bGUudGV4dERlY29yYXRpb24gPSBcIm5vbmVcIjtcblxuXHRcdFx0XHRzdHlsaXplRWxlbWVudChtZXNzYWdlKTtcblxuXHRcdFx0XHRyZXR1cm4gbWVzc2FnZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRjb25zdCBidXR0b24gPSBBUkJ1dHRvbi5jcmVhdGVCdXR0b24ocmVuZGVyZXIsIHtcblx0XHRyZXF1aXJlZEZlYXR1cmVzOiBbXCJoaXQtdGVzdFwiXSxcblx0fSk7XG5cblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1aS1jb250YWluZXJcIikuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblxuXHRyZXR1cm4geyBidXR0b24gfTtcbn07XG5cbmV4cG9ydCB7IGNyZWF0ZUFSQnRuIH07XG4iLCJjb25zdCBhbWJpZW50ID0gbmV3IFRldGF2aS5USFJFRS5BbWJpZW50TGlnaHQoMHg5OTk5OTkpO1xuXG5jb25zdCBzcG90TGlnaHQgPSBuZXcgVGV0YXZpLlRIUkVFLlNwb3RMaWdodCgweGZmZmZmZik7XG5zcG90TGlnaHQucG9zaXRpb24uc2V0KDAsIDUsIDApO1xuc3BvdExpZ2h0LmNhc3RTaGFkb3cgPSBmYWxzZTtcbnNwb3RMaWdodC5hbmdsZSA9IE1hdGguUEkgLyA0O1xuc3BvdExpZ2h0LnBlbnVtYnJhID0gMC4xO1xuc3BvdExpZ2h0LmRlY2F5ID0gMjtcbnNwb3RMaWdodC5kaXN0YW5jZSA9IDIwMDtcblxuZXhwb3J0IHsgYW1iaWVudCwgc3BvdExpZ2h0IH07XG4iLCJjb25zdCBwbGF5VmlkZW8gPSAoYnV0dG9uLCB0ZXRhdmksIHNjZW5lKSA9PiB7XG5cdGxldCBmaXJzdFBsYXkgPSB0cnVlO1xuXG5cdGNvbnN0IHBsYXlTdG9wID0gKCkgPT4ge1xuXHRcdGlmIChmaXJzdFBsYXkpIHtcblx0XHRcdGZpcnN0UGxheSA9IGZhbHNlO1xuXG5cdFx0XHRjb25zb2xlLmxvZyh0ZXRhdmkuZ2V0U3JjVmlkZW8oKSk7XG5cblx0XHRcdHRldGF2aS5nZXRTcmNWaWRlbygpLm11dGVkID0gdHJ1ZTtcblxuXHRcdFx0dGV0YXZpLnBsYXkoKTtcblxuXHRcdFx0Y29uc3QgcGl2b3QgPSBuZXcgVGV0YXZpLlRIUkVFLk9iamVjdDNEKCk7XG5cblx0XHRcdHBpdm90LmFkZCh0ZXRhdmkuZ2V0U2NlbmUoKSk7XG5cblx0XHRcdHBpdm90LnZpc2libGUgPSBmYWxzZTtcblxuXHRcdFx0c2NlbmUuYWRkKHBpdm90KTtcblx0XHR9XG5cdH07XG5cdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxheVN0b3ApO1xufTtcblxuZXhwb3J0IHsgcGxheVZpZGVvIH07XG4iLCJjb25zdCBjcmVhdGVSZW5kZXJlciA9IChjYW1lcmEpID0+IHtcblx0Y29uc3QgcmVuZGVyZXIgPSBuZXcgVGV0YXZpLlRIUkVFLldlYkdMUmVuZGVyZXIoe1xuXHRcdGFudGlhbGlhczogdHJ1ZSxcblx0XHRhbHBoYTogdHJ1ZSxcblx0fSk7XG5cdHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuXHRyZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXHRyZW5kZXJlci54ci5lbmFibGVkID0gdHJ1ZTtcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuXHRjb25zdCBjb250cm9scyA9IG5ldyBUZXRhdmlFeHQubGliT3JiaXRDb250cm9scyhcblx0XHRjYW1lcmEsXG5cdFx0cmVuZGVyZXIuZG9tRWxlbWVudFxuXHQpO1xuXHRjb250cm9scy50YXJnZXQuc2V0KDAsIDEuNSwgMCk7XG5cblx0Y2FtZXJhLnBvc2l0aW9uLnogPSA1O1xuXHRjYW1lcmEucG9zaXRpb24ueSA9IDEuNTtcblx0Y29udHJvbHMudXBkYXRlKCk7XG5cblx0ZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG5cdFx0Y2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuXHRcdGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cblx0XHRyZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXHR9XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUpO1xuXG5cdHJldHVybiB7IHJlbmRlcmVyIH07XG59O1xuXG5leHBvcnQgeyBjcmVhdGVSZW5kZXJlciB9O1xuIiwiY29uc3Qgc2NlbmUgPSBuZXcgVGV0YXZpLlRIUkVFLlNjZW5lKCk7XG5cbmNvbnN0IGNhbWVyYSA9IG5ldyBUZXRhdmkuVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoXG5cdDcwLFxuXHR3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcblx0MC4wMSxcblx0MjBcbik7XG5cbmV4cG9ydCB7IHNjZW5lLCBjYW1lcmEgfTtcbiIsImNvbnN0IGNyZWF0ZVRldGF2aSA9IChjYW1lcmEsIHJlbmRlcmVyKSA9PiB7XG5cdGNvbnN0IGxvYWRpbmdQYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nLXBhZ2VcIik7XG5cblx0ZnVuY3Rpb24gb25Mb2cobG9nKSB7XG5cdFx0Y29uc29sZS5sb2cobG9nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldEJhcih3aWR0aCwgd2lkdGhQbGF5KSB7XG5cdFx0aWYgKHRldGF2aSAhPSBudWxsKSB7XG5cdFx0XHRpZiAod2lkdGhQbGF5IC8gd2lkdGggPiAwLjAxICYmIHRldGF2aS5pc1JlYWR5KCkpIHtcblx0XHRcdFx0bG9hZGluZ1BhZ2UuY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgdGV0YXZpID0gVGV0YXZpLmNyZWF0ZShcblx0XHRyZW5kZXJlcixcblx0XHRjYW1lcmEsXG5cdFx0XCIuL3R2bW9kZWwvdGV4dHVyZXNWaWRlby5tcDRcIixcblx0XHRcIi4vdHZtb2RlbC9HZW9tZXRyeS5tYW5pZmVzdFwiXG5cdClcblx0XHQub25TZXRCYXIoc2V0QmFyKVxuXHRcdC5zZXRGYWRlQWxwaGEoZmFsc2UpXG5cdFx0Ly8uc2V0U2hhZG93QW5nbGUoMC40KVxuXHRcdC5vbkxvZyhvbkxvZyk7XG5cblx0dGV0YXZpLnNldFNoYWRvd1Zpc2libGUoZmFsc2UpO1xuXG5cdGZ1bmN0aW9uIHJlcXVpcmUoc3RyKSB7XG5cdFx0cmV0dXJuIFwiLi90dm1vZGVsL1wiICsgc3RyO1xuXHR9XG5cblx0cmV0dXJuIHsgdGV0YXZpIH07XG59O1xuXG5leHBvcnQgeyBjcmVhdGVUZXRhdmkgfTtcbiIsImNvbnN0IGNhbGxBbmltYXRpb24gPSAodGV0YXZpLCBzY2VuZSwgY2FtZXJhLCByZW5kZXJlcikgPT4ge1xuXHRsZXQgcGl2b3Q7XG5cdGxldCB2aWRlbztcblx0Y29uc3QgZ2VvbWV0cnkgPSBuZXcgVGV0YXZpLlRIUkVFLlJpbmdHZW9tZXRyeSgwLjA4LCAwLjEsIDMyKS5yb3RhdGVYKFxuXHRcdC1NYXRoLlBJIC8gMlxuXHQpO1xuXHRsZXQgbWF0ZXJpYWwgPSBuZXcgVGV0YXZpLlRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XG5cdGNvbnN0IHJldGljbGUgPSBuZXcgVGV0YXZpLlRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblx0cmV0aWNsZS5tYXRyaXhBdXRvVXBkYXRlID0gZmFsc2U7XG5cdHJldGljbGUudmlzaWJsZSA9IHRydWU7XG5cdHNjZW5lLmFkZChyZXRpY2xlKTtcblxuXHRsZXQgaGl0VGVzdFNvdXJjZSA9IG51bGw7XG5cdGxldCBoaXRUZXN0U291cmNlUmVxdWVzdGVkID0gZmFsc2U7XG5cblx0Y29uc3QgY29udHJvbGxlciA9IHJlbmRlcmVyLnhyLmdldENvbnRyb2xsZXIoMCk7XG5cblx0YXN5bmMgZnVuY3Rpb24gcmVxdWVzdEhpdFRlc3RTb3VyY2UoKSB7XG5cdFx0Y29uc3Qgc2Vzc2lvbiA9IHJlbmRlcmVyLnhyLmdldFNlc3Npb24oKTtcblx0XHRzZXNzaW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJlbmRcIiwgKCkgPT4ge1xuXHRcdFx0aGl0VGVzdFNvdXJjZVJlcXVlc3RlZCA9IGZhbHNlO1xuXHRcdFx0aGl0VGVzdFNvdXJjZSA9IG51bGw7XG5cdFx0fSk7XG5cdFx0Y29uc3QgcmVmZXJlbmNlU3BhY2UgPSBhd2FpdCBzZXNzaW9uLnJlcXVlc3RSZWZlcmVuY2VTcGFjZShcInZpZXdlclwiKTtcblx0XHRoaXRUZXN0U291cmNlID0gYXdhaXQgc2Vzc2lvbi5yZXF1ZXN0SGl0VGVzdFNvdXJjZSh7XG5cdFx0XHRzcGFjZTogcmVmZXJlbmNlU3BhY2UsXG5cdFx0fSk7XG5cdFx0aGl0VGVzdFNvdXJjZVJlcXVlc3RlZCA9IHRydWU7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRIaXRUZXN0UmVzdWx0cyhmcmFtZSkge1xuXHRcdGNvbnN0IGhpdFRlc3RSZXN1bHRzID0gZnJhbWUuZ2V0SGl0VGVzdFJlc3VsdHMoaGl0VGVzdFNvdXJjZSk7XG5cdFx0aWYgKGhpdFRlc3RSZXN1bHRzLmxlbmd0aCkge1xuXHRcdFx0Y29uc3QgaGl0ID0gaGl0VGVzdFJlc3VsdHNbMF07XG5cdFx0XHRjb25zdCBwb3NlID0gaGl0LmdldFBvc2UocmVuZGVyZXIueHIuZ2V0UmVmZXJlbmNlU3BhY2UoKSk7XG5cdFx0XHRyZXRpY2xlLnZpc2libGUgPSB0cnVlO1xuXHRcdFx0cmV0aWNsZS5tYXRyaXguZnJvbUFycmF5KHBvc2UudHJhbnNmb3JtLm1hdHJpeCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldGljbGUudmlzaWJsZSA9IGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIG9uU2VsZWN0KCkge1xuXHRcdGlmIChyZXRpY2xlLnZpc2libGUpIHtcblx0XHRcdHZpZGVvID0gdGV0YXZpLmdldFNyY1ZpZGVvKCk7XG5cdFx0XHR2aWRlby5tdXRlZCA9IGZhbHNlO1xuXHRcdFx0dmlkZW8ucGF1c2UoKTtcblx0XHRcdHZpZGVvLmN1cnJlbnRUaW1lID0gMDtcblx0XHRcdHZpZGVvLnBsYXkoKTtcblx0XHRcdHBpdm90LnBvc2l0aW9uLnNldEZyb21NYXRyaXhQb3NpdGlvbihyZXRpY2xlLm1hdHJpeCk7XG5cdFx0XHRwaXZvdC5wb3NpdGlvbi55IC09IDAuMztcblx0XHRcdHBpdm90LnZpc2libGUgPSB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcihcInNlbGVjdFwiLCBvblNlbGVjdCk7XG5cblx0ZnVuY3Rpb24gdGhyZWVfYW5pbWF0ZShfLCBmcmFtZSkge1xuXHRcdGlmICh0ZXRhdmkgIT0gbnVsbCkge1xuXHRcdFx0dGV0YXZpLmFuaW1hdGUoKTtcblx0XHRcdGlmICghcGl2b3QgJiYgc2NlbmUuY2hpbGRyZW5bM10pIHtcblx0XHRcdFx0cGl2b3QgPSBzY2VuZS5jaGlsZHJlblszXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZnJhbWUpIHtcblx0XHRcdGlmIChoaXRUZXN0U291cmNlUmVxdWVzdGVkID09PSBmYWxzZSkge1xuXHRcdFx0XHRyZXF1ZXN0SGl0VGVzdFNvdXJjZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGhpdFRlc3RTb3VyY2UpIHtcblx0XHRcdFx0Z2V0SGl0VGVzdFJlc3VsdHMoZnJhbWUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcblx0fVxuXG5cdHJlbmRlcmVyLnNldEFuaW1hdGlvbkxvb3AodGhyZWVfYW5pbWF0ZSk7XG59O1xuXG5leHBvcnQgeyBjYWxsQW5pbWF0aW9uIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGNyZWF0ZUFSQnRuIH0gZnJvbSBcIi4vanMvYXItYnV0dG9uXCI7XG5pbXBvcnQgeyBhbWJpZW50LCBzcG90TGlnaHQgfSBmcm9tIFwiLi9qcy9saWdodHNcIjtcbmltcG9ydCB7IHBsYXlWaWRlbyB9IGZyb20gXCIuL2pzL3BsYXktc3RvcFwiO1xuaW1wb3J0IHsgY3JlYXRlUmVuZGVyZXIgfSBmcm9tIFwiLi9qcy9yZW5kZXJlclwiO1xuaW1wb3J0IHsgc2NlbmUsIGNhbWVyYSB9IGZyb20gXCIuL2pzL3NjZW5lLWNhbWVyYVwiO1xuaW1wb3J0IHsgY3JlYXRlVGV0YXZpIH0gZnJvbSBcIi4vanMvdGV0YXZpLXNldHVwXCI7XG5pbXBvcnQgeyBjYWxsQW5pbWF0aW9uIH0gZnJvbSBcIi4vanMvdGhyZWUtYW5pbWF0ZVwiO1xuXG5zY2VuZS5hZGQoYW1iaWVudCk7XG5zY2VuZS5hZGQoc3BvdExpZ2h0KTtcblxuY29uc3QgcmVuZGVyZXIgPSBjcmVhdGVSZW5kZXJlcihjYW1lcmEpLnJlbmRlcmVyO1xuXG5jb25zdCB0ZXRhdmkgPSBjcmVhdGVUZXRhdmkoY2FtZXJhLCByZW5kZXJlcikudGV0YXZpO1xuXG5jb25zdCBlbnRlckJ0biA9IGNyZWF0ZUFSQnRuKHJlbmRlcmVyKS5idXR0b247XG5cbnBsYXlWaWRlbyhlbnRlckJ0biwgdGV0YXZpLCBzY2VuZSk7XG5cbmNhbGxBbmltYXRpb24odGV0YXZpLCBzY2VuZSwgY2FtZXJhLCByZW5kZXJlcik7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=