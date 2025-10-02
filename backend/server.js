// Node.js wrapper per bypassare problemi di risoluzione moduli TypeScript
// Questo file forza CommonJS e registra ts-node correttamente

// Registra ts-node prima di tutto
require('ts-node/register');

// Configurazione ts-node
require('ts-node').register({
  transpileOnly: true,
  files: true,
  compilerOptions: {
    module: 'commonjs',
    target: 'es2020',
    moduleResolution: 'node',
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    skipLibCheck: true,
    strict: false
  }
});

// Carica l'applicazione principale
require('./src/index.ts');
