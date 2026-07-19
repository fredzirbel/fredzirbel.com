export function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;
    const vertex = gl.createShader(gl.VERTEX_SHADER);
    const fragment = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return false;
    gl.shaderSource(vertex, '#version 300 es\nin vec2 p;void main(){gl_Position=vec4(p,0.,1.);}');
    gl.shaderSource(fragment, '#version 300 es\nprecision highp float;out vec4 c;void main(){c=vec4(1.);}');
    gl.compileShader(vertex);
    gl.compileShader(fragment);
    if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS) || !gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) return false;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    const valid = Boolean(gl.getProgramParameter(program, gl.LINK_STATUS));
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return valid;
  } catch {
    return false;
  }
}
