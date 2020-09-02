class ProgressBar {
  
  constructor(opts) {
    this.hideClass = 'display_none' || opts.hideClass;
    this.loadingClass = 'loading' || opts.loadingClass;
    if (opts.playQueue) {
      this.playQueue = opts.playQueue;
      this.audio = opts.playQueue.audio;
    } else if (opts.audio) {
      this.audio = opts.audio;
    }
    this.isSeeking = false;
    this.cacheElements(opts);
    this.addListeners();
    this.setSizes();
    setTimeout(this.setSizes, 1000);
  }
  
  cacheElements(opts) {
    if (opts.back) {
      this.back = document.querySelector(opts.back);
    }
    if (opts.front) {
      this.front = document.querySelector(opts.front);
      if (this.front) {
        this.front.style.pointerEvents = 'none';
      }
    }
    if (opts.thumb) {
      this.thumb = document.querySelector(opts.thumb);
    }
    if (opts.count) {
      this.count = document.querySelector(opts.count);
    }
    if (opts.duration) {
      this.duration = document.querySelector(opts.duration);
    }
    if (opts.timeBreak) {
      this.timeBreak = document.querySelector(opts.timeBreak);
    }
    
  }
  
  get pointerEvents() {
    let events = {
      'click': 'click',
      'down': 'mousedown',
      'up': 'mouseup',
      'move': 'mousemove'
    }
    if (window.PointerEvent) {
      events = {
        'click': 'pointerup',
        'down': 'pointerdown',
        'up': 'pointerup',
        'move': 'pointermove'
      }
    }
    return events;
  }
  
  addListeners() {
    
    if (this.back) {
      this.bindedBackClick = this.onClick.bind(this);
      this.back.addEventListener(this.pointerEvents.click, this.bindedBackClick);
    }
    if (this.thumb) {
      this.bindedThumbDown = this.onMouseDown.bind(this);
      this.thumb.addEventListener(this.pointerEvents.down, this.bindedThumbDown);
      this.bindedThumbUp = this.onMouseUp.bind(this);
      this.thumb.addEventListener(this.pointerEvents.up, this.bindedThumbUp);
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
  
  setSizes(){
    if (this.back) {
      let el = this.back;
      if (this.back.offsetParent) {
        el = this.back.offsetParent;
      }
      this.width = el.offsetWidth;
      this.left = el.offsetLeft;
      this.right = this.left + this.width;
    }
    if (this.thumb) {
      this.thumbWidth = this.thumb.offsetWidth;
    }
  }
  
  reset() {
    if (this.thumb) {
      this.thumb.classList.add(this.hideClass);
    }
    if (this.front) {
      this.front.classList.add(this.hideClass);
    }
    this.currentTimeText = '0:00';
    this.durationText = '0:00'; 
    this.timeBreakText = '';
    this.thumbLeft = 0;
    this.frontWidth = -101;
    this.percentageWidth = -100;
    this.isSeeking = false;
    this.requestAnimationFrame(this.draw);
  }
  
  onLoading(e) {
    this.reset()
    if (this.back) {
      this.back.classList.add(this.loadingClass);
    }
    this.timeBreakText = "/";
  }
  
  onPlaying(e) {
    this.setSizes();
    if (this.thumb) {
      this.thumb.classList.remove(this.hideClass);
    }
    if (this.front) {
      this.front.classList.remove(this.hideClass);
    }
    if (this.back) {
      this.back.classList.remove(this.loadingClass);
    }
  }
  
  onTimeUpdate(e) {
    this.setPosition(e.target);
  }
  
  onDurationChange(e) {
    if (e.target.duration) {
      if (e.target.duration === Infinity) {
        this.durationText = 'Live';
      } else {
        this.durationText = this.getMMSS(Math.floor(e.target.duration)); 
      }
      this.requestAnimationFrame(this.draw);
    }
  }
  
  onSeeking(e) {
    if (this.back) {
      this.back.classList.add(this.loadingClass);
    }
  }
  
  onSeeked(e) {
    if (this.back) {
      this.back.classList.remove(this.loadingClass);
    }
  }
  
  onProgress(e) {
    this.percentageWidth = (100 * (e.target.buffered.end / e.target.duration)) - 100;
    this.requestAnimationFrame(this.draw);
  }
  
  onMouseDown(e) {
    document.addEventListener(this.pointerEvents.move, this.bindedMouseMove);
    document.addEventListener(this.pointerEvents.up, this.bindedMouseUp);
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
    const seekPercentage = this.seekLeft / this.width;
    const seekedSeconds = this.audio.duration * seekPercentage;
    this.currentTimeText = this.getMMSS(Math.floor(seekedSeconds));
    const percentage = seekedSeconds / this.audio.duration;
    this.thumbLeft = this.width * percentage - this.thumbWidth;
    if (this.thumbLeft < 0) {
      this.thumbLeft = 0;
    }
    this.frontWidth = (100 * percentage) - 100;
    this.requestAnimationFrame(this.draw);
  }
  
  onMouseUp(e) {
    document.removeEventListener(this.pointerEvents.move, this.bindedMouseMove);
    document.removeEventListener(this.pointerEvents.up, this.bindedMouseUp);
    this.isSeeking = false;
    const percentage = this.seekLeft / this.width;
    this.seek(percentage);
  }
  
  onClick(e) {
    const percentage = e.offsetX / this.width;
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
  
  getMMSS(totalSeconds) {
    if (isNaN(totalSeconds) === false) {
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = totalSeconds % 60;
      let hourStr = '';
      let minStr = minutes;
      let secStr = seconds;
      if (hours > 0) {
        hourStr = `${hours}:`;
        if (minutes < 10) {
          minStr = `0${minutes}`;
        }
      }
      if (seconds < 10) {
        secStr = `0${seconds}`;
      }
      return `${hourStr}${minStr}:${secStr}`;
    } 
    return '';
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
      this.thumbLeft = this.width * percentage - this.thumbWidth;
      if (this.thumbLeft < 0) {
        this.thumbLeft = 0;
      }
      this.frontWidth = (100 * percentage) - 100;
      this.requestAnimationFrame(this.draw);
    }
  }
   
  update() {
    this.setPosition(this.audio);
  }
  
  draw() {
    if (this.count) {
      this.count.innerText = this.currentTimeText;
    }
    if (this.duration) {
      this.duration.innerText = this.durationText;
    }
    if (this.timeBreak) {
      this.timeBreak.innerText = this.timeBreakText;
    }
    if (this.front) {
      this.front.style.transform = `translateX(${this.frontWidth}%)`;
    }
    if (this.loadingProgress) {
      this.loadingProgress.style.transform = `translateX(${this.percentageWidth}%)`;
    }
    if (this.thumb) {
      this.thumb.style.transform = `translateX(${this.thumbLeft}px)`;
    };
  }
  
  requestAnimationFrame(fn) {
    window.requestAnimationFrame(fn.bind(this));
  }
  
}

export {ProgressBar};