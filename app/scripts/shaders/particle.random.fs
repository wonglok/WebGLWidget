precision mediump float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

void main() {
	vec4 fC = texture2D(uSampler, vTextureCoord);
	gl_FragColor = fC;
}




