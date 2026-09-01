// =====================================================
// TEOS AI - PANEL PRINCIPAL
// NOTICIAS + RANKINGS + PC
// =====================================================


// =====================================================
// ELEMENTOS DEL PANEL
// =====================================================

const botonSeccionNoticias =
    document.getElementById("botonSeccionNoticias");

const botonSeccionRankings =
    document.getElementById("botonSeccionRankings");

const botonSeccionPC =
    document.getElementById("botonSeccionPC");

const seccionNoticias =
    document.getElementById("seccionNoticias");

const seccionRankings =
    document.getElementById("seccionRankings");

const seccionPC =
    document.getElementById("seccionPC");


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

            if (seccionPC) {
                seccionPC.style.display = "none";
            }

            botonSeccionNoticias.classList.add("activo");

            if (botonSeccionRankings) {
                botonSeccionRankings.classList.remove("activo");
            }

            if (botonSeccionPC) {
                botonSeccionPC.classList.remove("activo");
            }

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

            if (seccionPC) {
                seccionPC.style.display = "none";
            }

            botonSeccionRankings.classList.add("activo");

            if (botonSeccionNoticias) {
                botonSeccionNoticias.classList.remove("activo");
            }

            if (botonSeccionPC) {
                botonSeccionPC.classList.remove("activo");
            }

        }
    );

}


// =====================================================
// CAMBIAR A PC
// =====================================================

if (botonSeccionPC) {

    botonSeccionPC.addEventListener(
        "click",
        function () {

            if (seccionNoticias) {
                seccionNoticias.style.display = "none";
            }

            if (seccionRankings) {
                seccionRankings.style.display = "none";
            }

            if (seccionPC) {
                seccionPC.style.display = "block";
            }

            botonSeccionPC.classList.add("activo");

            if (botonSeccionNoticias) {
                botonSeccionNoticias.classList.remove("activo");
            }

            if (botonSeccionRankings) {
                botonSeccionRankings.classList.remove("activo");
            }

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
        campoConsulta
            ? campoConsulta.value.trim()
            : "";


    if (consulta === "") {

        mostrarErrorNoticias(
            "⚠️ Escribe qué noticias quieres buscar."
        );

        return;

    }


    if (resultado) {

        resultado.innerHTML = `
            <div class="ai-cargando">

                <strong>
                    🤖 TEOS AI
                </strong>

                <p>
                    🔎 Buscando noticias recientes...
                </p>

            </div>
        `;

    }


    try {

        const respuesta =
            await fetch(
                "/api/noticias",
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        const datos =
            await leerRespuestaJSON(
                respuesta
            );


        if (!respuesta.ok) {

            throw new Error(
                obtenerMensajeError(
                    datos,
                    "No se pudieron obtener las noticias."
                )
            );

        }


        if (!Array.isArray(datos)) {

            throw new Error(
                "El servidor no devolvió una lista válida de noticias."
            );

        }


        noticiasEncontradas =
            datos;


        if (
            noticiasEncontradas.length === 0
        ) {

            mostrarErrorNoticias(
                "⚠️ No encontramos noticias recientes en las fuentes disponibles."
            );

            return;

        }


        mostrarNoticias(
            noticiasEncontradas
        );


    } catch (error) {

        console.error(
            "❌ Error buscando noticias:",
            error
        );


        mostrarErrorNoticias(
            error.message ||
            "No se pudo conectar con TEOS AI."
        );

    }

}


// =====================================================
// MOSTRAR ERROR DE NOTICIAS
// =====================================================

function mostrarErrorNoticias(
    mensaje
) {

    if (!resultado) {
        return;
    }


    resultado.innerHTML = `
        <div class="ai-error">

            <strong>
                ❌ No se pudo completar la búsqueda.
            </strong>

            <p>
                ${escaparHTML(
                    mensaje
                )}
            </p>

        </div>
    `;

}


// =====================================================
// LEER JSON DEL SERVIDOR
// =====================================================

async function leerRespuestaJSON(
    respuesta
) {

    const texto =
        await respuesta.text();


    if (!texto) {
        return null;
    }


    try {

        return JSON.parse(
            texto
        );

    } catch (error) {

        return {
            error:
                texto
        };

    }

}


// =====================================================
// OBTENER MENSAJE DE ERROR
// =====================================================

function obtenerMensajeError(
    datos,
    mensajePredeterminado
) {

    if (
        datos &&
        typeof datos.error === "string"
    ) {

        return datos.error;

    }


    if (
        datos &&
        datos.error &&
        typeof datos.error.message === "string"
    ) {

        return datos.error.message;

    }


    return mensajePredeterminado;

}


// =====================================================
// MOSTRAR NOTICIAS
// =====================================================

function mostrarNoticias(
    noticias
) {

    if (!resultado) {
        return;
    }


    let html =
        `
        <div class="lista-noticias-ai">

            <h2>
                📰 Noticias recientes
            </h2>

            <p>
                Selecciona una noticia para que
                TEOS AI prepare el artículo.
            </p>
        `;


    noticias.forEach(
        function (
            noticia,
            indice
        ) {

            html += `
                <article class="noticia-ai">

                    <label>

                        <input
                            type="checkbox"
                            class="seleccionar-noticia"
                            data-indice="${indice}"
                        >

                        <strong>
                            ${escaparHTML(
                                noticia.titulo ||
                                "Sin título"
                            )}
                        </strong>

                    </label>

                    ${
                        noticia.imagen
                        ?
                        `
                        <div class="noticia-ai-imagen">

                            <img
                                src="${escaparAtributo(
                                    noticia.imagen
                                )}"
                                alt="${escaparAtributo(
                                    noticia.titulo ||
                                    "Noticia"
                                )}"
                                loading="lazy"
                            >

                        </div>
                        `
                        :
                        ""
                    }

                    <p>
                        ${escaparHTML(
                            noticia.descripcion ||
                            ""
                        )}
                    </p>

                    <small>
                        📰
                        ${escaparHTML(
                            noticia.fuente ||
                            "Fuente desconocida"
                        )}
                    </small>

                    <br>

                    <small>
                        📅
                        ${escaparHTML(
                            formatearFecha(
                                noticia.fecha
                            )
                        )}
                    </small>

                    ${
                        noticia.enlace
                        ?
                        `
                        <br><br>

                        <a
                            href="${escaparAtributo(
                                noticia.enlace
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Leer fuente →
                        </a>
                        `
                        :
                        ""
                    }

                </article>
                `;

        }
    );


    html += `
            <button
                id="prepararArticulo"
                class="boton-preparar"
            >
                🤖 Preparar artículo TEOS
            </button>

        </div>
        `;


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
// FORMATEAR FECHA
// =====================================================

function formatearFecha(
    fecha
) {

    if (!fecha) {
        return "Fecha no disponible";
    }


    const fechaConvertida =
        new Date(
            fecha
        );


    if (
        isNaN(
            fechaConvertida.getTime()
        )
    ) {

        return String(
            fecha
        );

    }


    return fechaConvertida.toLocaleString(
        "es-ES",
        {
            day:
                "2-digit",
            month:
                "2-digit",
            year:
                "numeric",
            hour:
                "2-digit",
            minute:
                "2-digit"
        }
    );

}


// =====================================================
// ESCAPAR HTML
// =====================================================

function escaparHTML(
    texto
) {

    if (!texto) {
        return "";
    }


    return String(
        texto
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// ESCAPAR ATRIBUTOS
// =====================================================

function escaparAtributo(
    texto
) {

    if (!texto) {
        return "#";
    }


    return String(
        texto
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );

}


// =====================================================
// PREPARAR ARTÍCULO
// =====================================================

async function prepararArticulo() {

    const seleccionadas =
        [];


    const casillas =
        document.querySelectorAll(
            ".seleccionar-noticia"
        );


    casillas.forEach(
        function (
            casilla
        ) {

            if (
                casilla.checked
            ) {

                const indice =
                    Number(
                        casilla.dataset.indice
                    );


                if (
                    noticiasEncontradas[indice]
                ) {

                    seleccionadas.push(
                        noticiasEncontradas[indice]
                    );

                }

            }

        }
    );


    if (
        seleccionadas.length === 0
    ) {

        alert(
            "Selecciona al menos una noticia."
        );

        return;

    }


    const noticia =
        seleccionadas[0];


    if (resultado) {

        resultado.innerHTML = `
            <div class="ai-cargando">

                <strong>
                    🤖 TEOS AI
                </strong>

                <p>
                    📝 Preparando el artículo...
                </p>

                <p>
                    Un momento...
                </p>

            </div>
        `;

    }


    try {

        const respuesta =
            await fetch(
                "/api/preparar-articulo",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            noticia
                        )

                }
            );


        const datos =
            await leerRespuestaJSON(
                respuesta
            );


        if (!respuesta.ok) {

            throw new Error(
                obtenerMensajeError(
                    datos,
                    "No se pudo preparar el artículo."
                )
            );

        }


        articuloGenerado =
            datos;


        if (
            !articuloGenerado ||
            typeof articuloGenerado !==
            "object"
        ) {

            throw new Error(
                "El servidor no devolvió un artículo válido."
            );

        }


        mostrarArticuloGenerado(
            articuloGenerado
        );


    } catch (error) {

        console.error(
            "❌ Error preparando artículo:",
            error
        );


        if (resultado) {

            resultado.innerHTML = `
                <div class="ai-error">

                    <strong>
                        ❌ No se pudo preparar el artículo.
                    </strong>

                    <p>
                        ${escaparHTML(
                            error.message ||
                            "Error desconocido."
                        )}
                    </p>

                </div>
            `;

        }

    }

}


// =====================================================
// MOSTRAR ARTÍCULO
// =====================================================

function mostrarArticuloGenerado(
    articulo
) {

    if (!resultado) {
        return;
    }


    resultado.innerHTML = `
        <div class="vista-previa-articulo">

            <span class="etiqueta">
                🤖 BORRADOR TEOS AI
            </span>

            <h2>
                ${escaparHTML(
                    articulo.titulo ||
                    "Sin título"
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
                            articulo.titulo ||
                            "Imagen del artículo"
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
                    articulo.introduccion ||
                    ""
                )}
            </p>

            <h3>
                Desarrollo
            </h3>

            <p>
                ${escaparHTML(
                    articulo.contenido ||
                    ""
                )}
            </p>

            <h3>
                Conclusión
            </h3>

            <p>
                ${escaparHTML(
                    articulo.conclusion ||
                    ""
                )}
            </p>

            <h3>
                Fuente
            </h3>

            <p>
                📰
                ${escaparHTML(
                    articulo.fuente ||
                    "Fuente desconocida"
                )}
            </p>

            ${
                articulo.enlace
                ?
                `
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
                `
                :
                ""
            }

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


    const botonVolver =
        document.getElementById(
            "volverNoticias"
        );


    if (botonVolver) {

        botonVolver.addEventListener(
            "click",
            function () {

                mostrarNoticias(
                    noticiasEncontradas
                );

            }
        );

    }


    const botonPublicar =
        document.getElementById(
            "publicarArticulo"
        );


    if (botonPublicar) {

        botonPublicar.addEventListener(
            "click",
            publicarArticulo
        );

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


    if (!articuloGenerado) {

        alert(
            "No hay un artículo preparado para publicar."
        );

        return;

    }


    boton.disabled =
        true;

    boton.textContent =
        "⏳ Publicando...";


    try {

        const respuesta =
            await fetch(
                "/api/publicar-articulo",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            articuloGenerado
                        )

                }
            );


        const datos =
            await leerRespuestaJSON(
                respuesta
            );


        if (!respuesta.ok) {

            throw new Error(
                obtenerMensajeError(
                    datos,
                    "No se pudo publicar el artículo."
                )
            );

        }


        if (resultado) {

            resultado.innerHTML = `

                <div class="ai-exito">

                    <h2>
                        ✅ ¡Noticia publicada!
                    </h2>

                    <p>
                        ${escaparHTML(
                            datos.mensaje ||
                            "La noticia fue publicada correctamente."
                        )}
                    </p>

                    ${
                        datos.archivo
                        ?
                        `
                        <p>
                            📄 Archivo:
                            <strong>
                                ${escaparHTML(
                                    datos.archivo
                                )}
                            </strong>
                        </p>
                        `
                        :
                        ""
                    }

                    ${
                        datos.ruta
                        ?
                        `
                        <p>
                            📁 Ubicación:
                            <strong>
                                ${escaparHTML(
                                    datos.ruta
                                )}
                            </strong>
                        </p>
                        `
                        :
                        ""
                    }

                    <button
                        id="volverNoticias"
                        class="boton-preparar"
                    >
                        ← Volver a noticias
                    </button>

                </div>

            `;

        }


        const botonVolver =
            document.getElementById(
                "volverNoticias"
            );


        if (botonVolver) {

            botonVolver.addEventListener(
                "click",
                function () {

                    mostrarNoticias(
                        noticiasEncontradas
                    );

                }
            );

        }


    } catch (error) {

        console.error(
            "❌ Error publicando artículo:",
            error
        );


        boton.disabled =
            false;

        boton.textContent =
            "🚀 Publicar";


        alert(
            "❌ " +
            (
                error.message ||
                "No se pudo publicar."
            )
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

let rankingsGenerados =
    null;


// =====================================================
// EVENTO PREPARAR RANKINGS
// =====================================================

if (
    botonPrepararRankings
) {

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
            "⏳ Iniciando TEOS AI...";

    }


    resultadoRankings.innerHTML =
        `

        <div class="ai-cargando">

            <strong>
                🤖 TEOS AI
            </strong>

            <p>
                🏆 Iniciando la actualización de los 10 rankings...
            </p>

            <p>
                No cierres esta página.
            </p>

        </div>

        `;


    try {

        // =================================================
        // INICIAR PROCESO
        // =================================================

        const respuestaInicio =
            await fetch(
                "/api/preparar-rankings",
                {

                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({})
                }
            );


        const datosInicio =
            await leerRespuestaJSON(
                respuestaInicio
            );


        if (
            !respuestaInicio.ok
        ) {

            throw new Error(
                obtenerMensajeError(
                    datosInicio,
                    "No se pudo iniciar la preparación de rankings."
                )
            );

        }


        // =================================================
        // COMENZAR A CONSULTAR EL ESTADO
        // =================================================

        await esperarRankings();


    } catch (error) {

        console.error(
            "❌ Error iniciando rankings:",
            error
        );


        mostrarErrorRankings(
            error.message ||
            "No se pudieron preparar los rankings."
        );


        if (botonPrepararRankings) {

            botonPrepararRankings.disabled =
                false;

            botonPrepararRankings.textContent =
                "🤖 Preparar los 10 rankings";

        }

    }

}


// =====================================================
// ESPERAR ESTADO DE RANKINGS
// =====================================================

async function esperarRankings() {

    const maximoIntentos =
        180;

    const intervalo =
        3000;


    for (
        let intento = 0;
        intento < maximoIntentos;
        intento++
    ) {

        await esperar(
            intervalo
        );


        let respuesta;


        try {

            respuesta =
                await fetch(
                    "/api/estado-rankings",
                    {
                        method:
                            "GET",
                        cache:
                            "no-store"
                    }
                );

        } catch (error) {

            console.error(
                "❌ Error consultando estado:",
                error
            );


            throw new Error(
                "Se perdió la conexión con TEOS AI mientras se preparaban los rankings."
            );

        }


        const datos =
            await leerRespuestaJSON(
                respuesta
            );


        if (!respuesta.ok) {

            throw new Error(
                obtenerMensajeError(
                    datos,
                    "No se pudo consultar el estado de los rankings."
                )
            );

        }


        // =================================================
        // GENERANDO
        // =================================================

        if (
            datos.estado ===
            "generando"
        ) {

            if (
                resultadoRankings
            ) {

                resultadoRankings.innerHTML =
                    `

                    <div class="ai-cargando">

                        <strong>
                            🤖 TEOS AI
                        </strong>

                        <p>
                            🏆 Generando los 10 rankings...
                        </p>

                        <p>
                            Gemini está preparando el contenido.
                        </p>

                        <p>
                            ⏳ Intento ${
                                intento + 1
                            } de ${
                                maximoIntentos
                            }
                        </p>

                    </div>

                    `;

            }

            continue;

        }


        // =================================================
        // COMPLETADO
        // =================================================

        if (
            datos.estado ===
            "completado"
        ) {

            if (
                !datos.rankings ||
                !Array.isArray(
                    datos.rankings
                )
            ) {

                throw new Error(
                    "TEOS AI terminó la generación, pero no devolvió los rankings."
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


            return;

        }


        // =================================================
        // ERROR
        // =================================================

        if (
            datos.estado ===
            "error"
        ) {

            throw new Error(
                datos.error ||
                "TEOS AI no pudo preparar los rankings."
            );

        }


        // =================================================
        // INICIANDO
        // =================================================

        if (
            datos.estado ===
            "idle"
        ) {

            if (
                resultadoRankings
            ) {

                resultadoRankings.innerHTML =
                    `

                    <div class="ai-cargando">

                        <strong>
                            🤖 TEOS AI
                        </strong>

                        <p>
                            🏆 Preparando el proceso...
                        </p>

                    </div>

                    `;

            }

        }

    }


    throw new Error(
        "TEOS AI tardó demasiado en preparar los rankings."
    );

}


// =====================================================
// ESPERAR
// =====================================================

function esperar(
    milisegundos
) {

    return new Promise(
        function(resolve) {

            setTimeout(
                resolve,
                milisegundos
            );

        }
    );

}


// =====================================================
// ERROR DE RANKINGS
// =====================================================

function mostrarErrorRankings(
    mensaje
) {

    if (!resultadoRankings) {
        return;
    }


    resultadoRankings.innerHTML =
        `

        <div class="ai-error">

            <strong>
                ❌ No se pudieron preparar los rankings.
            </strong>

            <p>
                ${escaparHTML(
                    mensaje
                )}
            </p>

        </div>

        `;

}


// =====================================================
// MOSTRAR LOS 10 RANKINGS
// =====================================================

function mostrarRankings(
    rankings
) {

    if (!resultadoRankings) {
        return;
    }


    let html =
        `

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
        function (
            ranking,
            indice
        ) {

            html +=
                `

                <article class="ranking-ai">

                    <h2>
                        🏆 Ranking
                        ${indice + 1}
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
                    function (
                        juego
                    ) {

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


                        html +=
                            `

                            <div class="juego-ranking-ai">

                                <strong>

                                    ${emoji}
                                    #${escaparHTML(
                                        juego.puesto
                                    )}
                                    —
                                    ${escaparHTML(
                                        juego.nombre ||
                                        "Sin nombre"
                                    )}

                                </strong>

                                <span>

                                    ⭐
                                    ${escaparHTML(
                                        juego.puntuacion ||
                                        ""
                                    )}

                                </span>

                                <p>

                                    ${escaparHTML(
                                        juego.descripcion ||
                                        ""
                                    )}

                                </p>

                            </div>

                            `;

                    }
                );

            }


            html +=
                `

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


    html +=
        `

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


    if (
        botonRegenerar
    ) {

        botonRegenerar.addEventListener(
            "click",
            prepararRankings
        );

    }


    const botonPublicar =
        document.getElementById(
            "publicarRankings"
        );


    if (
        botonPublicar
    ) {

        botonPublicar.addEventListener(
            "click",
            publicarRankings
        );

    }


    if (
        botonPrepararRankings
    ) {

        botonPrepararRankings.disabled =
            false;

        botonPrepararRankings.textContent =
            "🤖 Preparar los 10 rankings";

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
            "⚠️ ¿Seguro que quieres publicar los 10 rankings?\n\n" +
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
                "/api/publicar-rankings",
                {

                    method:
                        "POST",

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
            await leerRespuestaJSON(
                respuesta
            );


        if (!respuesta.ok) {

            throw new Error(
                obtenerMensajeError(
                    datos,
                    "No se pudieron publicar los rankings."
                )
            );

        }


        resultadoRankings.innerHTML =
            `

            <div class="ai-exito">

                <h2>
                    🚀 ¡Rankings publicados!
                </h2>

                <p>
                    Los 10 rankings fueron actualizados correctamente.
                </p>

                <p>
                    TEOS AI actualizó:
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


        const botonVolver =
            document.getElementById(
                "volverRankings"
            );


        if (
            botonVolver
        ) {

            botonVolver.addEventListener(
                "click",
                function () {

                    resultadoRankings.innerHTML =
                        `

                        <p>
                            Pulsa el botón para que TEOS AI
                            prepare los 10 rankings.
                        </p>

                        `;

                }
            );

        }


    } catch (error) {

        console.error(
            "❌ Error publicando rankings:",
            error
        );


        if (boton) {

            boton.disabled =
                false;

            boton.textContent =
                "🚀 Publicar los 10 rankings";

        }


        resultadoRankings.innerHTML =
            `

            <div class="ai-error">

                <strong>
                    ❌ Error publicando los rankings.
                </strong>

                <p>
                    ${escaparHTML(
                        error.message ||
                        "No se pudieron publicar los rankings."
                    )}
                </p>

            </div>

            `;

    }

}