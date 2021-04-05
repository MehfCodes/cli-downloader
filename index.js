#!/usr/bin/env node
let http;
const fs = require('fs');
const link = process.argv[2];
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

http.get(link, (res) => {
  let file;
  const contentType = res.headers['content-type'];
  const ext = contentType.split('/')[1];
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
  res.pipe(file);
});
