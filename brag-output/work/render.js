const { chromium } = require('playwright');
const fs=require('fs');
(async () => {
  const [mode, ...rest] = process.argv.slice(2);
  const b = await chromium.launch({args:['--allow-file-access-from-files']});
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + __dirname + '/comp.html'); await p.evaluate(()=>window.ready);
  if (mode==='stills'){ fs.mkdirSync('stills',{recursive:true});
    for (const t of rest){ await p.evaluate(t=>window.render(t), +t); await p.screenshot({path:`stills/t${(+t).toFixed(2)}.jpg`,quality:80,type:'jpeg'}); } }
  else { fs.mkdirSync('out',{recursive:true}); const N=Math.round(23.7*30);
    for (let i=0;i<N;i++){ await p.evaluate(t=>window.render(t), i/30); await p.screenshot({path:`out/${String(i).padStart(4,'0')}.jpg`,quality:93,type:'jpeg'}); if(i%60==0) console.log(i); } }
  await b.close();
})();
