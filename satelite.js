////////////////////////////////////////////////////////////////////////////////////////
//
//		CLASE SATELITE
//
////////////////////////////////////////////////////////////////////////////////////////

function Satelite(rad,GL,url,radio_orb){
	//////////////////////
	// Parametros de creacion de la esfera
	this.radio = rad;
	this.url = url;
	this.tipo = "s";
	this.radio_orbital = radio_orb;
	//////////////////////
	// Matriz de movimiento de la esfera
	this.MOVEMATRIX = LIBS.get_I4();
	
	//////////////////////
	// Constructores
	this.sphere = new Sphere(this.radio,90,GL,this.url)
}

Satelite.prototype.draw = function( GL,_position,_uv,_normal ){
	return this.sphere.draw(GL,_position,_uv,_normal);
}

Satelite.prototype.setMoveMatrix = function( matr ){
	this.MOVEMATRIX= matr;
}