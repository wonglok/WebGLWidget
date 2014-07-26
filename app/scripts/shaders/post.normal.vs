/**
 * Wong Lok
 * @wonglok831
 * Normal Quad Vertex Shader - Post Process
 */


attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = vec2(aTextureCoord.x, aTextureCoord.y);
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}




