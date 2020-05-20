var NUM_BOMBS=10;
var TABLERO=10;
var bandera=0;
var objetivo=(TABLERO*TABLERO)-NUM_BOMBS;
var cont_abiertas=0;
var cont_bandera=0;
var num_jugadas=0;
var tiempo_inicio=0;
var tiempo_fin=0;
var primera_jugada=0;
var intervalo=0;
var fin_partida=false;
var tiempo_parcial;

//iniciar();

function iniciar(){
	var nombre="";
	var nombre2="";
	var i,j;
	var d=new Date();
	
	document.getElementById("tablero").style.visibility="initial";
	
	for(i=0;i<TABLERO;i++){
		for(j=0;j<TABLERO;j++){
			nombre="celda"+i+j;
			nombre2=document.getElementById(nombre);
			document.getElementById(nombre).bomba=false;
			document.getElementById(nombre).marca=false;
			document.getElementById(nombre).destapada=false;
			document.getElementById(nombre).contar=0;
			document.getElementById(nombre).style.borderRadius="0";
			document.getElementById(nombre).style.backgroundColor="lightgrey";
			document.getElementById(nombre).innerHTML="";
			document.getElementById(nombre).style.backgroundImage="url('texturademetal_30306.jpg')";
			cont_abiertas=0;
			cont_bandera=0;
			num_jugadas=0;
			primera_jugada=0;
		}
	}
	fin_partida=false;
	tiempo_inicio=d.getTime();
	escribir_info('');
	clearInterval(intervalo);
	escribir_tiempo();
	//atribuir_bombas();
	//contar_cercanas();
	return 0;
}

function atribuir_bombas(no_bomba){
	//console.log(no_bomba);
	var posiciones=poner_bombas(no_bomba);
	var nombre="";
		
	for(i=0;i<posiciones.length;i++){
		nombre="celda"+posiciones[i][0]+posiciones[i][1];
		document.getElementById(nombre).bomba=true;	
	}
	return 0;
}

//Devuelve un array de 10x2 con las posiciones de las bombas(10 numeros sin repeticion)
function poner_bombas(primera_pos){
	var posicion_bombas= new Array(NUM_BOMBS);
	var posicion_bombas_mod= new Array(NUM_BOMBS);
	var a;
	//console.log(primera_pos);
	for(i=0; i<NUM_BOMBS;i++){
		posicion_bombas_mod[i]=new Array(2);
	}
	/*
	for(i=0; i<posicion_bombas.length; i++){
		posicion_bombas[i]=Math.floor(Math.random()*TABLERO*TABLERO);
		
		for(j=i-1;j>=0;j--){
			if (posicion_bombas[i]==posicion_bombas[j] || posicion_bombas[j]==primera_pos){
				posicion_bombas[j]=Math.floor(Math.random()*TABLERO*TABLERO);
				j++
			}
		}	
	}
	//tiene problemas ya que si cambia j, a valor de j-1 no lo detecta*/
	
	for(i=0; i<posicion_bombas.length; i++){
		do{
			posicion_bombas[i]=Math.floor(Math.random()*TABLERO*TABLERO);
		}while(posicion_bombas[i]==primera_pos)
			
		do{
			a=0;
			for(j=i-1;j>=0;j--){
				if (posicion_bombas[i]==posicion_bombas[j]){
					do{
						posicion_bombas[i]=Math.floor(Math.random()*TABLERO*TABLERO);
					}while(posicion_bombas[i]==primera_pos)
					a=1;//hacemos que repita
					j=-1;//terminamos el bucle directamente
				}
			}
		}while(a)	
	}
	
	//posicion_bombas=[0,13,19,21,22,32,41,73,89,94]; //Introduccion manual de bombas
	posicion_bombas.sort(function(a,b){return a-b})
	
	for(i=0; i<posicion_bombas.length; i++){
		posicion_bombas_mod[i][0]=Math.floor(posicion_bombas[i]/TABLERO);
		posicion_bombas_mod[i][1]=posicion_bombas[i]%TABLERO;
	}
	//console.log(posicion_bombas);
	//console.log(posicion_bombas_mod);
	//escribir_matriz(posicion_bombas_mod,"cuadrito");
	return posicion_bombas_mod;
}

function contar_cercanas(){
	var cont=0;
	var nombre;
	var i,j,k,l;
	
	for(i=0;i<TABLERO;i++){
		for(j=0;j<TABLERO;j++){
			nombre="celda"+i+j;
			cont=0;
			
			for(k=i-1;k<i+2;k++){
				for(l=j-1;l<j+2;l++){
					if(k<0 || k>TABLERO-1 ||l<0 ||l>TABLERO-1) continue;
					nombre_temp="celda"+k+l;
					if(document.getElementById(nombre_temp).bomba==true){
						cont++;
					}
				}
			}
			document.getElementById(nombre).contar=cont;
		}
	}
	return 0;	
}

function destapar(esto){
	var d=new Date();
	var letras;
	var x,y,prohibida;
	
	if (fin_partida==true){
		escribir_info("LA PARTIDA YA HA ACABADO:<br/>Pulsa \'Iniciar Partida\' para volver a empezar");
		document.getElementById("tiempo_dinamico").innerHTML="";
		return 0;
	}
		
	if(primera_jugada==0){
		x=(esto.id.charAt(5));
		y=(esto.id.charAt(6));
		prohibida=parseInt(x+y);
		console.log(prohibida);
		atribuir_bombas(prohibida);
		contar_cercanas();
		primera_jugada=1;
		tiempo_inicio=d.getTime();
		intervalo=setInterval(escribir_tiempo,1000);
		//console.log("primer mov");
	}
	if(bandera==1 && esto.destapada==false){
		esto.style.backgroundColor="lightblue";
		esto.style.backgroundImage="url('flag.png')";
		esto.style.backgroundSize="30px 30px";
		esto.marca=true;
		document.getElementById("poner_marca_b").style.color="black";
		bandera=0;
		cont_bandera++;
		escribir_info("");
	}
	else if(bandera==2 && esto.destapada==false){
		if(esto.marca==true){
			esto.style.backgroundColor="lightgrey";
			esto.style.backgroundImage="url('texturademetal_30306.jpg')";
			esto.style.backgroundSize="30px 30px";
			esto.marca=false;
			cont_bandera--;
		}
		document.getElementById("quitar_marca_b").style.color="black";
		bandera=0;
		escribir_info("");
	}
	else if(bandera==2 && esto.destapada==true){
		document.getElementById("quitar_marca_b").style.color="black";
		bandera=0;
	}
	else if(bandera==1 && esto.destapada==true){
		document.getElementById("poner_marca_b").style.color="black";
		bandera=0;
	}
	else{
		num_jugadas++;
		if(esto.destapada==true){
			escribir_info("Ya has abierto esa casilla");
			bandera=0;
		}
		else if(esto.marca==true){
			escribir_info("Casilla con marca");
		}
		else{
			esto.destapada=true;
			if(esto.bomba==true){
				escribir_info("PERDISTE");
				ensenar_bombas();
			}
			else if(esto.contar==0){
				cont_abiertas++;
				destapa_vacia(esto);
				escribir_info("");
			}
			else{
				escribir_tablero(esto);
				cont_abiertas++;
				escribir_info("");
			}
			escribir_tablero(esto);
		}
	}
	//escribir_info("");
	if(cont_abiertas==objetivo){
		ensenar_bombas_2();
		tiempo_fin=d.getTime();
		alert("GANASTE en: "+((tiempo_fin-tiempo_inicio)/1000).toFixed(2)+ "segundos");
	}
	return 0;
}

function escribir_tablero(esto){
	if(esto.bomba==true){
		esto.style.backgroundColor="red";
		esto.style.borderRadius="20px";
		esto.innerHTML="";
		esto.style.backgroundImage="url('icono_bomba.png')";
	}
	else if(esto.contar>0){
		esto.innerHTML=esto.contar;
		esto.style.backgroundColor="white";
		esto.style.borderRadius="0px";
		esto.style.backgroundImage="none"
	}
	else{
		esto.style.backgroundColor="lightblue";
		esto.innerHTML="";
		esto.style.borderRadius="0px";
		esto.style.backgroundImage="url('texturadeagua_21619.jpg')";
	}
	return 0;
}

function ensenar_bombas(){
	var i, j;
	var nombre;
	var x,y ,prohibida;
	
	clearInterval(intervalo);
	fin_partida=true;
	
	if(primera_jugada==0){
		prohibida=null;
		atribuir_bombas(prohibida);
		contar_cercanas();
		primera_jugada=1;
	}
	
	for(i=0;i<TABLERO;i++){
		for(j=0;j<TABLERO;j++){
			nombre="celda"+i+j;
			document.getElementById(nombre).destapada=true;
			if(document.getElementById(nombre).bomba==true){
				document.getElementById(nombre).style.backgroundColor="orange";
				document.getElementById(nombre).style.borderRadius="20px";
				document.getElementById(nombre).innerHTML="";
				document.getElementById(nombre).style.backgroundImage="url('icono_bomba.png')";
				document.getElementById(nombre).style.backgroundSize="30px 30px";
			}
			else if(document.getElementById(nombre).contar>0){
				document.getElementById(nombre).innerHTML=document.getElementById(nombre).contar;
				document.getElementById(nombre).style.backgroundColor="white";
				document.getElementById(nombre).style.borderRadius="0px";
				document.getElementById(nombre).style.backgroundImage="none";
				document.getElementById(nombre).style.backgroundSize="30px 30px";
			}
			else{
				document.getElementById(nombre).style.backgroundColor="lightblue";
				document.getElementById(nombre).innerHTML="";
				document.getElementById(nombre).style.borderRadius="0px";
				document.getElementById(nombre).style.backgroundImage="url('texturadeagua_21619.jpg')";
				document.getElementById(nombre).style.backgroundSize="30px 30px";
			}
		}
	}
	return 0;
}

function ensenar_bombas_2(){
	var i, j;
	var nombre;
	
	clearInterval(intervalo);
	fin_partida=true;

	for(i=0;i<TABLERO;i++){
		for(j=0;j<TABLERO;j++){
			nombre="celda"+i+j;
			document.getElementById(nombre).destapada=true;
			if(document.getElementById(nombre).bomba==true){
				document.getElementById(nombre).style.backgroundColor="white";
				document.getElementById(nombre).style.borderRadius="20px";
				document.getElementById(nombre).innerHTML="";
				document.getElementById(nombre).style.backgroundImage="url('icono_bomba.png')";
				document.getElementById(nombre).style.backgroundSize="30px 30px";
			}
			else if(document.getElementById(nombre).contar>0){
				document.getElementById(nombre).innerHTML=document.getElementById(nombre).contar;
				document.getElementById(nombre).style.backgroundColor="white";
				document.getElementById(nombre).style.borderRadius="0px";
				document.getElementById(nombre).style.backgroundImage="none";
				document.getElementById(nombre).style.backgroundSize="30px 30px";
			}
			else{
				document.getElementById(nombre).style.backgroundColor="lightblue";
				document.getElementById(nombre).innerHTML="";
				document.getElementById(nombre).style.borderRadius="0px";
				document.getElementById(nombre).style.backgroundImage="url('texturadeagua_21619.jpg')";
				document.getElementById(nombre).style.backgroundSize="30px 30px";
			}
		}
	}
	return 0;
}

/*function propagar_agua(esto){
	var temp=esto.id;
	var x=parseInt(temp.charAt(5));
	var y=parseInt(temp.charAt(6));
	var nombre;
				
	for(i=x-1; i<x+2 ; i++){
		for(j=y-1;j<y+2;j++){
			if(i<0 || i>9 ||j<0 ||j>9) 
				continue;
			if(i==x && j==y)
				continue;
			nombre="celda"+i+j;
			
			if(document.getElementById(nombre).destapada==true) 
				continue;
			
			console.log(nombre);
			document.getElementById(nombre).destapada=true;
			escribir_tablero(document.getElementById(nombre));
			//if(document.getElementById(nombre).contar==0){
				//escribir_tablero(document.getElementById(nombre));
				//propagar_agua(document.getElementById(nombre));
			//}
		}
	}
}

//for(i=(x-1<0 ? 0 : x-1);i<=(x+1 < ROWS ? x+1 : ROWS-1);i++)

*/

function destapa_vacia(esto){
	var a,i,j;
	var cont=0;
	var nombre;
	var temporal;
	
	
	do{
		a=0;//no repite salvo que destape algo en la iteracion
		for(i=0;i<TABLERO;i++){
			for(j=0;j<TABLERO;j++){
				nombre="celda"+i+j;
				temporal=vecinos_vacios(document.getElementById(nombre));
				if(temporal==true && document.getElementById(nombre).destapada==false){
					document.getElementById(nombre).destapada = true;
					if(document.getElementById(nombre).marca == true){
						document.getElementById(nombre).marca = false;
						cont_bandera--;
					}
					cont_abiertas++;
					//console.log(cont_abiertas);
					escribir_tablero(document.getElementById(nombre));
					a=1;
				}
			}
		}
	}while(a);
	return 0;
}

function vecinos_vacios(esto){
	//var nombre;
	var temp=esto.id;
	//var temp=esto;
	//console.log(temp);
	var x=parseInt(temp.charAt(5));
	var y=parseInt(temp.charAt(6));
	var i,j;
	
		
	for(i=(x-1<0 ? 0 : x-1) ; i<=(x+1 < TABLERO ? x+1 : TABLERO-1) ; i++){
		for(j=(y-1<0 ? 0: y-1); j<=(y+1 < TABLERO ? y+1 : TABLERO-1) ; j++){
			if(i==x && j==y){
				continue;
			}

			nombre="celda"+i+j;
			if(document.getElementById(nombre).destapada && document.getElementById(nombre).contar==0){
				return true;
			}
		}
	}
	return false;
}

function poner_marca(){
	if (bandera!=1){
		bandera=1;
		document.getElementById("poner_marca_b").style.color="red";
		document.getElementById("quitar_marca_b").style.color="black";
	}
	else{
		bandera=0;
		document.getElementById("poner_marca_b").style.color="black";
		
	}
	return 0;
}

function quitar_marca(){
	if (bandera!=2){
		bandera=2;
		document.getElementById("poner_marca_b").style.color="black";
		document.getElementById("quitar_marca_b").style.color="red";
	}
	else{
		bandera=0;
		document.getElementById("quitar_marca_b").style.color="black";
		
	}
	return 0;
}

function escribir_info(texto_pasado){
	var texto_predeterminado= "Minas Totales: "+NUM_BOMBS+"<br/>Casillas por destapar: "+(objetivo-cont_abiertas)+ "<br/>Casillas con marcas: "+cont_bandera+"<br/>Llevas: "+ num_jugadas+ " jugadas";

	if (texto_pasado != ""){
		texto_predeterminado=texto_pasado;
	}

	//console.log(texto_predeterminado);
	document.getElementById("panel_info").innerHTML=texto_predeterminado;
	//escribir_tiempo();
	return 0;
}

function escribir_tiempo(){
	var d=new Date();
	//var tiempo_parcial=d.getTime();
	var anadir;
	
	if(fin_partida==false){
		tiempo_parcial=d.getTime();
	}
	anadir= "Llevas: "+parseInt((tiempo_parcial-tiempo_inicio)/1000)+"s";
	document.getElementById("tiempo_dinamico").innerHTML=anadir;
}
