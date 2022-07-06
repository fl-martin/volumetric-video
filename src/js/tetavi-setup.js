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

export { createTetavi };
