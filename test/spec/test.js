/* global describe, it, assert, beforeEach, afterEach */

(function (_di) {
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

        describe('object linked list', function () {

            var dll, DoublyLinkedList;


            beforeEach(function(){
                DoublyLinkedList = _di.get('DoublyLinkedList');
                dll = new DoublyLinkedList();
            });

            afterEach(function(){
                DoublyLinkedList = null;
                dll = null;
            });

            it('testing push pop',function(){
                var a = {
                    a:1
                };
                dll.push(a);

                var ans = a === dll.pop();

                assert(ans,'works push pop');
            });

            it('testing push pop 2',function(){
                var a = {
                    a:1
                };
                dll.push(a);

                var b = {
                    b:1
                };
                dll.push(b);

                var pop = dll.pop();

                assert(a !== pop,'not the wrong one');
                assert(b === pop,'the right one');
            });


            it('testing shift',function(){
                var a = {
                    a:1
                };
                dll.push(a);

                var b = {
                    b:1
                };
                dll.push(b);

                var shift = dll.shift();

                assert(b !== shift,'not the wrong one');
                assert(a === shift,'the right one');
            });


        });


        describe('object freeList', function () {
            //testing nsF
            it('val should be different instance',function(){
                var _f = _di.get('util.pool')();
                _f._fac = function(){
                    return {
                        ha: Math.random()
                    };
                };
                _f._reset = function(o){
                    o.ha = null;
                };
                _f.prep(1);
                var a = _f.alloc();
                var b = _f.alloc();

                assert((a !== b),'val should be different instance');
            });

            it('number of instance should be right',function(){
                var _f = _di.get('util.pool')();
                _f._fac = function(){
                    return {
                        ha: Math.random()
                    };
                };
                _f._reset = function(o){
                    o.ha = null;
                };

                assert((_f._free.length === 0),'before prep, no instance');

                _f.prep(2);
                assert((_f._free.length === 2),'after prerp has instance');

                var a = _f.alloc();
                assert((_f._free.length === 1),'after alloc left 1');

                var b = _f.alloc();
                assert((_f._free.length === 0),'still has no left');

                _f.free(a);
                assert((_f._free.length === 1),'1resume free +1');
                _f.free(b);
                assert((_f._free.length === 2),'2resume free +1');

            });

            //still has no left

            // it('prevent freeing two objects',function(){
            //     var _f = _di.get('util.pool')();
            //     _f._fac = function(){
            //         return {
            //             ha: Math.random()
            //         };
            //     };
            //     _f._reset = function(o){
            //         o.ha = null;
            //     };
            //     _f.checking = true;
            //     _f.report = function(msg){
            //         _f.__OMG__MSG = msg;
            //     };

            //     var a = _f.alloc();
            //     _f.free(a);
            //     _f.free(a);

            //     assert((typeof _f.__OMG__MSG !== 'undefined'),_f.__OMG__,'should fail when free twice');
            // });
        });











    });

})(window._di);
