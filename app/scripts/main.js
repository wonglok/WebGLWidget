(function(_di){
	'use strict';

	_di.set('stages',function(){
		var stg = _di.get('renderable.logoFan');
		var cube = _di.get('renderable.cube');


		var post = {
			blur: _di.get('program.post.blur'),
			normal: _di.get('program.post.normal'),
		};

		stg.init();
		cube.init();

		var scene, postProcess;
		scene = [
			cube,
			stg,
			cube,
			stg
		];
		postProcess = [
			post.blur,
			post.blur,
			false,
			post.normal
		];



		var stage = {
			current:{
				index: 0,
				renderer:null,
				postProcess: null
			},
		};

		var i = 0;

		function switchStage(){
			stage.current.index = i++;

			stage.current.renderer = scene[stage.current.index];
			stage.current.postProcess = postProcess[stage.current.index];

			if (i >= scene.length){
				i = 0;
			}
		}
		switchStage();

		setInterval(switchStage,2500);

		return stage;
	});

	_di.set('render.fbo1',function(){
		var rttFBO = _di.get('util.makeFBO')();
		return rttFBO;
	});

	_di.set('render.fbo2',function(){
		var rttFBO = _di.get('util.makeFBO')();
		return rttFBO;
	});

	_di.set('render',function(){
		var stages = _di.get('stages');
		var rttFBO1 = _di.get('render.fbo1');

		var render = function(){

			var current = stages.current;


			/*jslint bitwise: true */
			// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			if (current.postProcess && current.postProcess.type === 'particle'){


			}else if (
				current.postProcess && current.postProcess.type === 'blur' ||
				current.postProcess && current.postProcess.type === 'normal'
			){

				//set to fbo
				rttFBO1.bindFrameBuffer();
				//render,
				current.renderer.render();

				//rtt texutre is filled then.
				//resume default fbo
				rttFBO1.unbindFrameBuffer();

				//bind the post pcrocessing program
				rttFBO1.bindPostProcess(current.postProcess);

				//update time
				current.postProcess.simulate();

				//draw the rtt texture to fullscreen quad
				rttFBO1.draw();

			}else{
				current.renderer.render();
			}

		};

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

		_di.get('loop').start();

	});

}(window._di));
















