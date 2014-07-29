/* global mat4 */
(function(_di){
	'use strict';

	_di.set('renderable.logoFan',function(){
		var gl = _di.get('context');
		var _lg = _di.get('service.lazyGL');
		var clock = _di.get('service.clock');
		var location = _di.get('program.fan');
		var mvStack = _di.get('util.mvStack')();
		var degToRad = _di.get('util.degToRad');
		var keyDownMap = _di.get('service.keydown');

		var ftbt = _di.get('service.frbt');

		function Logo(rSpeed, logoParent) {
			this.rDegree = 0;
			this.rSpeed = rSpeed;

			this.r = Math.random();
			this.g = Math.random();
			this.b = Math.random();

			this.parent = logoParent;
		}

		Logo.prototype.drawLogo = function(){
			if(this.parent.logoTexture.$ready){
				_lg.uniform1i(location.tReady, 1);

				_lg.activeTexture(gl.TEXTURE0);
				_lg.bindTexture(gl.TEXTURE_2D, this.parent.logoTexture);
				_lg.uniform1i(location.uSampler, 0);
			}else{
				_lg.uniform1i(location.tReady, 0);
			}

			// gl.bindBuffer(gl.ARRAY_BUFFER, this.parent.logoVTCBO);
			// gl.vertexAttribPointer(location.aTextureCoord, this.parent.logoVTCBO.itemSize, gl.FLOAT, false, 0, 0);

			// gl.bindBuffer(gl.ARRAY_BUFFER, this.parent.logoVPBO);
			// gl.vertexAttribPointer(location.aVertexPosition, this.parent.logoVPBO.itemSize, gl.FLOAT, false, 0, 0);


			_lg.lazy.vertexAttribPointer(
				gl.ARRAY_BUFFER, this.parent.logoVPBO,
				location.aVertexPosition, this.parent.logoVPBO.itemSize, gl.FLOAT, false, 0, 0
			);
			_lg.lazy.vertexAttribPointer(
				gl.ARRAY_BUFFER, this.parent.logoVTCBO,
				location.aTextureCoord, this.parent.logoVTCBO.itemSize, gl.FLOAT, false, 0, 0
			);

			_lg.uniformMatrix4fv(location.uMVMatrix, false, mvStack.mvMatrix);

			if (this.parent.logoTexture.$ready){
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.parent.logoVPBO.numItems);
			}else{
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.parent.logoVPBO.numItems);
			}
		};

		Logo.eFPS = 55 / 1000;
		Logo.prototype.simulate = function (eTime) {
			this.rDegree += this.rSpeed * eTime * Logo.eFPS;

		};
		Logo.prototype.draw = function () {
			mvStack.mvSave();


			mat4.rotate(mvStack.mvMatrix, mvStack.mvMatrix, degToRad(this.rDegree), [0.0, 1.0, 0.0]);

			mat4.rotate(mvStack.mvMatrix, mvStack.mvMatrix, Math.sin(degToRad(this.rDegree)), [0.0, 1.0, 0.0]);

			mat4.rotate(mvStack.mvMatrix, mvStack.mvMatrix, degToRad(this.rDegree)/10, [0.0, 1.0, 0.0]);


			mat4.translate(mvStack.mvMatrix, mvStack.mvMatrix, [2.3, 0.0, 0.0]);


			mat4.rotate(mvStack.mvMatrix, mvStack.mvMatrix, degToRad(-30), [1.0, 0.0, 0.0]);

			_lg.uniform3f(location.uColor, this.r, this.g, this.b);

			this.drawLogo();

			mvStack.mvRestore();
		};

		function LogoGroup(){
			this.logoFan = [];

			this.numLogos = 20;

			this.zoom = -7;
			this.tilt = 45;

			this.logoTexture = null;

			this.logoVPBO = null;
			this.logoVTCBO = null;

			this.keyDown = keyDownMap;
		}

		LogoGroup.prototype.processTexutre = function(texture){
			_lg.useProgram(location.program);
			_lg.bindTexture(gl.TEXTURE_2D, texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			_lg.bindTexture(gl.TEXTURE_2D, null);
			texture.$ready = true;
		};

		LogoGroup.prototype.initTexture = function(){
			var self = this;
			this.logoTexture = gl.createTexture();

			this.logoTexture.image = new Image();

			this.logoTexture.image.onload = function () {

				ftbt.addTask(self.processTexutre,self,self.logoTexture);

				// setTimeout(function(){
				// 	self.processTexutre(self.logoTexture);
				// },0);
			};
		//	this.logoTexture.image.src = 'images/texture/logo.gif';
			this.logoTexture.image.src = 'images/texture/webgl.png';
		};

		LogoGroup.prototype.initBuffers = function(){
			this.logoVPBO = gl.createBuffer();
			this.logoVPBO.logoVertex = [
				-2.0, -1.0, 0.0, //x,y,z
				2.0, -1.0, 0.0,
				-2.0,  1.0, 0.0,
				2.0,  1.0, 0.0
			];
			gl.bindBuffer(gl.ARRAY_BUFFER, this.logoVPBO);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.logoVPBO.logoVertex), gl.STATIC_DRAW);
			this.logoVPBO.itemSize = 3;
			this.logoVPBO.numItems = 4;

			this.logoVTCBO = gl.createBuffer();
			this.logoVTCBO.textureCoords = [
				0.0, 0.0,
				1.0, 0.0,
				0.0, 1.0,
				1.0, 1.0
			];
			gl.bindBuffer(gl.ARRAY_BUFFER, this.logoVTCBO);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.logoVTCBO.textureCoords), gl.STATIC_DRAW);
			this.logoVTCBO.itemSize = 2;
			this.logoVTCBO.numItems = 4;
		};
		LogoGroup.prototype.init = function(){
			this.initBuffers();
			this.initTexture();
			this.makeLogoFan();
		};
		LogoGroup.prototype.makeLogoFan = function(){
			var numLogos = this.numLogos;
			var logo;
			var i = 0;
			for (; i < numLogos; i++) {
				logo = new Logo(i / numLogos * 1.7, this);
				this.logoFan.push(logo);
			}
		};
		LogoGroup.prototype.handleDownKeys = function handleKeys() {
			//up
			if (this.keyDown[38]) {
				this.tilt += 2;
			}
			//down
			if (this.keyDown[40]) {
				// Down cursor key
				this.tilt -= 2;
			}

			//w
			if (this.keyDown[87]) {
				this.zoom += 0.1;
			}
			//s
			if (this.keyDown[83]) {
				this.zoom -= 0.1;
			}
		};
		LogoGroup.prototype.v8Each = function (array,method,data){
			var i = 0, len = array.length;
			for (;i < len; i++){
				method.call(array[i],data);
			}
		};
		LogoGroup.prototype.drawAllLogo = function() {
			_lg.useProgram(location.program);

			_lg.disable(gl.DEPTH_TEST);
			_lg.enable(gl.BLEND);
			_lg.blendFunc(gl.SRC_ALPHA, gl.ONE);




			_lg.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

			_lg.clearColor(0.0, 0.0, 0.0, 1);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


			//perspective.
			mat4.perspective(mvStack.pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
			_lg.uniformMatrix4fv(location.uPMatrix, false, mvStack.pMatrix);


			//mv matrix
			mat4.identity(mvStack.mvMatrix);
			mat4.translate(mvStack.mvMatrix, mvStack.mvMatrix, [0.0, 0.0, this.zoom]);
			mat4.rotate(mvStack.mvMatrix, mvStack.mvMatrix, degToRad(this.tilt), [1.0, 0.0, 0.0]);

			//scale the object
			mat4.scale(mvStack.mvMatrix, mvStack.mvMatrix, [1.0, 1.0, 1.0]);


			//draw all itme
			// this.v8Each(this.logoFan,Logo.prototype.draw);

			var logoFan = this.logoFan,i = 0, slen = logoFan.length;
			for (;i<slen; i++){
				logoFan[i].draw();
			}
		};
		LogoGroup.prototype.simulate = function(){
			var eTime = clock.eTime;
			if (!eTime){ return; }
			this.v8Each(this.logoFan,Logo.prototype.simulate,eTime);
		};

		LogoGroup.prototype.render = function(){

			this.handleDownKeys();
			this.drawAllLogo();
			this.simulate();


		};

		var api = {};
		var logoGroup;

		api.init = function(){
			logoGroup = new LogoGroup();
			logoGroup.init();
			return api;
		};

		api.render = function(){
			logoGroup.render();
		};



		return api;
	});

}(window._di));

