// =====================================================
// TEOS GAMING - PC
// Sistema de contenido para la sección PC
// =====================================================


// =====================================================
// ELEMENTOS
// =====================================================

const botonesPC =
    document.querySelectorAll(".boton-pc");

const contenidoPC =
    document.getElementById("contenidoPC");


// =====================================================
// COMPROBAR ELEMENTOS
// =====================================================

if (botonesPC.length > 0 && contenidoPC) {

    botonesPC.forEach(
        function (boton) {

            boton.addEventListener(
                "click",
                function () {

                    const seccion =
                        boton.dataset.seccion;

                    mostrarSeccionPC(
                        seccion
                    );

                }
            );

        }
    );

}


// =====================================================
// MOSTRAR SECCIÓN
// =====================================================

function mostrarSeccionPC(seccion) {

    let contenido = "";


// =====================================================
// JUEGOS
// =====================================================

    if (seccion === "juegos") {

        contenido = `

            <div class="pc-contenido-interno">

                <span class="etiqueta">
                    🎮 JUEGOS DE PC
                </span>

                <h2>
                    Juegos de PC
                </h2>

                <p>
                    Descubre juegos que puedes disfrutar
                    en ordenador.
                </p>


                <div class="pc-lista">


                    <article class="pc-articulo">

                        <span>
                            🎮
                        </span>

                        <h3>
                            Juegos gratuitos
                        </h3>

                        <p>
                            Descubre experiencias gratuitas
                            que puedes jugar en PC.
                        </p>

                    </article>


                    <article class="pc-articulo">

                        <span>
                            ⭐
                        </span>

                        <h3>
                            Juegos recomendados
                        </h3>

                        <p>
                            Selección de juegos que vale la
                            pena conocer.
                        </p>

                    </article>


                    <article class="pc-articulo">

                        <span>
                            🕹️
                        </span>

                        <h3>
                            Juegos poco conocidos
                        </h3>

                        <p>
                            Descubre títulos interesantes
                            que quizás todavía no conoces.
                        </p>

                    </article>


                </div>

            </div>

        `;

    }


// =====================================================
// RENDIMIENTO
// =====================================================

    else if (seccion === "rendimiento") {

        contenido = `

            <div class="pc-contenido-interno">

                <span class="etiqueta">
                    ⚡ RENDIMIENTO
                </span>

                <h2>
                    Optimización y FPS
                </h2>

                <p>
                    Aprende a conseguir un mejor rendimiento
                    en tus juegos.
                </p>


                <div class="pc-lista">


                    <article class="pc-articulo">

                        <span>
                            ⚡
                        </span>

                        <h3>
                            Aumentar FPS
                        </h3>

                        <p>
                            Configuraciones que pueden ayudarte
                            a obtener más FPS.
                        </p>

                    </article>


                    <article class="pc-articulo">

                        <span>
                            🎯
                        </span>

                        <h3>
                            Reducir el lag
                        </h3>

                        <p>
                            Consejos para mejorar la conexión
                            y reducir problemas de latencia.
                        </p>

                    </article>


                    <article class="pc-articulo">

                        <span>
                            ⚙️
                        </span>

                        <h3>
                            Configuración gráfica
                        </h3>

                        <p>
                            Aprende qué opciones gráficas
                            puedes modificar para mejorar
                            el rendimiento.
                        </p>

                    </article>


                </div>

            </div>

        `;

    }


// =====================================================
// HARDWARE
// =====================================================

    else if (seccion === "hardware") {

        contenido = `

            <div class="pc-contenido-interno">

                <span class="etiqueta">
                    🖥️ HARDWARE GAMING
                </span>

                <h2>
                    Componentes para PC
                </h2>

                <p>
                    Aprende sobre los principales componentes
                    de un PC Gaming.
                </p>


                <div class="pc-lista">


                    <article class="pc-articulo">

                        <span>
                            🎮
                        </span>

                        <h3>
                            Tarjetas gráficas
                        </h3>

                        <p>
                            Conoce las GPU y su importancia
                            para jugar en PC.
                        </p>

                    </article>


                    <article class="pc-articulo">

                        <span>
                            🧠
                        </span>

                        <h3>
                            Procesadores
                        </h3>

                        <p>
                            Aprende qué función tiene la CPU
                            y cómo elegirla.
                        </p>

                    </article>


                    <article class="pc-articulo">

                        <span>
                            💾
                        </span>

                        <h3>
                            RAM y almacenamiento
                        </h3>

                        <p>
                            Conoce la memoria RAM, SSD y HDD
                            y sus diferencias.
                        </p>

                    </article>


                </div>

            </div>

        `;

    }


// =====================================================
// GUÍAS
// =====================================================

    else if (seccion === "guias") {

        contenido = `

            <div class="pc-contenido-interno">

                <span class="etiqueta">
                    🔧 GUÍAS PARA PC
                </span>

                <h2>
                    Guías y tutoriales
                </h2>

                <p>
                    Aprende paso a paso cómo configurar,
                    actualizar y solucionar problemas de tu PC.
                </p>


                <div class="pc-lista">


                    <article class="pc-articulo">

                        <span>
                            🔧
                        </span>

                        <h3>
                            Instalar componentes
                        </h3>

                        <p>
                            Guías para instalar componentes
                            correctamente.
                        </p>

                    </article>


                    <article class="pc-articulo">

                        <span>
                            🪟
                        </span>

                        <h3>
                            Configurar Windows
                        </h3>

                        <p>
                            Ajustes útiles para preparar
                            Windows para gaming.
                        </p>

                    </article>


                    <article class="pc-articulo">

                        <span>
                            🛠️
                        </span>

                        <h3>
                            Solucionar problemas
                        </h3>

                        <p>
                            Consejos para resolver errores
                            comunes en PC.
                        </p>

                    </article>


                </div>

            </div>

        `;

    }


// =====================================================
// PC ECONÓMICO
// =====================================================

    else if (seccion === "economico") {

        contenido = `

            <div class="pc-contenido-interno">

                <span class="etiqueta">
                    💰 PC GAMING ECONÓMICO
                </span>

                <h2>
                    Calidad y precio
                </h2>

                <p>
                    Aprende a elegir componentes para conseguir
                    el mejor rendimiento posible sin gastar
                    dinero innecesariamente.
                </p>


                <div class="pc-lista">


                    <article class="pc-articulo">

                        <span>
                            💰
                        </span>

                        <h3>
                            PCs económicos
                        </h3>

                        <p>
                            Configuraciones pensadas para
                            presupuestos ajustados.
                        </p>

                    </article>


                    <article class="pc-articulo">

                        <span>
                            ⚖️
                        </span>

                        <h3>
                            Calidad / precio
                        </h3>

                        <p>
                            Aprende dónde vale la pena invertir
                            y dónde puedes ahorrar.
                        </p>

                    </article>


                    <article class="pc-articulo">

                        <span>
                            🔄
                        </span>

                        <h3>
                            Actualizaciones
                        </h3>

                        <p>
                            Descubre qué componentes conviene
                            actualizar primero.
                        </p>

                    </article>


                </div>

            </div>

        `;

    }


// =====================================================
// SECCIÓN DESCONOCIDA
// =====================================================

    else {

        contenido = `

            <div class="pc-mensaje">

                <span class="etiqueta">
                    💻 PC GAMING
                </span>

                <h2>
                    Sección no encontrada
                </h2>

                <p>
                    No pudimos encontrar esta categoría.
                </p>

            </div>

        `;

    }


// =====================================================
// INSERTAR CONTENIDO
// =====================================================

    contenidoPC.innerHTML =
        contenido;


// =====================================================
// DESPLAZAR HACIA EL CONTENIDO
// =====================================================

    contenidoPC.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}