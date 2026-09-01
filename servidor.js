// =====================================================
// TEOS GAMING - SERVIDOR PRINCIPAL
// TEOS AI + NOTICIAS + RANKINGS
// =====================================================

const express = require("express");
const cors = require("cors");
const Parser = require("rss-parser");
const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

try {
    require("dotenv").config();
} catch (error) {
    // En Render las variables llegan directamente.
}


// =====================================================
// CONFIGURACIÓN
// =====================================================

const app = express();

const parser = new Parser({
    timeout: 15000,
    headers: {
        "User-Agent":
            "TEOS Gaming/1.0 RSS Reader"
    }
});

app.use(cors());

app.use(
    express.json({
        limit: "10mb"
    })
);

app.use(
    express.static(__dirname)
);

const PORT =
    process.env.PORT || 3000;


// =====================================================
// GEMINI
// =====================================================

const GEMINI_API_KEY =
    process.env.GEMINI_API_KEY || "";

const ai =
    GEMINI_API_KEY
        ? new GoogleGenAI({
            apiKey: GEMINI_API_KEY
        })
        : null;


// =====================================================
// ESTADO DE RANKINGS
// =====================================================

let estadoRankings = {
    estado: "idle",
    rankings: null,
    error: null,
    iniciado: null,
    terminado: null
};

let generandoRankings =
    false;


// =====================================================
// FUNCIÓN GEMINI
// =====================================================

async function generarConGemini(prompt) {

    if (
        !GEMINI_API_KEY ||
        !ai
    ) {

        throw new Error(
            "La variable GEMINI_API_KEY no está configurada."
        );

    }


    console.log(
        "🤖 Intentando Gemini: gemini-3.6-flash"
    );


    try {

        const respuesta =
            await ai.models.generateContent({

                model:
                    "gemini-3.6-flash",

                contents:
                    prompt,

                config: {
                    responseMimeType:
                        "application/json"
                }

            });


        const texto =
            respuesta.text;


        if (!texto) {

            throw new Error(
                "Gemini no devolvió contenido."
            );

        }


        console.log(
            "✅ Gemini respondió usando: gemini-3.6-flash"
        );


        return texto
            .trim()
            .replace(
                /^```json/i,
                ""
            )
            .replace(
                /^```/i,
                ""
            )
            .replace(
                /```$/i,
                ""
            )
            .trim();

    } catch (error) {

        console.error(
            "❌ Error con gemini-3.6-flash:",
            error.message ||
            error
        );

        throw error;

    }

}


// =====================================================
// FUENTES RSS
// =====================================================

const fuentes = [

    {
        nombre:
            "Game Informer",

        url:
            "https://gameinformer.com/rss.xml"
    },

    {
        nombre:
            "IGN",

        url:
            "https://www.ign.com/rss/v2/articles/feed"
    },

    {
        nombre:
            "Destructoid",

        url:
            "https://www.destructoid.com/feed/"
    }

];


// =====================================================
// OBTENER IMAGEN RSS
// =====================================================

function obtenerImagenRSS(item) {

    let imagen = "";


    if (
        item.enclosure &&
        item.enclosure.url
    ) {

        imagen =
            item.enclosure.url;

    }


    if (
        !imagen &&
        item["media:content"]
    ) {

        const media =
            item["media:content"];

        if (media.url) {

            imagen =
                media.url;

        }

    }


    if (
        !imagen &&
        item["media:thumbnail"]
    ) {

        const media =
            item["media:thumbnail"];

        if (media.url) {

            imagen =
                media.url;

        }

    }


    if (
        !imagen &&
        item.image
    ) {

        if (
            typeof item.image ===
            "string"
        ) {

            imagen =
                item.image;

        } else if (
            item.image.url
        ) {

            imagen =
                item.image.url;

        }

    }


    if (!imagen) {

        const contenido =
            item["content:encoded"] ||
            item.content ||
            item.description ||
            "";


        const coincidencia =
            contenido.match(
                /<img[^>]+src=["']([^"']+)["']/i
            );


        if (coincidencia) {

            imagen =
                coincidencia[1];

        }

    }


    return String(
        imagen || ""
    ).trim();

}


// =====================================================
// OBTENER FECHA RSS
// =====================================================

function obtenerFechaItem(item) {

    const fechas = [

        item.isoDate,
        item.pubDate,
        item.date,
        item.updated,
        item.published

    ];


    for (
        const valor
        of fechas
    ) {

        if (!valor) {
            continue;
        }


        const fecha =
            new Date(valor);


        if (
            !isNaN(
                fecha.getTime()
            )
        ) {

            return fecha;

        }

    }


    return null;

}


// =====================================================
// LIMPIAR TEXTO
// =====================================================

function limpiarTexto(texto) {

    if (!texto) {
        return "";
    }


    return String(texto)
        .replace(
            /<[^>]*>/g,
            " "
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


// =====================================================
// OBTENER NOTICIAS
// =====================================================

app.get(
    "/api/noticias",
    async function(req, res) {

        try {

            const resultados =
                [];

            const ahora =
                Date.now();


            const limite =
                ahora -
                (
                    48 *
                    60 *
                    60 *
                    1000
                );


            for (
                const fuente
                of fuentes
            ) {

                try {

                    console.log(
                        "🔎 Leyendo:",
                        fuente.nombre
                    );


                    const feed =
                        await parser.parseURL(
                            fuente.url
                        );


                    if (
                        !feed ||
                        !Array.isArray(
                            feed.items
                        )
                    ) {

                        continue;

                    }


                    feed.items.forEach(
                        function(item) {

                            const fecha =
                                obtenerFechaItem(
                                    item
                                );


                            if (!fecha) {
                                return;
                            }


                            const timestamp =
                                fecha.getTime();


                            if (
                                timestamp <
                                limite
                            ) {

                                return;

                            }


                            const titulo =
                                limpiarTexto(
                                    item.title ||
                                    "Sin título"
                                );


                            if (!titulo) {
                                return;
                            }


                            resultados.push({

                                titulo,

                                enlace:
                                    item.link ||
                                    item.guid ||
                                    "",

                                fecha:
                                    fecha.toISOString(),

                                fuente:
                                    fuente.nombre,

                                descripcion:
                                    limpiarTexto(
                                        item.contentSnippet ||
                                        item.description ||
                                        item.summary ||
                                        ""
                                    ),

                                imagen:
                                    obtenerImagenRSS(
                                        item
                                    )

                            });

                        }
                    );


                    console.log(
                        "✅ Feed leído:",
                        fuente.nombre,
                        feed.items.length
                    );


                } catch (error) {

                    console.error(
                        "❌ Error leyendo",
                        fuente.nombre,
                        ":",
                        error.message
                    );

                }

            }


            const vistos =
                new Set();

            const noticiasUnicas =
                [];


            for (
                const noticia
                of resultados
            ) {

                const clave =
                    noticia.titulo
                        .trim()
                        .toLowerCase();


                if (
                    !clave ||
                    vistos.has(clave)
                ) {

                    continue;

                }


                vistos.add(
                    clave
                );


                noticiasUnicas.push(
                    noticia
                );

            }


            noticiasUnicas.sort(
                function(a, b) {

                    return (
                        new Date(b.fecha) -
                        new Date(a.fecha)
                    );

                }
            );


            res.json(
                noticiasUnicas.slice(
                    0,
                    30
                )
            );


        } catch (error) {

            console.error(
                "❌ Error general de noticias:",
                error
            );


            res.status(
                500
            ).json({

                error:
                    "No se pudieron obtener las noticias."

            });

        }

    }
);


// =====================================================
// PREPARAR ARTÍCULO
// =====================================================

app.post(
    "/api/preparar-articulo",
    async function(req, res) {

        try {

            const noticia =
                req.body;


            if (
                !noticia ||
                !noticia.titulo
            ) {

                return res
                    .status(400)
                    .json({

                        error:
                            "No se recibió una noticia válida."

                    });

            }


            const titulo =
                noticia.titulo;

            const descripcion =
                noticia.descripcion ||
                "No hay descripción disponible.";

            const fuente =
                noticia.fuente ||
                "Fuente desconocida";

            const enlace =
                noticia.enlace ||
                "#";

            const imagen =
                noticia.imagen ||
                "";


            const prompt = `

Eres el redactor principal de TEOS Gaming,
un medio digital especializado en videojuegos.

Convierte la siguiente noticia en un artículo profesional
en español.

REGLAS:

- No inventes datos.
- No inventes fechas.
- No inventes declaraciones.
- No inventes nombres.
- Utiliza únicamente la información proporcionada.
- Escribe de forma natural y profesional.
- Mantén un tono interesante para jugadores.
- No menciones que eres una inteligencia artificial.
- No copies literalmente la descripción.
- No agregues información que no aparezca en los datos originales.

NOTICIA ORIGINAL:

Título:
${titulo}

Descripción:
${descripcion}

Fuente:
${fuente}

Enlace:
${enlace}

Devuelve ÚNICAMENTE JSON válido:

{
    "titulo": "Título",
    "introduccion": "Introducción",
    "contenido": "Desarrollo",
    "conclusion": "Conclusión",
    "imagenPrompt": "Descripción de imagen"
}

`;


            const texto =
                await generarConGemini(
                    prompt
                );


            let articuloIA;


            try {

                articuloIA =
                    JSON.parse(
                        texto
                    );

            } catch (error) {

                throw new Error(
                    "Gemini no devolvió un JSON válido."
                );

            }


            res.json({

                titulo:
                    articuloIA.titulo ||
                    titulo,

                introduccion:
                    articuloIA.introduccion ||
                    descripcion,

                contenido:
                    articuloIA.contenido ||
                    "",

                conclusion:
                    articuloIA.conclusion ||
                    "",

                imagen:
                    imagen,

                imagenPrompt:
                    articuloIA.imagenPrompt ||
                    `Imagen relacionada con: ${titulo}`,

                fuente:
                    fuente,

                enlace:
                    enlace,

                fecha:
                    noticia.fecha ||
                    new Date().toISOString()

            });


        } catch (error) {

            console.error(
                "❌ Error preparando artículo:",
                error
            );


            res.status(
                500
            ).json({

                error:
                    error.message ||
                    "No se pudo preparar el artículo."

            });

        }

    }
);


// =====================================================
// PUBLICAR ARTÍCULO
// =====================================================

app.post(
    "/api/publicar-articulo",
    function(req, res) {

        try {

            const articulo =
                req.body;


            if (
                !articulo ||
                !articulo.titulo
            ) {

                return res
                    .status(400)
                    .json({

                        error:
                            "El artículo no es válido."

                    });

            }


            const carpetaNoticias =
                path.join(
                    __dirname,
                    "noticias"
                );


            if (
                !fs.existsSync(
                    carpetaNoticias
                )
            ) {

                fs.mkdirSync(
                    carpetaNoticias,
                    {
                        recursive:
                            true
                    }
                );

            }


            let slug =
                String(
                    articulo.titulo
                )
                .toLowerCase()
                .normalize("NFD")
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                )
                .replace(
                    /[^a-z0-9]+/g,
                    "-"
                )
                .replace(
                    /^-+|-+$/g,
                    ""
                )
                .substring(
                    0,
                    80
                );


            if (!slug) {

                slug =
                    "noticia-teos";

            }


            let nombreArchivo =
                slug +
                ".html";


            let rutaArchivo =
                path.join(
                    carpetaNoticias,
                    nombreArchivo
                );


            let contador =
                2;


            while (
                fs.existsSync(
                    rutaArchivo
                )
            ) {

                nombreArchivo =
                    slug +
                    "-" +
                    contador +
                    ".html";

                rutaArchivo =
                    path.join(
                        carpetaNoticias,
                        nombreArchivo
                    );

                contador++;

            }


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


            const tituloHTML =
                escaparHTML(
                    articulo.titulo
                );


            const introduccionHTML =
                escaparHTML(
                    articulo.introduccion
                );


            const contenidoHTML =
                escaparHTML(
                    articulo.contenido
                );


            const conclusionHTML =
                escaparHTML(
                    articulo.conclusion
                );


            const fuenteHTML =
                escaparHTML(
                    articulo.fuente ||
                    "Fuente original"
                );


            const fechaHTML =
                escaparHTML(
                    articulo.fecha ||
                    new Date().toISOString()
                );


            const enlaceHTML =
                escaparHTML(
                    articulo.enlace ||
                    "#"
                );


            let imagenHTML =
                "";


            if (
                articulo.imagen
            ) {

                imagenHTML = `

                    <div class="imagen-articulo-contenedor">

                        <img
                            src="${articulo.imagen}"
                            alt="${tituloHTML}"
                            class="imagen-articulo"
                            loading="lazy"
                        >

                    </div>

                `;

            }


            const html = `<!DOCTYPE html>

<html lang="es">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>
    ${tituloHTML} | TEOS Gaming
</title>

<meta
    name="description"
    content="${introduccionHTML}"
>

<link
    rel="stylesheet"
    href="../estilo.css"
>

</head>

<body>

<header class="encabezado">

    <div class="logo">
        🎮 TEOS <span>GAMING</span>
    </div>

    <nav class="menu">

        <a href="../index.html">Inicio</a>
        <a href="../noticias.html">Noticias</a>
        <a href="../lanzamientos.html">Lanzamientos</a>
        <a href="../guias.html">Guías</a>
        <a href="../rankings.html">Rankings</a>
        <a href="../pc.html">PC</a>
        <a href="../android.html">Android</a>

    </nav>

</header>

<main>

    <article class="articulo">

        ${imagenHTML}

        <div class="articulo-cabecera">

            <span class="etiqueta">
                🎮 NOTICIAS
            </span>

            <h1>
                ${tituloHTML}
            </h1>

            <p class="articulo-fecha">
                📅 ${fechaHTML}
                · Por TEOS Gaming
            </p>

        </div>

        <div class="articulo-contenido">

            <h2>Introducción</h2>

            <p>
                ${introduccionHTML}
            </p>

            <h2>Desarrollo</h2>

            <p>
                ${contenidoHTML}
            </p>

            <h2>Conclusión</h2>

            <p>
                ${conclusionHTML}
            </p>

            <div class="fuentes">

                <h2>Fuente</h2>

                <p>
                    📰 ${fuenteHTML}
                </p>

                <p>

                    <a
                        href="${enlaceHTML}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🔗 Ver fuente original
                    </a>

                </p>

            </div>

            <div class="volver">

                <a href="../noticias.html">
                    ← Volver a Noticias
                </a>

            </div>

        </div>

    </article>

</main>

<footer class="footer">

    <div class="footer-bottom">

        <p>
            © 2026 TEOS Gaming.
            Todos los derechos reservados.
        </p>

    </div>

</footer>

</body>

</html>`;


            fs.writeFileSync(
                rutaArchivo,
                html,
                "utf8"
            );


            console.log(
                "✅ NOTICIA PUBLICADA:",
                nombreArchivo
            );


            res.json({

                ok:
                    true,

                mensaje:
                    "🚀 Noticia publicada correctamente.",

                archivo:
                    nombreArchivo,

                ruta:
                    "noticias/" +
                    nombreArchivo,

                imagen:
                    articulo.imagen ||
                    ""

            });


        } catch (error) {

            console.error(
                "❌ Error publicando artículo:",
                error
            );


            res.status(
                500
            ).json({

                error:
                    error.message ||
                    "No se pudo publicar la noticia."

            });

        }

    }
);


// =====================================================
// OBTENER NOTICIAS PUBLICADAS
// =====================================================

app.get(
    "/api/noticias-publicadas",
    function(req, res) {

        try {

            const carpetaNoticias =
                path.join(
                    __dirname,
                    "noticias"
                );


            if (
                !fs.existsSync(
                    carpetaNoticias
                )
            ) {

                return res.json(
                    []
                );

            }


            const archivos =
                fs.readdirSync(
                    carpetaNoticias
                )
                .filter(
                    archivo =>
                        archivo.endsWith(
                            ".html"
                        )
                );


            const noticias =
                archivos.map(
                    function(archivo) {

                        const ruta =
                            path.join(
                                carpetaNoticias,
                                archivo
                            );


                        const contenido =
                            fs.readFileSync(
                                ruta,
                                "utf8"
                            );


                        const tituloMatch =
                            contenido.match(
                                /<h1[^>]*>([\s\S]*?)<\/h1>/i
                            );


                        const fechaMatch =
                            contenido.match(
                                /class=["']articulo-fecha["'][^>]*>([\s\S]*?)<\/p>/i
                            );


                        const imagenMatch =
                            contenido.match(
                                /<img[^>]+src=["']([^"']+)["'][^>]*>/i
                            );


                        let titulo =
                            tituloMatch
                                ? tituloMatch[1]
                                : archivo.replace(
                                    ".html",
                                    ""
                                );


                        let fecha =
                            fechaMatch
                                ? fechaMatch[1]
                                : "";


                        let imagen =
                            imagenMatch
                                ? imagenMatch[1]
                                : "";


                        titulo =
                            titulo
                                .replace(
                                    /<[^>]+>/g,
                                    ""
                                )
                                .trim();


                        fecha =
                            fecha
                                .replace(
                                    /<[^>]+>/g,
                                    ""
                                )
                                .trim();


                        return {

                            titulo,

                            fecha,

                            imagen,

                            archivo,

                            enlace:
                                "noticias/" +
                                archivo

                        };

                    }
                );


            noticias.sort(
                function(a, b) {

                    return (
                        convertirFechaPublicada(
                            b.fecha
                        ) -
                        convertirFechaPublicada(
                            a.fecha
                        )
                    );

                }
            );


            res.json(
                noticias
            );


        } catch (error) {

            console.error(
                "❌ Error obteniendo noticias publicadas:",
                error
            );


            res.status(
                500
            ).json({

                error:
                    "No se pudieron obtener las noticias publicadas."

            });

        }

    }
);


// =====================================================
// CONVERTIR FECHA PUBLICADA
// =====================================================

function convertirFechaPublicada(
    fecha
) {

    if (!fecha) {
        return 0;
    }


    const texto =
        String(fecha)
            .replace(
                /📅/g,
                ""
            )
            .trim();


    const directa =
        new Date(
            texto
        );


    if (
        !isNaN(
            directa.getTime()
        )
    ) {

        return directa.getTime();

    }


    const corto =
        texto.match(
            /(\d{1,2})\/(\d{1,2})\/(\d{4})/
        );


    if (corto) {

        return new Date(
            parseInt(
                corto[3],
                10
            ),
            parseInt(
                corto[2],
                10
            ) - 1,
            parseInt(
                corto[1],
                10
            )
        ).getTime();

    }


    return 0;

}


// =====================================================
// TEMAS DE RANKINGS
// =====================================================

const temasRankings = [

    {
        numero: 1,
        titulo:
            "Top 10 mejores videojuegos de aventura"
    },

    {
        numero: 2,
        titulo:
            "Top 10 mejores juegos RPG"
    },

    {
        numero: 3,
        titulo:
            "Top 10 mejores juegos para jugar con amigos"
    },

    {
        numero: 4,
        titulo:
            "Top 10 mejores juegos gratuitos para PC"
    },

    {
        numero: 5,
        titulo:
            "Top 10 mejores juegos de acción"
    },

    {
        numero: 6,
        titulo:
            "Top 10 mejores juegos de mundo abierto"
    },

    {
        numero: 7,
        titulo:
            "Top 10 mejores juegos multijugador"
    },

    {
        numero: 8,
        titulo:
            "Top 10 mejores juegos de terror"
    },

    {
        numero: 9,
        titulo:
            "Top 10 mejores juegos de supervivencia"
    },

    {
        numero: 10,
        titulo:
            "Top 10 mejores juegos para PC"
    }

];


// =====================================================
// GENERAR RANKINGS EN SEGUNDO PLANO
// =====================================================

async function generarRankingsEnSegundoPlano() {

    if (generandoRankings) {
        return;
    }

    generandoRankings = true;

    estadoRankings = {
        estado: "generando",
        rankings: null,
        error: null,
        iniciado: new Date().toISOString(),
        terminado: null
    };

    try {

        console.log(
            "🏆 TEOS AI está preparando los 10 rankings..."
        );

        const criteriosRankings = [

            {
                numero: 1,
                titulo:
                    "Top 10 mejores videojuegos de aventura",
                criterio:
                    "SOLO videojuegos cuyo enfoque principal sea la aventura, exploración y experiencia narrativa. No incluir deportes, carreras ni shooters competitivos como categoría principal."
            },

            {
                numero: 2,
                titulo:
                    "Top 10 mejores juegos RPG",
                criterio:
                    "SOLO videojuegos RPG o con elementos RPG claramente centrales. No incluir juegos puramente deportivos, carreras o shooters competitivos sin componentes RPG relevantes."
            },

            {
                numero: 3,
                titulo:
                    "Top 10 mejores juegos para jugar con amigos",
                criterio:
                    "SOLO videojuegos especialmente adecuados para jugar con amigos mediante cooperativo, multijugador local, multijugador online o experiencias sociales. No seleccionar simplemente juegos populares sin una buena razón para jugar con amigos."
            },

            {
                numero: 4,
                titulo:
                    "Top 10 mejores juegos gratuitos para PC",
                criterio:
                    "SOLO videojuegos gratuitos para PC. No incluir juegos de pago. Deben poder jugarse gratuitamente en PC como producto principal."
            },

            {
                numero: 5,
                titulo:
                    "Top 10 mejores juegos de acción",
                criterio:
                    "SOLO videojuegos donde la acción sea uno de sus elementos principales. Se permiten subgéneros de acción, pero deben tener combate o acción como componente central."
            },

            {
                numero: 6,
                titulo:
                    "Top 10 mejores juegos de mundo abierto",
                criterio:
                    "SOLO videojuegos con mundo abierto o grandes entornos abiertos donde el jugador pueda explorar libremente. No incluir juegos lineales como categoría principal."
            },

            {
                numero: 7,
                titulo:
                    "Top 10 mejores juegos multijugador",
                criterio:
                    "SOLO videojuegos cuyo multijugador sea una característica importante y real del juego. No incluir juegos exclusivamente para un jugador."
            },

            {
                numero: 8,
                titulo:
                    "Top 10 mejores juegos de terror",
                criterio:
                    "SOLO videojuegos de terror, horror, survival horror o experiencias claramente centradas en provocar miedo, tensión o terror. PROHIBIDO incluir juegos de deportes, carreras, estrategia o shooters competitivos que no sean de terror. Counter-Strike 2, Valorant, FIFA, EA Sports FC y juegos similares NO pertenecen a esta categoría."
            },

            {
                numero: 9,
                titulo:
                    "Top 10 mejores juegos de supervivencia",
                criterio:
                    "SOLO videojuegos de supervivencia donde sobrevivir, gestionar recursos, construir, explorar o resistir amenazas sea una parte central de la experiencia."
            },

            {
                numero: 10,
                titulo:
                    "Top 10 mejores juegos para PC",
                criterio:
                    "SOLO videojuegos relevantes para jugar en PC. Prioriza juegos destacados de PC y no mezcles categorías sin relación editorial. Deben ser videojuegos reales y reconocidos."
            }

        ];


        const listaTemas =
            criteriosRankings
                .map(
                    ranking =>
                        `${ranking.numero}. ${ranking.titulo}
CRITERIO:
${ranking.criterio}`
                )
                .join("\n\n");


        const prompt = `

Eres el editor principal de TEOS Gaming,
un medio digital especializado en videojuegos.

Debes crear y actualizar EXACTAMENTE 10 rankings.

MUY IMPORTANTE:

Cada ranking tiene una categoría diferente.

NO debes intercambiar juegos entre categorías.

NO debes colocar un juego solamente porque sea famoso.

Cada juego debe pertenecer CLARAMENTE a la categoría del ranking
en el que aparece.

Si un juego no cumple claramente la categoría,
NO lo incluyas.

Estos son los 10 rankings:

${listaTemas}

REGLAS GENERALES:

- Debes devolver exactamente 10 rankings.
- Los números deben ser del 1 al 10.
- Cada ranking debe tener exactamente 10 juegos.
- Cada ranking debe tener puestos del 1 al 10.
- No repitas innecesariamente juegos dentro del mismo ranking.
- Todos los videojuegos deben existir realmente.
- No inventes videojuegos.
- No inventes estudios.
- No inventes desarrolladores.
- No inventes fechas.
- No inventes declaraciones.
- Escribe todo en español.
- Utiliza un tono editorial profesional.
- Las puntuaciones deben ser sobre 10.
- La descripción de cada juego debe explicar por qué encaja en esa categoría.
- Si tienes dudas sobre si un videojuego pertenece a una categoría, NO lo uses.

REGLA CRÍTICA DE CATEGORÍAS:

Un juego puede ser popular y aun así estar PROHIBIDO si no pertenece a la categoría.

Ejemplo:

"Top 10 mejores juegos de terror"

NO puede contener:
- Counter-Strike 2
- Valorant
- FIFA
- EA Sports FC
- Rocket League
- Gran Turismo
- Call of Duty por el simple hecho de ser un shooter
- cualquier juego que no sea claramente de terror

Para "juegos de terror", selecciona exclusivamente
juegos de horror, survival horror o terror claramente reconocibles.

Para "RPG", selecciona exclusivamente RPG o juegos
con componentes RPG centrales.

Para "mundo abierto", selecciona exclusivamente
juegos con mundo abierto o grandes entornos abiertos.

Para "supervivencia", selecciona exclusivamente
juegos donde la supervivencia sea una mecánica central.

Para "gratuitos para PC", selecciona exclusivamente
juegos que puedan jugarse gratuitamente en PC.

FORMATO OBLIGATORIO:

{
    "rankings": [
        {
            "numero": 1,
            "titulo": "Top 10 mejores videojuegos de aventura",
            "introduccion": "Introducción del ranking",
            "juegos": [
                {
                    "puesto": 1,
                    "nombre": "Nombre del videojuego",
                    "puntuacion": "9.8/10",
                    "descripcion": "Explicación breve de por qué este juego pertenece a esta categoría"
                }
            ],
            "comoSeElaboro": "Explicación del criterio utilizado",
            "conclusion": "Conclusión del ranking"
        }
    ]
}

Debe haber EXACTAMENTE 10 objetos en "rankings".

Cada ranking debe tener EXACTAMENTE 10 juegos.

No agregues información fuera del JSON.
No agregues Markdown.
No agregues bloques de código.
`;


        const texto =
            await generarConGemini(
                prompt
            );


        let datos;


        try {

            datos =
                JSON.parse(
                    texto
                );

        } catch (error) {

            throw new Error(
                "Gemini no devolvió un JSON válido para los rankings."
            );

        }


        if (
            !datos.rankings ||
            !Array.isArray(
                datos.rankings
            )
        ) {

            throw new Error(
                "La respuesta no contiene los rankings."
            );

        }


        if (
            datos.rankings.length !== 10
        ) {

            throw new Error(
                "Gemini no generó exactamente 10 rankings."
            );

        }


        // =================================================
        // VALIDACIÓN DE ESTRUCTURA
        // =================================================

        for (
            let i = 0;
            i < datos.rankings.length;
            i++
        ) {

            const ranking =
                datos.rankings[i];


            ranking.numero =
                i + 1;


            ranking.titulo =
                criteriosRankings[i].titulo;


            if (
                !ranking.juegos ||
                !Array.isArray(
                    ranking.juegos
                )
            ) {

                throw new Error(
                    "El ranking " +
                    (i + 1) +
                    " no contiene juegos."
                );

            }


            if (
                ranking.juegos.length !== 10
            ) {

                throw new Error(
                    "El ranking " +
                    (i + 1) +
                    " no contiene exactamente 10 juegos."
                );

            }


            // =================================================
            // VALIDAR LOS 10 PUESTOS
            // =================================================

            for (
                let j = 0;
                j < ranking.juegos.length;
                j++
            ) {

                const juego =
                    ranking.juegos[j];


                juego.puesto =
                    j + 1;


                if (
                    !juego.nombre
                ) {

                    throw new Error(
                        "Falta el nombre del juego " +
                        (j + 1) +
                        " del ranking " +
                        (i + 1)
                    );

                }


                if (
                    !juego.puntuacion
                ) {

                    throw new Error(
                        "Falta la puntuación del juego " +
                        juego.nombre
                    );

                }


                if (
                    !juego.descripcion
                ) {

                    throw new Error(
                        "Falta la descripción del juego " +
                        juego.nombre
                    );

                }

            }

        }


        // =================================================
        // VALIDACIONES ESPECIALES
        // =================================================

        const prohibidosTerror = [

            "counter-strike",
            "counter strike",
            "valorant",
            "fifa",
            "ea sports fc",
            "rocket league",
            "gran turismo",
            "football manager",
            "nba 2k",
            "madden",

        ];


        const rankingTerror =
            datos.rankings[7];


        if (
            rankingTerror &&
            Array.isArray(
                rankingTerror.juegos
            )
        ) {

            for (
                const juego
                of rankingTerror.juegos
            ) {

                const nombre =
                    String(
                        juego.nombre ||
                        ""
                    )
                    .toLowerCase()
                    .trim();


                for (
                    const prohibido
                    of prohibidosTerror
                ) {

                    if (
                        nombre.includes(
                            prohibido
                        )
                    ) {

                        throw new Error(
                            "El ranking de terror contiene un juego incompatible con la categoría: " +
                            juego.nombre
                        );

                    }

                }

            }

        }


        // =================================================
        // VALIDAR RANKING GRATUITOS PARA PC
        // =================================================

        const rankingGratis =
            datos.rankings[3];


        if (
            rankingGratis &&
            Array.isArray(
                rankingGratis.juegos
            )
        ) {

            const nombresGratis =
                rankingGratis.juegos
                    .map(
                        juego =>
                            String(
                                juego.nombre ||
                                ""
                            )
                            .toLowerCase()
                    );


            // Evitar títulos claramente conocidos
            // por ser juegos de pago en su versión principal.
            const claramentePagos = [

                "elden ring",
                "red dead redemption 2",
                "grand theft auto v",
                "the witcher 3",
                "cyberpunk 2077",
                "baldur's gate 3",
                "baldurs gate 3",
                "hogwarts legacy",
                "resident evil 4",
                "black myth wukong"

            ];


            for (
                const nombre
                of nombresGratis
            ) {

                for (
                    const pago
                    of claramentePagos
                ) {

                    if (
                        nombre.includes(
                            pago
                        )
                    ) {

                        throw new Error(
                            "El ranking de juegos gratuitos para PC contiene un título que no cumple la categoría: " +
                            nombre
                        );

                    }

                }

            }

        }


        estadoRankings = {

            estado:
                "completado",

            rankings:
                datos.rankings,

            error:
                null,

            iniciado:
                estadoRankings.iniciado,

            terminado:
                new Date().toISOString()

        };


        console.log(
            "✅ Los 10 rankings fueron preparados y validados correctamente."
        );


    } catch (error) {

        console.error(
            "❌ Error preparando rankings:",
            error
        );


        estadoRankings = {

            estado:
                "error",

            rankings:
                null,

            error:
                error.message ||
                "No se pudieron preparar los rankings.",

            iniciado:
                estadoRankings.iniciado,

            terminado:
                new Date().toISOString()

        };

    } finally {

        generandoRankings =
            false;

    }

}


// =====================================================
// INICIAR PREPARACIÓN DE RANKINGS
// =====================================================

app.post(
    "/api/preparar-rankings",
    function(req, res) {

        if (
            generandoRankings
        ) {

            return res.json({

                ok:
                    true,

                estado:
                    "generando",

                mensaje:
                    "TEOS AI ya está preparando los rankings."

            });

        }


        generarRankingsEnSegundoPlano();


        res.json({

            ok:
                true,

            estado:
                "iniciando",

            mensaje:
                "🏆 TEOS AI comenzó a preparar los 10 rankings."

        });

    }
);


// =====================================================
// CONSULTAR ESTADO DE RANKINGS
// =====================================================

app.get(
    "/api/estado-rankings",
    function(req, res) {

        res.json({

            ok:
                true,

            estado:
                estadoRankings.estado,

            rankings:
                estadoRankings.rankings,

            error:
                estadoRankings.error,

            iniciado:
                estadoRankings.iniciado,

            terminado:
                estadoRankings.terminado

        });

    }
);


// =====================================================
// ESCAPAR HTML PARA RANKINGS
// =====================================================

function escaparHTMLRanking(
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
// CREAR CONTENIDO RANKING
// =====================================================

function crearContenidoRanking(
    ranking
) {

    let html =
        "";


    html += `

        <h2>
            Introducción
        </h2>

        <p>
            ${escaparHTMLRanking(
                ranking.introduccion
            )}
        </p>

    `;


    ranking.juegos.forEach(
        function(juego) {

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

                <h2>

                    ${emoji}
                    #${juego.puesto}
                    —
                    ${escaparHTMLRanking(
                        juego.nombre
                    )}

                </h2>

                <p>

                    <strong>
                        ⭐
                        ${escaparHTMLRanking(
                            juego.puntuacion
                        )}
                    </strong>

                </p>

                <p>

                    ${escaparHTMLRanking(
                        juego.descripcion
                    )}

                </p>

            `;

        }
    );


    html += `

        <h2>
            📊 ¿Cómo elaboramos este ranking?
        </h2>

        <p>
            ${escaparHTMLRanking(
                ranking.comoSeElaboro
            )}
        </p>

        <h2>
            Conclusión
        </h2>

        <p>
            ${escaparHTMLRanking(
                ranking.conclusion
            )}
        </p>

        <div class="volver">

            <a href="../rankings.html">
                ← Volver a Rankings
            </a>

        </div>

    `;


    return html;

}


// =====================================================
// ACTUALIZAR ARCHIVO DE RANKING
// =====================================================

function actualizarArchivoRanking(
    numero,
    ranking
) {

    const carpetaRankings =
        path.join(
            __dirname,
            "rankings"
        );


    const nombreArchivo =
        "ranking" +
        numero +
        ".html";


    const rutaArchivo =
        path.join(
            carpetaRankings,
            nombreArchivo
        );


    if (
        !fs.existsSync(
            rutaArchivo
        )
    ) {

        throw new Error(
            "No existe el archivo: rankings/" +
            nombreArchivo
        );

    }


    let html =
        fs.readFileSync(
            rutaArchivo,
            "utf8"
        );


    const regexContenedor =
        /<div\s+class=["']ranking-contenido["'][^>]*>[\s\S]*?<\/div>\s*<\/article>/i;


    const coincidencia =
        html.match(
            regexContenedor
        );


    if (!coincidencia) {

        throw new Error(
            "No se encontró correctamente el contenedor ranking-contenido en " +
            nombreArchivo
        );

    }


    const nuevoContenido =
        crearContenidoRanking(
            ranking
        );


    const nuevoBloque = `

        <div
            class="ranking-contenido"
            id="contenidoRanking"
        >

            ${nuevoContenido}

        </div>

    </article>`;


    html =
        html.replace(
            regexContenedor,
            nuevoBloque
        );


    const tituloNuevo =
        escaparHTMLRanking(
            ranking.titulo
        );


    html =
        html.replace(
            /<title>[\s\S]*?<\/title>/i,
            `<title>${tituloNuevo} | TEOS Gaming</title>`
        );


    html =
        html.replace(
            /<h1>[\s\S]*?<\/h1>/i,
            `<h1>${tituloNuevo}</h1>`
        );


    const fechaActual =
        new Date()
            .toLocaleDateString(
                "es-ES",
                {
                    day:
                        "numeric",
                    month:
                        "long",
                    year:
                        "numeric"
                }
            );


    html =
        html.replace(
            /<p\s+class=["']ranking-fecha["'][^>]*>[\s\S]*?<\/p>/i,
            `<p class="ranking-fecha">
                📅 ${fechaActual}
                · Por TEOS Gaming
            </p>`
        );


    fs.writeFileSync(
        rutaArchivo,
        html,
        "utf8"
    );


    console.log(
        "✅ Actualizado:",
        "rankings/" +
        nombreArchivo
    );


    return nombreArchivo;

}


// =====================================================
// PUBLICAR RANKINGS
// =====================================================

app.post(
    "/api/publicar-rankings",
    function(req, res) {

        try {

            const rankings =
                req.body.rankings;


            if (
                !Array.isArray(
                    rankings
                )
            ) {

                return res
                    .status(400)
                    .json({

                        error:
                            "No se recibieron los rankings."

                    });

            }


            if (
                rankings.length !== 10
            ) {

                return res
                    .status(400)
                    .json({

                        error:
                            "Debes enviar exactamente 10 rankings."

                    });

            }


            const archivos =
                [];


            for (
                let i = 0;
                i < 10;
                i++
            ) {

                const ranking =
                    rankings[i];


                if (
                    !ranking ||
                    !Array.isArray(
                        ranking.juegos
                    ) ||
                    ranking.juegos.length !== 10
                ) {

                    throw new Error(
                        "El ranking " +
                        (
                            i + 1
                        ) +
                        " no es válido."
                    );

                }


                ranking.numero =
                    i + 1;


                ranking.titulo =
                    temasRankings[i].titulo;


                archivos.push(
                    actualizarArchivoRanking(
                        i + 1,
                        ranking
                    )
                );

            }


            res.json({

                ok:
                    true,

                mensaje:
                    "🚀 Los 10 rankings fueron actualizados correctamente.",

                archivos

            });


        } catch (error) {

            console.error(
                "❌ Error publicando rankings:",
                error
            );


            res.status(
                500
            ).json({

                error:
                    error.message ||
                    "No se pudieron publicar los rankings."

            });

        }

    }
);


// =====================================================
// ESTADO DEL SERVIDOR
// =====================================================

app.get(
    "/api/estado",
    function(req, res) {

        res.json({

            ok:
                true,

            mensaje:
                "🤖 TEOS AI está funcionando correctamente.",

            servidor:
                "TEOS Gaming",

            puerto:
                PORT,

            gemini:
                Boolean(
                    GEMINI_API_KEY
                ),

            rankings:
                10,

            estadoRankings:
                estadoRankings.estado

        });

    }
);


// =====================================================
// PRUEBA DE GEMINI
// =====================================================

app.get(
    "/api/prueba-gemini",
    async function(req, res) {

        try {

            const texto =
                await generarConGemini(
                    `
Devuelve únicamente este JSON:

{
    "ok": true,
    "mensaje": "Gemini funciona correctamente"
}
`
                );


            const datos =
                JSON.parse(
                    texto
                );


            res.json(
                datos
            );


        } catch (error) {

            console.error(
                "❌ Error en prueba Gemini:",
                error
            );


            res.status(
                500
            ).json({

                ok:
                    false,

                error:
                    error.message ||
                    "Gemini no funciona correctamente."

            });

        }

    }
);


// =====================================================
// INICIAR SERVIDOR
// =====================================================

app.listen(
    PORT,
    "0.0.0.0",
    function() {

        console.log("");
        console.log(
            "======================================"
        );
        console.log(
            "🤖 TEOS AI FUNCIONANDO"
        );
        console.log(
            "======================================"
        );
        console.log(
            "🌐 Puerto:",
            PORT
        );
        console.log(
            "🤖 Gemini:",
            GEMINI_API_KEY
                ? "CONFIGURADO"
                : "NO CONFIGURADO"
        );
        console.log(
            "🏆 Rankings:",
            "SISTEMA EN SEGUNDO PLANO"
        );
        console.log(
            "======================================"
        );
        console.log("");

    }
);