const express = require("express");
const cors = require("cors");
const Parser = require("rss-parser");
const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const parser = new Parser();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(__dirname));

const PORT = 3000;


// =====================================================
// GEMINI AI
// =====================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY
});


// =====================================================
// FUENTES DE NOTICIAS
// =====================================================

const fuentes = [
    {
        nombre: "Game Informer",
        url: "https://gameinformer.com/rss.xml"
    },
    {
        nombre: "IGN",
        url: "https://feeds.feedburner.com/ignfeeds"
    },
    {
        nombre: "Destructoid",
        url: "https://www.destructoid.com/feed/"
    }
];


// =====================================================
// OBTENER NOTICIAS DE HOY
// =====================================================

app.get("/api/noticias", async (req, res) => {

    try {

        const resultados = [];

        for (const fuente of fuentes) {

            try {

                console.log("🔎 Leyendo:", fuente.nombre);

                const feed = await parser.parseURL(fuente.url);

                if (!feed || !Array.isArray(feed.items)) {
                    continue;
                }

                feed.items.forEach((item) => {

                    const fechaPublicacion =
                        item.pubDate
                            ? new Date(item.pubDate)
                            : null;

                    const hoy = new Date();

                    let esDeHoy = false;

                    if (
                        fechaPublicacion &&
                        !isNaN(fechaPublicacion.getTime())
                    ) {

                        esDeHoy =
                            fechaPublicacion.getFullYear() === hoy.getFullYear() &&
                            fechaPublicacion.getMonth() === hoy.getMonth() &&
                            fechaPublicacion.getDate() === hoy.getDate();

                    }

                    if (!esDeHoy) {
                        return;
                    }


                    // =================================================
                    // BUSCAR IMAGEN
                    // =================================================

                    let imagen = "";


                    if (
                        item.enclosure &&
                        item.enclosure.url
                    ) {

                        imagen = item.enclosure.url;

                    }

                    else if (
                        item["media:content"] &&
                        item["media:content"].url
                    ) {

                        imagen = item["media:content"].url;

                    }

                    else if (
                        item["media:thumbnail"] &&
                        item["media:thumbnail"].url
                    ) {

                        imagen = item["media:thumbnail"].url;

                    }

                    else if (
                        item.image &&
                        item.image.url
                    ) {

                        imagen = item.image.url;

                    }

                    else if (
                        typeof item.image === "string"
                    ) {

                        imagen = item.image;

                    }


                    if (!imagen) {

                        const contenidoRSS =
                            item["content:encoded"] ||
                            item.content ||
                            item.description ||
                            "";

                        const coincidencia =
                            contenidoRSS.match(
                                /<img[^>]+src=["']([^"']+)["']/i
                            );

                        if (coincidencia) {
                            imagen = coincidencia[1];
                        }

                    }


                    if (imagen) {
                        imagen = imagen.trim();
                    }


                    resultados.push({

                        titulo:
                            item.title ||
                            "Sin título",

                        enlace:
                            item.link ||
                            "",

                        fecha:
                            item.pubDate ||
                            "",

                        fuente:
                            fuente.nombre,

                        descripcion:
                            item.contentSnippet ||
                            item.description ||
                            "",

                        imagen:
                            imagen

                    });

                });

            } catch (error) {

                console.error(
                    "❌ No se pudo leer:",
                    fuente.nombre
                );

                console.error(error.message);

            }

        }


        // =================================================
        // ELIMINAR DUPLICADOS
        // =================================================

        const noticiasUnicas = [];

        const titulosVistos = new Set();

        for (const noticia of resultados) {

            const tituloNormalizado =
                noticia.titulo
                    .trim()
                    .toLowerCase();

            if (!titulosVistos.has(tituloNormalizado)) {

                titulosVistos.add(tituloNormalizado);

                noticiasUnicas.push(noticia);

            }

        }


        // =================================================
        // ORDENAR
        // =================================================

        noticiasUnicas.sort((a, b) => {

            return (
                new Date(b.fecha) -
                new Date(a.fecha)
            );

        });


        console.log(
            "📰 Noticias encontradas:",
            noticiasUnicas.length
        );


        res.json(noticiasUnicas);

    } catch (error) {

        console.error(
            "❌ Error obteniendo noticias:",
            error
        );

        res.status(500).json({

            error:
                "No se pudieron obtener las noticias."

        });

    }

});


// =====================================================
// PREPARAR ARTÍCULO CON GEMINI
// =====================================================

app.post(
    "/api/preparar-articulo",
    async (req, res) => {

        try {

            const noticia = req.body;

            if (!noticia || !noticia.titulo) {

                return res.status(400).json({

                    error:
                        "No se recibió una noticia válida."

                });

            }


            if (!GEMINI_API_KEY) {

                return res.status(500).json({

                    error:
                        "No has colocado la clave de Gemini en servidor.js."

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

Debes convertir la siguiente noticia en un artículo
profesional en español.

REGLAS:

- No inventes datos.
- No inventes fechas.
- No inventes declaraciones.
- No inventes nombres.
- Utiliza únicamente la información proporcionada.
- Escribe de forma natural y profesional.
- El texto debe parecer escrito por un periodista de videojuegos.
- No menciones que eres una inteligencia artificial.
- No digas "según una IA".
- No copies literalmente la descripción.
- Puedes reorganizar y desarrollar la información proporcionada.
- Mantén un tono interesante para jugadores.
- El artículo debe ser fácil de leer.
- Evita repetir innecesariamente las mismas frases.
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

Devuelve ÚNICAMENTE un JSON válido:

{
    "titulo": "Título de la noticia",
    "introduccion": "Introducción del artículo",
    "contenido": "Desarrollo completo del artículo",
    "conclusion": "Conclusión del artículo",
    "imagenPrompt": "Descripción de una imagen relacionada con esta noticia"
}

No agregues Markdown.
No agregues bloques de código.
No agregues explicaciones fuera del JSON.
`;


            const respuestaGemini =
                await ai.models.generateContent({

                    model: "gemini-3.6-flash",

                    contents: prompt

                });


            let texto =
                respuestaGemini.text;


            if (!texto) {

                throw new Error(
                    "Gemini no devolvió contenido."
                );

            }


            texto = texto.trim();


            texto =
                texto
                    .replace(/^```json/i, "")
                    .replace(/^```/i, "")
                    .replace(/```$/i, "")
                    .trim();


            let articuloIA;

            try {

                articuloIA = JSON.parse(texto);

            } catch (error) {

                console.error(
                    "❌ Respuesta de Gemini:"
                );

                console.error(texto);

                throw new Error(
                    "Gemini no devolvió un JSON válido."
                );

            }


            const articulo = {

                titulo:
                    articuloIA.titulo ||
                    titulo,

                introduccion:
                    articuloIA.introduccion ||
                    descripcion,

                contenido:
                    articuloIA.contenido ||
                    "No se pudo generar el contenido.",

                conclusion:
                    articuloIA.conclusion ||
                    "Seguiremos atentos a las novedades.",

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
                    new Date().toLocaleDateString("es-ES")

            };


            res.json(articulo);

        } catch (error) {

            console.error(
                "❌ Error preparando artículo:",
                error
            );

            res.status(500).json({

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
    (req, res) => {

        try {

            const articulo = req.body;

            if (!articulo || !articulo.titulo) {

                return res.status(400).json({

                    error:
                        "El artículo no es válido."

                });

            }


            const carpetaNoticias =
                path.join(
                    __dirname,
                    "noticias"
                );


            if (!fs.existsSync(carpetaNoticias)) {

                fs.mkdirSync(
                    carpetaNoticias,
                    {
                        recursive: true
                    }
                );

            }


            let slug =
                articulo.titulo
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "")
                    .substring(0, 80);


            if (!slug) {
                slug = "noticia-teos";
            }


            let nombreArchivo =
                slug + ".html";

            let rutaArchivo =
                path.join(
                    carpetaNoticias,
                    nombreArchivo
                );


            let contador = 2;


            while (fs.existsSync(rutaArchivo)) {

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


            const fecha =
                articulo.fecha ||
                new Date().toLocaleDateString("es-ES");


            const imagen =
                articulo.imagen ||
                "";

            const enlace =
                articulo.enlace ||
                "#";


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


            const tituloHTML =
                escaparHTML(articulo.titulo);

            const introduccionHTML =
                escaparHTML(articulo.introduccion);

            const contenidoHTML =
                escaparHTML(articulo.contenido);

            const conclusionHTML =
                escaparHTML(articulo.conclusion);

            const fuenteHTML =
                escaparHTML(
                    articulo.fuente ||
                    "Fuente original"
                );

            const fechaHTML =
                escaparHTML(fecha);


            let imagenHTML = "";


            if (imagen) {

                imagenHTML = `

                    <div class="imagen-articulo-contenedor">

                        <img
                            src="${imagen}"
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

            <h2>
                Introducción
            </h2>

            <p>
                ${introduccionHTML}
            </p>

            <h2>
                Desarrollo
            </h2>

            <p>
                ${contenidoHTML}
            </p>

            <h2>
                Conclusión
            </h2>

            <p>
                ${conclusionHTML}
            </p>

            <div class="fuentes">

                <h2>
                    Fuente
                </h2>

                <p>
                    📰 ${fuenteHTML}
                </p>

                <p>

                    <a
                        href="${enlace}"
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

                ok: true,

                mensaje:
                    "🚀 Noticia publicada correctamente.",

                archivo:
                    nombreArchivo,

                ruta:
                    "noticias/" +
                    nombreArchivo,

                imagen:
                    imagen

            });

        } catch (error) {

            console.error(
                "❌ Error publicando artículo:",
                error
            );

            res.status(500).json({

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
    (req, res) => {

        try {

            const carpetaNoticias =
                path.join(
                    __dirname,
                    "noticias"
                );


            if (!fs.existsSync(carpetaNoticias)) {
                return res.json([]);
            }


            const archivos =
                fs.readdirSync(carpetaNoticias)
                    .filter(
                        archivo =>
                            archivo.endsWith(".html")
                    );


            const noticias =
                archivos.map(archivo => {

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
                            : archivo.replace(".html", "");


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
                            .replace(/<[^>]+>/g, "")
                            .trim();


                    fecha =
                        fecha
                            .replace(/<[^>]+>/g, "")
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

                });


            function convertirFecha(fecha) {

                if (!fecha) {
                    return 0;
                }


                const texto =
                    String(fecha)
                        .replace(/📅/g, "")
                        .trim();


                const fechaDirecta =
                    new Date(texto);


                if (!isNaN(fechaDirecta.getTime())) {
                    return fechaDirecta.getTime();
                }


                const corto =
                    texto.match(
                        /(\d{1,2})\/(\d{1,2})\/(\d{4})/
                    );


                if (corto) {

                    return new Date(
                        parseInt(corto[3]),
                        parseInt(corto[2]) - 1,
                        parseInt(corto[1])
                    ).getTime();

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


                const largo =
                    texto.match(
                        /(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})/i
                    );


                if (largo) {

                    const mes =
                        meses[
                            largo[2].toLowerCase()
                        ];


                    if (mes !== undefined) {

                        return new Date(
                            parseInt(largo[3]),
                            mes,
                            parseInt(largo[1])
                        ).getTime();

                    }

                }


                return 0;

            }


            noticias.sort(
                (a, b) =>
                    convertirFecha(b.fecha) -
                    convertirFecha(a.fecha)
            );


            res.json(noticias);

        } catch (error) {

            console.error(
                "Error obteniendo noticias publicadas:",
                error
            );

            res.status(500).json({

                error:
                    "No se pudieron obtener las noticias publicadas."

            });

        }

    }
);


// =====================================================
// TEMAS DE LOS 10 RANKINGS
// =====================================================

const temasRankings = [

    {
        numero: 1,
        titulo: "Top 10 mejores videojuegos de aventura"
    },

    {
        numero: 2,
        titulo: "Top 10 mejores juegos RPG"
    },

    {
        numero: 3,
        titulo: "Top 10 mejores juegos para jugar con amigos"
    },

    {
        numero: 4,
        titulo: "Top 10 mejores juegos gratuitos para PC"
    },

    {
        numero: 5,
        titulo: "Top 10 mejores juegos de acción"
    },

    {
        numero: 6,
        titulo: "Top 10 mejores juegos de mundo abierto"
    },

    {
        numero: 7,
        titulo: "Top 10 mejores juegos multijugador"
    },

    {
        numero: 8,
        titulo: "Top 10 mejores juegos de terror"
    },

    {
        numero: 9,
        titulo: "Top 10 mejores juegos de supervivencia"
    },

    {
        numero: 10,
        titulo: "Top 10 mejores juegos para PC"
    }

];


// =====================================================
// PREPARAR LOS 10 RANKINGS
// =====================================================

app.post(
    "/api/preparar-rankings",
    async (req, res) => {

        try {

            if (!GEMINI_API_KEY) {

                return res.status(500).json({

                    error:
                        "No has colocado la clave de Gemini en servidor.js."

                });

            }


            console.log(
                "🏆 TEOS IA está preparando los 10 rankings..."
            );


            const listaTemas =
                temasRankings
                    .map(
                        tema =>
                            `${tema.numero}. ${tema.titulo}`
                    )
                    .join("\n");


            const prompt = `

Eres el editor principal de TEOS Gaming,
un medio digital especializado en videojuegos.

Debes actualizar los 10 rankings de TEOS Gaming.

Estos rankings YA EXISTEN.

NO debes crear nuevos rankings.

Debes mantener EXACTAMENTE estos 10 temas:

${listaTemas}

REGLAS IMPORTANTES:

- Debes devolver exactamente 10 rankings.
- Cada ranking corresponde a su número.
- Cada ranking debe tener exactamente 10 videojuegos.
- Los puestos deben ser del 1 al 10.
- Cada juego debe tener una puntuación sobre 10.
- Las puntuaciones deben ser coherentes.
- No repitas innecesariamente el mismo juego dentro del mismo ranking.
- Puedes utilizar juegos conocidos y relevantes.
- El ranking debe tener sentido editorialmente.
- Escribe todo en español.
- Mantén un tono profesional de medio gaming.
- No menciones que eres una IA.
- No inventes declaraciones de desarrolladores.
- No inventes fechas.
- No inventes cifras concretas.
- No agregues características específicas dudosas.
- No agregues un ranking número 11.
- No agregues categorías nuevas.

Para cada ranking debes generar:

- título
- introducción
- exactamente 10 juegos
- puntuación de cada juego
- descripción de cada juego
- explicación de cómo se elaboró
- conclusión

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
                    "descripcion": "Descripción del videojuego"
                }
            ],
            "comoSeElaboro": "Explicación del criterio utilizado",
            "conclusion": "Conclusión del ranking"
        }
    ]
}

Debe haber EXACTAMENTE 10 objetos dentro de "rankings".

Cada objeto debe tener EXACTAMENTE 10 juegos.

Los números de los rankings deben ser del 1 al 10.

Los puestos de cada ranking deben ser del 1 al 10.

Devuelve ÚNICAMENTE JSON válido.

No agregues Markdown.
No agregues bloques de código.
No agregues explicaciones fuera del JSON.
`;


            const respuestaGemini =
                await ai.models.generateContent({

                    model:
                        "gemini-3.6-flash",

                    contents:
                        prompt

                });


            let texto =
                respuestaGemini.text;


            if (!texto) {

                throw new Error(
                    "Gemini no devolvió contenido."
                );

            }


            texto =
                texto
                    .trim()
                    .replace(/^```json/i, "")
                    .replace(/^```/i, "")
                    .replace(/```$/i, "")
                    .trim();


            let datos;


            try {

                datos =
                    JSON.parse(texto);

            } catch (error) {

                console.error(
                    "❌ JSON recibido de Gemini:"
                );

                console.error(texto);

                throw new Error(
                    "Gemini no devolvió un JSON válido."
                );

            }


            if (
                !datos.rankings ||
                !Array.isArray(datos.rankings)
            ) {

                throw new Error(
                    "La respuesta no contiene los rankings."
                );

            }


            if (datos.rankings.length !== 10) {

                throw new Error(
                    "Gemini no generó exactamente 10 rankings."
                );

            }


            for (
                let i = 0;
                i < datos.rankings.length;
                i++
            ) {

                const ranking =
                    datos.rankings[i];


                ranking.numero = i + 1;

                ranking.titulo =
                    temasRankings[i].titulo;


                if (
                    !ranking.juegos ||
                    !Array.isArray(ranking.juegos)
                ) {

                    throw new Error(
                        "El ranking " +
                        (i + 1) +
                        " no contiene juegos."
                    );

                }


                if (ranking.juegos.length !== 10) {

                    throw new Error(
                        "El ranking " +
                        (i + 1) +
                        " no contiene exactamente 10 juegos."
                    );

                }


                for (
                    let j = 0;
                    j < ranking.juegos.length;
                    j++
                ) {

                    const juego =
                        ranking.juegos[j];


                    juego.puesto = j + 1;


                    if (!juego.nombre) {

                        throw new Error(
                            "Falta el nombre de un juego en el ranking " +
                            (i + 1)
                        );

                    }


                    if (!juego.puntuacion) {

                        throw new Error(
                            "Falta la puntuación de un juego en el ranking " +
                            (i + 1)
                        );

                    }


                    if (!juego.descripcion) {

                        throw new Error(
                            "Falta la descripción de un juego en el ranking " +
                            (i + 1)
                        );

                    }

                }

            }


            console.log(
                "✅ Los 10 rankings fueron preparados correctamente."
            );


            res.json({

                ok: true,

                rankings:
                    datos.rankings

            });

        } catch (error) {

            console.error(
                "❌ Error preparando rankings:",
                error
            );

            res.status(500).json({

                error:
                    error.message ||
                    "No se pudieron preparar los rankings."

            });

        }

    }
);


// =====================================================
// ESCAPAR HTML PARA RANKINGS
// =====================================================

function escaparHTMLRanking(texto) {

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
// CREAR CONTENIDO DEL RANKING
// =====================================================

function crearContenidoRanking(ranking) {

    let html = "";


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


    ranking.juegos.forEach(function(juego) {

        let emoji = "";

        if (juego.puesto === 1) {
            emoji = "🥇";
        }

        else if (juego.puesto === 2) {
            emoji = "🥈";
        }

        else if (juego.puesto === 3) {
            emoji = "🥉";
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

    });


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

function actualizarArchivoRanking(numero, ranking) {

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


    // =================================================
    // COMPROBAR EXISTENCIA
    // =================================================

    if (!fs.existsSync(rutaArchivo)) {

        throw new Error(
            "No existe el archivo: rankings/" +
            nombreArchivo
        );

    }


    // =================================================
    // LEER ARCHIVO
    // =================================================

    let html =
        fs.readFileSync(
            rutaArchivo,
            "utf8"
        );


    // =================================================
    // BUSCAR EL CONTENEDOR COMPLETO
    //
    // ESTA ES LA CORRECCIÓN IMPORTANTE
    // =================================================

    const regexContenedor =
        /<div\s+class=["']ranking-contenido["'][^>]*>[\s\S]*?<\/div>\s*<\/article>/i;


    const coincidencia =
        html.match(regexContenedor);


    if (!coincidencia) {

        throw new Error(
            "No se encontró correctamente el contenedor ranking-contenido en " +
            nombreArchivo +
            ". Revisa que exista <div class=\"ranking-contenido\">."
        );

    }


    // =================================================
    // CREAR NUEVO CONTENIDO
    // =================================================

    const nuevoContenido =
        crearContenidoRanking(
            ranking
        );


    // =================================================
    // CONSERVAR EL CIERRE </article>
    // =================================================

    const nuevoBloque = `

        <div class="ranking-contenido" id="contenidoRanking">

            ${nuevoContenido}

        </div>

    </article>`;


    // =================================================
    // REEMPLAZAR CONTENEDOR COMPLETO
    // =================================================

    html =
        html.replace(
            regexContenedor,
            nuevoBloque
        );


    // =================================================
    // ACTUALIZAR TITLE
    // =================================================

    const tituloNuevo =
        escaparHTMLRanking(
            ranking.titulo
        );


    html =
        html.replace(
            /<title>[\s\S]*?<\/title>/i,
            `<title>${tituloNuevo} | TEOS Gaming</title>`
        );


    // =================================================
    // ACTUALIZAR H1
    // =================================================

    html =
        html.replace(
            /<h1>[\s\S]*?<\/h1>/i,
            `<h1>\n    ${tituloNuevo}\n</h1>`
        );


    // =================================================
    // ACTUALIZAR FECHA
    // =================================================

    const fechaActual =
        new Date().toLocaleDateString(
            "es-ES",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
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


    // =================================================
    // GUARDAR
    // =================================================

    fs.writeFileSync(
        rutaArchivo,
        html,
        "utf8"
    );


    console.log(
        "✅ Actualizado:",
        "rankings/" + nombreArchivo
    );


    return nombreArchivo;

}


// =====================================================
// PUBLICAR / REEMPLAZAR LOS 10 RANKINGS
// =====================================================

app.post(
    "/api/publicar-rankings",
    (req, res) => {

        try {

            const rankings =
                req.body.rankings;


            if (!Array.isArray(rankings)) {

                return res.status(400).json({

                    error:
                        "No se recibieron los rankings."

                });

            }


            if (rankings.length !== 10) {

                return res.status(400).json({

                    error:
                        "Debes enviar exactamente 10 rankings."

                });

            }


            const archivosActualizados = [];


            // =================================================
            // ACTUALIZAR DEL 1 AL 10
            // =================================================

            for (
                let i = 0;
                i < 10;
                i++
            ) {

                const ranking =
                    rankings[i];


                const numero =
                    i + 1;


                if (
                    !ranking ||
                    !Array.isArray(ranking.juegos) ||
                    ranking.juegos.length !== 10
                ) {

                    throw new Error(
                        "El ranking " +
                        numero +
                        " no es válido."
                    );

                }


                ranking.numero =
                    numero;


                ranking.titulo =
                    temasRankings[i].titulo;


                const archivo =
                    actualizarArchivoRanking(
                        numero,
                        ranking
                    );


                archivosActualizados.push(
                    archivo
                );

            }


            console.log(
                "🚀 LOS 10 RANKINGS FUERON ACTUALIZADOS."
            );


            res.json({

                ok: true,

                mensaje:
                    "🚀 Los 10 rankings fueron actualizados correctamente.",

                archivos:
                    archivosActualizados

            });

        } catch (error) {

            console.error(
                "❌ Error actualizando rankings:",
                error
            );


            res.status(500).json({

                error:
                    error.message ||
                    "No se pudieron actualizar los rankings."

            });

        }

    }
);


// =====================================================
// ESTADO DEL SERVIDOR
// =====================================================

app.get(
    "/api/estado",
    (req, res) => {

        res.json({

            ok: true,

            mensaje:
                "🤖 TEOS AI está funcionando correctamente.",

            servidor:
                "TEOS Gaming",

            puerto:
                PORT,

            rankings:
                10

        });

    }
);


// =====================================================
// INICIAR SERVIDOR
// =====================================================

app.listen(
    PORT,
    () => {

        console.log("");
        console.log("======================================");
        console.log("🤖 TEOS AI FUNCIONANDO");
        console.log("======================================");

        console.log(
            `🌐 http://localhost:${PORT}`
        );

        console.log(
            `📡 API: http://localhost:${PORT}/api/estado`
        );

        console.log("======================================");
        console.log("");

    }
);