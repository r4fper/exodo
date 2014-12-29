/*Clase para usar la cámara web desde el navegador 
 ------------Clase CamaraVideo ---------------------*/
function CamaraVideo(webcam) {
    //-----------Atributos --------
    this.webcam = webcam;
    //------------Métodos-----------
    this.usarCamara = function () {
        navigator.getUserMedia = (navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia);
        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: true,
                audio: false
            }, function (stream) { //Empieza la ejecución del video
                var url = (window.URL || window.webkitURL || window.mozURL || window.msURL);
                webcam.src = url ? url.createObjectURL(stream) : stream;
                webcam.play();

            }, function (e) { //Manejo de error
                alert("Error en la aplicación: " + e);
            });
        }
        return false;
    };
}

/*------------Clase Imagen ---------------------*/
/*Recibe como parámetros
 ancho: Ancho de la imagen
 alto: Alto de la imagen
 camara: Capa donde se está mostrando la Webcam.
 foto: Foto que se toma de la Webcam 
       (sobre la foto se manipulan los pixeles de la imagen)
 */
function Imagen(ancho, alto, camara, foto) {
    //-----------Atributos -------
    //Constructor de la clase
    this.ancho = ancho;
    this.alto = alto;
    this.camara = camara;
    this.foto = foto;
    this.img = null;
    //------------Métodos-----------
    /*Toma una foto desde la webcam*/
    this.capturar = function () {
        foto.width = this.ancho;
        foto.height = this.alto;
        /*se obtiene la imagen de la webcam en 2D*/
        this.img = this.foto.getContext('2d');
        this.img.drawImage(this.camara, 0, 0, this.ancho, this.alto);
    };
    /*Analiza la imagen para determinar si fue 'tocada'
      en la parte superior izquierda o derecha*/
    this.analizar = function () {
        //creamos un vector con los pixeles de la imagen.
        /*Parámetros:
         * x=0
         * y=0
         * ancho=ancho de la imagen desplegada por la webcam(800px)
         * alto= alto de la imagen desplegada por la webcam(600px)*/
        vImagen = this.img.getImageData(0, 0, this.ancho, this.alto);
        /*Objeto que representa la Marca Derecha*/
        var marcaDerecha = new Marca(100, 150, 700, 0);
        /*Objeto que representa la Marca Izquierda*/
        var marcaIzquierda = new Marca(100, 150, 0, 0);
        //Monitorea si la parte superior derecha
        // fue señalada con un objeto rojo
        if (marcaDerecha.verificar(vImagen))
            /*Si detecta que fue 'tocada' mueve el objeto.
             * 2: Derecha
             * 1: Izquierda*/
            marcaDerecha.mover(2);
        //Monitorea si la parte superior izquierda
        // fue señalada con un objeto rojo
        if (marcaIzquierda.verificar(vImagen))
            /*Si detecta que fue 'tocada' mueve el objeto*/
            marcaIzquierda.mover(1);
    };
}

/*------------Clase Marca ---------------------*/
function Marca(ancho, alto, x, y) {
    //-----------Atributos -------
    this.anchoMarca = ancho;  //ancho de la Marca
    this.altoMarca = alto;   //Alto de la Marca
    this.marcaX = x;  //Valor de la coordenada en X
    this.marcaY = y; //Valor de la coordenada en Y
    //------------Métodos-----------
    //Verificar si ha sido tocada la Marca
    this.verificar = function (vImagen) {
        /*Se calcula cual es pixel donde comienza la Marca.
         * parte superior Izquierda        
         pxIncial  -->  .......
                        .......
                        .......
         
         *se multiplica el Ancho por la coordenada en Y + coordenada en X
         *todo eso multiplicado por 4, eso no da el pixel donde inicial la Marca*/
        var pixelInicial = 4*((this.anchoMarca * this.marcaY) + this.marcaX);
        //Ancho de la Imagen en pixeles (4 puntos por cada pixel(RGBA))
        var anchoImgEnPixeles = oImagen.ancho * 4;
         //Ancho de la Marca en pixeles (4 puntos por cada pixel(RGBA))
        var anchoMarcaEnPixeles = this.anchoMarca * 4;
        var pos = pixelInicial;
        for (i = 0; i < this.altoMarca; i++) {
            for (j = 0; j < this.anchoMarca; j++) {
                promeGB = (vImagen.data[pos + 1] + vImagen.data[pos + 2]) / 2;
                if ((promeGB < 101) && (vImagen.data[pos] > 150)) {
                    return true;
                }
                pos += 4;
            }
            /*Siguiente punto a analizar:
             * A la posición actual(pos) le sumanos la diferencia 
             * del ancho de la Imagen menos ancho de la Marca*/
            pos += (anchoImgEnPixeles - anchoMarcaEnPixeles);
        }
        return false;
    };
    //Ubicar la marca en la posición especificada.
    this.ubicar = function () {
    };
    //Mover el objeto en el sentido especificado (derecha o izquierda)
    this.mover = function (sentido) {
        /*Objeto ha ser movido*/
        var objeto = document.getElementById('cuna').style;
        switch (sentido) {
            //Mover a la Derecha
            case 1:
                /*Incremeta en 50px*/
                pixeles += 50;
                /*Si los pixeles a mover exceden el ancho
                 *  permitido no realiza el movimiento */
                if (pixeles<=550){
                    /*Mueve el objeto +/-50px*/
                    objeto.left = pixeles + "px";
                }else{
                    /*Sino le asigna el máximo permitido*/
                    pixeles=550;
                }
                    
                break;
                //Mover a la Izquierda 
            case 2:
                /*Decrementa 50px*/
                pixeles -= 50;
                /*Si los pixeles a mover son menores a cero
                 * no realiza el movimiento */
                if (pixeles>=0){
                    /*Mueve el objeto +/-50px*/
                    objeto.left = pixeles + "px";
                }else{
                    /*Sino le asigna el mínimo permitido*/
                    pixeles=0;
                }
                    
                break;
        }
    };
}
/*------------Clase enemigo--------------
Obstáculos y enemigos que debe sortear el protagonista
*/
function enemigo(x, y, ancho, alto, canvas) {
    /*-----------Atributos---------*/
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.canvas = canvas;
    this.ctx = null;
    /*------------Métodos----------*/
    /*Dibujar los enemigos en el canvas*/
    this.dibujar = function () {
        /*Obtenemos el contexto 
        para dibujar dentro del canvas*/
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = '#FF0000'; /*Se rellena de color rojo*/
        /*Se especifica la posición(x,y), ancho y alto*/
        this.ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    };
    /*Instrucciones para mover a los enemigos*/
    this.mover = function () {
        this.ctx.clearRect(this.x, this.y, this.ancho, this.alto);
        this.y--;
        this.dibujar(this.ctx);
    };
    /*Instrucciones para destruir los enemigos cuando colisionan
    o desaparecen del área visible del juego (y<0)*/
    this.destruir = function () {
        //Borra el espacio dibujado por el enemigo en la pantalla
        this.ctx.clearRect(this.x, this.y, this.ancho, this.alto);
    };
}

/*------------Clase protagonista--------------
Protagonista de la historia
*/
function protagonista(x, y, ancho, alto) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    /*Verificamos si hubo colisión con algún obstáculo */
    this.colision = function (vectorEnemigos) {
        if (parseInt(this.x) + this.ancho < parseInt(vectorEnemigos.x))
            return false;
        if (parseInt(this.y) + this.alto < parseInt(vectorEnemigos.y))
            return false;
        if (parseInt(this.x) > parseInt(vectorEnemigos.x) + vectorEnemigos.ancho)
            return false;
        if (parseInt(this.y) > parseInt(vectorEnemigos.y) + vectorEnemigos.alto)
            return false;
        return true;
    };

    this.mover = function () {
        /*Instrucciones para mover al protagonista*/
    };
}