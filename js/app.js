// Selectores
const selectCryptos = document.querySelector('#criptomonedas');
const selectMonedas = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

// Objeto de búsqueda
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

// Promesas
const obtenerCryptos = cryptos => new Promise(resolve => {
    // Descarga las cryptos
    resolve(cryptos);
})

// Eventos
window.onload = () => {
    // Llenar el Select de Cyptos con las 10 de mayor MarketCap
    consultarCryptos();

    // Validar el formulario cuando se envíe y hacer la cotización
    formulario.addEventListener('submit', submitFormulario)

    // Leer el valor del select
    selectCryptos.addEventListener('change', leerValor);
    selectMonedas.addEventListener('change', leerValor);
}

// Funciones principales
function consultarCryptos() {
    // Consultar las 10 cryptos con mayor MarketCap
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCryptos(resultado.Data))
        .then(cryptos => llenarSelectCryptos(cryptos))
        .catch(error => console.error(error));
}

function llenarSelectCryptos(cryptos) {
    cryptos.forEach(crypto => {
        // Sacar información que nos interesa
        const { CoinInfo: { FullName, Name } } = crypto;

        // Crear el option y meterlo en el select
        const option = document.createElement('OPTION');
        option.textContent = `${FullName} (${Name})`;
        option.value = Name;
        selectCryptos.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    // Validar el objeto de la búsqueda
    const { moneda, criptomoneda } = objBusqueda;
    if (moneda === '' || criptomoneda === '') {
        imprimirAlerta('Ambos campos son obligatorios', 3)
        return;
    };

    // Consultar la API
    consultarAPI();
}

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    // Mostrar Spinner
    spinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]))
        .catch(error => console.error('NO SE JAJA'));
}

// Funciones de la UI
function mostrarCotizacion(cotizacion) {
    // Limpiar el HTML Previo
    limpiarHTML();

    // Sacar la información que necesitamos
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    // Crear el elemento HTML e insertarlo
    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `Precio más alto del día: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `Precio más alto del día: <span>${LOWDAY}</span>`;

    const cambio = document.createElement('P');
    cambio.innerHTML = `Cambio en las últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

    const actualizacion = document.createElement('P');
    actualizacion.innerHTML = `Actualizado por última vez: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(cambio);
    resultado.appendChild(actualizacion);
}

function imprimirAlerta(mensaje, tiempo) {
    // Borrar alerta anterior si la hay
    const alerta = document.querySelector('.alerta');

    if (alerta) {
        alerta.remove();
        return imprimirAlerta(mensaje, tiempo);
    }

    // Definir el HTML de la alerta e insertarlo
    const divMensaje = document.createElement('DIV');
    divMensaje.classList.add('error', 'alerta');
    divMensaje.textContent = mensaje;
    formulario.appendChild(divMensaje);

    // Eliminar la alerta luego de X segundos
    setTimeout(() => divMensaje.remove(), tiempo * 1000);
}

function spinner() {
    // Limpiar el HTML previo
    limpiarHTML();

    // Spinner tomado de https://tobiasahlin.com/spinkit/
    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner')
    spinner.innerHTML = `
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    `

    // Imprimirlo en el HTML
    resultado.appendChild(spinner);
}

function limpiarHTML() {
    while (resultado.firstChild) resultado.removeChild(resultado.firstChild);
}