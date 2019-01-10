class ProgressBar {
  
  constructor(opts) {
    this.hideClass = 'display_none';
    this.loadingClass = 'loading';
    Object.assign(this, opts);
    if (this.playQueue) {
      this.audio = this.playQueue.audio;
    }
    this.isSeeking = false;
    this.addListeners();
    this.setSizes();
  }
  
  addListeners() {
    this.removeListeners();
    if (this.back) {
      this.bindedBackClick = this.onClick.bind(this);
      document.querySelector(this.back).addEventListener('click', this.bindedBackClick);
    }
    if (this.front) {
      this.bindedFrontClick = this.onClick.bind(this);
      document.querySelector(this.front).addEventListener('click', this.bindedFrontClick);
    }
    if (this.thumb) {
      this.bindedThumbDown = this.onMouseDown.bind(this);
      document.querySelector(this.thumb).addEventListener('mousedown', this.bindedThumbDown);
      this.bindedThumbUp = this.onMouseUp.bind(this);
      document.querySelector(this.thumb).addEventListener('mouseup', this.bindedThumbUp);
    }
    if (this.playQueue) {
      this.bindedPlayQueueLoading = this.onLoading.bind(this);
      this.playQueue.on('loading', this.bindedPlayQueueLoading);
      this.bindedPlayQueuePlaying = this.onPlaying.bind(this);
      this.playQueue.on('playing', this.bindedPlayQueuePlaying);
    } else if (this.audio) {
      this.bindedAudioLoading = this.onLoading.bind(this);
      this.audio.addEventListener('loadstart', this.bindedAudioLoading);
      this.bindedAudioPlaying = this.onPlaying.bind(this);
      this.audio.addEventListener('canplay', this.bindedAudioPlaying);
    }
    if (this.audio) {
      this.bindedTimeUpdate = this.onTimeUpdate.bind(this);
      this.audio.addEventListener('timeupdate', this.bindedTimeUpdate);
      this.bindedDurationChange = this.onDurationChange.bind(this);
      this.audio.addEventListener('durationchange', this.bindedDurationChange);
      this.bindedSeeking = this.onSeeking.bind(this);
      this.audio.addEventListener('seeking', this.bindedSeeking);
      this.bindedSeeked = this.onSeeked.bind(this);
      this.audio.addEventListener('seeked', this.bindedSeeked);
      this.bindedProgress = this.onProgress.bind(this);
      if (this.loadingProgress) {
        this.audio.addEventListener('progress', this.bindedProgress);
      }
    }
    this.bindedSetSizes = this.setSizes.bind(this);
    window.addEventListener('resize', this.bindedSetSizes);
    this.bindedMouseMove = this.onMouseMove.bind(this);
    this.bindedMouseUp = this.onMouseUp.bind(this);
  }
  
  removeListeners() {
    document.querySelector(this.back).removeEventListener('click', this.bindedBackClick);
    document.querySelector(this.front).removeEventListener('click', this.bindedFrontClick);
    document.querySelector(this.thumb).removeEventListener('mousedown', this.bindedThumbDown);
    document.querySelector(this.thumb).removeEventListener('mouseup', this.bindedThumbUp);
    if (this.playQueue) {
      this.playQueue.off('loading', this.bindedPlayQueueLoading);
      this.playQueue.off('playing', this.bindedPlayQueuePlaying);
    }
    this.audio.removeEventListener('loadstart', this.bindedAudioLoading);
    this.audio.removeEventListener('canplay', this.bindedAudioPlaying);
    this.audio.removeEventListener('timeupdate', this.bindedTimeUpdate);
    this.audio.removeEventListener('durationchange', this.bindedDurationChange);
    this.audio.removeEventListener('seeking', this.bindedSeeking);
    this.audio.removeEventListener('seeked', this.bindedSeeked);
    this.audio.removeEventListener('progress', this.bindedProgress);
    window.removeEventListener('resize', this.bindedSetSizes);
  }
  
  setSizes(){
    if (this.back) {
      this.width = document.querySelector(this.back).offsetWidth;
      this.left = document.querySelector(this.back).offsetLeft;
      this.right = this.left + this.width;
    }
  }
  
  reset() {
    document.querySelector(this.thumb).classList.add(this.hideClass);
    document.querySelector(this.front).classList.add(this.hideClass);
    this.currentTimeText = '0:00';
    this.durationText = '0:00'; 
    this.timeBreakText = '';
    this.thumbLeft = 0;
    this.frontWidth = -101;
    this.percentageWidth = -100;
    this.requestAnimationFrame(this.draw);
  }
  
  onLoading(e) {
    this.reset()
    document.querySelector(this.back).classList.add(this.loadingClass);
    this.timeBreakText = "/";
  }
  
  onPlaying(e) {
    document.querySelector(this.thumb).classList.remove(this.hideClass);
    document.querySelector(this.front).classList.remove(this.hideClass);
    document.querySelector(this.back).classList.remove(this.loadingClass);
  }
  
  onTimeUpdate(e) {
    this.setPosition(e.target);
  }
  
  onDurationChange(e) {
    this.durationText = this.getMMSS(Math.floor(e.target.duration)); 
    this.requestAnimationFrame(this.draw);
  }
  
  onSeeking(e) {
    document.querySelector(this.back).classList.add(this.loadingClass);
  }
  
  onSeeked(e) {
    document.querySelector(this.back).classList.remove(this.loadingClass);
  }
  
  onProgress(e) {
    this.percentageWidth = (100 * (e.target.buffered.end / e.target.duration)) - 100;
    this.requestAnimationFrame(this.draw);
  }
  
  onMouseDown(e) {
    document.addEventListener('mousemove', this.bindedMouseMove);
    document.addEventListener('mouseup', this.bindedMouseUp);
    this.isSeeking = true;
    e.preventDefault();
  }
  
  onMouseMove(e) {
    let x = e.clientX;
    if (x < this.left) {
      x = this.left;
    }
    if (x > this.right) {
      x = this.right;
    }
    this.seekLeft = x - this.left;
  }
  
  onMouseUp(e) {
    document.removeEventListener('mousemove', this.bindedMouseMove);
    document.removeEventListener('mouseup', this.bindedMouseUp);
    this.isSeeking = false;
    const percentage = this.seekLeft / this.width;
    this.seek(percentage);
  }
  
  onClick = function(e){
    this.onMouseMove(e);
    const percentage = this.seekLeft / this.width;
    this.seek(percentage);
  }
  
  seek(percentage) {
    if (this.playQueue){
      this.playQueue.seek(percentage);
    } else if (this.audio){
      if (!isNaN(this.audio.duration)) {
        this.audio.currentTime = Math.floor(percentage * this.audio.duration);
      }
    }
  }
  
  getMMSS(secs) {
    let s = secs % 60;
    if (s < 10) {
      s = `0${s}`;
    }
    return `${Math.floor(secs/60)}:${s}`;
  }
  
  setPosition(audio) {
    this.currentTimeText = this.getMMSS(Math.floor(audio.currentTime));
    if (!isNaN(audio.duration)) {
      this.durationText = this.getMMSS(Math.floor(audio.duration));
    } else {
      this.durationText = '...';
    } 
    const percentage = audio.currentTime / audio.duration;
    if (this.isSeeking == false) {
      if ((this.width * percentage) > 0) {
        this.thumbLeft = this.width * percentage;
      }
      this.frontWidth = (100 * percentage) - 100;
    }
    this.requestAnimationFrame(this.draw);
  }
   
  update() {
    this.setPosition(this.audio);
  }
  
  draw() {
    document.querySelector(this.count).innerText = this.currentTimeText;
    document.querySelector(this.duration).innerText = this.durationText;
    document.querySelector(this.timeBreak).innerText = this.timeBreakText;
    document.querySelector(this.front).style.transform = 'translateX('+this.frontWidth+'%)';
    document.querySelector(this.loadingProgress).style.transform = 'translateX('+this.percentageWidth+'%)';
    if (this.thumb) {
      document.querySelector(this.thumb).style.left = this.thumbLeft;
    };
  }
  
  requestAnimationFrame(fn) {
    window.requestAnimationFrame(fn.bind(this));
  }
  
  
}

export {ProgressBar};