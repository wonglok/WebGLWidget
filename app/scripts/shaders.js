(function($templateCache){   'use strict';

  $templateCache.put('scripts/shaders/cube.sampler.fs',
    "precision mediump float;\n" +
    "varying vec2 vTextureCoord;\n" +
    "uniform float uCTime;\n" +
    "uniform int uSReady;\n" +
    "uniform sampler2D uSampler;\n" +
    "\n" +
    "float rand(vec2 co){\n" +
    "    return fract(sin(\n" +
    "            dot(co,vec2(32.45884,64.23432))\n" +
    "            * 74.582974\n" +
    "        ) * 49.9478593);\n" +
    "}\n" +
    "\n" +
    "void main(void) {\n" +
    "    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n" +
    "    float randomVal = rand(\n" +
    "                        vec2(\n" +
    "                            sin(uCTime) * cos(uCTime) - vTextureCoord.s,\n" +
    "                            sin(uCTime) * cos(uCTime) - vTextureCoord.t\n" +
    "                        )\n" +
    "                    );\n" +
    "\n" +
    "    vec4 randomColor = vec4(\n" +
    "        sin(uCTime * vTextureCoord.s),\n" +
    "        cos(uCTime * vTextureCoord.t),\n" +
    "        sin(uCTime * randomVal),\n" +
    "        1.0\n" +
    "    );\n" +
    "\n" +
    "    if (uSReady == 1){\n" +
    "        gl_FragColor = (1.24 - textureColor) * randomColor;\n" +
    "    }else{\n" +
    "        gl_FragColor = randomColor;\n" +
    "    }\n" +
    "}\n" +
    "\n"
  );


  $templateCache.put('scripts/shaders/cube.sampler.vs',
    "attribute vec3 aVertexPosition;\n" +
    "attribute vec2 aTextureCoord;\n" +
    "\n" +
    "uniform mat4 uMVMatrix;\n" +
    "uniform mat4 uPMatrix;\n" +
    "\n" +
    "varying vec2 vTextureCoord;\n" +
    "\n" +
    "void main(void) {\n" +
    "    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n" +
    "    vTextureCoord = aTextureCoord;\n" +
    "}\n" +
    "\n"
  );


  $templateCache.put('scripts/shaders/fan.fs',
    "precision mediump float;\n" +
    "\n" +
    "uniform sampler2D uSampler;\n" +
    "uniform vec3 uColor;\n" +
    "\n" +
    "uniform int tReady;\n" +
    "\n" +
    "varying vec2 vTextureCoord;\n" +
    "\n" +
    "void main(void) {\n" +
    "    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n" +
    "\n" +
    "    if (tReady == 1){\n" +
    "        gl_FragColor = textureColor * vec4(uColor, 1.0);\n" +
    "    }else{\n" +
    "        gl_FragColor = vec4(uColor, 1.0);\n" +
    "    }\n" +
    "\n" +
    "}"
  );


  $templateCache.put('scripts/shaders/fan.vs',
    "attribute vec3 aVertexPosition;\n" +
    "attribute vec2 aTextureCoord;\n" +
    "\n" +
    "uniform mat4 uMVMatrix;\n" +
    "uniform mat4 uPMatrix;\n" +
    "\n" +
    "varying vec2 vTextureCoord;\n" +
    "\n" +
    "void main(void) {\n" +
    "    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n" +
    "    vTextureCoord = aTextureCoord;\n" +
    "}\n" +
    "\n"
  );


  $templateCache.put('scripts/shaders/particle.random.fs',
    "precision mediump float;\n" +
    "\n" +
    "uniform sampler2D uSampler;\n" +
    "varying vec2 vTextureCoord;\n" +
    "\n" +
    "void main() {\n" +
    "\tvec4 fC = texture2D(uSampler, vTextureCoord);\n" +
    "\tgl_FragColor = fC;\n" +
    "}\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('scripts/shaders/particle.random.vs',
    "\n" +
    "attribute vec2 aVertexPosition;\n" +
    "attribute vec2 aTextureCoord;\n" +
    "\n" +
    "varying vec2 vTextureCoord;\n" +
    "\n" +
    "void main() {\n" +
    "    vTextureCoord = vec2(aTextureCoord.x, aTextureCoord.y);\n" +
    "    gl_Position = vec4(aVertexPosition, 0.0, 1.0);\n" +
    "}\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('scripts/shaders/post.blur.fs',
    "/*\n" +
    "Fixed mobile bug\n" +
    "Original: http://xissburg.com/faster-gaussian-blur-in-glsl/\n" +
    " */\n" +
    "\n" +
    "\n" +
    "precision mediump float;\n" +
    "\n" +
    "uniform sampler2D uSampler;\n" +
    "\n" +
    "varying vec2 vTextureCoord;\n" +
    "varying vec2 vK[6];\n" +
    "\n" +
    "void main(){\n" +
    "    vec4 _c = vec4(0.0);\n" +
    "\n" +
    "    _c += texture2D(uSampler, vK[ 2])*0.0044299121055113265;\n" +
    "    _c += texture2D(uSampler, vK[ 0])*0.00895781211794;\n" +
    "    _c += texture2D(uSampler, vK[ 2])*0.0215963866053;\n" +
    "    _c += texture2D(uSampler, vK[ 4])*0.0443683338718;\n" +
    "    _c += texture2D(uSampler, vK[ 0])*0.0776744219933;\n" +
    "    _c += texture2D(uSampler, vK[ 2])*0.115876621105;\n" +
    "    _c += texture2D(uSampler, vK[ 4])*0.147308056121;\n" +
    "\n" +
    "    _c += texture2D(uSampler, vTextureCoord)*0.159576912161;\n" +
    "\n" +
    "    _c += texture2D(uSampler, vK[ 5])*0.147308056121;\n" +
    "    _c += texture2D(uSampler, vK[ 3])*0.115876621105;\n" +
    "    _c += texture2D(uSampler, vK[ 1])*0.0776744219933;\n" +
    "    _c += texture2D(uSampler, vK[ 5])*0.0443683338718;\n" +
    "    _c += texture2D(uSampler, vK[ 3])*0.0215963866053;\n" +
    "    _c += texture2D(uSampler, vK[ 1])*0.00895781211794;\n" +
    "    _c += texture2D(uSampler, vK[ 3])*0.0044299121055113265;\n" +
    "\n" +
    "\n" +
    "    gl_FragColor = _c;\n" +
    "}"
  );


  $templateCache.put('scripts/shaders/post.blur.vs',
    "/*\n" +
    "\n" +
    "Fixed mobile bug\n" +
    "\n" +
    "Original: http://xissburg.com/faster-gaussian-blur-in-glsl/\n" +
    " */\n" +
    "\n" +
    "\n" +
    "attribute vec2 aVertexPosition;\n" +
    "attribute vec2 aTextureCoord;\n" +
    "\n" +
    "uniform float uVibrate;\n" +
    "\n" +
    "varying vec2 vTextureCoord;\n" +
    "\n" +
    "varying vec2 vK[6];\n" +
    "\n" +
    "\n" +
    "void main() {\n" +
    "\tvec2 vTC = aTextureCoord;\n" +
    "\n" +
    "\tfloat cv = uVibrate;\n" +
    "\n" +
    "\tvTC = aTextureCoord;\n" +
    "\n" +
    "\tgl_Position = vec4(aVertexPosition, 0.0, 1.0);\n" +
    "\n" +
    "\tvK[ 0] = vTC + vec2( cv * -0.024, cv * -0.02);\n" +
    "\tvK[ 1] = vTC + vec2( cv * -0.016, cv * -0.01);\n" +
    "\tvK[ 2] = vTC + vec2( cv * -0.008, cv * -0.00);\n" +
    "\n" +
    "\tvK[ 3] = vTC + vec2( cv *  0.004, cv *  0.00);\n" +
    "\tvK[ 4] = vTC + vec2( cv *  0.012, cv *  0.01);\n" +
    "\tvK[ 5] = vTC + vec2( cv *  0.020, cv *  0.02);\n" +
    "\n" +
    "\tvTextureCoord = vTC;\n" +
    "\n" +
    "\t/*\n" +
    "\tvBlurTexCoords[ 0] = vTextureCoord + vec2(-0.028, -0.028);\n" +
    "\tvBlurTexCoords[ 1] = vTextureCoord + vec2(-0.024, -0.024);\n" +
    "\tvBlurTexCoords[ 2] = vTextureCoord + vec2(-0.020, -0.020);\n" +
    "\tvBlurTexCoords[ 3] = vTextureCoord + vec2(-0.016, -0.016);\n" +
    "\tvBlurTexCoords[ 4] = vTextureCoord + vec2(-0.012, -0.012);\n" +
    "\tvBlurTexCoords[ 5] = vTextureCoord + vec2(-0.008, -0.008);\n" +
    "\tvBlurTexCoords[ 6] = vTextureCoord + vec2(-0.004, -0.004);\n" +
    "\tvBlurTexCoords[ 7] = vTextureCoord + vec2( 0.004,  0.004);\n" +
    "\tvBlurTexCoords[ 8] = vTextureCoord + vec2( 0.008,  0.008);\n" +
    "\tvBlurTexCoords[ 9] = vTextureCoord + vec2( 0.012,  0.012);\n" +
    "\tvBlurTexCoords[10] = vTextureCoord + vec2( 0.016,  0.016);\n" +
    "\tvBlurTexCoords[11] = vTextureCoord + vec2( 0.020,  0.020);\n" +
    "\tvBlurTexCoords[12] = vTextureCoord + vec2( 0.024,  0.024);\n" +
    "\tvBlurTexCoords[13] = vTextureCoord + vec2( 0.028,  0.028);\n" +
    "\n" +
    "\tvBlurTexCoords[ 0] = vTextureCoord + vec2(-0.028, 0.0);\n" +
    "\tvBlurTexCoords[ 1] = vTextureCoord + vec2(-0.024, 0.0);\n" +
    "\tvBlurTexCoords[ 2] = vTextureCoord + vec2(-0.020, 0.0);\n" +
    "\tvBlurTexCoords[ 3] = vTextureCoord + vec2(-0.016, 0.0);\n" +
    "\tvBlurTexCoords[ 4] = vTextureCoord + vec2(-0.012, 0.0);\n" +
    "\tvBlurTexCoords[ 5] = vTextureCoord + vec2(-0.008, 0.0);\n" +
    "\tvBlurTexCoords[ 6] = vTextureCoord + vec2(-0.004, 0.0);\n" +
    "\tvBlurTexCoords[ 7] = vTextureCoord + vec2( 0.004, 0.0);\n" +
    "\tvBlurTexCoords[ 8] = vTextureCoord + vec2( 0.008, 0.0);\n" +
    "\tvBlurTexCoords[ 9] = vTextureCoord + vec2( 0.012, 0.0);\n" +
    "\tvBlurTexCoords[10] = vTextureCoord + vec2( 0.016, 0.0);\n" +
    "\tvBlurTexCoords[11] = vTextureCoord + vec2( 0.020, 0.0);\n" +
    "\tvBlurTexCoords[12] = vTextureCoord + vec2( 0.024, 0.0);\n" +
    "\tvBlurTexCoords[13] = vTextureCoord + vec2( 0.028, 0.0);\n" +
    "\n" +
    "\tvBlurTexCoords[ 0] = vTextureCoord + vec2(0.0, -0.028);\n" +
    "\tvBlurTexCoords[ 1] = vTextureCoord + vec2(0.0, -0.024);\n" +
    "\tvBlurTexCoords[ 2] = vTextureCoord + vec2(0.0, -0.020);\n" +
    "\tvBlurTexCoords[ 3] = vTextureCoord + vec2(0.0, -0.016);\n" +
    "\tvBlurTexCoords[ 4] = vTextureCoord + vec2(0.0, -0.012);\n" +
    "\tvBlurTexCoords[ 5] = vTextureCoord + vec2(0.0, -0.008);\n" +
    "\tvBlurTexCoords[ 6] = vTextureCoord + vec2(0.0, -0.004);\n" +
    "\tvBlurTexCoords[ 7] = vTextureCoord + vec2(0.0,  0.004);\n" +
    "\tvBlurTexCoords[ 8] = vTextureCoord + vec2(0.0,  0.008);\n" +
    "\tvBlurTexCoords[ 9] = vTextureCoord + vec2(0.0,  0.012);\n" +
    "\tvBlurTexCoords[10] = vTextureCoord + vec2(0.0,  0.016);\n" +
    "\tvBlurTexCoords[11] = vTextureCoord + vec2(0.0,  0.020);\n" +
    "\tvBlurTexCoords[12] = vTextureCoord + vec2(0.0,  0.024);\n" +
    "\tvBlurTexCoords[13] = vTextureCoord + vec2(0.0,  0.028);\n" +
    "\t */\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "}\n"
  );


  $templateCache.put('scripts/shaders/post.normal.fs',
    "\n" +
    "\n" +
    "precision mediump float;\n" +
    "\n" +
    "uniform sampler2D uSampler;\n" +
    "varying vec2 vTextureCoord;\n" +
    "\n" +
    "void main() {\n" +
    "\tvec4 frameColor = texture2D(uSampler, vTextureCoord);\n" +
    "\tgl_FragColor = frameColor;\n" +
    "\n" +
    "}\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('scripts/shaders/post.normal.vs',
    "\n" +
    "attribute vec2 aVertexPosition;\n" +
    "attribute vec2 aTextureCoord;\n" +
    "\n" +
    "varying vec2 vTextureCoord;\n" +
    "\n" +
    "void main() {\n" +
    "    vTextureCoord = vec2(aTextureCoord.x, aTextureCoord.y);\n" +
    "    gl_Position = vec4(aVertexPosition, 0.0, 1.0);\n" +
    "}\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n"
  );
 }({ put: window._di.val }));