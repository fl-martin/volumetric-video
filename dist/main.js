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

			tetavi.getSrcVideo().muted = true;

			tetavi.play();

			const pivot = new Tetavi.THREE.Object3D();

			pivot.add(tetavi.getScene());

			pivot.visible = false;

			scene.add(pivot.getScene());

			console.log(tetavi);
			console.log(tetavi.getScene());
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
		//.setShadowAngle(1)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUV5Qjs7Ozs7OztVQ2hGekI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ042QztBQUNJO0FBQ047QUFDSTtBQUNHO0FBQ0Q7QUFDRTs7QUFFbkQsdURBQVMsQ0FBQywrQ0FBTztBQUNqQix1REFBUyxDQUFDLGlEQUFTOztBQUVuQixpQkFBaUIsNERBQWMsQ0FBQyxvREFBTTs7QUFFdEMsZUFBZSw4REFBWSxDQUFDLG9EQUFNOztBQUVsQyxpQkFBaUIsMERBQVc7O0FBRTVCLHdEQUFTLG1CQUFtQixtREFBSzs7QUFFakMsZ0VBQWEsU0FBUyxtREFBSyxFQUFFLG9EQUFNIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL2FyLWJ1dHRvbi5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvbGlnaHRzLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy9wbGF5LXN0b3AuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL3JlbmRlcmVyLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy9zY2VuZS1jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL3RldGF2aS1zZXR1cC5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvdGhyZWUtYW5pbWF0ZS5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY3JlYXRlQVJCdG4gPSAocmVuZGVyZXIpID0+IHtcblx0Y2xhc3MgQVJCdXR0b24ge1xuXHRcdHN0YXRpYyBjcmVhdGVCdXR0b24ocmVuZGVyZXIsIHNlc3Npb25Jbml0ID0ge30pIHtcblx0XHRcdGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG5cblx0XHRcdGZ1bmN0aW9uIHNob3dTdGFydEFSKC8qZGV2aWNlKi8pIHtcblx0XHRcdFx0aWYgKHNlc3Npb25Jbml0LmRvbU92ZXJsYXkgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0XHRcdG92ZXJsYXkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXHRcdFx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3ZlcmxheSk7XG5cblx0XHRcdFx0XHRjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG5cdFx0XHRcdFx0XHRcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG5cdFx0XHRcdFx0XHRcInN2Z1wiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRzdmcuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgMzgpO1xuXHRcdFx0XHRcdHN2Zy5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgMzgpO1xuXHRcdFx0XHRcdHN2Zy5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0XHRcdFx0XHRzdmcuc3R5bGUucmlnaHQgPSBcIjIwcHhcIjtcblx0XHRcdFx0XHRzdmcuc3R5bGUudG9wID0gXCIyMHB4XCI7XG5cdFx0XHRcdFx0c3ZnLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50U2Vzc2lvbi5lbmQoKTtcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRvdmVybGF5LmFwcGVuZENoaWxkKHN2Zyk7XG5cblx0XHRcdFx0XHRjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuXHRcdFx0XHRcdFx0XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuXHRcdFx0XHRcdFx0XCJwYXRoXCJcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIk0gMTIsMTIgTCAyOCwyOCBNIDI4LDEyIDEyLDI4XCIpO1xuXHRcdFx0XHRcdHBhdGguc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIFwiI2ZmZlwiKTtcblx0XHRcdFx0XHRwYXRoLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCAyKTtcblx0XHRcdFx0XHRzdmcuYXBwZW5kQ2hpbGQocGF0aCk7XG5cblx0XHRcdFx0XHRpZiAoc2Vzc2lvbkluaXQub3B0aW9uYWxGZWF0dXJlcyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRzZXNzaW9uSW5pdC5vcHRpb25hbEZlYXR1cmVzID0gW107XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0c2Vzc2lvbkluaXQub3B0aW9uYWxGZWF0dXJlcy5wdXNoKFwiZG9tLW92ZXJsYXlcIik7XG5cdFx0XHRcdFx0c2Vzc2lvbkluaXQuZG9tT3ZlcmxheSA9IHsgcm9vdDogb3ZlcmxheSB9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9cblxuXHRcdFx0XHRsZXQgY3VycmVudFNlc3Npb24gPSBudWxsO1xuXG5cdFx0XHRcdGFzeW5jIGZ1bmN0aW9uIG9uU2Vzc2lvblN0YXJ0ZWQoc2Vzc2lvbikge1xuXHRcdFx0XHRcdHNlc3Npb24uYWRkRXZlbnRMaXN0ZW5lcihcImVuZFwiLCBvblNlc3Npb25FbmRlZCk7XG5cblx0XHRcdFx0XHRyZW5kZXJlci54ci5zZXRSZWZlcmVuY2VTcGFjZVR5cGUoXCJsb2NhbFwiKTtcblxuXHRcdFx0XHRcdGF3YWl0IHJlbmRlcmVyLnhyLnNldFNlc3Npb24oc2Vzc2lvbik7XG5cblx0XHRcdFx0XHRidXR0b24udGV4dENvbnRlbnQgPSBcIlNUT1AgQVJcIjtcblx0XHRcdFx0XHRzZXNzaW9uSW5pdC5kb21PdmVybGF5LnJvb3Quc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cblx0XHRcdFx0XHRjdXJyZW50U2Vzc2lvbiA9IHNlc3Npb247XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRmdW5jdGlvbiBvblNlc3Npb25FbmRlZCgvKmV2ZW50Ki8pIHtcblx0XHRcdFx0XHRjdXJyZW50U2Vzc2lvbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiZW5kXCIsIG9uU2Vzc2lvbkVuZGVkKTtcblxuXHRcdFx0XHRcdGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU1RBUlQgQVJcIjtcblx0XHRcdFx0XHRzZXNzaW9uSW5pdC5kb21PdmVybGF5LnJvb3Quc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG5cdFx0XHRcdFx0Y3VycmVudFNlc3Npb24gPSBudWxsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcblx0XHRcdFx0YnV0dG9uLnN0eWxlLmxlZnQgPSBcImNhbGMoNTAlIC0gNTBweClcIjtcblx0XHRcdFx0YnV0dG9uLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG5cblx0XHRcdFx0YnV0dG9uLnRleHRDb250ZW50ID0gXCJTVEFSVCBBUlwiO1xuXG5cdFx0XHRcdGJ1dHRvbi5vbm1vdXNlZW50ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0YnV0dG9uLnN0eWxlLm9wYWNpdHkgPSBcIjEuMFwiO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGJ1dHRvbi5vbm1vdXNlbGVhdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0YnV0dG9uLnN0eWxlLm9wYWNpdHkgPSBcIjAuOFwiO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmIChjdXJyZW50U2Vzc2lvbiA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0bmF2aWdhdG9yLnhyXG5cdFx0XHRcdFx0XHRcdC5yZXF1ZXN0U2Vzc2lvbihcImltbWVyc2l2ZS1hclwiLCBzZXNzaW9uSW5pdClcblx0XHRcdFx0XHRcdFx0LnRoZW4ob25TZXNzaW9uU3RhcnRlZCk7XG5cdFx0XHRcdFx0XHRidXR0b24uY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uLmVuZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gZGlzYWJsZUJ1dHRvbigpIHtcblx0XHRcdFx0YnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5jdXJzb3IgPSBcImF1dG9cIjtcblx0XHRcdFx0YnV0dG9uLnN0eWxlLmxlZnQgPSBcImNhbGMoNTAlIC0gNzVweClcIjtcblx0XHRcdFx0YnV0dG9uLnN0eWxlLndpZHRoID0gXCIxNTBweFwiO1xuXG5cdFx0XHRcdGJ1dHRvbi5vbm1vdXNlZW50ZXIgPSBudWxsO1xuXHRcdFx0XHRidXR0b24ub25tb3VzZWxlYXZlID0gbnVsbDtcblxuXHRcdFx0XHRidXR0b24ub25jbGljayA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHNob3dBUk5vdFN1cHBvcnRlZCgpIHtcblx0XHRcdFx0ZGlzYWJsZUJ1dHRvbigpO1xuXG5cdFx0XHRcdGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiQVIgTk9UIFNVUFBPUlRFRFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBzaG93QVJOb3RBbGxvd2VkKGV4Y2VwdGlvbikge1xuXHRcdFx0XHRkaXNhYmxlQnV0dG9uKCk7XG5cblx0XHRcdFx0Y29uc29sZS53YXJuKFxuXHRcdFx0XHRcdFwiRXhjZXB0aW9uIHdoZW4gdHJ5aW5nIHRvIGNhbGwgeHIuaXNTZXNzaW9uU3VwcG9ydGVkXCIsXG5cdFx0XHRcdFx0ZXhjZXB0aW9uXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0YnV0dG9uLnRleHRDb250ZW50ID0gXCJBUiBOT1QgQUxMT1dFRFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBzdHlsaXplRWxlbWVudChlbGVtZW50KSB7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUucGFkZGluZyA9IFwiMWVtIDAuMmVtXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuYm9yZGVyID0gXCIxcHggc29saWQgI2ZmZlwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiMTVweFwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSBcIiNkOWFmMmJcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5jb2xvciA9IFwiI2ZmZlwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmZvbnQgPSBcIm5vcm1hbCAzLjVlbSBzYW5zLXNlcmlmXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gXCIxXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUub3V0bGluZSA9IFwibm9uZVwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiOTk5XCI7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChcInhyXCIgaW4gbmF2aWdhdG9yKSB7XG5cdFx0XHRcdGJ1dHRvbi5pZCA9IFwiQVJCdXR0b25cIjtcblx0XHRcdFx0YnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuXHRcdFx0XHRzdHlsaXplRWxlbWVudChidXR0b24pO1xuXG5cdFx0XHRcdG5hdmlnYXRvci54clxuXHRcdFx0XHRcdC5pc1Nlc3Npb25TdXBwb3J0ZWQoXCJpbW1lcnNpdmUtYXJcIilcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAoc3VwcG9ydGVkKSB7XG5cdFx0XHRcdFx0XHRzdXBwb3J0ZWQgPyBzaG93U3RhcnRBUigpIDogc2hvd0FSTm90U3VwcG9ydGVkKCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuY2F0Y2goc2hvd0FSTm90QWxsb3dlZCk7XG5cblx0XHRcdFx0cmV0dXJuIGJ1dHRvbjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblxuXHRcdFx0XHRpZiAod2luZG93LmlzU2VjdXJlQ29udGV4dCA9PT0gZmFsc2UpIHtcblx0XHRcdFx0XHRtZXNzYWdlLmhyZWYgPSBkb2N1bWVudC5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoXG5cdFx0XHRcdFx0XHQvXmh0dHA6Lyxcblx0XHRcdFx0XHRcdFwiaHR0cHM6XCJcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdG1lc3NhZ2UuaW5uZXJIVE1MID0gXCJXRUJYUiBORUVEUyBIVFRQU1wiOyAvLyBUT0RPIEltcHJvdmUgbWVzc2FnZVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1lc3NhZ2UuaHJlZiA9IFwiaHR0cHM6Ly9pbW1lcnNpdmV3ZWIuZGV2L1wiO1xuXHRcdFx0XHRcdG1lc3NhZ2UuaW5uZXJIVE1MID0gXCJXRUJYUiBOT1QgQVZBSUxBQkxFXCI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRtZXNzYWdlLnN0eWxlLmxlZnQgPSBcImNhbGMoNTAlIC0gOTBweClcIjtcblx0XHRcdFx0bWVzc2FnZS5zdHlsZS53aWR0aCA9IFwiMTgwcHhcIjtcblx0XHRcdFx0bWVzc2FnZS5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9IFwibm9uZVwiO1xuXG5cdFx0XHRcdHN0eWxpemVFbGVtZW50KG1lc3NhZ2UpO1xuXG5cdFx0XHRcdHJldHVybiBtZXNzYWdlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGNvbnN0IGJ1dHRvbiA9IEFSQnV0dG9uLmNyZWF0ZUJ1dHRvbihyZW5kZXJlciwge1xuXHRcdHJlcXVpcmVkRmVhdHVyZXM6IFtcImhpdC10ZXN0XCJdLFxuXHR9KTtcblxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVpLWNvbnRhaW5lclwiKS5hcHBlbmRDaGlsZChidXR0b24pO1xuXG5cdHJldHVybiB7IGJ1dHRvbiB9O1xufTtcblxuZXhwb3J0IHsgY3JlYXRlQVJCdG4gfTtcbiIsImNvbnN0IGFtYmllbnQgPSBuZXcgVGV0YXZpLlRIUkVFLkFtYmllbnRMaWdodCgweDk5OTk5OSk7XG5cbmNvbnN0IHNwb3RMaWdodCA9IG5ldyBUZXRhdmkuVEhSRUUuU3BvdExpZ2h0KDB4ZmZmZmZmKTtcbnNwb3RMaWdodC5wb3NpdGlvbi5zZXQoMCwgNSwgMCk7XG5zcG90TGlnaHQuY2FzdFNoYWRvdyA9IGZhbHNlO1xuc3BvdExpZ2h0LmFuZ2xlID0gTWF0aC5QSSAvIDQ7XG5zcG90TGlnaHQucGVudW1icmEgPSAwLjE7XG5zcG90TGlnaHQuZGVjYXkgPSAyO1xuc3BvdExpZ2h0LmRpc3RhbmNlID0gMjAwO1xuXG5leHBvcnQgeyBhbWJpZW50LCBzcG90TGlnaHQgfTtcbiIsImNvbnN0IHBsYXlWaWRlbyA9IChidXR0b24sIHRldGF2aSwgc2NlbmUpID0+IHtcblx0bGV0IGZpcnN0UGxheSA9IHRydWU7XG5cblx0Y29uc3QgcGxheVN0b3AgPSAoKSA9PiB7XG5cdFx0aWYgKGZpcnN0UGxheSkge1xuXHRcdFx0Zmlyc3RQbGF5ID0gZmFsc2U7XG5cblx0XHRcdHRldGF2aS5nZXRTcmNWaWRlbygpLm11dGVkID0gdHJ1ZTtcblxuXHRcdFx0dGV0YXZpLnBsYXkoKTtcblxuXHRcdFx0Y29uc3QgcGl2b3QgPSBuZXcgVGV0YXZpLlRIUkVFLk9iamVjdDNEKCk7XG5cblx0XHRcdHBpdm90LmFkZCh0ZXRhdmkuZ2V0U2NlbmUoKSk7XG5cblx0XHRcdHBpdm90LnZpc2libGUgPSBmYWxzZTtcblxuXHRcdFx0c2NlbmUuYWRkKHBpdm90LmdldFNjZW5lKCkpO1xuXG5cdFx0XHRjb25zb2xlLmxvZyh0ZXRhdmkpO1xuXHRcdFx0Y29uc29sZS5sb2codGV0YXZpLmdldFNjZW5lKCkpO1xuXHRcdH1cblx0fTtcblx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwbGF5U3RvcCk7XG59O1xuXG5leHBvcnQgeyBwbGF5VmlkZW8gfTtcbiIsImNvbnN0IGNyZWF0ZVJlbmRlcmVyID0gKGNhbWVyYSkgPT4ge1xuXHRjb25zdCByZW5kZXJlciA9IG5ldyBUZXRhdmkuVEhSRUUuV2ViR0xSZW5kZXJlcih7XG5cdFx0YW50aWFsaWFzOiB0cnVlLFxuXHRcdGFscGhhOiB0cnVlLFxuXHR9KTtcblx0cmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG5cdHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cdHJlbmRlcmVyLnhyLmVuYWJsZWQgPSB0cnVlO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG5cdGNvbnN0IGNvbnRyb2xzID0gbmV3IFRldGF2aUV4dC5saWJPcmJpdENvbnRyb2xzKFxuXHRcdGNhbWVyYSxcblx0XHRyZW5kZXJlci5kb21FbGVtZW50XG5cdCk7XG5cdGNvbnRyb2xzLnRhcmdldC5zZXQoMCwgMS41LCAwKTtcblxuXHRjYW1lcmEucG9zaXRpb24ueiA9IDU7XG5cdGNhbWVyYS5wb3NpdGlvbi55ID0gMS41O1xuXHRjb250cm9scy51cGRhdGUoKTtcblxuXHRmdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcblx0XHRjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdFx0Y2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuXHRcdHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cdH1cblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSk7XG5cblx0cmV0dXJuIHsgcmVuZGVyZXIgfTtcbn07XG5cbmV4cG9ydCB7IGNyZWF0ZVJlbmRlcmVyIH07XG4iLCJjb25zdCBzY2VuZSA9IG5ldyBUZXRhdmkuVEhSRUUuU2NlbmUoKTtcblxuY29uc3QgY2FtZXJhID0gbmV3IFRldGF2aS5USFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShcblx0NzAsXG5cdHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LFxuXHQwLjAxLFxuXHQyMFxuKTtcblxuZXhwb3J0IHsgc2NlbmUsIGNhbWVyYSB9O1xuIiwiY29uc3QgY3JlYXRlVGV0YXZpID0gKGNhbWVyYSwgcmVuZGVyZXIpID0+IHtcblx0Y29uc3QgbG9hZGluZ1BhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRpbmctcGFnZVwiKTtcblxuXHRmdW5jdGlvbiBvbkxvZyhsb2cpIHtcblx0XHRjb25zb2xlLmxvZyhsb2cpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0QmFyKHdpZHRoLCB3aWR0aFBsYXkpIHtcblx0XHRpZiAodGV0YXZpICE9IG51bGwpIHtcblx0XHRcdGlmICh3aWR0aFBsYXkgLyB3aWR0aCA+IDAuMDEgJiYgdGV0YXZpLmlzUmVhZHkoKSkge1xuXHRcdFx0XHRsb2FkaW5nUGFnZS5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRjb25zdCB0ZXRhdmkgPSBUZXRhdmkuY3JlYXRlKFxuXHRcdHJlbmRlcmVyLFxuXHRcdGNhbWVyYSxcblx0XHRcIi4vdHZtb2RlbC90ZXh0dXJlc1ZpZGVvLm1wNFwiLFxuXHRcdFwiLi90dm1vZGVsL0dlb21ldHJ5Lm1hbmlmZXN0XCJcblx0KVxuXHRcdC5vblNldEJhcihzZXRCYXIpXG5cdFx0LnNldEZhZGVBbHBoYShmYWxzZSlcblx0XHQvLy5zZXRTaGFkb3dBbmdsZSgxKVxuXHRcdC5vbkxvZyhvbkxvZyk7XG5cblx0dGV0YXZpLnNldFNoYWRvd1Zpc2libGUoZmFsc2UpO1xuXG5cdGZ1bmN0aW9uIHJlcXVpcmUoc3RyKSB7XG5cdFx0cmV0dXJuIFwiLi90dm1vZGVsL1wiICsgc3RyO1xuXHR9XG5cblx0cmV0dXJuIHsgdGV0YXZpIH07XG59O1xuXG5leHBvcnQgeyBjcmVhdGVUZXRhdmkgfTtcbiIsImNvbnN0IGNhbGxBbmltYXRpb24gPSAodGV0YXZpLCBzY2VuZSwgY2FtZXJhLCByZW5kZXJlcikgPT4ge1xuXHRsZXQgcGl2b3Q7XG5cdGxldCB2aWRlbztcblx0Y29uc3QgZ2VvbWV0cnkgPSBuZXcgVGV0YXZpLlRIUkVFLlJpbmdHZW9tZXRyeSgwLjA4LCAwLjEsIDMyKS5yb3RhdGVYKFxuXHRcdC1NYXRoLlBJIC8gMlxuXHQpO1xuXHRsZXQgbWF0ZXJpYWwgPSBuZXcgVGV0YXZpLlRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XG5cdGNvbnN0IHJldGljbGUgPSBuZXcgVGV0YXZpLlRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblx0cmV0aWNsZS5tYXRyaXhBdXRvVXBkYXRlID0gZmFsc2U7XG5cdHJldGljbGUudmlzaWJsZSA9IHRydWU7XG5cdHNjZW5lLmFkZChyZXRpY2xlKTtcblxuXHRsZXQgaGl0VGVzdFNvdXJjZSA9IG51bGw7XG5cdGxldCBoaXRUZXN0U291cmNlUmVxdWVzdGVkID0gZmFsc2U7XG5cblx0Y29uc3QgY29udHJvbGxlciA9IHJlbmRlcmVyLnhyLmdldENvbnRyb2xsZXIoMCk7XG5cblx0YXN5bmMgZnVuY3Rpb24gcmVxdWVzdEhpdFRlc3RTb3VyY2UoKSB7XG5cdFx0Y29uc3Qgc2Vzc2lvbiA9IHJlbmRlcmVyLnhyLmdldFNlc3Npb24oKTtcblx0XHRzZXNzaW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJlbmRcIiwgKCkgPT4ge1xuXHRcdFx0aGl0VGVzdFNvdXJjZVJlcXVlc3RlZCA9IGZhbHNlO1xuXHRcdFx0aGl0VGVzdFNvdXJjZSA9IG51bGw7XG5cdFx0fSk7XG5cdFx0Y29uc3QgcmVmZXJlbmNlU3BhY2UgPSBhd2FpdCBzZXNzaW9uLnJlcXVlc3RSZWZlcmVuY2VTcGFjZShcInZpZXdlclwiKTtcblx0XHRoaXRUZXN0U291cmNlID0gYXdhaXQgc2Vzc2lvbi5yZXF1ZXN0SGl0VGVzdFNvdXJjZSh7XG5cdFx0XHRzcGFjZTogcmVmZXJlbmNlU3BhY2UsXG5cdFx0fSk7XG5cdFx0aGl0VGVzdFNvdXJjZVJlcXVlc3RlZCA9IHRydWU7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRIaXRUZXN0UmVzdWx0cyhmcmFtZSkge1xuXHRcdGNvbnN0IGhpdFRlc3RSZXN1bHRzID0gZnJhbWUuZ2V0SGl0VGVzdFJlc3VsdHMoaGl0VGVzdFNvdXJjZSk7XG5cdFx0aWYgKGhpdFRlc3RSZXN1bHRzLmxlbmd0aCkge1xuXHRcdFx0Y29uc3QgaGl0ID0gaGl0VGVzdFJlc3VsdHNbMF07XG5cdFx0XHRjb25zdCBwb3NlID0gaGl0LmdldFBvc2UocmVuZGVyZXIueHIuZ2V0UmVmZXJlbmNlU3BhY2UoKSk7XG5cdFx0XHRyZXRpY2xlLnZpc2libGUgPSB0cnVlO1xuXHRcdFx0cmV0aWNsZS5tYXRyaXguZnJvbUFycmF5KHBvc2UudHJhbnNmb3JtLm1hdHJpeCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldGljbGUudmlzaWJsZSA9IGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIG9uU2VsZWN0KCkge1xuXHRcdGlmIChyZXRpY2xlLnZpc2libGUpIHtcblx0XHRcdHZpZGVvID0gdGV0YXZpLmdldFNyY1ZpZGVvKCk7XG5cdFx0XHR2aWRlby5tdXRlZCA9IGZhbHNlO1xuXHRcdFx0dmlkZW8ucGF1c2UoKTtcblx0XHRcdHZpZGVvLmN1cnJlbnRUaW1lID0gMDtcblx0XHRcdHZpZGVvLnBsYXkoKTtcblx0XHRcdHBpdm90LnBvc2l0aW9uLnNldEZyb21NYXRyaXhQb3NpdGlvbihyZXRpY2xlLm1hdHJpeCk7XG5cdFx0XHRwaXZvdC5wb3NpdGlvbi55IC09IDAuMztcblx0XHRcdHBpdm90LnZpc2libGUgPSB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcihcInNlbGVjdFwiLCBvblNlbGVjdCk7XG5cblx0ZnVuY3Rpb24gdGhyZWVfYW5pbWF0ZShfLCBmcmFtZSkge1xuXHRcdGlmICh0ZXRhdmkgIT0gbnVsbCkge1xuXHRcdFx0dGV0YXZpLmFuaW1hdGUoKTtcblx0XHRcdGlmICghcGl2b3QgJiYgc2NlbmUuY2hpbGRyZW5bM10pIHtcblx0XHRcdFx0cGl2b3QgPSBzY2VuZS5jaGlsZHJlblszXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZnJhbWUpIHtcblx0XHRcdGlmIChoaXRUZXN0U291cmNlUmVxdWVzdGVkID09PSBmYWxzZSkge1xuXHRcdFx0XHRyZXF1ZXN0SGl0VGVzdFNvdXJjZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGhpdFRlc3RTb3VyY2UpIHtcblx0XHRcdFx0Z2V0SGl0VGVzdFJlc3VsdHMoZnJhbWUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcblx0fVxuXG5cdHJlbmRlcmVyLnNldEFuaW1hdGlvbkxvb3AodGhyZWVfYW5pbWF0ZSk7XG59O1xuXG5leHBvcnQgeyBjYWxsQW5pbWF0aW9uIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGNyZWF0ZUFSQnRuIH0gZnJvbSBcIi4vanMvYXItYnV0dG9uXCI7XG5pbXBvcnQgeyBhbWJpZW50LCBzcG90TGlnaHQgfSBmcm9tIFwiLi9qcy9saWdodHNcIjtcbmltcG9ydCB7IHBsYXlWaWRlbyB9IGZyb20gXCIuL2pzL3BsYXktc3RvcFwiO1xuaW1wb3J0IHsgY3JlYXRlUmVuZGVyZXIgfSBmcm9tIFwiLi9qcy9yZW5kZXJlclwiO1xuaW1wb3J0IHsgc2NlbmUsIGNhbWVyYSB9IGZyb20gXCIuL2pzL3NjZW5lLWNhbWVyYVwiO1xuaW1wb3J0IHsgY3JlYXRlVGV0YXZpIH0gZnJvbSBcIi4vanMvdGV0YXZpLXNldHVwXCI7XG5pbXBvcnQgeyBjYWxsQW5pbWF0aW9uIH0gZnJvbSBcIi4vanMvdGhyZWUtYW5pbWF0ZVwiO1xuXG5zY2VuZS5hZGQoYW1iaWVudCk7XG5zY2VuZS5hZGQoc3BvdExpZ2h0KTtcblxuY29uc3QgcmVuZGVyZXIgPSBjcmVhdGVSZW5kZXJlcihjYW1lcmEpLnJlbmRlcmVyO1xuXG5jb25zdCB0ZXRhdmkgPSBjcmVhdGVUZXRhdmkoY2FtZXJhLCByZW5kZXJlcikudGV0YXZpO1xuXG5jb25zdCBlbnRlckJ0biA9IGNyZWF0ZUFSQnRuKHJlbmRlcmVyKS5idXR0b247XG5cbnBsYXlWaWRlbyhlbnRlckJ0biwgdGV0YXZpLCBzY2VuZSk7XG5cbmNhbGxBbmltYXRpb24odGV0YXZpLCBzY2VuZSwgY2FtZXJhLCByZW5kZXJlcik7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=