const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.ENVIRONMENT || 'BLUE';

// Middleware
app.use(cors());
app.use(express.json());

// Variáveis para estatísticas
let startTime = Date.now();
let requestCount = 0;
let stressRequestCount = 0;

// Middleware para contar requisições
app.use((req, res, next) => {
    requestCount++;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Request #${requestCount}`);
    next();
});

// Rota de status
app.get('/status', (req, res) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    
    res.json({
        status: 'OK',
        environment: ENVIRONMENT,
        timestamp: new Date().toISOString(),
        uptime: uptime,
        totalRequests: requestCount,
        stressRequests: stressRequestCount,
        server: {
            port: PORT,
            nodeVersion: process.version,
            platform: process.platform
        }
    });
});

// Rota para teste de estresse
app.get('/stress', (req, res) => {
    stressRequestCount++;
    
    // Simular algum processamento
    const processingTime = Math.random() * 50; // 0-50ms
    
    setTimeout(() => {
        res.json({
            message: 'Stress test response',
            environment: ENVIRONMENT,
            requestNumber: stressRequestCount,
            processingTime: Math.round(processingTime),
            timestamp: new Date().toISOString()
        });
    }, processingTime);
});

// Rota para reset de estatísticas
app.post('/reset', (req, res) => {
    startTime = Date.now();
    requestCount = 0;
    stressRequestCount = 0;
    
    res.json({
        message: 'Statistics reset',
        environment: ENVIRONMENT,
        timestamp: new Date().toISOString()
    });
});

// Rota de health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        environment: ENVIRONMENT,
        timestamp: new Date().toISOString()
    });
});

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: `Blue Green Deployment Test Server - ${ENVIRONMENT}`,
        environment: ENVIRONMENT,
        timestamp: new Date().toISOString(),
        endpoints: {
            status: '/status',
            stress: '/stress',
            health: '/health',
            reset: '/reset (POST)'
        }
    });
});

// Middleware de tratamento de erro
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    res.status(500).json({
        error: 'Internal Server Error',
        environment: ENVIRONMENT,
        timestamp: new Date().toISOString()
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        environment: ENVIRONMENT,
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${ENVIRONMENT}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   GET  http://localhost:${PORT}/`);
    console.log(`   GET  http://localhost:${PORT}/status`);
    console.log(`   GET  http://localhost:${PORT}/stress`);
    console.log(`   GET  http://localhost:${PORT}/health`);
    console.log(`   POST http://localhost:${PORT}/reset`);
    console.log(`\n⏰ Started at: ${new Date().toISOString()}\n`);
});

// Tratamento de sinais para shutdown graceful
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received, shutting down gracefully');
    process.exit(0);
});
