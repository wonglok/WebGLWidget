(function(){
	'use strict';

	//<3
	//vanillla code organizr

	window.HAS_WEBGL = (function(){
		return !!window.WebGLRenderingContext;
	}());

	function nsR(){
		var _di = {
			fac: {},
			inst: {},
			//setters
			val: function(name,val){
				_di.inst[name] = val;
			},
			set: function(name,factory){
				_di.inst[name] = null;
				_di.fac[name] = factory;
			},

			//getter
			get: function(name){
			//	return (console.log('di-get: '+name),_di.inst[name]) || (_di.inst[name] = _di.make(name));
				return _di.inst[name] || (_di.inst[name] = _di.make(name));
			},

			//maker
			make: function(name){
				var factory = _di.fac[name];
				if (factory){
					console.log('dimk: '+name);
					return factory();
				}else{
					throw new Error('Factory Not Found!! '+name);
				}
			}
		};

		return _di;
	}
	window.nsR = nsR;

	var _di = nsR();
	window._di = _di;

	_di.val('nsR',nsR);



}());


