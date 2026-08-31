// =====================================================
// TEOS AI - PANEL PRINCIPAL
// NOTICIAS + RANKINGS
// =====================================================


// =====================================================
// ELEMENTOS DEL PANEL
// =====================================================

const botonSeccionNoticias =
    document.getElementById("botonSeccionNoticias");

const botonSeccionRankings =
    document.getElementById("botonSeccionRankings");

const seccionNoticias =
    document.getElementById("seccionNoticias");

const seccionRankings =
    document.getElementById("seccionRankings");


// =====================================================
// CAMBIAR A NOTICIAS
// =====================================================

if (botonSeccionNoticias) {

    botonSeccionNoticias.addEventListener(
        "click",
        function () {

            if (seccionNoticias) {
                seccionNoticias.style.display = "block";
            }

            if (seccionRankings) {
                seccionRankings.style.display = "none";
            }


            botonSeccionNoticias.classList.add("activo");

            botonSeccionRankings.classList.remove("activo");

        }
    );

}


// =====================================================
// CAMBIAR A RANKINGS
// =====================================================

if (botonSeccionRankings) {

    botonSeccionRankings.addEventListener(
        "click",
        function () {

            if (seccionNoticias) {
                seccionNoticias.style.display = "none";
            }

            if (seccionRankings) {
                seccionRankings.style.display = "block";
            }


            botonSeccionRankings.classList.add("activo");

            botonSeccionNoticias.classList.remove("activo");

        }
    );

}


// =====================================================
// VARIABLES DE NOTICIAS
// =====================================================

const campoConsulta =
    document.getElementById("consultaNoticias");

const botonBuscar =
    document.getElementById("buscarNoticias");

const resultado =
    document.getElementById("resultadoNoticias");


let noticiasEncontradas = [];

let articuloGenerado = null;


// =====================================================
// EVENTO BUSCAR NOTICIAS
// =====================================================

if (botonBuscar) {

    botonBuscar.addEventListener(
        "click",
        buscarNoticias
    );

}


if (campoConsulta) {

    campoConsulta.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                buscarNoticias();

            }

        }
    );

}


// =====================================================
// BUSCAR NOTICIAS
// =====================================================

async function buscarNoticias() {

    const consulta =
        campoConsulta.value.trim();


    if (consulta === "") {

        resultado.innerHTML =
            "<div class='ai-error'>" +
            "⚠️ Escribe qué noticias quieres buscar." +
            "</div>";

        return;

    }


    resultado.innerHTML =
        "<div class='ai-cargando'>" +
        "<strong>🤖 TEOS AI</strong>" +
        "<p>🔎 Buscando noticias de hoy...</p>" +
        "</div>";


    try {

        const respuesta =
            await fetch(
                "http://localhost:3000/api/noticias"
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error del servidor"
            );

        }


        const noticias =
            await respuesta.json();


        noticiasEncontradas =
            noticias;


        if (noticias.length === 0) {

            resultado.innerHTML =
                "<div class='ai-error'>" +
                "⚠️ No encontramos noticias de hoy." +
                "</div>";

            return;

        }


        mostrarNoticias(noticias);


    } catch (error) {

        console.error(error);


        resultado.innerHTML =
            "<div class='ai-error'>" +
            "<strong>❌ No se pudo conectar con TEOS AI.</strong>" +
            "<p>Comprueba que servidor.js esté funcionando.</p>" +
            "</div>";

    }

}


// =====================================================
// MOSTRAR NOTICIAS
// =====================================================

function mostrarNoticias(noticias) {

    let html = "";


    html +=
        "<div class='lista-noticias-ai'>";


    html +=
        "<h2>📰 Noticias de hoy</h2>";


    html +=
        "<p>" +
        "Selecciona la noticia que quieres preparar " +
        "para TEOS Gaming." +
        "</p>";


    noticias.forEach(
        function (noticia, indice) {

            html +=
                "<article class='noticia-ai'>";


            html +=
                "<label>";


            html +=
                "<input type='checkbox' " +
                "class='seleccionar-noticia' " +
                "data-indice='" +
                indice +
                "'>";


            html +=
                "<strong>" +
                escaparHTML(noticia.titulo) +
                "</strong>";


            html +=
                "</label>";


            html +=
                "<p>" +
                escaparHTML(
                    noticia.descripcion || ""
                ) +
                "</p>";


            html +=
                "<small>📰 " +
                escaparHTML(
                    noticia.fuente ||
                    "Fuente desconocida"
                ) +
                "</small>";


            html +=
                "<br>";


            html +=
                "<small>📅 " +
                escaparHTML(
                    noticia.fecha ||
                    "Fecha desconocida"
                ) +
                "</small>";


            html +=
                "<br><br>";


            html +=
                "<a href='" +
                escaparAtributo(
                    noticia.enlace
                ) +
                "' target='_blank' " +
                "rel='noopener noreferrer'>" +
                "Leer fuente →" +
                "</a>";


            html +=
                "</article>";

        }
    );


    html +=
        "<button id='prepararArticulo' " +
        "class='boton-preparar'>" +
        "🤖 Preparar artículo TEOS" +
        "</button>";


    html +=
        "</div>";


    resultado.innerHTML =
        html;


    const botonPreparar =
        document.getElementById(
            "prepararArticulo"
        );


    if (botonPreparar) {

        botonPreparar.addEventListener(
            "click",
            prepararArticulo
        );

    }

}


// =====================================================
// ESCAPAR HTML
// =====================================================

function escaparHTML(texto) {

    if (!texto) {

        return "";

    }


    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// ESCAPAR ATRIBUTOS
// =====================================================

function escaparAtributo(texto) {

    if (!texto) {

        return "#";

    }


    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}


// =====================================================
// PREPARAR ARTÍCULO
// =====================================================

async function prepararArticulo() {

    const seleccionadas = [];


    const casillas =
        document.querySelectorAll(
            ".seleccionar-noticia"
        );


    casillas.forEach(
        function (casilla) {

            if (casilla.checked) {

                const indice =
                    Number(
                        casilla.dataset.indice
                    );


                seleccionadas.push(
                    noticiasEncontradas[indice]
                );

            }

        }
    );


    if (seleccionadas.length === 0) {

        alert(
            "Selecciona al menos una noticia."
        );

        return;

    }


    const noticia =
        seleccionadas[0];


    resultado.innerHTML =
        "<div class='ai-cargando'>" +
        "<strong>🤖 TEOS AI</strong>" +
        "<p>📝 Preparando el artículo...</p>" +
        "</div>";


    try {

        const respuesta =
            await fetch(
                "http://localhost:3000/api/preparar-articulo",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(noticia)

                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datos.error ||
                "No se pudo preparar el artículo."
            );

        }


        const articulo =
            datos;


        articuloGenerado =
            articulo;


        resultado.innerHTML = `

            <div class="vista-previa-articulo">

                <span class="etiqueta">
                    🤖 BORRADOR TEOS AI
                </span>

                <h2>
                    ${escaparHTML(
                        articulo.titulo
                    )}
                </h2>


                ${
                    articulo.imagen
                    ?
                    `
                    <div class="vista-previa-imagen">

                        <img
                            src="${escaparAtributo(
                                articulo.imagen
                            )}"
                            alt="${escaparAtributo(
                                articulo.titulo
                            )}"
                            loading="lazy"
                        >

                    </div>
                    `
                    :
                    ""
                }


                <h3>
                    Introducción
                </h3>

                <p>
                    ${escaparHTML(
                        articulo.introduccion
                    )}
                </p>


                <h3>
                    Desarrollo
                </h3>

                <p>
                    ${escaparHTML(
                        articulo.contenido
                    )}
                </p>


                <h3>
                    Conclusión
                </h3>

                <p>
                    ${escaparHTML(
                        articulo.conclusion
                    )}
                </p>


                <h3>
                    Fuente
                </h3>

                <p>
                    📰 ${escaparHTML(
                        articulo.fuente
                    )}
                </p>


                <p>

                    <a
                        href="${escaparAtributo(
                            articulo.enlace
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        🔗 Ver fuente original

                    </a>

                </p>


                <div class="acciones-articulo">

                    <button
                        id="volverNoticias"
                        class="boton-preparar"
                    >

                        ← Volver

                    </button>


                    <button
                        id="publicarArticulo"
                        class="boton-preparar"
                    >

                        🚀 Publicar

                    </button>

                </div>

            </div>

        `;


        document
            .getElementById(
                "volverNoticias"
            )
            .addEventListener(
                "click",
                function () {

                    mostrarNoticias(
                        noticiasEncontradas
                    );

                }
            );


        document
            .getElementById(
                "publicarArticulo"
            )
            .addEventListener(
                "click",
                publicarArticulo
            );


    } catch (error) {

        console.error(error);


        resultado.innerHTML =
            "<div class='ai-error'>" +
            "<strong>" +
            "❌ No se pudo preparar el artículo." +
            "</strong>" +
            "<p>" +
            escaparHTML(
                error.message
            ) +
            "</p>" +
            "</div>";

    }

}


// =====================================================
// PUBLICAR ARTÍCULO
// =====================================================

async function publicarArticulo() {

    const boton =
        document.getElementById(
            "publicarArticulo"
        );


    if (!boton) {

        return;

    }


    boton.disabled = true;


    boton.textContent =
        "⏳ Publicando...";


    try {

        const noticiaParaPublicar = {

            ...(articuloGenerado || {})

        };


        console.log(
            "🖼️ IMAGEN QUE SE VA A PUBLICAR:",
            noticiaParaPublicar.imagen
        );


        console.log(
            "🎨 PROMPT DE IMAGEN:",
            noticiaParaPublicar.imagenPrompt
        );


        const respuesta =
            await fetch(
                "http://localhost:3000/api/publicar-articulo",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            noticiaParaPublicar
                        )

                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datos.error ||
                "No se pudo publicar."
            );

        }


        resultado.innerHTML = `

            <div class="ai-exito">

                <h2>
                    ✅ ¡Noticia publicada!
                </h2>


                <p>
                    ${escaparHTML(
                        datos.mensaje
                    )}
                </p>


                <p>
                    📄 Archivo:
                    <strong>
                        ${escaparHTML(
                            datos.archivo
                        )}
                    </strong>
                </p>


                <p>
                    📁 Ubicación:
                    <strong>
                        ${escaparHTML(
                            datos.ruta
                        )}
                    </strong>
                </p>


                <button
                    id="volverNoticias"
                    class="boton-preparar"
                >

                    ← Volver a noticias

                </button>

            </div>

        `;


        document
            .getElementById(
                "volverNoticias"
            )
            .addEventListener(
                "click",
                function () {

                    mostrarNoticias(
                        noticiasEncontradas
                    );

                }
            );


    } catch (error) {

        console.error(error);


        boton.disabled = false;


        boton.textContent =
            "🚀 Publicar";


        alert(
            "❌ " +
            error.message
        );

    }

}


// =====================================================
// VARIABLES DE RANKINGS
// =====================================================

const botonPrepararRankings =
    document.getElementById(
        "prepararRankings"
    );

const resultadoRankings =
    document.getElementById(
        "resultadoRankings"
    );


let rankingsGenerados = null;


// =====================================================
// EVENTO PREPARAR RANKINGS
// =====================================================

if (botonPrepararRankings) {

    botonPrepararRankings.addEventListener(
        "click",
        prepararRankings
    );

}


// =====================================================
// PREPARAR LOS 10 RANKINGS
// =====================================================

async function prepararRankings() {

    if (!resultadoRankings) {

        return;

    }


    if (botonPrepararRankings) {

        botonPrepararRankings.disabled =
            true;

        botonPrepararRankings.textContent =
            "⏳ TEOS AI está preparando los rankings...";

    }


    resultadoRankings.innerHTML = `

        <div class="ai-cargando">

            <strong>
                🤖 TEOS AI
            </strong>

            <p>
                🏆 Analizando los 10 rankings...
            </p>

            <p>
                Esto puede tardar unos segundos.
            </p>

        </div>

    `;


    try {

        const respuesta =
            await fetch(
                "http://localhost:3000/api/preparar-rankings",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({})

                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datos.error ||
                "No se pudieron preparar los rankings."
            );

        }


        if (
            !datos.rankings ||
            !Array.isArray(datos.rankings)
        ) {

            throw new Error(
                "El servidor no devolvió rankings."
            );

        }


        if (
            datos.rankings.length !== 10
        ) {

            throw new Error(
                "TEOS AI no devolvió exactamente 10 rankings."
            );

        }


        rankingsGenerados =
            datos.rankings;


        mostrarRankings(
            rankingsGenerados
        );


    } catch (error) {

        console.error(error);


        resultadoRankings.innerHTML = `

            <div class="ai-error">

                <strong>
                    ❌ No se pudieron preparar los rankings.
                </strong>

                <p>
                    ${escaparHTML(
                        error.message
                    )}
                </p>

                <p>
                    Comprueba que servidor.js esté funcionando
                    correctamente.
                </p>

            </div>

        `;

    } finally {

        if (botonPrepararRankings) {

            botonPrepararRankings.disabled =
                false;

            botonPrepararRankings.textContent =
                "🤖 Preparar los 10 rankings";

        }

    }

}


// =====================================================
// MOSTRAR LOS 10 RANKINGS
// =====================================================

function mostrarRankings(rankings) {

    let html = "";


    html += `

        <div class="lista-rankings-ai">

            <span class="etiqueta">
                🏆 BORRADOR DE RANKINGS
            </span>

            <h2>
                🤖 TEOS AI preparó los 10 rankings
            </h2>

            <p>
                Revisa el contenido antes de publicarlo.
            </p>

    `;


    rankings.forEach(
        function (ranking, indice) {

            html += `

                <article class="ranking-ai">

                    <h2>

                        🏆 Ranking ${indice + 1}

                    </h2>


                    <h3>

                        ${escaparHTML(
                            ranking.titulo ||
                            "Sin título"
                        )}

                    </h3>


                    ${
                        ranking.introduccion
                        ?
                        `
                        <p>

                            ${escaparHTML(
                                ranking.introduccion
                            )}

                        </p>
                        `
                        :
                        ""
                    }


                    <div class="juegos-ranking-ai">

            `;


            if (
                ranking.juegos &&
                Array.isArray(
                    ranking.juegos
                )
            ) {

                ranking.juegos.forEach(
                    function (juego) {

                        let emoji =
                            "";


                        if (
                            juego.puesto === 1
                        ) {

                            emoji =
                                "🥇";

                        }
                        else if (
                            juego.puesto === 2
                        ) {

                            emoji =
                                "🥈";

                        }
                        else if (
                            juego.puesto === 3
                        ) {

                            emoji =
                                "🥉";

                        }


                        html += `

                            <div class="juego-ranking-ai">

                                <strong>

                                    ${emoji}
                                    #${escaparHTML(
                                        juego.puesto
                                    )}
                                    —
                                    ${escaparHTML(
                                        juego.nombre
                                    )}

                                </strong>


                                <span>

                                    ⭐
                                    ${escaparHTML(
                                        juego.puntuacion
                                    )}

                                </span>


                                <p>

                                    ${escaparHTML(
                                        juego.descripcion
                                    )}

                                </p>

                            </div>

                        `;

                    }
                );

            }


            html += `

                    </div>


                    ${
                        ranking.comoSeElaboro
                        ?
                        `
                        <h3>
                            📊 ¿Cómo elaboramos este ranking?
                        </h3>

                        <p>
                            ${escaparHTML(
                                ranking.comoSeElaboro
                            )}
                        </p>
                        `
                        :
                        ""
                    }


                    ${
                        ranking.conclusion
                        ?
                        `
                        <h3>
                            Conclusión
                        </h3>

                        <p>
                            ${escaparHTML(
                                ranking.conclusion
                            )}
                        </p>
                        `
                        :
                        ""
                    }

                </article>

            `;

        }
    );


    html += `

            <div class="acciones-rankings">

                <button
                    id="volverPrepararRankings"
                    class="boton-preparar"
                >

                    🔄 Generar nuevamente

                </button>


                <button
                    id="publicarRankings"
                    class="boton-preparar"
                >

                    🚀 Publicar los 10 rankings

                </button>

            </div>

        </div>

    `;


    resultadoRankings.innerHTML =
        html;


    const botonRegenerar =
        document.getElementById(
            "volverPrepararRankings"
        );


    if (botonRegenerar) {

        botonRegenerar.addEventListener(
            "click",
            prepararRankings
        );

    }


    const botonPublicar =
        document.getElementById(
            "publicarRankings"
        );


    if (botonPublicar) {

        botonPublicar.addEventListener(
            "click",
            publicarRankings
        );

    }

}


// =====================================================
// PUBLICAR LOS 10 RANKINGS
// =====================================================

async function publicarRankings() {

    if (
        !rankingsGenerados ||
        !Array.isArray(
            rankingsGenerados
        )
    ) {

        alert(
            "No hay rankings preparados para publicar."
        );

        return;

    }


    if (
        rankingsGenerados.length !== 10
    ) {

        alert(
            "Deben existir exactamente 10 rankings."
        );

        return;

    }


    const confirmar =
        confirm(
            "⚠️ ¿Seguro que quieres publicar los 10 rankings?\\n\\n" +
            "Esto reemplazará el contenido actual de ranking1.html hasta ranking10.html."
        );


    if (!confirmar) {

        return;

    }


    const boton =
        document.getElementById(
            "publicarRankings"
        );


    if (boton) {

        boton.disabled =
            true;

        boton.textContent =
            "⏳ Publicando los 10 rankings...";

    }


    try {

        const respuesta =
            await fetch(
                "http://localhost:3000/api/publicar-rankings",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            rankings:
                                rankingsGenerados

                        })

                }
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datos.error ||
                "No se pudieron publicar los rankings."
            );

        }


        resultadoRankings.innerHTML = `

            <div class="ai-exito">

                <h2>
                    🚀 ¡Rankings publicados!
                </h2>


                <p>
                    Los 10 rankings fueron actualizados correctamente.
                </p>


                <p>
                    TEOS AI reemplazó:
                </p>


                <ul>

                    <li>
                        ranking1.html
                    </li>

                    <li>
                        ranking2.html
                    </li>

                    <li>
                        ranking3.html
                    </li>

                    <li>
                        ranking4.html
                    </li>

                    <li>
                        ranking5.html
                    </li>

                    <li>
                        ranking6.html
                    </li>

                    <li>
                        ranking7.html
                    </li>

                    <li>
                        ranking8.html
                    </li>

                    <li>
                        ranking9.html
                    </li>

                    <li>
                        ranking10.html
                    </li>

                </ul>


                <button
                    id="volverRankings"
                    class="boton-preparar"
                >

                    🏆 Volver a Rankings

                </button>

            </div>

        `;


        document
            .getElementById(
                "volverRankings"
            )
            .addEventListener(
                "click",
                function () {

                    resultadoRankings.innerHTML = `

                        <p>
                            Pulsa el botón para que TEOS AI
                            prepare los 10 rankings.
                        </p>

                    `;

                }
            );


    } catch (error) {

        console.error(error);


        if (boton) {

            boton.disabled =
                false;

            boton.textContent =
                "🚀 Publicar los 10 rankings";

        }


        resultadoRankings.innerHTML = `

            <div class="ai-error">

                <strong>
                    ❌ Error publicando los rankings.
                </strong>

                <p>
                    ${escaparHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}