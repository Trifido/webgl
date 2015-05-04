/* Primer intento de algo orientao a objetos */

function Sphere(rad,rots){
	
	this.radio = rad;
	this.rotaciones = rots;
	
	this.vertex = CALCULOS.sphere_vertex(this.radio,this.rotaciones);
	this.faces = CALCULOS.sphere_faces(rots);
		
}

Sphere.prototype.draw = function(){
	//alert("ok");
	
}

var CALCULOS = {
	
	sphere_faces: function(rots){
	
		var rotations = rots;
		var faces = [];
		for (var i=0; i < rotations; i++) {
			for (var j=0; j < rotations; j++) {
				var first = (i * (rotations + 1)) + j;
				var second = first + rotations + 1;
				faces.push(first);
				faces.push(second);
				faces.push(first + 1);
				
				faces.push(second);
				faces.push(second + 1);
				faces.push(first + 1);
			}
		}
		return faces;
	},
	
	sphere_vertex: function(rad,rots){
  	
	var rotations = rots;
	var radius = rad;
	var vertex = [];
	
	for (var i=0; i <= rotations; i++) {
		var alpha = i * Math.PI / rotations;
		var sinalpha = Math.sin(alpha);
		var cosalpha = Math.cos(alpha);

		for (var j=0; j <= rotations; j++) {
			var betha = j * 2 * Math.PI / rotations;
			var sinbetha = Math.sin(betha);
			var cosbetha = Math.cos(betha);

			var x = cosbetha * sinalpha;
			var y = cosalpha;
			var z = sinbetha * sinalpha;
			var u = 1 - (j / rotations);
			var v = 1 - (i / rotations);

			vertex.push(radius * x);
			vertex.push(radius * y);
			vertex.push(radius * z);
			vertex.push(u);
			vertex.push(v);
		}
	}
	return vertex;
  }
	
};

