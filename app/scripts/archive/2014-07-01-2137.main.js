/* global mat4 */

window.omg = 'fun';

(function(){
	'use strict';

	window.HAS_WEBGL = (function(){
		return !!window.WebGLRenderingContext;
	}());


	function nsR(){
		var _r = {
			fac: {},
			inst: {},
			//setters
			val: function(name,val){
				_r.inst[name] = val;
			},
			set: function(name,factory){
				_r.fac[name] = factory;
			},

			//getters
			get: function(name){
				return _r.inst[name] || (_r.inst[name] = _r.make(name), _r.inst[name]);
			},

			//maker
			make: function(name){
				var factory = _r.fac[name];

				if (factory){
					return factory();
				}else{
					throw new Error('not found!!'+name);
				}
			}

		};
		return _r;
	}
	window.nsR = nsR;
	window._r = nsR();


	function nsF(){
		var _f = {
			checking: false,
			useCount: 0,
			_free: [],
			reset: function(o){ console.log('resetter not ready!',o); },
			fac: function(){ console.log('factory not ready!'); },
			make: function(){
				_f.useCount++;
				return _f.fac();
			},
			makeFree: function(){
				_f._free.push(_f.make());
			},
			getFree: function(){
				return _f._free.pop();
			},
			prep: function(num){
				for (var i = 0; i < num; i++) {
					_f.makeFree();
				}
			},
			alloc: function(){
				var result = _f.getFree();
				result = result || _f.make();
				_f.useCount++;
				return result;
			},
			report: function(msg){
				console.log(msg);
				throw new Error(msg);
			},
			free: function(obj){
				if(_f.checking){
					if (_f._free.indexOf(obj) !== -1){
						_f.report('free same obj');
						return;
					}
				}

				_f.reset(obj);
				_f._free.push(obj);
				_f.useCount--;

			}
		};
		return _f;
	}
	window.nsF = nsF;

	// function nsSMC(){
	// 	var _smc = {
	// 		ns: {},
	// 		push: function(name,fn){

	// 			if (typeof _smc.ns[name] !== 'undefined'){
	// 				throw new Error('repeating name');
	// 			}

	// 			_smc.ns[name] = {
	// 				valid: false,
	// 				fn: fn
	// 			};
	// 		}
	// 	};
	// 	return _smc;
	// }

	// window.nsSMC = nsSMC;


	// var _smc = nsSMC();
	// _smc.push('happy',function(){

	// });

	// _smc.ns.happy.valid = true;

	//----------------------------------------------------------
	function GLStateProperty(state,updater,uploader){
		this.valid = false;
		this.state = state;
		this.updater = GLStateProperty.noop || updater;
		this.uploader = GLStateProperty.noop || uploader;
	}
	GLStateProperty.temp = {};
	GLStateProperty.noop = function(){};
	GLStateProperty.prototype.update = function(){
		this.updater.apply(this);
	};
	GLStateProperty.prototype.upload = function(){
		if (!this.valid){
			this.uploader();
			this.valid = true;
		}
	};

	//----------------------------------------------------------
	function GLArryBuffer(){
		GLStateProperty.apply(this,arguments);
	}
	GLArryBuffer.prototype = new GLStateProperty();


	var vbo = new GLArryBuffer();
	vbo.state = {

	};


}());




(function(){
	'use strict';
	window.domReady = function (callback) {
		/* Internet Explorer */
		/*@cc_on
		@if (@_win32 || @_win64)
			document.write('<script id="ieScriptLoad" defer src="//:"><\/script>');
			document.getElementById('ieScriptLoad').onreadystatechange = function() {
				if (this.readyState == 'complete') {
					callback();
				}
			};
		@end @*/

		if (document.addEventListener) {
			document.addEventListener('DOMContentLoaded', callback, false);
			return;
		}
		if (/KHTML|WebKit|iCab/i.test(navigator.userAgent)) {
			var DOMLoadTimer = setInterval(function () {
				if (/loaded|complete/i.test(document.readyState)) {
					callback();
					clearInterval(DOMLoadTimer);
				}
			}, 10);
			return;
		}
		window.onload = callback;
	};
}());





(function(){
	'use strict';

	var _r = window.nsR();


	_r.val('util.degToRad',function degToRad(degrees) {
		return degrees * Math.PI / 180;
	});
	_r.val('util.getDomSrc',function(id){
		var dom = document.querySelectorAll('#'+id);
		// console.log(dom[0].innerText);
		return dom[0].innerText;
	});
	_r.val('util.getShader',function(gl, str,type){

		var shader;

		if (type === 'vs'){
			shader = gl.createShader(gl.VERTEX_SHADER);
		}else if (type  ==='fs'){
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		}else{
			console.log('shader creation error!!!');
		}

		gl.shaderSource(shader, str);
		gl.compileShader(shader);

		var status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

		if (!status){
			console.error('shader compile error',gl.getShaderInfoLog(shader));
		}

		return shader;
	});
	_r.val('util.makeProgram',function(vId,fId){

		var gl = _r.get('context');
		var getShader = _r.get('util.getShader');
		var getDomSrc = _r.get('util.getDomSrc');

		var vSrc = getDomSrc(vId);
		var fSrc = getDomSrc(fId);

		var vs = getShader(gl,vSrc,'vs');
		var fs = getShader(gl,fSrc,'fs');

		var prg = gl.createProgram();

		gl.attachShader(prg, vs);
		gl.attachShader(prg, fs);
		gl.linkProgram(prg);

		if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
			console.log('cannot link shader');
		}

		gl.useProgram(prg);

		return prg;
	});


	_r.set('canvas',function(){
		var canvas = document.getElementById('webgl_widget');
		return canvas;
	});
	_r.set('context',function(){
		var canvas = _r.get('canvas');
		var context = canvas.getContext('webgl');
		context.viewportWidth = canvas.width;
		context.viewportHeight = canvas.height;
		return context;
	});
	_r.val('util.getLocationCache',function(program, attributes,unifroms){
		var gl = _r.get('context');

		var locationCache = {
		};

		console.dir(program);

		for (var ai = 0; ai < attributes.length; ai++) {

			var location = gl.getAttribLocation(program, attributes[ai]);
			locationCache[attributes[ai]] = location;
			gl.enableVertexAttribArray(location);

		}

		for (var ui = 0; ui < unifroms.length; ui++) {
			locationCache[unifroms[ui]] = gl.getUniformLocation(program, unifroms[ui]);
		}


		return locationCache;
	});

	_r.val('util.arrayBuff',function(itemSize,array){
		var gl = _r.get('context');
		var buffer = gl.createBuffer();
		buffer.array = array;
		buffer.itemSize = itemSize;
		buffer.numItems = array.length/itemSize;//numItems;

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer.array), gl.STATIC_DRAW);
		return buffer;
	});

	_r.set('program.sampler',function(){
		var getLocationCache = _r.get('util.getLocationCache');

		var program = _r.get('util.makeProgram')('sampler_vs','sampler_fs');
		var attributes = [
			'aVertexPosition',
			'aTextureCoord',
		];
		var unifroms = [
			'uMVMatrix',
			'uPMatrix',
			'uSampler'
		];
		var locationCache = getLocationCache(program,attributes,unifroms);
		return locationCache;
	});

	_r.set('renderable.cube',function(){
		var gl = _r.get('context');
		var cube = {
			rotation: {
				x:0,
				y:0,
				z:0
			}
		};

		var cVBO = gl.createBuffer();
		cVBO.array = [
			// Front face
			-1.0, -1.0,  1.0,
			1.0, -1.0,  1.0,
			1.0,  1.0,  1.0,
			-1.0,  1.0,  1.0,

			// Back face
			-1.0, -1.0, -1.0,
			-1.0,  1.0, -1.0,
			1.0,  1.0, -1.0,
			1.0, -1.0, -1.0,

			// Top face
			-1.0,  1.0, -1.0,
			-1.0,  1.0,  1.0,
			1.0,  1.0,  1.0,
			1.0,  1.0, -1.0,

			// Bottom face
			-1.0, -1.0, -1.0,
			1.0, -1.0, -1.0,
			1.0, -1.0,  1.0,
			-1.0, -1.0,  1.0,

			// Right face
			1.0, -1.0, -1.0,
			1.0,  1.0, -1.0,
			1.0,  1.0,  1.0,
			1.0, -1.0,  1.0,

			// Left face
			-1.0, -1.0, -1.0,
			-1.0, -1.0,  1.0,
			-1.0,  1.0,  1.0,
			-1.0,  1.0, -1.0,
		];
		cVBO.itemSize = 3;
		cVBO.numItems = 24;
		gl.bindBuffer(gl.ARRAY_BUFFER, cVBO);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cVBO.array), gl.STATIC_DRAW);

		var cVTBO = gl.createBuffer();
		cVTBO.array = [
			// Front face
			0.0, 0.0, //x,y
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,

			// Back face
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
			0.0, 0.0,

			// Top face
			0.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,

			// Bottom face
			1.0, 1.0,
			0.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,

			// Right face
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
			0.0, 0.0,

			// Left face
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
		];
		cVTBO.itemSize = 2;
		cVTBO.numItems = 24;
		gl.bindBuffer(gl.ARRAY_BUFFER, cVTBO);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cVTBO.array), gl.STATIC_DRAW);

		//
		var cIBO = gl.createBuffer();
		cIBO.array = [
			0,  1,  2,      0,  2,  3, // Front face, 2 triangles, 6vertex
			4,  5,  6,      4,  6,  7, // Back face
			8,  9, 10,      8, 10, 11, // Top face

			12, 13, 14,    12, 14, 15, // Bottom face
			16, 17, 18,    16, 18, 19, // Right face
			20, 21, 22,    20, 22, 23  // Left face
		];
		cIBO.itemSize = 1;
		cIBO.numItems = 36;

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cIBO);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cIBO.array), gl.STATIC_DRAW);


		var uMVMatrix = mat4.create();
		var uPMatrix = mat4.create();
		var degToRad = _r.get('util.degToRad');


		var cubeTexture;
		function updateTexture(texture) {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.bindTexture(gl.TEXTURE_2D, null);
			up2date.cubeTexture = false;
		}
		function initTexture() {
			cubeTexture = gl.createTexture();
			cubeTexture.image = new Image();
			cubeTexture.image.onload = function () {
				updateTexture(cubeTexture);
			};

			cubeTexture.image.src = './images/khronos_webgl.png';
		}
		initTexture();

		var glsl = _r.get('program.sampler');



		var lastTime = 0;
		function _updateSimulation(elapsed){
			cube.rotation.x += (90 * elapsed) / 1000.0;
			cube.rotation.y += (90 * elapsed) / 1000.0;
			cube.rotation.z += (90 * elapsed) / 1000.0;
			up2date.uMVMatrix = false;
		}

		var up2date = {};
		function _updateGLStateMachine(){

			if (!up2date.depthTest){
				gl.enable(gl.DEPTH_TEST);
				up2date.depthTest = true;
			}

			if (!up2date.clearColor){
				gl.clearColor(0.0, 0.0, 0.0, 0.5);
				up2date.clearColor = true;
			}

			if (!up2date.uPMatrix){
				mat4.perspective(uPMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
				gl.uniformMatrix4fv(glsl.uPMatrix, false, uPMatrix);
				up2date.uPMatrix = true;
			}

			if (!up2date.uMVMatrix){
				mat4.identity(uMVMatrix);
				mat4.translate(uMVMatrix, uMVMatrix, [0, 0, -5.0]);
				mat4.rotate(uMVMatrix, uMVMatrix, degToRad(cube.rotation.x), [1, 0, 0]);
				mat4.rotate(uMVMatrix, uMVMatrix, degToRad(cube.rotation.y), [0, 1, 0]);
				mat4.rotate(uMVMatrix, uMVMatrix, degToRad(cube.rotation.z), [0, 0, 1]);

				gl.uniformMatrix4fv(glsl.uMVMatrix, false, uMVMatrix);
				up2date.uMVMatrix = true;
			}

			if (!up2date.viewport){
				gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
				up2date.viewport = true;
			}

			if (!up2date.aVertexPosition){
				gl.bindBuffer(gl.ARRAY_BUFFER, cVBO);
				gl.vertexAttribPointer(glsl.aVertexPosition, cVBO.itemSize, gl.FLOAT, false, 0, 0);
				up2date.aVertexPosition = true;
			}

			if (!up2date.aTextureCoord){
				gl.bindBuffer(gl.ARRAY_BUFFER, cVTBO);
				gl.vertexAttribPointer(glsl.aTextureCoord, cVTBO.itemSize, gl.FLOAT, false, 0, 0);
				up2date.aTextureCoord = true;
			}

			if (!up2date.cubeTexture){
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
				gl.uniform1i(glsl.uSampler, 0);
				up2date.cubeTexture = true;
			}

			if (!up2date.bindCubeIndexBuffer){
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cIBO);
				up2date.bindCubeIndexBuffer = true;
			}
		}

		function draw(){
			_updateGLStateMachine();

			/*jslint bitwise: true */
			//clear the screen
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			//draw the cube.
			gl.drawElements(gl.TRIANGLES, cIBO.numItems, gl.UNSIGNED_SHORT, 0);
		}

		function update(time){
			var timeNow = time || new Date().getTime();
			if (lastTime !== 0) {
				var elapsed = timeNow - lastTime;

				_updateSimulation(elapsed);
			}
			lastTime = timeNow;
		}

		return {
			draw: draw,
			update: update
		};
	});

	_r.set('render',function(){
		var renderable = _r.get('renderable.cube');
		return function(time){
			renderable.draw(time);
			renderable.update(time);
		};
	});

	_r.set('loop',function(){
		var render = _r.get('render');
		var timerID = 0;
		var busy = false;
		function start(){
			if (!busy){
				busy = true;
				timerID = window.requestAnimationFrame(loop);
			}
		}
		function stop(){
			window.cancelAnimationFrame(timerID);
			timerID = null;
		}
		function loop(time){
			if (timerID === null){ return; }
			timerID = window.requestAnimationFrame(loop);
			render(time);
			busy = false;
		}
		return {
			start: start,
			stop: stop
		};
	});

	_r.set('window.focus',function(){
		var loop = _r.get('loop');
		window.onfocus = function(){
			loop.start();
		};
		window.onblur = function(){
			loop.stop();
		};
	});

	_r.val('run',function(){
		if (!window.HAS_WEBGL){
			console.log(' no webgl ....');
			return;
		}
		console.log('STARTING...');
		_r.get('canvas');
		_r.get('context');
		_r.get('loop').start();

		_r.get('window.focus');
	});

	window.domReady(_r.get('run'));

	// download loading...
	// uploading to gpu
	// update gpu state machine

}(window._r));
















