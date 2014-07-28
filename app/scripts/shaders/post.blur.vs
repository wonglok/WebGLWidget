/**
 * Wong Lok
 * @wonglok831
 * Gaussain Blur Vertex Shader - Post Process
 * Fixed Mobile Bug
 *
 * Orignal: @xissburg
 * http://xissburg.com/faster-gaussian-blur-in-glsl/
 * https://github.com/xissburg/XBImageFilters/blob/master/XBImageFilters/Sample/Resources/Shaders/Blur.fsh
 * MIT Licensed
 */

attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform float uVibrate;

varying vec2 vTextureCoord;

varying vec2 vK[6];


void main() {
	vec2 vTC = aTextureCoord;

	float cv = uVibrate;

	vTC = aTextureCoord;

	gl_Position = vec4(aVertexPosition, 0.0, 1.0);

	vK[ 0] = vTC + vec2( cv * -0.024, cv * -0.02);
	vK[ 1] = vTC + vec2( cv * -0.016, cv * -0.01);
	vK[ 2] = vTC + vec2( cv * -0.008, cv * -0.00);

	vK[ 3] = vTC + vec2( cv *  0.004, cv *  0.00);
	vK[ 4] = vTC + vec2( cv *  0.012, cv *  0.01);
	vK[ 5] = vTC + vec2( cv *  0.020, cv *  0.02);

	vTextureCoord = vTC;

	/*
	vBlurTexCoords[ 0] = vTextureCoord + vec2(-0.028, -0.028);
	vBlurTexCoords[ 1] = vTextureCoord + vec2(-0.024, -0.024);
	vBlurTexCoords[ 2] = vTextureCoord + vec2(-0.020, -0.020);
	vBlurTexCoords[ 3] = vTextureCoord + vec2(-0.016, -0.016);
	vBlurTexCoords[ 4] = vTextureCoord + vec2(-0.012, -0.012);
	vBlurTexCoords[ 5] = vTextureCoord + vec2(-0.008, -0.008);
	vBlurTexCoords[ 6] = vTextureCoord + vec2(-0.004, -0.004);
	vBlurTexCoords[ 7] = vTextureCoord + vec2( 0.004,  0.004);
	vBlurTexCoords[ 8] = vTextureCoord + vec2( 0.008,  0.008);
	vBlurTexCoords[ 9] = vTextureCoord + vec2( 0.012,  0.012);
	vBlurTexCoords[10] = vTextureCoord + vec2( 0.016,  0.016);
	vBlurTexCoords[11] = vTextureCoord + vec2( 0.020,  0.020);
	vBlurTexCoords[12] = vTextureCoord + vec2( 0.024,  0.024);
	vBlurTexCoords[13] = vTextureCoord + vec2( 0.028,  0.028);

	vBlurTexCoords[ 0] = vTextureCoord + vec2(-0.028, 0.0);
	vBlurTexCoords[ 1] = vTextureCoord + vec2(-0.024, 0.0);
	vBlurTexCoords[ 2] = vTextureCoord + vec2(-0.020, 0.0);
	vBlurTexCoords[ 3] = vTextureCoord + vec2(-0.016, 0.0);
	vBlurTexCoords[ 4] = vTextureCoord + vec2(-0.012, 0.0);
	vBlurTexCoords[ 5] = vTextureCoord + vec2(-0.008, 0.0);
	vBlurTexCoords[ 6] = vTextureCoord + vec2(-0.004, 0.0);
	vBlurTexCoords[ 7] = vTextureCoord + vec2( 0.004, 0.0);
	vBlurTexCoords[ 8] = vTextureCoord + vec2( 0.008, 0.0);
	vBlurTexCoords[ 9] = vTextureCoord + vec2( 0.012, 0.0);
	vBlurTexCoords[10] = vTextureCoord + vec2( 0.016, 0.0);
	vBlurTexCoords[11] = vTextureCoord + vec2( 0.020, 0.0);
	vBlurTexCoords[12] = vTextureCoord + vec2( 0.024, 0.0);
	vBlurTexCoords[13] = vTextureCoord + vec2( 0.028, 0.0);

	vBlurTexCoords[ 0] = vTextureCoord + vec2(0.0, -0.028);
	vBlurTexCoords[ 1] = vTextureCoord + vec2(0.0, -0.024);
	vBlurTexCoords[ 2] = vTextureCoord + vec2(0.0, -0.020);
	vBlurTexCoords[ 3] = vTextureCoord + vec2(0.0, -0.016);
	vBlurTexCoords[ 4] = vTextureCoord + vec2(0.0, -0.012);
	vBlurTexCoords[ 5] = vTextureCoord + vec2(0.0, -0.008);
	vBlurTexCoords[ 6] = vTextureCoord + vec2(0.0, -0.004);
	vBlurTexCoords[ 7] = vTextureCoord + vec2(0.0,  0.004);
	vBlurTexCoords[ 8] = vTextureCoord + vec2(0.0,  0.008);
	vBlurTexCoords[ 9] = vTextureCoord + vec2(0.0,  0.012);
	vBlurTexCoords[10] = vTextureCoord + vec2(0.0,  0.016);
	vBlurTexCoords[11] = vTextureCoord + vec2(0.0,  0.020);
	vBlurTexCoords[12] = vTextureCoord + vec2(0.0,  0.024);
	vBlurTexCoords[13] = vTextureCoord + vec2(0.0,  0.028);
	 */



}
