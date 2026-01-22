// LocalStorage keys
const STORAGE_KEYS = {
    ORARIO: 'agendaOrario',
    COMPITI: 'agendaCompiti',
    APPUNTI: 'agendaAppunti',
    RIPASSO: 'agendaRipasso'
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadOrario();
    loadCompiti();
    loadAppunti();
    loadRipasso();
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Orario form
    document.getElementById('orarioForm').addEventListener('submit', handleOrarioSubmit);
    
    // Compiti form
    document.getElementById('compitiForm').addEventListener('submit', handleCompitiSubmit);
    
    // Appunti form
  // Sezione Appunti â†’ creazione appunto + pulsante PDF + pulsante elimina
document.getElementById("appuntiForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const testo = document.getElementById("appunto").value.trim();
    if (!testo) return;

    // Elemento lista
    const li = document.createElement("li");
    li.classList.add("appunto-item");

    // Testo appunto
    const spanTesto = document.createElement("span");
    spanTesto.textContent = testo;

    // Pulsante PDF
    const btnPDF = document.createElement("button");
    btnPDF.textContent = "ðŸ“„";
    btnPDF.title = "Scarica PDF";
    btnPDF.classList.add("pdf-btn");

    btnPDF.addEventListener("click", function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(12);
        doc.text(testo, 10, 20);

        const data = new Date().toISOString().split("T")[0];
        doc.save(`Appunto_${data}.pdf`);
    });

    // Pulsante elimina
    const btnDelete = document.createElement("button");
    btnDelete.textContent = "ðŸ—‘ï¸";
    btnDelete.title = "Rimuovi appunto";
    btnDelete.classList.add("delete-btn");

    btnDelete.addEventListener("click", function () {
        li.remove();
    });

    // Inserimento elementi
    li.appendChild(spanTesto);
    li.appendChild(btnPDF);
    li.appendChild(btnDelete);

    document.getElementById("appuntiList").appendChild(li);

    // Reset
    document.getElementById("appunto").value = "";
});



    
    // Ripasso form
    document.getElementById('ripassoForm').addEventListener('submit', handleRipassoSubmit);
}

// ===== ORARIO FUNCTIONS =====
function handleOrarioSubmit(event) {
    event.preventDefault();
    
    const giorno = document.getElementById('giorno').value;
    const ora = document.getElementById('ora').value;
    const materia = document.getElementById('materia').value;
    
    const cellId = `${giorno}-${ora}`;
    const cell = document.getElementById(cellId);
    
    if (cell) {
        cell.textContent = materia;
        saveOrario();
        
        // Reset form
        document.getElementById('materia').value = '';
        
        // Show success feedback
        showFeedback('Orario aggiunto con successo!');
    }
}

function saveOrario() {
    const orario = {};
    const cells = document.querySelectorAll('.editable-cell');
    
    cells.forEach(cell => {
        if (cell.textContent.trim()) {
            orario[cell.id] = cell.textContent.trim();
        }
    });
    
    localStorage.setItem(STORAGE_KEYS.ORARIO, JSON.stringify(orario));
}

function loadOrario() {
    const orario = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORARIO) || '{}');
    
    Object.keys(orario).forEach(cellId => {
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.textContent = orario[cellId];
        }
    });
}

// ===== COMPITI FUNCTIONS =====
function handleCompitiSubmit(event) {
    event.preventDefault();
    
    const compito = document.getElementById('compito').value;
    const scadenza = document.getElementById('scadenza').value;
    
    const compitoObj = {
        id: Date.now(),
        descrizione: compito,
        scadenza: scadenza
    };
    
    const compiti = getCompiti();
    compiti.push(compitoObj);
    localStorage.setItem(STORAGE_KEYS.COMPITI, JSON.stringify(compiti));
    
    loadCompiti();
    
    // Reset form
    document.getElementById('compitiForm').reset();
    
    showFeedback('Compito aggiunto con successo!');
}

function deleteCompito(id) {
    const compiti = getCompiti().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.COMPITI, JSON.stringify(compiti));
    loadCompiti();
    showFeedback('Compito eliminato!');
}

function getCompiti() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPITI) || '[]');
}

function loadCompiti() {
    const list = document.getElementById('compitiList');
    list.innerHTML = '';
    
    const compiti = getCompiti();
    compiti.forEach(compito => {
        const li = document.createElement('li');
        const formattedDate = formatDate(compito.scadenza);
        
        li.innerHTML = `
            <div class="item-content">
                <strong>${compito.descrizione}</strong>
                <small>Scadenza: ${formattedDate}</small>
            </div>
            <button class="delete-btn" onclick="deleteCompito(${compito.id})">Elimina</button>
        `;
        
        list.appendChild(li);
    });
}

// ===== APPUNTI FUNCTIONS =====
function handleAppuntiSubmit(event) {
    event.preventDefault();
    
    const appunto = document.getElementById('appunto').value;
    
    const appuntoObj = {
        id: Date.now(),
        testo: appunto,
        data: new Date().toISOString()
    };
    
    const appunti = getAppunti();
    appunti.push(appuntoObj);
    localStorage.setItem(STORAGE_KEYS.APPUNTI, JSON.stringify(appunti));
    
    loadAppunti();
    
    // Reset form
    document.getElementById('appuntiForm').reset();
    
    showFeedback('Appunto aggiunto con successo!');
}

function deleteAppunto(id) {
    const appunti = getAppunti().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.APPUNTI, JSON.stringify(appunti));
    loadAppunti();
    showFeedback('Appunto eliminato!');
}

function getAppunti() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPUNTI) || '[]');
}

function loadAppunti() {
    const list = document.getElementById('appuntiList');
    list.innerHTML = '';
    
    const appunti = getAppunti();
    appunti.forEach(appunto => {
        const li = document.createElement('li');
        const formattedDate = formatDateTime(appunto.data);
        
        li.innerHTML = `
            <div class="item-content">
                <strong>${appunto.testo}</strong>
                <small>Creato: ${formattedDate}</small>
            </div>
            <button class="delete-btn" onclick="deleteAppunto(${appunto.id})">Elimina</button>
        `;
        
        list.appendChild(li);
    });
}

// ===== RIPASSO FUNCTIONS =====
function handleRipassoSubmit(event) {
    event.preventDefault();
    
    const argomento = document.getElementById('argomentoRipasso').value;
    const data = document.getElementById('dataRipasso').value;
    
    const ripassoObj = {
        id: Date.now(),
        argomento: argomento,
        data: data
    };
    
    const ripasso = getRipasso();
    ripasso.push(ripassoObj);
    localStorage.setItem(STORAGE_KEYS.RIPASSO, JSON.stringify(ripasso));
    
    loadRipasso();
    
    // Reset form
    document.getElementById('ripassoForm').reset();
    
    showFeedback('Argomento di ripasso aggiunto con successo!');
}

function deleteRipasso(id) {
    const ripasso = getRipasso().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RIPASSO, JSON.stringify(ripasso));
    loadRipasso();
    showFeedback('Argomento di ripasso eliminato!');
}

function getRipasso() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RIPASSO) || '[]');
}

function loadRipasso() {
    const list = document.getElementById('ripassoList');
    list.innerHTML = '';
    
    const ripasso = getRipasso();
    ripasso.forEach(item => {
        const li = document.createElement('li');
        const formattedDate = formatDate(item.data);
        
        li.innerHTML = `
            <div class="item-content">
                <strong>${item.argomento}</strong>
                <small>Data ripasso: ${formattedDate}</small>
            </div>
            <button class="delete-btn" onclick="deleteRipasso(${item.id})">Elimina</button>
        `;
        
        list.appendChild(li);
    });
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('it-IT', options);
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('it-IT', options);
}

function showFeedback(message) {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #FF8C00;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    // Remove after 3 seconds
    setTimeout(() => {
        feedback.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 300);
    }, 3000);
}

// Add animations to style
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
