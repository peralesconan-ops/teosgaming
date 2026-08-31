// =====================================================
// GUÍAS TEOS GAMING
// =====================================================

const guias = [

    {
        id: 1,
        titulo: "Cómo mejorar el rendimiento de tu PC para conseguir más FPS",
        categoria: "PC",
        dificultad: "Fácil",
        tiempo: "10 minutos",
        fecha: "19 de agosto de 2026",
        descripcion: "Consejos prácticos para mejorar el rendimiento de tu PC y conseguir una experiencia de juego más fluida.",
        imagen: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80",
        url: "guias/guia1.html"
    },

    {
        id: 2,
        titulo: "Consejos para mejorar tu puntería en juegos FPS",
        categoria: "FPS",
        dificultad: "Intermedia",
        tiempo: "15 minutos",
        fecha: "21 de agosto de 2026",
        descripcion: "Mejora tu precisión, movimientos y control del mouse con estos consejos para juegos competitivos.",
        imagen: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80",
        url: "guias/guia2.html"
    },

    {
        id: 3,
        titulo: "Cómo configurar correctamente los gráficos de un juego",
        categoria: "PC",
        dificultad: "Fácil",
        tiempo: "5 minutos",
        fecha: "20 de agosto de 2026",
        descripcion: "Aprende a configurar los gráficos para encontrar el equilibrio entre calidad visual y rendimiento.",
        imagen: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
        url: "guias/guia3.html"
    },

    {
        id: 4,
        titulo: "Cómo elegir la resolución correcta para jugar",
        categoria: "PC",
        dificultad: "Fácil",
        tiempo: "5 minutos",
        fecha: "22 de agosto de 2026",
        descripcion: "Aprende qué resolución utilizar para conseguir una buena calidad de imagen sin sacrificar demasiado rendimiento.",
        imagen: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80",
        url: "guias/guia4.html"
    },

    {
        id: 5,
        titulo: "Cómo configurar correctamente tu mouse para jugar",
        categoria: "Gaming",
        dificultad: "Fácil",
        tiempo: "10 minutos",
        fecha: "23 de agosto de 2026",
        descripcion: "Configura la sensibilidad, velocidad y opciones principales de tu mouse para conseguir un mejor control durante tus partidas.",
        imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1000&q=80",
        url: "guias/guia5.html"
    },

    {
        id: 6,
        titulo: "Cómo mejorar tu concentración mientras juegas",
        categoria: "Gaming",
        dificultad: "Intermedia",
        tiempo: "10 minutos",
        fecha: "24 de agosto de 2026",
        descripcion: "Aprende algunos hábitos sencillos para mantener la concentración y evitar distracciones durante tus partidas.",
        imagen: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1000&q=80",
        url: "guias/guia6.html"
    },

    {
        id: 7,
        titulo: "Cómo cuidar tu PC para jugar durante más tiempo",
        categoria: "PC",
        dificultad: "Fácil",
        tiempo: "10 minutos",
        fecha: "25 de agosto de 2026",
        descripcion: "Consejos básicos para mantener tu PC limpia, ventilada y preparada para largas sesiones de juego.",
        imagen: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80",
        url: "guias/guia7.html"
    },

    {
        id: 8,
        titulo: "Cómo evitar distracciones durante una partida competitiva",
        categoria: "Gaming",
        dificultad: "Fácil",
        tiempo: "8 minutos",
        fecha: "26 de agosto de 2026",
        descripcion: "Organiza tu entorno y elimina distracciones para concentrarte mejor durante tus partidas.",
        imagen: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=1000&q=80",
        url: "guias/guia8.html"
    },

    {
        id: 9,
        titulo: "Cómo mantener una buena postura mientras juegas",
        categoria: "Gaming",
        dificultad: "Fácil",
        tiempo: "7 minutos",
        fecha: "27 de agosto de 2026",
        descripcion: "Aprende a organizar tu espacio de juego y mantener una postura adecuada durante tus sesiones.",
        imagen: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1000&q=80",
        url: "guias/guia9.html"
    },

    {
        id: 10,
        titulo: "Cómo mejorar tu experiencia de juego con unos buenos auriculares",
        categoria: "Gaming",
        dificultad: "Fácil",
        tiempo: "8 minutos",
        fecha: "28 de agosto de 2026",
        descripcion: "Descubre qué características debes tener en cuenta para conseguir un mejor sonido durante tus partidas.",
        imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
        url: "guias/guia10.html"
    },

    {
        id: 11,
        titulo: "Cómo mejorar tu precisión con el mouse gaming",
        categoria: "Gaming",
        dificultad: "Intermedia",
        tiempo: "12 minutos",
        fecha: "28 de agosto de 2026",
        descripcion: "Aprende a configurar y utilizar correctamente tu mouse para conseguir movimientos más precisos durante tus partidas.",
        imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1000&q=80",
        url: "guias/guia11.html"
    },

    {
        id: 12,
        titulo: "Cómo organizar tu almacenamiento para mejorar tu experiencia de juego",
        categoria: "PC",
        dificultad: "Fácil",
        tiempo: "10 minutos",
        fecha: "29 de agosto de 2026",
        descripcion: "Aprende a organizar el almacenamiento de tu PC, liberar espacio y mantener tus juegos y archivos correctamente organizados.",
        imagen: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80",
        url: "guias/guia12.html"
    }

];


// =====================================================
// CONVERTIR FECHAS
// =====================================================

function convertirFechaGuia(fecha) {

    if (!fecha) {
        return 0;
    }

    const texto = String(fecha)
        .replace(/📅/g, "")
        .trim();


    const formatoCorto = texto.match(
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/
    );


    if (formatoCorto) {

        const dia = parseInt(formatoCorto[1], 10);
        const mes = parseInt(formatoCorto[2], 10) - 1;
        const año = parseInt(formatoCorto[3], 10);

        return new Date(año, mes, dia).getTime();
    }


    const meses = {

        enero: 0,
        febrero: 1,
        marzo: 2,
        abril: 3,
        mayo: 4,
        junio: 5,
        julio: 6,
        agosto: 7,
        septiembre: 8,
        octubre: 9,
        noviembre: 10,
        diciembre: 11

    };


    const formatoLargo = texto.match(
        /(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})/i
    );


    if (formatoLargo) {

        const dia = parseInt(formatoLargo[1], 10);
        const nombreMes = formatoLargo[2].toLowerCase();
        const año = parseInt(formatoLargo[3], 10);

        if (meses[nombreMes] !== undefined) {

            return new Date(
                año,
                meses[nombreMes],
                dia
            ).getTime();

        }

    }


    const fechaRSS = new Date(texto);

    if (!isNaN(fechaRSS.getTime())) {
        return fechaRSS.getTime();
    }


    return 0;
}


// =====================================================
// ORDENAR GUÍAS
// =====================================================

function ordenarGuias() {

    guias.sort(function(a, b) {

        return (
            convertirFechaGuia(b.fecha) -
            convertirFechaGuia(a.fecha)
        );

    });

}


// =====================================================
// MOSTRAR GUÍAS
// =====================================================

function mostrarGuias() {

    const contenedor =
        document.getElementById("contenedorGuias");


    if (!contenedor) {

        console.error(
            "No existe #contenedorGuias en guias.html"
        );

        return;
    }


    ordenarGuias();

    contenedor.innerHTML = "";


    guias.forEach(function(guia) {

        const tarjeta =
            document.createElement("article");


        tarjeta.className =
            "tarjeta-noticia";


        const imagen =
            document.createElement("div");

        imagen.className =
            "imagen-noticia";


        const img =
            document.createElement("img");

        img.src =
            guia.imagen;

        img.alt =
            guia.titulo;

        img.loading =
            "lazy";


        imagen.appendChild(img);


        const info =
            document.createElement("div");

        info.className =
            "info-noticia";


        const etiqueta =
            document.createElement("span");

        etiqueta.className =
            "etiqueta";

        etiqueta.textContent =
            "🎯 " + guia.categoria;


        const titulo =
            document.createElement("h3");

        titulo.textContent =
            guia.titulo;


        const fecha =
            document.createElement("p");

        fecha.className =
            "fecha-noticia";

        fecha.textContent =
            "📅 " + guia.fecha;


        const descripcion =
            document.createElement("p");

        descripcion.textContent =
            guia.descripcion;


        const dificultad =
            document.createElement("p");

        dificultad.innerHTML =
            "🟢 Dificultad: <strong>" +
            guia.dificultad +
            "</strong>";


        const tiempo =
            document.createElement("p");

        tiempo.innerHTML =
            "⏱️ Tiempo: <strong>" +
            guia.tiempo +
            "</strong>";


        const boton =
            document.createElement("a");

        boton.href =
            guia.url;

        boton.className =
            "boton-leer";

        boton.textContent =
            "Leer guía →";


        info.appendChild(etiqueta);
        info.appendChild(titulo);
        info.appendChild(fecha);
        info.appendChild(descripcion);
        info.appendChild(dificultad);
        info.appendChild(tiempo);
        info.appendChild(boton);


        tarjeta.appendChild(imagen);
        tarjeta.appendChild(info);


        contenedor.appendChild(tarjeta);

    });

}


// =====================================================
// INICIAR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        mostrarGuias();

    }
);S