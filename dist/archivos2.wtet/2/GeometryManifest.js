export const manifest = {
	'version': 1.0,
	'fps': 30,
	'frameCount': 331,
	'width': 4096,
	'height': 256,
	'maxIndicesCount' : 36540,
	'gopChunks' : [
		{ 'from':0, 'filename' : require('./assets/gop_tvm_0.tvm') },
		{ 'from':238, 'filename' : require('./assets/gop_tvm_1.tvm') }
	],
	'posChunks' : [
		{ 'from':0, 'filename' : require('./assets/position_tvm_0.tvm') },
		{ 'from':84, 'filename' : require('./assets/position_tvm_1.tvm') },
		{ 'from':168, 'filename' : require('./assets/position_tvm_2.tvm') },
		{ 'from':252, 'filename' : require('./assets/position_tvm_3.tvm') }
	]
};
