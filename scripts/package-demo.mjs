import fs from 'node:fs';
const index=fs.readFileSync('dist/index.html','utf8');
const jsPath=index.match(/src="([^"]+\.js)"/)[1];
const cssPath=index.match(/href="([^"]+\.css)"/)[1];
const js=fs.readFileSync('dist'+jsPath,'utf8').replaceAll('</script','<\\/script');
const css=fs.readFileSync('dist'+cssPath,'utf8').replace(/@import[^;]+;/g,'');
const html=`<!doctype html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MPS · Démonstration des avatars</title><style>${css}</style></head><body><div id="app"></div><script type="module">${js}</script></body></html>`;
fs.writeFileSync('DEMO-OUVRIR.html',html);
console.log('Démonstration autonome créée : DEMO-OUVRIR.html');
