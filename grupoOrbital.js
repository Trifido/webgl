
function GrupoOrbital(GL, terra, luna, _Mmatrix, _Pmatrix, PROJMATRIX, VIEWMATRIX){
	alert("Ok");

	// Parametros de creacion del grupo orbital
	this._Mmatrix = _Mmatrix;
	this._Pmatrix = _Pmatrix;
	this.PROJMATRIX = PROJMATRIX;
	this.VIEWMATRIX = VIEWMATRIX;
	this.luna= luna;
	this.terra= terra;
	this.angulo= 0;
	this.time_old= 0;
	this._positionP;
	this._uvP;
	this._normalP;
	this._positionS;
	this._uvS;
	this._normalS;
	alert("okkkk");
}

GrupoOrbital.prototype.addDatPlaneta( _position,_uv,_normal ){
	this._positionP = _position;
	this._uvP = _uv;
	this._normalP = _normal;
}

GrupoOrbital.prototype.addDatSatelite( _position,_uv,_normal ){
	this._positionS = _position;
	this._uvS = _uv;
	this._normalS = _normal;
}

GrupoOrbital.prototype.animate=function( GL, time, rotate ) {
	  
    var dt= ( time-time_old ) / 1000;
	
	time_old=time;
    GL.viewport( 0.0, 0.0, CANVAS.width, CANVAS.height );
    GL.clear( GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT );
    GL.uniformMatrix4fv( this._Pmatrix, false, this.PROJMATRIX );
    GL.uniformMatrix4fv( this._Vmatrix, false, this.VIEWMATRIX );
	
	////////////////////////////////////////////
	//TIERRA
	//////////////////////
	// Movimiento de la tierra
	LIBS.rotateY( this.terra.MOVEMATRIX, dt );
	//////////////////////
	// Activar matriz de movimiento de la tierra
	GL.uniformMatrix4fv( this._Mmatrix, false, this.terra.MOVEMATRIX );
	//////////////////////
	// Dibujar la tierra
	this.terra.draw( GL,this._positionP,this._uvP,this._normalP );
	
	////////////////////////////////////////////
    // MOON
	// Movimiento de la luna
	if( rotate ){	
		var matrix_trans = LIBS.get_I4();
		var matrix_rot = LIBS.get_I4();
		LIBS.translateZ( matrix_trans, 2 );
		LIBS.rotateY( matrix_rot,this.angulo );
		
		this.moon.setMoveMatrix( LIBS.multiply( matrix_trans,matrix_rot ));
		this.angulo = ( this.angulo + 0.02 ) % 360;
	}
	//////////////////////
	// Activar matriz de movimiento de la luna
	GL.uniformMatrix4fv( this._Mmatrix, false, this.moon.MOVEMATRIX );
	//////////////////////
	// Activar parametros de la luna y dibujar.
	this.moon.draw( GL,this._positionS,this._uvS,this._normalS );
	
	GL.flush();
    window.requestAnimationFrame(animate);
}

GrupoOrbital.prototype.draw = function( GL, time, rotate){
	
	animate(GL, 0, rotate);
    
}