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

export { createRenderer };
