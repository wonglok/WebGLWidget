(function(_di){
	'use strict';

	_di.set('postProcessProgram',function(){
		var api = {};

		api.blur = _di.get('program.post.blur');
		// api.normal = _di.get('program.post.normal');

		return api;
	});
	_di.set('renderables',function(){
		var api = {};

		api.logo = _di.get('renderable.logoFan').init();
		api.cube = _di.get('renderable.cube').init();
		api.particle = _di.get('renderable.gpu.particle').init();

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

		var fallbackScene = [
			{
				eng: ren.cube,
				post: post.blur,
				next: 4000
			},
			{
				eng: ren.logo,
				post: post.blur,
				next: 4000
			},
		];
		var scene = [

			{
				//
				eng: ren.cube,
				post: post.blur,
				next: 2000
			},
			{
				//Cyber Squares,
				eng: ren.particle,
				mode: 5,
				next: 3500
			},
			{
				//Edge Pulse,
				eng: ren.particle,
				post: post.blur,
				mode: 2,
				next: 4000
			},
			{
				//WormHole
				eng: ren.particle,
				mode: 4,
				next: 5000
			},
			{
				//Strom,
				eng: ren.particle,
				mode: 3,
				next: 5000
			},
			{
				//Wave,
				eng: ren.particle,
				mode: 1,
				next: 4000
			},
			{
				//Edge Pulse
				eng: ren.particle,
				post: post.blur,
				mode: 2,
				next: 4000
			},

		];

		if (!support.gpuSim){
			scene = fallbackScene;
		}

		var stages = {
			now: null,
			nowIndex: 0,
			clear: true
		};

		var frbt = _di.get('service.frbt');

		var i = 0;
		function changeNow(){
			stages.nowIndex = i++;
			stages.now = scene[stages.nowIndex];
			stages.clear = true;

			//updateMode is for particle.
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
				//delegate the renderer to do post processing
				now.eng.render(now.post);
			} else if (
				now.post && now.post.type === 'blur' ||
				now.post && now.post.type === 'normal'
			){
				//do post process
				postProcess.renderPass(now.eng.render, now.post);
			}else{
				now.eng.render();
			}

		};

		var frbt = _di.get('service.frbt');
		var addRender = function(){
			frbt.addTask(render);
		};
		return addRender;

		// return render;
	});

	_di.set('noWebGL',function(){
		var canvas = _di.get('canvas');
		var context = _di.get('context');

		if (!context){
			console.log(' no webgl ....');

			var d = document;
			var docEl = d.documentElement;
			var gEl = function (id){
				return d.getElementById(id);
			};

			// var add = function(e,c){
			// 	e.appendChild(c);
			// };
			// var nEl = function(t){
			// 	d.createElement(t);
			// };

			var msg = gEl('msg');
			msg.style.display = 'block';

			var ln = gEl('ln');
			var lnTex = ln.innerHTML;
			lnTex = lnTex.replace('support','fully support');
			lnTex = lnTex.replace('canvas','WebGL');
			lnTex += ' Click here to learn more.';
			ln.innerHTML = lnTex;

			var ww = gEl('ww');

			msg.innerHTML += '<br>' + ww.innerHTML;//widget


			docEl.appendChild(msg);
			canvas.style.display = 'none';

			return;
		}

	});

	_di.val('run',function(){
		// var canvas = _di.get('canvas');
		// var context = _di.get('context');

		_di.get('noWebGL');

		// _di.get('service.contextLost');

		//_di.get('service.focus');
		_di.get('loop').start();

	});

}(window._di));














