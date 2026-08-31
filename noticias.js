const noticias = [

    {
        id: 1,
        titulo: "Xbox Game Pass suma nuevos juegos en la segunda mitad de agosto",
        categoria: "Noticias",
        tipo: "noticia",
        fecha: "18 de agosto de 2026",
        descripcion: "Xbox anuncia una nueva tanda de juegos que llegará a Game Pass durante la segunda mitad de agosto de 2026.",
        imagen: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=1000&q=80",
        url: "noticias/noticia1.html"
    },

    {
        id: 2,
        titulo: "Call of Duty: Modern Warfare 4 prepara su beta con nuevos detalles",
        categoria: "Noticias",
        tipo: "noticia",
        fecha: "19 de agosto de 2026",
        descripcion: "Call of Duty revela nuevos detalles de la beta de Modern Warfare 4, incluyendo fechas, requisitos de PC y contenido.",
        imagen: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80",
        url: "noticias/noticia2.html"
    },

    {
        id: 3,
        titulo: "Xbox Game Pass recibe nuevos juegos durante la segunda mitad de agosto",
        categoria: "Noticias",
        tipo: "noticia",
        fecha: "19 de agosto de 2026",
        descripcion: "Xbox Game Pass suma nuevos juegos durante la segunda mitad de agosto, incluyendo Vapor World: Over the Mind, BlazBlue Entropy Effect X y Relooted.",
        imagen: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=1000&q=80",
        url: "noticias/noticia3.html"
    },

    {
        id: 4,
        titulo: "Gallipoli prepara su lanzamiento para PC, PS5 y Xbox",
        categoria: "Lanzamientos",
        tipo: "lanzamiento",
        fecha: "19 de agosto de 2026",
        descripcion: "Gallipoli llegará el 20 de agosto a PC, PlayStation 5 y Xbox Series X|S con una propuesta de shooter multijugador ambientada en la histórica campaña de Gallípoli.",
        imagen: "imagenes/gallipoli.jpg",
        url: "noticias/noticia4.html"
    },

    {
        id: 5,
        titulo: "Gran Turismo 7 prepara la actualización 1.71 con cuatro nuevos coches",
        categoria: "Noticias",
        tipo: "noticia",
        fecha: "19 de agosto de 2026",
        descripcion: "Gran Turismo 7 recibirá la actualización 1.71 el 20 de agosto con cuatro nuevos coches, tres eventos de carrera y una nueva ubicación para Scapes.",
        imagen: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1000&q=80",
        url: "noticias/noticia5.html"
    },

    {
        id: 6,
        titulo: "Cómo mejorar el rendimiento de tu PC para conseguir más FPS",
        categoria: "Guías",
        tipo: "guia",
        fecha: "19 de agosto de 2026",
        descripcion: "Consejos prácticos para mejorar el rendimiento de tu PC y conseguir una experiencia de juego más fluida.",
        imagen: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=80",
        url: "noticias/guia1.html"
    }

];


// =====================================================
// NORMALIZAR TÍTULOS
// =====================================================

function normalizarTitulo(titulo) {

    return String(titulo || "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

}


// =====================================================
// CONVERTIR FECHAS
// =====================================================

function convertirFecha(fecha) {

    if (!fecha) {
        return 0;
    }

    let texto = String(fecha)
        .replace(/📅/g, "")
        .replace(/·\s*Por.*$/i, "")
        .trim();


    // =================================================
    // FORMATO: 20/8/2026
    // =================================================

    const formatoCorto =
        texto.match(
            /(\d{1,2})\/(\d{1,2})\/(\d{4})/
        );

    if (formatoCorto) {

        const dia =
            parseInt(
                formatoCorto[1],
                10
            );

        const mes =
            parseInt(
                formatoCorto[2],
                10
            ) - 1;

        const año =
            parseInt(
                formatoCorto[3],
                10
            );


        return new Date(
            año,
            mes,
            dia
        ).getTime();

    }


    // =================================================
    // FORMATO: 20 de agosto de 2026
    // =================================================

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


    const formatoLargo =
        texto.match(
            /(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})/i
        );


    if (formatoLargo) {

        const dia =
            parseInt(
                formatoLargo[1],
                10
            );

        const nombreMes =
            formatoLargo[2]
                .toLowerCase();

        const año =
            parseInt(
                formatoLargo[3],
                10
            );


        if (
            meses[nombreMes] !== undefined
        ) {

            return new Date(
                año,
                meses[nombreMes],
                dia
            ).getTime();

        }

    }


    // =================================================
    // FORMATO RSS
    // Ejemplo:
    // Wed, 19 Aug 2026 20:47:20 +0000
    // =================================================

    const fechaRSS =
        new Date(texto);


    if (
        !isNaN(
            fechaRSS.getTime()
        )
    ) {

        return fechaRSS.getTime();

    }


    return 0;

}


// =====================================================
// ORDENAR NOTICIAS
// MÁS RECIENTES PRIMERO
// =====================================================

function ordenarNoticias() {

    noticias.sort(
        function(a, b) {

            const fechaA =
                convertirFecha(
                    a.fecha
                );

            const fechaB =
                convertirFecha(
                    b.fecha
                );

            return fechaB - fechaA;

        }
    );

}


// =====================================================
// CARGAR NOTICIAS PUBLICADAS POR TEOS AI
// =====================================================

async function cargarNoticiasPublicadas() {

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/noticias-publicadas"
        );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar las noticias."
            );

        }


        const noticiasPublicadas =
            await respuesta.json();


        if (!Array.isArray(noticiasPublicadas)) {

            console.error(
                "La respuesta del servidor no es una lista."
            );

            ordenarNoticias();

            teosMostrarNoticias();

            return;

        }


        noticiasPublicadas.forEach(
            function(noticia, indice) {

                const tituloPublicada =
                    normalizarTitulo(
                        noticia.titulo
                    );


                if (!tituloPublicada) {

                    return;

                }


                const yaExiste =
                    noticias.some(
                        function(noticiaExistente) {

                            return (
                                normalizarTitulo(
                                    noticiaExistente.titulo
                                ) === tituloPublicada
                            );

                        }
                    );


                if (yaExiste) {

                    return;

                }


                noticias.push({

                    id:
                        "ai-" + indice,

                    titulo:
                        noticia.titulo ||
                        "Noticia sin título",

                    categoria:
                        "Noticias",

                    tipo:
                        "noticia",

                    fecha:
                        noticia.fecha ||
                        "Fecha no disponible",

                    descripcion:
                        "Nueva noticia publicada automáticamente por TEOS Gaming.",

                    imagen:
                        noticia.imagen ||
                        "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80",

                    url:
                        noticia.enlace

                });

            }
        );


        // =================================================
        // ORDENAR TODAS LAS NOTICIAS
        // =================================================

        ordenarNoticias();


        teosMostrarNoticias();


    } catch (error) {

        console.error(
            "No se pudieron cargar las noticias automáticas:",
            error
        );


        ordenarNoticias();

        teosMostrarNoticias();

    }

}


// =====================================================
// MOSTRAR NOTICIAS
// =====================================================

function teosMostrarNoticias(
    categoriaSeleccionada = "Todas"
) {

    const contenedor =
        document.getElementById(
            "contenedorNoticias"
        );


    if (!contenedor) {

        console.error(
            "No existe #contenedorNoticias en noticias.html"
        );

        return;

    }


    // =================================================
    // ORDENAR ANTES DE MOSTRAR
    // =================================================

    ordenarNoticias();


    let noticiasMostrar;


    if (
        categoriaSeleccionada ===
        "Todas"
    ) {

        noticiasMostrar =
            noticias;

    } else {

        noticiasMostrar =
            noticias.filter(
                function(noticia) {

                    return (
                        noticia.categoria ===
                        categoriaSeleccionada
                    );

                }
            );

    }


    // =================================================
    // LIMPIAR CONTENEDOR
    // =================================================

    contenedor.innerHTML = "";


    // =================================================
    // CREAR TARJETAS
    // =================================================

    noticiasMostrar.forEach(
        function(noticia) {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "tarjeta-noticia";


            tarjeta.innerHTML = `

                <div class="imagen-noticia">

                    <img
                        src="${noticia.imagen}"
                        alt="${noticia.titulo}"
                        loading="lazy"
                    >

                </div>


                <div class="contenido-noticia">

                    <span class="etiqueta">
                        ${noticia.categoria}
                    </span>


                    <h2>
                        ${noticia.titulo}
                    </h2>


                    <p class="fecha-noticia">
                        📅 ${noticia.fecha}
                    </p>


                    <p>
                        ${noticia.descripcion}
                    </p>


                    <a
                        href="${noticia.url}"
                        class="boton-leer"
                    >
                        Leer más →
                    </a>

                </div>

            `;


            contenedor.appendChild(
                tarjeta
            );

        }
    );

}


// =====================================================
// FILTROS
// =====================================================

function configurarFiltros() {

    const filtros =
        document.querySelectorAll(
            ".filtro"
        );


    filtros.forEach(
        function(filtro) {

            filtro.addEventListener(
                "click",
                function() {

                    filtros.forEach(
                        function(item) {

                            item.classList.remove(
                                "activo"
                            );

                        }
                    );


                    filtro.classList.add(
                        "activo"
                    );


                    const categoria =
                        filtro.dataset.categoria ||
                        "Todas";


                    teosMostrarNoticias(
                        categoria
                    );

                }
            );

        }
    );

}


// =====================================================
// INICIAR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        configurarFiltros();

        cargarNoticiasPublicadas();

    }
);
