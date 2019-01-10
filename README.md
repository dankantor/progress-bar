Progress Bar
==============

Handles common functionality with a media progress bar such as updating current time position, duration, 
progress bar position, loading indicator and seeking.

Connects to [PlayQueue](https://www.npmjs.com/package/playqueue) or the native Audio object. 


## Install

```
npm install audio-progress-bar
```


## Usage

```js
  import {ProgressBar} from 'audio-progress-bar';
    
  const progressBar = new ProgressBar({
    'playQueue': playQueue, // optional if audio is provided
    'audio': audioObject, // optional if playQueue is provided
    'count': '#current-time',
    'duration': '#duration',
    'timeBreak': '#time-break',
    'front': '#progress-front',
    'back': '#progress-back'
  });
```

View the [example](example) to see how it is used.  