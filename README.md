# Blue Green Deployment Test Application

Esta é uma aplicação simples para testes de Blue-Green deployment, criada para simular cenários de deploy em uma VPS.

## Estrutura do Projeto

```
BlueGreen/
├── frontend/
│   ├── index.html      # Página principal
│   ├── style.css       # Estilos CSS
│   └── script.js       # JavaScript para interação
├── backend/
│   ├── server.js       # Servidor Express
│   ├── package.json    # Dependências do Node.js
│   ├── .env.dev       # Configuração DEV (porta 3000)
│   ├── .env.blue      # Configuração BLUE (porta 3001)
│   └── .env.green     # Configuração GREEN (porta 3002)
├── start-blue.bat     # Script para iniciar ambiente BLUE
└── start-green.bat    # Script para iniciar ambiente GREEN
```

## Funcionalidades

### Frontend
- Interface web simples com HTML, CSS e JavaScript
- Botão para verificar status do servidor
- Campo numérico para configurar quantidade de requisições
- Botão para executar teste de estresse
- Display do ambiente atual (BLUE/GREEN)
- Logs em tempo real das operações

### Backend
- Servidor Express simples
- Rota `/status` - Verifica se o servidor está funcionando
- Rota `/stress` - Endpoint para receber requisições de teste de estresse
- Variável de ambiente para identificar BLUE ou GREEN
- Cors habilitado para requisições do frontend
- Logs detalhados das requisições

## Como Usar

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Executar Ambientes

#### Ambiente DEV (Desenvolvimento)
```bash
cd backend
npm run dev
# Servidor roda na porta 3000
```

#### Ambiente BLUE
```bash
cd backend
npm run blue
# Servidor roda na porta 3001
```

#### Ambiente GREEN
```bash
cd backend
npm run green
# Servidor roda na porta 3002
```

### 3. Executar com PM2 (Produção)

#### PM2 DEV
```bash
cd backend
npm run pm2-dev
```

#### PM2 BLUE
```bash
cd backend
npm run pm2-blue
```

#### PM2 GREEN
```bash
cd backend
npm run pm2-green
```

### 4. Abrir Frontend
Abra o arquivo `frontend/index.html` no navegador ou use um servidor web local.

**Importante**: Configure a URL do backend no arquivo `frontend/script.js` de acordo com o ambiente:
- DEV: `http://localhost:3000`
- BLUE: `http://localhost:3001` 
- GREEN: `http://localhost:3002`

## Endpoints da API

### DEV (porta 3000)
- `GET http://localhost:3000/` - Informações gerais do servidor
- `GET http://localhost:3000/status` - Status detalhado do servidor
- `GET http://localhost:3000/stress` - Endpoint para teste de carga
- `GET http://localhost:3000/health` - Health check simples
- `POST http://localhost:3000/reset` - Reset das estatísticas

### BLUE (porta 3001)
- `GET http://localhost:3001/` - Informações gerais do servidor
- `GET http://localhost:3001/status` - Status detalhado do servidor
- `GET http://localhost:3001/stress` - Endpoint para teste de carga
- `GET http://localhost:3001/health` - Health check simples
- `POST http://localhost:3001/reset` - Reset das estatísticas

### GREEN (porta 3002)
- `GET http://localhost:3002/` - Informações gerais do servidor
- `GET http://localhost:3002/status` - Status detalhado do servidor
- `GET http://localhost:3002/stress` - Endpoint para teste de carga
- `GET http://localhost:3002/health` - Health check simples
- `POST http://localhost:3002/reset` - Reset das estatísticas

## Configuração de Ambiente

### Arquivo .env.dev (DEV)
```
ENVIRONMENT=DEV
PORT=3000
```

### Arquivo .env.blue (BLUE)
```
ENVIRONMENT=BLUE
PORT=3001
```

### Arquivo .env.green (GREEN)
```
ENVIRONMENT=GREEN
PORT=3002
```

## Para Deploy na VPS

1. Copie os arquivos para sua VPS
2. Instale as dependências: `npm install`
3. Configure um proxy reverso (nginx) para alternar entre as portas 3001 (BLUE) e 3002 (GREEN)
4. Use PM2 para gerenciar os processos em produção

### Scripts disponíveis:
- `npm run dev` - Ambiente de desenvolvimento (porta 3000)
- `npm run blue` - Ambiente BLUE (porta 3001)  
- `npm run green` - Ambiente GREEN (porta 3002)
- `npm run pm2-dev` - PM2 desenvolvimento
- `npm run pm2-blue` - PM2 BLUE (2 instâncias)
- `npm run pm2-green` - PM2 GREEN (2 instâncias)

### Exemplo de configuração nginx:
```nginx
upstream backend {
    server localhost:3001;  # BLUE
    # server localhost:3002;  # GREEN (alternar comentários para deploy)
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

### Deploy Blue-Green com PM2:
```bash
# Iniciar ambiente BLUE
npm run pm2-blue

# Para fazer deploy GREEN (zero downtime)
npm run pm2-green

# Parar ambiente BLUE após validação
pm2 stop blue
pm2 delete blue
```

## Teste de Estresse

A aplicação permite executar testes de carga simples:
1. Configure o número de requisições (1-1000)
2. Clique em "Executar Teste de Estresse"
3. Veja os resultados: tempo total, requisições por segundo, etc.

## Configuração do Frontend

Para testar diferentes ambientes, edite o arquivo `frontend/script.js` e altere a variável `API_BASE_URL`:

```javascript
// Para DEV
const API_BASE_URL = 'http://localhost:3000';

// Para BLUE  
const API_BASE_URL = 'http://localhost:3001';

// Para GREEN
const API_BASE_URL = 'http://localhost:3002';
```

## Logs

O frontend mostra logs em tempo real de todas as operações, facilitando o monitoramento durante os testes de deployment.

---

**Nota**: Esta aplicação é destinada apenas para testes de Blue-Green deployment. Não use em produção sem as devidas configurações de segurança.
