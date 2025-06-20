// global var
let currentSong = new Audio();

// play button toggle
const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
    //     const playButtons = document.querySelector(".playtoggle"); --> in this we are selecting from whole document , so each time you hover on any of the cards it translate play button of first card every time
    const playBtn = card.querySelector(".playtoggle");

    card.addEventListener('mouseenter', () => {
        playBtn.classList.add('play');
    });

    card.addEventListener('mouseleave', () => {
        playBtn.classList.remove('play');
    });
});

//fetching the song href
async function getSongs(params) {

    let a = await fetch("http://127.0.0.1:3000/song");
    let response = await a.text();
    // console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);

    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href); // filtering the name of the songs to spla
        }
    }
    // console.log(songs);


    return songs;
}

function playSong(songName) {

    //   play the song
    currentSong.src = "/song/" + songName
    currentSong.play();
    play.src="./assests/pause.svg";
    // const audioElement = new Audio(songs[1]);
    // audioElement.addEventListener("loadeddata", () => {
    //     let duration = audioElement.duration;
    //     console.log(duration);
    //     // The duration variable now holds the duration (in seconds) of the audio clip  
    // });
}

async function main() {

    // get  the  list of all the songs
    let songs = await getSongs();
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    // console.log(songUl);
    for (const song of songs) {
        // console.log(song);
        let filSong = song.split("/song/")[1].replaceAll("%20", " ");

        let getArtist = () => {
            if (filSong.includes("_")) {
                return filSong.split('_')[1];
            } else {
                return "unnamed";
            }
        };
        let artist = getArtist();
        // console.log(filSong);
        // console.log(artist);
        // show all the songs in the playlist
        songUl.innerHTML = songUl.innerHTML + `<li>
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

    // attach an eventlistner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            console.log(e.querySelector(".songName").innerHTML);
            playSong(e.querySelector(".songName").innerHTML);
        });
    });     

    // attach eventlistner to play, next and previous
    let play= document.getElementById("play");
    play.addEventListener("click",()=>{
        if(currentSong.src==""){
            currentSong.src=songs[0];
            currentSong.play();
            play.src="./assests/pause.svg";
        }
        else if (currentSong.paused) {
            currentSong.play();
              play.src="./assests/pause.svg";
            
        }
        else{
            currentSong.pause();
          play.src="./assests/playbar.svg";
          
        }
    });
    
}

main()

















