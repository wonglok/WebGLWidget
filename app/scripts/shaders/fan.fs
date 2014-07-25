precision mediump float;

uniform sampler2D uSampler;
uniform vec3 uColor;

uniform int tReady;

varying vec2 vTextureCoord;

void main(void) {
    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

    if (tReady == 1){
        gl_FragColor = textureColor * vec4(uColor, 1.0);
    }else{
        gl_FragColor = vec4(uColor, 1.0);
    }

}