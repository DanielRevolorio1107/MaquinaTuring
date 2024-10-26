document.getElementById('run').addEventListener('click', runSimulation);
document.getElementById('save').addEventListener('click', saveConfiguration);
document.getElementById('load').addEventListener('click', loadConfiguration);
document.getElementById('clear').addEventListener('click', clearFields);

let states = [];
let alphabetInput = [];
let alphabetTape = [];
let transitions = {};
let tape = [];
let headPosition = 0;
let currentState = '';
let acceptingStates = [];

function runSimulation() {
    // Leer definiciones
    states = document.getElementById('states').value.split(',').map(s => s.trim());
    acceptingStates = document.getElementById('acceptingStates').value.split(',').map(s => s.trim());
    alphabetInput = document.getElementById('alphabetInput').value.split(',').map(a => a.trim());
    alphabetTape = document.getElementById('alphabetTape').value.split(',').map(a => a.trim());
    const inputString = document.getElementById('inputString').value.split('');
    
    // Verificar campos vacíos
    if (!document.getElementById('initialState').value || !document.getElementById('transitions').value) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
    }

    // Inicializar la cinta y el estado actual
    tape = inputString.concat(Array(50).fill(' ')); // Cinta con espacio adicional
    headPosition = 0;
    currentState = document.getElementById('initialState').value; // Estado inicial
    parseTransitions(document.getElementById('transitions').value);
    updateTapeDisplay();
    
    // Comenzar la simulación
    setTimeout(simulateStep, 1000);
}

function simulateStep() {
    if (headPosition < 0 || headPosition >= tape.length) {
        updateResult('Cadena rechazada');
        return;
    }

    const currentSymbol = tape[headPosition];
    const key = `${currentState},${currentSymbol}`;
    const transition = transitions[key];

    if (transition) {
        const [nextState, writeSymbol, direction] = transition;
        tape[headPosition] = writeSymbol; // Escribir en la cinta
        currentState = nextState; // Cambiar el estado
        
        // Mover cabezal
        headPosition += (direction === 'R' ? 1 : -1);
        
        updateTapeDisplay();
        document.getElementById('currentState').innerText = `Estado actual: ${currentState}`;

        // Verificar si el estado actual es de aceptación
        if (acceptingStates.includes(currentState)) {
            updateResult('Cadena aceptada');
        } else {
            // Repetir si hay más transiciones
            setTimeout(simulateStep, 1000);
        }
    } else {
        updateResult('Cadena rechazada');
    }
}

function parseTransitions(transitionsInput) {
    transitions = {};
    const lines = transitionsInput.split('\n');
    lines.forEach(line => {
        const [state, symbol, nextState, writeSymbol, direction] = line.split(',');
        if (state && symbol && nextState && writeSymbol && direction) {
            const key = `${state.trim()},${symbol.trim()}`;
            transitions[key] = [nextState.trim(), writeSymbol.trim(), direction.trim()];
        }
    });
}

function updateTapeDisplay() {
    const tapeArea = document.getElementById('tapeArea');
    tapeArea.innerHTML = '';
    tape.forEach((symbol, index) => {
        const cell = document.createElement('div');
        cell.className = 'cell' + (index === headPosition ? ' active' : '');
        cell.innerText = symbol;
        tapeArea.appendChild(cell);
    });
    const headPositionDisplay = document.getElementById('headPosition');
    headPositionDisplay.innerText = `Cabezal en posición: ${headPosition}`;
}

function updateResult(message) {
    document.getElementById('result').innerText = message;
}

// Función para guardar la configuración en localStorage
function saveConfiguration() {
    const configuration = {
        states: document.getElementById('states').value,
        initialState: document.getElementById('initialState').value,
        acceptingStates: document.getElementById('acceptingStates').value,
        alphabetInput: document.getElementById('alphabetInput').value,
        alphabetTape: document.getElementById('alphabetTape').value,
        transitions: document.getElementById('transitions').value,
        inputString: document.getElementById('inputString').value,
    };
    localStorage.setItem('turingMachineConfig', JSON.stringify(configuration));
    alert('Configuración guardada.');
}

// Función para cargar la configuración desde localStorage
function loadConfiguration() {
    const configuration = localStorage.getItem('turingMachineConfig');
    if (configuration) {
        const { states, initialState, acceptingStates, alphabetInput, alphabetTape, transitions, inputString } = JSON.parse(configuration);
        document.getElementById('states').value = states;
        document.getElementById('initialState').value = initialState;
        document.getElementById('acceptingStates').value = acceptingStates;
        document.getElementById('alphabetInput').value = alphabetInput;
        document.getElementById('alphabetTape').value = alphabetTape;
        document.getElementById('transitions').value = transitions;
        document.getElementById('inputString').value = inputString;
        alert('Configuración cargada.');
    } else {
        alert('No hay configuración guardada.');
    }
}

// Función para limpiar los campos de entrada
function clearFields() {
    document.getElementById('states').value = '';
    document.getElementById('initialState').value = '';
    document.getElementById('acceptingStates').value = '';
    document.getElementById('alphabetInput').value = '';
    document.getElementById('alphabetTape').value = '';
    document.getElementById('transitions').value = '';
    document.getElementById('inputString').value = '';
    document.getElementById('tapeArea').innerHTML = '';
    document.getElementById('headPosition').innerText = '';
    document.getElementById('currentState').innerText = '';
    document.getElementById('result').innerText = '';
}
