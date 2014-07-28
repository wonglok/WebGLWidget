/**
 * Wong Lok
 * @wonglok831
 * Particle Show Vertex Shader - Sampler2D Vertex
 */

attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform sampler2D uSampler;

void main(void) {

	vec2 oldPos = aVertexPosition.xy + vec2( 0.5 / 200.0, 0.5 / 200.0 );
	vec3 newPos = texture2D( uSampler, oldPos ).xyz * 200.0 - 100.0;

	gl_Position = uPMatrix * uMVMatrix * vec4(newPos, 1.0);
}

