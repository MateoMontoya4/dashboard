
/* =====================================
   CONFIGURACIÓN
===================================== */

const URL_API = "https://6afe42993a0e70bc8d5336c7.mockapi.io/respuestas";

const TOTAL_ESTUDIANTES = 325;

const carreras = [
    {
        id: "psico",
        nombre: "Tecnicatura Superior en Psicopedagogía",
        clase: "psico",
        icono: "📚",
        total: 74,
        anios: [
            { nombre: "1.er año", clave: "1", total: 23 },
            { nombre: "2.º año", clave: "2", total: 19 },
            { nombre: "3.er año", clave: "3", total: 16 },
            { nombre: "4.º año", clave: "4", total: 16 }
        ]
    },
    {
        id: "terapia",
        nombre: "Acompañamiento Terapéutico",
        clase: "terapia",
        icono: "🤝",
        total: 182,
        anios: [
            { nombre: "1.er año", clave: "1", total: 96 },
            { nombre: "2.º año", clave: "2", total: 38 },
            { nombre: "3.er año", clave: "3", total: 48 }
        ]
    },
    {
        id: "software",
        nombre: "Tecnicatura en Desarrollo de Software",
        clase: "software",
        icono: "💻",
        total: 69,
        anios: [
            { nombre: "1.er año", clave: "1", total: 12 },
            { nombre: "2.º año", clave: "2", total: 23 },
            { nombre: "3.er año", clave: "3", total: 34 }
        ]
    }
];


/* =====================================
   ELEMENTOS DEL HTML
===================================== */

const totalEncuestas = document.getElementById("total-encuestas");
const totalEstudiantes = document.getElementById("total-estudiantes");
const porcentajeGeneral = document.getElementById("porcentaje-general");

const contadorGeneral = document.getElementById("contador-general");
const barraGeneral = document.getElementById("barra-general");
const textoGeneral = document.getElementById("texto-general");

const resumenCarreras = document.getElementById("resumen-carreras");
const contenedorCarrera = document.getElementById("contenedor-carrera");

const tituloCarrera = document.getElementById("titulo-carrera");
const descripcionCarrera = document.getElementById("descripcion-carrera");

const estadoApi = document.getElementById("estado-api");
const puntoEstado = document.querySelector(".punto");
const ultimaActualizacion = document.getElementById("ultima-actualizacion");

const botones = document.querySelectorAll(".nav-btn");

const vistaGeneral = document.getElementById("vista-general");
const vistaCarreras = document.getElementById("vista-carreras");

let vistaActual = "general";


/* =====================================
   FUNCIONES AUXILIARES
===================================== */

// Convierte el año de la encuesta en un número.

function obtenerAnio(valor) {

    const texto = String(valor || "").toLowerCase();

    if (texto.includes("1") || texto.includes("primer")) return "1";
    if (texto.includes("2") || texto.includes("segundo")) return "2";
    if (texto.includes("3") || texto.includes("tercer")) return "3";
    if (texto.includes("4") || texto.includes("cuarto")) return "4";

    return null;
}


// Identifica la carrera de cada respuesta.

function obtenerCarrera(valor) {

    const texto = String(valor || "").toLowerCase();

    if (texto.includes("psicopedagog")) return "psico";

    if (texto.includes("acompañamiento")) return "terapia";

    if (texto.includes("desarrollo de software")) return "software";

    return null;
}


// Calcula el porcentaje.

function calcularPorcentaje(respuestas, estudiantes) {

    if (!estudiantes) return 0;

    return (respuestas / estudiantes) * 100;
}


// Evita que una barra supere el 100%.

function anchoBarra(porcentaje) {

    return Math.min(porcentaje, 100);
}


// Da formato a los números.

function formatoNumero(numero) {

    return new Intl.NumberFormat("es-AR").format(numero);
}


/* =====================================
   PROCESAR RESPUESTAS DE MOCKAPI
===================================== */

function procesarRespuestas(datos) {

    const resultados = carreras.map(carrera => ({

        ...carrera,

        encuestas: 0,

        anios: carrera.anios.map(anio => ({
            ...anio,
            encuestas: 0
        }))

    }));


    datos.forEach(respuesta => {

        const idCarrera = obtenerCarrera(respuesta.carrera);

        if (!idCarrera) return;

        const carrera = resultados.find(
            c => c.id === idCarrera
        );

        if (!carrera) return;

        // Sumamos una encuesta a la carrera.

        carrera.encuestas++;

        // Buscamos el año de esa respuesta.

        const anio = obtenerAnio(respuesta.anio);

        if (!anio) return;

        const grupoAnio = carrera.anios.find(
            a => a.clave === anio
        );

        if (grupoAnio) {
            grupoAnio.encuestas++;
        }

    });

    return resultados;
}


/* =====================================
   ACTUALIZAR RESUMEN GENERAL
===================================== */

function actualizarResumen(datos, resultados) {

    const total = datos.length;

    const porcentaje = calcularPorcentaje(
        total,
        TOTAL_ESTUDIANTES
    );

    totalEncuestas.textContent = formatoNumero(total);

    totalEstudiantes.textContent =
        formatoNumero(TOTAL_ESTUDIANTES);

    porcentajeGeneral.textContent =
        porcentaje.toFixed(1).replace(".", ",") + "%";

    contadorGeneral.textContent =
        `${formatoNumero(total)} / ${formatoNumero(TOTAL_ESTUDIANTES)}`;

    barraGeneral.style.width =
        anchoBarra(porcentaje) + "%";

    if (total === 0) {

        textoGeneral.textContent =
            "Todavía no hay respuestas registradas.";

    } else {

        textoGeneral.textContent =
            `Se recibieron ${formatoNumero(total)} de ${formatoNumero(TOTAL_ESTUDIANTES)} encuestas previstas.`;

    }

    crearResumenCarreras(resultados);
}


/* =====================================
   RESUMEN DE LAS CARRERAS
===================================== */

function crearResumenCarreras(resultados) {

    resumenCarreras.innerHTML = "";

    resultados.forEach(carrera => {

        const porcentaje = calcularPorcentaje(
            carrera.encuestas,
            carrera.total
        );

        const tarjeta = document.createElement("article");

        tarjeta.className = `mini-carrera ${carrera.clase}`;

        tarjeta.innerHTML = `

            <h3>${carrera.icono} ${carrera.nombre}</h3>

            <strong>
                ${formatoNumero(carrera.encuestas)}
            </strong>

            <p>
                de ${formatoNumero(carrera.total)} estudiantes ·
                ${porcentaje.toFixed(1).replace(".", ",")}%
            </p>

            <div class="mini-barra">
                <div style="width: ${anchoBarra(porcentaje)}%"></div>
            </div>

        `;

        // Al tocar la tarjeta, entramos a esa carrera.

        tarjeta.addEventListener("click", () => {
            cambiarVista(carrera.id);
        });

        resumenCarreras.appendChild(tarjeta);

    });
}


/* =====================================
   MOSTRAR UNA CARRERA
===================================== */

function mostrarCarrera(carrera) {

    tituloCarrera.textContent = carrera.nombre;

    descripcionCarrera.textContent =
        "Seguimiento de participación y respuestas por año.";

    const porcentajeCarrera = calcularPorcentaje(
        carrera.encuestas,
        carrera.total
    );

    contenedorCarrera.innerHTML = "";

    const tarjeta = document.createElement("article");

    tarjeta.className = `tarjeta-carrera ${carrera.clase}`;

    tarjeta.innerHTML = `

        <div class="encabezado-carrera">

            <div class="info-carrera">

                <h3>${carrera.nombre}</h3>

                <p>Participación de estudiantes por año</p>

            </div>

            <div class="icono-carrera">
                ${carrera.icono}
            </div>

        </div>


        <div class="resumen-carrera">

            <div class="dato-carrera">

                <strong>
                    ${formatoNumero(carrera.encuestas)}
                </strong>

                <span>Encuestas recibidas</span>

            </div>

            <div class="dato-carrera">

                <strong>
                    ${porcentajeCarrera.toFixed(1).replace(".", ",")}%
                </strong>

                <span>Participación</span>

            </div>

            <div class="dato-carrera">

                <strong>
                    ${formatoNumero(carrera.total)}
                </strong>

                <span>Estudiantes previstos</span>

            </div>

        </div>


        <p class="titulo-anios">PARTICIPACIÓN POR AÑO</p>


        <div class="lista-anios">

            ${carrera.anios.map(anio => {

                const porcentaje = calcularPorcentaje(
                    anio.encuestas,
                    anio.total
                );

                return `

                    <div class="fila-anio">

                        <div class="info-anio">

                            <span class="nombre-anio">
                                ${anio.nombre}
                            </span>

                            <span class="cantidad-anio">

                                <strong>
                                    ${formatoNumero(anio.encuestas)}
                                </strong>

                                / ${formatoNumero(anio.total)} estudiantes

                            </span>

                        </div>


                        <div class="fondo-anio">

                            <div
                                class="barra barra-anio"
                                style="width: ${anchoBarra(porcentaje)}%"
                            ></div>

                        </div>


                        <div class="porcentaje-anio">

                            ${porcentaje.toFixed(1).replace(".", ",")}% de participación

                        </div>

                    </div>

                `;

            }).join("")}

        </div>

    `;

    contenedorCarrera.appendChild(tarjeta);
}


/* =====================================
   CAMBIAR DE PANTALLA
===================================== */

function cambiarVista(destino) {

    vistaActual = destino;

    // Activamos el botón seleccionado.

    botones.forEach(boton => {

        boton.classList.toggle(
            "activo",
            boton.dataset.vista === destino
        );

    });


    if (destino === "general") {

        vistaGeneral.classList.add("activa");
        vistaCarreras.classList.remove("activa");

    } else {

        vistaGeneral.classList.remove("activa");
        vistaCarreras.classList.add("activa");

        const carrera = carreras.find(
            c => c.id === destino
        );

        if (carrera && datosActuales) {

            const resultado = resultadosActuales.find(
                c => c.id === destino
            );

            if (resultado) {
                mostrarCarrera(resultado);
            }

        }

    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Eventos de los botones.

botones.forEach(boton => {

    boton.addEventListener("click", () => {

        cambiarVista(boton.dataset.vista);

    });

});


/* =====================================
   ESTADO DE CONEXIÓN
===================================== */

function cambiarEstado(conectado) {

    if (conectado) {

        estadoApi.textContent = "Conectado a MockAPI";
        puntoEstado.style.background = "#34d399";

    } else {

        estadoApi.textContent = "Error de conexión";
        puntoEstado.style.background = "#fb923c";

    }

}


/* =====================================
   CARGAR DATOS
===================================== */

let datosActuales = null;
let resultadosActuales = [];


async function cargarDatos() {

    try {

        const respuesta = await fetch(URL_API);

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las respuestas.");
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
            throw new Error("La API no devolvió una lista de respuestas.");
        }

        datosActuales = datos;

        resultadosActuales = procesarRespuestas(datos);

        // Actualizamos la pantalla general.

        actualizarResumen(datos, resultadosActuales);

        // Si estamos mirando una carrera, también la actualizamos.

        if (vistaActual !== "general") {

            const carrera = resultadosActuales.find(
                c => c.id === vistaActual
            );

            if (carrera) {
                mostrarCarrera(carrera);
            }

        }

        cambiarEstado(true);

        ultimaActualizacion.textContent =
            "Última actualización: " +
            new Date().toLocaleTimeString("es-AR");

    } catch (error) {

        console.error("Error al cargar el dashboard:", error);

        cambiarEstado(false);

        ultimaActualizacion.textContent =
            "No se pudieron actualizar los datos.";

    }

}


/* =====================================
   INICIAR DASHBOARD
===================================== */

// Primera carga.

cargarDatos();

// Actualización automática cada 30 segundos.

setInterval(cargarDatos, 30000);
