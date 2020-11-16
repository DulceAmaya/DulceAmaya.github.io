let peliculas = ["Titanic", "Cenicienta", "Pulp Fiction", "Avatar", "Joker", "Toy Story", "Avengers", "Cars", "Batman Inicia", "Baby Driver", "Shrek", "Lalaland", "Monsters Inc", "El Padrino", "Sharknado", "Mulan", "Megamente", "Iron Man", "El transportador", "Enredados", "La Familia Adams", "Interestelar", "Venom", "Jumanji"];

let letras = [];
let intentos = 1;
let letrasUsadas = [];
let letrasFaltantes = 0;
let puntaje = 0;

/*Función auxiliar que busca si la palabra incluye una letra, mayúscula o minúscula*/
function incluyeLetra(l){
    let n = 0;
    while(n < letras.length){
        if(letras[n] == l || letras[n] == l.toUpperCase())
            return true;

        n++;
    }
    return false;
}

/*
 * Función que comienza el juego. Selecciona aleatoriamente una palabra del arreglo de palabras existente.
 */
function comenzar(){
    //Obtenemos un indice aleatorio dentro del tamaño del arreglo.
    const indice = Math.floor(Math.random() * peliculas.length);
    
    let input = document.getElementById("letter-input");
    input.innerHTML = "";

    nuevaPalabra(peliculas[indice]);
    letraSeleccionada();
}

/*
 * Función que crea las casillas para una nueva palabra;
 */
function nuevaPalabra(palabra){
    //Creamos un arreglo de letras con la palabra seleccionada.
    letras = Array.from(palabra);
    //Asignamos a letrasFaltantes el número de letras que falta por adivinar sin contar los espacios.
    // letrasFaltantes = letras.length;
    letras.forEach(letra => {
        if(letra !== " ")
            letrasFaltantes++;
    });

    //Obtenemos el contenedor.
    let contenedor = document.getElementsByClassName("word-container");
    //Por cada letra en el arreglo creamos una casilla.
    letras.forEach(l => {
        let casilla = document.createElement("div");
        //Si hay un espacio creamos un div con la clase "space".
        if(l === " ")
            casilla.setAttribute("class", "word space");
        //En otro caso creamos el div con la clase "letter".
        else
            casilla.setAttribute("class", "word letter");
        contenedor[0].appendChild(casilla);
    });
}

/*
 * Función que detecta cuando una letra ha sido seleccionada.
 */
function letraSeleccionada(){
    let input = document.getElementById("letter-input");
    let lettersInput = /^[A-Za-zÁ-ú]+$/;
    input.addEventListener("input", (e) => {
        let l = e.data;
        //Verificamos que el usuario ingresara una letra.
        if(l.match(lettersInput)){
            inputLetra(l);
            input.disabled = true;
        }
        //Fijamos un timer, para limpiar el input después de 300 milisengundos.
        setTimeout(() => {input.value="";},300);
        input.disabled = false;
    });
}

/*
 * Función que verificia si la letra ingresada es válida.
*/
function inputLetra(l){
    //Si la letra ya fue utilizada muestra una alerta.
    if(letrasUsadas.includes(l))
        alert("Esa letra ya la has usado");
    //En otro caso varifica si la letra ingresada es correcta.
    else{
        // if(letras.includes(l))
        if(incluyeLetra(l))
            letraCorrecta(l);
        //Verificamos si la letra no es una mayúscula
        // Aquí hay un error, tengo que checar ambos caoso por si la letra aparece más de una vez y una de esas veces es una mayuscula. No solo una situación O la otra.
        // else if(letras.includes(l.toUpperCase()))
        //     letraCorrecta(l.toUpperCase());
        else
            letraIncorrecta();
        letrasUsadas.push(l);
    }
}

/*
 * Función para cuando la letra seleccionada es correcta.
 */
function letraCorrecta(l){
    //Obtenemos los índices donde aparece l.
    let indices = getIndices(l);
    //Si la letra es correcta disminuimos el contador de letras faltantes.
    letrasFaltantes -= indices.length;
    //Por cada índice en donde aparece la letra la mostramos en la casilla correspondiente.
    let casillas = document.getElementsByClassName("word");
    for(let i = 0; i < indices.length; i++){
        let casilla = casillas[indices[i]];
        let texto = document.createTextNode(letras[indices[i]]);
        casilla.appendChild(texto);
    }
    if(letrasFaltantes == 0)
        ganar();
}

/*
 * Función auxiliar que devuleve un arreglo con los índices del arreglo letras donde aparece l.
 */
function getIndices(l){
    let indices = [];
    for(let i = 0; i < letras.length; i++){
        if(letras[i] === l || letras[i] === l.toUpperCase())
            indices.push(i);
    }
    return indices;
}

/*
 * Función para cuando la letra seleccionada es incorrecta.
 */
function letraIncorrecta(){
    //Incrementamos el número de intentos.
    intentos ++;
    console.log(intentos);
    //Sustituimos la imagen.
    let imagenString = "ahorcado/" + intentos + ".png";
    document.getElementById("image").src=imagenString;

    //Después del sexto intento el juego termina;
    if(intentos === 7){
        perder();
        //Al terminar el juego, llamamos a la funcion finJuego() que sustituira el input por un boton de "Comenzar juego";
    }
}

/*
 * Función para cuando ganamos el juego.
 */
function ganar(){
    // Incrementamos el puntaje en 1.
    let score = document.getElementById("score-container");
    puntaje++;
    score.innerHTML = "Puntaje: " + puntaje;
    //Creamos un nuevo elemento <h1>
    let fin = document.createElement("h1")
    fin.id = "title";
    fin.innerHTML = "¡Ganaste! :)"

    //Sustituimos el elemento existente.
    let body = document.getElementsByTagName("body");
    let titulo = document.getElementById("title");
    body[0].replaceChild(fin, titulo);

    crearBoton();
}

/*
 * Función para cuando perdemos el juego.
 */
function perder(){
    //Creamos un nuevo elemento <h1>
    let fin = document.createElement("h1");
    fin.id = "title";
    fin.innerHTML = "Perdiste :("
    let casillas = document.getElementsByClassName("word");
    for(let k = 0; k < letras.length; k++){
        if(casillas[k].innerHTML == ""){
            let casilla = casillas[k];
            casilla.id = "missing";
            let texto = document.createTextNode(letras[k]);
            casilla.appendChild(texto);
        }
    }
    //Sustituimos el elemento existente.
    let body = document.getElementsByTagName("body");
    let titulo = document.getElementById("title");
    body[0].replaceChild(fin, titulo);
    crearBoton();
}

/*
 * Función que crea un botón para volver a jugar.
 */
function crearBoton(){
    //Remplazamos el input por un botón para volver a empezar.
    //Comenzamos por eliminar el mensaje
    let letterContainer = document.getElementsByClassName("letter-container")[0];
    let mensaje = letterContainer.getElementsByTagName("h3")[0];
    letterContainer.removeChild(mensaje);
    //Creamos un boton.
    let boton = document.createElement("button");
    boton.innerHTML = "Volver a jugar";
    boton.addEventListener("click", reinciar);
    let input = document.getElementById("letter-input");
    letterContainer.replaceChild(boton, input);
}


/*
 * Función que reinicia el juego.
 */
function reinciar(){
    letras = [];
    intentos = 1;
    letrasUsadas = [];
    letrasFaltantes = 0;

    let container = document.getElementsByClassName("word-container")[0];
    while(container.hasChildNodes()){
        container.removeChild(container.firstChild);
    }

    //Remplazamos la imagen inicial
    let imagenString = "ahorcado/1.png";
    document.getElementById("image").src=imagenString;

    //Reemplazamos el botón por el input.
    let letterContainer = document.getElementsByClassName("letter-container")[0];
    let h3 = document.createElement("h3");
    h3.innerHTML = "Ingresa una letra";
    let input = document.createElement("input");
    input.id = "letter-input";
    letterContainer.replaceChild(h3, letterContainer.children[0]);
    letterContainer.appendChild(input);

    //Remplazamos el mensaje inicial
    let inicio = document.createElement("h1")
    inicio.id = "title";
    inicio.innerHTML = "Juego de Ahorcado";
    let body = document.getElementsByTagName("body");
    let titulo = document.getElementById("title");
    body[0].replaceChild(inicio, titulo);

    comenzar();
}


comenzar();
