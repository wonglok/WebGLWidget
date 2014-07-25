// var cubeMapTexture;
// function initCubeMap(){
// 	//Init Cube map
// 	function loadFaces(_lg ,gl, enumTarget, cubeMap, src) {
// 		var img = new Image();
// 		img.onload = function(){
// 		    _lg.useProgram(location.program);
// 		    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);
// 		    gl.texImage2D(enumTarget, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('ww'));
// 			gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
// 			cubeMap.$loaded = cubeMap.$loaded || 0;
// 			cubeMap.$loaded++;
// 			console.log(cubeMap.$loaded);
// 			if(cubeMap.$loaded === 6){
// 				cubeMap.$ready = true;
// 			}
// 		};
// 		img.src = src;
// 	}
// 	//

// 	cubeMapTexture = gl.createTexture();
// 	//cubeMapTexture.$loaded = 0;
// 	cubeMapTexture.url = 'images/texture/webgl.png';

// 	gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMapTexture);
// 	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
// 	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);


// 	loadFaces(_lg, gl, gl.TEXTURE_CUBE_MAP_POSITIVE_X, cubeMapTexture, cubeMapTexture.url);
// 	loadFaces(_lg, gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, cubeMapTexture, cubeMapTexture.url);

// 	loadFaces(_lg, gl, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, cubeMapTexture, cubeMapTexture.url);
// 	loadFaces(_lg, gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, cubeMapTexture, cubeMapTexture.url);

// 	loadFaces(_lg, gl, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, cubeMapTexture, cubeMapTexture.url);
// 	loadFaces(_lg, gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, cubeMapTexture, cubeMapTexture.url);
// }