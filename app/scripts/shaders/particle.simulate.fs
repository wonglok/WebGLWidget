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
            )
            * 0.32457
        ) * 2342.0);
}

void main() {
	vec4 frameColor = vec4(1.0);

	vec4 frameColor2 = texture2D(uSampler, vTextureCoord);

  float randomVal = rand(
     vec2(
        vTextureCoord.x,
        vTextureCoord.y
     )
  );

  float sinTime = sin(uTimer / 250.0);
  float cosTime = cos(uTimer / 250.0);
  float tanTime = tan(uTimer / 250.0);

  vec4 randomColor = vec4(
      sinTime * sin(uTimer * vTextureCoord.s),
      cosTime * cos(uTimer * vTextureCoord.t),
      sinTime * sin(uTimer * randomVal),
      1.0
  );

	gl_FragColor = randomColor + frameColor2 ;
}




