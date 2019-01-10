var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProgressBar = function () {
  function ProgressBar(opts) {
    _classCallCheck(this, ProgressBar);

    this.hideClass = 'display_none' || opts.hideClass;
    this.loadingClass = 'loading' || opts.loadingClass;
    // Object.assign(this, opts);
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
  }

  _createClass(ProgressBar, [{
    key: 'cacheElements',
    value: function cacheElements(opts) {
      if (opts.back) {
        this.back = document.querySelector(opts.back);
      }
      if (opts.front) {
        this.front = document.querySelector(opts.front);
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
  }, {
    key: 'addListeners',
    value: function addListeners() {
      this.removeListeners();
      if (this.back) {
        this.bindedBackClick = this.onClick.bind(this);
        this.back.addEventListener('click', this.bindedBackClick);
      }
      if (this.front) {
        this.bindedFrontClick = this.onClick.bind(this);
        this.front.addEventListener('click', this.bindedFrontClick);
      }
      if (this.thumb) {
        this.bindedThumbDown = this.onMouseDown.bind(this);
        this.thumb.addEventListener('mousedown', this.bindedThumbDown);
        this.bindedThumbUp = this.onMouseUp.bind(this);
        this.thumb.addEventListener('mouseup', this.bindedThumbUp);
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
  }, {
    key: 'removeListeners',
    value: function removeListeners() {
      if (this.back) {
        this.back.removeEventListener('click', this.bindedBackClick);
      }
      if (this.front) {
        this.front.removeEventListener('click', this.bindedFrontClick);
      }
      if (this.thumb) {
        this.thumb.removeEventListener('mousedown', this.bindedThumbDown);
        this.thumb.removeEventListener('mouseup', this.bindedThumbUp);
      }
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
  }, {
    key: 'setSizes',
    value: function setSizes() {
      if (this.back) {
        this.width = this.back.offsetWidth;
        this.left = this.back.offsetLeft;
        this.right = this.left + this.width;
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
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
      this.requestAnimationFrame(this.draw);
    }
  }, {
    key: 'onLoading',
    value: function onLoading(e) {
      this.reset();
      if (this.back) {
        this.back.classList.add(this.loadingClass);
      }
      this.timeBreakText = "/";
    }
  }, {
    key: 'onPlaying',
    value: function onPlaying(e) {
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
  }, {
    key: 'onTimeUpdate',
    value: function onTimeUpdate(e) {
      this.setPosition(e.target);
    }
  }, {
    key: 'onDurationChange',
    value: function onDurationChange(e) {
      this.durationText = this.getMMSS(Math.floor(e.target.duration));
      this.requestAnimationFrame(this.draw);
    }
  }, {
    key: 'onSeeking',
    value: function onSeeking(e) {
      if (this.back) {
        this.back.classList.add(this.loadingClass);
      }
    }
  }, {
    key: 'onSeeked',
    value: function onSeeked(e) {
      if (this.back) {
        this.back.classList.remove(this.loadingClass);
      }
    }
  }, {
    key: 'onProgress',
    value: function onProgress(e) {
      this.percentageWidth = 100 * (e.target.buffered.end / e.target.duration) - 100;
      this.requestAnimationFrame(this.draw);
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      document.addEventListener('mousemove', this.bindedMouseMove);
      document.addEventListener('mouseup', this.bindedMouseUp);
      this.isSeeking = true;
      e.preventDefault();
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var x = e.clientX;
      if (x < this.left) {
        x = this.left;
      }
      if (x > this.right) {
        x = this.right;
      }
      this.seekLeft = x - this.left;
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      document.removeEventListener('mousemove', this.bindedMouseMove);
      document.removeEventListener('mouseup', this.bindedMouseUp);
      this.isSeeking = false;
      var percentage = this.seekLeft / this.width;
      this.seek(percentage);
    }
  }, {
    key: 'onClick',
    value: function onClick(e) {
      this.onMouseMove(e);
      var percentage = this.seekLeft / this.width;
      this.seek(percentage);
    }
  }, {
    key: 'seek',
    value: function seek(percentage) {
      if (this.playQueue) {
        this.playQueue.seek(percentage);
      } else if (this.audio) {
        if (!isNaN(this.audio.duration)) {
          this.audio.currentTime = Math.floor(percentage * this.audio.duration);
        }
      }
    }
  }, {
    key: 'getMMSS',
    value: function getMMSS(secs) {
      var s = secs % 60;
      if (s < 10) {
        s = '0' + s;
      }
      return Math.floor(secs / 60) + ':' + s;
    }
  }, {
    key: 'setPosition',
    value: function setPosition(audio) {
      this.currentTimeText = this.getMMSS(Math.floor(audio.currentTime));
      if (!isNaN(audio.duration)) {
        this.durationText = this.getMMSS(Math.floor(audio.duration));
      } else {
        this.durationText = '...';
      }
      var percentage = audio.currentTime / audio.duration;
      if (this.isSeeking == false) {
        if (this.width * percentage > 0) {
          this.thumbLeft = this.width * percentage;
        }
        this.frontWidth = 100 * percentage - 100;
      }
      this.requestAnimationFrame(this.draw);
    }
  }, {
    key: 'update',
    value: function update() {
      this.setPosition(this.audio);
    }
  }, {
    key: 'draw',
    value: function draw() {
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
        this.front.style.transform = 'translateX(' + this.frontWidth + '%)';
      }
      if (this.loadingProgress) {
        this.loadingProgress.style.transform = 'translateX(' + this.percentageWidth + '%)';
      }
      if (this.thumb) {
        this.thumb.style.left = this.thumbLeft;
      }
    }
  }, {
    key: 'requestAnimationFrame',
    value: function requestAnimationFrame(fn) {
      window.requestAnimationFrame(fn.bind(this));
    }
  }]);

  return ProgressBar;
}();

export { ProgressBar };