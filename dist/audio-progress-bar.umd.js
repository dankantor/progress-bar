(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['progress-bar'] = {})));
}(this, (function (exports) { 'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProgressBar = function () {
  function ProgressBar(opts) {
    _classCallCheck(this, ProgressBar);

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

  _createClass(ProgressBar, [{
    key: 'cacheElements',
    value: function cacheElements(opts) {
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
  }, {
    key: 'addListeners',
    value: function addListeners() {
      if (this.back) {
        this.bindedBackClick = this.onClick.bind(this);
        this.back.addEventListener('click', this.bindedBackClick);
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
    key: 'setSizes',
    value: function setSizes() {
      if (this.back) {
        var el = this.back;
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
      this.isSeeking = false;
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
      var seekPercentage = this.seekLeft / this.width;
      var seekedSeconds = this.audio.duration * seekPercentage;
      this.currentTimeText = this.getMMSS(Math.floor(seekedSeconds));
      var percentage = seekedSeconds / this.audio.duration;
      this.thumbLeft = this.width * percentage - this.thumbWidth;
      if (this.thumbLeft < 0) {
        this.thumbLeft = 0;
      }
      this.frontWidth = 100 * percentage - 100;
      this.requestAnimationFrame(this.draw);
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
      var percentage = e.offsetX / this.width;
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
    value: function getMMSS(totalSeconds) {
      if (isNaN(totalSeconds) === false) {
        var hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        var hourStr = '';
        var minStr = minutes;
        var secStr = seconds;
        if (hours > 0) {
          hourStr = hours + ':';
          if (minutes < 10) {
            minStr = '0' + minutes;
          }
        }
        if (seconds < 10) {
          secStr = '0' + seconds;
        }
        return '' + hourStr + minStr + ':' + secStr;
      }
      return '';
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
        this.thumbLeft = this.width * percentage - this.thumbWidth;
        if (this.thumbLeft < 0) {
          this.thumbLeft = 0;
        }
        this.frontWidth = 100 * percentage - 100;
        this.requestAnimationFrame(this.draw);
      }
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
        this.thumb.style.transform = 'translateX(' + this.thumbLeft + 'px)';
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

exports.ProgressBar = ProgressBar;

Object.defineProperty(exports, '__esModule', { value: true });

})));
