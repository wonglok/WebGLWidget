(function(_di){
	'use strict';

	_di.set('renderable.gpu.particle',function(){
		var gl = _di.get('context');
		var _lg = _di.get('service.lazyGL');
		var clock = _di.get('service.clock');
		// var frbt = _di.get('service.frbt');




		var mvStack = _di.get('util.mvStack')();
		var degToRad = _di.get('util.degToRad');
		var keyDownMap = _di.get('service.keydown');
		var postProcess = _di.get('service.postProcess');


		var api = {};


		api.type = 'GpuParticle';

		// var LogoTexture = function(){
		// 	this.logoTexture = null;
		// };
		// LogoTexture.prototype.processTexutre = function(texture){
		// 	_lg.useProgram(location.program);
		// 	_lg.bindTexture(gl.TEXTURE_2D, texture);
		// 	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		// 	_lg.bindTexture(gl.TEXTURE_2D, null);
		// 	texture.$ready = true;
		// };
		// LogoTexture.prototype.initTexture = function(){
		// 	var self = this;
		// 	this.logoTexture = gl.createTexture();

		// 	this.logoTexture.image = new Image();

		// 	this.logoTexture.image.onload = function () {
		// 		setTimeout(function(){
		// 			self.processTexutre(self.logoTexture);
		// 		},0);
		// 	};
		// //	this.logoTexture.image.src = 'images/texture/logo.gif';
		// 	this.logoTexture.image.src = 'images/texture/webgl.png';
		// };

		/**
		 * Simulate the Particle
		 * @param {[type]} parent [description]
		 */
		function GpuSimulator(){
			//pingPongIndex fbo
			this.rttFBO1 = _di.get('util.makeFloatFBO')();
			this.rttFBO2 = _di.get('util.makeFloatFBO')();

			this.toggleMap = _di.get('service.toggle');

			this.currentFBO = null;
			this.pingPongIndex = 0;

			this.program = _di.get('program.particle.simulate');

			this.prebind = {
				updateMode: this.updateMode.bind(this),
			};

			// setInterval(this.clear.bind(this),1000);
		}

		// GpuSimulator.prototype.clear = function(){
		// 	_lg.clearColor(0.2, 0.2, 0.2, 1);
		// 	clock.resetTime();

		// 	this.rttFBO1.bindFrameBuffer();
		// 	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		// 	this.rttFBO1.unbindFrameBuffer();

		// 	this.rttFBO2.bindFrameBuffer();
		// 	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		// 	this.rttFBO2.unbindFrameBuffer();
		// };

		GpuSimulator.prototype.updateMode = function(mode){
			_lg.useProgram(this.program.program);
			_lg.uniform1i(this.program.uMode, mode || 1);
		};

		GpuSimulator.prototype.simulate = function(){
			var readFBO;
			var writeFBO;

			if (this.pingPongIndex % 2 === 0){
				readFBO = this.rttFBO1;
				writeFBO = this.rttFBO2;
			}else{
				writeFBO = this.rttFBO1;
				readFBO = this.rttFBO2;
			}
			this.currentFBO = writeFBO;
			this.pingPongIndex++;

			if (this.toggleMap[80] === true){
				return;
			}

			//save to framebuffer
			writeFBO.bindFrameBuffer();

			//draw paricle position to quad
			writeFBO.bindPostProcess(this.program,readFBO.rttTexture);

			this.program.simulate();

			writeFBO.draw(this.program);

			//update
			writeFBO.unbindFrameBuffer();

		};


		/**
		 * [GpuParticle description]
		 * Display the Particle
		 */
		function GpuParticle(){

			this.program = _di.get('program.particle.show');

			this.particleBuffer = null;
			this.particle = null;

			this.keyDown = keyDownMap;

			this.gpuSim = new GpuSimulator(this);

			this.prebind = {
				draw: this.draw.bind(this),
				render: this.render.bind(this)
			};


			this.tiltX = 127;
			this.tiltY = 28.5;

			this.zoom = -332.5;
		}
		GpuParticle.prototype.simulate = function(){
			if (
				this.keyDown[38] ||
				this.keyDown[40] ||
				this.keyDown[37] ||
				this.keyDown[39]
				// this.keyDown[87] ||
				// this.keyDown[83]
			){
				return;
			}

			this.tiltX %= 360;
			this.tiltY %= 360;
			this.tiltX -= 0.33 + ( Math.cos(clock.sTime) );
			this.tiltY -= ( 1.0 - Math.sin(clock.sTime) ) / 2;
		};

		GpuParticle.prototype.handleDownKeys = function handleKeys() {
			//up
			if (this.keyDown[38]) {
				this.tiltY += 1.5;
			}
			//down
			if (this.keyDown[40]) {
				// Down cursor key
				this.tiltY -= 1.5;
			}

			//left
			if (this.keyDown[37]) {
				this.tiltX += 1.5;
			}
			//right
			if (this.keyDown[39]) {
				// Down cursor key
				this.tiltX -= 1.5;
			}

			//w
			if (this.keyDown[87]) {
				this.zoom += 1;
				this.zoom %= 500;
			}
			//s
			if (this.keyDown[83]) {
				this.zoom -= 1;
				this.zoom %= -500;
// 				console.log(this.zoom);
			}
		};

		GpuParticle.prototype.makeParticle = function(){
			var width = gl.viewportWidth;
			var height = gl.viewportHeight;

			var i = 0, len = width*height / 3;
			var array = [];

			var x,y,z;

			for(;i<len; i++ ){

				x = ( i % width ) / width;
				y = Math.floor( i / width ) / height;
				z = 0;

				array.push(x);
				array.push(y);
				//array.push(0);
			}

			//debugger;
			this.particle = new Float32Array( array );
		};

		GpuParticle.prototype.initGraphics = function(){
			this.particleBuffer = gl.createBuffer();
			this.particleBuffer.itemSize = 2;
			this.particleBuffer.numItems = this.particle.length / this.particleBuffer.itemSize;

			gl.bindBuffer(gl.ARRAY_BUFFER, this.particleBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, this.particle, gl.STATIC_DRAW);
		};





		//reputable public data.

		GpuParticle.prototype.init = function(){
			this.makeParticle();
			this.initGraphics();
		};


		GpuParticle.prototype.draw = function(){

			//clear last screen
			_lg.clearColor(0.2, 0.2, 0.2, 1);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


			//porgram, view port.
			_lg.useProgram(this.program.program);

			_lg.disable(gl.DEPTH_TEST);
			_lg.enable(gl.BLEND);
			_lg.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			_lg.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);


			//camera, model view
			/* global mat4 */
			mat4.perspective(mvStack.pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);
			_lg.uniformMatrix4fv(this.program.uPMatrix, false, mvStack.pMatrix);

			mvStack.mvSave();

			mat4.identity(mvStack.mvMatrix);

			mat4.translate(mvStack.mvMatrix, mvStack.mvMatrix, [0.0, 0.0, this.zoom]);
			mat4.rotate(mvStack.mvMatrix, mvStack.mvMatrix, degToRad(this.tiltY), [1.0, 0.0, 0.0]);
			mat4.rotate(mvStack.mvMatrix, mvStack.mvMatrix, degToRad(this.tiltX), [0.0, 1.0, 0.0]);


			_lg.uniformMatrix4fv(this.program.uMVMatrix, false, mvStack.mvMatrix);
			mvStack.mvRestore();



			//simulated position
			_lg.activeTexture(gl.TEXTURE0);
			_lg.bindTexture(gl.TEXTURE_2D, this.gpuSim.currentFBO.rttTexture);
			_lg.uniform1i(this.program.uSampler, 0);


			//make sure geometry of particle is ready
			_lg.lazy.vertexAttribPointer(
				gl.ARRAY_BUFFER, this.particleBuffer,
				this.program.aVertexPosition, this.particleBuffer.itemSize, gl.FLOAT, false, 0, 0
			);


			//update time.

			//time :)
			gl.uniform1f(this.program.uTimer, clock.sTime * 500);
			gl.drawArrays(gl.POINTS, 0, this.particleBuffer.numItems);

			_lg.bindTexture(gl.TEXTURE_2D, null);

		};

		/**
		 * render
		 * @param  {post process location cache} post [description]
		 * @return {[type]}      [description]
		 */
		GpuParticle.prototype.render = function(post){
			//update camera
			this.handleDownKeys();

			//simulate particle position
			this.gpuSim.simulate();

			//do post processing
			if (post){
				postProcess.renderPass(this.prebind.draw, post);
			}else{
				//dont do post process
				this.draw();
			}

			//update camera
			this.simulate();
		};



		var ohParticle;

		api.init = function (){
			ohParticle = new GpuParticle();
			ohParticle.init();

			api.updateMode = ohParticle.gpuSim.prebind.updateMode;
			api.render = ohParticle.prebind.render;

			return api;
		};



		// api.render = function (){
		// 	ohParticle.render();
		// };

		return api;
	});

}(window._di));

