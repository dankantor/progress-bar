import {ProgressBar} from './../index.js';

class App {
  
  constructor() {
    const audio = new Audio();
    audio.src = 'example.m4a';
    const progressBar = new ProgressBar({
      'audio': audio,
      'count': '#current-time',
      'duration': '#duration',
      'timeBreak': '#time-break',
      'front': '#progress-front',
      'back': '#progress-back'
    });
    document.querySelector('#play').addEventListener('click', e => {
      audio.play();
    });
  }
  
}

window.addEventListener('load', e => {
  new App();
});