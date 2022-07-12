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
	const positionBtnContainer = document.createElement("div");
	positionBtnContainer.classList.add(
		"fixed-bottom-right",
		"txt-right",
		"margin-1",
		"margin-right-2",
		"hidden"
	);
	positionBtnContainer.id = "change-position-container";

	const positionBtn = document.createElement("button");
	positionBtn.classList.add("menu-btn");
	positionBtn.id = "change-position";
	positionBtn.innerText = "POSICION";
	positionBtnContainer.appendChild(positionBtn);

	const rotationBtnsContainer = document.createElement("div");
	rotationBtnsContainer.classList.add("fixed-bottom-left", "margin-1", "hidden");

	const rotationBtnsText = document.createElement("p")
	rotationBtnsText.classList.add("txt-center-white")
	rotationBtnsText.innerText = "ROTAR MODELO"
	rotationBtnsContainer.appendChild(rotationBtnsText)

	const rotationLeft = document.createElement("button");
	const rotationRight = document.createElement("button");
	rotationLeft.type = "button"
	rotationLeft.id = "left"
	rotationRight.type = "button"
	rotationRight.id = "right"
	rotationLeft.innerText = "↻";
	rotationRight.innerText = "↺";

	rotationBtnsContainer.appendChild(rotationLeft);
	rotationBtnsContainer.appendChild(rotationRight);
	rotationLeft.classList.add("menu-btn", "margin-left-05");
	rotationRight.classList.add("menu-btn", "margin-right-05");

	class ARButton {
		static createButton(renderer, sessionInit = {}) {
			const button = document.createElement("button");
			const buttonContainer = document.getElementById("ui-container");

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

					overlay.appendChild(positionBtnContainer);
					overlay.appendChild(rotationBtnsContainer);

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
						buttonContainer.classList.add("hidden");
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

	return { button, positionBtn, positionBtnContainer, rotationBtnsContainer };
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

	const pivot = new Tetavi.THREE.Object3D();

	const playStop = () => {
		if (firstPlay) {
			firstPlay = false;

			tetavi.getSrcVideo().muted = true;

			tetavi.play();

			pivot.add(tetavi.getScene());

			pivot.visible = false;

			scene.add(pivot);

			console.log(tetavi);
			console.log(tetavi.getScene());
		}
	};
	button.addEventListener("click", playStop);

	return { pivot };
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

	/*	const controls = new TetaviExt.libOrbitControls(
		camera,
		renderer.domElement
	);
	controls.target.set(0, 1.5, 0);

	camera.position.z = 5;
	camera.position.y = 1.5;

	controls.update();*/

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
				loadingPage.classList.add("hidden");
			}
		}
	}

	const tetavi = Tetavi.create(
		renderer,
		camera,
		"./wtet/2/texturesVideo.mp4",
		"./wtet/2/Geometry.manifest"
	)
		.onSetBar(setBar)
		.setFadeAlpha(false)
		.onLog(onLog);

	tetavi.setShadowVisible(false);

	function require(str) {
		return "./archivos2/2/" + str;
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
const callAnimation = (
	tetavi,
	scene,
	camera,
	pivot,
	renderer,
	positionBtnContainer,
	positionBtn,
	rotationBtnsContainer
) => {
	let settingPosition = true;
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
		if (hitTestResults.length && settingPosition) {
			const hit = hitTestResults[0];
			const pose = hit.getPose(renderer.xr.getReferenceSpace());
			reticle.visible = true;
			reticle.matrix.fromArray(pose.transform.matrix);
		} else {
			reticle.visible = false;
		}
	}

	function onSelect() {
		if (reticle.visible && settingPosition) {
			video = tetavi.getSrcVideo();
			video.muted = false;
			video.pause();
			video.currentTime = 0;
			video.play();
			pivot.position.setFromMatrixPosition(reticle.matrix);
			pivot.position.y -= 0.3;
			pivot.visible = true;
			settingPosition = false;
			positionBtnContainer.classList.add("visible");
			rotationBtnsContainer.classList.add("visible");
		}
	}

	const rotationBtns = Array.from(rotationBtnsContainer.children);
	rotationBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			pivot.rotation.y += btn.id === "left" ? -3.14 * 0.2  : 3.14 * 0.2;
		});
	});

	controller.addEventListener("select", onSelect);
	positionBtn.addEventListener("click", () => {
		positionBtnContainer.classList.remove("visible");
		settingPosition = true;
	});

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

const { renderer } = (0,_js_renderer__WEBPACK_IMPORTED_MODULE_3__.createRenderer)(_js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.camera);

const tetavi = (0,_js_tetavi_setup__WEBPACK_IMPORTED_MODULE_5__.createTetavi)(_js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.camera, renderer).tetavi;

const { button, positionBtnContainer, positionBtn, rotationBtnsContainer } = (0,_js_ar_button__WEBPACK_IMPORTED_MODULE_0__.createARBtn)(renderer);

const { pivot } = (0,_js_play_stop__WEBPACK_IMPORTED_MODULE_2__.playVideo)(button, tetavi, _js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.scene);

(0,_js_three_animate__WEBPACK_IMPORTED_MODULE_6__.callAnimation)(
	tetavi,
	_js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.scene,
	_js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.camera,
	pivot,
	renderer,
	positionBtnContainer,
	positionBtn,
	rotationBtnsContainer
);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUs7QUFDTixDQUFDLG9EQUFNO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL2FyLWJ1dHRvbi5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvbGlnaHRzLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy9wbGF5LXN0b3AuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL3JlbmRlcmVyLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy9zY2VuZS1jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL3RldGF2aS1zZXR1cC5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvdGhyZWUtYW5pbWF0ZS5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY3JlYXRlQVJCdG4gPSAocmVuZGVyZXIpID0+IHtcblx0Y29uc3QgcG9zaXRpb25CdG5Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRwb3NpdGlvbkJ0bkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFxuXHRcdFwiZml4ZWQtYm90dG9tLXJpZ2h0XCIsXG5cdFx0XCJ0eHQtcmlnaHRcIixcblx0XHRcIm1hcmdpbi0xXCIsXG5cdFx0XCJtYXJnaW4tcmlnaHQtMlwiLFxuXHRcdFwiaGlkZGVuXCJcblx0KTtcblx0cG9zaXRpb25CdG5Db250YWluZXIuaWQgPSBcImNoYW5nZS1wb3NpdGlvbi1jb250YWluZXJcIjtcblxuXHRjb25zdCBwb3NpdGlvbkJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG5cdHBvc2l0aW9uQnRuLmNsYXNzTGlzdC5hZGQoXCJtZW51LWJ0blwiKTtcblx0cG9zaXRpb25CdG4uaWQgPSBcImNoYW5nZS1wb3NpdGlvblwiO1xuXHRwb3NpdGlvbkJ0bi5pbm5lclRleHQgPSBcIlBPU0lDSU9OXCI7XG5cdHBvc2l0aW9uQnRuQ29udGFpbmVyLmFwcGVuZENoaWxkKHBvc2l0aW9uQnRuKTtcblxuXHRjb25zdCByb3RhdGlvbkJ0bnNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRyb3RhdGlvbkJ0bnNDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImZpeGVkLWJvdHRvbS1sZWZ0XCIsIFwibWFyZ2luLTFcIiwgXCJoaWRkZW5cIik7XG5cblx0Y29uc3Qgcm90YXRpb25CdG5zVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpXG5cdHJvdGF0aW9uQnRuc1RleHQuY2xhc3NMaXN0LmFkZChcInR4dC1jZW50ZXItd2hpdGVcIilcblx0cm90YXRpb25CdG5zVGV4dC5pbm5lclRleHQgPSBcIlJPVEFSIE1PREVMT1wiXG5cdHJvdGF0aW9uQnRuc0NvbnRhaW5lci5hcHBlbmRDaGlsZChyb3RhdGlvbkJ0bnNUZXh0KVxuXG5cdGNvbnN0IHJvdGF0aW9uTGVmdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG5cdGNvbnN0IHJvdGF0aW9uUmlnaHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXHRyb3RhdGlvbkxlZnQudHlwZSA9IFwiYnV0dG9uXCJcblx0cm90YXRpb25MZWZ0LmlkID0gXCJsZWZ0XCJcblx0cm90YXRpb25SaWdodC50eXBlID0gXCJidXR0b25cIlxuXHRyb3RhdGlvblJpZ2h0LmlkID0gXCJyaWdodFwiXG5cdHJvdGF0aW9uTGVmdC5pbm5lclRleHQgPSBcIuKGu1wiO1xuXHRyb3RhdGlvblJpZ2h0LmlubmVyVGV4dCA9IFwi4oa6XCI7XG5cblx0cm90YXRpb25CdG5zQ29udGFpbmVyLmFwcGVuZENoaWxkKHJvdGF0aW9uTGVmdCk7XG5cdHJvdGF0aW9uQnRuc0NvbnRhaW5lci5hcHBlbmRDaGlsZChyb3RhdGlvblJpZ2h0KTtcblx0cm90YXRpb25MZWZ0LmNsYXNzTGlzdC5hZGQoXCJtZW51LWJ0blwiLCBcIm1hcmdpbi1sZWZ0LTA1XCIpO1xuXHRyb3RhdGlvblJpZ2h0LmNsYXNzTGlzdC5hZGQoXCJtZW51LWJ0blwiLCBcIm1hcmdpbi1yaWdodC0wNVwiKTtcblxuXHRjbGFzcyBBUkJ1dHRvbiB7XG5cdFx0c3RhdGljIGNyZWF0ZUJ1dHRvbihyZW5kZXJlciwgc2Vzc2lvbkluaXQgPSB7fSkge1xuXHRcdFx0Y29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcblx0XHRcdGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidWktY29udGFpbmVyXCIpO1xuXG5cdFx0XHRmdW5jdGlvbiBzaG93U3RhcnRBUigvKmRldmljZSovKSB7XG5cdFx0XHRcdGlmIChzZXNzaW9uSW5pdC5kb21PdmVybGF5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdFx0XHRvdmVybGF5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJsYXkpO1xuXG5cdFx0XHRcdFx0Y29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuXHRcdFx0XHRcdFx0XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuXHRcdFx0XHRcdFx0XCJzdmdcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0c3ZnLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIDM4KTtcblx0XHRcdFx0XHRzdmcuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIDM4KTtcblx0XHRcdFx0XHRzdmcuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdFx0XHRcdFx0c3ZnLnN0eWxlLnJpZ2h0ID0gXCIyMHB4XCI7XG5cdFx0XHRcdFx0c3ZnLnN0eWxlLnRvcCA9IFwiMjBweFwiO1xuXHRcdFx0XHRcdHN2Zy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0Y3VycmVudFNlc3Npb24uZW5kKCk7XG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3ZlcmxheS5hcHBlbmRDaGlsZChzdmcpO1xuXG5cdFx0XHRcdFx0b3ZlcmxheS5hcHBlbmRDaGlsZChwb3NpdGlvbkJ0bkNvbnRhaW5lcik7XG5cdFx0XHRcdFx0b3ZlcmxheS5hcHBlbmRDaGlsZChyb3RhdGlvbkJ0bnNDb250YWluZXIpO1xuXG5cdFx0XHRcdFx0Y29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcblx0XHRcdFx0XHRcdFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcblx0XHRcdFx0XHRcdFwicGF0aFwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJNIDEyLDEyIEwgMjgsMjggTSAyOCwxMiAxMiwyOFwiKTtcblx0XHRcdFx0XHRwYXRoLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBcIiNmZmZcIik7XG5cdFx0XHRcdFx0cGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgMik7XG5cdFx0XHRcdFx0c3ZnLmFwcGVuZENoaWxkKHBhdGgpO1xuXG5cdFx0XHRcdFx0aWYgKHNlc3Npb25Jbml0Lm9wdGlvbmFsRmVhdHVyZXMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0c2Vzc2lvbkluaXQub3B0aW9uYWxGZWF0dXJlcyA9IFtdO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHNlc3Npb25Jbml0Lm9wdGlvbmFsRmVhdHVyZXMucHVzaChcImRvbS1vdmVybGF5XCIpO1xuXHRcdFx0XHRcdHNlc3Npb25Jbml0LmRvbU92ZXJsYXkgPSB7IHJvb3Q6IG92ZXJsYXkgfTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vXG5cblx0XHRcdFx0bGV0IGN1cnJlbnRTZXNzaW9uID0gbnVsbDtcblxuXHRcdFx0XHRhc3luYyBmdW5jdGlvbiBvblNlc3Npb25TdGFydGVkKHNlc3Npb24pIHtcblx0XHRcdFx0XHRzZXNzaW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJlbmRcIiwgb25TZXNzaW9uRW5kZWQpO1xuXG5cdFx0XHRcdFx0cmVuZGVyZXIueHIuc2V0UmVmZXJlbmNlU3BhY2VUeXBlKFwibG9jYWxcIik7XG5cblx0XHRcdFx0XHRhd2FpdCByZW5kZXJlci54ci5zZXRTZXNzaW9uKHNlc3Npb24pO1xuXG5cdFx0XHRcdFx0YnV0dG9uLnRleHRDb250ZW50ID0gXCJTVE9QIEFSXCI7XG5cdFx0XHRcdFx0c2Vzc2lvbkluaXQuZG9tT3ZlcmxheS5yb290LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXG5cdFx0XHRcdFx0Y3VycmVudFNlc3Npb24gPSBzZXNzaW9uO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gb25TZXNzaW9uRW5kZWQoLypldmVudCovKSB7XG5cdFx0XHRcdFx0Y3VycmVudFNlc3Npb24ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImVuZFwiLCBvblNlc3Npb25FbmRlZCk7XG5cblx0XHRcdFx0XHRidXR0b24udGV4dENvbnRlbnQgPSBcIlNUQVJUIEFSXCI7XG5cdFx0XHRcdFx0c2Vzc2lvbkluaXQuZG9tT3ZlcmxheS5yb290LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuXHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uID0gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblxuXHRcdFx0XHRidXR0b24uc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5sZWZ0ID0gXCJjYWxjKDUwJSAtIDUwcHgpXCI7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuXG5cdFx0XHRcdGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU1RBUlQgQVJcIjtcblxuXHRcdFx0XHRidXR0b24ub25tb3VzZWVudGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGJ1dHRvbi5zdHlsZS5vcGFjaXR5ID0gXCIxLjBcIjtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRidXR0b24ub25tb3VzZWxlYXZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGJ1dHRvbi5zdHlsZS5vcGFjaXR5ID0gXCIwLjhcIjtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAoY3VycmVudFNlc3Npb24gPT09IG51bGwpIHtcblx0XHRcdFx0XHRcdG5hdmlnYXRvci54clxuXHRcdFx0XHRcdFx0XHQucmVxdWVzdFNlc3Npb24oXCJpbW1lcnNpdmUtYXJcIiwgc2Vzc2lvbkluaXQpXG5cdFx0XHRcdFx0XHRcdC50aGVuKG9uU2Vzc2lvblN0YXJ0ZWQpO1xuXHRcdFx0XHRcdFx0YnV0dG9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uLmVuZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gZGlzYWJsZUJ1dHRvbigpIHtcblx0XHRcdFx0YnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5jdXJzb3IgPSBcImF1dG9cIjtcblx0XHRcdFx0YnV0dG9uLnN0eWxlLmxlZnQgPSBcImNhbGMoNTAlIC0gNzVweClcIjtcblx0XHRcdFx0YnV0dG9uLnN0eWxlLndpZHRoID0gXCIxNTBweFwiO1xuXG5cdFx0XHRcdGJ1dHRvbi5vbm1vdXNlZW50ZXIgPSBudWxsO1xuXHRcdFx0XHRidXR0b24ub25tb3VzZWxlYXZlID0gbnVsbDtcblxuXHRcdFx0XHRidXR0b24ub25jbGljayA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHNob3dBUk5vdFN1cHBvcnRlZCgpIHtcblx0XHRcdFx0ZGlzYWJsZUJ1dHRvbigpO1xuXG5cdFx0XHRcdGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiQVIgTk9UIFNVUFBPUlRFRFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBzaG93QVJOb3RBbGxvd2VkKGV4Y2VwdGlvbikge1xuXHRcdFx0XHRkaXNhYmxlQnV0dG9uKCk7XG5cblx0XHRcdFx0Y29uc29sZS53YXJuKFxuXHRcdFx0XHRcdFwiRXhjZXB0aW9uIHdoZW4gdHJ5aW5nIHRvIGNhbGwgeHIuaXNTZXNzaW9uU3VwcG9ydGVkXCIsXG5cdFx0XHRcdFx0ZXhjZXB0aW9uXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0YnV0dG9uLnRleHRDb250ZW50ID0gXCJBUiBOT1QgQUxMT1dFRFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBzdHlsaXplRWxlbWVudChlbGVtZW50KSB7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUucGFkZGluZyA9IFwiMWVtIDAuMmVtXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuYm9yZGVyID0gXCIxcHggc29saWQgI2ZmZlwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiMTVweFwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSBcIiNkOWFmMmJcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5jb2xvciA9IFwiI2ZmZlwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmZvbnQgPSBcIm5vcm1hbCAzLjVlbSBzYW5zLXNlcmlmXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gXCIxXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUub3V0bGluZSA9IFwibm9uZVwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiOTk5XCI7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChcInhyXCIgaW4gbmF2aWdhdG9yKSB7XG5cdFx0XHRcdGJ1dHRvbi5pZCA9IFwiQVJCdXR0b25cIjtcblx0XHRcdFx0YnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuXHRcdFx0XHRzdHlsaXplRWxlbWVudChidXR0b24pO1xuXG5cdFx0XHRcdG5hdmlnYXRvci54clxuXHRcdFx0XHRcdC5pc1Nlc3Npb25TdXBwb3J0ZWQoXCJpbW1lcnNpdmUtYXJcIilcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAoc3VwcG9ydGVkKSB7XG5cdFx0XHRcdFx0XHRzdXBwb3J0ZWQgPyBzaG93U3RhcnRBUigpIDogc2hvd0FSTm90U3VwcG9ydGVkKCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuY2F0Y2goc2hvd0FSTm90QWxsb3dlZCk7XG5cblx0XHRcdFx0cmV0dXJuIGJ1dHRvbjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblxuXHRcdFx0XHRpZiAod2luZG93LmlzU2VjdXJlQ29udGV4dCA9PT0gZmFsc2UpIHtcblx0XHRcdFx0XHRtZXNzYWdlLmhyZWYgPSBkb2N1bWVudC5sb2NhdGlvbi5ocmVmLnJlcGxhY2UoXG5cdFx0XHRcdFx0XHQvXmh0dHA6Lyxcblx0XHRcdFx0XHRcdFwiaHR0cHM6XCJcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdG1lc3NhZ2UuaW5uZXJIVE1MID0gXCJXRUJYUiBORUVEUyBIVFRQU1wiOyAvLyBUT0RPIEltcHJvdmUgbWVzc2FnZVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1lc3NhZ2UuaHJlZiA9IFwiaHR0cHM6Ly9pbW1lcnNpdmV3ZWIuZGV2L1wiO1xuXHRcdFx0XHRcdG1lc3NhZ2UuaW5uZXJIVE1MID0gXCJXRUJYUiBOT1QgQVZBSUxBQkxFXCI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRtZXNzYWdlLnN0eWxlLmxlZnQgPSBcImNhbGMoNTAlIC0gOTBweClcIjtcblx0XHRcdFx0bWVzc2FnZS5zdHlsZS53aWR0aCA9IFwiMTgwcHhcIjtcblx0XHRcdFx0bWVzc2FnZS5zdHlsZS50ZXh0RGVjb3JhdGlvbiA9IFwibm9uZVwiO1xuXG5cdFx0XHRcdHN0eWxpemVFbGVtZW50KG1lc3NhZ2UpO1xuXG5cdFx0XHRcdHJldHVybiBtZXNzYWdlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGNvbnN0IGJ1dHRvbiA9IEFSQnV0dG9uLmNyZWF0ZUJ1dHRvbihyZW5kZXJlciwge1xuXHRcdHJlcXVpcmVkRmVhdHVyZXM6IFtcImhpdC10ZXN0XCJdLFxuXHR9KTtcblxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVpLWNvbnRhaW5lclwiKS5hcHBlbmRDaGlsZChidXR0b24pO1xuXG5cdHJldHVybiB7IGJ1dHRvbiwgcG9zaXRpb25CdG4sIHBvc2l0aW9uQnRuQ29udGFpbmVyLCByb3RhdGlvbkJ0bnNDb250YWluZXIgfTtcbn07XG5cbmV4cG9ydCB7IGNyZWF0ZUFSQnRuIH07XG4iLCJjb25zdCBhbWJpZW50ID0gbmV3IFRldGF2aS5USFJFRS5BbWJpZW50TGlnaHQoMHg5OTk5OTkpO1xuXG5jb25zdCBzcG90TGlnaHQgPSBuZXcgVGV0YXZpLlRIUkVFLlNwb3RMaWdodCgweGZmZmZmZik7XG5zcG90TGlnaHQucG9zaXRpb24uc2V0KDAsIDUsIDApO1xuc3BvdExpZ2h0LmNhc3RTaGFkb3cgPSBmYWxzZTtcbnNwb3RMaWdodC5hbmdsZSA9IE1hdGguUEkgLyA0O1xuc3BvdExpZ2h0LnBlbnVtYnJhID0gMC4xO1xuc3BvdExpZ2h0LmRlY2F5ID0gMjtcbnNwb3RMaWdodC5kaXN0YW5jZSA9IDIwMDtcblxuZXhwb3J0IHsgYW1iaWVudCwgc3BvdExpZ2h0IH07XG4iLCJjb25zdCBwbGF5VmlkZW8gPSAoYnV0dG9uLCB0ZXRhdmksIHNjZW5lKSA9PiB7XG5cdGxldCBmaXJzdFBsYXkgPSB0cnVlO1xuXG5cdGNvbnN0IHBpdm90ID0gbmV3IFRldGF2aS5USFJFRS5PYmplY3QzRCgpO1xuXG5cdGNvbnN0IHBsYXlTdG9wID0gKCkgPT4ge1xuXHRcdGlmIChmaXJzdFBsYXkpIHtcblx0XHRcdGZpcnN0UGxheSA9IGZhbHNlO1xuXG5cdFx0XHR0ZXRhdmkuZ2V0U3JjVmlkZW8oKS5tdXRlZCA9IHRydWU7XG5cblx0XHRcdHRldGF2aS5wbGF5KCk7XG5cblx0XHRcdHBpdm90LmFkZCh0ZXRhdmkuZ2V0U2NlbmUoKSk7XG5cblx0XHRcdHBpdm90LnZpc2libGUgPSBmYWxzZTtcblxuXHRcdFx0c2NlbmUuYWRkKHBpdm90KTtcblxuXHRcdFx0Y29uc29sZS5sb2codGV0YXZpKTtcblx0XHRcdGNvbnNvbGUubG9nKHRldGF2aS5nZXRTY2VuZSgpKTtcblx0XHR9XG5cdH07XG5cdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxheVN0b3ApO1xuXG5cdHJldHVybiB7IHBpdm90IH07XG59O1xuXG5leHBvcnQgeyBwbGF5VmlkZW8gfTtcbiIsImNvbnN0IGNyZWF0ZVJlbmRlcmVyID0gKGNhbWVyYSkgPT4ge1xuXHRjb25zdCByZW5kZXJlciA9IG5ldyBUZXRhdmkuVEhSRUUuV2ViR0xSZW5kZXJlcih7XG5cdFx0YW50aWFsaWFzOiB0cnVlLFxuXHRcdGFscGhhOiB0cnVlLFxuXHR9KTtcblx0cmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG5cdHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cdHJlbmRlcmVyLnhyLmVuYWJsZWQgPSB0cnVlO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG5cdC8qXHRjb25zdCBjb250cm9scyA9IG5ldyBUZXRhdmlFeHQubGliT3JiaXRDb250cm9scyhcblx0XHRjYW1lcmEsXG5cdFx0cmVuZGVyZXIuZG9tRWxlbWVudFxuXHQpO1xuXHRjb250cm9scy50YXJnZXQuc2V0KDAsIDEuNSwgMCk7XG5cblx0Y2FtZXJhLnBvc2l0aW9uLnogPSA1O1xuXHRjYW1lcmEucG9zaXRpb24ueSA9IDEuNTtcblxuXHRjb250cm9scy51cGRhdGUoKTsqL1xuXG5cdGZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuXHRcdGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcblx0XHRjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG5cdFx0cmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcblx0fVxuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uV2luZG93UmVzaXplKTtcblxuXHRyZXR1cm4geyByZW5kZXJlciB9O1xufTtcblxuZXhwb3J0IHsgY3JlYXRlUmVuZGVyZXIgfTtcbiIsImNvbnN0IHNjZW5lID0gbmV3IFRldGF2aS5USFJFRS5TY2VuZSgpO1xuXG5jb25zdCBjYW1lcmEgPSBuZXcgVGV0YXZpLlRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuXHQ3MCxcblx0d2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG5cdDAuMDEsXG5cdDIwXG4pO1xuXG5leHBvcnQgeyBzY2VuZSwgY2FtZXJhIH07XG4iLCJjb25zdCBjcmVhdGVUZXRhdmkgPSAoY2FtZXJhLCByZW5kZXJlcikgPT4ge1xuXHRjb25zdCBsb2FkaW5nUGFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZGluZy1wYWdlXCIpO1xuXG5cdGZ1bmN0aW9uIG9uTG9nKGxvZykge1xuXHRcdGNvbnNvbGUubG9nKGxvZyk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRCYXIod2lkdGgsIHdpZHRoUGxheSkge1xuXHRcdGlmICh0ZXRhdmkgIT0gbnVsbCkge1xuXHRcdFx0aWYgKHdpZHRoUGxheSAvIHdpZHRoID4gMC4wMSAmJiB0ZXRhdmkuaXNSZWFkeSgpKSB7XG5cdFx0XHRcdGxvYWRpbmdQYWdlLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgdGV0YXZpID0gVGV0YXZpLmNyZWF0ZShcblx0XHRyZW5kZXJlcixcblx0XHRjYW1lcmEsXG5cdFx0XCIuL3d0ZXQvMi90ZXh0dXJlc1ZpZGVvLm1wNFwiLFxuXHRcdFwiLi93dGV0LzIvR2VvbWV0cnkubWFuaWZlc3RcIlxuXHQpXG5cdFx0Lm9uU2V0QmFyKHNldEJhcilcblx0XHQuc2V0RmFkZUFscGhhKGZhbHNlKVxuXHRcdC5vbkxvZyhvbkxvZyk7XG5cblx0dGV0YXZpLnNldFNoYWRvd1Zpc2libGUoZmFsc2UpO1xuXG5cdGZ1bmN0aW9uIHJlcXVpcmUoc3RyKSB7XG5cdFx0cmV0dXJuIFwiLi9hcmNoaXZvczIvMi9cIiArIHN0cjtcblx0fVxuXG5cdHJldHVybiB7IHRldGF2aSB9O1xufTtcblxuZXhwb3J0IHsgY3JlYXRlVGV0YXZpIH07XG4iLCJjb25zdCBjYWxsQW5pbWF0aW9uID0gKFxuXHR0ZXRhdmksXG5cdHNjZW5lLFxuXHRjYW1lcmEsXG5cdHBpdm90LFxuXHRyZW5kZXJlcixcblx0cG9zaXRpb25CdG5Db250YWluZXIsXG5cdHBvc2l0aW9uQnRuLFxuXHRyb3RhdGlvbkJ0bnNDb250YWluZXJcbikgPT4ge1xuXHRsZXQgc2V0dGluZ1Bvc2l0aW9uID0gdHJ1ZTtcblx0bGV0IHZpZGVvO1xuXG5cdGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRldGF2aS5USFJFRS5SaW5nR2VvbWV0cnkoMC4wOCwgMC4xLCAzMikucm90YXRlWChcblx0XHQtTWF0aC5QSSAvIDJcblx0KTtcblx0bGV0IG1hdGVyaWFsID0gbmV3IFRldGF2aS5USFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xuXHRjb25zdCByZXRpY2xlID0gbmV3IFRldGF2aS5USFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cdHJldGljbGUubWF0cml4QXV0b1VwZGF0ZSA9IGZhbHNlO1xuXHRyZXRpY2xlLnZpc2libGUgPSB0cnVlO1xuXHRzY2VuZS5hZGQocmV0aWNsZSk7XG5cblx0bGV0IGhpdFRlc3RTb3VyY2UgPSBudWxsO1xuXHRsZXQgaGl0VGVzdFNvdXJjZVJlcXVlc3RlZCA9IGZhbHNlO1xuXG5cdGNvbnN0IGNvbnRyb2xsZXIgPSByZW5kZXJlci54ci5nZXRDb250cm9sbGVyKDApO1xuXG5cdGFzeW5jIGZ1bmN0aW9uIHJlcXVlc3RIaXRUZXN0U291cmNlKCkge1xuXHRcdGNvbnN0IHNlc3Npb24gPSByZW5kZXJlci54ci5nZXRTZXNzaW9uKCk7XG5cdFx0c2Vzc2lvbi5hZGRFdmVudExpc3RlbmVyKFwiZW5kXCIsICgpID0+IHtcblx0XHRcdGhpdFRlc3RTb3VyY2VSZXF1ZXN0ZWQgPSBmYWxzZTtcblx0XHRcdGhpdFRlc3RTb3VyY2UgPSBudWxsO1xuXHRcdH0pO1xuXHRcdGNvbnN0IHJlZmVyZW5jZVNwYWNlID0gYXdhaXQgc2Vzc2lvbi5yZXF1ZXN0UmVmZXJlbmNlU3BhY2UoXCJ2aWV3ZXJcIik7XG5cdFx0aGl0VGVzdFNvdXJjZSA9IGF3YWl0IHNlc3Npb24ucmVxdWVzdEhpdFRlc3RTb3VyY2Uoe1xuXHRcdFx0c3BhY2U6IHJlZmVyZW5jZVNwYWNlLFxuXHRcdH0pO1xuXHRcdGhpdFRlc3RTb3VyY2VSZXF1ZXN0ZWQgPSB0cnVlO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0SGl0VGVzdFJlc3VsdHMoZnJhbWUpIHtcblx0XHRjb25zdCBoaXRUZXN0UmVzdWx0cyA9IGZyYW1lLmdldEhpdFRlc3RSZXN1bHRzKGhpdFRlc3RTb3VyY2UpO1xuXHRcdGlmIChoaXRUZXN0UmVzdWx0cy5sZW5ndGggJiYgc2V0dGluZ1Bvc2l0aW9uKSB7XG5cdFx0XHRjb25zdCBoaXQgPSBoaXRUZXN0UmVzdWx0c1swXTtcblx0XHRcdGNvbnN0IHBvc2UgPSBoaXQuZ2V0UG9zZShyZW5kZXJlci54ci5nZXRSZWZlcmVuY2VTcGFjZSgpKTtcblx0XHRcdHJldGljbGUudmlzaWJsZSA9IHRydWU7XG5cdFx0XHRyZXRpY2xlLm1hdHJpeC5mcm9tQXJyYXkocG9zZS50cmFuc2Zvcm0ubWF0cml4KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0aWNsZS52aXNpYmxlID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gb25TZWxlY3QoKSB7XG5cdFx0aWYgKHJldGljbGUudmlzaWJsZSAmJiBzZXR0aW5nUG9zaXRpb24pIHtcblx0XHRcdHZpZGVvID0gdGV0YXZpLmdldFNyY1ZpZGVvKCk7XG5cdFx0XHR2aWRlby5tdXRlZCA9IGZhbHNlO1xuXHRcdFx0dmlkZW8ucGF1c2UoKTtcblx0XHRcdHZpZGVvLmN1cnJlbnRUaW1lID0gMDtcblx0XHRcdHZpZGVvLnBsYXkoKTtcblx0XHRcdHBpdm90LnBvc2l0aW9uLnNldEZyb21NYXRyaXhQb3NpdGlvbihyZXRpY2xlLm1hdHJpeCk7XG5cdFx0XHRwaXZvdC5wb3NpdGlvbi55IC09IDAuMztcblx0XHRcdHBpdm90LnZpc2libGUgPSB0cnVlO1xuXHRcdFx0c2V0dGluZ1Bvc2l0aW9uID0gZmFsc2U7XG5cdFx0XHRwb3NpdGlvbkJ0bkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKTtcblx0XHRcdHJvdGF0aW9uQnRuc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCByb3RhdGlvbkJ0bnMgPSBBcnJheS5mcm9tKHJvdGF0aW9uQnRuc0NvbnRhaW5lci5jaGlsZHJlbik7XG5cdHJvdGF0aW9uQnRucy5mb3JFYWNoKChidG4pID0+IHtcblx0XHRidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdHBpdm90LnJvdGF0aW9uLnkgKz0gYnRuLmlkID09PSBcImxlZnRcIiA/IC0zLjE0ICogMC4yICA6IDMuMTQgKiAwLjI7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcihcInNlbGVjdFwiLCBvblNlbGVjdCk7XG5cdHBvc2l0aW9uQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0cG9zaXRpb25CdG5Db250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XG5cdFx0c2V0dGluZ1Bvc2l0aW9uID0gdHJ1ZTtcblx0fSk7XG5cblx0ZnVuY3Rpb24gdGhyZWVfYW5pbWF0ZShfLCBmcmFtZSkge1xuXHRcdGlmICh0ZXRhdmkgIT0gbnVsbCkge1xuXHRcdFx0dGV0YXZpLmFuaW1hdGUoKTtcblx0XHRcdGlmICghcGl2b3QgJiYgc2NlbmUuY2hpbGRyZW5bM10pIHtcblx0XHRcdFx0cGl2b3QgPSBzY2VuZS5jaGlsZHJlblszXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZnJhbWUpIHtcblx0XHRcdGlmIChoaXRUZXN0U291cmNlUmVxdWVzdGVkID09PSBmYWxzZSkge1xuXHRcdFx0XHRyZXF1ZXN0SGl0VGVzdFNvdXJjZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGhpdFRlc3RTb3VyY2UpIHtcblx0XHRcdFx0Z2V0SGl0VGVzdFJlc3VsdHMoZnJhbWUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcblx0fVxuXG5cdHJlbmRlcmVyLnNldEFuaW1hdGlvbkxvb3AodGhyZWVfYW5pbWF0ZSk7XG59O1xuXG5leHBvcnQgeyBjYWxsQW5pbWF0aW9uIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGNyZWF0ZUFSQnRuIH0gZnJvbSBcIi4vanMvYXItYnV0dG9uXCI7XG5pbXBvcnQgeyBhbWJpZW50LCBzcG90TGlnaHQgfSBmcm9tIFwiLi9qcy9saWdodHNcIjtcbmltcG9ydCB7IHBsYXlWaWRlbyB9IGZyb20gXCIuL2pzL3BsYXktc3RvcFwiO1xuaW1wb3J0IHsgY3JlYXRlUmVuZGVyZXIgfSBmcm9tIFwiLi9qcy9yZW5kZXJlclwiO1xuaW1wb3J0IHsgc2NlbmUsIGNhbWVyYSB9IGZyb20gXCIuL2pzL3NjZW5lLWNhbWVyYVwiO1xuaW1wb3J0IHsgY3JlYXRlVGV0YXZpIH0gZnJvbSBcIi4vanMvdGV0YXZpLXNldHVwXCI7XG5pbXBvcnQgeyBjYWxsQW5pbWF0aW9uIH0gZnJvbSBcIi4vanMvdGhyZWUtYW5pbWF0ZVwiO1xuXG5zY2VuZS5hZGQoYW1iaWVudCk7XG5zY2VuZS5hZGQoc3BvdExpZ2h0KTtcblxuY29uc3QgeyByZW5kZXJlciB9ID0gY3JlYXRlUmVuZGVyZXIoY2FtZXJhKTtcblxuY29uc3QgdGV0YXZpID0gY3JlYXRlVGV0YXZpKGNhbWVyYSwgcmVuZGVyZXIpLnRldGF2aTtcblxuY29uc3QgeyBidXR0b24sIHBvc2l0aW9uQnRuQ29udGFpbmVyLCBwb3NpdGlvbkJ0biwgcm90YXRpb25CdG5zQ29udGFpbmVyIH0gPSBjcmVhdGVBUkJ0bihyZW5kZXJlcik7XG5cbmNvbnN0IHsgcGl2b3QgfSA9IHBsYXlWaWRlbyhidXR0b24sIHRldGF2aSwgc2NlbmUpO1xuXG5jYWxsQW5pbWF0aW9uKFxuXHR0ZXRhdmksXG5cdHNjZW5lLFxuXHRjYW1lcmEsXG5cdHBpdm90LFxuXHRyZW5kZXJlcixcblx0cG9zaXRpb25CdG5Db250YWluZXIsXG5cdHBvc2l0aW9uQnRuLFxuXHRyb3RhdGlvbkJ0bnNDb250YWluZXJcbik7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=