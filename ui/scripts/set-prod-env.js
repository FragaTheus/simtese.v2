// Generates src/environments/environment.ts and environment.prod.ts from the
// API_URL env var before building. Needed because environment.ts is gitignored
// and otherwise wouldn't exist on the Vercel build machine.
const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL;
if (!apiUrl) {
  console.error('Missing API_URL environment variable.');
  process.exit(1);
}

const envDir = path.join(__dirname, '..', 'src', 'environments');

const prodContent = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
};
`;

const devContent = `export const environment = {
  production: false,
  apiUrl: '${apiUrl}',
};
`;

fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), prodContent);
fs.writeFileSync(path.join(envDir, 'environment.ts'), devContent);

console.log(`environment files generated with apiUrl=${apiUrl}`);
