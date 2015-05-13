
var main=function() {
  var CANVAS=document.getElementById("your_canvas");
  CANVAS.width=window.innerWidth;
  CANVAS.height=window.innerHeight;
  
  /*========================= CAPTURE MOUSE EVENTS ========================= */
  
  //////////////////////
  // Click del raton 
  var rotate = true;
  var mouseDown=function( e ) {
    
	( rotate == true ) ? rotate = false : rotate = true;
	
  };
  CANVAS.addEventListener( "mousedown", mouseDown, false );
  
  /*========================= GET WEBGL CONTEXT ========================= */
  var GL;
  try {
    GL = CANVAS.getContext("experimental-webgl", {antialias: true});
  } catch (e) {
    alert("You are not webgl compatible :(") ;
    return false;
  }
  
  /*========================= SHADERS ========================= */
  
  var shader_vertex_source="\n\
attribute vec3 position;\n\
attribute vec3 normal;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
const mat3 uNMatrix = mat3(1.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,1.0);\n\
attribute vec2 uv;\n\
varying vec2 vUV;\n\
varying vec3 vNormal;\n\
varying vec3 vView;\n\
\n\
const vec3 uPointLightingLocation=vec3(3.0,0.0,-3.0);\n\
const vec3 uPointLightingColor=vec3(0.9,0.1,0.1);\n\
varying vec3 vLightWeighting;\n\
\n\
void main(void) { //pre-built function\n\
vec4 mvPosition = Vmatrix*Mmatrix*vec4(position, 1.);\n\
gl_Position = Pmatrix*mvPosition;\n\
vec3 lightDirection = normalize(uPointLightingLocation - mvPosition.xyz);\n\
vNormal=vec3(Mmatrix*vec4(normal, 0.));\n\
vView=vec3(Vmatrix*Mmatrix*vec4(position, 1.));\n\
vUV=uv;\n\
vec3 transformedNormal = uNMatrix * vNormal;\n\
float directionalLightWeighting = max(dot(transformedNormal, lightDirection), 0.0);\n\
vLightWeighting = uPointLightingColor * directionalLightWeighting;\n\
}";
  
  var shader_fragment_source="\n\
precision mediump float;\n\
uniform sampler2D sampler;\n\
varying vec2 vUV;\n\
varying vec3 vNormal;\n\
varying vec3 vView;\n\
const vec3 source_ambient_color=vec3(1.,1.,1.);\n\
const vec3 source_diffuse_color=vec3(1.,1.,1.);\n\
const vec3 source_specular_color=vec3(1.,1.,1.);\n\
const vec3 source_direction=vec3(-1.,0.,0.);\n\
\n\
const vec3 mat_ambient_color=vec3(0.3,0.3,0.3);\n\
const vec3 mat_diffuse_color=vec3(1.,1.,1.);\n\
const vec3 mat_specular_color=vec3(1.,1.,1.);\n\
const float mat_shininess=10.;\n\
\n\
varying vec3 vLightWeighting;\n\
\n\
void main(void) {\n\
    vec3 color=vec3(texture2D(sampler, vUV));\n\
	vec3 I_ambient=source_ambient_color*mat_ambient_color;\n\
	vec3 I_diffuse=source_diffuse_color*mat_diffuse_color*max(0., dot(vNormal, source_direction));\n\
	vec3 V=normalize(vView);\n\
	vec3 R=reflect(source_direction, vNormal);\n\
	\n\
	\n\
	vec3 I_specular=source_specular_color*mat_specular_color*pow(max(dot(R,V),0.), mat_shininess);\n\
	vec3 I=I_ambient+I_diffuse+I_specular;\n\
	gl_FragColor = vec4(I*color+vLightWeighting, 1.);\n\
}";
  
  var get_shader=function(source, type, typeString) {
    var shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      alert("ERROR IN "+typeString+ " SHADER : " + GL.getShaderInfoLog(shader));
      return false;
    }
    return shader;
  };
  
  var shader_vertex=get_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
  var shader_fragment=get_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");
  
  var SHADER_PROGRAM=GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  GL.attachShader(SHADER_PROGRAM, shader_fragment);
  
  GL.linkProgram(SHADER_PROGRAM);
  
  var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
  var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
  var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");
  var _sampler = GL.getUniformLocation(SHADER_PROGRAM, "sampler");
  
  
  var _uv = GL.getAttribLocation(SHADER_PROGRAM, "uv");
  var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
  var _normal = GL.getAttribLocation(SHADER_PROGRAM, "normal");

  GL.enableVertexAttribArray(_uv);
  GL.enableVertexAttribArray(_position);
  GL.enableVertexAttribArray(_normal);
  
  GL.useProgram(SHADER_PROGRAM);
  GL.uniform1i(_sampler, 0);

  /*========================= MATRIX ========================= */
  
  var PROJMATRIX=LIBS.get_projection(40, CANVAS.width/CANVAS.height, 1, 100);
  var VIEWMATRIX=LIBS.get_I4();
  
  LIBS.translateZ(VIEWMATRIX, -6);
    
  /*========================= DRAWING ========================= */
  GL.enable( GL.DEPTH_TEST );
  GL.depthFunc( GL.LEQUAL );
  GL.clearColor( 0.0, 0.0, 0.0, 0.0 );
  GL.clearDepth( 1.0 );
	
	////////////////////////////////////////////
	// Init planetas
	var terra = new Planeta(1,GL,"ressources/tierra.jpg" );
	var moon = new Satelite(0.2,GL,"ressources/luna.jpg",3 );
	////////////////////////////////////////////
	// Init grupo orbital
	var grupoOrbital = new GrupoOrbital( _Mmatrix, _Pmatrix,_position,_uv,_normal );
	grupoOrbital.addAstro( terra );
	grupoOrbital.addAstro( moon );
	
	////////////////////////////////////////////
	// Init animacion
	var time_old = 0;
	var animate= function(time){
		
		var dt= ( time - time_old ) / 1000;
		time_old=time;
		GL.viewport( 0.0, 0.0, CANVAS.width, CANVAS.height );
		GL.clear( GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT );
		GL.uniformMatrix4fv( _Pmatrix, false, PROJMATRIX );
		GL.uniformMatrix4fv( _Vmatrix, false, VIEWMATRIX );
		
		grupoOrbital.draw( GL,dt,rotate );
		
		GL.flush();
		window.requestAnimationFrame(animate);
		
	}
	animate(0);
};