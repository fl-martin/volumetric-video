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
						buttonContainer.classList.add("hide");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEpBQTBKO0FBQzFKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsNEJBQTRCO0FBQy9DLDhCQUE4QixZQUFZO0FBQzFDLHFCQUFxQixrQkFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0IsaUJBQWlCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCLGlCQUFpQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixpQkFBaUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhCQUE4QjtBQUM5Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQ0FBZ0M7O0FBRWhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sZ0NBQWdDO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDOztBQUVoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUUwQjs7Ozs7Ozs7Ozs7Ozs7O0FDbmExQjtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0M7QUFDaEM7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFFOztBQUVGOztBQUVBLFVBQVU7QUFDVjs7QUFFdUI7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5THZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUU4Qjs7Ozs7Ozs7Ozs7Ozs7O0FDVjlCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWOztBQUVxQjs7Ozs7Ozs7Ozs7Ozs7O0FDNUJyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsVUFBVTtBQUNWOztBQUUwQjs7Ozs7Ozs7Ozs7Ozs7OztBQ25DMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUV5Qjs7Ozs7Ozs7Ozs7Ozs7O0FDVHpCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWOztBQUV3Qjs7Ozs7Ozs7Ozs7Ozs7O0FDbEN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsRUFBRTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFeUI7Ozs7Ozs7VUM3RnpCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTjZDO0FBQ0k7QUFDTjtBQUNJO0FBQ0c7QUFDRDtBQUNFO0FBQ007O0FBRXpELHVEQUFTLENBQUMsK0NBQU87QUFDakIsdURBQVMsQ0FBQyxpREFBUzs7QUFFbkIsUUFBUSxxQkFBcUIsRUFBRSw0REFBYyxDQUFDLG9EQUFNOztBQUVwRCxlQUFlLDhEQUFZLENBQUMsb0RBQU07O0FBRWxDLGlCQUFpQiwwREFBVzs7QUFFNUIsUUFBUSxRQUFRLEVBQUUsd0RBQVMsbUJBQW1CLG1EQUFLOztBQUVuRCxnRUFBYSxTQUFTLG1EQUFLLEVBQUUsb0RBQU07O0FBRW5DLHdCQUF3QixtRUFBYyxDQUFDLG9EQUFNIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vbm9kZV9tb2R1bGVzL3RocmVlSlMtb2JqZWN0LWNvbnRyb2xzL09iamVjdENvbnRyb2xzLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy9hci1idXR0b24uanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL2xpZ2h0cy5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvcGxheS1zdG9wLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy9yZW5kZXJlci5qcyIsIndlYnBhY2s6Ly9tb2RlbG8tdm9sdW1ldHJpY28tYXIvLi9zcmMvanMvc2NlbmUtY2FtZXJhLmpzIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci8uL3NyYy9qcy90ZXRhdmktc2V0dXAuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2pzL3RocmVlLWFuaW1hdGUuanMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21vZGVsby12b2x1bWV0cmljby1hci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbW9kZWxvLXZvbHVtZXRyaWNvLWFyLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5PYmplY3RDb250cm9sc1xudmVyc2lvbjogMS4yLjhcbmF1dGhvcjogQWxiZXJ0byBQaXJhc1xuZW1haWw6IGEucGlyYXMuaWN0QGdtYWlsLmNvbVxuZ2l0aHViOiBodHRwczovL2dpdGh1Yi5jb20vYWxiZXJ0b3BpcmFzXG5saWNlbnNlOiBNSVRcbmRlc2NyaXB0aW9uOiBtb2R1bGUgZm9yIFRocmVlSlMgdGhhdCBhbGxvd3MgeW91IHRvIHJvdGF0ZSBhbiBPYmplY3QobWVzaCkgaW5kZXBlbmRlbnRseSBmcm9tIHRoZSByZXN0IG9mIHRoZSBzY2VuZSwgYW5kIHRvIHpvb20gaW4vb3V0IG1vdmluZyB0aGUgY2FtZXJhOyBmb3IgZGVza3RvcCBhbmQgbW9iaWxlLlxuLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbi8qKlxuICogT2JqZWN0Q29udHJvbHNcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIGNhbWVyYSAtIHJlZmVyZW5jZSB0byB0aGUgY2FtZXJhLlxuICogQHBhcmFtIGRvbUVsZW1lbnQgLSByZWZlcmVuY2UgdG8gdGhlIHJlbmRlcmVyJ3MgZG9tIGVsZW1lbnQuXG4gKiBAcGFyYW0gb2JqZWN0VG9Nb3ZlIC0gcmVmZXJlbmNlIHRoZSBvYmplY3QgdG8gY29udHJvbC5cbiAqL1xuZnVuY3Rpb24gT2JqZWN0Q29udHJvbHMoY2FtZXJhLCBkb21FbGVtZW50LCBvYmplY3RUb01vdmUpIHtcbiAgLyoqXG4gICAqIHNldE9iamVjdFRvTW92ZVxuICAgKiBAZGVzY3JpcHRpb24gY2hhbmdlcyB0aGUgb2JqZWN0KHMpIHRvIGNvbnRyb2xcbiAgICogQHBhcmFtIG5ld01lc2ggOiBvbmUgbWVzaCBvciBhbiBhcnJheSBvZiBtZXNoZXNcbiAgICoqL1xuICB0aGlzLnNldE9iamVjdFRvTW92ZSA9IGZ1bmN0aW9uIChuZXdNZXNoKSB7XG4gICAgbWVzaCA9IG5ld01lc2g7XG4gIH07XG5cbiAgdGhpcy5nZXRPYmplY3RUb01vdmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbWVzaDtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXRab29tU3BlZWRcbiAgICogQGRlc2NyaXB0aW9uIHNldHMgYSBjdXN0b20gem9vbSBzcGVlZCAoMC4xID09IHNsb3cgIDEgPT0gZmFzdClcbiAgICogQHBhcmFtIG5ld1pvb21TcGVlZFxuICAgKiovXG4gIHRoaXMuc2V0Wm9vbVNwZWVkID0gZnVuY3Rpb24gKG5ld1pvb21TcGVlZCkge1xuICAgIHpvb21TcGVlZCA9IG5ld1pvb21TcGVlZDtcbiAgfTtcblxuICAvKipcbiAgICogc2V0RGlzdGFuY2VcbiAgICogQGRlc2NyaXB0aW9uIHNldCB0aGUgem9vbSByYW5nZSBkaXN0YW5jZVxuICAgKiBAcGFyYW0ge251bWJlcn0gbWluXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhcbiAgICoqL1xuICB0aGlzLnNldERpc3RhbmNlID0gZnVuY3Rpb24gKG1pbiwgbWF4KSB7XG4gICAgbWluRGlzdGFuY2UgPSBtaW47XG4gICAgbWF4RGlzdGFuY2UgPSBtYXg7XG4gIH07XG5cbiAgLyoqXG4gICAqIHNldFJvdGF0aW9uU3BlZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IG5ld1JvdGF0aW9uU3BlZWQgLSAoMSA9PSBmYXN0KSAgKDAuMDEgPT0gc2xvdylcbiAgICoqL1xuICB0aGlzLnNldFJvdGF0aW9uU3BlZWQgPSBmdW5jdGlvbiAobmV3Um90YXRpb25TcGVlZCkge1xuICAgIHJvdGF0aW9uU3BlZWQgPSBuZXdSb3RhdGlvblNwZWVkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBzZXRSb3RhdGlvblNwZWVkVG91Y2hEZXZpY2VzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdSb3RhdGlvblNwZWVkIC0gKDEgPT0gZmFzdCkgICgwLjAxID09IHNsb3cpXG4gICAqKi9cbiAgdGhpcy5zZXRSb3RhdGlvblNwZWVkVG91Y2hEZXZpY2VzID0gZnVuY3Rpb24gKG5ld1JvdGF0aW9uU3BlZWQpIHtcbiAgICByb3RhdGlvblNwZWVkVG91Y2hEZXZpY2VzID0gbmV3Um90YXRpb25TcGVlZDtcbiAgfTtcblxuICB0aGlzLmVuYWJsZVZlcnRpY2FsUm90YXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmVydGljYWxSb3RhdGlvbkVuYWJsZWQgPSB0cnVlO1xuICB9O1xuXG4gIHRoaXMuZGlzYWJsZVZlcnRpY2FsUm90YXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmVydGljYWxSb3RhdGlvbkVuYWJsZWQgPSBmYWxzZTtcbiAgfTtcblxuICB0aGlzLmVuYWJsZUhvcml6b250YWxSb3RhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBob3Jpem9udGFsUm90YXRpb25FbmFibGVkID0gdHJ1ZTtcbiAgfTtcblxuICB0aGlzLmRpc2FibGVIb3Jpem9udGFsUm90YXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgaG9yaXpvbnRhbFJvdGF0aW9uRW5hYmxlZCA9IGZhbHNlO1xuICB9O1xuXG4gIHRoaXMuc2V0TWF4VmVydGljYWxSb3RhdGlvbkFuZ2xlID0gZnVuY3Rpb24gKG1pbiwgbWF4KSB7XG4gICAgTUFYX1JPVEFUT05fQU5HTEVTLnguZnJvbSA9IG1pbjtcbiAgICBNQVhfUk9UQVRPTl9BTkdMRVMueC50byA9IG1heDtcbiAgICBNQVhfUk9UQVRPTl9BTkdMRVMueC5lbmFibGVkID0gdHJ1ZTtcbiAgfTtcblxuICB0aGlzLnNldE1heEhvcml6b250YWxSb3RhdGlvbkFuZ2xlID0gZnVuY3Rpb24gKG1pbiwgbWF4KSB7XG4gICAgTUFYX1JPVEFUT05fQU5HTEVTLnkuZnJvbSA9IG1pbjtcbiAgICBNQVhfUk9UQVRPTl9BTkdMRVMueS50byA9IG1heDtcbiAgICBNQVhfUk9UQVRPTl9BTkdMRVMueS5lbmFibGVkID0gdHJ1ZTtcbiAgfTtcblxuICB0aGlzLmRpc2FibGVNYXhIb3Jpem9udGFsQW5nbGVSb3RhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBNQVhfUk9UQVRPTl9BTkdMRVMueS5lbmFibGVkID0gZmFsc2U7XG4gIH07XG5cbiAgdGhpcy5kaXNhYmxlTWF4VmVydGljYWxBbmdsZVJvdGF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIE1BWF9ST1RBVE9OX0FOR0xFUy54LmVuYWJsZWQgPSBmYWxzZTtcbiAgfTtcblxuICB0aGlzLmRpc2FibGVab29tID0gZnVuY3Rpb24gKCkge1xuICAgIHpvb21FbmFibGVkID0gZmFsc2U7XG4gIH07XG5cbiAgdGhpcy5lbmFibGVab29tID0gZnVuY3Rpb24gKCkge1xuICAgIHpvb21FbmFibGVkID0gdHJ1ZTtcbiAgfTtcblxuICB0aGlzLmlzVXNlckludGVyYWN0aW9uQWN0aXZlID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gaXNEcmFnZ2luZztcbiAgfVxuXG4gIGRvbUVsZW1lbnQgPSBkb21FbGVtZW50ICE9PSB1bmRlZmluZWQgPyBkb21FbGVtZW50IDogZG9jdW1lbnQ7XG5cbiAgLyoqKioqKioqKioqKioqKioqKioqKiBQcml2YXRlIGNvbnRyb2wgdmFyaWFibGVzICoqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgY29uc3QgTUFYX1JPVEFUT05fQU5HTEVTID0ge1xuICAgIHg6IHtcbiAgICAgIC8vIFZlcnRpY2FsIGZyb20gYm90dG9tIHRvIHRvcC5cbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgZnJvbTogTWF0aC5QSSAvIDgsXG4gICAgICB0bzogTWF0aC5QSSAvIDgsXG4gICAgfSxcbiAgICB5OiB7XG4gICAgICAvLyBIb3Jpem9udGFsIGZyb20gbGVmdCB0byByaWdodC5cbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgZnJvbTogTWF0aC5QSSAvIDQsXG4gICAgICB0bzogTWF0aC5QSSAvIDQsXG4gICAgfSxcbiAgfTtcblxuICBsZXQgZmxhZyxcbiAgICBtZXNoID0gb2JqZWN0VG9Nb3ZlLFxuICAgIG1heERpc3RhbmNlID0gMTUsXG4gICAgbWluRGlzdGFuY2UgPSA2LFxuICAgIHpvb21TcGVlZCA9IDAuNSxcbiAgICByb3RhdGlvblNwZWVkID0gMC4wNSxcbiAgICByb3RhdGlvblNwZWVkVG91Y2hEZXZpY2VzID0gMC4wNSxcbiAgICBpc0RyYWdnaW5nID0gZmFsc2UsXG4gICAgdmVydGljYWxSb3RhdGlvbkVuYWJsZWQgPSBmYWxzZSxcbiAgICBob3Jpem9udGFsUm90YXRpb25FbmFibGVkID0gdHJ1ZSxcbiAgICB6b29tRW5hYmxlZCA9IHRydWUsXG4gICAgbW91c2VGbGFncyA9IHsgTU9VU0VET1dOOiAwLCBNT1VTRU1PVkU6IDEgfSxcbiAgICBwcmV2aW91c01vdXNlUG9zaXRpb24gPSB7IHg6IDAsIHk6IDAgfSxcbiAgICBwcmV2Wm9vbURpZmYgPSB7IFg6IG51bGwsIFk6IG51bGwgfSxcbiAgICAvKipcbiAgICAgKiBDdXJyZW50VG91Y2hlc1xuICAgICAqIGxlbmd0aCAwIDogbm8gem9vbVxuICAgICAqIGxlbmd0aCAyIDogaXMgem9vbW1pbmdcbiAgICAgKi9cbiAgICBjdXJyZW50VG91Y2hlcyA9IFtdO1xuXG4gIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBQcml2YXRlIHNoYXJlZCBmdW5jdGlvbnMgKioqKioqKioqKioqKioqKioqKioqKi9cblxuICBmdW5jdGlvbiB6b29tSW4oKSB7XG4gICAgY2FtZXJhLnBvc2l0aW9uLnogLT0gem9vbVNwZWVkO1xuICB9XG5cbiAgZnVuY3Rpb24gem9vbU91dCgpIHtcbiAgICBjYW1lcmEucG9zaXRpb24ueiArPSB6b29tU3BlZWQ7XG4gIH1cblxuICBmdW5jdGlvbiByb3RhdGVWZXJ0aWNhbChkZWx0YU1vdmUsIG1lc2gpIHtcbiAgICBpZiAobWVzaC5sZW5ndGggPiAxKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc2gubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm90YXRlVmVydGljYWwoZGVsdGFNb3ZlLCBtZXNoW2ldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbWVzaC5yb3RhdGlvbi54ICs9IE1hdGguc2lnbihkZWx0YU1vdmUueSkgKiByb3RhdGlvblNwZWVkO1xuICB9XG5cbiAgZnVuY3Rpb24gcm90YXRlVmVydGljYWxUb3VjaChkZWx0YU1vdmUsIG1lc2gpIHtcbiAgICBpZiAobWVzaC5sZW5ndGggPiAxKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc2gubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm90YXRlVmVydGljYWxUb3VjaChkZWx0YU1vdmUsIG1lc2hbaV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtZXNoLnJvdGF0aW9uLnggKz0gTWF0aC5zaWduKGRlbHRhTW92ZS55KSAqIHJvdGF0aW9uU3BlZWRUb3VjaERldmljZXM7XG4gIH1cblxuICBmdW5jdGlvbiByb3RhdGVIb3Jpem9udGFsKGRlbHRhTW92ZSwgbWVzaCkge1xuICAgIGlmIChtZXNoLmxlbmd0aCA+IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVzaC5sZW5ndGg7IGkrKykge1xuICAgICAgICByb3RhdGVIb3Jpem9udGFsKGRlbHRhTW92ZSwgbWVzaFtpXSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1lc2gucm90YXRpb24ueSArPSBNYXRoLnNpZ24oZGVsdGFNb3ZlLngpICogcm90YXRpb25TcGVlZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJvdGF0ZUhvcml6b250YWxUb3VjaChkZWx0YU1vdmUsIG1lc2gpIHtcbiAgICBpZiAobWVzaC5sZW5ndGggPiAxKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc2gubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm90YXRlSG9yaXpvbnRhbFRvdWNoKGRlbHRhTW92ZSwgbWVzaFtpXSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1lc2gucm90YXRpb24ueSArPSBNYXRoLnNpZ24oZGVsdGFNb3ZlLngpICogcm90YXRpb25TcGVlZFRvdWNoRGV2aWNlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBpc1dpdGhpbk1heEFuZ2xlXG4gICAqIEBkZXNjcmlwdGlvbiBDaGVja3MgaWYgdGhlIHJvdGF0aW9uIGluIGEgc3BlY2lmaWMgYXhlIGlzIHdpdGhpbiB0aGUgbWF4aW11bVxuICAgKiB2YWx1ZXMgYWxsb3dlZC5cbiAgICogQHBhcmFtIGRlbHRhIGlzIHRoZSBkaWZmZXJlbmNlIG9mIHRoZSBjdXJyZW50IHJvdGF0aW9uIGFuZ2xlIGFuZCB0aGVcbiAgICogICAgIGV4cGVjdGVkIHJvdGF0aW9uIGFuZ2xlXG4gICAqIEBwYXJhbSBheGUgaXMgdGhlIGF4ZSBvZiByb3RhdGlvbjogeCh2ZXJ0aWNhbCByb3RhdGlvbiksIHkgKGhvcml6b250YWxcbiAgICogICAgIHJvdGF0aW9uKVxuICAgKiBAcmV0dXJuIHRydWUgaWYgdGhlIHJvdGF0aW9uIHdpdGggdGhlIG5ldyBkZWx0YSBpcyBpbmNsdWRlZCBpbnRvIHRoZVxuICAgKiAgICAgYWxsb3dlZCBhbmdsZSByYW5nZSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBmdW5jdGlvbiBpc1dpdGhpbk1heEFuZ2xlKGRlbHRhLCBheGUpIHtcbiAgICBpZiAoTUFYX1JPVEFUT05fQU5HTEVTW2F4ZV0uZW5hYmxlZCkge1xuICAgICAgaWYgKG1lc2gubGVuZ3RoID4gMSkge1xuICAgICAgICBsZXQgY29uZGl0aW9uID0gdHJ1ZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKCFjb25kaXRpb24pIHJldHVybiBmYWxzZTtcbiAgICAgICAgICBpZiAoTUFYX1JPVEFUT05fQU5HTEVTW2F4ZV0uZW5hYmxlZCkge1xuICAgICAgICAgICAgY29uZGl0aW9uID0gaXNSb3RhdGlvbldpdGhpbk1heEFuZ2xlcyhtZXNoW2ldLCBkZWx0YSwgYXhlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbmRpdGlvbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpc1JvdGF0aW9uV2l0aGluTWF4QW5nbGVzKG1lc2gsIGRlbHRhLCBheGUpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUm90YXRpb25XaXRoaW5NYXhBbmdsZXMobWVzaFRvUm90YXRlLCBkZWx0YSwgYXhlKSB7XG4gICAgcmV0dXJuIE1BWF9ST1RBVE9OX0FOR0xFU1theGVdLmZyb20gKiAtMSA8XG4gICAgICBtZXNoVG9Sb3RhdGUucm90YXRpb25bYXhlXSArIGRlbHRhICYmXG4gICAgICBtZXNoVG9Sb3RhdGUucm90YXRpb25bYXhlXSArIGRlbHRhIDwgTUFYX1JPVEFUT05fQU5HTEVTW2F4ZV0udG9cbiAgICAgID8gdHJ1ZVxuICAgICAgOiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0TW91c2VQb3NpdGlvbigpIHtcbiAgICBwcmV2aW91c01vdXNlUG9zaXRpb24gPSB7IHg6IDAsIHk6IDAgfTtcbiAgfVxuXG4gIC8qKioqKioqKioqKioqKioqKiogIE1PVVNFIGludGVyYWN0aW9uIGZ1bmN0aW9ucyAtIGRlc2t0b3AgICoqKioqL1xuICBmdW5jdGlvbiBtb3VzZURvd24oZSkge1xuICAgIGlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgIGZsYWcgPSBtb3VzZUZsYWdzLk1PVVNFRE9XTjtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNlTW92ZShlKSB7XG4gICAgaWYgKGlzRHJhZ2dpbmcpIHtcbiAgICAgIGNvbnN0IGRlbHRhTW92ZSA9IHtcbiAgICAgICAgeDogZS5vZmZzZXRYIC0gcHJldmlvdXNNb3VzZVBvc2l0aW9uLngsXG4gICAgICAgIHk6IGUub2Zmc2V0WSAtIHByZXZpb3VzTW91c2VQb3NpdGlvbi55LFxuICAgICAgfTtcblxuICAgICAgcHJldmlvdXNNb3VzZVBvc2l0aW9uID0geyB4OiBlLm9mZnNldFgsIHk6IGUub2Zmc2V0WSB9O1xuXG4gICAgICBpZiAoaG9yaXpvbnRhbFJvdGF0aW9uRW5hYmxlZCAmJiBkZWx0YU1vdmUueCAhPSAwKSB7XG4gICAgICAgIC8vICYmIChNYXRoLmFicyhkZWx0YU1vdmUueCkgPiBNYXRoLmFicyhkZWx0YU1vdmUueSkpKSB7XG4gICAgICAgIC8vIGVuYWJsaW5nIHRoaXMsIHRoZSBtZXNoIHdpbGwgcm90YXRlIG9ubHkgaW4gb25lIHNwZWNpZmljIGRpcmVjdGlvblxuICAgICAgICAvLyBmb3IgbW91c2UgbW92ZW1lbnRcbiAgICAgICAgaWYgKCFpc1dpdGhpbk1heEFuZ2xlKE1hdGguc2lnbihkZWx0YU1vdmUueCkgKiByb3RhdGlvblNwZWVkLCBcInlcIikpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICByb3RhdGVIb3Jpem9udGFsKGRlbHRhTW92ZSwgbWVzaCk7XG4gICAgICAgIGZsYWcgPSBtb3VzZUZsYWdzLk1PVVNFTU9WRTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZlcnRpY2FsUm90YXRpb25FbmFibGVkICYmIGRlbHRhTW92ZS55ICE9IDApIHtcbiAgICAgICAgLy8gJiYoTWF0aC5hYnMoZGVsdGFNb3ZlLnkpID4gTWF0aC5hYnMoZGVsdGFNb3ZlLngpKSAvL1xuICAgICAgICAvLyBlbmFibGluZyB0aGlzLCB0aGUgbWVzaCB3aWxsIHJvdGF0ZSBvbmx5IGluIG9uZSBzcGVjaWZpYyBkaXJlY3Rpb24gZm9yXG4gICAgICAgIC8vIG1vdXNlIG1vdmVtZW50XG4gICAgICAgIGlmICghaXNXaXRoaW5NYXhBbmdsZShNYXRoLnNpZ24oZGVsdGFNb3ZlLnkpICogcm90YXRpb25TcGVlZCwgXCJ4XCIpKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcm90YXRlVmVydGljYWwoZGVsdGFNb3ZlLCBtZXNoKTtcbiAgICAgICAgZmxhZyA9IG1vdXNlRmxhZ3MuTU9VU0VNT1ZFO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNlVXAoKSB7XG4gICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgIHJlc2V0TW91c2VQb3NpdGlvbigpO1xuICB9XG5cbiAgZnVuY3Rpb24gd2hlZWwoZSkge1xuICAgIGlmICghem9vbUVuYWJsZWQpIHJldHVybjtcbiAgICBjb25zdCBkZWx0YSA9IGUud2hlZWxEZWx0YSA/IGUud2hlZWxEZWx0YSA6IGUuZGVsdGFZICogLTE7XG4gICAgaWYgKGRlbHRhID4gMCAmJiBjYW1lcmEucG9zaXRpb24ueiA+IG1pbkRpc3RhbmNlKSB7XG4gICAgICB6b29tSW4oKTtcbiAgICB9IGVsc2UgaWYgKGRlbHRhIDwgMCAmJiBjYW1lcmEucG9zaXRpb24ueiA8IG1heERpc3RhbmNlKSB7XG4gICAgICB6b29tT3V0KCk7XG4gICAgfVxuICB9XG4gIC8qKioqKioqKioqKioqKioqKiogVE9VQ0ggaW50ZXJhY3Rpb24gZnVuY3Rpb25zIC0gbW9iaWxlICAqKioqKi9cblxuICBmdW5jdGlvbiBvblRvdWNoU3RhcnQoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBmbGFnID0gbW91c2VGbGFncy5NT1VTRURPV047XG4gICAgaWYgKGUudG91Y2hlcy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHByZXZab29tRGlmZi5YID0gTWF0aC5hYnMoZS50b3VjaGVzWzBdLmNsaWVudFggLSBlLnRvdWNoZXNbMV0uY2xpZW50WCk7XG4gICAgICBwcmV2Wm9vbURpZmYuWSA9IE1hdGguYWJzKGUudG91Y2hlc1swXS5jbGllbnRZIC0gZS50b3VjaGVzWzFdLmNsaWVudFkpO1xuICAgICAgY3VycmVudFRvdWNoZXMgPSBuZXcgQXJyYXkoMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZXZpb3VzTW91c2VQb3NpdGlvbiA9IHsgeDogZS50b3VjaGVzWzBdLnBhZ2VYLCB5OiBlLnRvdWNoZXNbMF0ucGFnZVkgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvblRvdWNoRW5kKGUpIHtcbiAgICBwcmV2Wm9vbURpZmYuWCA9IG51bGw7XG4gICAgcHJldlpvb21EaWZmLlkgPSBudWxsO1xuXG4gICAgLyogSWYgeW91IHdlcmUgem9vbWluZyBvdXQsIGN1cnJlbnRUb3VjaGVzIGlzIHVwZGF0ZWQgZm9yIGVhY2ggZmluZ2VyIHlvdVxuICAgICAqIGxlYXZlIHVwIHRoZSBzY3JlZW4gc28gZWFjaCB0aW1lIGEgZmluZ2VyIGxlYXZlcyB1cCB0aGUgc2NyZWVuLFxuICAgICAqIGN1cnJlbnRUb3VjaGVzIGxlbmd0aCBpcyBkZWNyZWFzZWQgb2YgYSB1bml0LiBXaGVuIHlvdSBsZWF2ZSB1cCBib3RoIDJcbiAgICAgKiBmaW5nZXJzLCBjdXJyZW50VG91Y2hlcy5sZW5ndGggaXMgMCwgdGhpcyBtZWFucyB0aGUgem9vbW1pbmcgcGhhc2UgaXNcbiAgICAgKiBlbmRlZC5cbiAgICAgKi9cbiAgICBpZiAoY3VycmVudFRvdWNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgY3VycmVudFRvdWNoZXMucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRUb3VjaGVzID0gW107XG4gICAgfVxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoZmxhZyA9PT0gbW91c2VGbGFncy5NT1VTRURPV04pIHtcbiAgICAgIC8vIFRvdWNoQ2xpY2tcbiAgICAgIC8vIFlvdSBjYW4gaW52b2tlIG1vcmUgb3RoZXIgZnVuY3Rpb25zIGZvciBhbmltYXRpb25zIGFuZCBzbyBvbi4uLlxuICAgIH0gZWxzZSBpZiAoZmxhZyA9PT0gbW91c2VGbGFncy5NT1VTRU1PVkUpIHtcbiAgICAgIC8vIFRvdWNoIGRyYWdcbiAgICAgIC8vIFlvdSBjYW4gaW52b2tlIG1vcmUgb3RoZXIgZnVuY3Rpb25zIGZvciBhbmltYXRpb25zIGFuZCBzbyBvbi4uLlxuICAgIH1cbiAgICByZXNldE1vdXNlUG9zaXRpb24oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uVG91Y2hNb3ZlKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZmxhZyA9IG1vdXNlRmxhZ3MuTU9VU0VNT1ZFO1xuICAgIC8vIFRvdWNoIHpvb20uXG4gICAgLy8gSWYgdHdvIHBvaW50ZXJzIGFyZSBkb3duLCBjaGVjayBmb3IgcGluY2ggZ2VzdHVyZXMuXG4gICAgaWYgKGUudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgem9vbUVuYWJsZWQpIHtcbiAgICAgIGN1cnJlbnRUb3VjaGVzID0gbmV3IEFycmF5KDIpO1xuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSB0d28gcG9pbnRlcnMuXG4gICAgICBjb25zdCBjdXJEaWZmWCA9IE1hdGguYWJzKGUudG91Y2hlc1swXS5jbGllbnRYIC0gZS50b3VjaGVzWzFdLmNsaWVudFgpO1xuICAgICAgY29uc3QgY3VyRGlmZlkgPSBNYXRoLmFicyhlLnRvdWNoZXNbMF0uY2xpZW50WSAtIGUudG91Y2hlc1sxXS5jbGllbnRZKTtcblxuICAgICAgaWYgKHByZXZab29tRGlmZiAmJiBwcmV2Wm9vbURpZmYuWCA+IDAgJiYgcHJldlpvb21EaWZmLlkgPiAwKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBjdXJEaWZmWCA+IHByZXZab29tRGlmZi5YICYmXG4gICAgICAgICAgY3VyRGlmZlkgPiBwcmV2Wm9vbURpZmYuWSAmJlxuICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi56ID4gbWluRGlzdGFuY2VcbiAgICAgICAgKSB7XG4gICAgICAgICAgem9vbUluKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgY3VyRGlmZlggPCBwcmV2Wm9vbURpZmYuWCAmJlxuICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi56IDwgbWF4RGlzdGFuY2UgJiZcbiAgICAgICAgICBjdXJEaWZmWSA8IHByZXZab29tRGlmZi5ZXG4gICAgICAgICkge1xuICAgICAgICAgIHpvb21PdXQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gQ2FjaGUgdGhlIGRpc3RhbmNlIGZvciB0aGUgbmV4dCBtb3ZlIGV2ZW50LlxuICAgICAgcHJldlpvb21EaWZmLlggPSBjdXJEaWZmWDtcbiAgICAgIHByZXZab29tRGlmZi5ZID0gY3VyRGlmZlk7XG5cbiAgICAgIC8vIFRvdWNoIFJvdGF0ZS5cbiAgICB9IGVsc2UgaWYgKGN1cnJlbnRUb3VjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcHJldlpvb21EaWZmLlggPSBudWxsO1xuICAgICAgcHJldlpvb21EaWZmLlkgPSBudWxsO1xuICAgICAgY29uc3QgZGVsdGFNb3ZlID0ge1xuICAgICAgICB4OiBlLnRvdWNoZXNbMF0ucGFnZVggLSBwcmV2aW91c01vdXNlUG9zaXRpb24ueCxcbiAgICAgICAgeTogZS50b3VjaGVzWzBdLnBhZ2VZIC0gcHJldmlvdXNNb3VzZVBvc2l0aW9uLnksXG4gICAgICB9O1xuICAgICAgcHJldmlvdXNNb3VzZVBvc2l0aW9uID0geyB4OiBlLnRvdWNoZXNbMF0ucGFnZVgsIHk6IGUudG91Y2hlc1swXS5wYWdlWSB9O1xuXG4gICAgICBpZiAoaG9yaXpvbnRhbFJvdGF0aW9uRW5hYmxlZCAmJiBkZWx0YU1vdmUueCAhPSAwKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhaXNXaXRoaW5NYXhBbmdsZShcbiAgICAgICAgICAgIE1hdGguc2lnbihkZWx0YU1vdmUueCkgKiByb3RhdGlvblNwZWVkVG91Y2hEZXZpY2VzLFxuICAgICAgICAgICAgXCJ5XCJcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIHJvdGF0ZUhvcml6b250YWxUb3VjaChkZWx0YU1vdmUsIG1lc2gpO1xuICAgICAgfVxuXG4gICAgICBpZiAodmVydGljYWxSb3RhdGlvbkVuYWJsZWQgJiYgZGVsdGFNb3ZlLnkgIT0gMCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIWlzV2l0aGluTWF4QW5nbGUoXG4gICAgICAgICAgICBNYXRoLnNpZ24oZGVsdGFNb3ZlLnkpICogcm90YXRpb25TcGVlZFRvdWNoRGV2aWNlcyxcbiAgICAgICAgICAgIFwieFwiXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICByb3RhdGVWZXJ0aWNhbFRvdWNoKGRlbHRhTW92ZSwgbWVzaCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqKioqKioqKioqKioqKioqKioqKiBFdmVudCBMaXN0ZW5lcnMgKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAvKiogTW91c2UgSW50ZXJhY3Rpb24gQ29udHJvbHMgKHJvdGF0ZSAmIHpvb20sIGRlc2t0b3AgKiovXG4gIC8vIE1vdXNlIC0gbW92ZVxuICBkb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2VEb3duLCBmYWxzZSk7XG4gIGRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZU1vdmUsIGZhbHNlKTtcbiAgZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZVVwLCBmYWxzZSk7XG4gIGRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIG1vdXNlVXAsIGZhbHNlKTtcblxuICAvLyBNb3VzZSAtIHpvb21cbiAgZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwid2hlZWxcIiwgd2hlZWwsIGZhbHNlKTtcblxuICAvKiogVG91Y2ggSW50ZXJhY3Rpb24gQ29udHJvbHMgKHJvdGF0ZSAmIHpvb20sIG1vYmlsZSkgKiovXG4gIC8vIFRvdWNoIC0gbW92ZVxuICBkb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIG9uVG91Y2hTdGFydCwgZmFsc2UpO1xuICBkb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgb25Ub3VjaE1vdmUsIGZhbHNlKTtcbiAgZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgb25Ub3VjaEVuZCwgZmFsc2UpO1xufVxuXG5leHBvcnQgeyBPYmplY3RDb250cm9scyB9O1xuIiwiY29uc3QgY3JlYXRlQVJCdG4gPSAocmVuZGVyZXIpID0+IHtcblx0Y2xhc3MgQVJCdXR0b24ge1xuXHRcdHN0YXRpYyBjcmVhdGVCdXR0b24ocmVuZGVyZXIsIHNlc3Npb25Jbml0ID0ge30pIHtcblx0XHRcdGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG5cdFx0XHRjb25zdCBidXR0b25Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVpLWNvbnRhaW5lclwiKTtcblxuXHRcdFx0ZnVuY3Rpb24gc2hvd1N0YXJ0QVIoLypkZXZpY2UqLykge1xuXHRcdFx0XHRpZiAoc2Vzc2lvbkluaXQuZG9tT3ZlcmxheSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRcdFx0b3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KTtcblxuXHRcdFx0XHRcdGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcblx0XHRcdFx0XHRcdFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcblx0XHRcdFx0XHRcdFwic3ZnXCJcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHN2Zy5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCAzOCk7XG5cdFx0XHRcdFx0c3ZnLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCAzOCk7XG5cdFx0XHRcdFx0c3ZnLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuXHRcdFx0XHRcdHN2Zy5zdHlsZS5yaWdodCA9IFwiMjBweFwiO1xuXHRcdFx0XHRcdHN2Zy5zdHlsZS50b3AgPSBcIjIwcHhcIjtcblx0XHRcdFx0XHRzdmcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uLmVuZCgpO1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdG92ZXJsYXkuYXBwZW5kQ2hpbGQoc3ZnKTtcblxuXHRcdFx0XHRcdGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG5cdFx0XHRcdFx0XHRcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG5cdFx0XHRcdFx0XHRcInBhdGhcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0cGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwiTSAxMiwxMiBMIDI4LDI4IE0gMjgsMTIgMTIsMjhcIik7XG5cdFx0XHRcdFx0cGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgXCIjZmZmXCIpO1xuXHRcdFx0XHRcdHBhdGguc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIDIpO1xuXHRcdFx0XHRcdHN2Zy5hcHBlbmRDaGlsZChwYXRoKTtcblxuXHRcdFx0XHRcdGlmIChzZXNzaW9uSW5pdC5vcHRpb25hbEZlYXR1cmVzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHNlc3Npb25Jbml0Lm9wdGlvbmFsRmVhdHVyZXMgPSBbXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzZXNzaW9uSW5pdC5vcHRpb25hbEZlYXR1cmVzLnB1c2goXCJkb20tb3ZlcmxheVwiKTtcblx0XHRcdFx0XHRzZXNzaW9uSW5pdC5kb21PdmVybGF5ID0geyByb290OiBvdmVybGF5IH07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL1xuXG5cdFx0XHRcdGxldCBjdXJyZW50U2Vzc2lvbiA9IG51bGw7XG5cblx0XHRcdFx0YXN5bmMgZnVuY3Rpb24gb25TZXNzaW9uU3RhcnRlZChzZXNzaW9uKSB7XG5cdFx0XHRcdFx0c2Vzc2lvbi5hZGRFdmVudExpc3RlbmVyKFwiZW5kXCIsIG9uU2Vzc2lvbkVuZGVkKTtcblxuXHRcdFx0XHRcdHJlbmRlcmVyLnhyLnNldFJlZmVyZW5jZVNwYWNlVHlwZShcImxvY2FsXCIpO1xuXG5cdFx0XHRcdFx0YXdhaXQgcmVuZGVyZXIueHIuc2V0U2Vzc2lvbihzZXNzaW9uKTtcblxuXHRcdFx0XHRcdGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU1RPUCBBUlwiO1xuXHRcdFx0XHRcdHNlc3Npb25Jbml0LmRvbU92ZXJsYXkucm9vdC5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcblxuXHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uID0gc2Vzc2lvbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZ1bmN0aW9uIG9uU2Vzc2lvbkVuZGVkKC8qZXZlbnQqLykge1xuXHRcdFx0XHRcdGN1cnJlbnRTZXNzaW9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlbmRcIiwgb25TZXNzaW9uRW5kZWQpO1xuXG5cdFx0XHRcdFx0YnV0dG9uLnRleHRDb250ZW50ID0gXCJTVEFSVCBBUlwiO1xuXHRcdFx0XHRcdHNlc3Npb25Jbml0LmRvbU92ZXJsYXkucm9vdC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cblx0XHRcdFx0XHRjdXJyZW50U2Vzc2lvbiA9IG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cblx0XHRcdFx0YnV0dG9uLnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUubGVmdCA9IFwiY2FsYyg1MCUgLSA1MHB4KVwiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcblxuXHRcdFx0XHRidXR0b24udGV4dENvbnRlbnQgPSBcIlNUQVJUIEFSXCI7XG5cblx0XHRcdFx0YnV0dG9uLm9ubW91c2VlbnRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRidXR0b24uc3R5bGUub3BhY2l0eSA9IFwiMS4wXCI7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0YnV0dG9uLm9ubW91c2VsZWF2ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRidXR0b24uc3R5bGUub3BhY2l0eSA9IFwiMC44XCI7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0YnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0aWYgKGN1cnJlbnRTZXNzaW9uID09PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRuYXZpZ2F0b3IueHJcblx0XHRcdFx0XHRcdFx0LnJlcXVlc3RTZXNzaW9uKFwiaW1tZXJzaXZlLWFyXCIsIHNlc3Npb25Jbml0KVxuXHRcdFx0XHRcdFx0XHQudGhlbihvblNlc3Npb25TdGFydGVkKTtcblx0XHRcdFx0XHRcdGJ1dHRvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcblx0XHRcdFx0XHRcdGJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y3VycmVudFNlc3Npb24uZW5kKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBkaXNhYmxlQnV0dG9uKCkge1xuXHRcdFx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG5cblx0XHRcdFx0YnV0dG9uLnN0eWxlLmN1cnNvciA9IFwiYXV0b1wiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUubGVmdCA9IFwiY2FsYyg1MCUgLSA3NXB4KVwiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUud2lkdGggPSBcIjE1MHB4XCI7XG5cblx0XHRcdFx0YnV0dG9uLm9ubW91c2VlbnRlciA9IG51bGw7XG5cdFx0XHRcdGJ1dHRvbi5vbm1vdXNlbGVhdmUgPSBudWxsO1xuXG5cdFx0XHRcdGJ1dHRvbi5vbmNsaWNrID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gc2hvd0FSTm90U3VwcG9ydGVkKCkge1xuXHRcdFx0XHRkaXNhYmxlQnV0dG9uKCk7XG5cblx0XHRcdFx0YnV0dG9uLnRleHRDb250ZW50ID0gXCJBUiBOT1QgU1VQUE9SVEVEXCI7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHNob3dBUk5vdEFsbG93ZWQoZXhjZXB0aW9uKSB7XG5cdFx0XHRcdGRpc2FibGVCdXR0b24oKTtcblxuXHRcdFx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcdFx0XCJFeGNlcHRpb24gd2hlbiB0cnlpbmcgdG8gY2FsbCB4ci5pc1Nlc3Npb25TdXBwb3J0ZWRcIixcblx0XHRcdFx0XHRleGNlcHRpb25cblx0XHRcdFx0KTtcblxuXHRcdFx0XHRidXR0b24udGV4dENvbnRlbnQgPSBcIkFSIE5PVCBBTExPV0VEXCI7XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHN0eWxpemVFbGVtZW50KGVsZW1lbnQpIHtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5wYWRkaW5nID0gXCIxZW0gMC4yZW1cIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZCAjZmZmXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIxNXB4XCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IFwiI2Q5YWYyYlwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmNvbG9yID0gXCIjZmZmXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuZm9udCA9IFwibm9ybWFsIDMuNWVtIHNhbnMtc2VyaWZcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5vdXRsaW5lID0gXCJub25lXCI7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCI5OTlcIjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKFwieHJcIiBpbiBuYXZpZ2F0b3IpIHtcblx0XHRcdFx0YnV0dG9uLmlkID0gXCJBUkJ1dHRvblwiO1xuXHRcdFx0XHRidXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG5cdFx0XHRcdHN0eWxpemVFbGVtZW50KGJ1dHRvbik7XG5cblx0XHRcdFx0bmF2aWdhdG9yLnhyXG5cdFx0XHRcdFx0LmlzU2Vzc2lvblN1cHBvcnRlZChcImltbWVyc2l2ZS1hclwiKVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChzdXBwb3J0ZWQpIHtcblx0XHRcdFx0XHRcdHN1cHBvcnRlZCA/IHNob3dTdGFydEFSKCkgOiBzaG93QVJOb3RTdXBwb3J0ZWQoKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChzaG93QVJOb3RBbGxvd2VkKTtcblxuXHRcdFx0XHRyZXR1cm4gYnV0dG9uO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuXG5cdFx0XHRcdGlmICh3aW5kb3cuaXNTZWN1cmVDb250ZXh0ID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdG1lc3NhZ2UuaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWYucmVwbGFjZShcblx0XHRcdFx0XHRcdC9eaHR0cDovLFxuXHRcdFx0XHRcdFx0XCJodHRwczpcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0bWVzc2FnZS5pbm5lckhUTUwgPSBcIldFQlhSIE5FRURTIEhUVFBTXCI7IC8vIFRPRE8gSW1wcm92ZSBtZXNzYWdlXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bWVzc2FnZS5ocmVmID0gXCJodHRwczovL2ltbWVyc2l2ZXdlYi5kZXYvXCI7XG5cdFx0XHRcdFx0bWVzc2FnZS5pbm5lckhUTUwgPSBcIldFQlhSIE5PVCBBVkFJTEFCTEVcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG1lc3NhZ2Uuc3R5bGUubGVmdCA9IFwiY2FsYyg1MCUgLSA5MHB4KVwiO1xuXHRcdFx0XHRtZXNzYWdlLnN0eWxlLndpZHRoID0gXCIxODBweFwiO1xuXHRcdFx0XHRtZXNzYWdlLnN0eWxlLnRleHREZWNvcmF0aW9uID0gXCJub25lXCI7XG5cblx0XHRcdFx0c3R5bGl6ZUVsZW1lbnQobWVzc2FnZSk7XG5cblx0XHRcdFx0cmV0dXJuIG1lc3NhZ2U7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgYnV0dG9uID0gQVJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyLCB7XG5cdFx0cmVxdWlyZWRGZWF0dXJlczogW1wiaGl0LXRlc3RcIl0sXG5cdH0pO1xuXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidWktY29udGFpbmVyXCIpLmFwcGVuZENoaWxkKGJ1dHRvbik7XG5cblx0cmV0dXJuIHsgYnV0dG9uIH07XG59O1xuXG5leHBvcnQgeyBjcmVhdGVBUkJ0biB9O1xuIiwiY29uc3QgYW1iaWVudCA9IG5ldyBUZXRhdmkuVEhSRUUuQW1iaWVudExpZ2h0KDB4OTk5OTk5KTtcblxuY29uc3Qgc3BvdExpZ2h0ID0gbmV3IFRldGF2aS5USFJFRS5TcG90TGlnaHQoMHhmZmZmZmYpO1xuc3BvdExpZ2h0LnBvc2l0aW9uLnNldCgwLCA1LCAwKTtcbnNwb3RMaWdodC5jYXN0U2hhZG93ID0gZmFsc2U7XG5zcG90TGlnaHQuYW5nbGUgPSBNYXRoLlBJIC8gNDtcbnNwb3RMaWdodC5wZW51bWJyYSA9IDAuMTtcbnNwb3RMaWdodC5kZWNheSA9IDI7XG5zcG90TGlnaHQuZGlzdGFuY2UgPSAyMDA7XG5cbmV4cG9ydCB7IGFtYmllbnQsIHNwb3RMaWdodCB9O1xuIiwiY29uc3QgcGxheVZpZGVvID0gKGJ1dHRvbiwgdGV0YXZpLCBzY2VuZSkgPT4ge1xuXHRsZXQgZmlyc3RQbGF5ID0gdHJ1ZTtcblxuXHRjb25zdCBwaXZvdCA9IG5ldyBUZXRhdmkuVEhSRUUuT2JqZWN0M0QoKTtcblxuXHRjb25zdCBwbGF5U3RvcCA9ICgpID0+IHtcblx0XHRpZiAoZmlyc3RQbGF5KSB7XG5cdFx0XHRmaXJzdFBsYXkgPSBmYWxzZTtcblxuXHRcdFx0dGV0YXZpLmdldFNyY1ZpZGVvKCkubXV0ZWQgPSB0cnVlO1xuXG5cdFx0XHR0ZXRhdmkucGxheSgpO1xuXG5cdFx0XHRwaXZvdC5hZGQodGV0YXZpLmdldFNjZW5lKCkpO1xuXG5cdFx0XHRwaXZvdC52aXNpYmxlID0gZmFsc2U7XG5cblx0XHRcdHNjZW5lLmFkZChwaXZvdCk7XG5cblx0XHRcdGNvbnNvbGUubG9nKHRldGF2aSk7XG5cdFx0XHRjb25zb2xlLmxvZyh0ZXRhdmkuZ2V0U2NlbmUoKSk7XG5cdFx0fVxuXHR9O1xuXHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHBsYXlTdG9wKTtcblxuXHRyZXR1cm4geyBwaXZvdCB9O1xufTtcblxuZXhwb3J0IHsgcGxheVZpZGVvIH07XG4iLCJjb25zdCBjcmVhdGVSZW5kZXJlciA9IChjYW1lcmEpID0+IHtcblx0Y29uc3QgcmVuZGVyZXIgPSBuZXcgVGV0YXZpLlRIUkVFLldlYkdMUmVuZGVyZXIoe1xuXHRcdGFudGlhbGlhczogdHJ1ZSxcblx0XHRhbHBoYTogdHJ1ZSxcblx0fSk7XG5cdHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuXHRyZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXHRyZW5kZXJlci54ci5lbmFibGVkID0gdHJ1ZTtcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuXHRjb25zdCBjb250cm9scyA9IG5ldyBUZXRhdmlFeHQubGliT3JiaXRDb250cm9scyhcblx0XHRjYW1lcmEsXG5cdFx0cmVuZGVyZXIuZG9tRWxlbWVudFxuXHQpO1xuXHRjb250cm9scy50YXJnZXQuc2V0KDAsIDEuNSwgMCk7XG5cblx0Y2FtZXJhLnBvc2l0aW9uLnogPSA1O1xuXHRjYW1lcmEucG9zaXRpb24ueSA9IDEuNTtcblxuXHRjb250cm9scy51cGRhdGUoKTtcblxuXHRjb25zb2xlLmxvZyhjb250cm9scyk7XG5cblx0ZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG5cdFx0Y2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuXHRcdGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cblx0XHRyZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXHR9XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUpO1xuXG5cdHJldHVybiB7IHJlbmRlcmVyLCBjb250cm9scyB9O1xufTtcblxuZXhwb3J0IHsgY3JlYXRlUmVuZGVyZXIgfTtcbiIsImNvbnN0IHNjZW5lID0gbmV3IFRldGF2aS5USFJFRS5TY2VuZSgpO1xuXG5jb25zdCBjYW1lcmEgPSBuZXcgVGV0YXZpLlRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuXHQ3MCxcblx0d2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG5cdDAuMDEsXG5cdDIwXG4pO1xuXG5leHBvcnQgeyBzY2VuZSwgY2FtZXJhIH07XG4iLCJjb25zdCBjcmVhdGVUZXRhdmkgPSAoY2FtZXJhLCByZW5kZXJlcikgPT4ge1xuXHRjb25zdCBsb2FkaW5nUGFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZGluZy1wYWdlXCIpO1xuXG5cdGZ1bmN0aW9uIG9uTG9nKGxvZykge1xuXHRcdGNvbnNvbGUubG9nKGxvZyk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRCYXIod2lkdGgsIHdpZHRoUGxheSkge1xuXHRcdGlmICh0ZXRhdmkgIT0gbnVsbCkge1xuXHRcdFx0aWYgKHdpZHRoUGxheSAvIHdpZHRoID4gMC4wMSAmJiB0ZXRhdmkuaXNSZWFkeSgpKSB7XG5cdFx0XHRcdGxvYWRpbmdQYWdlLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGNvbnN0IHRldGF2aSA9IFRldGF2aS5jcmVhdGUoXG5cdFx0cmVuZGVyZXIsXG5cdFx0Y2FtZXJhLFxuXHRcdFwiLi93dGV0LzIvdGV4dHVyZXNWaWRlby5tcDRcIixcblx0XHRcIi4vd3RldC8yL0dlb21ldHJ5Lm1hbmlmZXN0XCJcblx0KVxuXHRcdC5vblNldEJhcihzZXRCYXIpXG5cdFx0LnNldEZhZGVBbHBoYShmYWxzZSlcblx0XHQub25Mb2cob25Mb2cpO1xuXG5cdHRldGF2aS5zZXRTaGFkb3dWaXNpYmxlKGZhbHNlKTtcblxuXHRmdW5jdGlvbiByZXF1aXJlKHN0cikge1xuXHRcdHJldHVybiBcIi4vYXJjaGl2b3MyLzIvXCIgKyBzdHI7XG5cdH1cblxuXHRyZXR1cm4geyB0ZXRhdmkgfTtcbn07XG5cbmV4cG9ydCB7IGNyZWF0ZVRldGF2aSB9O1xuIiwiY29uc3QgY2FsbEFuaW1hdGlvbiA9ICh0ZXRhdmksIHNjZW5lLCBjYW1lcmEsIHBpdm90LCBjb250cm9scywgcmVuZGVyZXIpID0+IHtcblx0bGV0IHNldHRpbmdQb3NpdGlvbiA9IHRydWU7XG5cdC8qY29uc3QgcG9zaXRpb25CdG5Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcblx0XHRcImNoYW5nZS1wb3NpdGlvbi1jb250YWluZXJcIlxuXHQpO1xuXHRjb25zdCBwb3NpdGlvbkJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhbmdlLXBvc2l0aW9uXCIpOyovXG5cdGxldCB2aWRlbztcblx0Y29uc3QgZ2VvbWV0cnkgPSBuZXcgVGV0YXZpLlRIUkVFLlJpbmdHZW9tZXRyeSgwLjA4LCAwLjEsIDMyKS5yb3RhdGVYKFxuXHRcdC1NYXRoLlBJIC8gMlxuXHQpO1xuXHRsZXQgbWF0ZXJpYWwgPSBuZXcgVGV0YXZpLlRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XG5cdGNvbnN0IHJldGljbGUgPSBuZXcgVGV0YXZpLlRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblx0cmV0aWNsZS5tYXRyaXhBdXRvVXBkYXRlID0gZmFsc2U7XG5cdHJldGljbGUudmlzaWJsZSA9IHRydWU7XG5cdHNjZW5lLmFkZChyZXRpY2xlKTtcblxuXHRsZXQgaGl0VGVzdFNvdXJjZSA9IG51bGw7XG5cdGxldCBoaXRUZXN0U291cmNlUmVxdWVzdGVkID0gZmFsc2U7XG5cblx0Y29uc3QgY29udHJvbGxlciA9IHJlbmRlcmVyLnhyLmdldENvbnRyb2xsZXIoMCk7XG5cblx0YXN5bmMgZnVuY3Rpb24gcmVxdWVzdEhpdFRlc3RTb3VyY2UoKSB7XG5cdFx0Y29uc3Qgc2Vzc2lvbiA9IHJlbmRlcmVyLnhyLmdldFNlc3Npb24oKTtcblx0XHRzZXNzaW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJlbmRcIiwgKCkgPT4ge1xuXHRcdFx0aGl0VGVzdFNvdXJjZVJlcXVlc3RlZCA9IGZhbHNlO1xuXHRcdFx0aGl0VGVzdFNvdXJjZSA9IG51bGw7XG5cdFx0fSk7XG5cdFx0Y29uc3QgcmVmZXJlbmNlU3BhY2UgPSBhd2FpdCBzZXNzaW9uLnJlcXVlc3RSZWZlcmVuY2VTcGFjZShcInZpZXdlclwiKTtcblx0XHRoaXRUZXN0U291cmNlID0gYXdhaXQgc2Vzc2lvbi5yZXF1ZXN0SGl0VGVzdFNvdXJjZSh7XG5cdFx0XHRzcGFjZTogcmVmZXJlbmNlU3BhY2UsXG5cdFx0fSk7XG5cdFx0aGl0VGVzdFNvdXJjZVJlcXVlc3RlZCA9IHRydWU7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRIaXRUZXN0UmVzdWx0cyhmcmFtZSkge1xuXHRcdGNvbnN0IGhpdFRlc3RSZXN1bHRzID0gZnJhbWUuZ2V0SGl0VGVzdFJlc3VsdHMoaGl0VGVzdFNvdXJjZSk7XG5cdFx0aWYgKGhpdFRlc3RSZXN1bHRzLmxlbmd0aCAmJiBzZXR0aW5nUG9zaXRpb24pIHtcblx0XHRcdGNvbnN0IGhpdCA9IGhpdFRlc3RSZXN1bHRzWzBdO1xuXHRcdFx0Y29uc3QgcG9zZSA9IGhpdC5nZXRQb3NlKHJlbmRlcmVyLnhyLmdldFJlZmVyZW5jZVNwYWNlKCkpO1xuXHRcdFx0cmV0aWNsZS52aXNpYmxlID0gdHJ1ZTtcblx0XHRcdHJldGljbGUubWF0cml4LmZyb21BcnJheShwb3NlLnRyYW5zZm9ybS5tYXRyaXgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXRpY2xlLnZpc2libGUgPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBvblNlbGVjdCgpIHtcblx0XHRpZiAocmV0aWNsZS52aXNpYmxlICYmIHNldHRpbmdQb3NpdGlvbikge1xuXHRcdFx0dmlkZW8gPSB0ZXRhdmkuZ2V0U3JjVmlkZW8oKTtcblx0XHRcdHZpZGVvLm11dGVkID0gZmFsc2U7XG5cdFx0XHR2aWRlby5wYXVzZSgpO1xuXHRcdFx0dmlkZW8uY3VycmVudFRpbWUgPSAwO1xuXHRcdFx0dmlkZW8ucGxheSgpO1xuXHRcdFx0cGl2b3QucG9zaXRpb24uc2V0RnJvbU1hdHJpeFBvc2l0aW9uKHJldGljbGUubWF0cml4KTtcblx0XHRcdHBpdm90LnBvc2l0aW9uLnkgLT0gMC4zO1xuXHRcdFx0cGl2b3QudmlzaWJsZSA9IHRydWU7XG5cdFx0XHRzZXR0aW5nUG9zaXRpb24gPSBmYWxzZTtcblx0XHRcdC8vcG9zaXRpb25CdG5Db250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcblx0XHRcdC8vcG9zaXRpb25CdG5Db250YWluZXIuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIik7XG5cdFx0fVxuXHR9XG5cblx0Y29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKFwic2VsZWN0XCIsIG9uU2VsZWN0KTtcblx0Lypwb3NpdGlvbkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuXHRcdHBvc2l0aW9uQnRuQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xuXHRcdHNldHRpbmdQb3NpdGlvbiA9IHRydWU7XG5cdH0pOyovXG5cblx0ZnVuY3Rpb24gdGhyZWVfYW5pbWF0ZShfLCBmcmFtZSkge1xuXHRcdGlmICh0ZXRhdmkgIT0gbnVsbCkge1xuXHRcdFx0dGV0YXZpLmFuaW1hdGUoKTtcblx0XHRcdGlmICghcGl2b3QgJiYgc2NlbmUuY2hpbGRyZW5bM10pIHtcblx0XHRcdFx0cGl2b3QgPSBzY2VuZS5jaGlsZHJlblszXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZnJhbWUpIHtcblx0XHRcdGlmIChoaXRUZXN0U291cmNlUmVxdWVzdGVkID09PSBmYWxzZSkge1xuXHRcdFx0XHRyZXF1ZXN0SGl0VGVzdFNvdXJjZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGhpdFRlc3RTb3VyY2UpIHtcblx0XHRcdFx0Z2V0SGl0VGVzdFJlc3VsdHMoZnJhbWUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnRyb2xzLnVwZGF0ZSgpO1xuXG5cdFx0cmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuXHR9XG5cblx0cmVuZGVyZXIuc2V0QW5pbWF0aW9uTG9vcCh0aHJlZV9hbmltYXRlKTtcbn07XG5cbmV4cG9ydCB7IGNhbGxBbmltYXRpb24gfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgY3JlYXRlQVJCdG4gfSBmcm9tIFwiLi9qcy9hci1idXR0b25cIjtcbmltcG9ydCB7IGFtYmllbnQsIHNwb3RMaWdodCB9IGZyb20gXCIuL2pzL2xpZ2h0c1wiO1xuaW1wb3J0IHsgcGxheVZpZGVvIH0gZnJvbSBcIi4vanMvcGxheS1zdG9wXCI7XG5pbXBvcnQgeyBjcmVhdGVSZW5kZXJlciB9IGZyb20gXCIuL2pzL3JlbmRlcmVyXCI7XG5pbXBvcnQgeyBzY2VuZSwgY2FtZXJhIH0gZnJvbSBcIi4vanMvc2NlbmUtY2FtZXJhXCI7XG5pbXBvcnQgeyBjcmVhdGVUZXRhdmkgfSBmcm9tIFwiLi9qcy90ZXRhdmktc2V0dXBcIjtcbmltcG9ydCB7IGNhbGxBbmltYXRpb24gfSBmcm9tIFwiLi9qcy90aHJlZS1hbmltYXRlXCI7XG5pbXBvcnQgeyBPYmplY3RDb250cm9scyB9IGZyb20gXCJ0aHJlZUpTLW9iamVjdC1jb250cm9sc1wiO1xuXG5zY2VuZS5hZGQoYW1iaWVudCk7XG5zY2VuZS5hZGQoc3BvdExpZ2h0KTtcblxuY29uc3QgeyByZW5kZXJlciwgY29udHJvbHMgfSA9IGNyZWF0ZVJlbmRlcmVyKGNhbWVyYSk7XG5cbmNvbnN0IHRldGF2aSA9IGNyZWF0ZVRldGF2aShjYW1lcmEsIHJlbmRlcmVyKS50ZXRhdmk7XG5cbmNvbnN0IGVudGVyQnRuID0gY3JlYXRlQVJCdG4ocmVuZGVyZXIpLmJ1dHRvbjtcblxuY29uc3QgeyBwaXZvdCB9ID0gcGxheVZpZGVvKGVudGVyQnRuLCB0ZXRhdmksIHNjZW5lKTtcblxuY2FsbEFuaW1hdGlvbih0ZXRhdmksIHNjZW5lLCBjYW1lcmEsIHBpdm90LCBjb250cm9scywgcmVuZGVyZXIpO1xuXG5jb25zdCBvYmpDb250cm9scyA9IG5ldyBPYmplY3RDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQsIHBpdm90KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==