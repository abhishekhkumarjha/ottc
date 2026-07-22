const { execSync } = require('child_process');

console.log('Starting build process...');

try {
  // Always build Vite frontend client
  console.log('Building client assets (Vite)...');
  execSync('npx vite build', { stdio: 'inherit' });

  // Only compile Express server if we are NOT on Vercel
  if (process.env.VERCEL === '1') {
    console.log('Vercel environment detected. Skipping server bundle build.');
  } else {
    console.log('Building server bundle (esbuild)...');
    execSync('npx esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs', { stdio: 'inherit' });
  }

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build step failed:', error.message);
  process.exit(1);
}
