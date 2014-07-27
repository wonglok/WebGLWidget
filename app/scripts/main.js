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
		api.particle = _di.get('renderable.gpu.particle.show').init();

		return api;
	});

	_di.set('service.postProcess',function(){
		var fbo = _di.get('util.makeFBO')();
		var api = {};

		api.renderPass = function(drawFn,postProc){
			if (postProc && postProc.type === 'blur'){

				fbo.bindFrameBuffer();

				drawFn();

				fbo.unbindFrameBuffer();
				fbo.bindPostProcess(postProc);
				postProc.simulate();
				fbo.draw(postProc);

			}else{
				drawFn();
			}
		};

		return api;
	});



	_di.set('stages',function(){
		var post = _di.get('postProcessProgram');
		var ren = _di.get('renderables');
		var support = _di.get('service.support');
		var scene = [
			{
				eng: ren.cube,
				post: post.blur,
				next: 4000
			},
			{
				eng: ren.particle,
				// post: post.blur,
				mode: 1,
				next: 2500
			},
			{
				eng: ren.particle,
				// post: post.blur,
				mode: 1,
				next: 2500
			},

			{
				eng: ren.particle,
				post: post.blur,
				mode: 2,
				next: 4000
			},

			{
				eng: ren.particle,
				mode: 3,
				next: 4000
			},

			{
				eng: ren.logo,
				post: post.blur,
				next: 4000
			},

		];

		if (!support.gpuSim){

		}

		// //debug
		scene = [
			scene[1],
			scene[2],
			scene[3]
		];


		var stages = {
			currentIndex: 0,
			now: null,
			clear: true
		};

		var frbt = _di.get('service.frbt');

		var i = 0;
		function changeNow(){
			stages.currentIndex = i++;
			stages.now = scene[stages.currentIndex];
			stages.clear = true;


			if (stages.now.eng.updateMode){
				frbt.addTask(
					stages.now.eng.updateMode,
					stages.now.eng,
					stages.now.mode
				);

				//stages.now.eng.updateMode(stages.now.mode);

			}

			if (i >= scene.length){
				i = 0;
			}

			setTimeout(changeNow, stages.now.next || 5000);
		}
		changeNow();

		// setInterval(changeNow,4000);

		return stages;
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
				now.eng && now.eng.type === 'GpuParticle'
			){
				now.eng.render(now.post);
			} else if (
				now.post && now.post.type === 'blur' ||
				now.post && now.post.type === 'normal'
			){
				postProcess.renderPass(now.eng.render, now.post);
			}else{
				now.eng.render();
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
















