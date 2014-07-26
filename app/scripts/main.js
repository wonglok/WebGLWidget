(function(_di){
	'use strict';

	_di.set('postProcessProgram',function(){
		var api = {};

		api.blur = _di.get('program.post.blur');
		api.normal = _di.get('program.post.normal');
		api.particleSim = _di.get('program.particle.simulate');

		return api;
	});
	_di.set('renderables',function(){
		var api = {};

		api.logo = _di.get('renderable.logoFan').init();
		api.cube = _di.get('renderable.cube').init();
		api.particleShow = _di.get('renderable.gpu.particle.show').init();

		return api;
	});

	_di.val('util.check',function(){
		var check = {};
		var gl = _di.get('context');

		var vertexSampler = (
			gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) >= 1
		);

		var floatTexture = (
			!!gl.getExtension( 'OES_texture_float' )
		);

		//if any of the stuff is not supported, then dont use this. :)
		if (!vertexSampler || !floatTexture ) {
			check.gpuSim = false;
		}else{
			check.gpuSim = true;
		}

		return check;
	});

	_di.set('service.support',function(){
		return _di.get('util.check')();
	});

	_di.set('stages',function(){
		var post = _di.get('postProcessProgram');
		var ren = _di.get('renderables');
		var support = _di.get('service.support');
		var scene = [
			{
				mod: ren.cube,
				post: post.blur
			},

			{
				mod: ren.particleShow,
				post: post.blur
			},
			{
				mod: ren.particleShow,
				post: null
			},

			{
				mod: ren.logo,
				post: post.blur
			},

			{
				mod: ren.particleShow,
				post: null
			},
			{
				mod: ren.cube,
				post: null
			},
			{
				mod: ren.logo,
				post: post.blur
			},

		];

		//debugger;

		if (!support.gpuSim){
			scene.shift();
		}

		//debug
		scene = [scene[2]];

		var stages = {
			currentIndex: 0,
			now: scene[0],
			ren: ren,
			post: post
		};

		var i = 0;
		function changeNow(){
			stages.currentIndex = i++;
			stages.now = scene[stages.currentIndex];

			if (i >= scene.length){
				i = 0;
			}
		}
		changeNow();

		setInterval(changeNow,3000);

		return stages;
	});

	_di.set('render.post.fbo1',function(){
		var rttFBO = _di.get('util.makeFBO')();
		return rttFBO;
	});

	_di.set('service.postProcess',function(){
		var fbo = _di.get('util.makeFBO')();
		var api = {};

		api.renderPass = function(drawFn,postProcess){
			if (postProcess && postProcess.type === 'blur'){

				fbo.bindFrameBuffer();

				drawFn();

				fbo.unbindFrameBuffer();
				fbo.bindPostProcess(postProcess);
				postProcess.simulate();
				fbo.draw(postProcess);

			}else{
				drawFn();
			}
		};

		return api;
	});

	_di.val('util.makeFloatFBO',function(){
		var words = _di.get('const');
		var rttFBO = _di.get('util.makeFBO')({
			textureType: words.FloatType
		});
		return rttFBO;
	});



	_di.set('render',function(){
		var stages = _di.get('stages');

		var postProcess = _di.get('service.postProcess');

		var render = function(){
			var now = stages.now;

			/*jslint bitwise: true */
			// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			if (
				now.mod && now.mod.type === 'GpuParticle'
			){
				now.mod.render(now.post);
			} else if (
				now.post && now.post.type === 'blur' ||
				now.post && now.post.type === 'normal'
			){
				postProcess.renderPass(now.mod.render, now.post);
			}else{
				now.mod.render();
			}

		};

		// var frbt = _di.get('service.frbt');
		// var addRender = function(){
		// 	frbt.addTask(render);
		// };

		return render;
	});

	_di.val('run',function(){
		var canvas = _di.get('canvas');
		if (!window.HAS_WEBGL){
			var newChild = document.createElement('div');
			newChild.innerText = 'sorry, your browser does not support webgl.';
			document.documentElement.appendChild(newChild);
			console.log(' no webgl ....');
			document.documentElement.removeChild(canvas);
			return;
		}

		_di.get('canvas');
		_di.get('context');
		_di.get('service.contextLost');
		//_di.get('service.focus');

		_di.get('loop').start();

	});

}(window._di));
















