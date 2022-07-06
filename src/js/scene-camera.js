const scene = new Tetavi.THREE.Scene();

const camera = new Tetavi.THREE.PerspectiveCamera(
	70,
	window.innerWidth / window.innerHeight,
	0.01,
	20
);

export { scene, camera };
