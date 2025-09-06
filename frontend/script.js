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

// Verificar status automaticamente ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    addLog('Aplicação carregada');
    checkServerStatus();
});
