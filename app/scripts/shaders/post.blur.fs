/**
 * Wong Lok
 * @wonglok831
 * Gaussain Blur Fragment Shader - Post Process
 * Fixed Mobile Bug
 * Origian: http://xissburg.com/faster-gaussian-blur-in-glsl/
 */



precision mediump float;

uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec2 vK[6];

void main(){
    vec4 _c = vec4(0.0);

    _c += texture2D(uSampler, vK[ 2])*0.0044299121055113265;
    _c += texture2D(uSampler, vK[ 0])*0.00895781211794;
    _c += texture2D(uSampler, vK[ 2])*0.0215963866053;
    _c += texture2D(uSampler, vK[ 4])*0.0443683338718;
    _c += texture2D(uSampler, vK[ 0])*0.0776744219933;
    _c += texture2D(uSampler, vK[ 2])*0.115876621105;
    _c += texture2D(uSampler, vK[ 4])*0.147308056121;

    _c += texture2D(uSampler, vTextureCoord)*0.159576912161;

    _c += texture2D(uSampler, vK[ 5])*0.147308056121;
    _c += texture2D(uSampler, vK[ 3])*0.115876621105;
    _c += texture2D(uSampler, vK[ 1])*0.0776744219933;
    _c += texture2D(uSampler, vK[ 5])*0.0443683338718;
    _c += texture2D(uSampler, vK[ 3])*0.0215963866053;
    _c += texture2D(uSampler, vK[ 1])*0.00895781211794;
    _c += texture2D(uSampler, vK[ 3])*0.0044299121055113265;


    gl_FragColor = _c;
}