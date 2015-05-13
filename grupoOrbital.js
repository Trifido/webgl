
function GrupoOrbital( _Mmatrix, _Pmatrix,_position,_uv,_normal ){
	
	//////////////////////////////////////////////
	// Parametros de creacion del grupo orbital
	this._Mmatrix = _Mmatrix;
	this._Pmatrix = _Pmatrix;
	this._position = _position;
	this._uv = _uv;
	this._normal = _normal;
	this.planetas = [];
	
	/////////////////////////////////////////////
	// Other
	this.i = 0;
	this.angulo = 0;
}

GrupoOrbital.prototype.addAstro= function( astro ){
	
	this.planetas[ this.i ] = astro;
	this.i++;
	
}

GrupoOrbital.prototype.draw = function( GL,dt,rotate ){
	
	//LIBS.rotateY( terra.MOVEMATRIX, dt );
	
	for( var j= 0; j < this.i; j++){
		
		if( this.planetas[j].tipo == "p" )
			LIBS.rotateY( this.planetas[j].MOVEMATRIX, dt );
		else
			if( rotate ){
				
				var matrix_trans = LIBS.get_I4();
				var matrix_rot = LIBS.get_I4();
				LIBS.translateZ( matrix_trans, this.planetas[j].radio_orbital );
				LIBS.rotateY( matrix_rot,this.angulo );
				
				this.planetas[j].setMoveMatrix( LIBS.multiply( matrix_trans,matrix_rot ));
				this.angulo = ( this.angulo + 0.02 ) % 360;
				
			}
			
			
		GL.uniformMatrix4fv( this._Mmatrix, false, this.planetas[j].MOVEMATRIX );
		this.planetas[j].draw( GL,this._position,this._uv,this._normal );
		
	}
		
	
}
