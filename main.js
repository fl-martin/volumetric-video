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
	rotationLeft.classList.add("menu-btn");
	rotationRight.classList.add("menu-btn");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUs7QUFDTixDQUFDLG9EQUFNO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL2FyLWJ1dHRvbi5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvbGlnaHRzLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy9wbGF5LXN0b3AuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL3JlbmRlcmVyLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy9zY2VuZS1jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL3RldGF2aS1zZXR1cC5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvdGhyZWUtYW5pbWF0ZS5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY3JlYXRlQVJCdG4gPSAocmVuZGVyZXIpID0+IHtcblx0Y29uc3QgcG9zaXRpb25CdG5Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRwb3NpdGlvbkJ0bkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFxuXHRcdFwiZml4ZWQtYm90dG9tLXJpZ2h0XCIsXG5cdFx0XCJ0eHQtcmlnaHRcIixcblx0XHRcIm1hcmdpbi0xXCIsXG5cdFx0XCJtYXJnaW4tcmlnaHQtMlwiLFxuXHRcdFwiaGlkZGVuXCJcblx0KTtcblx0cG9zaXRpb25CdG5Db250YWluZXIuaWQgPSBcImNoYW5nZS1wb3NpdGlvbi1jb250YWluZXJcIjtcblxuXHRjb25zdCBwb3NpdGlvbkJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG5cdHBvc2l0aW9uQnRuLmNsYXNzTGlzdC5hZGQoXCJtZW51LWJ0blwiKTtcblx0cG9zaXRpb25CdG4uaWQgPSBcImNoYW5nZS1wb3NpdGlvblwiO1xuXHRwb3NpdGlvbkJ0bi5pbm5lclRleHQgPSBcIlBPU0lDSU9OXCI7XG5cdHBvc2l0aW9uQnRuQ29udGFpbmVyLmFwcGVuZENoaWxkKHBvc2l0aW9uQnRuKTtcblxuXHRjb25zdCByb3RhdGlvbkJ0bnNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRyb3RhdGlvbkJ0bnNDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImZpeGVkLWJvdHRvbS1sZWZ0XCIsIFwibWFyZ2luLTFcIiwgXCJoaWRkZW5cIik7XG5cblx0Y29uc3Qgcm90YXRpb25CdG5zVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpXG5cdHJvdGF0aW9uQnRuc1RleHQuY2xhc3NMaXN0LmFkZChcInR4dC1jZW50ZXItd2hpdGVcIilcblx0cm90YXRpb25CdG5zVGV4dC5pbm5lclRleHQgPSBcIlJPVEFSIE1PREVMT1wiXG5cdHJvdGF0aW9uQnRuc0NvbnRhaW5lci5hcHBlbmRDaGlsZChyb3RhdGlvbkJ0bnNUZXh0KVxuXG5cdGNvbnN0IHJvdGF0aW9uTGVmdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG5cdGNvbnN0IHJvdGF0aW9uUmlnaHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXHRyb3RhdGlvbkxlZnQudHlwZSA9IFwiYnV0dG9uXCJcblx0cm90YXRpb25MZWZ0LmlkID0gXCJsZWZ0XCJcblx0cm90YXRpb25SaWdodC50eXBlID0gXCJidXR0b25cIlxuXHRyb3RhdGlvblJpZ2h0LmlkID0gXCJyaWdodFwiXG5cdHJvdGF0aW9uTGVmdC5pbm5lclRleHQgPSBcIuKGu1wiO1xuXHRyb3RhdGlvblJpZ2h0LmlubmVyVGV4dCA9IFwi4oa6XCI7XG5cblx0cm90YXRpb25CdG5zQ29udGFpbmVyLmFwcGVuZENoaWxkKHJvdGF0aW9uTGVmdCk7XG5cdHJvdGF0aW9uQnRuc0NvbnRhaW5lci5hcHBlbmRDaGlsZChyb3RhdGlvblJpZ2h0KTtcblx0cm90YXRpb25MZWZ0LmNsYXNzTGlzdC5hZGQoXCJtZW51LWJ0blwiKTtcblx0cm90YXRpb25SaWdodC5jbGFzc0xpc3QuYWRkKFwibWVudS1idG5cIik7XG5cblx0Y2xhc3MgQVJCdXR0b24ge1xuXHRcdHN0YXRpYyBjcmVhdGVCdXR0b24ocmVuZGVyZXIsIHNlc3Npb25Jbml0ID0ge30pIHtcblx0XHRcdGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG5cdFx0XHRjb25zdCBidXR0b25Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVpLWNvbnRhaW5lclwiKTtcblxuXHRcdFx0ZnVuY3Rpb24gc2hvd1N0YXJ0QVIoLypkZXZpY2UqLykge1xuXHRcdFx0XHRpZiAoc2Vzc2lvbkluaXQuZG9tT3ZlcmxheSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRcdFx0b3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KTtcblxuXHRcdFx0XHRcdGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcblx0XHRcdFx0XHRcdFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcblx0XHRcdFx0XHRcdFwic3ZnXCJcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHN2Zy5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCAzOCk7XG5cdFx0XHRcdFx0c3ZnLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCAzOCk7XG5cdFx0XHRcdFx0c3ZnLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHRcdFx0XHRcdHN2Zy5zdHlsZS5yaWdodCA9IFwiMjBweFwiO1xuXHRcdFx0XHRcdHN2Zy5zdHlsZS50b3AgPSBcIjIwcHhcIjtcblx0XHRcdFx0XHRzdmcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uLmVuZCgpO1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG92ZXJsYXkuYXBwZW5kQ2hpbGQoc3ZnKTtcblxuXHRcdFx0XHRcdG92ZXJsYXkuYXBwZW5kQ2hpbGQocG9zaXRpb25CdG5Db250YWluZXIpO1xuXHRcdFx0XHRcdG92ZXJsYXkuYXBwZW5kQ2hpbGQocm90YXRpb25CdG5zQ29udGFpbmVyKTtcblxuXHRcdFx0XHRcdGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG5cdFx0XHRcdFx0XHRcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG5cdFx0XHRcdFx0XHRcInBhdGhcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0cGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwiTSAxMiwxMiBMIDI4LDI4IE0gMjgsMTIgMTIsMjhcIik7XG5cdFx0XHRcdFx0cGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgXCIjZmZmXCIpO1xuXHRcdFx0XHRcdHBhdGguc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIDIpO1xuXHRcdFx0XHRcdHN2Zy5hcHBlbmRDaGlsZChwYXRoKTtcblxuXHRcdFx0XHRcdGlmIChzZXNzaW9uSW5pdC5vcHRpb25hbEZlYXR1cmVzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHNlc3Npb25Jbml0Lm9wdGlvbmFsRmVhdHVyZXMgPSBbXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzZXNzaW9uSW5pdC5vcHRpb25hbEZlYXR1cmVzLnB1c2goXCJkb20tb3ZlcmxheVwiKTtcblx0XHRcdFx0XHRzZXNzaW9uSW5pdC5kb21PdmVybGF5ID0geyByb290OiBvdmVybGF5IH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL1xuXG5cdFx0XHRcdGxldCBjdXJyZW50U2Vzc2lvbiA9IG51bGw7XG5cblx0XHRcdFx0YXN5bmMgZnVuY3Rpb24gb25TZXNzaW9uU3RhcnRlZChzZXNzaW9uKSB7XG5cdFx0XHRcdFx0c2Vzc2lvbi5hZGRFdmVudExpc3RlbmVyKFwiZW5kXCIsIG9uU2Vzc2lvbkVuZGVkKTtcblxuXHRcdFx0XHRcdHJlbmRlcmVyLnhyLnNldFJlZmVyZW5jZVNwYWNlVHlwZShcImxvY2FsXCIpO1xuXG5cdFx0XHRcdFx0YXdhaXQgcmVuZGVyZXIueHIuc2V0U2Vzc2lvbihzZXNzaW9uKTtcblxuXHRcdFx0XHRcdGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU1RPUCBBUlwiO1xuXHRcdFx0XHRcdHNlc3Npb25Jbml0LmRvbU92ZXJsYXkucm9vdC5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblxuXHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uID0gc2Vzc2lvbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIG9uU2Vzc2lvbkVuZGVkKC8qZXZlbnQqLykge1xuXHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlbmRcIiwgb25TZXNzaW9uRW5kZWQpO1xuXG5cdFx0XHRcdFx0YnV0dG9uLnRleHRDb250ZW50ID0gXCJTVEFSVCBBUlwiO1xuXHRcdFx0XHRcdHNlc3Npb25Jbml0LmRvbU92ZXJsYXkucm9vdC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cblx0XHRcdFx0XHRjdXJyZW50U2Vzc2lvbiA9IG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cblx0XHRcdFx0YnV0dG9uLnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUubGVmdCA9IFwiY2FsYyg1MCUgLSA1MHB4KVwiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcblxuXHRcdFx0XHRidXR0b24udGV4dENvbnRlbnQgPSBcIlNUQVJUIEFSXCI7XG5cblx0XHRcdFx0YnV0dG9uLm9ubW91c2VlbnRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRidXR0b24uc3R5bGUub3BhY2l0eSA9IFwiMS4wXCI7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0YnV0dG9uLm9ubW91c2VsZWF2ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRidXR0b24uc3R5bGUub3BhY2l0eSA9IFwiMC44XCI7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0YnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKGN1cnJlbnRTZXNzaW9uID09PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRuYXZpZ2F0b3IueHJcblx0XHRcdFx0XHRcdFx0LnJlcXVlc3RTZXNzaW9uKFwiaW1tZXJzaXZlLWFyXCIsIHNlc3Npb25Jbml0KVxuXHRcdFx0XHRcdFx0XHQudGhlbihvblNlc3Npb25TdGFydGVkKTtcblx0XHRcdFx0XHRcdGJ1dHRvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50U2Vzc2lvbi5lbmQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGRpc2FibGVCdXR0b24oKSB7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblxuXHRcdFx0XHRidXR0b24uc3R5bGUuY3Vyc29yID0gXCJhdXRvXCI7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5sZWZ0ID0gXCJjYWxjKDUwJSAtIDc1cHgpXCI7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS53aWR0aCA9IFwiMTUwcHhcIjtcblxuXHRcdFx0XHRidXR0b24ub25tb3VzZWVudGVyID0gbnVsbDtcblx0XHRcdFx0YnV0dG9uLm9ubW91c2VsZWF2ZSA9IG51bGw7XG5cblx0XHRcdFx0YnV0dG9uLm9uY2xpY2sgPSBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBzaG93QVJOb3RTdXBwb3J0ZWQoKSB7XG5cdFx0XHRcdGRpc2FibGVCdXR0b24oKTtcblxuXHRcdFx0XHRidXR0b24udGV4dENvbnRlbnQgPSBcIkFSIE5PVCBTVVBQT1JURURcIjtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gc2hvd0FSTm90QWxsb3dlZChleGNlcHRpb24pIHtcblx0XHRcdFx0ZGlzYWJsZUJ1dHRvbigpO1xuXG5cdFx0XHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFx0XHRcIkV4Y2VwdGlvbiB3aGVuIHRyeWluZyB0byBjYWxsIHhyLmlzU2Vzc2lvblN1cHBvcnRlZFwiLFxuXHRcdFx0XHRcdGV4Y2VwdGlvblxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiQVIgTk9UIEFMTE9XRURcIjtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gc3R5bGl6ZUVsZW1lbnQoZWxlbWVudCkge1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLnBhZGRpbmcgPSBcIjFlbSAwLjJlbVwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkICNmZmZcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjE1cHhcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjZDlhZjJiXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuY29sb3IgPSBcIiNmZmZcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5mb250ID0gXCJub3JtYWwgMy41ZW0gc2Fucy1zZXJpZlwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLm91dGxpbmUgPSBcIm5vbmVcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjk5OVwiO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoXCJ4clwiIGluIG5hdmlnYXRvcikge1xuXHRcdFx0XHRidXR0b24uaWQgPSBcIkFSQnV0dG9uXCI7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cblx0XHRcdFx0c3R5bGl6ZUVsZW1lbnQoYnV0dG9uKTtcblxuXHRcdFx0XHRuYXZpZ2F0b3IueHJcblx0XHRcdFx0XHQuaXNTZXNzaW9uU3VwcG9ydGVkKFwiaW1tZXJzaXZlLWFyXCIpXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHN1cHBvcnRlZCkge1xuXHRcdFx0XHRcdFx0c3VwcG9ydGVkID8gc2hvd1N0YXJ0QVIoKSA6IHNob3dBUk5vdFN1cHBvcnRlZCgpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKHNob3dBUk5vdEFsbG93ZWQpO1xuXG5cdFx0XHRcdHJldHVybiBidXR0b247XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cblx0XHRcdFx0aWYgKHdpbmRvdy5pc1NlY3VyZUNvbnRleHQgPT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0bWVzc2FnZS5ocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZi5yZXBsYWNlKFxuXHRcdFx0XHRcdFx0L15odHRwOi8sXG5cdFx0XHRcdFx0XHRcImh0dHBzOlwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRtZXNzYWdlLmlubmVySFRNTCA9IFwiV0VCWFIgTkVFRFMgSFRUUFNcIjsgLy8gVE9ETyBJbXByb3ZlIG1lc3NhZ2Vcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZXNzYWdlLmhyZWYgPSBcImh0dHBzOi8vaW1tZXJzaXZld2ViLmRldi9cIjtcblx0XHRcdFx0XHRtZXNzYWdlLmlubmVySFRNTCA9IFwiV0VCWFIgTk9UIEFWQUlMQUJMRVwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bWVzc2FnZS5zdHlsZS5sZWZ0ID0gXCJjYWxjKDUwJSAtIDkwcHgpXCI7XG5cdFx0XHRcdG1lc3NhZ2Uuc3R5bGUud2lkdGggPSBcIjE4MHB4XCI7XG5cdFx0XHRcdG1lc3NhZ2Uuc3R5bGUudGV4dERlY29yYXRpb24gPSBcIm5vbmVcIjtcblxuXHRcdFx0XHRzdHlsaXplRWxlbWVudChtZXNzYWdlKTtcblxuXHRcdFx0XHRyZXR1cm4gbWVzc2FnZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRjb25zdCBidXR0b24gPSBBUkJ1dHRvbi5jcmVhdGVCdXR0b24ocmVuZGVyZXIsIHtcblx0XHRyZXF1aXJlZEZlYXR1cmVzOiBbXCJoaXQtdGVzdFwiXSxcblx0fSk7XG5cblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1aS1jb250YWluZXJcIikuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblxuXHRyZXR1cm4geyBidXR0b24sIHBvc2l0aW9uQnRuLCBwb3NpdGlvbkJ0bkNvbnRhaW5lciwgcm90YXRpb25CdG5zQ29udGFpbmVyIH07XG59O1xuXG5leHBvcnQgeyBjcmVhdGVBUkJ0biB9O1xuIiwiY29uc3QgYW1iaWVudCA9IG5ldyBUZXRhdmkuVEhSRUUuQW1iaWVudExpZ2h0KDB4OTk5OTk5KTtcblxuY29uc3Qgc3BvdExpZ2h0ID0gbmV3IFRldGF2aS5USFJFRS5TcG90TGlnaHQoMHhmZmZmZmYpO1xuc3BvdExpZ2h0LnBvc2l0aW9uLnNldCgwLCA1LCAwKTtcbnNwb3RMaWdodC5jYXN0U2hhZG93ID0gZmFsc2U7XG5zcG90TGlnaHQuYW5nbGUgPSBNYXRoLlBJIC8gNDtcbnNwb3RMaWdodC5wZW51bWJyYSA9IDAuMTtcbnNwb3RMaWdodC5kZWNheSA9IDI7XG5zcG90TGlnaHQuZGlzdGFuY2UgPSAyMDA7XG5cbmV4cG9ydCB7IGFtYmllbnQsIHNwb3RMaWdodCB9O1xuIiwiY29uc3QgcGxheVZpZGVvID0gKGJ1dHRvbiwgdGV0YXZpLCBzY2VuZSkgPT4ge1xuXHRsZXQgZmlyc3RQbGF5ID0gdHJ1ZTtcblxuXHRjb25zdCBwaXZvdCA9IG5ldyBUZXRhdmkuVEhSRUUuT2JqZWN0M0QoKTtcblxuXHRjb25zdCBwbGF5U3RvcCA9ICgpID0+IHtcblx0XHRpZiAoZmlyc3RQbGF5KSB7XG5cdFx0XHRmaXJzdFBsYXkgPSBmYWxzZTtcblxuXHRcdFx0dGV0YXZpLmdldFNyY1ZpZGVvKCkubXV0ZWQgPSB0cnVlO1xuXG5cdFx0XHR0ZXRhdmkucGxheSgpO1xuXG5cdFx0XHRwaXZvdC5hZGQodGV0YXZpLmdldFNjZW5lKCkpO1xuXG5cdFx0XHRwaXZvdC52aXNpYmxlID0gZmFsc2U7XG5cblx0XHRcdHNjZW5lLmFkZChwaXZvdCk7XG5cblx0XHRcdGNvbnNvbGUubG9nKHRldGF2aSk7XG5cdFx0XHRjb25zb2xlLmxvZyh0ZXRhdmkuZ2V0U2NlbmUoKSk7XG5cdFx0fVxuXHR9O1xuXHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHBsYXlTdG9wKTtcblxuXHRyZXR1cm4geyBwaXZvdCB9O1xufTtcblxuZXhwb3J0IHsgcGxheVZpZGVvIH07XG4iLCJjb25zdCBjcmVhdGVSZW5kZXJlciA9IChjYW1lcmEpID0+IHtcblx0Y29uc3QgcmVuZGVyZXIgPSBuZXcgVGV0YXZpLlRIUkVFLldlYkdMUmVuZGVyZXIoe1xuXHRcdGFudGlhbGlhczogdHJ1ZSxcblx0XHRhbHBoYTogdHJ1ZSxcblx0fSk7XG5cdHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuXHRyZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXHRyZW5kZXJlci54ci5lbmFibGVkID0gdHJ1ZTtcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuXHQvKlx0Y29uc3QgY29udHJvbHMgPSBuZXcgVGV0YXZpRXh0LmxpYk9yYml0Q29udHJvbHMoXG5cdFx0Y2FtZXJhLFxuXHRcdHJlbmRlcmVyLmRvbUVsZW1lbnRcblx0KTtcblx0Y29udHJvbHMudGFyZ2V0LnNldCgwLCAxLjUsIDApO1xuXG5cdGNhbWVyYS5wb3NpdGlvbi56ID0gNTtcblx0Y2FtZXJhLnBvc2l0aW9uLnkgPSAxLjU7XG5cblx0Y29udHJvbHMudXBkYXRlKCk7Ki9cblxuXHRmdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcblx0XHRjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdFx0Y2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuXHRcdHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cdH1cblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSk7XG5cblx0cmV0dXJuIHsgcmVuZGVyZXIgfTtcbn07XG5cbmV4cG9ydCB7IGNyZWF0ZVJlbmRlcmVyIH07XG4iLCJjb25zdCBzY2VuZSA9IG5ldyBUZXRhdmkuVEhSRUUuU2NlbmUoKTtcblxuY29uc3QgY2FtZXJhID0gbmV3IFRldGF2aS5USFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShcblx0NzAsXG5cdHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LFxuXHQwLjAxLFxuXHQyMFxuKTtcblxuZXhwb3J0IHsgc2NlbmUsIGNhbWVyYSB9O1xuIiwiY29uc3QgY3JlYXRlVGV0YXZpID0gKGNhbWVyYSwgcmVuZGVyZXIpID0+IHtcblx0Y29uc3QgbG9hZGluZ1BhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRpbmctcGFnZVwiKTtcblxuXHRmdW5jdGlvbiBvbkxvZyhsb2cpIHtcblx0XHRjb25zb2xlLmxvZyhsb2cpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0QmFyKHdpZHRoLCB3aWR0aFBsYXkpIHtcblx0XHRpZiAodGV0YXZpICE9IG51bGwpIHtcblx0XHRcdGlmICh3aWR0aFBsYXkgLyB3aWR0aCA+IDAuMDEgJiYgdGV0YXZpLmlzUmVhZHkoKSkge1xuXHRcdFx0XHRsb2FkaW5nUGFnZS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGNvbnN0IHRldGF2aSA9IFRldGF2aS5jcmVhdGUoXG5cdFx0cmVuZGVyZXIsXG5cdFx0Y2FtZXJhLFxuXHRcdFwiLi93dGV0LzIvdGV4dHVyZXNWaWRlby5tcDRcIixcblx0XHRcIi4vd3RldC8yL0dlb21ldHJ5Lm1hbmlmZXN0XCJcblx0KVxuXHRcdC5vblNldEJhcihzZXRCYXIpXG5cdFx0LnNldEZhZGVBbHBoYShmYWxzZSlcblx0XHQub25Mb2cob25Mb2cpO1xuXG5cdHRldGF2aS5zZXRTaGFkb3dWaXNpYmxlKGZhbHNlKTtcblxuXHRmdW5jdGlvbiByZXF1aXJlKHN0cikge1xuXHRcdHJldHVybiBcIi4vYXJjaGl2b3MyLzIvXCIgKyBzdHI7XG5cdH1cblxuXHRyZXR1cm4geyB0ZXRhdmkgfTtcbn07XG5cbmV4cG9ydCB7IGNyZWF0ZVRldGF2aSB9O1xuIiwiY29uc3QgY2FsbEFuaW1hdGlvbiA9IChcblx0dGV0YXZpLFxuXHRzY2VuZSxcblx0Y2FtZXJhLFxuXHRwaXZvdCxcblx0cmVuZGVyZXIsXG5cdHBvc2l0aW9uQnRuQ29udGFpbmVyLFxuXHRwb3NpdGlvbkJ0bixcblx0cm90YXRpb25CdG5zQ29udGFpbmVyXG4pID0+IHtcblx0bGV0IHNldHRpbmdQb3NpdGlvbiA9IHRydWU7XG5cdGxldCB2aWRlbztcblxuXHRjb25zdCBnZW9tZXRyeSA9IG5ldyBUZXRhdmkuVEhSRUUuUmluZ0dlb21ldHJ5KDAuMDgsIDAuMSwgMzIpLnJvdGF0ZVgoXG5cdFx0LU1hdGguUEkgLyAyXG5cdCk7XG5cdGxldCBtYXRlcmlhbCA9IG5ldyBUZXRhdmkuVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcblx0Y29uc3QgcmV0aWNsZSA9IG5ldyBUZXRhdmkuVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXHRyZXRpY2xlLm1hdHJpeEF1dG9VcGRhdGUgPSBmYWxzZTtcblx0cmV0aWNsZS52aXNpYmxlID0gdHJ1ZTtcblx0c2NlbmUuYWRkKHJldGljbGUpO1xuXG5cdGxldCBoaXRUZXN0U291cmNlID0gbnVsbDtcblx0bGV0IGhpdFRlc3RTb3VyY2VSZXF1ZXN0ZWQgPSBmYWxzZTtcblxuXHRjb25zdCBjb250cm9sbGVyID0gcmVuZGVyZXIueHIuZ2V0Q29udHJvbGxlcigwKTtcblxuXHRhc3luYyBmdW5jdGlvbiByZXF1ZXN0SGl0VGVzdFNvdXJjZSgpIHtcblx0XHRjb25zdCBzZXNzaW9uID0gcmVuZGVyZXIueHIuZ2V0U2Vzc2lvbigpO1xuXHRcdHNlc3Npb24uYWRkRXZlbnRMaXN0ZW5lcihcImVuZFwiLCAoKSA9PiB7XG5cdFx0XHRoaXRUZXN0U291cmNlUmVxdWVzdGVkID0gZmFsc2U7XG5cdFx0XHRoaXRUZXN0U291cmNlID0gbnVsbDtcblx0XHR9KTtcblx0XHRjb25zdCByZWZlcmVuY2VTcGFjZSA9IGF3YWl0IHNlc3Npb24ucmVxdWVzdFJlZmVyZW5jZVNwYWNlKFwidmlld2VyXCIpO1xuXHRcdGhpdFRlc3RTb3VyY2UgPSBhd2FpdCBzZXNzaW9uLnJlcXVlc3RIaXRUZXN0U291cmNlKHtcblx0XHRcdHNwYWNlOiByZWZlcmVuY2VTcGFjZSxcblx0XHR9KTtcblx0XHRoaXRUZXN0U291cmNlUmVxdWVzdGVkID0gdHJ1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldEhpdFRlc3RSZXN1bHRzKGZyYW1lKSB7XG5cdFx0Y29uc3QgaGl0VGVzdFJlc3VsdHMgPSBmcmFtZS5nZXRIaXRUZXN0UmVzdWx0cyhoaXRUZXN0U291cmNlKTtcblx0XHRpZiAoaGl0VGVzdFJlc3VsdHMubGVuZ3RoICYmIHNldHRpbmdQb3NpdGlvbikge1xuXHRcdFx0Y29uc3QgaGl0ID0gaGl0VGVzdFJlc3VsdHNbMF07XG5cdFx0XHRjb25zdCBwb3NlID0gaGl0LmdldFBvc2UocmVuZGVyZXIueHIuZ2V0UmVmZXJlbmNlU3BhY2UoKSk7XG5cdFx0XHRyZXRpY2xlLnZpc2libGUgPSB0cnVlO1xuXHRcdFx0cmV0aWNsZS5tYXRyaXguZnJvbUFycmF5KHBvc2UudHJhbnNmb3JtLm1hdHJpeCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldGljbGUudmlzaWJsZSA9IGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIG9uU2VsZWN0KCkge1xuXHRcdGlmIChyZXRpY2xlLnZpc2libGUgJiYgc2V0dGluZ1Bvc2l0aW9uKSB7XG5cdFx0XHR2aWRlbyA9IHRldGF2aS5nZXRTcmNWaWRlbygpO1xuXHRcdFx0dmlkZW8ubXV0ZWQgPSBmYWxzZTtcblx0XHRcdHZpZGVvLnBhdXNlKCk7XG5cdFx0XHR2aWRlby5jdXJyZW50VGltZSA9IDA7XG5cdFx0XHR2aWRlby5wbGF5KCk7XG5cdFx0XHRwaXZvdC5wb3NpdGlvbi5zZXRGcm9tTWF0cml4UG9zaXRpb24ocmV0aWNsZS5tYXRyaXgpO1xuXHRcdFx0cGl2b3QucG9zaXRpb24ueSAtPSAwLjM7XG5cdFx0XHRwaXZvdC52aXNpYmxlID0gdHJ1ZTtcblx0XHRcdHNldHRpbmdQb3NpdGlvbiA9IGZhbHNlO1xuXHRcdFx0cG9zaXRpb25CdG5Db250YWluZXIuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIik7XG5cdFx0XHRyb3RhdGlvbkJ0bnNDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIik7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3Qgcm90YXRpb25CdG5zID0gQXJyYXkuZnJvbShyb3RhdGlvbkJ0bnNDb250YWluZXIuY2hpbGRyZW4pO1xuXHRyb3RhdGlvbkJ0bnMuZm9yRWFjaCgoYnRuKSA9PiB7XG5cdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG5cdFx0XHRwaXZvdC5yb3RhdGlvbi55ICs9IGJ0bi5pZCA9PT0gXCJsZWZ0XCIgPyAtMy4xNCAqIDAuMiAgOiAzLjE0ICogMC4yO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJzZWxlY3RcIiwgb25TZWxlY3QpO1xuXHRwb3NpdGlvbkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdHBvc2l0aW9uQnRuQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuXHRcdHNldHRpbmdQb3NpdGlvbiA9IHRydWU7XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIHRocmVlX2FuaW1hdGUoXywgZnJhbWUpIHtcblx0XHRpZiAodGV0YXZpICE9IG51bGwpIHtcblx0XHRcdHRldGF2aS5hbmltYXRlKCk7XG5cdFx0XHRpZiAoIXBpdm90ICYmIHNjZW5lLmNoaWxkcmVuWzNdKSB7XG5cdFx0XHRcdHBpdm90ID0gc2NlbmUuY2hpbGRyZW5bM107XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGZyYW1lKSB7XG5cdFx0XHRpZiAoaGl0VGVzdFNvdXJjZVJlcXVlc3RlZCA9PT0gZmFsc2UpIHtcblx0XHRcdFx0cmVxdWVzdEhpdFRlc3RTb3VyY2UoKTtcblx0XHRcdH1cblx0XHRcdGlmIChoaXRUZXN0U291cmNlKSB7XG5cdFx0XHRcdGdldEhpdFRlc3RSZXN1bHRzKGZyYW1lKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG5cdH1cblxuXHRyZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKHRocmVlX2FuaW1hdGUpO1xufTtcblxuZXhwb3J0IHsgY2FsbEFuaW1hdGlvbiB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBjcmVhdGVBUkJ0biB9IGZyb20gXCIuL2pzL2FyLWJ1dHRvblwiO1xuaW1wb3J0IHsgYW1iaWVudCwgc3BvdExpZ2h0IH0gZnJvbSBcIi4vanMvbGlnaHRzXCI7XG5pbXBvcnQgeyBwbGF5VmlkZW8gfSBmcm9tIFwiLi9qcy9wbGF5LXN0b3BcIjtcbmltcG9ydCB7IGNyZWF0ZVJlbmRlcmVyIH0gZnJvbSBcIi4vanMvcmVuZGVyZXJcIjtcbmltcG9ydCB7IHNjZW5lLCBjYW1lcmEgfSBmcm9tIFwiLi9qcy9zY2VuZS1jYW1lcmFcIjtcbmltcG9ydCB7IGNyZWF0ZVRldGF2aSB9IGZyb20gXCIuL2pzL3RldGF2aS1zZXR1cFwiO1xuaW1wb3J0IHsgY2FsbEFuaW1hdGlvbiB9IGZyb20gXCIuL2pzL3RocmVlLWFuaW1hdGVcIjtcblxuc2NlbmUuYWRkKGFtYmllbnQpO1xuc2NlbmUuYWRkKHNwb3RMaWdodCk7XG5cbmNvbnN0IHsgcmVuZGVyZXIgfSA9IGNyZWF0ZVJlbmRlcmVyKGNhbWVyYSk7XG5cbmNvbnN0IHRldGF2aSA9IGNyZWF0ZVRldGF2aShjYW1lcmEsIHJlbmRlcmVyKS50ZXRhdmk7XG5cbmNvbnN0IHsgYnV0dG9uLCBwb3NpdGlvbkJ0bkNvbnRhaW5lciwgcG9zaXRpb25CdG4sIHJvdGF0aW9uQnRuc0NvbnRhaW5lciB9ID0gY3JlYXRlQVJCdG4ocmVuZGVyZXIpO1xuXG5jb25zdCB7IHBpdm90IH0gPSBwbGF5VmlkZW8oYnV0dG9uLCB0ZXRhdmksIHNjZW5lKTtcblxuY2FsbEFuaW1hdGlvbihcblx0dGV0YXZpLFxuXHRzY2VuZSxcblx0Y2FtZXJhLFxuXHRwaXZvdCxcblx0cmVuZGVyZXIsXG5cdHBvc2l0aW9uQnRuQ29udGFpbmVyLFxuXHRwb3NpdGlvbkJ0bixcblx0cm90YXRpb25CdG5zQ29udGFpbmVyXG4pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9