/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import * as WebGL from 'webgl-lite';
import assertColorEqual from '../test-utils/assertColorEqual';
import getPixelData from '../test-utils/getPixelData';

const VERT = `
attribute vec2 a_position;
attribute vec4 a_color;
varying vec4 v_color;

void main() {
  v_color = a_color;
  gl_Position = vec4(a_position, 0, 1.);
}
`;

const FRAG = `
precision mediump float;
varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
`;

export default function test(container) {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;
  canvas.style.width = 300 + 'px';
  canvas.style.height = 300 + 'px';
  container.appendChild(canvas);
  const gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const prog = new WebGL.Program(gl)
    .addShader(VERT, gl.VERTEX_SHADER)
    .addShader(FRAG, gl.FRAGMENT_SHADER)
    .compile();
  const node = new WebGL.Node(gl, prog);
  node.addAttribute('a_position');
  node.addAttribute('a_color', true);
  const buffer = new ArrayBuffer(4 * 3 * 3);
  const floatBuffer = new Float32Array(buffer);
  const uintBuffer = new Uint8Array(buffer);
  floatBuffer[0] = -0.5;
  floatBuffer[1] = -0.5;
  uintBuffer[8] = 255;
  uintBuffer[9] = 0;
  uintBuffer[10] = 255;
  uintBuffer[11] = 255;
  floatBuffer[3] = 0.5;
  floatBuffer[4] = 0.5;
  uintBuffer[20] = 255;
  uintBuffer[21] = 0;
  uintBuffer[22] = 255;
  uintBuffer[23] = 255;
  floatBuffer[6] = -0.5;
  floatBuffer[7] = 0.5;
  uintBuffer[32] = 255;
  uintBuffer[33] = 0;
  uintBuffer[34] = 255;
  uintBuffer[35] = 255;
  node.bufferData(buffer);
  prog.use();
  node.draw();

  const pixelData = getPixelData(gl);
  assertColorEqual(pixelData.getPixel(10, 10), [0, 0, 0, 255]);
  assertColorEqual(pixelData.getPixel(100, 100), [255, 0, 255, 255]);
  assertColorEqual(pixelData.getPixel(200, 200), [0, 0, 0, 255]);
}
