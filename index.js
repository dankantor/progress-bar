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
  
  // todo get with w/o jquery
  setSizes(){
    if (this.back) {
      this.width = $(this.back).width();
      this.left = $(this.back).offset().left;
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
    document.addEventListener('mousemove', this.onMouseMove.bind(this);
    document.addEventListener('mouseup', this.onMouseUp.bind(this);
    this.isSeeking = true;
    e.preventDefault();
  }
  
  
}

export {ProgressBar};







// mouseMove on thumb listener
ProgressBar.prototype.mouseMove = function(e){
    var x = e.clientX;
    if(x < this.left){
        x = this.left;
    }
    if(x > this.right){
        x = this.right;
    }
    this.seekLeft = x - this.left;
    //$(this.thumb).css("left", this.seekLeft);
    //$(this.front).css("width", this.seekLeft);
}

// mouseUp on thumb listener
ProgressBar.prototype.mouseUp = function(e){
    $(document).unbind(
        'mousemove', 
        $.proxy(this, 'mouseMove')
    );
    $(document).unbind(
        'mouseup', 
        $.proxy(this, 'mouseUp')
    );
    this.isSeeking = false;
    var percentage = this.seekLeft / this.width;
    this.seek(percentage);
}

// click on front and back listener
ProgressBar.prototype.click = function(e){
    this.mouseMove(e);
    var percentage = this.seekLeft / this.width;
    this.seek(percentage);
}

// user seeked. Call playQueue or audio directly
ProgressBar.prototype.seek = function(percentage){
    if(this.playQueue){
        this.playQueue.seek(percentage);
    }
    else{
        if(this.audio){
            if (!isNaN(this.audio.duration)){
                this.audio.currentTime = Math.floor(percentage * this.audio.duration);
            }
        }
    }
}

// return integer as minutes:seconds
ProgressBar.prototype.getMMSS = function (secs) {
    var s = secs % 60;
    if (s < 10) {
        s = "0" + s;
    }
    return Math.floor(secs/60) + ":" + s;
}

// set positions and time
ProgressBar.prototype.setPosition = function(audio){
    this.currentTimeText = this.getMMSS(Math.floor(audio.currentTime));
    if(!isNaN(audio.duration)){
        this.durationText = this.getMMSS(Math.floor(audio.duration));
    } 
    else{
        this.durationText = '...';
    } 
    var percentage = audio.currentTime / audio.duration;
    if(this.isSeeking == false) {
        if((this.width * percentage) > 0){
            this.thumbLeft = this.width * percentage;
        }
        this.frontWidth = (100 * percentage) - 100;
    }
    this.requestAnimationFrame(this.draw);
}

// manually call this to update position 
ProgressBar.prototype.update = function(){
    this.setPosition(this.audio);
}

// draw the dom changes
ProgressBar.prototype.draw = function() {
    $(this.count).text(this.currentTimeText);
    $(this.duration).text(this.durationText);
    $(this.timeBreak).text(this.timeBreakText);
    $(this.front).css('-webkit-transform', 'translateX('+this.frontWidth+'%)');
    $(this.loadingProgress).css('-webkit-transform', 'translateX('+this.percentageWidth+'%)');
    if(this.thumb){
        $(this.thumb).css('left', this.thumbLeft);
    };
}

// only use rAF if we've got it
ProgressBar.prototype.requestAnimationFrame = function(func){
    var rAF = window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame;
    if(rAF){
        rAF($.proxy(func, this));
    }
    else{
        func.call(this);
    }
}


// check if we've got require
if(typeof module !== "undefined"){
    module.exports = ProgressBar;
}
else{
    window.ProgressBar = ProgressBar;
}

}()); // end wrapper