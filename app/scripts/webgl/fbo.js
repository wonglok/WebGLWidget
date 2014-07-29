(function(_di){
	'use strict';
	_di.set('const',function(){
		var constant = {
			FloatType:'FloatType'
		};
		return constant;
	});

	_di.val('util.makeFloatFBO',function(){
		var words = _di.get('const');
		var rttFBO = _di.get('util.makeFBO')({
			textureType: words.FloatType
		});
		return rttFBO;
	});

	_di.val('util.makeFBO',function(options){
		options = options || {};

		var api = {};

		var _lg = _di.get('service.lazyGL');
		var gl = _di.get('context');
		var width = gl.viewportWidth;
		var height = gl.viewportHeight;
		//var word = _di.get('const');


		/**
		 * make texture to store color
		 * @type {[type]}
		 */
		var rttTexture = gl.createTexture();
		rttTexture.___type = 'fbo';
		_lg.bindTexture(gl.TEXTURE_2D, rttTexture);

		//dont use mig mag
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		//xy wrapping, clam to edge
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);


		// if (options.textureType === word.FloatType){
		// 	if (gl.getExtension('OES_texture_float')){
		// 		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.FLOAT, null);
		// 	}else{
		// 		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		// 	}
		// 	//sample data
		// 	//alert('~');
		// }else{
		// 	//sample data
		// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		// }

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);


		api.rttTexture = rttTexture;

		/**
		 * make render buffer to store depth data
		 */
		var rttRenderBuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, rttRenderBuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

		/**
		 * make frame buffer, and link with renderbuffer and texture.
		 */
		var rttFrameBuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, rttFrameBuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rttRenderBuffer);

		/**
		 * Clean up
		 */
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);


		/**
		 * set drawing to frame bufer.
		 * @param  {[type]} location [description]
		 * @return {[type]}          [description]
		 */
		api.bindFrameBuffer = function(){
			gl.bindFramebuffer(gl.FRAMEBUFFER, rttFrameBuffer);
		};


		/**
		 * set drawing to screen
		 * @return {[type]} [description]
		 */
		api.unbindFrameBuffer = function(){
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		};



		/**
		 * create plane geometry
		 * @type {[type]}
		 */
		var planeGeoPosBuff = gl.createBuffer();
		planeGeoPosBuff.logoVertex = [
			-1.0,-1.0,
			1.0,-1.0,
			-1.0, 1.0,

			-1.0, 1.0,
			1.0,-1.0,
			1.0, 1.0
		];
		planeGeoPosBuff.itemSize = 2;
		planeGeoPosBuff.numItems = 6;

		gl.bindBuffer(gl.ARRAY_BUFFER, planeGeoPosBuff);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeGeoPosBuff.logoVertex), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);


		/**
		 * create plane tex pos
		 * @type {[type]}
		 */
		var planeTexPosBuff = gl.createBuffer();
		planeTexPosBuff.textureCoords = [
			0.0, 0.0,
			1.0, 0.0,
			0.0, 1.0,

			0.0, 1.0,
			1.0, 0.0,
			1.0, 1.0
		];
		planeTexPosBuff.itemSize = 2;
		planeTexPosBuff.numItems = 6;

		gl.bindBuffer(gl.ARRAY_BUFFER, planeTexPosBuff);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeTexPosBuff.textureCoords), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);



		/**
		 * bind the post processing program
		 * @param  {[type]} location [description]
		 * @return {[type]}          [description]
		 */
		api.bindPostProcess = function(location, texture){
			_lg.useProgram(location.program);

			// gl.bindBuffer(gl.ARRAY_BUFFER, planeGeoPosBuff);
			// gl.vertexAttribPointer(location.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

			// gl.bindBuffer(gl.ARRAY_BUFFER, planeTexPosBuff);
			// gl.vertexAttribPointer(location.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

			_lg.lazy.vertexAttribPointer(
				gl.ARRAY_BUFFER, planeGeoPosBuff,
				location.aVertexPosition, planeGeoPosBuff.itemSize, gl.FLOAT, false, 0, 0
			);

			_lg.lazy.vertexAttribPointer(
				gl.ARRAY_BUFFER, planeTexPosBuff,
				location.aTextureCoord, planeTexPosBuff.itemSize, gl.FLOAT, false, 0, 0
			);

			_lg.activeTexture(gl.TEXTURE0);
			_lg.bindTexture(gl.TEXTURE_2D, texture || rttTexture);
			_lg.uniform1i(location.uSampler, 0);

		};

		/**
		 * api for drawing the plane
		 * @return {[type]} [description]
		 */
		api.draw = function(location){
			_lg.useProgram(location.program);

			gl.drawArrays(gl.TRIANGLES, 0, planeGeoPosBuff.numItems);

			_lg.bindTexture(gl.TEXTURE_2D, null);

		};

		// api.clear = function(){

		// };



		return api;
	});




}(window._di));






