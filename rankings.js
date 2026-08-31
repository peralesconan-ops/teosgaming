// =====================================================
// RANKINGS TEOS GAMING
// =====================================================


// =====================================================
// RANKINGS INICIALES
// =====================================================

const rankings = [

    {
        id: 1,
        titulo: "Mejores videojuegos de aventura",
        categoria: "Aventura",
        descripcion: "Una selección de videojuegos de aventura que destacan por su exploración, historia y mundo.",
        imagen: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80",
        url: "rankings/ranking2.html"
    },

    {
        id: 2,
        titulo: "Mejores juegos RPG",
        categoria: "RPG",
        descripcion: "Juegos de rol que destacan por sus mundos, personajes, progresión y posibilidades de juego.",
        imagen: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
        url: "rankings/ranking1.html"
    },

    {
        id: 3,
        titulo: "Mejores juegos para jugar con amigos",
        categoria: "Multijugador",
        descripcion: "Videojuegos ideales para disfrutar partidas con amigos y otros jugadores.",
        imagen: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80",
        url: "rankings/ranking3.html"
    },

    {
        id: 4,
        titulo: "Mejores juegos gratuitos para PC",
        categoria: "PC",
        descripcion: "Una selección de juegos gratuitos para PC que ofrecen grandes experiencias sin necesidad de pagar.",
        imagen: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80",
        url: "rankings/ranking4.html"
    },

    {
        id: 5,
        titulo: "Mejores juegos de mundo abierto",
        categoria: "Mundo abierto",
        descripcion: "Una selección de los mejores juegos de mundo abierto por su exploración, libertad, contenido y posibilidades.",
        imagen: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80",
        url: "rankings/ranking5.html"
    },

    {
        id: 6,
        titulo: "Mejores juegos de acción",
        categoria: "Acción",
        descripcion: "Una selección de los mejores juegos de acción por su combate, jugabilidad, intensidad y experiencia general.",
        imagen: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
        url: "rankings/ranking6.html"
    },

    {
        id: 7,
        titulo: "Mejores juegos de terror",
        categoria: "Terror",
        descripcion: "Una selección de los mejores juegos de terror por su ambientación, tensión, historia y capacidad para mantener al jugador en suspense.",
        imagen: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1000&q=80",
        url: "rankings/ranking7.html"
    },

    {
        id: 8,
        titulo: "Mejores juegos de mundo abierto",
        categoria: "Mundo abierto",
        descripcion: "Una selección de los mejores juegos de mundo abierto por su exploración, libertad, contenido, mundo y experiencia general.",
        imagen: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1000&q=80",
        url: "rankings/ranking8.html"
    },

    {
        id: 9,
        titulo: "Mejores juegos de acción",
        categoria: "Acción",
        descripcion: "Una selección de los mejores juegos de acción por sus combates, jugabilidad, ritmo, variedad y experiencia general.",
        imagen: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
        url: "rankings/ranking9.html"
    },

    {
        id: 10,
        titulo: "Mejores juegos multijugador online",
        categoria: "Multijugador",
        descripcion: "Una selección de los mejores juegos multijugador online por su comunidad, diversión, jugabilidad y experiencia competitiva.",
        imagen: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80",
        url: "rankings/ranking10.html"
    },
];


// =====================================================
// MOSTRAR RANKINGS
// =====================================================

function mostrarRankings() {

    const contenedor =
        document.getElementById("contenedorRankings");


    if (!contenedor) {

        console.error(
            "No existe #contenedorRankings en rankings.html"
        );

        return;
    }


    contenedor.innerHTML = "";


    rankings.forEach(function(ranking) {


        // =================================================
        // TARJETA
        // =================================================

        const tarjeta =
            document.createElement("article");

        tarjeta.className =
            "juego";


        // =================================================
        // PORTADA
        // =================================================

        const portada =
            document.createElement("div");

        portada.className =
            "portada-juego";


        portada.style.backgroundImage =
            "url('" + ranking.imagen + "')";


        // =================================================
        // INFORMACIÓN
        // =================================================

        const info =
            document.createElement("div");

        info.className =
            "info-juego";


        // =================================================
        // ETIQUETA
        // =================================================

        const etiqueta =
            document.createElement("span");

        etiqueta.textContent =
            "🏆 TOP 10";


        // =================================================
        // TÍTULO
        // =================================================

        const titulo =
            document.createElement("h3");

        titulo.textContent =
            ranking.titulo;


        // =================================================
        // DESCRIPCIÓN
        // =================================================

        const descripcion =
            document.createElement("p");

        descripcion.textContent =
            ranking.descripcion;


        // =================================================
        // CATEGORÍA
        // =================================================

        const categoria =
            document.createElement("p");

        categoria.innerHTML =
            "🎯 Categoría: <strong>" +
            ranking.categoria +
            "</strong>";


        // =================================================
        // BOTÓN
        // =================================================

        const boton =
            document.createElement("a");

        boton.href =
            ranking.url;

        boton.className =
            "boton-leer";

        boton.textContent =
            "Ver ranking →";


        // =================================================
        // CONSTRUIR INFORMACIÓN
        // =================================================

        info.appendChild(etiqueta);

        info.appendChild(titulo);

        info.appendChild(descripcion);

        info.appendChild(categoria);

        info.appendChild(boton);


        // =================================================
        // CONSTRUIR TARJETA
        // =================================================

        tarjeta.appendChild(portada);

        tarjeta.appendChild(info);


        // =================================================
        // AGREGAR AL CONTENEDOR
        // =================================================

        contenedor.appendChild(tarjeta);

    });

}


// =====================================================
// INICIAR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        mostrarRankings();

    }
);