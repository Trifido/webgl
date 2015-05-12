////////////////////////////////////////////////////////////////////////////////////////
//
//		CLASE PLANETA
//
////////////////////////////////////////////////////////////////////////////////////////

function Planeta(rad,GL,url){
	//////////////////////
	// Parametros de creacion de la esfera
	this.radio = rad;
	this.url = url;
	//////////////////////
	// Matriz de movimiento de la esfera
	this.MOVEMATRIX = LIBS.get_I4();
	
	//////////////////////
	// Constructores
	this.sphere = new Sphere(this.radio,90,GL,this.url);
}

Planeta.prototype.draw = function( GL,_position,_uv,_normal ){
	this.sphere.draw(GL,_position,_uv,_normal);
}