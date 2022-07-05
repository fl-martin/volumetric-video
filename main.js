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
const callAnimation = (tetavi, scene, camera, pivot, controls, renderer) => {
	let settingPosition = true;
	/*const positionBtnContainer = document.getElementById(
		"change-position-container"
	);
	const positionBtn = document.getElementById("change-position");*/
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
			//positionBtnContainer.classList.remove("hidden");
			//positionBtnContainer.classList.add("visible");
		}
	}

	controller.addEventListener("select", onSelect);
	/*positionBtn.addEventListener("click", () => {
		positionBtnContainer.classList.remove("visible");
		settingPosition = true;
	});*/

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

(0,_js_three_animate__WEBPACK_IMPORTED_MODULE_6__.callAnimation)(tetavi, _js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.scene, _js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.camera, pivot, controls, renderer);

const objControls = new threeJS_object_controls__WEBPACK_IMPORTED_MODULE_7__.ObjectControls(_js_scene_camera__WEBPACK_IMPORTED_MODULE_4__.camera, renderer.domElement, pivot);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEpBQTBKO0FBQzFKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsNEJBQTRCO0FBQy9DLDhCQUE4QixZQUFZO0FBQzFDLHFCQUFxQixrQkFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0IsaUJBQWlCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCLGlCQUFpQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixpQkFBaUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhCQUE4QjtBQUM5Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQ0FBZ0M7O0FBRWhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sZ0NBQWdDO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDOztBQUVoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUUwQjs7Ozs7Ozs7Ozs7Ozs7O0FDbmExQjtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0NBQWdDO0FBQ2hDOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOOztBQUVBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUMsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7O0FBRUY7O0FBRUEsVUFBVTtBQUNWOztBQUV1Qjs7Ozs7Ozs7Ozs7Ozs7OztBQzVMdkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRThCOzs7Ozs7Ozs7Ozs7Ozs7QUNWOUI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxVQUFVO0FBQ1Y7O0FBRXFCOzs7Ozs7Ozs7Ozs7Ozs7QUM1QnJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxVQUFVO0FBQ1Y7O0FBRTBCOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkMxQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRXlCOzs7Ozs7Ozs7Ozs7Ozs7QUNUekI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxVQUFVO0FBQ1Y7O0FBRXdCOzs7Ozs7Ozs7Ozs7Ozs7QUNsQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnRUFBZ0U7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxFQUFFOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUV5Qjs7Ozs7OztVQzdGekI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNONkM7QUFDSTtBQUNOO0FBQ0k7QUFDRztBQUNEO0FBQ0U7QUFDTTs7QUFFekQsdURBQVMsQ0FBQywrQ0FBTztBQUNqQix1REFBUyxDQUFDLGlEQUFTOztBQUVuQixRQUFRLHFCQUFxQixFQUFFLDREQUFjLENBQUMsb0RBQU07O0FBRXBELGVBQWUsOERBQVksQ0FBQyxvREFBTTs7QUFFbEMsaUJBQWlCLDBEQUFXOztBQUU1QixRQUFRLFFBQVEsRUFBRSx3REFBUyxtQkFBbUIsbURBQUs7O0FBRW5ELGdFQUFhLFNBQVMsbURBQUssRUFBRSxvREFBTTs7QUFFbkMsd0JBQXdCLG1FQUFjLENBQUMsb0RBQU0iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9ub2RlX21vZHVsZXMvdGhyZWVKUy1vYmplY3QtY29udHJvbHMvT2JqZWN0Q29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL2FyLWJ1dHRvbi5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvbGlnaHRzLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy9wbGF5LXN0b3AuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL3JlbmRlcmVyLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy9zY2VuZS1jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL3RldGF2aS1zZXR1cC5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvdGhyZWUtYW5pbWF0ZS5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbk9iamVjdENvbnRyb2xzXG52ZXJzaW9uOiAxLjIuOFxuYXV0aG9yOiBBbGJlcnRvIFBpcmFzXG5lbWFpbDogYS5waXJhcy5pY3RAZ21haWwuY29tXG5naXRodWI6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbGJlcnRvcGlyYXNcbmxpY2Vuc2U6IE1JVFxuZGVzY3JpcHRpb246IG1vZHVsZSBmb3IgVGhyZWVKUyB0aGF0IGFsbG93cyB5b3UgdG8gcm90YXRlIGFuIE9iamVjdChtZXNoKSBpbmRlcGVuZGVudGx5IGZyb20gdGhlIHJlc3Qgb2YgdGhlIHNjZW5lLCBhbmQgdG8gem9vbSBpbi9vdXQgbW92aW5nIHRoZSBjYW1lcmE7IGZvciBkZXNrdG9wIGFuZCBtb2JpbGUuXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuLyoqXG4gKiBPYmplY3RDb250cm9sc1xuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0gY2FtZXJhIC0gcmVmZXJlbmNlIHRvIHRoZSBjYW1lcmEuXG4gKiBAcGFyYW0gZG9tRWxlbWVudCAtIHJlZmVyZW5jZSB0byB0aGUgcmVuZGVyZXIncyBkb20gZWxlbWVudC5cbiAqIEBwYXJhbSBvYmplY3RUb01vdmUgLSByZWZlcmVuY2UgdGhlIG9iamVjdCB0byBjb250cm9sLlxuICovXG5mdW5jdGlvbiBPYmplY3RDb250cm9scyhjYW1lcmEsIGRvbUVsZW1lbnQsIG9iamVjdFRvTW92ZSkge1xuICAvKipcbiAgICogc2V0T2JqZWN0VG9Nb3ZlXG4gICAqIEBkZXNjcmlwdGlvbiBjaGFuZ2VzIHRoZSBvYmplY3QocykgdG8gY29udHJvbFxuICAgKiBAcGFyYW0gbmV3TWVzaCA6IG9uZSBtZXNoIG9yIGFuIGFycmF5IG9mIG1lc2hlc1xuICAgKiovXG4gIHRoaXMuc2V0T2JqZWN0VG9Nb3ZlID0gZnVuY3Rpb24gKG5ld01lc2gpIHtcbiAgICBtZXNoID0gbmV3TWVzaDtcbiAgfTtcblxuICB0aGlzLmdldE9iamVjdFRvTW92ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBtZXNoO1xuICB9XG5cbiAgLyoqXG4gICAqIHNldFpvb21TcGVlZFxuICAgKiBAZGVzY3JpcHRpb24gc2V0cyBhIGN1c3RvbSB6b29tIHNwZWVkICgwLjEgPT0gc2xvdyAgMSA9PSBmYXN0KVxuICAgKiBAcGFyYW0gbmV3Wm9vbVNwZWVkXG4gICAqKi9cbiAgdGhpcy5zZXRab29tU3BlZWQgPSBmdW5jdGlvbiAobmV3Wm9vbVNwZWVkKSB7XG4gICAgem9vbVNwZWVkID0gbmV3Wm9vbVNwZWVkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBzZXREaXN0YW5jZVxuICAgKiBAZGVzY3JpcHRpb24gc2V0IHRoZSB6b29tIHJhbmdlIGRpc3RhbmNlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtaW5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG1heFxuICAgKiovXG4gIHRoaXMuc2V0RGlzdGFuY2UgPSBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgICBtaW5EaXN0YW5jZSA9IG1pbjtcbiAgICBtYXhEaXN0YW5jZSA9IG1heDtcbiAgfTtcblxuICAvKipcbiAgICogc2V0Um90YXRpb25TcGVlZFxuICAgKiBAcGFyYW0ge251bWJlcn0gbmV3Um90YXRpb25TcGVlZCAtICgxID09IGZhc3QpICAoMC4wMSA9PSBzbG93KVxuICAgKiovXG4gIHRoaXMuc2V0Um90YXRpb25TcGVlZCA9IGZ1bmN0aW9uIChuZXdSb3RhdGlvblNwZWVkKSB7XG4gICAgcm90YXRpb25TcGVlZCA9IG5ld1JvdGF0aW9uU3BlZWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIHNldFJvdGF0aW9uU3BlZWRUb3VjaERldmljZXNcbiAgICogQHBhcmFtIHtudW1iZXJ9IG5ld1JvdGF0aW9uU3BlZWQgLSAoMSA9PSBmYXN0KSAgKDAuMDEgPT0gc2xvdylcbiAgICoqL1xuICB0aGlzLnNldFJvdGF0aW9uU3BlZWRUb3VjaERldmljZXMgPSBmdW5jdGlvbiAobmV3Um90YXRpb25TcGVlZCkge1xuICAgIHJvdGF0aW9uU3BlZWRUb3VjaERldmljZXMgPSBuZXdSb3RhdGlvblNwZWVkO1xuICB9O1xuXG4gIHRoaXMuZW5hYmxlVmVydGljYWxSb3RhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2ZXJ0aWNhbFJvdGF0aW9uRW5hYmxlZCA9IHRydWU7XG4gIH07XG5cbiAgdGhpcy5kaXNhYmxlVmVydGljYWxSb3RhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2ZXJ0aWNhbFJvdGF0aW9uRW5hYmxlZCA9IGZhbHNlO1xuICB9O1xuXG4gIHRoaXMuZW5hYmxlSG9yaXpvbnRhbFJvdGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGhvcml6b250YWxSb3RhdGlvbkVuYWJsZWQgPSB0cnVlO1xuICB9O1xuXG4gIHRoaXMuZGlzYWJsZUhvcml6b250YWxSb3RhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBob3Jpem9udGFsUm90YXRpb25FbmFibGVkID0gZmFsc2U7XG4gIH07XG5cbiAgdGhpcy5zZXRNYXhWZXJ0aWNhbFJvdGF0aW9uQW5nbGUgPSBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgICBNQVhfUk9UQVRPTl9BTkdMRVMueC5mcm9tID0gbWluO1xuICAgIE1BWF9ST1RBVE9OX0FOR0xFUy54LnRvID0gbWF4O1xuICAgIE1BWF9ST1RBVE9OX0FOR0xFUy54LmVuYWJsZWQgPSB0cnVlO1xuICB9O1xuXG4gIHRoaXMuc2V0TWF4SG9yaXpvbnRhbFJvdGF0aW9uQW5nbGUgPSBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgICBNQVhfUk9UQVRPTl9BTkdMRVMueS5mcm9tID0gbWluO1xuICAgIE1BWF9ST1RBVE9OX0FOR0xFUy55LnRvID0gbWF4O1xuICAgIE1BWF9ST1RBVE9OX0FOR0xFUy55LmVuYWJsZWQgPSB0cnVlO1xuICB9O1xuXG4gIHRoaXMuZGlzYWJsZU1heEhvcml6b250YWxBbmdsZVJvdGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIE1BWF9ST1RBVE9OX0FOR0xFUy55LmVuYWJsZWQgPSBmYWxzZTtcbiAgfTtcblxuICB0aGlzLmRpc2FibGVNYXhWZXJ0aWNhbEFuZ2xlUm90YXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgTUFYX1JPVEFUT05fQU5HTEVTLnguZW5hYmxlZCA9IGZhbHNlO1xuICB9O1xuXG4gIHRoaXMuZGlzYWJsZVpvb20gPSBmdW5jdGlvbiAoKSB7XG4gICAgem9vbUVuYWJsZWQgPSBmYWxzZTtcbiAgfTtcblxuICB0aGlzLmVuYWJsZVpvb20gPSBmdW5jdGlvbiAoKSB7XG4gICAgem9vbUVuYWJsZWQgPSB0cnVlO1xuICB9O1xuXG4gIHRoaXMuaXNVc2VySW50ZXJhY3Rpb25BY3RpdmUgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiBpc0RyYWdnaW5nO1xuICB9XG5cbiAgZG9tRWxlbWVudCA9IGRvbUVsZW1lbnQgIT09IHVuZGVmaW5lZCA/IGRvbUVsZW1lbnQgOiBkb2N1bWVudDtcblxuICAvKioqKioqKioqKioqKioqKioqKioqIFByaXZhdGUgY29udHJvbCB2YXJpYWJsZXMgKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICBjb25zdCBNQVhfUk9UQVRPTl9BTkdMRVMgPSB7XG4gICAgeDoge1xuICAgICAgLy8gVmVydGljYWwgZnJvbSBib3R0b20gdG8gdG9wLlxuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICBmcm9tOiBNYXRoLlBJIC8gOCxcbiAgICAgIHRvOiBNYXRoLlBJIC8gOCxcbiAgICB9LFxuICAgIHk6IHtcbiAgICAgIC8vIEhvcml6b250YWwgZnJvbSBsZWZ0IHRvIHJpZ2h0LlxuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICBmcm9tOiBNYXRoLlBJIC8gNCxcbiAgICAgIHRvOiBNYXRoLlBJIC8gNCxcbiAgICB9LFxuICB9O1xuXG4gIGxldCBmbGFnLFxuICAgIG1lc2ggPSBvYmplY3RUb01vdmUsXG4gICAgbWF4RGlzdGFuY2UgPSAxNSxcbiAgICBtaW5EaXN0YW5jZSA9IDYsXG4gICAgem9vbVNwZWVkID0gMC41LFxuICAgIHJvdGF0aW9uU3BlZWQgPSAwLjA1LFxuICAgIHJvdGF0aW9uU3BlZWRUb3VjaERldmljZXMgPSAwLjA1LFxuICAgIGlzRHJhZ2dpbmcgPSBmYWxzZSxcbiAgICB2ZXJ0aWNhbFJvdGF0aW9uRW5hYmxlZCA9IGZhbHNlLFxuICAgIGhvcml6b250YWxSb3RhdGlvbkVuYWJsZWQgPSB0cnVlLFxuICAgIHpvb21FbmFibGVkID0gdHJ1ZSxcbiAgICBtb3VzZUZsYWdzID0geyBNT1VTRURPV046IDAsIE1PVVNFTU9WRTogMSB9LFxuICAgIHByZXZpb3VzTW91c2VQb3NpdGlvbiA9IHsgeDogMCwgeTogMCB9LFxuICAgIHByZXZab29tRGlmZiA9IHsgWDogbnVsbCwgWTogbnVsbCB9LFxuICAgIC8qKlxuICAgICAqIEN1cnJlbnRUb3VjaGVzXG4gICAgICogbGVuZ3RoIDAgOiBubyB6b29tXG4gICAgICogbGVuZ3RoIDIgOiBpcyB6b29tbWluZ1xuICAgICAqL1xuICAgIGN1cnJlbnRUb3VjaGVzID0gW107XG5cbiAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIFByaXZhdGUgc2hhcmVkIGZ1bmN0aW9ucyAqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gIGZ1bmN0aW9uIHpvb21JbigpIHtcbiAgICBjYW1lcmEucG9zaXRpb24ueiAtPSB6b29tU3BlZWQ7XG4gIH1cblxuICBmdW5jdGlvbiB6b29tT3V0KCkge1xuICAgIGNhbWVyYS5wb3NpdGlvbi56ICs9IHpvb21TcGVlZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJvdGF0ZVZlcnRpY2FsKGRlbHRhTW92ZSwgbWVzaCkge1xuICAgIGlmIChtZXNoLmxlbmd0aCA+IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVzaC5sZW5ndGg7IGkrKykge1xuICAgICAgICByb3RhdGVWZXJ0aWNhbChkZWx0YU1vdmUsIG1lc2hbaV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtZXNoLnJvdGF0aW9uLnggKz0gTWF0aC5zaWduKGRlbHRhTW92ZS55KSAqIHJvdGF0aW9uU3BlZWQ7XG4gIH1cblxuICBmdW5jdGlvbiByb3RhdGVWZXJ0aWNhbFRvdWNoKGRlbHRhTW92ZSwgbWVzaCkge1xuICAgIGlmIChtZXNoLmxlbmd0aCA+IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVzaC5sZW5ndGg7IGkrKykge1xuICAgICAgICByb3RhdGVWZXJ0aWNhbFRvdWNoKGRlbHRhTW92ZSwgbWVzaFtpXSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1lc2gucm90YXRpb24ueCArPSBNYXRoLnNpZ24oZGVsdGFNb3ZlLnkpICogcm90YXRpb25TcGVlZFRvdWNoRGV2aWNlcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJvdGF0ZUhvcml6b250YWwoZGVsdGFNb3ZlLCBtZXNoKSB7XG4gICAgaWYgKG1lc2gubGVuZ3RoID4gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvdGF0ZUhvcml6b250YWwoZGVsdGFNb3ZlLCBtZXNoW2ldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbWVzaC5yb3RhdGlvbi55ICs9IE1hdGguc2lnbihkZWx0YU1vdmUueCkgKiByb3RhdGlvblNwZWVkO1xuICB9XG5cbiAgZnVuY3Rpb24gcm90YXRlSG9yaXpvbnRhbFRvdWNoKGRlbHRhTW92ZSwgbWVzaCkge1xuICAgIGlmIChtZXNoLmxlbmd0aCA+IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVzaC5sZW5ndGg7IGkrKykge1xuICAgICAgICByb3RhdGVIb3Jpem9udGFsVG91Y2goZGVsdGFNb3ZlLCBtZXNoW2ldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbWVzaC5yb3RhdGlvbi55ICs9IE1hdGguc2lnbihkZWx0YU1vdmUueCkgKiByb3RhdGlvblNwZWVkVG91Y2hEZXZpY2VzO1xuICB9XG5cbiAgLyoqXG4gICAqIGlzV2l0aGluTWF4QW5nbGVcbiAgICogQGRlc2NyaXB0aW9uIENoZWNrcyBpZiB0aGUgcm90YXRpb24gaW4gYSBzcGVjaWZpYyBheGUgaXMgd2l0aGluIHRoZSBtYXhpbXVtXG4gICAqIHZhbHVlcyBhbGxvd2VkLlxuICAgKiBAcGFyYW0gZGVsdGEgaXMgdGhlIGRpZmZlcmVuY2Ugb2YgdGhlIGN1cnJlbnQgcm90YXRpb24gYW5nbGUgYW5kIHRoZVxuICAgKiAgICAgZXhwZWN0ZWQgcm90YXRpb24gYW5nbGVcbiAgICogQHBhcmFtIGF4ZSBpcyB0aGUgYXhlIG9mIHJvdGF0aW9uOiB4KHZlcnRpY2FsIHJvdGF0aW9uKSwgeSAoaG9yaXpvbnRhbFxuICAgKiAgICAgcm90YXRpb24pXG4gICAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgcm90YXRpb24gd2l0aCB0aGUgbmV3IGRlbHRhIGlzIGluY2x1ZGVkIGludG8gdGhlXG4gICAqICAgICBhbGxvd2VkIGFuZ2xlIHJhbmdlLCBmYWxzZSBvdGhlcndpc2VcbiAgICovXG4gIGZ1bmN0aW9uIGlzV2l0aGluTWF4QW5nbGUoZGVsdGEsIGF4ZSkge1xuICAgIGlmIChNQVhfUk9UQVRPTl9BTkdMRVNbYXhlXS5lbmFibGVkKSB7XG4gICAgICBpZiAobWVzaC5sZW5ndGggPiAxKSB7XG4gICAgICAgIGxldCBjb25kaXRpb24gPSB0cnVlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc2gubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoIWNvbmRpdGlvbikgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIGlmIChNQVhfUk9UQVRPTl9BTkdMRVNbYXhlXS5lbmFibGVkKSB7XG4gICAgICAgICAgICBjb25kaXRpb24gPSBpc1JvdGF0aW9uV2l0aGluTWF4QW5nbGVzKG1lc2hbaV0sIGRlbHRhLCBheGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29uZGl0aW9uO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGlzUm90YXRpb25XaXRoaW5NYXhBbmdsZXMobWVzaCwgZGVsdGEsIGF4ZSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNSb3RhdGlvbldpdGhpbk1heEFuZ2xlcyhtZXNoVG9Sb3RhdGUsIGRlbHRhLCBheGUpIHtcbiAgICByZXR1cm4gTUFYX1JPVEFUT05fQU5HTEVTW2F4ZV0uZnJvbSAqIC0xIDxcbiAgICAgIG1lc2hUb1JvdGF0ZS5yb3RhdGlvbltheGVdICsgZGVsdGEgJiZcbiAgICAgIG1lc2hUb1JvdGF0ZS5yb3RhdGlvbltheGVdICsgZGVsdGEgPCBNQVhfUk9UQVRPTl9BTkdMRVNbYXhlXS50b1xuICAgICAgPyB0cnVlXG4gICAgICA6IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRNb3VzZVBvc2l0aW9uKCkge1xuICAgIHByZXZpb3VzTW91c2VQb3NpdGlvbiA9IHsgeDogMCwgeTogMCB9O1xuICB9XG5cbiAgLyoqKioqKioqKioqKioqKioqKiAgTU9VU0UgaW50ZXJhY3Rpb24gZnVuY3Rpb25zIC0gZGVza3RvcCAgKioqKiovXG4gIGZ1bmN0aW9uIG1vdXNlRG93bihlKSB7XG4gICAgaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgZmxhZyA9IG1vdXNlRmxhZ3MuTU9VU0VET1dOO1xuICB9XG5cbiAgZnVuY3Rpb24gbW91c2VNb3ZlKGUpIHtcbiAgICBpZiAoaXNEcmFnZ2luZykge1xuICAgICAgY29uc3QgZGVsdGFNb3ZlID0ge1xuICAgICAgICB4OiBlLm9mZnNldFggLSBwcmV2aW91c01vdXNlUG9zaXRpb24ueCxcbiAgICAgICAgeTogZS5vZmZzZXRZIC0gcHJldmlvdXNNb3VzZVBvc2l0aW9uLnksXG4gICAgICB9O1xuXG4gICAgICBwcmV2aW91c01vdXNlUG9zaXRpb24gPSB7IHg6IGUub2Zmc2V0WCwgeTogZS5vZmZzZXRZIH07XG5cbiAgICAgIGlmIChob3Jpem9udGFsUm90YXRpb25FbmFibGVkICYmIGRlbHRhTW92ZS54ICE9IDApIHtcbiAgICAgICAgLy8gJiYgKE1hdGguYWJzKGRlbHRhTW92ZS54KSA+IE1hdGguYWJzKGRlbHRhTW92ZS55KSkpIHtcbiAgICAgICAgLy8gZW5hYmxpbmcgdGhpcywgdGhlIG1lc2ggd2lsbCByb3RhdGUgb25seSBpbiBvbmUgc3BlY2lmaWMgZGlyZWN0aW9uXG4gICAgICAgIC8vIGZvciBtb3VzZSBtb3ZlbWVudFxuICAgICAgICBpZiAoIWlzV2l0aGluTWF4QW5nbGUoTWF0aC5zaWduKGRlbHRhTW92ZS54KSAqIHJvdGF0aW9uU3BlZWQsIFwieVwiKSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIHJvdGF0ZUhvcml6b250YWwoZGVsdGFNb3ZlLCBtZXNoKTtcbiAgICAgICAgZmxhZyA9IG1vdXNlRmxhZ3MuTU9VU0VNT1ZFO1xuICAgICAgfVxuXG4gICAgICBpZiAodmVydGljYWxSb3RhdGlvbkVuYWJsZWQgJiYgZGVsdGFNb3ZlLnkgIT0gMCkge1xuICAgICAgICAvLyAmJihNYXRoLmFicyhkZWx0YU1vdmUueSkgPiBNYXRoLmFicyhkZWx0YU1vdmUueCkpIC8vXG4gICAgICAgIC8vIGVuYWJsaW5nIHRoaXMsIHRoZSBtZXNoIHdpbGwgcm90YXRlIG9ubHkgaW4gb25lIHNwZWNpZmljIGRpcmVjdGlvbiBmb3JcbiAgICAgICAgLy8gbW91c2UgbW92ZW1lbnRcbiAgICAgICAgaWYgKCFpc1dpdGhpbk1heEFuZ2xlKE1hdGguc2lnbihkZWx0YU1vdmUueSkgKiByb3RhdGlvblNwZWVkLCBcInhcIikpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICByb3RhdGVWZXJ0aWNhbChkZWx0YU1vdmUsIG1lc2gpO1xuICAgICAgICBmbGFnID0gbW91c2VGbGFncy5NT1VTRU1PVkU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbW91c2VVcCgpIHtcbiAgICBpc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgcmVzZXRNb3VzZVBvc2l0aW9uKCk7XG4gIH1cblxuICBmdW5jdGlvbiB3aGVlbChlKSB7XG4gICAgaWYgKCF6b29tRW5hYmxlZCkgcmV0dXJuO1xuICAgIGNvbnN0IGRlbHRhID0gZS53aGVlbERlbHRhID8gZS53aGVlbERlbHRhIDogZS5kZWx0YVkgKiAtMTtcbiAgICBpZiAoZGVsdGEgPiAwICYmIGNhbWVyYS5wb3NpdGlvbi56ID4gbWluRGlzdGFuY2UpIHtcbiAgICAgIHpvb21JbigpO1xuICAgIH0gZWxzZSBpZiAoZGVsdGEgPCAwICYmIGNhbWVyYS5wb3NpdGlvbi56IDwgbWF4RGlzdGFuY2UpIHtcbiAgICAgIHpvb21PdXQoKTtcbiAgICB9XG4gIH1cbiAgLyoqKioqKioqKioqKioqKioqKiBUT1VDSCBpbnRlcmFjdGlvbiBmdW5jdGlvbnMgLSBtb2JpbGUgICoqKioqL1xuXG4gIGZ1bmN0aW9uIG9uVG91Y2hTdGFydChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGZsYWcgPSBtb3VzZUZsYWdzLk1PVVNFRE9XTjtcbiAgICBpZiAoZS50b3VjaGVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgcHJldlpvb21EaWZmLlggPSBNYXRoLmFicyhlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGUudG91Y2hlc1sxXS5jbGllbnRYKTtcbiAgICAgIHByZXZab29tRGlmZi5ZID0gTWF0aC5hYnMoZS50b3VjaGVzWzBdLmNsaWVudFkgLSBlLnRvdWNoZXNbMV0uY2xpZW50WSk7XG4gICAgICBjdXJyZW50VG91Y2hlcyA9IG5ldyBBcnJheSgyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJldmlvdXNNb3VzZVBvc2l0aW9uID0geyB4OiBlLnRvdWNoZXNbMF0ucGFnZVgsIHk6IGUudG91Y2hlc1swXS5wYWdlWSB9O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uVG91Y2hFbmQoZSkge1xuICAgIHByZXZab29tRGlmZi5YID0gbnVsbDtcbiAgICBwcmV2Wm9vbURpZmYuWSA9IG51bGw7XG5cbiAgICAvKiBJZiB5b3Ugd2VyZSB6b29taW5nIG91dCwgY3VycmVudFRvdWNoZXMgaXMgdXBkYXRlZCBmb3IgZWFjaCBmaW5nZXIgeW91XG4gICAgICogbGVhdmUgdXAgdGhlIHNjcmVlbiBzbyBlYWNoIHRpbWUgYSBmaW5nZXIgbGVhdmVzIHVwIHRoZSBzY3JlZW4sXG4gICAgICogY3VycmVudFRvdWNoZXMgbGVuZ3RoIGlzIGRlY3JlYXNlZCBvZiBhIHVuaXQuIFdoZW4geW91IGxlYXZlIHVwIGJvdGggMlxuICAgICAqIGZpbmdlcnMsIGN1cnJlbnRUb3VjaGVzLmxlbmd0aCBpcyAwLCB0aGlzIG1lYW5zIHRoZSB6b29tbWluZyBwaGFzZSBpc1xuICAgICAqIGVuZGVkLlxuICAgICAqL1xuICAgIGlmIChjdXJyZW50VG91Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjdXJyZW50VG91Y2hlcy5wb3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudFRvdWNoZXMgPSBbXTtcbiAgICB9XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmIChmbGFnID09PSBtb3VzZUZsYWdzLk1PVVNFRE9XTikge1xuICAgICAgLy8gVG91Y2hDbGlja1xuICAgICAgLy8gWW91IGNhbiBpbnZva2UgbW9yZSBvdGhlciBmdW5jdGlvbnMgZm9yIGFuaW1hdGlvbnMgYW5kIHNvIG9uLi4uXG4gICAgfSBlbHNlIGlmIChmbGFnID09PSBtb3VzZUZsYWdzLk1PVVNFTU9WRSkge1xuICAgICAgLy8gVG91Y2ggZHJhZ1xuICAgICAgLy8gWW91IGNhbiBpbnZva2UgbW9yZSBvdGhlciBmdW5jdGlvbnMgZm9yIGFuaW1hdGlvbnMgYW5kIHNvIG9uLi4uXG4gICAgfVxuICAgIHJlc2V0TW91c2VQb3NpdGlvbigpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25Ub3VjaE1vdmUoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBmbGFnID0gbW91c2VGbGFncy5NT1VTRU1PVkU7XG4gICAgLy8gVG91Y2ggem9vbS5cbiAgICAvLyBJZiB0d28gcG9pbnRlcnMgYXJlIGRvd24sIGNoZWNrIGZvciBwaW5jaCBnZXN0dXJlcy5cbiAgICBpZiAoZS50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiB6b29tRW5hYmxlZCkge1xuICAgICAgY3VycmVudFRvdWNoZXMgPSBuZXcgQXJyYXkoMik7XG4gICAgICAvLyBDYWxjdWxhdGUgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHR3byBwb2ludGVycy5cbiAgICAgIGNvbnN0IGN1ckRpZmZYID0gTWF0aC5hYnMoZS50b3VjaGVzWzBdLmNsaWVudFggLSBlLnRvdWNoZXNbMV0uY2xpZW50WCk7XG4gICAgICBjb25zdCBjdXJEaWZmWSA9IE1hdGguYWJzKGUudG91Y2hlc1swXS5jbGllbnRZIC0gZS50b3VjaGVzWzFdLmNsaWVudFkpO1xuXG4gICAgICBpZiAocHJldlpvb21EaWZmICYmIHByZXZab29tRGlmZi5YID4gMCAmJiBwcmV2Wm9vbURpZmYuWSA+IDApIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGN1ckRpZmZYID4gcHJldlpvb21EaWZmLlggJiZcbiAgICAgICAgICBjdXJEaWZmWSA+IHByZXZab29tRGlmZi5ZICYmXG4gICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLnogPiBtaW5EaXN0YW5jZVxuICAgICAgICApIHtcbiAgICAgICAgICB6b29tSW4oKTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBjdXJEaWZmWCA8IHByZXZab29tRGlmZi5YICYmXG4gICAgICAgICAgY2FtZXJhLnBvc2l0aW9uLnogPCBtYXhEaXN0YW5jZSAmJlxuICAgICAgICAgIGN1ckRpZmZZIDwgcHJldlpvb21EaWZmLllcbiAgICAgICAgKSB7XG4gICAgICAgICAgem9vbU91dCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBDYWNoZSB0aGUgZGlzdGFuY2UgZm9yIHRoZSBuZXh0IG1vdmUgZXZlbnQuXG4gICAgICBwcmV2Wm9vbURpZmYuWCA9IGN1ckRpZmZYO1xuICAgICAgcHJldlpvb21EaWZmLlkgPSBjdXJEaWZmWTtcblxuICAgICAgLy8gVG91Y2ggUm90YXRlLlxuICAgIH0gZWxzZSBpZiAoY3VycmVudFRvdWNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBwcmV2Wm9vbURpZmYuWCA9IG51bGw7XG4gICAgICBwcmV2Wm9vbURpZmYuWSA9IG51bGw7XG4gICAgICBjb25zdCBkZWx0YU1vdmUgPSB7XG4gICAgICAgIHg6IGUudG91Y2hlc1swXS5wYWdlWCAtIHByZXZpb3VzTW91c2VQb3NpdGlvbi54LFxuICAgICAgICB5OiBlLnRvdWNoZXNbMF0ucGFnZVkgLSBwcmV2aW91c01vdXNlUG9zaXRpb24ueSxcbiAgICAgIH07XG4gICAgICBwcmV2aW91c01vdXNlUG9zaXRpb24gPSB7IHg6IGUudG91Y2hlc1swXS5wYWdlWCwgeTogZS50b3VjaGVzWzBdLnBhZ2VZIH07XG5cbiAgICAgIGlmIChob3Jpem9udGFsUm90YXRpb25FbmFibGVkICYmIGRlbHRhTW92ZS54ICE9IDApIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICFpc1dpdGhpbk1heEFuZ2xlKFxuICAgICAgICAgICAgTWF0aC5zaWduKGRlbHRhTW92ZS54KSAqIHJvdGF0aW9uU3BlZWRUb3VjaERldmljZXMsXG4gICAgICAgICAgICBcInlcIlxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcm90YXRlSG9yaXpvbnRhbFRvdWNoKGRlbHRhTW92ZSwgbWVzaCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2ZXJ0aWNhbFJvdGF0aW9uRW5hYmxlZCAmJiBkZWx0YU1vdmUueSAhPSAwKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhaXNXaXRoaW5NYXhBbmdsZShcbiAgICAgICAgICAgIE1hdGguc2lnbihkZWx0YU1vdmUueSkgKiByb3RhdGlvblNwZWVkVG91Y2hEZXZpY2VzLFxuICAgICAgICAgICAgXCJ4XCJcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIHJvdGF0ZVZlcnRpY2FsVG91Y2goZGVsdGFNb3ZlLCBtZXNoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKioqKioqKioqKioqKioqKioqKioqIEV2ZW50IExpc3RlbmVycyAqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gIC8qKiBNb3VzZSBJbnRlcmFjdGlvbiBDb250cm9scyAocm90YXRlICYgem9vbSwgZGVza3RvcCAqKi9cbiAgLy8gTW91c2UgLSBtb3ZlXG4gIGRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZURvd24sIGZhbHNlKTtcbiAgZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlTW92ZSwgZmFsc2UpO1xuICBkb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG1vdXNlVXAsIGZhbHNlKTtcbiAgZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgbW91c2VVcCwgZmFsc2UpO1xuXG4gIC8vIE1vdXNlIC0gem9vbVxuICBkb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCB3aGVlbCwgZmFsc2UpO1xuXG4gIC8qKiBUb3VjaCBJbnRlcmFjdGlvbiBDb250cm9scyAocm90YXRlICYgem9vbSwgbW9iaWxlKSAqKi9cbiAgLy8gVG91Y2ggLSBtb3ZlXG4gIGRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgb25Ub3VjaFN0YXJ0LCBmYWxzZSk7XG4gIGRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBvblRvdWNoTW92ZSwgZmFsc2UpO1xuICBkb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBvblRvdWNoRW5kLCBmYWxzZSk7XG59XG5cbmV4cG9ydCB7IE9iamVjdENvbnRyb2xzIH07XG4iLCJjb25zdCBjcmVhdGVBUkJ0biA9IChyZW5kZXJlcikgPT4ge1xuXHRjbGFzcyBBUkJ1dHRvbiB7XG5cdFx0c3RhdGljIGNyZWF0ZUJ1dHRvbihyZW5kZXJlciwgc2Vzc2lvbkluaXQgPSB7fSkge1xuXHRcdFx0Y29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcblxuXHRcdFx0ZnVuY3Rpb24gc2hvd1N0YXJ0QVIoLypkZXZpY2UqLykge1xuXHRcdFx0XHRpZiAoc2Vzc2lvbkluaXQuZG9tT3ZlcmxheSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRcdFx0b3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KTtcblxuXHRcdFx0XHRcdGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcblx0XHRcdFx0XHRcdFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcblx0XHRcdFx0XHRcdFwic3ZnXCJcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHN2Zy5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCAzOCk7XG5cdFx0XHRcdFx0c3ZnLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCAzOCk7XG5cdFx0XHRcdFx0c3ZnLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHRcdFx0XHRcdHN2Zy5zdHlsZS5yaWdodCA9IFwiMjBweFwiO1xuXHRcdFx0XHRcdHN2Zy5zdHlsZS50b3AgPSBcIjIwcHhcIjtcblx0XHRcdFx0XHRzdmcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uLmVuZCgpO1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG92ZXJsYXkuYXBwZW5kQ2hpbGQoc3ZnKTtcblxuXHRcdFx0XHRcdGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG5cdFx0XHRcdFx0XHRcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG5cdFx0XHRcdFx0XHRcInBhdGhcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0cGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwiTSAxMiwxMiBMIDI4LDI4IE0gMjgsMTIgMTIsMjhcIik7XG5cdFx0XHRcdFx0cGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgXCIjZmZmXCIpO1xuXHRcdFx0XHRcdHBhdGguc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIDIpO1xuXHRcdFx0XHRcdHN2Zy5hcHBlbmRDaGlsZChwYXRoKTtcblxuXHRcdFx0XHRcdGlmIChzZXNzaW9uSW5pdC5vcHRpb25hbEZlYXR1cmVzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHNlc3Npb25Jbml0Lm9wdGlvbmFsRmVhdHVyZXMgPSBbXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzZXNzaW9uSW5pdC5vcHRpb25hbEZlYXR1cmVzLnB1c2goXCJkb20tb3ZlcmxheVwiKTtcblx0XHRcdFx0XHRzZXNzaW9uSW5pdC5kb21PdmVybGF5ID0geyByb290OiBvdmVybGF5IH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL1xuXG5cdFx0XHRcdGxldCBjdXJyZW50U2Vzc2lvbiA9IG51bGw7XG5cblx0XHRcdFx0YXN5bmMgZnVuY3Rpb24gb25TZXNzaW9uU3RhcnRlZChzZXNzaW9uKSB7XG5cdFx0XHRcdFx0c2Vzc2lvbi5hZGRFdmVudExpc3RlbmVyKFwiZW5kXCIsIG9uU2Vzc2lvbkVuZGVkKTtcblxuXHRcdFx0XHRcdHJlbmRlcmVyLnhyLnNldFJlZmVyZW5jZVNwYWNlVHlwZShcImxvY2FsXCIpO1xuXG5cdFx0XHRcdFx0YXdhaXQgcmVuZGVyZXIueHIuc2V0U2Vzc2lvbihzZXNzaW9uKTtcblxuXHRcdFx0XHRcdGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU1RPUCBBUlwiO1xuXHRcdFx0XHRcdHNlc3Npb25Jbml0LmRvbU92ZXJsYXkucm9vdC5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblxuXHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uID0gc2Vzc2lvbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIG9uU2Vzc2lvbkVuZGVkKC8qZXZlbnQqLykge1xuXHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlbmRcIiwgb25TZXNzaW9uRW5kZWQpO1xuXG5cdFx0XHRcdFx0YnV0dG9uLnRleHRDb250ZW50ID0gXCJTVEFSVCBBUlwiO1xuXHRcdFx0XHRcdHNlc3Npb25Jbml0LmRvbU92ZXJsYXkucm9vdC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cblx0XHRcdFx0XHRjdXJyZW50U2Vzc2lvbiA9IG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cblx0XHRcdFx0YnV0dG9uLnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUubGVmdCA9IFwiY2FsYyg1MCUgLSA1MHB4KVwiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcblxuXHRcdFx0XHRidXR0b24udGV4dENvbnRlbnQgPSBcIlNUQVJUIEFSXCI7XG5cblx0XHRcdFx0YnV0dG9uLm9ubW91c2VlbnRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRidXR0b24uc3R5bGUub3BhY2l0eSA9IFwiMS4wXCI7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0YnV0dG9uLm9ubW91c2VsZWF2ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRidXR0b24uc3R5bGUub3BhY2l0eSA9IFwiMC44XCI7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0YnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKGN1cnJlbnRTZXNzaW9uID09PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRuYXZpZ2F0b3IueHJcblx0XHRcdFx0XHRcdFx0LnJlcXVlc3RTZXNzaW9uKFwiaW1tZXJzaXZlLWFyXCIsIHNlc3Npb25Jbml0KVxuXHRcdFx0XHRcdFx0XHQudGhlbihvblNlc3Npb25TdGFydGVkKTtcblx0XHRcdFx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y3VycmVudFNlc3Npb24uZW5kKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBkaXNhYmxlQnV0dG9uKCkge1xuXHRcdFx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cblx0XHRcdFx0YnV0dG9uLnN0eWxlLmN1cnNvciA9IFwiYXV0b1wiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUubGVmdCA9IFwiY2FsYyg1MCUgLSA3NXB4KVwiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUud2lkdGggPSBcIjE1MHB4XCI7XG5cblx0XHRcdFx0YnV0dG9uLm9ubW91c2VlbnRlciA9IG51bGw7XG5cdFx0XHRcdGJ1dHRvbi5vbm1vdXNlbGVhdmUgPSBudWxsO1xuXG5cdFx0XHRcdGJ1dHRvbi5vbmNsaWNrID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gc2hvd0FSTm90U3VwcG9ydGVkKCkge1xuXHRcdFx0XHRkaXNhYmxlQnV0dG9uKCk7XG5cblx0XHRcdFx0YnV0dG9uLnRleHRDb250ZW50ID0gXCJBUiBOT1QgU1VQUE9SVEVEXCI7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHNob3dBUk5vdEFsbG93ZWQoZXhjZXB0aW9uKSB7XG5cdFx0XHRcdGRpc2FibGVCdXR0b24oKTtcblxuXHRcdFx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcdFx0XCJFeGNlcHRpb24gd2hlbiB0cnlpbmcgdG8gY2FsbCB4ci5pc1Nlc3Npb25TdXBwb3J0ZWRcIixcblx0XHRcdFx0XHRleGNlcHRpb25cblx0XHRcdFx0KTtcblxuXHRcdFx0XHRidXR0b24udGV4dENvbnRlbnQgPSBcIkFSIE5PVCBBTExPV0VEXCI7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHN0eWxpemVFbGVtZW50KGVsZW1lbnQpIHtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5wYWRkaW5nID0gXCIxZW0gMC4yZW1cIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZCAjZmZmXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIxNXB4XCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IFwiI2Q5YWYyYlwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmNvbG9yID0gXCIjZmZmXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuZm9udCA9IFwibm9ybWFsIDMuNWVtIHNhbnMtc2VyaWZcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5vdXRsaW5lID0gXCJub25lXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCI5OTlcIjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKFwieHJcIiBpbiBuYXZpZ2F0b3IpIHtcblx0XHRcdFx0YnV0dG9uLmlkID0gXCJBUkJ1dHRvblwiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG5cdFx0XHRcdHN0eWxpemVFbGVtZW50KGJ1dHRvbik7XG5cblx0XHRcdFx0bmF2aWdhdG9yLnhyXG5cdFx0XHRcdFx0LmlzU2Vzc2lvblN1cHBvcnRlZChcImltbWVyc2l2ZS1hclwiKVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChzdXBwb3J0ZWQpIHtcblx0XHRcdFx0XHRcdHN1cHBvcnRlZCA/IHNob3dTdGFydEFSKCkgOiBzaG93QVJOb3RTdXBwb3J0ZWQoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChzaG93QVJOb3RBbGxvd2VkKTtcblxuXHRcdFx0XHRyZXR1cm4gYnV0dG9uO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuXG5cdFx0XHRcdGlmICh3aW5kb3cuaXNTZWN1cmVDb250ZXh0ID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdG1lc3NhZ2UuaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYucmVwbGFjZShcblx0XHRcdFx0XHRcdC9eaHR0cDovLFxuXHRcdFx0XHRcdFx0XCJodHRwczpcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0bWVzc2FnZS5pbm5lckhUTUwgPSBcIldFQlhSIE5FRURTIEhUVFBTXCI7IC8vIFRPRE8gSW1wcm92ZSBtZXNzYWdlXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVzc2FnZS5ocmVmID0gXCJodHRwczovL2ltbWVyc2l2ZXdlYi5kZXYvXCI7XG5cdFx0XHRcdFx0bWVzc2FnZS5pbm5lckhUTUwgPSBcIldFQlhSIE5PVCBBVkFJTEFCTEVcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG1lc3NhZ2Uuc3R5bGUubGVmdCA9IFwiY2FsYyg1MCUgLSA5MHB4KVwiO1xuXHRcdFx0XHRtZXNzYWdlLnN0eWxlLndpZHRoID0gXCIxODBweFwiO1xuXHRcdFx0XHRtZXNzYWdlLnN0eWxlLnRleHREZWNvcmF0aW9uID0gXCJub25lXCI7XG5cblx0XHRcdFx0c3R5bGl6ZUVsZW1lbnQobWVzc2FnZSk7XG5cblx0XHRcdFx0cmV0dXJuIG1lc3NhZ2U7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgYnV0dG9uID0gQVJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyLCB7XG5cdFx0cmVxdWlyZWRGZWF0dXJlczogW1wiaGl0LXRlc3RcIl0sXG5cdH0pO1xuXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidWktY29udGFpbmVyXCIpLmFwcGVuZENoaWxkKGJ1dHRvbik7XG5cblx0cmV0dXJuIHsgYnV0dG9uIH07XG59O1xuXG5leHBvcnQgeyBjcmVhdGVBUkJ0biB9O1xuIiwiY29uc3QgYW1iaWVudCA9IG5ldyBUZXRhdmkuVEhSRUUuQW1iaWVudExpZ2h0KDB4OTk5OTk5KTtcblxuY29uc3Qgc3BvdExpZ2h0ID0gbmV3IFRldGF2aS5USFJFRS5TcG90TGlnaHQoMHhmZmZmZmYpO1xuc3BvdExpZ2h0LnBvc2l0aW9uLnNldCgwLCA1LCAwKTtcbnNwb3RMaWdodC5jYXN0U2hhZG93ID0gZmFsc2U7XG5zcG90TGlnaHQuYW5nbGUgPSBNYXRoLlBJIC8gNDtcbnNwb3RMaWdodC5wZW51bWJyYSA9IDAuMTtcbnNwb3RMaWdodC5kZWNheSA9IDI7XG5zcG90TGlnaHQuZGlzdGFuY2UgPSAyMDA7XG5cbmV4cG9ydCB7IGFtYmllbnQsIHNwb3RMaWdodCB9O1xuIiwiY29uc3QgcGxheVZpZGVvID0gKGJ1dHRvbiwgdGV0YXZpLCBzY2VuZSkgPT4ge1xuXHRsZXQgZmlyc3RQbGF5ID0gdHJ1ZTtcblxuXHRjb25zdCBwaXZvdCA9IG5ldyBUZXRhdmkuVEhSRUUuT2JqZWN0M0QoKTtcblxuXHRjb25zdCBwbGF5U3RvcCA9ICgpID0+IHtcblx0XHRpZiAoZmlyc3RQbGF5KSB7XG5cdFx0XHRmaXJzdFBsYXkgPSBmYWxzZTtcblxuXHRcdFx0dGV0YXZpLmdldFNyY1ZpZGVvKCkubXV0ZWQgPSB0cnVlO1xuXG5cdFx0XHR0ZXRhdmkucGxheSgpO1xuXG5cdFx0XHRwaXZvdC5hZGQodGV0YXZpLmdldFNjZW5lKCkpO1xuXG5cdFx0XHRwaXZvdC52aXNpYmxlID0gZmFsc2U7XG5cblx0XHRcdHNjZW5lLmFkZChwaXZvdCk7XG5cblx0XHRcdGNvbnNvbGUubG9nKHRldGF2aSk7XG5cdFx0XHRjb25zb2xlLmxvZyh0ZXRhdmkuZ2V0U2NlbmUoKSk7XG5cdFx0fVxuXHR9O1xuXHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHBsYXlTdG9wKTtcblxuXHRyZXR1cm4geyBwaXZvdCB9O1xufTtcblxuZXhwb3J0IHsgcGxheVZpZGVvIH07XG4iLCJjb25zdCBjcmVhdGVSZW5kZXJlciA9IChjYW1lcmEpID0+IHtcblx0Y29uc3QgcmVuZGVyZXIgPSBuZXcgVGV0YXZpLlRIUkVFLldlYkdMUmVuZGVyZXIoe1xuXHRcdGFudGlhbGlhczogdHJ1ZSxcblx0XHRhbHBoYTogdHJ1ZSxcblx0fSk7XG5cdHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuXHRyZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXHRyZW5kZXJlci54ci5lbmFibGVkID0gdHJ1ZTtcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuXHRjb25zdCBjb250cm9scyA9IG5ldyBUZXRhdmlFeHQubGliT3JiaXRDb250cm9scyhcblx0XHRjYW1lcmEsXG5cdFx0cmVuZGVyZXIuZG9tRWxlbWVudFxuXHQpO1xuXHRjb250cm9scy50YXJnZXQuc2V0KDAsIDEuNSwgMCk7XG5cblx0Y2FtZXJhLnBvc2l0aW9uLnogPSA1O1xuXHRjYW1lcmEucG9zaXRpb24ueSA9IDEuNTtcblxuXHRjb250cm9scy51cGRhdGUoKTtcblxuXHRjb25zb2xlLmxvZyhjb250cm9scyk7XG5cblx0ZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG5cdFx0Y2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuXHRcdGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cblx0XHRyZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXHR9XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUpO1xuXG5cdHJldHVybiB7IHJlbmRlcmVyLCBjb250cm9scyB9O1xufTtcblxuZXhwb3J0IHsgY3JlYXRlUmVuZGVyZXIgfTtcbiIsImNvbnN0IHNjZW5lID0gbmV3IFRldGF2aS5USFJFRS5TY2VuZSgpO1xuXG5jb25zdCBjYW1lcmEgPSBuZXcgVGV0YXZpLlRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuXHQ3MCxcblx0d2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG5cdDAuMDEsXG5cdDIwXG4pO1xuXG5leHBvcnQgeyBzY2VuZSwgY2FtZXJhIH07XG4iLCJjb25zdCBjcmVhdGVUZXRhdmkgPSAoY2FtZXJhLCByZW5kZXJlcikgPT4ge1xuXHRjb25zdCBsb2FkaW5nUGFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZGluZy1wYWdlXCIpO1xuXG5cdGZ1bmN0aW9uIG9uTG9nKGxvZykge1xuXHRcdGNvbnNvbGUubG9nKGxvZyk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRCYXIod2lkdGgsIHdpZHRoUGxheSkge1xuXHRcdGlmICh0ZXRhdmkgIT0gbnVsbCkge1xuXHRcdFx0aWYgKHdpZHRoUGxheSAvIHdpZHRoID4gMC4wMSAmJiB0ZXRhdmkuaXNSZWFkeSgpKSB7XG5cdFx0XHRcdGxvYWRpbmdQYWdlLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGNvbnN0IHRldGF2aSA9IFRldGF2aS5jcmVhdGUoXG5cdFx0cmVuZGVyZXIsXG5cdFx0Y2FtZXJhLFxuXHRcdFwiLi93dGV0LzIvdGV4dHVyZXNWaWRlby5tcDRcIixcblx0XHRcIi4vd3RldC8yL0dlb21ldHJ5Lm1hbmlmZXN0XCJcblx0KVxuXHRcdC5vblNldEJhcihzZXRCYXIpXG5cdFx0LnNldEZhZGVBbHBoYShmYWxzZSlcblx0XHQub25Mb2cob25Mb2cpO1xuXG5cdHRldGF2aS5zZXRTaGFkb3dWaXNpYmxlKGZhbHNlKTtcblxuXHRmdW5jdGlvbiByZXF1aXJlKHN0cikge1xuXHRcdHJldHVybiBcIi4vYXJjaGl2b3MyLzIvXCIgKyBzdHI7XG5cdH1cblxuXHRyZXR1cm4geyB0ZXRhdmkgfTtcbn07XG5cbmV4cG9ydCB7IGNyZWF0ZVRldGF2aSB9O1xuIiwiY29uc3QgY2FsbEFuaW1hdGlvbiA9ICh0ZXRhdmksIHNjZW5lLCBjYW1lcmEsIHBpdm90LCBjb250cm9scywgcmVuZGVyZXIpID0+IHtcblx0bGV0IHNldHRpbmdQb3NpdGlvbiA9IHRydWU7XG5cdC8qY29uc3QgcG9zaXRpb25CdG5Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcImNoYW5nZS1wb3NpdGlvbi1jb250YWluZXJcIlxuXHQpO1xuXHRjb25zdCBwb3NpdGlvbkJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhbmdlLXBvc2l0aW9uXCIpOyovXG5cdGxldCB2aWRlbztcblx0Y29uc3QgZ2VvbWV0cnkgPSBuZXcgVGV0YXZpLlRIUkVFLlJpbmdHZW9tZXRyeSgwLjA4LCAwLjEsIDMyKS5yb3RhdGVYKFxuXHRcdC1NYXRoLlBJIC8gMlxuXHQpO1xuXHRsZXQgbWF0ZXJpYWwgPSBuZXcgVGV0YXZpLlRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XG5cdGNvbnN0IHJldGljbGUgPSBuZXcgVGV0YXZpLlRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblx0cmV0aWNsZS5tYXRyaXhBdXRvVXBkYXRlID0gZmFsc2U7XG5cdHJldGljbGUudmlzaWJsZSA9IHRydWU7XG5cdHNjZW5lLmFkZChyZXRpY2xlKTtcblxuXHRsZXQgaGl0VGVzdFNvdXJjZSA9IG51bGw7XG5cdGxldCBoaXRUZXN0U291cmNlUmVxdWVzdGVkID0gZmFsc2U7XG5cblx0Y29uc3QgY29udHJvbGxlciA9IHJlbmRlcmVyLnhyLmdldENvbnRyb2xsZXIoMCk7XG5cblx0YXN5bmMgZnVuY3Rpb24gcmVxdWVzdEhpdFRlc3RTb3VyY2UoKSB7XG5cdFx0Y29uc3Qgc2Vzc2lvbiA9IHJlbmRlcmVyLnhyLmdldFNlc3Npb24oKTtcblx0XHRzZXNzaW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJlbmRcIiwgKCkgPT4ge1xuXHRcdFx0aGl0VGVzdFNvdXJjZVJlcXVlc3RlZCA9IGZhbHNlO1xuXHRcdFx0aGl0VGVzdFNvdXJjZSA9IG51bGw7XG5cdFx0fSk7XG5cdFx0Y29uc3QgcmVmZXJlbmNlU3BhY2UgPSBhd2FpdCBzZXNzaW9uLnJlcXVlc3RSZWZlcmVuY2VTcGFjZShcInZpZXdlclwiKTtcblx0XHRoaXRUZXN0U291cmNlID0gYXdhaXQgc2Vzc2lvbi5yZXF1ZXN0SGl0VGVzdFNvdXJjZSh7XG5cdFx0XHRzcGFjZTogcmVmZXJlbmNlU3BhY2UsXG5cdFx0fSk7XG5cdFx0aGl0VGVzdFNvdXJjZVJlcXVlc3RlZCA9IHRydWU7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRIaXRUZXN0UmVzdWx0cyhmcmFtZSkge1xuXHRcdGNvbnN0IGhpdFRlc3RSZXN1bHRzID0gZnJhbWUuZ2V0SGl0VGVzdFJlc3VsdHMoaGl0VGVzdFNvdXJjZSk7XG5cdFx0aWYgKGhpdFRlc3RSZXN1bHRzLmxlbmd0aCAmJiBzZXR0aW5nUG9zaXRpb24pIHtcblx0XHRcdGNvbnN0IGhpdCA9IGhpdFRlc3RSZXN1bHRzWzBdO1xuXHRcdFx0Y29uc3QgcG9zZSA9IGhpdC5nZXRQb3NlKHJlbmRlcmVyLnhyLmdldFJlZmVyZW5jZVNwYWNlKCkpO1xuXHRcdFx0cmV0aWNsZS52aXNpYmxlID0gdHJ1ZTtcblx0XHRcdHJldGljbGUubWF0cml4LmZyb21BcnJheShwb3NlLnRyYW5zZm9ybS5tYXRyaXgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXRpY2xlLnZpc2libGUgPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBvblNlbGVjdCgpIHtcblx0XHRpZiAocmV0aWNsZS52aXNpYmxlICYmIHNldHRpbmdQb3NpdGlvbikge1xuXHRcdFx0dmlkZW8gPSB0ZXRhdmkuZ2V0U3JjVmlkZW8oKTtcblx0XHRcdHZpZGVvLm11dGVkID0gZmFsc2U7XG5cdFx0XHR2aWRlby5wYXVzZSgpO1xuXHRcdFx0dmlkZW8uY3VycmVudFRpbWUgPSAwO1xuXHRcdFx0dmlkZW8ucGxheSgpO1xuXHRcdFx0cGl2b3QucG9zaXRpb24uc2V0RnJvbU1hdHJpeFBvc2l0aW9uKHJldGljbGUubWF0cml4KTtcblx0XHRcdHBpdm90LnBvc2l0aW9uLnkgLT0gMC4zO1xuXHRcdFx0cGl2b3QudmlzaWJsZSA9IHRydWU7XG5cdFx0XHRzZXR0aW5nUG9zaXRpb24gPSBmYWxzZTtcblx0XHRcdC8vcG9zaXRpb25CdG5Db250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcblx0XHRcdC8vcG9zaXRpb25CdG5Db250YWluZXIuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIik7XG5cdFx0fVxuXHR9XG5cblx0Y29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKFwic2VsZWN0XCIsIG9uU2VsZWN0KTtcblx0Lypwb3NpdGlvbkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdHBvc2l0aW9uQnRuQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuXHRcdHNldHRpbmdQb3NpdGlvbiA9IHRydWU7XG5cdH0pOyovXG5cblx0ZnVuY3Rpb24gdGhyZWVfYW5pbWF0ZShfLCBmcmFtZSkge1xuXHRcdGlmICh0ZXRhdmkgIT0gbnVsbCkge1xuXHRcdFx0dGV0YXZpLmFuaW1hdGUoKTtcblx0XHRcdGlmICghcGl2b3QgJiYgc2NlbmUuY2hpbGRyZW5bM10pIHtcblx0XHRcdFx0cGl2b3QgPSBzY2VuZS5jaGlsZHJlblszXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZnJhbWUpIHtcblx0XHRcdGlmIChoaXRUZXN0U291cmNlUmVxdWVzdGVkID09PSBmYWxzZSkge1xuXHRcdFx0XHRyZXF1ZXN0SGl0VGVzdFNvdXJjZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGhpdFRlc3RTb3VyY2UpIHtcblx0XHRcdFx0Z2V0SGl0VGVzdFJlc3VsdHMoZnJhbWUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnRyb2xzLnVwZGF0ZSgpO1xuXG5cdFx0cmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuXHR9XG5cblx0cmVuZGVyZXIuc2V0QW5pbWF0aW9uTG9vcCh0aHJlZV9hbmltYXRlKTtcbn07XG5cbmV4cG9ydCB7IGNhbGxBbmltYXRpb24gfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgY3JlYXRlQVJCdG4gfSBmcm9tIFwiLi9qcy9hci1idXR0b25cIjtcbmltcG9ydCB7IGFtYmllbnQsIHNwb3RMaWdodCB9IGZyb20gXCIuL2pzL2xpZ2h0c1wiO1xuaW1wb3J0IHsgcGxheVZpZGVvIH0gZnJvbSBcIi4vanMvcGxheS1zdG9wXCI7XG5pbXBvcnQgeyBjcmVhdGVSZW5kZXJlciB9IGZyb20gXCIuL2pzL3JlbmRlcmVyXCI7XG5pbXBvcnQgeyBzY2VuZSwgY2FtZXJhIH0gZnJvbSBcIi4vanMvc2NlbmUtY2FtZXJhXCI7XG5pbXBvcnQgeyBjcmVhdGVUZXRhdmkgfSBmcm9tIFwiLi9qcy90ZXRhdmktc2V0dXBcIjtcbmltcG9ydCB7IGNhbGxBbmltYXRpb24gfSBmcm9tIFwiLi9qcy90aHJlZS1hbmltYXRlXCI7XG5pbXBvcnQgeyBPYmplY3RDb250cm9scyB9IGZyb20gXCJ0aHJlZUpTLW9iamVjdC1jb250cm9sc1wiO1xuXG5zY2VuZS5hZGQoYW1iaWVudCk7XG5zY2VuZS5hZGQoc3BvdExpZ2h0KTtcblxuY29uc3QgeyByZW5kZXJlciwgY29udHJvbHMgfSA9IGNyZWF0ZVJlbmRlcmVyKGNhbWVyYSk7XG5cbmNvbnN0IHRldGF2aSA9IGNyZWF0ZVRldGF2aShjYW1lcmEsIHJlbmRlcmVyKS50ZXRhdmk7XG5cbmNvbnN0IGVudGVyQnRuID0gY3JlYXRlQVJCdG4ocmVuZGVyZXIpLmJ1dHRvbjtcblxuY29uc3QgeyBwaXZvdCB9ID0gcGxheVZpZGVvKGVudGVyQnRuLCB0ZXRhdmksIHNjZW5lKTtcblxuY2FsbEFuaW1hdGlvbih0ZXRhdmksIHNjZW5lLCBjYW1lcmEsIHBpdm90LCBjb250cm9scywgcmVuZGVyZXIpO1xuXG5jb25zdCBvYmpDb250cm9scyA9IG5ldyBPYmplY3RDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQsIHBpdm90KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==