/**
 * Wong Lok
 * @wonglok831
 * Normal Quad Fragment Shader - Post Process
 */

precision mediump float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

void main() {
	vec4 frameColor = texture2D(uSampler, vTextureCoord);
	gl_FragColor = frameColor;

}




