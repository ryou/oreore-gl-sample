attribute vec3 position;
attribute vec3 normal;
attribute vec3 tangent;
attribute vec3 binormal;
attribute vec2 texCoord;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec2 vUV;

void main(void){
    gl_Position = projectionMatrix * viewMatrix * modelMatrix *  vec4(position, 1.0);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vNormal = normal;
    vTangent = tangent;
    vBinormal = binormal;
    vUV = texCoord;
}
