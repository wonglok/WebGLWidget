precision mediump float;
varying vec2 vTextureCoord;
uniform float uTimer;
uniform int uSReady;
uniform sampler2D uSampler;

float rand(vec2 co){
    return fract(sin(
        dot(
            co,
            vec2(32.45884,64.23432)
        ) * 74.582974
    ) * 49.9478593);
}


void main(void) {
    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));


    float randomVal = rand(
                        vec2(
                            sin(uTimer) * cos(uTimer) - vTextureCoord.s,
                            sin(uTimer) * cos(uTimer) - vTextureCoord.t
                        )
                    );

    vec4 randomColor = vec4(
        sin(uTimer * vTextureCoord.s),
        cos(uTimer * vTextureCoord.t),
        sin(uTimer * randomVal),
        1.0
    );



    // float randomVal = rand(
    //     vec2(
    //         vTextureCoord.x,
    //         vTextureCoord.y
    //     )
    // );

    // float sinTime = sin(uTimer / 250.0);
    // float cosTime = cos(uTimer / 250.0);
    // float tanTime = tan(uTimer / 250.0);

    // vec4 randomColor = vec4(
    //     sinTime * sin(uTimer * vTextureCoord.s),
    //     cosTime * cos(uTimer * vTextureCoord.t),
    //     tanTime * sin(uTimer * randomVal),
    //     1.0
    // );


    if (uSReady == 1){
        gl_FragColor = (1.24 - textureColor) * randomColor;
    }else{
        gl_FragColor = randomColor;
    }
}

