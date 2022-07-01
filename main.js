/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/threeJS-object-controls/ObjectControls.js":
/*!****************************************************************!*\
  !*** ./node_modules/threeJS-object-controls/ObjectControls.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ObjectControls": () => (/* binding */ ObjectControls)
/* harmony export */ });
/* --------------------------------------------------------
ObjectControls
version: 1.2.8
author: Alberto Piras
email: a.piras.ict@gmail.com
github: https://github.com/albertopiras
license: MIT
description: module for ThreeJS that allows you to rotate an Object(mesh) independently from the rest of the scene, and to zoom in/out moving the camera; for desktop and mobile.
----------------------------------------------------------*/

/**
 * ObjectControls
 * @constructor
 * @param camera - reference to the camera.
 * @param domElement - reference to the renderer's dom element.
 * @param objectToMove - reference the object to control.
 */
function ObjectControls(camera, domElement, objectToMove) {
  /**
   * setObjectToMove
   * @description changes the object(s) to control
   * @param newMesh : one mesh or an array of meshes
   **/
  this.setObjectToMove = function (newMesh) {
    mesh = newMesh;
  };

  this.getObjectToMove = function() {
    return mesh;
  }

  /**
   * setZoomSpeed
   * @description sets a custom zoom speed (0.1 == slow  1 == fast)
   * @param newZoomSpeed
   **/
  this.setZoomSpeed = function (newZoomSpeed) {
    zoomSpeed = newZoomSpeed;
  };

  /**
   * setDistance
   * @description set the zoom range distance
   * @param {number} min
   * @param {number} max
   **/
  this.setDistance = function (min, max) {
    minDistance = min;
    maxDistance = max;
  };

  /**
   * setRotationSpeed
   * @param {number} newRotationSpeed - (1 == fast)  (0.01 == slow)
   **/
  this.setRotationSpeed = function (newRotationSpeed) {
    rotationSpeed = newRotationSpeed;
  };

  /**
   * setRotationSpeedTouchDevices
   * @param {number} newRotationSpeed - (1 == fast)  (0.01 == slow)
   **/
  this.setRotationSpeedTouchDevices = function (newRotationSpeed) {
    rotationSpeedTouchDevices = newRotationSpeed;
  };

  this.enableVerticalRotation = function () {
    verticalRotationEnabled = true;
  };

  this.disableVerticalRotation = function () {
    verticalRotationEnabled = false;
  };

  this.enableHorizontalRotation = function () {
    horizontalRotationEnabled = true;
  };

  this.disableHorizontalRotation = function () {
    horizontalRotationEnabled = false;
  };

  this.setMaxVerticalRotationAngle = function (min, max) {
    MAX_ROTATON_ANGLES.x.from = min;
    MAX_ROTATON_ANGLES.x.to = max;
    MAX_ROTATON_ANGLES.x.enabled = true;
  };

  this.setMaxHorizontalRotationAngle = function (min, max) {
    MAX_ROTATON_ANGLES.y.from = min;
    MAX_ROTATON_ANGLES.y.to = max;
    MAX_ROTATON_ANGLES.y.enabled = true;
  };

  this.disableMaxHorizontalAngleRotation = function () {
    MAX_ROTATON_ANGLES.y.enabled = false;
  };

  this.disableMaxVerticalAngleRotation = function () {
    MAX_ROTATON_ANGLES.x.enabled = false;
  };

  this.disableZoom = function () {
    zoomEnabled = false;
  };

  this.enableZoom = function () {
    zoomEnabled = true;
  };

  this.isUserInteractionActive = function(){
    return isDragging;
  }

  domElement = domElement !== undefined ? domElement : document;

  /********************* Private control variables *************************/

  const MAX_ROTATON_ANGLES = {
    x: {
      // Vertical from bottom to top.
      enabled: false,
      from: Math.PI / 8,
      to: Math.PI / 8,
    },
    y: {
      // Horizontal from left to right.
      enabled: false,
      from: Math.PI / 4,
      to: Math.PI / 4,
    },
  };

  let flag,
    mesh = objectToMove,
    maxDistance = 15,
    minDistance = 6,
    zoomSpeed = 0.5,
    rotationSpeed = 0.05,
    rotationSpeedTouchDevices = 0.05,
    isDragging = false,
    verticalRotationEnabled = false,
    horizontalRotationEnabled = true,
    zoomEnabled = true,
    mouseFlags = { MOUSEDOWN: 0, MOUSEMOVE: 1 },
    previousMousePosition = { x: 0, y: 0 },
    prevZoomDiff = { X: null, Y: null },
    /**
     * CurrentTouches
     * length 0 : no zoom
     * length 2 : is zoomming
     */
    currentTouches = [];

  /***************************** Private shared functions **********************/

  function zoomIn() {
    camera.position.z -= zoomSpeed;
  }

  function zoomOut() {
    camera.position.z += zoomSpeed;
  }

  function rotateVertical(deltaMove, mesh) {
    if (mesh.length > 1) {
      for (let i = 0; i < mesh.length; i++) {
        rotateVertical(deltaMove, mesh[i]);
      }
      return;
    }
    mesh.rotation.x += Math.sign(deltaMove.y) * rotationSpeed;
  }

  function rotateVerticalTouch(deltaMove, mesh) {
    if (mesh.length > 1) {
      for (let i = 0; i < mesh.length; i++) {
        rotateVerticalTouch(deltaMove, mesh[i]);
      }
      return;
    }
    mesh.rotation.x += Math.sign(deltaMove.y) * rotationSpeedTouchDevices;
  }

  function rotateHorizontal(deltaMove, mesh) {
    if (mesh.length > 1) {
      for (let i = 0; i < mesh.length; i++) {
        rotateHorizontal(deltaMove, mesh[i]);
      }
      return;
    }
    mesh.rotation.y += Math.sign(deltaMove.x) * rotationSpeed;
  }

  function rotateHorizontalTouch(deltaMove, mesh) {
    if (mesh.length > 1) {
      for (let i = 0; i < mesh.length; i++) {
        rotateHorizontalTouch(deltaMove, mesh[i]);
      }
      return;
    }
    mesh.rotation.y += Math.sign(deltaMove.x) * rotationSpeedTouchDevices;
  }

  /**
   * isWithinMaxAngle
   * @description Checks if the rotation in a specific axe is within the maximum
   * values allowed.
   * @param delta is the difference of the current rotation angle and the
   *     expected rotation angle
   * @param axe is the axe of rotation: x(vertical rotation), y (horizontal
   *     rotation)
   * @return true if the rotation with the new delta is included into the
   *     allowed angle range, false otherwise
   */
  function isWithinMaxAngle(delta, axe) {
    if (MAX_ROTATON_ANGLES[axe].enabled) {
      if (mesh.length > 1) {
        let condition = true;
        for (let i = 0; i < mesh.length; i++) {
          if (!condition) return false;
          if (MAX_ROTATON_ANGLES[axe].enabled) {
            condition = isRotationWithinMaxAngles(mesh[i], delta, axe);
          }
        }
        return condition;
      }
      return isRotationWithinMaxAngles(mesh, delta, axe);
    }
    return true;
  }

  function isRotationWithinMaxAngles(meshToRotate, delta, axe) {
    return MAX_ROTATON_ANGLES[axe].from * -1 <
      meshToRotate.rotation[axe] + delta &&
      meshToRotate.rotation[axe] + delta < MAX_ROTATON_ANGLES[axe].to
      ? true
      : false;
  }

  function resetMousePosition() {
    previousMousePosition = { x: 0, y: 0 };
  }

  /******************  MOUSE interaction functions - desktop  *****/
  function mouseDown(e) {
    isDragging = true;
    flag = mouseFlags.MOUSEDOWN;
  }

  function mouseMove(e) {
    if (isDragging) {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y,
      };

      previousMousePosition = { x: e.offsetX, y: e.offsetY };

      if (horizontalRotationEnabled && deltaMove.x != 0) {
        // && (Math.abs(deltaMove.x) > Math.abs(deltaMove.y))) {
        // enabling this, the mesh will rotate only in one specific direction
        // for mouse movement
        if (!isWithinMaxAngle(Math.sign(deltaMove.x) * rotationSpeed, "y"))
          return;
        rotateHorizontal(deltaMove, mesh);
        flag = mouseFlags.MOUSEMOVE;
      }

      if (verticalRotationEnabled && deltaMove.y != 0) {
        // &&(Math.abs(deltaMove.y) > Math.abs(deltaMove.x)) //
        // enabling this, the mesh will rotate only in one specific direction for
        // mouse movement
        if (!isWithinMaxAngle(Math.sign(deltaMove.y) * rotationSpeed, "x"))
          return;
        rotateVertical(deltaMove, mesh);
        flag = mouseFlags.MOUSEMOVE;
      }
    }
  }

  function mouseUp() {
    isDragging = false;
    resetMousePosition();
  }

  function wheel(e) {
    if (!zoomEnabled) return;
    const delta = e.wheelDelta ? e.wheelDelta : e.deltaY * -1;
    if (delta > 0 && camera.position.z > minDistance) {
      zoomIn();
    } else if (delta < 0 && camera.position.z < maxDistance) {
      zoomOut();
    }
  }
  /****************** TOUCH interaction functions - mobile  *****/

  function onTouchStart(e) {
    e.preventDefault();
    flag = mouseFlags.MOUSEDOWN;
    if (e.touches.length === 2) {
      prevZoomDiff.X = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
      prevZoomDiff.Y = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
      currentTouches = new Array(2);
    } else {
      previousMousePosition = { x: e.touches[0].pageX, y: e.touches[0].pageY };
    }
  }

  function onTouchEnd(e) {
    prevZoomDiff.X = null;
    prevZoomDiff.Y = null;

    /* If you were zooming out, currentTouches is updated for each finger you
     * leave up the screen so each time a finger leaves up the screen,
     * currentTouches length is decreased of a unit. When you leave up both 2
     * fingers, currentTouches.length is 0, this means the zoomming phase is
     * ended.
     */
    if (currentTouches.length > 0) {
      currentTouches.pop();
    } else {
      currentTouches = [];
    }
    e.preventDefault();
    if (flag === mouseFlags.MOUSEDOWN) {
      // TouchClick
      // You can invoke more other functions for animations and so on...
    } else if (flag === mouseFlags.MOUSEMOVE) {
      // Touch drag
      // You can invoke more other functions for animations and so on...
    }
    resetMousePosition();
  }

  function onTouchMove(e) {
    e.preventDefault();
    flag = mouseFlags.MOUSEMOVE;
    // Touch zoom.
    // If two pointers are down, check for pinch gestures.
    if (e.touches.length === 2 && zoomEnabled) {
      currentTouches = new Array(2);
      // Calculate the distance between the two pointers.
      const curDiffX = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
      const curDiffY = Math.abs(e.touches[0].clientY - e.touches[1].clientY);

      if (prevZoomDiff && prevZoomDiff.X > 0 && prevZoomDiff.Y > 0) {
        if (
          curDiffX > prevZoomDiff.X &&
          curDiffY > prevZoomDiff.Y &&
          camera.position.z > minDistance
        ) {
          zoomIn();
        } else if (
          curDiffX < prevZoomDiff.X &&
          camera.position.z < maxDistance &&
          curDiffY < prevZoomDiff.Y
        ) {
          zoomOut();
        }
      }
      // Cache the distance for the next move event.
      prevZoomDiff.X = curDiffX;
      prevZoomDiff.Y = curDiffY;

      // Touch Rotate.
    } else if (currentTouches.length === 0) {
      prevZoomDiff.X = null;
      prevZoomDiff.Y = null;
      const deltaMove = {
        x: e.touches[0].pageX - previousMousePosition.x,
        y: e.touches[0].pageY - previousMousePosition.y,
      };
      previousMousePosition = { x: e.touches[0].pageX, y: e.touches[0].pageY };

      if (horizontalRotationEnabled && deltaMove.x != 0) {
        if (
          !isWithinMaxAngle(
            Math.sign(deltaMove.x) * rotationSpeedTouchDevices,
            "y"
          )
        )
          return;
        rotateHorizontalTouch(deltaMove, mesh);
      }

      if (verticalRotationEnabled && deltaMove.y != 0) {
        if (
          !isWithinMaxAngle(
            Math.sign(deltaMove.y) * rotationSpeedTouchDevices,
            "x"
          )
        )
          return;
        rotateVerticalTouch(deltaMove, mesh);
      }
    }
  }

  /********************* Event Listeners *************************/

  /** Mouse Interaction Controls (rotate & zoom, desktop **/
  // Mouse - move
  domElement.addEventListener("mousedown", mouseDown, false);
  domElement.addEventListener("mousemove", mouseMove, false);
  domElement.addEventListener("mouseup", mouseUp, false);
  domElement.addEventListener("mouseout", mouseUp, false);

  // Mouse - zoom
  domElement.addEventListener("wheel", wheel, false);

  /** Touch Interaction Controls (rotate & zoom, mobile) **/
  // Touch - move
  domElement.addEventListener("touchstart", onTouchStart, false);
  domElement.addEventListener("touchmove", onTouchMove, false);
  domElement.addEventListener("touchend", onTouchEnd, false);
}




/***/ }),

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

	const controls = new TetaviExt.libOrbitControls(
		camera,
		renderer.domElement
	);
	controls.target.set(0, 1.5, 0);

	camera.position.z = 5;
	camera.position.y = 1.5;

	controls.update();

	console.log(controls);

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	window.addEventListener("resize", onWindowResize);

	return { renderer, controls };
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
const callAnimation = (tetavi, scene, camera, controls, renderer) => {
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

	controls.touches = {
		ONE: Tetavi.THREE.TOUCH.ROTATE,
		TWO: Tetavi.THREE.TOUCH.DOLLY_PAN,
	};

	console.log(Tetavi.THREE);

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

		controls.update();

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
/* harmony import */ var threeJS_object_controls__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! threeJS-object-controls */ "./node_modules/threeJS-object-controls/ObjectControls.js");









_js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.scene.add(_js_lights__WEBPACK_IMPORTED_MODULE_1__.ambient);
_js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.scene.add(_js_lights__WEBPACK_IMPORTED_MODULE_1__.spotLight);

const { renderer, controls } = (0,_js_renderer__WEBPACK_IMPORTED_MODULE_3__.createRenderer)(_js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.camera);

const tetavi = (0,_js_tetavi_setup__WEBPACK_IMPORTED_MODULE_5__.createTetavi)(_js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.camera, renderer).tetavi;

const enterBtn = (0,_js_ar_button__WEBPACK_IMPORTED_MODULE_0__.createARBtn)(renderer).button;

const { pivot } = (0,_js_play_stop__WEBPACK_IMPORTED_MODULE_2__.playVideo)(enterBtn, tetavi, _js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.scene);

(0,_js_three_animate__WEBPACK_IMPORTED_MODULE_6__.callAnimation)(tetavi, _js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.scene, _js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.camera, controls, renderer);

const objControls = new threeJS_object_controls__WEBPACK_IMPORTED_MODULE_7__.ObjectControls(_js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.camera, renderer.domElement, pivot);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEpBQTBKO0FBQzFKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsNEJBQTRCO0FBQy9DLDhCQUE4QixZQUFZO0FBQzFDLHFCQUFxQixrQkFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0IsaUJBQWlCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCLGlCQUFpQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixpQkFBaUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhCQUE4QjtBQUM5Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQ0FBZ0M7O0FBRWhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sZ0NBQWdDO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDOztBQUVoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUUwQjs7Ozs7Ozs7Ozs7Ozs7O0FDbmExQjtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0NBQWdDO0FBQ2hDOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOOztBQUVBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUMsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7O0FBRUY7O0FBRUEsVUFBVTtBQUNWOztBQUV1Qjs7Ozs7Ozs7Ozs7Ozs7OztBQzVMdkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRThCOzs7Ozs7Ozs7Ozs7Ozs7QUNWOUI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxVQUFVO0FBQ1Y7O0FBRXFCOzs7Ozs7Ozs7Ozs7Ozs7QUM1QnJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxVQUFVO0FBQ1Y7O0FBRTBCOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkMxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRXlCOzs7Ozs7Ozs7Ozs7Ozs7QUNUekI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxVQUFVO0FBQ1Y7O0FBRXdCOzs7Ozs7Ozs7Ozs7Ozs7QUNsQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRXlCOzs7Ozs7O1VDekZ6QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ042QztBQUNJO0FBQ047QUFDSTtBQUNHO0FBQ0Q7QUFDRTtBQUNNOztBQUV6RCx1REFBUyxDQUFDLCtDQUFPO0FBQ2pCLHVEQUFTLENBQUMsaURBQVM7O0FBRW5CLFFBQVEscUJBQXFCLEVBQUUsNERBQWMsQ0FBQyxvREFBTTs7QUFFcEQsZUFBZSw4REFBWSxDQUFDLG9EQUFNOztBQUVsQyxpQkFBaUIsMERBQVc7O0FBRTVCLFFBQVEsUUFBUSxFQUFFLHdEQUFTLG1CQUFtQixtREFBSzs7QUFFbkQsZ0VBQWEsU0FBUyxtREFBSyxFQUFFLG9EQUFNOztBQUVuQyx3QkFBd0IsbUVBQWMsQ0FBQyxvREFBTSIsInNvdXJjZXMiOlsid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL25vZGVfbW9kdWxlcy90aHJlZUpTLW9iamVjdC1jb250cm9scy9PYmplY3RDb250cm9scy5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvYXItYnV0dG9uLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy9saWdodHMuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL3BsYXktc3RvcC5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvcmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL3NjZW5lLWNhbWVyYS5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvdGV0YXZpLXNldHVwLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy90aHJlZS1hbmltYXRlLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuT2JqZWN0Q29udHJvbHNcbnZlcnNpb246IDEuMi44XG5hdXRob3I6IEFsYmVydG8gUGlyYXNcbmVtYWlsOiBhLnBpcmFzLmljdEBnbWFpbC5jb21cbmdpdGh1YjogaHR0cHM6Ly9naXRodWIuY29tL2FsYmVydG9waXJhc1xubGljZW5zZTogTUlUXG5kZXNjcmlwdGlvbjogbW9kdWxlIGZvciBUaHJlZUpTIHRoYXQgYWxsb3dzIHlvdSB0byByb3RhdGUgYW4gT2JqZWN0KG1lc2gpIGluZGVwZW5kZW50bHkgZnJvbSB0aGUgcmVzdCBvZiB0aGUgc2NlbmUsIGFuZCB0byB6b29tIGluL291dCBtb3ZpbmcgdGhlIGNhbWVyYTsgZm9yIGRlc2t0b3AgYW5kIG1vYmlsZS5cbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKipcbiAqIE9iamVjdENvbnRyb2xzXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSBjYW1lcmEgLSByZWZlcmVuY2UgdG8gdGhlIGNhbWVyYS5cbiAqIEBwYXJhbSBkb21FbGVtZW50IC0gcmVmZXJlbmNlIHRvIHRoZSByZW5kZXJlcidzIGRvbSBlbGVtZW50LlxuICogQHBhcmFtIG9iamVjdFRvTW92ZSAtIHJlZmVyZW5jZSB0aGUgb2JqZWN0IHRvIGNvbnRyb2wuXG4gKi9cbmZ1bmN0aW9uIE9iamVjdENvbnRyb2xzKGNhbWVyYSwgZG9tRWxlbWVudCwgb2JqZWN0VG9Nb3ZlKSB7XG4gIC8qKlxuICAgKiBzZXRPYmplY3RUb01vdmVcbiAgICogQGRlc2NyaXB0aW9uIGNoYW5nZXMgdGhlIG9iamVjdChzKSB0byBjb250cm9sXG4gICAqIEBwYXJhbSBuZXdNZXNoIDogb25lIG1lc2ggb3IgYW4gYXJyYXkgb2YgbWVzaGVzXG4gICAqKi9cbiAgdGhpcy5zZXRPYmplY3RUb01vdmUgPSBmdW5jdGlvbiAobmV3TWVzaCkge1xuICAgIG1lc2ggPSBuZXdNZXNoO1xuICB9O1xuXG4gIHRoaXMuZ2V0T2JqZWN0VG9Nb3ZlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG1lc2g7XG4gIH1cblxuICAvKipcbiAgICogc2V0Wm9vbVNwZWVkXG4gICAqIEBkZXNjcmlwdGlvbiBzZXRzIGEgY3VzdG9tIHpvb20gc3BlZWQgKDAuMSA9PSBzbG93ICAxID09IGZhc3QpXG4gICAqIEBwYXJhbSBuZXdab29tU3BlZWRcbiAgICoqL1xuICB0aGlzLnNldFpvb21TcGVlZCA9IGZ1bmN0aW9uIChuZXdab29tU3BlZWQpIHtcbiAgICB6b29tU3BlZWQgPSBuZXdab29tU3BlZWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIHNldERpc3RhbmNlXG4gICAqIEBkZXNjcmlwdGlvbiBzZXQgdGhlIHpvb20gcmFuZ2UgZGlzdGFuY2VcbiAgICogQHBhcmFtIHtudW1iZXJ9IG1pblxuICAgKiBAcGFyYW0ge251bWJlcn0gbWF4XG4gICAqKi9cbiAgdGhpcy5zZXREaXN0YW5jZSA9IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuICAgIG1pbkRpc3RhbmNlID0gbWluO1xuICAgIG1heERpc3RhbmNlID0gbWF4O1xuICB9O1xuXG4gIC8qKlxuICAgKiBzZXRSb3RhdGlvblNwZWVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdSb3RhdGlvblNwZWVkIC0gKDEgPT0gZmFzdCkgICgwLjAxID09IHNsb3cpXG4gICAqKi9cbiAgdGhpcy5zZXRSb3RhdGlvblNwZWVkID0gZnVuY3Rpb24gKG5ld1JvdGF0aW9uU3BlZWQpIHtcbiAgICByb3RhdGlvblNwZWVkID0gbmV3Um90YXRpb25TcGVlZDtcbiAgfTtcblxuICAvKipcbiAgICogc2V0Um90YXRpb25TcGVlZFRvdWNoRGV2aWNlc1xuICAgKiBAcGFyYW0ge251bWJlcn0gbmV3Um90YXRpb25TcGVlZCAtICgxID09IGZhc3QpICAoMC4wMSA9PSBzbG93KVxuICAgKiovXG4gIHRoaXMuc2V0Um90YXRpb25TcGVlZFRvdWNoRGV2aWNlcyA9IGZ1bmN0aW9uIChuZXdSb3RhdGlvblNwZWVkKSB7XG4gICAgcm90YXRpb25TcGVlZFRvdWNoRGV2aWNlcyA9IG5ld1JvdGF0aW9uU3BlZWQ7XG4gIH07XG5cbiAgdGhpcy5lbmFibGVWZXJ0aWNhbFJvdGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZlcnRpY2FsUm90YXRpb25FbmFibGVkID0gdHJ1ZTtcbiAgfTtcblxuICB0aGlzLmRpc2FibGVWZXJ0aWNhbFJvdGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZlcnRpY2FsUm90YXRpb25FbmFibGVkID0gZmFsc2U7XG4gIH07XG5cbiAgdGhpcy5lbmFibGVIb3Jpem9udGFsUm90YXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgaG9yaXpvbnRhbFJvdGF0aW9uRW5hYmxlZCA9IHRydWU7XG4gIH07XG5cbiAgdGhpcy5kaXNhYmxlSG9yaXpvbnRhbFJvdGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGhvcml6b250YWxSb3RhdGlvbkVuYWJsZWQgPSBmYWxzZTtcbiAgfTtcblxuICB0aGlzLnNldE1heFZlcnRpY2FsUm90YXRpb25BbmdsZSA9IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuICAgIE1BWF9ST1RBVE9OX0FOR0xFUy54LmZyb20gPSBtaW47XG4gICAgTUFYX1JPVEFUT05fQU5HTEVTLngudG8gPSBtYXg7XG4gICAgTUFYX1JPVEFUT05fQU5HTEVTLnguZW5hYmxlZCA9IHRydWU7XG4gIH07XG5cbiAgdGhpcy5zZXRNYXhIb3Jpem9udGFsUm90YXRpb25BbmdsZSA9IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuICAgIE1BWF9ST1RBVE9OX0FOR0xFUy55LmZyb20gPSBtaW47XG4gICAgTUFYX1JPVEFUT05fQU5HTEVTLnkudG8gPSBtYXg7XG4gICAgTUFYX1JPVEFUT05fQU5HTEVTLnkuZW5hYmxlZCA9IHRydWU7XG4gIH07XG5cbiAgdGhpcy5kaXNhYmxlTWF4SG9yaXpvbnRhbEFuZ2xlUm90YXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgTUFYX1JPVEFUT05fQU5HTEVTLnkuZW5hYmxlZCA9IGZhbHNlO1xuICB9O1xuXG4gIHRoaXMuZGlzYWJsZU1heFZlcnRpY2FsQW5nbGVSb3RhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBNQVhfUk9UQVRPTl9BTkdMRVMueC5lbmFibGVkID0gZmFsc2U7XG4gIH07XG5cbiAgdGhpcy5kaXNhYmxlWm9vbSA9IGZ1bmN0aW9uICgpIHtcbiAgICB6b29tRW5hYmxlZCA9IGZhbHNlO1xuICB9O1xuXG4gIHRoaXMuZW5hYmxlWm9vbSA9IGZ1bmN0aW9uICgpIHtcbiAgICB6b29tRW5hYmxlZCA9IHRydWU7XG4gIH07XG5cbiAgdGhpcy5pc1VzZXJJbnRlcmFjdGlvbkFjdGl2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIGlzRHJhZ2dpbmc7XG4gIH1cblxuICBkb21FbGVtZW50ID0gZG9tRWxlbWVudCAhPT0gdW5kZWZpbmVkID8gZG9tRWxlbWVudCA6IGRvY3VtZW50O1xuXG4gIC8qKioqKioqKioqKioqKioqKioqKiogUHJpdmF0ZSBjb250cm9sIHZhcmlhYmxlcyAqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gIGNvbnN0IE1BWF9ST1RBVE9OX0FOR0xFUyA9IHtcbiAgICB4OiB7XG4gICAgICAvLyBWZXJ0aWNhbCBmcm9tIGJvdHRvbSB0byB0b3AuXG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIGZyb206IE1hdGguUEkgLyA4LFxuICAgICAgdG86IE1hdGguUEkgLyA4LFxuICAgIH0sXG4gICAgeToge1xuICAgICAgLy8gSG9yaXpvbnRhbCBmcm9tIGxlZnQgdG8gcmlnaHQuXG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIGZyb206IE1hdGguUEkgLyA0LFxuICAgICAgdG86IE1hdGguUEkgLyA0LFxuICAgIH0sXG4gIH07XG5cbiAgbGV0IGZsYWcsXG4gICAgbWVzaCA9IG9iamVjdFRvTW92ZSxcbiAgICBtYXhEaXN0YW5jZSA9IDE1LFxuICAgIG1pbkRpc3RhbmNlID0gNixcbiAgICB6b29tU3BlZWQgPSAwLjUsXG4gICAgcm90YXRpb25TcGVlZCA9IDAuMDUsXG4gICAgcm90YXRpb25TcGVlZFRvdWNoRGV2aWNlcyA9IDAuMDUsXG4gICAgaXNEcmFnZ2luZyA9IGZhbHNlLFxuICAgIHZlcnRpY2FsUm90YXRpb25FbmFibGVkID0gZmFsc2UsXG4gICAgaG9yaXpvbnRhbFJvdGF0aW9uRW5hYmxlZCA9IHRydWUsXG4gICAgem9vbUVuYWJsZWQgPSB0cnVlLFxuICAgIG1vdXNlRmxhZ3MgPSB7IE1PVVNFRE9XTjogMCwgTU9VU0VNT1ZFOiAxIH0sXG4gICAgcHJldmlvdXNNb3VzZVBvc2l0aW9uID0geyB4OiAwLCB5OiAwIH0sXG4gICAgcHJldlpvb21EaWZmID0geyBYOiBudWxsLCBZOiBudWxsIH0sXG4gICAgLyoqXG4gICAgICogQ3VycmVudFRvdWNoZXNcbiAgICAgKiBsZW5ndGggMCA6IG5vIHpvb21cbiAgICAgKiBsZW5ndGggMiA6IGlzIHpvb21taW5nXG4gICAgICovXG4gICAgY3VycmVudFRvdWNoZXMgPSBbXTtcblxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogUHJpdmF0ZSBzaGFyZWQgZnVuY3Rpb25zICoqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgZnVuY3Rpb24gem9vbUluKCkge1xuICAgIGNhbWVyYS5wb3NpdGlvbi56IC09IHpvb21TcGVlZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHpvb21PdXQoKSB7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnogKz0gem9vbVNwZWVkO1xuICB9XG5cbiAgZnVuY3Rpb24gcm90YXRlVmVydGljYWwoZGVsdGFNb3ZlLCBtZXNoKSB7XG4gICAgaWYgKG1lc2gubGVuZ3RoID4gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvdGF0ZVZlcnRpY2FsKGRlbHRhTW92ZSwgbWVzaFtpXSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1lc2gucm90YXRpb24ueCArPSBNYXRoLnNpZ24oZGVsdGFNb3ZlLnkpICogcm90YXRpb25TcGVlZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJvdGF0ZVZlcnRpY2FsVG91Y2goZGVsdGFNb3ZlLCBtZXNoKSB7XG4gICAgaWYgKG1lc2gubGVuZ3RoID4gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvdGF0ZVZlcnRpY2FsVG91Y2goZGVsdGFNb3ZlLCBtZXNoW2ldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbWVzaC5yb3RhdGlvbi54ICs9IE1hdGguc2lnbihkZWx0YU1vdmUueSkgKiByb3RhdGlvblNwZWVkVG91Y2hEZXZpY2VzO1xuICB9XG5cbiAgZnVuY3Rpb24gcm90YXRlSG9yaXpvbnRhbChkZWx0YU1vdmUsIG1lc2gpIHtcbiAgICBpZiAobWVzaC5sZW5ndGggPiAxKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc2gubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm90YXRlSG9yaXpvbnRhbChkZWx0YU1vdmUsIG1lc2hbaV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtZXNoLnJvdGF0aW9uLnkgKz0gTWF0aC5zaWduKGRlbHRhTW92ZS54KSAqIHJvdGF0aW9uU3BlZWQ7XG4gIH1cblxuICBmdW5jdGlvbiByb3RhdGVIb3Jpem9udGFsVG91Y2goZGVsdGFNb3ZlLCBtZXNoKSB7XG4gICAgaWYgKG1lc2gubGVuZ3RoID4gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvdGF0ZUhvcml6b250YWxUb3VjaChkZWx0YU1vdmUsIG1lc2hbaV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtZXNoLnJvdGF0aW9uLnkgKz0gTWF0aC5zaWduKGRlbHRhTW92ZS54KSAqIHJvdGF0aW9uU3BlZWRUb3VjaERldmljZXM7XG4gIH1cblxuICAvKipcbiAgICogaXNXaXRoaW5NYXhBbmdsZVxuICAgKiBAZGVzY3JpcHRpb24gQ2hlY2tzIGlmIHRoZSByb3RhdGlvbiBpbiBhIHNwZWNpZmljIGF4ZSBpcyB3aXRoaW4gdGhlIG1heGltdW1cbiAgICogdmFsdWVzIGFsbG93ZWQuXG4gICAqIEBwYXJhbSBkZWx0YSBpcyB0aGUgZGlmZmVyZW5jZSBvZiB0aGUgY3VycmVudCByb3RhdGlvbiBhbmdsZSBhbmQgdGhlXG4gICAqICAgICBleHBlY3RlZCByb3RhdGlvbiBhbmdsZVxuICAgKiBAcGFyYW0gYXhlIGlzIHRoZSBheGUgb2Ygcm90YXRpb246IHgodmVydGljYWwgcm90YXRpb24pLCB5IChob3Jpem9udGFsXG4gICAqICAgICByb3RhdGlvbilcbiAgICogQHJldHVybiB0cnVlIGlmIHRoZSByb3RhdGlvbiB3aXRoIHRoZSBuZXcgZGVsdGEgaXMgaW5jbHVkZWQgaW50byB0aGVcbiAgICogICAgIGFsbG93ZWQgYW5nbGUgcmFuZ2UsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNXaXRoaW5NYXhBbmdsZShkZWx0YSwgYXhlKSB7XG4gICAgaWYgKE1BWF9ST1RBVE9OX0FOR0xFU1theGVdLmVuYWJsZWQpIHtcbiAgICAgIGlmIChtZXNoLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbGV0IGNvbmRpdGlvbiA9IHRydWU7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVzaC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICghY29uZGl0aW9uKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgaWYgKE1BWF9ST1RBVE9OX0FOR0xFU1theGVdLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIGNvbmRpdGlvbiA9IGlzUm90YXRpb25XaXRoaW5NYXhBbmdsZXMobWVzaFtpXSwgZGVsdGEsIGF4ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb25kaXRpb247XG4gICAgICB9XG4gICAgICByZXR1cm4gaXNSb3RhdGlvbldpdGhpbk1heEFuZ2xlcyhtZXNoLCBkZWx0YSwgYXhlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBpc1JvdGF0aW9uV2l0aGluTWF4QW5nbGVzKG1lc2hUb1JvdGF0ZSwgZGVsdGEsIGF4ZSkge1xuICAgIHJldHVybiBNQVhfUk9UQVRPTl9BTkdMRVNbYXhlXS5mcm9tICogLTEgPFxuICAgICAgbWVzaFRvUm90YXRlLnJvdGF0aW9uW2F4ZV0gKyBkZWx0YSAmJlxuICAgICAgbWVzaFRvUm90YXRlLnJvdGF0aW9uW2F4ZV0gKyBkZWx0YSA8IE1BWF9ST1RBVE9OX0FOR0xFU1theGVdLnRvXG4gICAgICA/IHRydWVcbiAgICAgIDogZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldE1vdXNlUG9zaXRpb24oKSB7XG4gICAgcHJldmlvdXNNb3VzZVBvc2l0aW9uID0geyB4OiAwLCB5OiAwIH07XG4gIH1cblxuICAvKioqKioqKioqKioqKioqKioqICBNT1VTRSBpbnRlcmFjdGlvbiBmdW5jdGlvbnMgLSBkZXNrdG9wICAqKioqKi9cbiAgZnVuY3Rpb24gbW91c2VEb3duKGUpIHtcbiAgICBpc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICBmbGFnID0gbW91c2VGbGFncy5NT1VTRURPV047XG4gIH1cblxuICBmdW5jdGlvbiBtb3VzZU1vdmUoZSkge1xuICAgIGlmIChpc0RyYWdnaW5nKSB7XG4gICAgICBjb25zdCBkZWx0YU1vdmUgPSB7XG4gICAgICAgIHg6IGUub2Zmc2V0WCAtIHByZXZpb3VzTW91c2VQb3NpdGlvbi54LFxuICAgICAgICB5OiBlLm9mZnNldFkgLSBwcmV2aW91c01vdXNlUG9zaXRpb24ueSxcbiAgICAgIH07XG5cbiAgICAgIHByZXZpb3VzTW91c2VQb3NpdGlvbiA9IHsgeDogZS5vZmZzZXRYLCB5OiBlLm9mZnNldFkgfTtcblxuICAgICAgaWYgKGhvcml6b250YWxSb3RhdGlvbkVuYWJsZWQgJiYgZGVsdGFNb3ZlLnggIT0gMCkge1xuICAgICAgICAvLyAmJiAoTWF0aC5hYnMoZGVsdGFNb3ZlLngpID4gTWF0aC5hYnMoZGVsdGFNb3ZlLnkpKSkge1xuICAgICAgICAvLyBlbmFibGluZyB0aGlzLCB0aGUgbWVzaCB3aWxsIHJvdGF0ZSBvbmx5IGluIG9uZSBzcGVjaWZpYyBkaXJlY3Rpb25cbiAgICAgICAgLy8gZm9yIG1vdXNlIG1vdmVtZW50XG4gICAgICAgIGlmICghaXNXaXRoaW5NYXhBbmdsZShNYXRoLnNpZ24oZGVsdGFNb3ZlLngpICogcm90YXRpb25TcGVlZCwgXCJ5XCIpKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcm90YXRlSG9yaXpvbnRhbChkZWx0YU1vdmUsIG1lc2gpO1xuICAgICAgICBmbGFnID0gbW91c2VGbGFncy5NT1VTRU1PVkU7XG4gICAgICB9XG5cbiAgICAgIGlmICh2ZXJ0aWNhbFJvdGF0aW9uRW5hYmxlZCAmJiBkZWx0YU1vdmUueSAhPSAwKSB7XG4gICAgICAgIC8vICYmKE1hdGguYWJzKGRlbHRhTW92ZS55KSA+IE1hdGguYWJzKGRlbHRhTW92ZS54KSkgLy9cbiAgICAgICAgLy8gZW5hYmxpbmcgdGhpcywgdGhlIG1lc2ggd2lsbCByb3RhdGUgb25seSBpbiBvbmUgc3BlY2lmaWMgZGlyZWN0aW9uIGZvclxuICAgICAgICAvLyBtb3VzZSBtb3ZlbWVudFxuICAgICAgICBpZiAoIWlzV2l0aGluTWF4QW5nbGUoTWF0aC5zaWduKGRlbHRhTW92ZS55KSAqIHJvdGF0aW9uU3BlZWQsIFwieFwiKSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIHJvdGF0ZVZlcnRpY2FsKGRlbHRhTW92ZSwgbWVzaCk7XG4gICAgICAgIGZsYWcgPSBtb3VzZUZsYWdzLk1PVVNFTU9WRTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtb3VzZVVwKCkge1xuICAgIGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICByZXNldE1vdXNlUG9zaXRpb24oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdoZWVsKGUpIHtcbiAgICBpZiAoIXpvb21FbmFibGVkKSByZXR1cm47XG4gICAgY29uc3QgZGVsdGEgPSBlLndoZWVsRGVsdGEgPyBlLndoZWVsRGVsdGEgOiBlLmRlbHRhWSAqIC0xO1xuICAgIGlmIChkZWx0YSA+IDAgJiYgY2FtZXJhLnBvc2l0aW9uLnogPiBtaW5EaXN0YW5jZSkge1xuICAgICAgem9vbUluKCk7XG4gICAgfSBlbHNlIGlmIChkZWx0YSA8IDAgJiYgY2FtZXJhLnBvc2l0aW9uLnogPCBtYXhEaXN0YW5jZSkge1xuICAgICAgem9vbU91dCgpO1xuICAgIH1cbiAgfVxuICAvKioqKioqKioqKioqKioqKioqIFRPVUNIIGludGVyYWN0aW9uIGZ1bmN0aW9ucyAtIG1vYmlsZSAgKioqKiovXG5cbiAgZnVuY3Rpb24gb25Ub3VjaFN0YXJ0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZmxhZyA9IG1vdXNlRmxhZ3MuTU9VU0VET1dOO1xuICAgIGlmIChlLnRvdWNoZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICBwcmV2Wm9vbURpZmYuWCA9IE1hdGguYWJzKGUudG91Y2hlc1swXS5jbGllbnRYIC0gZS50b3VjaGVzWzFdLmNsaWVudFgpO1xuICAgICAgcHJldlpvb21EaWZmLlkgPSBNYXRoLmFicyhlLnRvdWNoZXNbMF0uY2xpZW50WSAtIGUudG91Y2hlc1sxXS5jbGllbnRZKTtcbiAgICAgIGN1cnJlbnRUb3VjaGVzID0gbmV3IEFycmF5KDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmV2aW91c01vdXNlUG9zaXRpb24gPSB7IHg6IGUudG91Y2hlc1swXS5wYWdlWCwgeTogZS50b3VjaGVzWzBdLnBhZ2VZIH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25Ub3VjaEVuZChlKSB7XG4gICAgcHJldlpvb21EaWZmLlggPSBudWxsO1xuICAgIHByZXZab29tRGlmZi5ZID0gbnVsbDtcblxuICAgIC8qIElmIHlvdSB3ZXJlIHpvb21pbmcgb3V0LCBjdXJyZW50VG91Y2hlcyBpcyB1cGRhdGVkIGZvciBlYWNoIGZpbmdlciB5b3VcbiAgICAgKiBsZWF2ZSB1cCB0aGUgc2NyZWVuIHNvIGVhY2ggdGltZSBhIGZpbmdlciBsZWF2ZXMgdXAgdGhlIHNjcmVlbixcbiAgICAgKiBjdXJyZW50VG91Y2hlcyBsZW5ndGggaXMgZGVjcmVhc2VkIG9mIGEgdW5pdC4gV2hlbiB5b3UgbGVhdmUgdXAgYm90aCAyXG4gICAgICogZmluZ2VycywgY3VycmVudFRvdWNoZXMubGVuZ3RoIGlzIDAsIHRoaXMgbWVhbnMgdGhlIHpvb21taW5nIHBoYXNlIGlzXG4gICAgICogZW5kZWQuXG4gICAgICovXG4gICAgaWYgKGN1cnJlbnRUb3VjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGN1cnJlbnRUb3VjaGVzLnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50VG91Y2hlcyA9IFtdO1xuICAgIH1cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKGZsYWcgPT09IG1vdXNlRmxhZ3MuTU9VU0VET1dOKSB7XG4gICAgICAvLyBUb3VjaENsaWNrXG4gICAgICAvLyBZb3UgY2FuIGludm9rZSBtb3JlIG90aGVyIGZ1bmN0aW9ucyBmb3IgYW5pbWF0aW9ucyBhbmQgc28gb24uLi5cbiAgICB9IGVsc2UgaWYgKGZsYWcgPT09IG1vdXNlRmxhZ3MuTU9VU0VNT1ZFKSB7XG4gICAgICAvLyBUb3VjaCBkcmFnXG4gICAgICAvLyBZb3UgY2FuIGludm9rZSBtb3JlIG90aGVyIGZ1bmN0aW9ucyBmb3IgYW5pbWF0aW9ucyBhbmQgc28gb24uLi5cbiAgICB9XG4gICAgcmVzZXRNb3VzZVBvc2l0aW9uKCk7XG4gIH1cblxuICBmdW5jdGlvbiBvblRvdWNoTW92ZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGZsYWcgPSBtb3VzZUZsYWdzLk1PVVNFTU9WRTtcbiAgICAvLyBUb3VjaCB6b29tLlxuICAgIC8vIElmIHR3byBwb2ludGVycyBhcmUgZG93biwgY2hlY2sgZm9yIHBpbmNoIGdlc3R1cmVzLlxuICAgIGlmIChlLnRvdWNoZXMubGVuZ3RoID09PSAyICYmIHpvb21FbmFibGVkKSB7XG4gICAgICBjdXJyZW50VG91Y2hlcyA9IG5ldyBBcnJheSgyKTtcbiAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgdHdvIHBvaW50ZXJzLlxuICAgICAgY29uc3QgY3VyRGlmZlggPSBNYXRoLmFicyhlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGUudG91Y2hlc1sxXS5jbGllbnRYKTtcbiAgICAgIGNvbnN0IGN1ckRpZmZZID0gTWF0aC5hYnMoZS50b3VjaGVzWzBdLmNsaWVudFkgLSBlLnRvdWNoZXNbMV0uY2xpZW50WSk7XG5cbiAgICAgIGlmIChwcmV2Wm9vbURpZmYgJiYgcHJldlpvb21EaWZmLlggPiAwICYmIHByZXZab29tRGlmZi5ZID4gMCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgY3VyRGlmZlggPiBwcmV2Wm9vbURpZmYuWCAmJlxuICAgICAgICAgIGN1ckRpZmZZID4gcHJldlpvb21EaWZmLlkgJiZcbiAgICAgICAgICBjYW1lcmEucG9zaXRpb24ueiA+IG1pbkRpc3RhbmNlXG4gICAgICAgICkge1xuICAgICAgICAgIHpvb21JbigpO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIGN1ckRpZmZYIDwgcHJldlpvb21EaWZmLlggJiZcbiAgICAgICAgICBjYW1lcmEucG9zaXRpb24ueiA8IG1heERpc3RhbmNlICYmXG4gICAgICAgICAgY3VyRGlmZlkgPCBwcmV2Wm9vbURpZmYuWVxuICAgICAgICApIHtcbiAgICAgICAgICB6b29tT3V0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIENhY2hlIHRoZSBkaXN0YW5jZSBmb3IgdGhlIG5leHQgbW92ZSBldmVudC5cbiAgICAgIHByZXZab29tRGlmZi5YID0gY3VyRGlmZlg7XG4gICAgICBwcmV2Wm9vbURpZmYuWSA9IGN1ckRpZmZZO1xuXG4gICAgICAvLyBUb3VjaCBSb3RhdGUuXG4gICAgfSBlbHNlIGlmIChjdXJyZW50VG91Y2hlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHByZXZab29tRGlmZi5YID0gbnVsbDtcbiAgICAgIHByZXZab29tRGlmZi5ZID0gbnVsbDtcbiAgICAgIGNvbnN0IGRlbHRhTW92ZSA9IHtcbiAgICAgICAgeDogZS50b3VjaGVzWzBdLnBhZ2VYIC0gcHJldmlvdXNNb3VzZVBvc2l0aW9uLngsXG4gICAgICAgIHk6IGUudG91Y2hlc1swXS5wYWdlWSAtIHByZXZpb3VzTW91c2VQb3NpdGlvbi55LFxuICAgICAgfTtcbiAgICAgIHByZXZpb3VzTW91c2VQb3NpdGlvbiA9IHsgeDogZS50b3VjaGVzWzBdLnBhZ2VYLCB5OiBlLnRvdWNoZXNbMF0ucGFnZVkgfTtcblxuICAgICAgaWYgKGhvcml6b250YWxSb3RhdGlvbkVuYWJsZWQgJiYgZGVsdGFNb3ZlLnggIT0gMCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIWlzV2l0aGluTWF4QW5nbGUoXG4gICAgICAgICAgICBNYXRoLnNpZ24oZGVsdGFNb3ZlLngpICogcm90YXRpb25TcGVlZFRvdWNoRGV2aWNlcyxcbiAgICAgICAgICAgIFwieVwiXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICByb3RhdGVIb3Jpem9udGFsVG91Y2goZGVsdGFNb3ZlLCBtZXNoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZlcnRpY2FsUm90YXRpb25FbmFibGVkICYmIGRlbHRhTW92ZS55ICE9IDApIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICFpc1dpdGhpbk1heEFuZ2xlKFxuICAgICAgICAgICAgTWF0aC5zaWduKGRlbHRhTW92ZS55KSAqIHJvdGF0aW9uU3BlZWRUb3VjaERldmljZXMsXG4gICAgICAgICAgICBcInhcIlxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcm90YXRlVmVydGljYWxUb3VjaChkZWx0YU1vdmUsIG1lc2gpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKioqKioqKioqKioqKioqKioqKiogRXZlbnQgTGlzdGVuZXJzICoqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgLyoqIE1vdXNlIEludGVyYWN0aW9uIENvbnRyb2xzIChyb3RhdGUgJiB6b29tLCBkZXNrdG9wICoqL1xuICAvLyBNb3VzZSAtIG1vdmVcbiAgZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlRG93biwgZmFsc2UpO1xuICBkb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW91c2VNb3ZlLCBmYWxzZSk7XG4gIGRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgbW91c2VVcCwgZmFsc2UpO1xuICBkb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCBtb3VzZVVwLCBmYWxzZSk7XG5cbiAgLy8gTW91c2UgLSB6b29tXG4gIGRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIndoZWVsXCIsIHdoZWVsLCBmYWxzZSk7XG5cbiAgLyoqIFRvdWNoIEludGVyYWN0aW9uIENvbnRyb2xzIChyb3RhdGUgJiB6b29tLCBtb2JpbGUpICoqL1xuICAvLyBUb3VjaCAtIG1vdmVcbiAgZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBvblRvdWNoU3RhcnQsIGZhbHNlKTtcbiAgZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIG9uVG91Y2hNb3ZlLCBmYWxzZSk7XG4gIGRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIG9uVG91Y2hFbmQsIGZhbHNlKTtcbn1cblxuZXhwb3J0IHsgT2JqZWN0Q29udHJvbHMgfTtcbiIsImNvbnN0IGNyZWF0ZUFSQnRuID0gKHJlbmRlcmVyKSA9PiB7XG5cdGNsYXNzIEFSQnV0dG9uIHtcblx0XHRzdGF0aWMgY3JlYXRlQnV0dG9uKHJlbmRlcmVyLCBzZXNzaW9uSW5pdCA9IHt9KSB7XG5cdFx0XHRjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXG5cdFx0XHRmdW5jdGlvbiBzaG93U3RhcnRBUigvKmRldmljZSovKSB7XG5cdFx0XHRcdGlmIChzZXNzaW9uSW5pdC5kb21PdmVybGF5ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdFx0XHRvdmVybGF5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblx0XHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJsYXkpO1xuXG5cdFx0XHRcdFx0Y29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuXHRcdFx0XHRcdFx0XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuXHRcdFx0XHRcdFx0XCJzdmdcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0c3ZnLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIDM4KTtcblx0XHRcdFx0XHRzdmcuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIDM4KTtcblx0XHRcdFx0XHRzdmcuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cdFx0XHRcdFx0c3ZnLnN0eWxlLnJpZ2h0ID0gXCIyMHB4XCI7XG5cdFx0XHRcdFx0c3ZnLnN0eWxlLnRvcCA9IFwiMjBweFwiO1xuXHRcdFx0XHRcdHN2Zy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0Y3VycmVudFNlc3Npb24uZW5kKCk7XG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b3ZlcmxheS5hcHBlbmRDaGlsZChzdmcpO1xuXG5cdFx0XHRcdFx0Y29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcblx0XHRcdFx0XHRcdFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcblx0XHRcdFx0XHRcdFwicGF0aFwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJNIDEyLDEyIEwgMjgsMjggTSAyOCwxMiAxMiwyOFwiKTtcblx0XHRcdFx0XHRwYXRoLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBcIiNmZmZcIik7XG5cdFx0XHRcdFx0cGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgMik7XG5cdFx0XHRcdFx0c3ZnLmFwcGVuZENoaWxkKHBhdGgpO1xuXG5cdFx0XHRcdFx0aWYgKHNlc3Npb25Jbml0Lm9wdGlvbmFsRmVhdHVyZXMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0c2Vzc2lvbkluaXQub3B0aW9uYWxGZWF0dXJlcyA9IFtdO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHNlc3Npb25Jbml0Lm9wdGlvbmFsRmVhdHVyZXMucHVzaChcImRvbS1vdmVybGF5XCIpO1xuXHRcdFx0XHRcdHNlc3Npb25Jbml0LmRvbU92ZXJsYXkgPSB7IHJvb3Q6IG92ZXJsYXkgfTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vXG5cblx0XHRcdFx0bGV0IGN1cnJlbnRTZXNzaW9uID0gbnVsbDtcblxuXHRcdFx0XHRhc3luYyBmdW5jdGlvbiBvblNlc3Npb25TdGFydGVkKHNlc3Npb24pIHtcblx0XHRcdFx0XHRzZXNzaW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJlbmRcIiwgb25TZXNzaW9uRW5kZWQpO1xuXG5cdFx0XHRcdFx0cmVuZGVyZXIueHIuc2V0UmVmZXJlbmNlU3BhY2VUeXBlKFwibG9jYWxcIik7XG5cblx0XHRcdFx0XHRhd2FpdCByZW5kZXJlci54ci5zZXRTZXNzaW9uKHNlc3Npb24pO1xuXG5cdFx0XHRcdFx0YnV0dG9uLnRleHRDb250ZW50ID0gXCJTVE9QIEFSXCI7XG5cdFx0XHRcdFx0c2Vzc2lvbkluaXQuZG9tT3ZlcmxheS5yb290LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuXG5cdFx0XHRcdFx0Y3VycmVudFNlc3Npb24gPSBzZXNzaW9uO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZnVuY3Rpb24gb25TZXNzaW9uRW5kZWQoLypldmVudCovKSB7XG5cdFx0XHRcdFx0Y3VycmVudFNlc3Npb24ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImVuZFwiLCBvblNlc3Npb25FbmRlZCk7XG5cblx0XHRcdFx0XHRidXR0b24udGV4dENvbnRlbnQgPSBcIlNUQVJUIEFSXCI7XG5cdFx0XHRcdFx0c2Vzc2lvbkluaXQuZG9tT3ZlcmxheS5yb290LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuXHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uID0gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblxuXHRcdFx0XHRidXR0b24uc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5sZWZ0ID0gXCJjYWxjKDUwJSAtIDUwcHgpXCI7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuXG5cdFx0XHRcdGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU1RBUlQgQVJcIjtcblxuXHRcdFx0XHRidXR0b24ub25tb3VzZWVudGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGJ1dHRvbi5zdHlsZS5vcGFjaXR5ID0gXCIxLjBcIjtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRidXR0b24ub25tb3VzZWxlYXZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGJ1dHRvbi5zdHlsZS5vcGFjaXR5ID0gXCIwLjhcIjtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRidXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAoY3VycmVudFNlc3Npb24gPT09IG51bGwpIHtcblx0XHRcdFx0XHRcdG5hdmlnYXRvci54clxuXHRcdFx0XHRcdFx0XHQucmVxdWVzdFNlc3Npb24oXCJpbW1lcnNpdmUtYXJcIiwgc2Vzc2lvbkluaXQpXG5cdFx0XHRcdFx0XHRcdC50aGVuKG9uU2Vzc2lvblN0YXJ0ZWQpO1xuXHRcdFx0XHRcdFx0YnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50U2Vzc2lvbi5lbmQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGRpc2FibGVCdXR0b24oKSB7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblxuXHRcdFx0XHRidXR0b24uc3R5bGUuY3Vyc29yID0gXCJhdXRvXCI7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5sZWZ0ID0gXCJjYWxjKDUwJSAtIDc1cHgpXCI7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS53aWR0aCA9IFwiMTUwcHhcIjtcblxuXHRcdFx0XHRidXR0b24ub25tb3VzZWVudGVyID0gbnVsbDtcblx0XHRcdFx0YnV0dG9uLm9ubW91c2VsZWF2ZSA9IG51bGw7XG5cblx0XHRcdFx0YnV0dG9uLm9uY2xpY2sgPSBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBzaG93QVJOb3RTdXBwb3J0ZWQoKSB7XG5cdFx0XHRcdGRpc2FibGVCdXR0b24oKTtcblxuXHRcdFx0XHRidXR0b24udGV4dENvbnRlbnQgPSBcIkFSIE5PVCBTVVBQT1JURURcIjtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gc2hvd0FSTm90QWxsb3dlZChleGNlcHRpb24pIHtcblx0XHRcdFx0ZGlzYWJsZUJ1dHRvbigpO1xuXG5cdFx0XHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFx0XHRcIkV4Y2VwdGlvbiB3aGVuIHRyeWluZyB0byBjYWxsIHhyLmlzU2Vzc2lvblN1cHBvcnRlZFwiLFxuXHRcdFx0XHRcdGV4Y2VwdGlvblxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiQVIgTk9UIEFMTE9XRURcIjtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gc3R5bGl6ZUVsZW1lbnQoZWxlbWVudCkge1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLnBhZGRpbmcgPSBcIjFlbSAwLjJlbVwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkICNmZmZcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjE1cHhcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjZDlhZjJiXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuY29sb3IgPSBcIiNmZmZcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5mb250ID0gXCJub3JtYWwgMy41ZW0gc2Fucy1zZXJpZlwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLm91dGxpbmUgPSBcIm5vbmVcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjk5OVwiO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoXCJ4clwiIGluIG5hdmlnYXRvcikge1xuXHRcdFx0XHRidXR0b24uaWQgPSBcIkFSQnV0dG9uXCI7XG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cblx0XHRcdFx0c3R5bGl6ZUVsZW1lbnQoYnV0dG9uKTtcblxuXHRcdFx0XHRuYXZpZ2F0b3IueHJcblx0XHRcdFx0XHQuaXNTZXNzaW9uU3VwcG9ydGVkKFwiaW1tZXJzaXZlLWFyXCIpXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHN1cHBvcnRlZCkge1xuXHRcdFx0XHRcdFx0c3VwcG9ydGVkID8gc2hvd1N0YXJ0QVIoKSA6IHNob3dBUk5vdFN1cHBvcnRlZCgpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKHNob3dBUk5vdEFsbG93ZWQpO1xuXG5cdFx0XHRcdHJldHVybiBidXR0b247XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cblx0XHRcdFx0aWYgKHdpbmRvdy5pc1NlY3VyZUNvbnRleHQgPT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0bWVzc2FnZS5ocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZi5yZXBsYWNlKFxuXHRcdFx0XHRcdFx0L15odHRwOi8sXG5cdFx0XHRcdFx0XHRcImh0dHBzOlwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRtZXNzYWdlLmlubmVySFRNTCA9IFwiV0VCWFIgTkVFRFMgSFRUUFNcIjsgLy8gVE9ETyBJbXByb3ZlIG1lc3NhZ2Vcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtZXNzYWdlLmhyZWYgPSBcImh0dHBzOi8vaW1tZXJzaXZld2ViLmRldi9cIjtcblx0XHRcdFx0XHRtZXNzYWdlLmlubmVySFRNTCA9IFwiV0VCWFIgTk9UIEFWQUlMQUJMRVwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bWVzc2FnZS5zdHlsZS5sZWZ0ID0gXCJjYWxjKDUwJSAtIDkwcHgpXCI7XG5cdFx0XHRcdG1lc3NhZ2Uuc3R5bGUud2lkdGggPSBcIjE4MHB4XCI7XG5cdFx0XHRcdG1lc3NhZ2Uuc3R5bGUudGV4dERlY29yYXRpb24gPSBcIm5vbmVcIjtcblxuXHRcdFx0XHRzdHlsaXplRWxlbWVudChtZXNzYWdlKTtcblxuXHRcdFx0XHRyZXR1cm4gbWVzc2FnZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRjb25zdCBidXR0b24gPSBBUkJ1dHRvbi5jcmVhdGVCdXR0b24ocmVuZGVyZXIsIHtcblx0XHRyZXF1aXJlZEZlYXR1cmVzOiBbXCJoaXQtdGVzdFwiXSxcblx0fSk7XG5cblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1aS1jb250YWluZXJcIikuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcblxuXHRyZXR1cm4geyBidXR0b24gfTtcbn07XG5cbmV4cG9ydCB7IGNyZWF0ZUFSQnRuIH07XG4iLCJjb25zdCBhbWJpZW50ID0gbmV3IFRldGF2aS5USFJFRS5BbWJpZW50TGlnaHQoMHg5OTk5OTkpO1xuXG5jb25zdCBzcG90TGlnaHQgPSBuZXcgVGV0YXZpLlRIUkVFLlNwb3RMaWdodCgweGZmZmZmZik7XG5zcG90TGlnaHQucG9zaXRpb24uc2V0KDAsIDUsIDApO1xuc3BvdExpZ2h0LmNhc3RTaGFkb3cgPSBmYWxzZTtcbnNwb3RMaWdodC5hbmdsZSA9IE1hdGguUEkgLyA0O1xuc3BvdExpZ2h0LnBlbnVtYnJhID0gMC4xO1xuc3BvdExpZ2h0LmRlY2F5ID0gMjtcbnNwb3RMaWdodC5kaXN0YW5jZSA9IDIwMDtcblxuZXhwb3J0IHsgYW1iaWVudCwgc3BvdExpZ2h0IH07XG4iLCJjb25zdCBwbGF5VmlkZW8gPSAoYnV0dG9uLCB0ZXRhdmksIHNjZW5lKSA9PiB7XG5cdGxldCBmaXJzdFBsYXkgPSB0cnVlO1xuXG5cdGNvbnN0IHBpdm90ID0gbmV3IFRldGF2aS5USFJFRS5PYmplY3QzRCgpO1xuXG5cdGNvbnN0IHBsYXlTdG9wID0gKCkgPT4ge1xuXHRcdGlmIChmaXJzdFBsYXkpIHtcblx0XHRcdGZpcnN0UGxheSA9IGZhbHNlO1xuXG5cdFx0XHR0ZXRhdmkuZ2V0U3JjVmlkZW8oKS5tdXRlZCA9IHRydWU7XG5cblx0XHRcdHRldGF2aS5wbGF5KCk7XG5cblx0XHRcdHBpdm90LmFkZCh0ZXRhdmkuZ2V0U2NlbmUoKSk7XG5cblx0XHRcdHBpdm90LnZpc2libGUgPSBmYWxzZTtcblxuXHRcdFx0c2NlbmUuYWRkKHBpdm90KTtcblxuXHRcdFx0Y29uc29sZS5sb2codGV0YXZpKTtcblx0XHRcdGNvbnNvbGUubG9nKHRldGF2aS5nZXRTY2VuZSgpKTtcblx0XHR9XG5cdH07XG5cdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxheVN0b3ApO1xuXG5cdHJldHVybiB7IHBpdm90IH07XG59O1xuXG5leHBvcnQgeyBwbGF5VmlkZW8gfTtcbiIsImNvbnN0IGNyZWF0ZVJlbmRlcmVyID0gKGNhbWVyYSkgPT4ge1xuXHRjb25zdCByZW5kZXJlciA9IG5ldyBUZXRhdmkuVEhSRUUuV2ViR0xSZW5kZXJlcih7XG5cdFx0YW50aWFsaWFzOiB0cnVlLFxuXHRcdGFscGhhOiB0cnVlLFxuXHR9KTtcblx0cmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG5cdHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cdHJlbmRlcmVyLnhyLmVuYWJsZWQgPSB0cnVlO1xuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG5cdGNvbnN0IGNvbnRyb2xzID0gbmV3IFRldGF2aUV4dC5saWJPcmJpdENvbnRyb2xzKFxuXHRcdGNhbWVyYSxcblx0XHRyZW5kZXJlci5kb21FbGVtZW50XG5cdCk7XG5cdGNvbnRyb2xzLnRhcmdldC5zZXQoMCwgMS41LCAwKTtcblxuXHRjYW1lcmEucG9zaXRpb24ueiA9IDU7XG5cdGNhbWVyYS5wb3NpdGlvbi55ID0gMS41O1xuXG5cdGNvbnRyb2xzLnVwZGF0ZSgpO1xuXG5cdGNvbnNvbGUubG9nKGNvbnRyb2xzKTtcblxuXHRmdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcblx0XHRjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdFx0Y2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuXHRcdHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cdH1cblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSk7XG5cblx0cmV0dXJuIHsgcmVuZGVyZXIsIGNvbnRyb2xzIH07XG59O1xuXG5leHBvcnQgeyBjcmVhdGVSZW5kZXJlciB9O1xuIiwiY29uc3Qgc2NlbmUgPSBuZXcgVGV0YXZpLlRIUkVFLlNjZW5lKCk7XG5cbmNvbnN0IGNhbWVyYSA9IG5ldyBUZXRhdmkuVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoXG5cdDcwLFxuXHR3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcblx0MC4wMSxcblx0MjBcbik7XG5cbmV4cG9ydCB7IHNjZW5lLCBjYW1lcmEgfTtcbiIsImNvbnN0IGNyZWF0ZVRldGF2aSA9IChjYW1lcmEsIHJlbmRlcmVyKSA9PiB7XG5cdGNvbnN0IGxvYWRpbmdQYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nLXBhZ2VcIik7XG5cblx0ZnVuY3Rpb24gb25Mb2cobG9nKSB7XG5cdFx0Y29uc29sZS5sb2cobG9nKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldEJhcih3aWR0aCwgd2lkdGhQbGF5KSB7XG5cdFx0aWYgKHRldGF2aSAhPSBudWxsKSB7XG5cdFx0XHRpZiAod2lkdGhQbGF5IC8gd2lkdGggPiAwLjAxICYmIHRldGF2aS5pc1JlYWR5KCkpIHtcblx0XHRcdFx0bG9hZGluZ1BhZ2UuY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgdGV0YXZpID0gVGV0YXZpLmNyZWF0ZShcblx0XHRyZW5kZXJlcixcblx0XHRjYW1lcmEsXG5cdFx0XCIuL3d0ZXQvMi90ZXh0dXJlc1ZpZGVvLm1wNFwiLFxuXHRcdFwiLi93dGV0LzIvR2VvbWV0cnkubWFuaWZlc3RcIlxuXHQpXG5cdFx0Lm9uU2V0QmFyKHNldEJhcilcblx0XHQuc2V0RmFkZUFscGhhKGZhbHNlKVxuXHRcdC5vbkxvZyhvbkxvZyk7XG5cblx0dGV0YXZpLnNldFNoYWRvd1Zpc2libGUoZmFsc2UpO1xuXG5cdGZ1bmN0aW9uIHJlcXVpcmUoc3RyKSB7XG5cdFx0cmV0dXJuIFwiLi9hcmNoaXZvczIvMi9cIiArIHN0cjtcblx0fVxuXG5cdHJldHVybiB7IHRldGF2aSB9O1xufTtcblxuZXhwb3J0IHsgY3JlYXRlVGV0YXZpIH07XG4iLCJjb25zdCBjYWxsQW5pbWF0aW9uID0gKHRldGF2aSwgc2NlbmUsIGNhbWVyYSwgY29udHJvbHMsIHJlbmRlcmVyKSA9PiB7XG5cdGxldCBwaXZvdDtcblx0bGV0IHZpZGVvO1xuXHRjb25zdCBnZW9tZXRyeSA9IG5ldyBUZXRhdmkuVEhSRUUuUmluZ0dlb21ldHJ5KDAuMDgsIDAuMSwgMzIpLnJvdGF0ZVgoXG5cdFx0LU1hdGguUEkgLyAyXG5cdCk7XG5cdGxldCBtYXRlcmlhbCA9IG5ldyBUZXRhdmkuVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcblx0Y29uc3QgcmV0aWNsZSA9IG5ldyBUZXRhdmkuVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXHRyZXRpY2xlLm1hdHJpeEF1dG9VcGRhdGUgPSBmYWxzZTtcblx0cmV0aWNsZS52aXNpYmxlID0gdHJ1ZTtcblx0c2NlbmUuYWRkKHJldGljbGUpO1xuXG5cdGxldCBoaXRUZXN0U291cmNlID0gbnVsbDtcblx0bGV0IGhpdFRlc3RTb3VyY2VSZXF1ZXN0ZWQgPSBmYWxzZTtcblxuXHRjb25zdCBjb250cm9sbGVyID0gcmVuZGVyZXIueHIuZ2V0Q29udHJvbGxlcigwKTtcblxuXHRhc3luYyBmdW5jdGlvbiByZXF1ZXN0SGl0VGVzdFNvdXJjZSgpIHtcblx0XHRjb25zdCBzZXNzaW9uID0gcmVuZGVyZXIueHIuZ2V0U2Vzc2lvbigpO1xuXHRcdHNlc3Npb24uYWRkRXZlbnRMaXN0ZW5lcihcImVuZFwiLCAoKSA9PiB7XG5cdFx0XHRoaXRUZXN0U291cmNlUmVxdWVzdGVkID0gZmFsc2U7XG5cdFx0XHRoaXRUZXN0U291cmNlID0gbnVsbDtcblx0XHR9KTtcblx0XHRjb25zdCByZWZlcmVuY2VTcGFjZSA9IGF3YWl0IHNlc3Npb24ucmVxdWVzdFJlZmVyZW5jZVNwYWNlKFwidmlld2VyXCIpO1xuXHRcdGhpdFRlc3RTb3VyY2UgPSBhd2FpdCBzZXNzaW9uLnJlcXVlc3RIaXRUZXN0U291cmNlKHtcblx0XHRcdHNwYWNlOiByZWZlcmVuY2VTcGFjZSxcblx0XHR9KTtcblx0XHRoaXRUZXN0U291cmNlUmVxdWVzdGVkID0gdHJ1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldEhpdFRlc3RSZXN1bHRzKGZyYW1lKSB7XG5cdFx0Y29uc3QgaGl0VGVzdFJlc3VsdHMgPSBmcmFtZS5nZXRIaXRUZXN0UmVzdWx0cyhoaXRUZXN0U291cmNlKTtcblx0XHRpZiAoaGl0VGVzdFJlc3VsdHMubGVuZ3RoKSB7XG5cdFx0XHRjb25zdCBoaXQgPSBoaXRUZXN0UmVzdWx0c1swXTtcblx0XHRcdGNvbnN0IHBvc2UgPSBoaXQuZ2V0UG9zZShyZW5kZXJlci54ci5nZXRSZWZlcmVuY2VTcGFjZSgpKTtcblx0XHRcdHJldGljbGUudmlzaWJsZSA9IHRydWU7XG5cdFx0XHRyZXRpY2xlLm1hdHJpeC5mcm9tQXJyYXkocG9zZS50cmFuc2Zvcm0ubWF0cml4KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0aWNsZS52aXNpYmxlID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gb25TZWxlY3QoKSB7XG5cdFx0aWYgKHJldGljbGUudmlzaWJsZSkge1xuXHRcdFx0dmlkZW8gPSB0ZXRhdmkuZ2V0U3JjVmlkZW8oKTtcblx0XHRcdHZpZGVvLm11dGVkID0gZmFsc2U7XG5cdFx0XHR2aWRlby5wYXVzZSgpO1xuXHRcdFx0dmlkZW8uY3VycmVudFRpbWUgPSAwO1xuXHRcdFx0dmlkZW8ucGxheSgpO1xuXHRcdFx0cGl2b3QucG9zaXRpb24uc2V0RnJvbU1hdHJpeFBvc2l0aW9uKHJldGljbGUubWF0cml4KTtcblx0XHRcdHBpdm90LnBvc2l0aW9uLnkgLT0gMC4zO1xuXHRcdFx0cGl2b3QudmlzaWJsZSA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0Y29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKFwic2VsZWN0XCIsIG9uU2VsZWN0KTtcblxuXHRjb250cm9scy50b3VjaGVzID0ge1xuXHRcdE9ORTogVGV0YXZpLlRIUkVFLlRPVUNILlJPVEFURSxcblx0XHRUV086IFRldGF2aS5USFJFRS5UT1VDSC5ET0xMWV9QQU4sXG5cdH07XG5cblx0Y29uc29sZS5sb2coVGV0YXZpLlRIUkVFKTtcblxuXHRmdW5jdGlvbiB0aHJlZV9hbmltYXRlKF8sIGZyYW1lKSB7XG5cdFx0aWYgKHRldGF2aSAhPSBudWxsKSB7XG5cdFx0XHR0ZXRhdmkuYW5pbWF0ZSgpO1xuXHRcdFx0aWYgKCFwaXZvdCAmJiBzY2VuZS5jaGlsZHJlblszXSkge1xuXHRcdFx0XHRwaXZvdCA9IHNjZW5lLmNoaWxkcmVuWzNdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChmcmFtZSkge1xuXHRcdFx0aWYgKGhpdFRlc3RTb3VyY2VSZXF1ZXN0ZWQgPT09IGZhbHNlKSB7XG5cdFx0XHRcdHJlcXVlc3RIaXRUZXN0U291cmNlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaGl0VGVzdFNvdXJjZSkge1xuXHRcdFx0XHRnZXRIaXRUZXN0UmVzdWx0cyhmcmFtZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29udHJvbHMudXBkYXRlKCk7XG5cblx0XHRyZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG5cdH1cblxuXHRyZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKHRocmVlX2FuaW1hdGUpO1xufTtcblxuZXhwb3J0IHsgY2FsbEFuaW1hdGlvbiB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBjcmVhdGVBUkJ0biB9IGZyb20gXCIuL2pzL2FyLWJ1dHRvblwiO1xuaW1wb3J0IHsgYW1iaWVudCwgc3BvdExpZ2h0IH0gZnJvbSBcIi4vanMvbGlnaHRzXCI7XG5pbXBvcnQgeyBwbGF5VmlkZW8gfSBmcm9tIFwiLi9qcy9wbGF5LXN0b3BcIjtcbmltcG9ydCB7IGNyZWF0ZVJlbmRlcmVyIH0gZnJvbSBcIi4vanMvcmVuZGVyZXJcIjtcbmltcG9ydCB7IHNjZW5lLCBjYW1lcmEgfSBmcm9tIFwiLi9qcy9zY2VuZS1jYW1lcmFcIjtcbmltcG9ydCB7IGNyZWF0ZVRldGF2aSB9IGZyb20gXCIuL2pzL3RldGF2aS1zZXR1cFwiO1xuaW1wb3J0IHsgY2FsbEFuaW1hdGlvbiB9IGZyb20gXCIuL2pzL3RocmVlLWFuaW1hdGVcIjtcbmltcG9ydCB7IE9iamVjdENvbnRyb2xzIH0gZnJvbSBcInRocmVlSlMtb2JqZWN0LWNvbnRyb2xzXCI7XG5cbnNjZW5lLmFkZChhbWJpZW50KTtcbnNjZW5lLmFkZChzcG90TGlnaHQpO1xuXG5jb25zdCB7IHJlbmRlcmVyLCBjb250cm9scyB9ID0gY3JlYXRlUmVuZGVyZXIoY2FtZXJhKTtcblxuY29uc3QgdGV0YXZpID0gY3JlYXRlVGV0YXZpKGNhbWVyYSwgcmVuZGVyZXIpLnRldGF2aTtcblxuY29uc3QgZW50ZXJCdG4gPSBjcmVhdGVBUkJ0bihyZW5kZXJlcikuYnV0dG9uO1xuXG5jb25zdCB7IHBpdm90IH0gPSBwbGF5VmlkZW8oZW50ZXJCdG4sIHRldGF2aSwgc2NlbmUpO1xuXG5jYWxsQW5pbWF0aW9uKHRldGF2aSwgc2NlbmUsIGNhbWVyYSwgY29udHJvbHMsIHJlbmRlcmVyKTtcblxuY29uc3Qgb2JqQ29udHJvbHMgPSBuZXcgT2JqZWN0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50LCBwaXZvdCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=