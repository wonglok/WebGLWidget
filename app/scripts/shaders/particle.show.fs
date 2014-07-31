/**
 * Wong Lok
 * @wonglok831
 * Particle Show Fragment Shader - Sampler2D Vertex
 */

precision mediump float;

uniform float uTimer;

float opacity = 0.2;

float rand(vec2 co){
    return fract(sin(
        dot(
            co,
            vec2(
            	32.45884,
            	64.23432
        	)
        ) * 74.582974
    ) * 49.9478593);
}


void main(void) {
	float sinTime = sin(  uTimer / 100.0);
	float cosTime = cos(  uTimer / 100.0);
	float tanTime = tan(  uTimer / 100.0);

	float randomNum =  rand( vec2( sinTime, cosTime) );
	float randomNum2 = rand( vec2( cosTime, tanTime) );
	float randomNum3 = rand( vec2( tanTime, sinTime) );

	vec3 rgb = vec3(randomNum,randomNum2,randomNum3);

	gl_FragColor = vec4(rgb, opacity);
}