(function(_di){
	'use strict';
	//utility functions, services, and more.

	/**
	 * convert degree to radian
	 * @param  {[type]} degrees [description]
	 * @return {[type]}         [description]
	 */
	_di.val('util.degToRad',function degToRad(degrees) {
		degToRad.RADIAN = degToRad.RADIAN || Math.PI / 180;
		return degrees * degToRad.RADIAN;
	});

	/**
	 * Simulate the behaviour of an array with push pop.
	 * @return {[type]} [description]
	 */
	_di.set('DoublyLinkedList',function(){
		//https://github.com/mschwartz/SilkJS
		var DoublyLinkedList = function() {
			this.___next = this;
			this.___prev = this;
			this.length = 0;
		};
		DoublyLinkedList.prototype = {
			constructor: DoublyLinkedList,
			//addHead: function(o) {
			unshift: function(o) {
				this.length++;
				this.append(o, this);
			},

			//addTail: function(o) {
			push: function(o) {
				this.length++;
				this.append(o, this.___prev);
			},

			//remHead: function() {
			shift: function() {
				this.length--;
				return this.___next === this ? false : this.remove(this.___next);
			},

			//remTail: function() {
			pop: function() {
				this.length--;
				return this.___prev === this ? false : this.remove(this.___prev);
			},
			append: function(node, after) {
				node.___next = after.___next;
				node.___prev = after;
				after.___next.___prev = node;
				after.___next = node;
			},
			remove: function(node) {
				node.___next.___prev = node.___prev;
				node.___prev.___next = node.___next;
				return node;
			},
			each: function(fn) {
				for (
					var node = this.___next;
					node !== this;
					node = node.___next
				) {
					fn(node);
				}
			},
			empty: function() {
				return this.___next === this;
			}
		};

		return DoublyLinkedList;
	});

	/**
	 * mvStack with linked list and mempool
	 * @return {[type]} [description]
	 */
	_di.val('util.mvStack',function(){
		/*global mat4*/

		//prep
		var _f = _di.get('util.pool')();
		_f._fac = function(){
			return mat4.create();
		};
		_f._reset = function(o){
			o.___next = null;
			o.___prev = null;
			return mat4.identity(o);
		};
		_f.prep(3);

		var api = {};

		var DoublyLinkedList = _di.get('DoublyLinkedList');
		var stack = new DoublyLinkedList();

		var mvMatrixStack = stack;//[];

		api.mvMatrix = _f.alloc();
		api.pMatrix = mat4.create();

		api.mvSave = function() {
			var temp = _f.alloc();
			//save a copy
			mat4.copy(temp,api.mvMatrix);
			mvMatrixStack.push(temp);
		};

		api.mvRestore = function () {
			if (mvMatrixStack.length === 0) {
				throw 'no more to pop!';
			}

			//free the mvMatrix;
			_f.free(api.mvMatrix);

			//retore & replace the mvMat4 with the old version
			api.mvMatrix = mvMatrixStack.pop();
		};

		return api;

	});


	/**
	 * FrameBudget TaskManager
	 * @return {[type]} [description]
	 */
	_di.set('FrbT',function(){
		var DoublyLinkedList = _di.get('DoublyLinkedList');
		var poolFactory = _di.get('util.pool');

		function Task(){
			this.fn = null;
			this.ctx = null;
			this.data = null;
			this.args = null;

			this.___next = null;
			this.___prev = null;
		}
		Task.prototype.reset = function(o){
			// o.fn = null;
			// o.data = null;
			// o.ctx = null;
			// o.args = null;
			o.___next = null;
			o.___prev = null;
			return o;
		};

		//framebudget task manager
		function FrbT(){
			var that = this;
			this.frameBudget = 6;//6ms can do a lot ...

			this.state = {
				finished: false,
			};
			this.prebind = {
				digest: that.digest.bind(that)
			};

			//do task
			var stack = new DoublyLinkedList();
			this.asyncStack = stack;

			// this.asyncStack = [];

			//prep taks pool
			var _f = poolFactory();
			_f.noop = function(){};
			_f._fac = function(){
				return new Task();
			};
			_f._reset = Task.prototype.reset;
			_f.prep(3);

			this.pool = _f;
		}

		FrbT.prototype = {
			constructor: FrbT,
			updateFrameBudget: function(frameBudget){
				this.frameBudget = frameBudget;
			},
			addTask: function(fn,ctx,data,args){

				var task = this.pool.alloc();

				task.fn = fn;
				task.data = data;
				task.ctx = ctx;
				task.args = args;

				this.asyncStack.push(task);
				this.state.finished = false;
			},
			stepTask: function(frameStartTime){
				this.taskStepper(this.asyncStack,frameStartTime, this.frameBudget);
			},
			taskStepper: function(stack,fStartTime,budget){
				if (stack.length === 0){
					return;
				}
				var perf = window.performance;
				var todo;
				var timeLeft;
				do {
					todo = stack.shift();
					if (
						typeof todo !== 'undefined' &&
						typeof todo.fn === 'function'
					){
						if (typeof todo.args !== 'undefined'){
							todo.fn.apply(todo.ctx,todo.args);
						}else{
							todo.fn.call(todo.ctx,todo.data);
						}
					}
					timeLeft = (perf.now() - fStartTime);
					this.pool.free(todo);
				} while (
					stack.length > 0 &&
					(timeLeft < budget)
				);
			},
			checkFinish: function(){
				var ans = (this.asyncStack.length === 0);
				if (ans){
					this.state.finished = true;
				}
				return ans;
			},
			digest: function (cTime){
				this.stepTask( cTime || window.performance.now() || Date.now() );
				if (!this.state.finished && !this.checkFinish()){
					window.requestAnimationFrame(this.prebind.digest);
				}
			}
		};
		return FrbT;
	});

	_di.set('service.frbt',function(){
		var FrbT = _di.get('FrbT');
		return new FrbT();
	});

	// push pop model, with doubly linked list :)
	_di.val('util.pool',function freelist(){
		var DoublyLinkedList = _di.get('DoublyLinkedList');
		var stack = new DoublyLinkedList();

		//stack = [];

		var _f = {
			useCount: 0, //consistence checking
			_free: stack,
			_reset: function(o){ console.log('_resetter not ready!',o); },
			_fac: function(){ console.log('_factory not ready!'); },
			make: function(){
				//console.log('plmk:',_f._fac.toString());
				return _f._fac();
			},
			makeFree: function(){
				_f._free.push(_f.make());
			},
			getFree: function(){
				return _f._free.shift();
			},
			prep: function(num){
				for (var i = 0; i < num; i++) {
					_f.makeFree();
				}
			},
			alloc: function(){
				var obj = _f.getFree();

				if (!obj){
					_f.makeFree();
					obj = _f.getFree();
				}

				_f._reset(obj);

				_f.useCount++;
				return obj;
			},
			// report: function(msg){
			// 	console.log(msg);
			// 	throw new Error(msg);
			// },
			free: function(obj){
				// if(_f.checking){
				// 	if (_f._free.indexOf(obj) !== -1){
				// 		_f.report('free same obj');
				// 		return;
				// 	}
				// }

				_f._reset(obj);

				_f._free.push(obj);
				_f.useCount--;
			}
		};
		return _f;
	});


	//set free model
	// _di.val('util.pool',function (factory,reset){
	// 	var _f = {

	// 		_free: [],
	// 		_pool: [],
	// 		_fac:factory,
	// 		_reset:reset,

	// 		_grow: function(free){
	// 			var object = _f._fac();
	// 			_f._pool.push(object);
	// 			_f._free.push(free);
	// 			return object;
	// 		},
	// 		prep: function(num){
	// 			var i = 0;
	// 			for (; i < num; i++) {
	// 				_f._grow(true);
	// 			}
	// 		},
	// 		alloc: function(){
	// 			var freeIndex = _f._free.indexOf(true);
	// 			var allocItem;
	// 			if (freeIndex !== -1){
	// 				allocItem =  _f._pool[freeIndex];
	// 				//set to busy
	// 				_f._free[freeIndex] = false;
	// 			}else{
	// 				//grow a new busy item
	// 				allocItem = _f._grow(false);
	// 			}

	// 			return _f._reset(allocItem);
	// 		},
	// 		free: function(obj){
	// 			var oldIndex = _f._pool.indexOf(obj);
	// 			if (oldIndex !== -1 && !_f._free[oldIndex]){
	// 				_f._free[oldIndex] = true;
	// 			}else{
	// 				throw new Error('cannot free same item!');
	// 			}
	// 		}
	// 	};
	// 	return _f;
	// });






	_di.val('util.getShader',function(gl, str,type){
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

	_di.val('util.makeProgramFromDom',function(vID,fID){
		var getDomSrc = _di.get('util.getDomSrc');
		var progMaker = _di.get('util.makeProgramFromSrc');

		return progMaker(
			getDomSrc(vID),
			getDomSrc(fID)
		);
	});

	_di.val('util.makeProgramFromSrc',function(vSrc,fSrc){
		var gl = _di.get('context');
		var getShader = _di.get('util.getShader');

		var vs = getShader(gl,vSrc,'vs');
		var fs = getShader(gl,fSrc,'fs');

		var prg = gl.createProgram();

		gl.attachShader(prg, vs);
		gl.attachShader(prg, fs);
		gl.linkProgram(prg);
		prg.defaultName = vs.length + fs.length;

		if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
			console.log('cannot link shader');
		}

		gl.useProgram(prg);
		return prg;
	});

	_di.val('util.getLocationCacheManual',function(program, attributes, uniforms){
		var gl = _di.get('context');

		var locationCache = {
			program: program
		};

		var location;
		for (var ai = 0; ai < attributes.length; ai++) {
			location = gl.getAttribLocation(program, attributes[ai]);
			if (typeof location === 'undefined'){
				throw new Error('attribute not found :'+attributes[ai]);
			}
			locationCache[attributes[ai]] = location;
			gl.enableVertexAttribArray(location);
		}

		for (var ui = 0; ui < uniforms.length; ui++) {
			location = gl.getUniformLocation(program, uniforms[ui]);
			if (typeof location === 'undefined'){
				throw new Error('unifrom not found :'+uniforms[ui]);
			}
			locationCache[uniforms[ui]] = location;
			locationCache[uniforms[ui]].___uniformName = uniforms[ui];
		}


		return locationCache;
	});

	_di.val('util.getLocationCache',function(program){
		var gl = _di.get('context');

		var i, count, attrib, uniform, shaderLocation;
		var cache = {
			program: program
		};
		count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
		for (i = 0; i < count; i++) {
			attrib = gl.getActiveAttrib(program, i);
			shaderLocation = gl.getAttribLocation(program, attrib.name);
			cache[attrib.name] = shaderLocation;
			gl.enableVertexAttribArray(shaderLocation);
		}

		count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
		for (i = 0; i < count; i++) {
			uniform = gl.getActiveUniform(program, i);
			cache[uniform.name] = gl.getUniformLocation(program, uniform.name);
			cache[uniform.name].___uniformName = uniform.name;
		}

		console.table([cache]);

		return cache;
	});

	/**
	 * service.devlog
	 * @return {[type]} [description]
	 */
	_di.set('service.devLog',function(){
		var documentFrag = document.createDocumentFragment();
		function log(text){
			var sp2 = document.createElement('span');
			sp2.innerHTML = text;
			documentFrag.appendChild(sp2);
		}
		function show(){
			document.documentElement.appendChild(documentFrag);
		}

		return {
			log:log,
			show:show
		};
	});

	/**
	 * check support of webgl
	 * @return {[type]} [description]
	 */
	_di.val('fac.check',function(){
		var check = {};
		var gl = _di.get('context');

		check.vertexSampler = (
			gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) >= 1
		);

		check.oesFloat = (
			!!gl.getExtension('OES_texture_float')
		);

		check.checkFBOColor = function(){
			var width = 10, height = 10;
			var tex = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, tex);

			//texture float
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);

			//xy wrapping, clam to edge
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

			//dont use mig mag
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


			//color attachment
			var colcorFB = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, colcorFB);

			//depth attachment
			var depthRB = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, depthRB);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRB);

			var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
			if (status !== gl.FRAMEBUFFER_COMPLETE) {
				return false;
			}else{
				return true;
			}

		};

		check.fboColorAttachment = (function(){
			return check.checkFBOColor();
		}());

		//if any of the stuff is not supported, then dont use this. :)
		if (!check.vertexSampler || !check.oesFloat || !check.fboColorAttachment) {
			check.gpuSim = false;
		}else{
			check.gpuSim = true;
		}

		// if (
		// 	navigator.userAgent.match(/(iPod|iPhone|iPad)/)
		// ){
		// 	var usrA= navigator.userAgent;
		// 	var info = usrA.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		// 	if (parseFloat(info[2],10) <= 9537){//less than ios8 beta4.
		// 		check.gpuSim = false;
		// 	}
		// }

		// console.log(check
		// 	//[JSON.stringify(,null,'\t')]
		// );

		return check;
	});

	/**
	 * Service for support
	 * @return {[type]} [description]
	 */
	_di.set('service.support',function(){
		return _di.get('fac.check')();
	});


	/**
	 * Lgo fan
	 * @return {[type]} [description]
	 */
	_di.set('program.fan',function(){
		var getLocationCache = _di.get('util.getLocationCache');

		var program = _di.get('util.makeProgramFromSrc')(
			_di.get('scripts/shaders/fan.vs'),
			_di.get('scripts/shaders/fan.fs')
		);

		var locationCache = getLocationCache(program);

		return locationCache;
	});

	/**
	 * cube noise sampler
	 * @return {[type]} [description]
	 */
	_di.set('program.cube.sampler',function(){
		var getLocationCache = _di.get('util.getLocationCache');

		var program = _di.get('util.makeProgramFromSrc')(
			_di.get('scripts/shaders/cube.sampler.vs'),
			_di.get('scripts/shaders/cube.sampler.fs')
		);

		var uniforms = [
			'uMVMatrix',
			'uPMatrix',

			//for fragment shader
			'uSampler',
			'uSReady',

			'uCTime'
		];
		var attributes = [
			'aVertexPosition',
			'aTextureCoord',
		];

		var locationCache = getLocationCache(program,attributes,uniforms);

		return locationCache;
	});

	/**
	 * normal post processing
	 * @return {[type]} [description]
	 */
	_di.set('program.post.normal',function(){
		var getLocationCache = _di.get('util.getLocationCache');

		var program = _di.get('util.makeProgramFromSrc')(
			_di.get('scripts/shaders/post.normal.vs'),
			_di.get('scripts/shaders/post.normal.fs')
		);
		var locationCache = getLocationCache(program);

		locationCache.type = 'normal';
		locationCache.simulate = function(){
		};

		return locationCache;
	});

	/**
	 * particle random simulator
	 * @return {[type]} [description]
	 */
	_di.set('program.particle.simulate',function(){
		var getLocationCache = _di.get('util.getLocationCache');

		var program = _di.get('util.makeProgramFromSrc')(
			_di.get('scripts/shaders/particle.simulate.vs'),
			_di.get('scripts/shaders/particle.simulate.fs')
		);
		var locationCache = getLocationCache(program);

		var clock = _di.get('service.clock');
		var gl = _di.get('context');

		locationCache.type = 'particle';
		locationCache.simulate = function(){
			gl.uniform1f(locationCache.uTimer,clock.cTime);
		};

		return locationCache;
	});

	/**
	 * particle random simulator
	 * @return {[type]} [description]
	 */
	_di.set('program.particle.show',function(){
		var getLocationCache = _di.get('util.getLocationCache');

		var program = _di.get('util.makeProgramFromSrc')(
			_di.get('scripts/shaders/particle.show.vs'),
			_di.get('scripts/shaders/particle.show.fs')
		);
		var locationCache = getLocationCache(program);

		// var clock = _di.get('service.clock');
		// var gl = _di.get('context');

		locationCache.type = 'particle';
// 		locationCache.simulate = function(){
// 			gl.uniform1f(locationCache.uTimer,clock.cTime);
// 		};

		return locationCache;
	});


	/**
	 * post processing blurrrrr
	 * @return {[type]} [description]
	 */
	_di.set('program.post.blur',function(){
		var getLocationCache = _di.get('util.getLocationCache');
		var program = _di.get('util.makeProgramFromSrc')(
			_di.get('scripts/shaders/post.blur.vs'),
			_di.get('scripts/shaders/post.blur.fs')
		);
		var locationCache = getLocationCache(program);

		var gl = _di.get('context');
		var clock = _di.get('service.clock');

		locationCache.type = 'blur';
		locationCache.simulate = function(){
			//vibe
			gl.uniform1f(locationCache.uVibrate,Math.sin(clock.eTime+clock.sTime*10));
		};

		return locationCache;
	});


	/**
	 * canvas dom
	 * @return {[type]} [description]
	 */
	_di.set('canvas',function(){
		var canvas = document.getElementById('ww');
		return canvas;
	});

	/**
	 * 3d graphics context
	 * @return {[type]} [description]
	 */
	_di.val('util.makeContext',function(){
		var canvas = _di.get('canvas');
		var context = canvas.getContext('webgl');

		if (context){
			context.viewportWidth = canvas.width;
			context.viewportHeight = canvas.height;
		}

		return context;
	});
	_di.set('context',function(){
		var context;
		context = _di.get('util.makeContext')();
		return context;
	});
	_di.set('service.contextLost',function(){
		var canvas = _di.get('canvas');
		var loop = _di.get('loop');

		canvas.addEventListener('webglcontextlost', function(event) {
			event.preventDefault();
			console.log('context lost!');

			loop.stop();
		}, false);

		canvas.addEventListener('webglcontextrestored', function() {
			window.location.assign(window.location.href);
		}, false);

	});



	/**
	 * loopsiloopsiloop
	 * @return {[type]} [description]
	 */
	_di.set('loop',function (){
		var frbt = _di.get('service.frbt');
		var render = _di.get('render');
		var clock = _di.get('service.clock');
		var timerID = 0;
		var busy = false;
		function start(){
			console.log('STARTING...');
			if (!busy){
				busy = true;
				timerID = window.requestAnimationFrame(loop);
			}
		}
		function stop(){
			console.log('STOPPING...');
			window.cancelAnimationFrame(timerID);
			timerID = null;
		}
		function loop(fsTime){
			if (timerID === null){ return; }
			timerID = window.requestAnimationFrame(loop);

			//debugger;

			clock.updateTime(fsTime);

			render(fsTime);

			frbt.stepTask(fsTime);

			busy = false;
		}
		return {
			start: start,
			stop: stop
		};
	});

	/**
	 * resume on focus
	 * @return {[type]} [description]
	 */
	_di.set('service.focus',function(){
		var loop = _di.get('loop');
		function focus(){
			loop.start();
		}
		function blur(){
			loop.stop();
		}
		window.addEventListener('focus',focus,false);
		window.addEventListener('blur',blur,false);
	});

	/**
	 * keydown map, true when keydown, keyup = false;
	 * @return {[type]} [description]
	 */
	_di.set('service.keydown',function(){
		var currentlyPressedKeys = {};
		function handleKeyDown(event) {
			currentlyPressedKeys[event.keyCode] = true;
			// console.log('down key:',event.keyCode);
		}
		function handleKeyUp(event) {
			currentlyPressedKeys[event.keyCode] = false;
		}
		window.addEventListener('keydown',handleKeyDown,false);
		window.addEventListener('keyup',handleKeyUp,false);

		return currentlyPressedKeys;
	});

	/**
	 * keydown map, true when keydown, keyup = false;
	 * @return {[type]} [description]
	 */
	_di.set('service.toggle',function(){
		var toogleKey = {};
		function handleKeyUp(event) {
			if (toogleKey[event.keyCode]){
				toogleKey[event.keyCode] = false;
			}else{
				toogleKey[event.keyCode] = true;
			}
			//console.log(toogleKey);
		}
		window.addEventListener('keyup',handleKeyUp,false);

		return toogleKey;
	});




	/**
	 * Clock maker
	 * @return {[type]} [description]
	 */
	_di.val('util.clock',function(){
		var _c = {};
		_c.lastTime = 0; //last time.
		_c.cTime = null; //now
		_c.eTime = 0; //elapsted time 16~17
		_c.sTime = 0; //stepping time
		_c.now = function(cTime){
			var time = cTime || window.performance.now() || Date.now() || new Date().getTime();
			return time;
		};
		_c.updateTime = function(cTime){
			_c.cTime = _c.now(cTime);
			if (_c.lastTime !== 0) {
				var elapsed = _c.cTime - _c.lastTime;
				_c.eTime = elapsed;
				_c.lastTime = _c.cTime;
				_c.sTime = _c.sTime + 0.01;
				return elapsed;
			}

			_c.lastTime = _c.cTime;
			_c.eTime = false;
			return false;
		};
		_c.resetTime = function(){
			_c.lastTime = 0;
			_c.sTime = 0;
		};

		// window.addEventListener('blur',function(){
		// 	_c.lastTime = 0;
		// },false);

		return _c;
	});
	/**
	 * clock service
	 * @return {[type]} [description]
	 */
	_di.set('service.clock',function(){
		return _di.get('util.clock')();
	});




	/**
	 * make lazy GL.
	 * @return {[type]} [description]
	 */
	_di.val('util.lazyGL',function(){
		var gl = _di.get('context');

		var api = {

			ask: {},
			mem: {},
			lazy: {
				_f: {}
			},

		};

		var useProgram = {};
		api.useProgram = function(prog){
			if (useProgram.prog !== prog){
				gl.useProgram(prog);
				useProgram.prog = prog;
			}
		};


		var uniform1i = {};
		api.uniform1i = function(location,value){
			var ns = location.___uniformName;
			if(

				uniform1i[ns] !== value

			){
				gl.uniform1i(location,value);
				uniform1i[ns] = value;
			}
		};

		var uniform1f = {};
		api.uniform1f = function(location,value){
			var ns = location.___uniformName;
			//checkChangeProg(uniform1f);
			if(
				uniform1f[ns] !== value
			){
				gl.uniform1f(location,value);
				uniform1f[ns] = value;
			}
		};

		var uniform3f = {
			NS1:'1',
			NS2:'2',
			NS3:'3',
		};
		api.uniform3f = function(a0, a1, a2, a3){
			var ns = a0.___uniformName;

			if(
				!(
					uniform3f[ns+uniform3f.NS1] === a1 &&
					uniform3f[ns+uniform3f.NS2] === a2 &&
					uniform3f[ns+uniform3f.NS3] === a3
				)
			){
				gl.uniform3f(a0,a1,a2,a3);

				uniform3f[ns+uniform3f.NS1] = a1;
				uniform3f[ns+uniform3f.NS2] = a2;
				uniform3f[ns+uniform3f.NS3] = a3;
			}


		};

		var uniformMatrix4fv = {
			NS1:'1',
			NS2:'2'
		};
		api.uniformMatrix4fv = function(a0, a1, a2) {
			var ns = a0.___uniformName;

			if (!ns){
				throw new Error('cannot find unifrom name');
			}

			if(
				!(
					uniformMatrix4fv[ns+uniformMatrix4fv.NS1] === a1 &&
					uniformMatrix4fv[ns+uniformMatrix4fv.NS2] === a2
				)
			){
				gl.uniformMatrix4fv(a0,a1,a2);
				uniformMatrix4fv[ns+uniformMatrix4fv.NS1] = a1;
				uniformMatrix4fv[ns+uniformMatrix4fv.NS2] = a2;
			}

		};

		var bindBuffer = {};
		api.bindBuffer = function(emTarget, objBuffer){
			if (bindBuffer[emTarget !== objBuffer]){
				gl.bindBuffer(emTarget, objBuffer);
			}
		};

		var vertexAttribPointer = {};
		api.ask.vertexAttribPointer = function(a0,a1,a2,a3,a4,a5){
			if (!vertexAttribPointer[a0]){
				if (a0 === -1 || typeof a0 === 'undefined'){
					throw new Error('location not found!!: '+a0);
				}
				vertexAttribPointer[a0] = {};
			}
			if(
				!(
					vertexAttribPointer[a0].p === useProgram.prog &&
					vertexAttribPointer[a0].a0 === a0 &&
					vertexAttribPointer[a0].a1 === a1 &&
					vertexAttribPointer[a0].a2 === a2 &&
					vertexAttribPointer[a0].a3 === a3 &&
					vertexAttribPointer[a0].a4 === a4 &&
					vertexAttribPointer[a0].a5 === a5
				)
			){
				return true;
			}
			return false;
		};
		api.mem.vertexAttribPointer = function(a0, a1, a2, a3, a4, a5){
			vertexAttribPointer[a0].p = useProgram.prog;
			vertexAttribPointer[a0].a0 = a0;
			vertexAttribPointer[a0].a1 = a1;
			vertexAttribPointer[a0].a2 = a2;
			vertexAttribPointer[a0].a3 = a3;
			vertexAttribPointer[a0].a4 = a4;
			vertexAttribPointer[a0].a5 = a5;

			//debugger;
		};
		api.lazy._f.vertexAttribPointer = function(b0,b1, a0, a1, a2, a3, a4, a5){
			gl.bindBuffer(b0, b1);
			gl.vertexAttribPointer(a0, a1, a2, a3, a4, a5);
		};
		api.lazy.vertexAttribPointer = function(b0,b1, a0, a1, a2, a3, a4, a5){
			if (api.ask.vertexAttribPointer(a0, a1, a2, a3, a4, a5)){
				gl.bindBuffer(b0, b1);
				gl.vertexAttribPointer(a0, a1, a2, a3, a4, a5);
				api.mem.vertexAttribPointer(a0, a1, a2, a3, a4, a5);
			}
		};
		api.vertexAttribPointer = function(a0, a1, a2, a3, a4, a5){
			if(
				api.ask.vertexAttribPointer(a0, a1, a2, a3, a4, a5)
			){
				gl.vertexAttribPointer(a0, a1, a2, a3, a4, a5);
				api.mem.vertexAttribPointer(a0, a1, a2, a3, a4, a5);
			}
		};


		var bindTexture = {};
		api.bindTexture = function(emTarget,objTexture){

			// if (!emTarget){
			// 	throw new Error('no emTarget');
			// }

			// if (!bindTexture[emTarget]){
			// 	bindTexture[emTarget] = {};
			// 	bindTexture[emTarget].
			// }

			// if (objTexture && objTexture.___type){
			// 	// debugger;
			// }


			if(
				bindTexture.program !== useProgram.program ||
				bindTexture[emTarget] !== objTexture
			){


				gl.bindTexture(emTarget,objTexture);

				bindTexture[emTarget] = objTexture;
				bindTexture.program = useProgram.program;
			}

		};


		var activeTexture = {};
		api.activeTexture = function(textureID){
			//checkChangeProg(activeTexture);
			if(
				(
					activeTexture.texture !== textureID
				)
			){
				gl.activeTexture(textureID);
				activeTexture.texture = textureID;
			}

		};

		//int x, inty, long width, long height
		var viewport = {
			a0:null,
			a1:null,
			a2:null,
			a3:null
		};
		api.viewport = function(ix,iy,lw,lh){
			if(
				!(
					viewport.a0 === ix &&
					viewport.a1 === iy &&
					viewport.a2 === lw &&
					viewport.a3 === lh
				)
			){
				gl.viewport(ix,iy,lw,lh);
				viewport.a0 = ix;
				viewport.a1 = iy;
				viewport.a2 = lw;
				viewport.a3 = lh;
			}

		};

		var blendFunc = [null,null];
		api.blendFunc = function(a0,a1){
			if(
				!(
					blendFunc[0] === a0 &&
					blendFunc[1] === a1
				)
			){
				gl.blendFunc(a0,a1);
				blendFunc[0] = a0;
				blendFunc[1] = a1;
			}

		};

		//color rgba, float
		var clearColor = {
			a0:null,
			a1:null,
			a2:null,
			a3:null
		};
		api.clearColor = function(cR,cG,cB,cA){
			if(
				!(
					clearColor.a0 === cR &&
					clearColor.a1 === cG &&
					clearColor.a2 === cB &&
					clearColor.a3 === cA
				)
			){
				gl.clearColor(cR,cG,cB,cA);
				clearColor.a0 = cR;
				clearColor.a1 = cG;
				clearColor.a2 = cB;
				clearColor.a3 = cA;
			}
		};

		var enabled = {};
		api.enable = function(emProperty){
			if (
					enabled[emProperty] !== true
			){
				gl.enable(emProperty);
				enabled[emProperty] = true;
			}

		};
		api.disable = function(emProperty){
			if (
					enabled[emProperty] !== false
			){
				gl.disable(emProperty);
				enabled[emProperty] = false;
			}
		};


		// gl.lazy = api.lazy._f;
		// return gl;

		return api;
	});

	_di.set('service.console.logo',function(){

		var consoleLogo = function (width,height,url,comment){

			//config
			var lineHeight = 14;


			var wl = window.location;

			//build string
			var str = '';

			//str += ' border: red solid 1px; ';

			str += ' font-size: '+lineHeight+'; ';
			str += ' margin-top: 20px; ';
			str += ' margin-bottom: 20px; ';

			str += ' line-height: '+lineHeight+'px; ';

			str += ' padding-top: '+height+'px; ';
			str += ' padding-left: '+width+'px; ';

			str += ' background: url("'+wl.protocol+'//'+wl.host+wl.pathname+url+'"); ';
			str += ' background-position: top center; ';
			str += ' background-repeat:no-repeat; ';

			var lines = '\n';

			var extraLines = (height/lineHeight)-1;
			if (extraLines > 1){
				for(var i = 0; i <= extraLines; i++){
					lines += '\n';
				}
			}

			console.log(lines+'%c', str);

			if (comment){
				console.log(comment);
			}

			return '';
		};

		consoleLogo(
			128,
			64,
			'images/texture/webgl.png',
			'WebGL Widget for Khronos Group'
		);

		return {
			say: consoleLogo
		};


	});

	_di.set('service.lazyGL',function(){
		return _di.get('util.lazyGL')();
	});

	window.domReady = function (callback) {
		if (document.addEventListener) {
			document.addEventListener('DOMContentLoaded', callback, false);
			return;
		}
		window.onload = callback;
	};

	window.domReady(function(){
		_di.get('run')();
		_di.get('service.console.logo');
	});

}(window._di));

