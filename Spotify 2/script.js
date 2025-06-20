 // Global vars
    let currentSong = new Audio();
    let element;
    let colorInterval = null; // to track background color timer

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    // Pad with 0 if less than 10
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    let formattedSeconds = secs < 10 ? "0" + secs : secs;

    return `${formattedMinutes}:${formattedSeconds}`;
}

    function getRandomRGB() {
      return `rgb(${Math.floor(Math.random() * 256)}, 
                   ${Math.floor(Math.random() * 256)}, 
                   ${Math.floor(Math.random() * 256)})`;
    }

    function changeGradient(element) {
      const color1 = getRandomRGB();
    //   const color2 = getRandomRGB();  it was not smooth as css cant apply transitions on gradient
    //   const color3 = getRandomRGB();
    //   element.style.background = `linear-gradient(to right, ${color1}, ${color2}, ${color3})`;
      element.style.background = color1 ;
    }

    // Play button toggle for card hover
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      const playBtn = card.querySelector(".playtoggle");

      card.addEventListener('mouseenter', () => {
        playBtn.classList.add('play');
      });

      card.addEventListener('mouseleave', () => {
        playBtn.classList.remove('play');
      });
    });

    // Fetching the songs
    async function getSongs() {
      let a = await fetch("http://127.0.0.1:3000/song");
      let response = await a.text();

      let div = document.createElement("div");
      div.innerHTML = response;
      let as = div.getElementsByTagName("a");

      let songs = [];
      for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
          songs.push(element.href);
        }
      }
      return songs;
    }

    function playSong(songName) {
      currentSong.src = "/song/" + songName;
      currentSong.play();
      play.src = "./assests/pause.svg";
      document.querySelector(".songinfo").innerHTML=songName;
      document.querySelector(".songtime").innerHTML='00:00/00:00';
    }

    async function main() {
      let songs = await getSongs();
      let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];

      for (const song of songs) {
        let filSong = song.split("/song/")[1].replaceAll("%20", " ");

        let getArtist = () => {
          if (filSong.includes("_")) {
            return filSong.split('_')[1];
          } else {
            return "unnamed";
          }
        };
        let artist = getArtist();

        songUl.innerHTML += `
          <li>
            <img class="invert" src="assests/song.svg" alt="song">
            <div class="info">
              <div class="songName">${filSong}</div>
              <div class="artist">${artist.split(".mp3")[0]}</div>
            </div>
            <div class="songPlay"> Play Now
              <img class="invert" src="./assests/playbar.svg" alt="playbar">
            </div>
          </li>`;
      }

      // Add click event to each song
      Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
          console.log(e.querySelector(".songName").innerHTML);
          playSong(e.querySelector(".songName").innerHTML);

          // Clear previous interval if running
          if (colorInterval) {
            clearInterval(colorInterval);
          }

          // Reset background of previous element
          if (element) {
            element.style.background = "";
          }

          // Set new element
          element = e;

          // Start gradient color change every second
          changeGradient(element);
          colorInterval = setInterval(() => changeGradient(element), 1000);
        });
      });

      // Play/pause toggle
      let play = document.getElementById("play");
      play.addEventListener("click", () => {
        if (currentSong.src === "") {
          currentSong.src = songs[0];
          currentSong.play();
          play.src = "./assests/pause.svg";
        } else if (currentSong.paused) {
          currentSong.play();
          play.src = "./assests/pause.svg";
        } else {
          currentSong.pause();
          play.src = "./assests/playbar.svg";
        }
      });

      //listen for timeup data 
      currentSong.addEventListener("timeupdate",()=>{
        // console.log(formatTime(currentSong.currentTime));
        document.querySelector(".songtime").innerHTML=`${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100+"%"
      });

      //seek bar circle moving
      document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent =(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent+"%";
        currentSong.currentTime=(currentSong.duration)*percent /100;
        // console.log((currentSong.duration)*percent /100);
        
  
      })
    }

    main();