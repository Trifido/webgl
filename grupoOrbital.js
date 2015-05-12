
function GrupoOrbital(GL, terra, luna){
	//////////////////////
	// Parametros de creacion del grupo orbital
	this.luna= luna;
	this.terra= terra;
}

GrupoOrbital.prototype.draw = function( GL, time, angulo){
	  
    var dt= ( time-time_old ) / 1000;
	
	time_old=time;
    GL.viewport( 0.0, 0.0, CANVAS.width, CANVAS.height );
    GL.clear( GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT );
    GL.uniformMatrix4fv( _Pmatrix, false, PROJMATRIX );
    GL.uniformMatrix4fv( _Vmatrix, false, VIEWMATRIX );
	
	////////////////////////////////////////////
	//TIERRA
	//////////////////////
	// Movimiento de la tierra
	LIBS.rotateY( this.terra.MOVEMATRIX, dt );
	//LIBS.rotateY( terra.getMoveMatrix(), dt );
	//////////////////////
	// Activar matriz de movimiento de la tierra
	GL.uniformMatrix4fv( _Mmatrix, false, terra.MOVEMATRIX );
	//GL.uniformMatrix4fv( _Mmatrix, false, terra.getMoveMatrix() );
	//////////////////////
	// Dibujar la tierra
	terra.draw( GL,_position,_uv,_normal );
	
	////////////////////////////////////////////
    // MOON
	// Movimiento de la luna
	if( rotate ){ 		// Ir a la linea 7 para entender esto
		var matrix_trans = LIBS.get_I4();
		var matrix_rot = LIBS.get_I4();
		LIBS.translateZ( matrix_trans, 2 );
		LIBS.rotateY( matrix_rot,angulo );
		
		moon.MOVEMATRIX = LIBS.multiply( matrix_trans,matrix_rot );
		//moon.getMoveMatrix() = LIBS.multiply( matrix_trans,matrix_rot );
		
		//LIBS.set_position( moon.MOVEMATRIX,2*Math.cos( angulo ),0, 2*Math.sin( angulo ) );
		angulo = ( angulo + 0.02 ) % 360;
	}
	//////////////////////
	// Activar matriz de movimiento de la luna
	GL.uniformMatrix4fv( _Mmatrix, false, moon.MOVEMATRIX );
	//GL.uniformMatrix4fv( _Mmatrix, false, moon.getMoveMatrix() );
	//////////////////////
	// Activar parametros de la luna y dibujar.
	moon.draw( GL,_position,_uv,_normal );
	
	GL.flush();
    window.requestAnimationFrame(animate);
}