/**
 * Wong Lok
 * @wonglok831
 * Particle Show Vertex Shader - Sampler2D Vertex
 */

attribute vec2 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform sampler2D uSampler;

void main(void) {

	vec2 vert2dPos = aVertexPosition.xy + vec2( 0.5 / 200.0, 0.5 / 200.0 );
	vec3 vert3dPos = texture2D( uSampler, vert2dPos ).xyz * 200.0 - 100.0;

	gl_Position = uPMatrix * uMVMatrix * vec4(vert3dPos, 1.0);

    gl_PointSize = 1.0;
}





