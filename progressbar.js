const process = require('process');
const rdl = require('readline');
const rl = rdl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class ProgressBar {
  constructor(totalSize) {
    this.totalSize = totalSize;
    this.percentage = 0;
    this.downloaded = 0;
    this.progressBarWidth = 20;
    this.cursor = rl.cursor;
    this.cursorForPercentage = 25;
    this.drawLines();
  }
  addChunk(chunk) {
    this.downloaded += chunk;
  }
  calcutePercentage() {
    this.percentage = parseFloat(
      ((this.downloaded / this.totalSize) * 100).toFixed(2)
    );
    return this.percentage;
  }

  drawLines() {
    process.stdout.write('\x1B[?25l');
    process.stdout.write('[');
    for (let i = 0; i < 20; i++) {
      process.stdout.write('\x1b[37m');
      rl.write('.');
    }
    process.stdout.write(']');
    this.cursor++;
    rdl.cursorTo(process.stdout, this.cursor);
  }
  showPercentage() {
    rdl.cursorTo(process.stdout, this.cursorForPercentage);
    process.stdout.write(`${this.percentage}%`);
    rdl.cursorTo(process.stdout, this.cursor);
  }
  showProgressBar() {
    this.showPercentage();
    const points = Array.from(
      { length: this.progressBarWidth + 1 },
      (v, i) => i * 5
    );

    // if (parseInt(this.calcutePercentage()) >= points[this.cursor]) {
    let currentBars = Math.floor(parseInt(this.calcutePercentage()) / 5);
    let nextSteps = currentBars - this.cursor;
    for (let i = 0; i < nextSteps; i++) {
      process.stdout.write('\x1b[47m');
      process.stdout.write('\x1b[8m');
      rl.write('\u2588');
      process.stdout.write('\x1b[0m');
      this.cursor++;
    }

    if (this.cursor >= this.progressBarWidth) {
      process.stdout.write('\x1B[?25h');
      process.stdout.clearLine();
      rdl.cursorTo(process.stdout, 0);
      process.stdout.write('download finished');
      rl.close();
      return;
    }
    // }
  }
}

module.exports = ProgressBar;
