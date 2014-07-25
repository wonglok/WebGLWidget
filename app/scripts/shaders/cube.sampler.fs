precision mediump float;
varying vec2 vTextureCoord;
uniform float uCTime;
uniform int uSReady;
uniform sampler2D uSampler;

float rand(vec2 co){
    return fract(sin(
            dot(co,vec2(32.45884,64.23432))
            * 74.582974
        ) * 49.9478593);
}

void main(void) {
    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    float randomVal = rand(
                        vec2(
                            sin(uCTime) * cos(uCTime) - vTextureCoord.s,
                            sin(uCTime) * cos(uCTime) - vTextureCoord.t
                        )
                    );

    vec4 randomColor = vec4(
        sin(uCTime * vTextureCoord.s),
        cos(uCTime * vTextureCoord.t),
        sin(uCTime * randomVal),
        1.0
    );

    if (uSReady == 1){
        gl_FragColor = (1.24 - textureColor) * randomColor;
    }else{
        gl_FragColor = randomColor;
    }
}

