/* global mat4 */
(function(_di){
	'use strict';


	_di.set('renderable.cube',function(){
		var gl = _di.get('context');
		var _lg = _di.get('service.lazyGL');
		var clock = _di.get('service.clock');
		var frbt = _di.get('service.frbt');

		var mvStack = _di.get('util.mvStack')();
		var pMatrix = mat4.create();

		var degToRad = _di.get('util.degToRad');


		var location = _di.get('program.cube.sampler');

		var cube = {
			rotation: {
				x:0,
				y:0,
				z:0
			},
			cubeMap:null
		};

		var cVBO = gl.createBuffer();
		cVBO.array = [
			// Front face
			-2.0, -1.0,  1.0,
			2.0, -1.0,  1.0,
			2.0,  1.0,  1.0,
			-2.0,  1.0,  1.0,

			// Back face
			-2.0, -1.0, -1.0,
			-2.0,  1.0, -1.0,
			2.0,  1.0, -1.0,
			2.0, -1.0, -1.0,

			// Top face
			-2.0,  1.0, -1.0,
			-2.0,  1.0,  1.0,
			2.0,  1.0,  1.0,
			2.0,  1.0, -1.0,

			// Bottom face
			-2.0, -1.0, -1.0,
			2.0, -1.0, -1.0,
			2.0, -1.0,  1.0,
			-2.0, -1.0,  1.0,

			// Right face
			2.0, -1.0, -1.0,
			2.0,  1.0, -1.0,
			2.0,  1.0,  1.0,
			2.0, -1.0,  1.0,

			// Left face
			-2.0, -1.0, -1.0,
			-2.0, -1.0,  1.0,
			-2.0,  1.0,  1.0,
			-2.0,  1.0, -1.0,
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
			0.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,

			// Top face
			0.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,

			// Bottom face
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,

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

			16, 17, 18,    16, 18, 19, // Right face
			12, 13, 14,    12, 14, 15, // Bottom face
			20, 21, 22,    20, 22, 23  // Left face
		];
		cIBO.itemSize = 1;
		cIBO.numItems = 36;

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cIBO);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cIBO.array), gl.STATIC_DRAW);




		function createTexture(index, src) {
			var newTexture = gl.createTexture();
			newTexture.$index = index || 0;
			newTexture.$image = new Image();
			newTexture.$image.onload = function () {


				frbt.addTask(function(){
					_lg.useProgram(location.program);
					gl.activeTexture(gl.TEXTURE0 + newTexture.$index);
					gl.bindTexture(gl.TEXTURE_2D, newTexture);
					gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, newTexture.$image);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
					gl.generateMipmap(gl.TEXTURE_2D);
					gl.bindTexture(gl.TEXTURE_2D, null);

					newTexture.$ready = true;
				});
				//frbt.digest();

			};
			newTexture.$image.src = src;

			return newTexture;
		}

		var cubeTexture;

		cubeTexture = createTexture(
			0,
			// './images/star.gif',
			'./images/texture/webgl.png'
			// './images/texture/khronos_webgl.png'
		);



		function _updateGLStateMachine(){
			_lg.useProgram(location.program);
			_lg.disable(gl.BLEND);
			_lg.enable(gl.DEPTH_TEST);

			_lg.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

			_lg.clearColor(1.0, 1.0, 1.0, 1);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
			_lg.uniformMatrix4fv(location.uPMatrix, false, pMatrix);


			mvStack.mvSave();

			mat4.identity(mvStack.mvMatrix);
			mat4.translate(mvStack.mvMatrix, mvStack.mvMatrix, [0, 0, -5.0]);
			mat4.rotate(mvStack.mvMatrix, mvStack.mvMatrix, -degToRad(cube.rotation.x), [1, 0, 0]);
			mat4.rotate(mvStack.mvMatrix, mvStack.mvMatrix, cube.rotation.y, [0, 1, 0]);

			_lg.uniformMatrix4fv(location.uMVMatrix, false, mvStack.mvMatrix);
			mvStack.mvRestore();


			_lg.lazy.vertexAttribPointer(
				gl.ARRAY_BUFFER, cVBO,
				location.aVertexPosition, cVBO.itemSize, gl.FLOAT, false, 0, 0
			);

			_lg.lazy.vertexAttribPointer(
				gl.ARRAY_BUFFER, cVTBO,
				location.aTextureCoord, cVTBO.itemSize, gl.FLOAT, false, 0, 0
			);

			// _lg.bindBuffer(gl.ARRAY_BUFFER, cVBO);
			// _lg.vertexAttribPointer(location.aVertexPosition, cVBO.itemSize, gl.FLOAT, false, 0, 0);

			// _lg.bindBuffer(gl.ARRAY_BUFFER, cVTBO);
			// _lg.vertexAttribPointer(location.aTextureCoord, cVTBO.itemSize, gl.FLOAT, false, 0, 0);

			// _lg.activeTexture(gl.TEXTURE0 + cubeTexture.$index);
			// _lg.bindTexture(gl.TEXTURE_2D, cubeTexture);


			if(cubeTexture.$ready){
				_lg.activeTexture(gl.TEXTURE0);
				_lg.bindTexture(gl.TEXTURE_2D, cubeTexture);
				_lg.uniform1i(location.uSReady, 1);
				_lg.uniform1i(location.uSampler, 0);
			}else{
				_lg.uniform1i(location.uSReady, 0);
			}

			gl.uniform1f(location.uCTime, clock.sTime.toFixed(5) * 500);

			_lg.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cIBO);
			if (cubeTexture.$ready){
				gl.drawElements(gl.TRIANGLES, cIBO.numItems, gl.UNSIGNED_SHORT, 0);
			}else{
				gl.drawElements(gl.TRIANGLES, cIBO.numItems, gl.UNSIGNED_SHORT, 0);
// 				gl.drawElements(gl.LINE_LOOP, cIBO.numItems, gl.UNSIGNED_SHORT, 0);
			}

		}

		function _updateSimulation(){
			var eTime = clock.eTime;
			var cTime = clock.cTime;
			if (!eTime){ return; }
			cube.rotation.x += (90 * eTime) / 1000.0;
			cube.rotation.y = (Math.sin(cTime/100)) / 10;
			cube.rotation.z += (90 * eTime) / 1000.0;
		}

		function render(){
			_updateGLStateMachine();
			_updateSimulation();
		}

		function init(){

		}

		return {
			render: render,
			init: init
		};
	});

}(window._di));

