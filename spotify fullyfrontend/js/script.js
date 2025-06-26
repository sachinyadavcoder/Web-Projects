// Global vars
let currentSong = new Audio();
let element;
let songs;
let currFolder;
let index = 0;



function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  // Pad with 0 if less than 10
  let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  let formattedSeconds = secs < 10 ? "0" + secs : secs;

  return `${formattedMinutes}:${formattedSeconds}`;
}



// Fetching the songs
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }

  // show all songs in the playlist
  let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    let filSong = song.split(`/${currFolder}/`)[1].replaceAll("%20", " ");
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
            <div class="songPlay">  <div class="playnow">Play Now</div>
              <img class="invert" src="./assests/playbar.svg" alt="playbar">
            </div>
          </li>`;
  }

  // Add click event to each song
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", () => {
      console.log(e.querySelector(".songName").innerHTML);
      playSong(e.querySelector(".songName").innerHTML);
    });
  });

}

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:3000/song`);
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/song")) {
      let folder = e.href.split("/").slice(-2)[0];
      //get metadata of folder
      let a = await fetch(`http://127.0.0.1:3000/song/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
                        <div class="playtoggle"> <!-- class=play -->
                            <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
                                style="cursor: pointer;">
                                <!-- Green Circle -->
                                <circle cx="50" cy="50" r="50" fill="#1ed760" />

                                <!-- Green Play Symbol -->
                                <polygon points="40,30 40,70 70,50" fill="black" />
                            </svg>
                        </div>

                        <img src="song/${folder}/cover.jpg" alt="Playlist">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`

    }

  }

  // Load the playlist whenever the card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async (item) => {
      console.log("card is clicked");
      console.log(item.currentTarget.dataset.folder);
      currFolder = item.currentTarget.dataset.folder;
      await getSongs(`song/${item.currentTarget.dataset.folder}`);
      index = 0; // or use: songs.indexOf(currentSong.src);
      playSong(songs[index].split(`${currFolder}/`)[1].replaceAll("%20", " "));
      console.log(songs);

    });
  });

}

function playSong(songName) {
  currentSong.src = `/${currFolder}/` + songName;
  currentSong.play();
  play.src = "./assests/pause.svg";
  document.querySelector(".songinfo").innerHTML = songName;
  document.querySelector(".songtime").innerHTML = '00:00/00:00';
}

async function main() {
  await getSongs("song/ncs");
  currentSong.src = songs[0];
  document.querySelector(".songinfo").innerHTML = songs[0].split(`${currFolder}/`)[1].replaceAll("%20", " ");

  // display the album
  await displayAlbums();


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
  currentSong.addEventListener("timeupdate", () => {
    // console.log(formatTime(currentSong.currentTime));
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
  });

  //seek bar circle moving
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration) * percent / 100;
    // console.log((currentSong.duration)*percent /100);


  })

  //hammburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  //close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-200%";
  });


  //previous and next
  let previous = document.getElementById("previous");
  let next = document.getElementById("next");
  index = songs.indexOf(currentSong.src);
  // add event listner to previous 
  previous.addEventListener("click", () => {
    // console.log("previous");
    if (index - 1 >= 0) {
      playSong(songs[index - 1].split(`/${currFolder}/`)[1].replaceAll("%20", " "));
      index--;
    }
    else {
      console.log("no previous");
    }
  });
  // add event listner to next
  next.addEventListener("click", () => {
    // console.log("next played");
    if (index + 1 < songs.length) {
      playSong(songs[index + 1].split(`/${currFolder}/`)[1].replaceAll("%20", " "));
      index++;
    }
    else {
      console.log("no forward");
    }
  });

  //add event listners to the range for volume
  document.querySelector(".range").addEventListener("change", (e) => {
    // console.log(e.target.value,e.target);
    currentSong.volume = parseInt(e.target.value) / 100;

  });
  document.getElementById("volbutton").addEventListener("click", () => {
    // console.log("clicked");
    document.querySelector(".range").classList.toggle("fill");

  });

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



}

main();