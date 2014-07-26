attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;


uniform sampler2D uSampler;


void main(void) {

	vec2 oPos = aVertexPosition.xy + vec2( 0.5 / 200.0, 0.5 / 200.0 );
	vec3 newPos = texture2D( uSampler, oPos ).xyz * 200.0 - 100.0;

	gl_Position = uPMatrix * uMVMatrix * vec4(newPos, 1.0);
}

