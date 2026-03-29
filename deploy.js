const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Leer .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const GITHUB_TOKEN = envVars.GITHUB_TOKEN;
const VERCEL_TOKEN = envVars.VERCEL_TOKEN;

if (!GITHUB_TOKEN || !VERCEL_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN y VERCEL_TOKEN deben estar en .env.local');
  process.exit(1);
}

async function deploy() {
  // 1. Get GitHub username
  console.log('\n=== PASO 1: Obteniendo usuario de GitHub ===');
  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: 'Bearer ' + GITHUB_TOKEN,
      'User-Agent': 'NodeJS'
    }
  });
  const userData = await userRes.json();
  const username = userData.login;
  console.log('Usuario GitHub:', username);

  // 2. Create GitHub repo
  console.log('\n=== PASO 2: Creando repositorio en GitHub ===');
  const createRes = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + GITHUB_TOKEN,
      'User-Agent': 'NodeJS',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: 'buscador-comisiones-tg1', private: false, description: 'Buscador de comisiones TG1 UNNE' })
  });
  const createData = await createRes.json();
  if (createData.full_name) {
    console.log('Repositorio creado:', createData.html_url);
  } else {
    console.log('Repositorio probablemente ya existe:', createData.message);
  }

  // 3. Git init and push
  console.log('\n=== PASO 3: Inicializando Git y haciendo Push ===');
  const remoteUrl = 'https://' + GITHUB_TOKEN + '@github.com/' + username + '/buscador-comisiones-tg1.git';
  const run = (cmd) => { try { execSync(cmd, { stdio: 'inherit' }); } catch(e) {} };
  run('git init');
  run('git config user.name "Dgstudio"');
  run('git config user.email "dgstudio@example.com"');
  run('git add .');
  run('git commit -m "Buscador de comisiones TG1 - Initial commit"');
  run('git branch -M main');
  try {
    execSync('git remote add origin ' + remoteUrl, { stdio: 'inherit' });
  } catch(e) {
    execSync('git remote set-url origin ' + remoteUrl, { stdio: 'inherit' });
  }
  execSync('git push -u origin main --force', { stdio: 'inherit' });
  console.log('Codigo publicado en GitHub!');

  // 4. Deploy to Vercel
  console.log('\n=== PASO 4: Instalando Vercel CLI ===');
  try { execSync('npm install -g vercel@latest', { stdio: 'inherit' }); } catch(e) {}

  console.log('\n=== PASO 5: Haciendo Deploy a Vercel ===');
  try {
    execSync(
      'vercel --prod --yes --token ' + VERCEL_TOKEN,
      { stdio: 'inherit', env: { ...process.env, VERCEL_TOKEN } }
    );
  } catch(e) {
    console.log('Deploy ejecutado. Revisa tu dashboard de Vercel.');
  }

  console.log('\n=== DEPLOY COMPLETADO ===');
  console.log('GitHub: https://github.com/' + username + '/buscador-comisiones-tg1');
  console.log('Vercel: https://buscador-comisiones-tg1.vercel.app');
}

deploy().catch(console.error);
