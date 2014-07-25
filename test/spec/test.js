/* global describe, it, assert */

(function () {
    'use strict';

    describe('Testing library', function () {
        describe('nameSpace getter', function () {
            //testing nsR
            it('set should be same instance',function(){
                var _di = window.nsR();
                _di.set('factorySetter',function(){
                    return {
                        ha: Math.random()
                    };
                });
                var a = _di.get('factorySetter');
                var b = _di.get('factorySetter');
                assert((a.ha === b.ha));
            });

            it('val should be same instance',function(){
                var _di = window.nsR();
                _di.val('valueSetter',{
                    ha: Math.random()
                });
                var a = _di.get('valueSetter');
                var b = _di.get('valueSetter');

                assert((a.ha === b.ha));
            });

        });

        describe('object freeList', function () {
            //testing nsF
            it('val should be different instance',function(){
                var _f = window._di.get('util.freeList')();
                _f._fac = function(){
                    return {
                        ha: Math.random()
                    };
                };
                var a = _f.alloc();
                var b = _f.alloc();
                assert((a.ha !== b.ha),'val should be different instance');
            });

            it('number of instance should be right',function(){
                var _f = window._di.get('util.freeList')();
                _f._fac = function(){
                    return {
                        ha: Math.random()
                    };
                };
                _f._reset = function(o){
                    o.ha = null;
                };

                assert((_f._free.length === 0),_f._free,'before prep, no instance');
                _f.prep(2);
                assert((_f._free.length === 2),_f._free,'after prerp has instance');

                var a = _f.alloc();
                assert((_f._free.length === 1),_f._free,'after alloc left 1');

                var b = _f.alloc();
                var c = _f.alloc();
                assert((_f._free.length === 0),_f._free,'still has no left');
                _f.free(a);
                assert((_f._free.length === 1),_f._free,'resume free +1');
                _f.free(b);
                assert((_f._free.length === 2),_f._free,'resume free +1');
                _f.free(c);
                assert((_f._free.length === 3),_f._free,'resume free +1');
            });

            it('prevent freeing two objects',function(){
                var _f = window._di.get('util.freeList')();
                _f._fac = function(){
                    return {
                        ha: Math.random()
                    };
                };
                _f._reset = function(o){
                    o.ha = null;
                };
                _f.checking = true;
                _f.report = function(msg){
                    _f.__OMG__MSG = msg;
                };

                var a = _f.alloc();
                _f.free(a);
                _f.free(a);

                assert((typeof _f.__OMG__MSG !== 'undefined'),_f.__OMG__,'should fail when free twice');
            });
        });

        describe('object pooling', function () {
            /* global mat4 */

            //testing nsF
            it('val should be different instance',function(){
                var _f = window._di.get('util.pool')();
                _f._reset = function(o){
                    return mat4.identity(o);
                };
                _f._fac = function(){
                    return mat4.create();
                };
                var a = _f.alloc();
                var b = _f.alloc();
                assert((a !== b),'val should be different instance');
            });

            it('number of instance should be right',function(){
                var _f = window._di.get('util.pool')();
                _f._fac = function(){
                    return mat4.create();
                };
                _f._reset = function(o){
                    return mat4.identity(o);
                };

                function getNumTrue(item){
                    var numOfTrue = 0;
                    var i = 0, ilen = item.length;
                    for(;i<ilen;i++){
                        if(item[i] === true){
                            numOfTrue++;
                        }
                    }
                    return numOfTrue;
                }

                assert((getNumTrue(_f._free) === 0),'before prep, no instance');
                _f.prep(3);
                assert((getNumTrue(_f._free) === 3),'after prerp has instance');

                var a = _f.alloc();
                assert((getNumTrue(_f._free) === 2),'after alloc left 2');


                var b = _f.alloc();
                assert((getNumTrue(_f._free) === 1),'after alloc left 1');

                var c = _f.alloc();
                assert((getNumTrue(_f._free) === 0),'still has no left');

                console.log(_f);
                _f.free(a);
                assert((getNumTrue(_f._free) === 1),JSON.stringify(_f)+'resume free +1');

                _f.free(b);
                assert((getNumTrue(_f._free) === 2),'resume free +1');

                _f.free(c);
                assert((getNumTrue(_f._free) === 3),'resume free +1');
            });

            it('prevent freeing two objects',function(){
                var _f = window._di.get('util.pool')();
                _f._fac = function(){
                    return mat4.create();
                };
                _f._reset = function(o){
                    return mat4.identity(o);
                };

                var a = _f.alloc();
                _f.free(a);

                var catched = false;
                try {
                    _f.free(a);
                } catch (e){
                    catched = true;
                }
                assert(catched,'should fail when free twice');

            });
        });



        describe('util.pool', function () {
            it('prevent freeing two objects',function(){
                assert(true);
            });
        });







    });

})();
