let allMusic = [
  {
    name: 'Harley Bird - Home',
    artist: 'Jordan Schor',
    img: 'music-1',
    src: 'music-1',
  },
  {
    name: 'Ikson Anywhere – Ikson',
    artist: 'Audio Library',
    img: 'music-2',
    src: 'music-2',
  },
  {
    name: 'Beauz & Jvna - Crazy',
    artist: 'Beauz & Jvna',
    img: 'music-3',
    src: 'music-3',
  },
  {
    name: 'Hardwind - Want Me',
    artist: 'Mike Archangelo',
    img: 'music-4',
    src: 'music-4',
  },
  {
    name: 'Jim - Sun Goes Down',
    artist: 'Jim Yosef x Roy',
    img: 'music-5',
    src: 'music-5',
  },
  {
    name: 'Lost Sky - Vision NCS',
    artist: 'NCS Release',
    img: 'music-6',
    src: 'music-6',
  },
];

// Select all required elements
const wrapper = document.querySelector('.wrapper'),
  musicImg = wrapper.querySelector('.img-area img'),
  musicName = wrapper.querySelector('.song-details .name'),
  musicArtist = wrapper.querySelector('.song-details .artist'),
  playPauseBtn = wrapper.querySelector('.play-pause'),
  prevBtn = wrapper.querySelector('#prev'),
  nextBtn = wrapper.querySelector('#next'),
  mainAudio = wrapper.querySelector('#main-audio'),
  progressArea = wrapper.querySelector('.progress-area'),
  progressBar = progressArea.querySelector('.progress-bar'),
  musicList = wrapper.querySelector('.music-list'),
  moreMusicBtn = wrapper.querySelector('#more-music'),
  repeatBtn = wrapper.querySelector('#repeat-plist'),
  closemoreMusic = musicList.querySelector('#close');

let musicIndex = 3;

window.addEventListener('load', () => {
  loadMusic(musicIndex);
});

function loadMusic(index) {
  const selected = allMusic[index - 1];
  musicName.innerText = selected.name;
  musicArtist.innerText = selected.artist;
  musicImg.src = `images/${selected.img}.jpg`;
  mainAudio.src = `songs/${selected.src}.mp3`;
}

function playMusic() {
  wrapper.classList.remove('paused');
  playPauseBtn.querySelector('i').innerText = 'pause';
  mainAudio.play();
}
function pauseMusic() {
  wrapper.classList.add('paused');
  playPauseBtn.querySelector('i').innerText = 'play_arrow';
  mainAudio.pause();
}

function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}
function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}

// Handle Play and Pause Events
playPauseBtn.addEventListener('click', () => {
  const isMusicPaused = wrapper.classList.contains('paused');
  isMusicPaused ? playMusic() : pauseMusic();
});

// Handle Previous Music Event
prevBtn.addEventListener('click', () => {
  prevMusic();
});

// Handle Next Music Event
nextBtn.addEventListener('click', () => {
  nextMusic();
});

// Handle TimeUpdate Progress
mainAudio.addEventListener('timeupdate', (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector('.current'),
    musicDurationTime = wrapper.querySelector('.duration');

  mainAudio.addEventListener('loadeddata', () => {
    //  Update Music Duration Time
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDurationTime.innerText = `${totalMin}:${totalSec}`;
  });

  //  Update Music Current Time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// Handle Seek Audio Progress
progressArea.addEventListener('click', (e) => {
  let progressWidthValue = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;
  mainAudio.currentTime = (clickedOffsetX / progressWidthValue) * songDuration;
  playMusic();
});

// Handle Repeat Music
repeatBtn.addEventListener('click', () => {
  let text = repeatBtn.innerText;

  switch (text) {
    case 'repeat':
      repeatBtn.innerText = 'repeat_one';
      repeatBtn.setAttribute('title', 'Song Looped');
      break;
    case 'repeat_one':
      repeatBtn.innerText = 'shuffle';
      repeatBtn.setAttribute('title', 'Playback Shuffle');
      break;
    case 'shuffle':
      repeatBtn.innerText = 'repeat';
      repeatBtn.setAttribute('title', 'Playlist Looped');
      break;
  }
});

// Handle Song Ended
mainAudio.addEventListener('ended', () => {
  let text = repeatBtn.innerText;

  switch (text) {
    case 'repeat':
      nextMusic();
      break;
    case 'repeat_one':
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case 'shuffle':
      let randomIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randomIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex === randomIndex);
      musicIndex = randomIndex;
      loadMusic(musicIndex);
      playMusic();
      break;
  }
});

// Handle Show Playlist
moreMusicBtn.addEventListener('click', () => {
  musicList.classList.toggle('show');
});

// Handle Close Playlist
closemoreMusic.addEventListener('click', () => {
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector('ul');
// let create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${
    allMusic[i].src
  }.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML('beforeend', liTag); //inserting the li inside ul tag

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener('loadeddata', () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) {
      //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    }
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
    liAudioDuartionTag.setAttribute('t-duration', `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
  });
}

function playingSong() {
  const allLiTag = ulTag.querySelectorAll('li');

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector('.audio-duration');

    if (allLiTag[j].classList.contains('playing')) {
      allLiTag[j].classList.remove('playing');
      let adDuration = audioTag.getAttribute('t-duration');
      audioTag.innerText = adDuration;
    }

    //if the li tag index is equal to the musicIndex then add playing class in it
    if (allLiTag[j].getAttribute('li-index') == musicIndex) {
      allLiTag[j].classList.add('playing');
      audioTag.innerText = 'Playing';
    }

    allLiTag[j].setAttribute('onclick', 'clicked(this)');
  }
}

//particular li clicked function
function clicked(element) {
  let getLiIndex = element.getAttribute('li-index');
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
