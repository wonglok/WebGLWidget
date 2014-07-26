//@wonglok831
//particle.simulate.fs


precision highp float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;


uniform float uTimer;

float rand(vec2 co){
	return fract(sin(
		dot(
			co.xy,
			vec2(
				59.454233,
				72.223432
			)
		) * 0.32457
	) * 2342.0);
}

void main() {

	float opacity = 0.0315;


	vec4 nextPos = vec4(opacity);

	vec4 lastPos = texture2D(uSampler, vTextureCoord);


	float randomVal = rand(vec2(
		vTextureCoord.x,
		vTextureCoord.y
	 ));

	float sinTime = sin(uTimer / 500.0);
	float cosTime = cos(uTimer / 500.0);
	float tanTime = tan(uTimer / 500.0);

	vec4 nowPos = vec4(
		sinTime * sin(uTimer * vTextureCoord.s / 1000.0),
		cosTime * cos(uTimer * vTextureCoord.t / 1000.0),
		sinTime * sin(uTimer * 1.0),
		opacity
	);


	vec4 nowPos2 = vec4(
		sinTime * sin(uTimer * randomVal + vTextureCoord.s),
		cosTime * cos(uTimer * randomVal + vTextureCoord.t),
		cosTime * sinTime * tan(uTimer * randomVal),
		opacity
	);


	nextPos = nowPos2;


	//nextPos += nowPos;


	nextPos += lastPos;
	gl_FragColor = nextPos;

}







