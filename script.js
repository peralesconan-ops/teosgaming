// ==========================================
// TEOS GAMING - SCRIPT PRINCIPAL
// ==========================================


// ==========================================
// MENÚ MÓVIL
// ==========================================

const botonMenu = document.getElementById("botonMenu");
const menu = document.querySelector(".menu");

if (botonMenu && menu) {

    botonMenu.addEventListener("click", function () {

        menu.classList.toggle("menu-abierto");

    });

}


// ==========================================
// BUSCADOR
// ==========================================

const botonBuscar =
    document.getElementById("botonBuscar");

const buscador =
    document.querySelector(".buscador");


if (botonBuscar && buscador) {

    botonBuscar.addEventListener("click", function () {

        buscador.classList.toggle("activo");

    });

}


// ==========================================
// RESULTADOS DEL BUSCADOR
// ==========================================

const campoBusqueda =
    document.getElementById("campoBusqueda");

const resultadosBusqueda =
    document.getElementById("resultadosBusqueda");


if (campoBusqueda && resultadosBusqueda) {

    campoBusqueda.addEventListener("input", function () {

        const texto =
            campoBusqueda.value
                .toLowerCase()
                .trim();


        resultadosBusqueda.innerHTML = "";


        if (texto === "") {

            resultadosBusqueda.style.display =
                "none";

            return;

        }


        const resultados =
            noticias.filter(function (noticia) {

                return (

                    noticia.titulo
                        .toLowerCase()
                        .includes(texto)

                    ||

                    noticia.categoria
                        .toLowerCase()
                        .includes(texto)

                );

            });


        resultadosBusqueda.style.display =
            "block";


        if (resultados.length === 0) {

            resultadosBusqueda.innerHTML =
                '<div class="sin-resultados">' +
                'No encontramos noticias.' +
                '</div>';

            return;

        }


        resultados.forEach(function (noticia) {

            const resultado =
                document.createElement("div");


            resultado.classList.add("resultado");


            resultado.innerHTML = `

                <a href="${noticia.url}">
                    ${noticia.titulo}
                </a>

                <span class="resultado-categoria">
                    ${noticia.categoria} · ${noticia.fecha}
                </span>

            `;


            resultadosBusqueda.appendChild(
                resultado
            );

        });

    });

}


// ==========================================
// FUNCIÓN PARA CREAR TARJETAS
// ==========================================

function crearTarjeta(noticia) {

    const tarjeta =
        document.createElement("article");


    tarjeta.classList.add(
        "tarjeta-noticia"
    );


    tarjeta.innerHTML = `

        <div
            class="imagen-noticia"
            style="background-image:
            url('${noticia.imagen}')">
        </div>


        <div class="info-noticia">

            <span>
                🎮
                ${noticia.categoria.toUpperCase()}
            </span>


            <h3>
                ${noticia.titulo}
            </h3>


            <p>
                ${noticia.descripcion}
            </p>


            <a href="${noticia.url}">
                Leer más →
            </a>

        </div>

    `;


    return tarjeta;

}


// ==========================================
// MOSTRAR NOTICIAS
// ==========================================

const contenedorNoticias =
    document.getElementById(
        "contenedorNoticias"
    );


function mostrarNoticias(lista) {

    if (!contenedorNoticias) {
        return;
    }


    contenedorNoticias.innerHTML = "";


    lista.forEach(function (noticia) {

        const tarjeta =
            crearTarjeta(noticia);


        contenedorNoticias.appendChild(
            tarjeta
        );

    });

}


if (contenedorNoticias) {

    mostrarNoticias(noticias);

}


// ==========================================
// FILTROS DE NOTICIAS
// ==========================================

const filtros =
    document.querySelectorAll(".filtro");


filtros.forEach(function (filtro) {

    filtro.addEventListener("click", function () {

        const categoria =
            filtro.dataset.categoria;


        filtros.forEach(function (boton) {

            boton.classList.remove(
                "activo"
            );

        });


        filtro.classList.add("activo");


        if (!contenedorNoticias) {
            return;
        }


        const noticiasFiltradas =

            categoria === "Todas"

                ? noticias

                : noticias.filter(
                    function (noticia) {

                        return (
                            noticia.categoria ===
                            categoria
                        );

                    }
                );


        mostrarNoticias(
            noticiasFiltradas
        );

    });

});


// ==========================================
// LANZAMIENTOS
// ==========================================

const contenedorLanzamientos =
    document.getElementById(
        "contenedorLanzamientos"
    );


if (contenedorLanzamientos) {

    const lanzamientos =
        noticias.filter(function (noticia) {

            return (
                noticia.categoria ===
                "Lanzamientos"
            );

        });


    lanzamientos.forEach(function (noticia) {

        const tarjeta =
            crearTarjeta(noticia);


        contenedorLanzamientos.appendChild(
            tarjeta
        );

    });

}


// ==========================================
// GUÍAS
// ==========================================

const contenedorGuias =
    document.getElementById(
        "contenedorGuias"
    );


if (contenedorGuias) {

    const guias =
        noticias.filter(function (noticia) {

            return (
                noticia.categoria ===
                "Guías"
            );

        });


    guias.forEach(function (noticia) {

        const tarjeta =
            crearTarjeta(noticia);


        contenedorGuias.appendChild(
            tarjeta
        );

    });

}