/* global mat4 */
(function(_di){
	'use strict';


	_di.set('renderable.simulator.quad',function(){
		var gl = _di.get('context');
		var _lg = _di.get('service.lazyGL');
		var clock = _di.get('service.clock');
		var frbt = _di.get('service.frbt');

		var mvStack = _di.get('util.mvStack')();
		var pMatrix = mat4.create();
		var degToRad = _di.get('util.degToRad');

		var location = _di.get('program.simulator.particle');

		function render(){
		}

		function init(){

		}

		return {
			render: render,
			init: init
		};
	});

}(window._di));

