(function($templateCache){   'use strict';

  $templateCache.put('scripts/shaders/cube.sampler.fs',
    "/**\n" +
    " * Wong Lok\n" +
    " * @wonglok831\n" +
    " * Cube Fragmnet Shader\n" +
    " */\n" +
    "\n" +
    "precision mediump float;\n" +
    "varying vec2 vTextureCoord;\n" +
    "uniform float uTimer;\n" +
    "uniform int uSReady;\n" +
    "uniform sampler2D uSampler;\n" +
    "\n" +
    "float rand(vec2 co){\n" +
    "    return fract(sin(\n" +
    "        dot(\n" +
    "            co,\n" +
    "            vec2(32.45884,64.23432)\n" +
    "        ) * 74.582974\n" +
    "    ) * 49.9478593);\n" +
    "}\n" +
    "\n" +
    "\n" +
    "void main(void) {\n" +
    "    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n" +
    "\n" +
    "\n" +
    "    float randomVal = rand(\n" +
    "                        vec2(\n" +
    "                            sin(uTimer) * cos(uTimer) - vTextureCoord.s,\n" +
    "                            sin(uTimer) * cos(uTimer) - vTextureCoord.t\n" +
    "                        )\n" +
    "                    );\n" +
    "\n" +
    "    vec4 randomColor = vec4(\n" +
    "        sin(uTimer * vTextureCoord.s),\n" +
    "        cos(uTimer * vTextureCoord.t),\n" +
    "        sin(uTimer * randomVal),\n" +
    "        1.0\n" +
    "    );\n" +
    "\n" +
    "\n" +
    "\n" +
    "    // float randomVal = rand(\n" +
    "    //     vec2(\n" +
    "    //         vTextureCoord.x,\n" +
    "    //         vTextureCoord.y\n" +
    "    //     )\n" +
    "    // );\n" +
    "\n" +
    "    // float sinTime = sin(uTimer / 250.0);\n" +
    "    // float cosTime = cos(uTimer / 250.0);\n" +
    "    // float tanTime = tan(uTimer / 250.0);\n" +
    "\n" +
    "    // vec4 randomColor = vec4(\n" +
    "    //     sinTime * sin(uTimer * vTextureCoord.s),\n" +
    "    //     cosTime * cos(uTimer * vTextureCoord.t),\n" +
    "    //     tanTime * sin(uTimer * randomVal),\n" +
    "    //     1.0\n" +
    "    // );\n" +
    "\n" +
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
    "/**\n" +
    " * Wong Lok\n" +
    " * @wonglok831\n" +
    " * Cube Vertex Shader\n" +
    " */\n" +
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
    "/**\n" +
    " * Wong Lok\n" +
    " * @wonglok831\n" +
    " * Fan Fragment Shader abc\n" +
    " */\n" +
    "precision mediump float;\n" +
    "\n" +
    "uniform sampler2D uSampler;\n" +
    "uniform vec3 uColor;\n" +
    "\n" +
    "uniform int tReady;\n" +
    "\n" +
    "varying vec2 vTextureCoord;\n" +
    "\n" +
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
    "/**\n" +
    " * Wong Lok\n" +
    " * @wonglok831\n" +
    " * Fran Vertex Shader\n" +
    " */\n" +
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


  $templateCache.put('scripts/shaders/particle.show.fs',
    "/**\n" +
    " * Wong Lok\n" +
    " * @wonglok831\n" +
    " * Particle Show Fragment Shader - Sampler2D Vertex\n" +
    " */\n" +
    "\n" +
    "precision mediump float;\n" +
    "\n" +
    "uniform float uTimer;\n" +
    "\n" +
    "float opacity = 0.2;\n" +
    "\n" +
    "float rand(vec2 co){\n" +
    "    return fract(sin(\n" +
    "        dot(\n" +
    "            co,\n" +
    "            vec2(\n" +
    "            \t32.45884,\n" +
    "            \t64.23432\n" +
    "        \t)\n" +
    "        ) * 74.582974\n" +
    "    ) * 49.9478593);\n" +
    "}\n" +
    "\n" +
    "\n" +
    "void main(void) {\n" +
    "\tfloat sinTime = sin(  uTimer / 100.0);\n" +
    "\tfloat cosTime = cos(  uTimer / 100.0);\n" +
    "\tfloat tanTime = tan(  uTimer / 100.0);\n" +
    "\n" +
    "\tfloat randomNum =  rand( vec2( sinTime, cosTime) );\n" +
    "\tfloat randomNum2 = rand( vec2( cosTime, tanTime) );\n" +
    "\tfloat randomNum3 = rand( vec2( tanTime, sinTime) );\n" +
    "\n" +
    "\tvec3 rgb = vec3(randomNum,randomNum2,randomNum3);\n" +
    "\n" +
    "\tgl_FragColor = vec4(rgb, opacity);\n" +
    "}"
  );


  $templateCache.put('scripts/shaders/particle.show.vs',
    "/**\n" +
    " * Wong Lok\n" +
    " * @wonglok831\n" +
    " * Particle Show Vertex Shader - Sampler2D Vertex\n" +
    " */\n" +
    "\n" +
    "attribute vec2 aVertexPosition;\n" +
    "\n" +
    "uniform mat4 uMVMatrix;\n" +
    "uniform mat4 uPMatrix;\n" +
    "\n" +
    "uniform sampler2D uSampler;\n" +
    "\n" +
    "void main(void) {\n" +
    "\n" +
    "\tvec2 vert2dPos = aVertexPosition.xy + vec2( 0.5 / 200.0, 0.5 / 200.0 );\n" +
    "\tvec3 vert3dPos = texture2D( uSampler, vert2dPos ).xyz * 200.0 - 100.0;\n" +
    "\n" +
    "\tgl_Position = uPMatrix * uMVMatrix * vec4(vert3dPos, 1.0);\n" +
    "\n" +
    "    gl_PointSize = 1.0;\n" +
    "}\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('scripts/shaders/particle.simulate.fs',
    "/**\n" +
    " * Wong Lok\n" +
    " * @wonglok831\n" +
    " * Particle Simulate Fragment Shader - GPU Simulation\n" +
    " */\n" +
    "\n" +
    "precision highp float;\n" +
    "// precision lowp float;\n" +
    "\n" +
    "uniform sampler2D uSampler;\n" +
    "varying vec2 vTextureCoord;\n" +
    "\n" +
    "uniform float uTimer;\n" +
    "\n" +
    "float rand(vec2 co){\n" +
    "\treturn fract(sin(\n" +
    "\t\tdot(\n" +
    "\t\t\tco.xy,\n" +
    "\t\t\tvec2(\n" +
    "\t\t\t\t59.454233,\n" +
    "\t\t\t\t72.223432\n" +
    "\t\t\t)\n" +
    "\t\t) * 0.32457\n" +
    "\t) * 2342.0);\n" +
    "}\n" +
    "\n" +
    "uniform int uMode;\n" +
    "\n" +
    "void main() {\n" +
    "\n" +
    "\tvec2 vTC = vTextureCoord;\n" +
    "\n" +
    "\tint mode;\n" +
    "\n" +
    "\tif (uMode != 0){\n" +
    "\t\tmode = uMode;\n" +
    "\t}else{\n" +
    "\t\tmode = 1;\n" +
    "\t}\n" +
    "\n" +
    "\n" +
    "\tfloat opacity = 0.05;\n" +
    "\tvec4 nextPos = vec4(opacity);\n" +
    "\n" +
    "\tvec4 lastPos = texture2D(uSampler, vTC);\n" +
    "\n" +
    "\tfloat rVal = rand(vec2(\n" +
    "\t\tvTC.x,\n" +
    "\t\tvTC.y\n" +
    "\t ));\n" +
    "\n" +
    "\tfloat sinTime = sin(uTimer / 500.0);\n" +
    "\tfloat cosTime = cos(uTimer / 500.0);\n" +
    "\tfloat tanTime = tan(uTimer / 500.0);\n" +
    "\n" +
    "\n" +
    "\tvec4 fSpace = vec4(\n" +
    "\t\tsinTime * sin(uTimer * rVal + vTC.s),\n" +
    "\t\tcosTime * cos(uTimer * rVal + vTC.t),\n" +
    "\t\tcosTime * sinTime * tan(uTimer * rVal),\n" +
    "\t\topacity\n" +
    "\t);\n" +
    "\n" +
    "\t// mode = 5;\n" +
    "\n" +
    "\tif (mode == 1){\n" +
    "\t\tnextPos = fSpace;\n" +
    "\t} else if (mode == 2) {\n" +
    "\t\tvec4 fEdge = vec4(\n" +
    "\t\t\tsinTime * sin(uTimer * vTC.s / 1000.0),\n" +
    "\t\t\tcosTime * cos(uTimer * vTC.t / 1000.0),\n" +
    "\t\t\tsinTime * sin(uTimer * 1.0 / rVal),\n" +
    "\t\t\topacity\n" +
    "\t\t);\n" +
    "\n" +
    "\t\tnextPos = fSpace;\n" +
    "\t\tnextPos += fEdge;\n" +
    "\t} else if (mode == 3){\n" +
    "\n" +
    "\t\tnextPos = vec4(\n" +
    "\t\t\tsinTime * sin(uTimer * rVal + vTC.s),\n" +
    "\t\t\tcosTime * cos(uTimer * rVal + vTC.t),\n" +
    "\t\t\ttanTime * sinTime * sin(uTimer * rVal),\n" +
    "\t\t\topacity\n" +
    "\t\t);\n" +
    "\n" +
    "\t} else if (mode == 4){\n" +
    "\n" +
    "\t\tvec4 sEdge = vec4(\n" +
    "\t\t\tsinTime * sin(uTimer * rVal + vTC.s),\n" +
    "\t\t\tcosTime * sin(uTimer * rVal + vTC.t),\n" +
    "\t\t\tcosTime * sin(uTimer * rVal),\n" +
    "\t\t\topacity\n" +
    "\t\t);\n" +
    "\n" +
    "\t\tnextPos = sEdge;\n" +
    "\t} else if (mode == 5){\n" +
    "\n" +
    "\t\tvec4 eSignal = vec4(\n" +
    "\t\t\ttanTime * sin(uTimer * rVal * cosTime * vTC.s),\n" +
    "\t\t\ttanTime * sin(uTimer * rVal * sinTime * vTC.t),\n" +
    "\t\t\ttanTime * sin(uTimer * rVal * cosTime),\n" +
    "\t\t\topacity\n" +
    "\t\t);\n" +
    "\n" +
    "\t\tnextPos = eSignal;\n" +
    "\t}\n" +
    "\n" +
    "\n" +
    "\n" +
    "\tnextPos += lastPos;\n" +
    "\tgl_FragColor = nextPos;\n" +
    "\n" +
    "}\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('scripts/shaders/particle.simulate.vs',
    "/**\n" +
    " * Wong Lok\n" +
    " * @wonglok831\n" +
    " * Particle Simulate Vertex Shader - GPU Simulation\n" +
    " */\n" +
    "\n" +
    "\n" +
    "attribute vec2 aVertexPosition;\n" +
    "attribute vec2 aTextureCoord;\n" +
    "\n" +
    "varying vec2 vTextureCoord;\n" +
    "\n" +
    "void main() {\n" +
    "    vTextureCoord = vec2(aTextureCoord.x, 1.0 - aTextureCoord.y);\n" +
    "    gl_Position = vec4(aVertexPosition, 0.0, 1.0);\n" +
    "}\n" +
    "\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('scripts/shaders/post.blur.fs',
    "/**\n" +
    " * Wong Lok\n" +
    " * @wonglok831\n" +
    " * Gaussain Blur Fragment Shader - Post Process\n" +
    " * Fixed Mobile Bug\n" +
    " *\n" +
    " * Orignal: @xissburg\n" +
    " * http://xissburg.com/faster-gaussian-blur-in-glsl/\n" +
    " * https://github.com/xissburg/XBImageFilters/blob/master/XBImageFilters/Sample/Resources/Shaders/Blur.fsh\n" +
    " * MIT Licensed\n" +
    " */\n" +
    "\n" +
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
    "/**\n" +
    " * Wong Lok\n" +
    " * @wonglok831\n" +
    " * Gaussain Blur Vertex Shader - Post Process\n" +
    " * Fixed Mobile Bug\n" +
    " *\n" +
    " * Orignal: @xissburg\n" +
    " * http://xissburg.com/faster-gaussian-blur-in-glsl/\n" +
    " * https://github.com/xissburg/XBImageFilters/blob/master/XBImageFilters/Sample/Resources/Shaders/Blur.fsh\n" +
    " * MIT Licensed\n" +
    " */\n" +
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
    "}\n"
  );


  $templateCache.put('scripts/shaders/post.normal.fs',
    "/**\n" +
    " * Wong Lok\n" +
    " * @wonglok831\n" +
    " * Normal Quad Fragment Shader - Post Process\n" +
    " */\n" +
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
    "/**\n" +
    " * Wong Lok\n" +
    " * @wonglok831\n" +
    " * Normal Quad Vertex Shader - Post Process\n" +
    " */\n" +
    "\n" +
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