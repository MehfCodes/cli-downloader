#!/usr/bin/env node
let http;
const fs = require('fs');
const ProgressBar = require('./progressbar');

const link =
  'https://host2.rj-mw1.com/media/mp3/mp3-256/' +
  process.argv[2].substring(process.argv[2].lastIndexOf('/') + 1) +
  '.mp3';
let pathFile = process.argv[3];
if (link.startsWith('https')) {
  http = require('https');
} else if (link.startsWith('http')) {
  http = require('http');
}

if (!pathFile) {
  console.log('please enter path file');
  process.exit(1);
}

http
  .get(link, (res) => {
    let file;
    const contentType = res.headers['content-type'];
    let ext = contentType.split('/')[1];
    if (ext === 'mpeg') ext = 'mp3';
    let nameFile = `${link.substring(
      link.lastIndexOf('/') + 1,
      link.lastIndexOf('.')
    )}-${Date.now()}.${ext}`;
    if (!fs.existsSync(pathFile)) {
      pathFile = `${__dirname}/${pathFile}`;
      fs.mkdirSync(pathFile);
    }

    const finalPath = `${pathFile}/${nameFile}`;
    file = fs.createWriteStream(finalPath);
    const progressBar = new ProgressBar(res.headers['content-length']);
    res
      .on('data', (chunk) => {
        progressBar.addChunk(chunk.length);
        progressBar.showProgressBar();
      })
      .pipe(file);
  })
  .on('error', (err) => {
    console.log(err);
  });
