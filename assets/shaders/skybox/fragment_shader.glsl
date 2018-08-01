precision highp float;

uniform samplerCube cubemapTexture;

varying vec3 vNormal;

void main(void){
    // テクスチャによる色の計算
    vec3 normal = vNormal;
    normal.x *= -1.0;
    normal.y *= -1.0;
    normal.z *= -1.0;
    vec4 envColor = textureCube(cubemapTexture, normal);

    gl_FragColor = envColor;
}
