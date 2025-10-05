
// Defina aqui o tipo do frontend: 'blue', 'green', 'antigo', 'novo'
const FRONTEND_TYPE = 'blue'; // altere para 'green', 'antigo' ou 'novo' conforme necessário
const API_BASE_URL = 'http://localhost:3002';

// Elementos DOM
const checkStatusBtn = document.getElementById('checkStatus');
const serverInfoDiv = document.getElementById('serverInfo');
const stressTestBtn = document.getElementById('stressTest');
const requestCountInput = document.getElementById('requestCount');
const stressResultsDiv = document.getElementById('stressResults');
const logsDiv = document.getElementById('logs');

// Função para adicionar logs
function addLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `<span class="log-timestamp">[${timestamp}]</span> ${message}`;
    logsDiv.appendChild(logEntry);
    logsDiv.scrollTop = logsDiv.scrollHeight;
}

// Verificar status do servidor
async function checkServerStatus() {
    try {
        checkStatusBtn.disabled = true;
        checkStatusBtn.textContent = 'Verificando...';
        
        addLog('Verificando status do servidor...');
        
        const response = await fetch(`${API_BASE_URL}/status`);
        const data = await response.json();
        
        serverInfoDiv.innerHTML = `
            <div>Status: ${data.status}</div>
            <div>Ambiente: <strong>${data.environment}</strong></div>
            <div>Timestamp: ${data.timestamp}</div>
            <div>Uptime: ${data.uptime}s</div>
        `;
        
        // Aplicar classe baseada no ambiente
        serverInfoDiv.className = `server-info ${data.environment.toLowerCase()}`;
        
        addLog(`Servidor respondendo - Ambiente: ${data.environment}`, 'success');
        
    } catch (error) {
        serverInfoDiv.innerHTML = `<div>Erro: Não foi possível conectar ao servidor</div>`;
        serverInfoDiv.className = 'server-info error';
        addLog(`Erro ao verificar status: ${error.message}`, 'error');
    } finally {
        checkStatusBtn.disabled = false;
        checkStatusBtn.textContent = 'Verificar Status';
    }
}

// Teste de estresse
async function runStressTest() {
    const requestCount = parseInt(requestCountInput.value);
    
    if (requestCount < 1 || requestCount > 1000) {
        alert('Número de requisições deve estar entre 1 e 1000');
        return;
    }
    
    try {
        stressTestBtn.disabled = true;
        stressTestBtn.textContent = 'Executando...';
        
        addLog(`Iniciando teste de estresse com ${requestCount} requisições...`);
        
        const startTime = Date.now();
        const promises = [];
        
        // Criar todas as requisições
        for (let i = 0; i < requestCount; i++) {
            promises.push(
                fetch(`${API_BASE_URL}/stress`)
                    .then(response => response.json())
                    .catch(error => ({ error: error.message }))
            );
        }
        
        // Aguardar todas as requisições
        const results = await Promise.all(promises);
        const endTime = Date.now();
        
        // Analisar resultados
        const totalTime = endTime - startTime;
        const successCount = results.filter(r => !r.error).length;
        const errorCount = results.filter(r => r.error).length;
        const avgResponseTime = totalTime / requestCount;
        
        stressResultsDiv.innerHTML = `
            <div><strong>Resultados do Teste de Estresse:</strong></div>
            <div>Total de requisições: ${requestCount}</div>
            <div>Requisições bem-sucedidas: ${successCount}</div>
            <div>Requisições com erro: ${errorCount}</div>
            <div>Tempo total: ${totalTime}ms</div>
            <div>Tempo médio por requisição: ${avgResponseTime.toFixed(2)}ms</div>
            <div>Requisições por segundo: ${(requestCount / (totalTime / 1000)).toFixed(2)}</div>
        `;
        
        addLog(`Teste concluído: ${successCount}/${requestCount} sucessos em ${totalTime}ms`);
        
    } catch (error) {
        stressResultsDiv.innerHTML = `<div>Erro durante o teste: ${error.message}</div>`;
        addLog(`Erro no teste de estresse: ${error.message}`, 'error');
    } finally {
        stressTestBtn.disabled = false;
        stressTestBtn.textContent = 'Executar Teste de Estresse';
    }
}

// Event listeners
checkStatusBtn.addEventListener('click', checkServerStatus);
stressTestBtn.addEventListener('click', runStressTest);


// Intervalo de checagem automática (em segundos)
let statusCheckIntervalSec = 10; // valor padrão
let statusCheckTimer = null;

function startAutoStatusCheck() {
    // Limpa timer anterior se existir
    if (statusCheckTimer) clearInterval(statusCheckTimer);
    statusCheckTimer = setInterval(checkServerStatus, statusCheckIntervalSec * 1000);
}


// Função para aplicar cor e aviso visual do frontend
function applyFrontendStyle() {
    let color = '';
    let text = '';
    switch (FRONTEND_TYPE) {
        case 'blue':
            color = '#e3f2fd';
            text = 'SPA BLUE (Frontend Antigo)';
            break;
        case 'green':
            color = '#e8f5e8';
            text = 'SPA GREEN (Frontend Novo)';
            break;
        case 'antigo':
            color = '#fffbe6';
            text = 'SPA Antigo';
            break;
        case 'novo':
            color = '#e0f7fa';
            text = 'SPA Nova';
            break;
        default:
            color = '#ffffff';
            text = 'SPA (Sem identificação)';
    }
    document.body.style.background = color;
    // Adiciona banner no topo
    let banner = document.createElement('div');
    banner.textContent = text;
    banner.style.position = 'fixed';
    banner.style.top = '0';
    banner.style.left = '0';
    banner.style.width = '100%';
    banner.style.padding = '12px 0';
    banner.style.textAlign = 'center';
    banner.style.fontWeight = 'bold';
    banner.style.fontSize = '1.2em';
    banner.style.zIndex = '9999';
    banner.style.background = color;
    banner.style.borderBottom = '2px solid #bbb';
    banner.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
    document.body.prepend(banner);
}

document.addEventListener('DOMContentLoaded', () => {
    applyFrontendStyle();
    addLog('Aplicação carregada');
    checkServerStatus();
    startAutoStatusCheck();
});
