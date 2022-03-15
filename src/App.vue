<template>
  <div id="app">
    <router-view/>
    <!-- <header>
      <input v-model="search" @keypress="fetchApi" type="text" placeholder="Search song....." />
    </header>
    <main v-if="current.track">  
      <section class="player">
        <img :src="current.track.images.coverart" alt="">
        <h2 class="song-title">
          {{ current.track.title }} - <span>{{ current.track.subtitle }}</span>
        </h2>
        <div class="controls">
          <button class="prev" @click="prev">Prev</button>
          <button class="play" v-if="!isPlaying" @click="play">Play</button>
          <button class="pause" v-else @click="pause">Pause</button>
          <button class="next" @click="next">Next</button>
        </div>

        <div id="waveform"></div>
      </section>
     
      <section class="playlist">
        <h3>The Playlist</h3>
        <button
          v-for="song in songs"
          :key="song.src"
          @click="play(song)"
          :class="song.track.hub.actions[1].uri == current.track.hub.actions[1].uri ? 'song playing' : 'song'"
        >
          {{ song.track.title }} - {{ song.track.subtitle }}
        </button>
      </section>
    </main>
    
     <div class="else" v-else>
      <iframe width="560" height="315" :src="test.replace('https://youtu.be/','https://youtube.com/embed/')" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
     </div> -->
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      search: '',
      current: {},
      isPlaying: false,
      index: 0,
      test: "https://youtu.be/r1XE8ON8fos?autoplay=1",
      songs: [
        // {
        //   title: "Mercury",
        //   artist: "Ghostemane",
        //   source:
        //     "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/b3/92/75/b3927526-da24-9fb4-f54c-aa86f9e917c4/mzaf_6944870493363672544.plus.aac.ep.m4a",
        // },
        // {
        //   title: "Dream Land",
        //   artist: "K2",
        //   source: require("./assets/y2mate.com - Tay K Returns To Dreamland 2 ft Blocboy JB.mp3"),
        // },
      ],
      player: new Audio(),
    };
  },
  methods: {
    fetchApi(e) {
      if (e.key == "Enter") {
        fetch(
          `https://shazam.p.rapidapi.com/search?term=${this.search}&locale=en-US&offset=0&limit=10`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "shazam.p.rapidapi.com",
              "x-rapidapi-key":
                "15913a4058msh4e00de814ff21aap120f38jsn1e50de6621d9",
            },
          }
        ).then(response => response.json())
          .then(data => {
            this.songs = data.tracks.hits 
          }).then(() => {
             this.current = this.songs[this.index];
             this.player.src = this.current.track.hub.actions[1].uri;
             this.isPlaying = false
             this.search = ''
            //  console.log(this.current.track.hub.actions[1].uri)
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    play(song) {
      if (typeof song.track != "undefined") {
        this.current = song
        this.player.src = song.track.hub.actions[1].uri;
      }
      this.player.addEventListener('ended', function () {
        this.index++;
        if (this.index > this.songs.length - 1) {
          this.index = 0;
        }
        this.current = this.songs[this.index];
        this.play(this.current);
      }.bind(this));
      this.player.play();
      this.isPlaying = true;
    },
    pause() {
      this.player.pause();
      this.isPlaying = false;
    },
    next() {
      this.index++;
      if (this.index > this.songs.length - 1) {
        this.index = 0;
      }
      this.current = this.songs[this.index];
      this.play(this.current);
    },
    prev() {
      this.index--;
      if (this.index < 0) {
        this.index = this.songs.length - 1;
      }
      this.current = this.songs[this.index];
      this.play(this.current);
    },
  },
  created() {
    this.player.volume = 0.2;
    let test = "wkwkwk"
    console.log(test.length[1])
  },
};
</script>

<style>
html, body {
  overflow-x:hidden 
} 
html{
  scroll-behavior: smooth;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background-color: #EDF2F4;
  font-family: 'Montserrat', sans-serif;
  overflow-x: hidden;
}
/* header {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #212121;
  color: #fff;
}
header input {
  padding: 15px;
  width: 100%;
  background: none;
  height: 100%;
  border: none;
  color: white;
}
main {
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
  padding: 25px;
}
.song-title {
  color: #53565a;
  font-size: 32px;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
}
.song-title span {
  font-weight: 400;
  font-style: italic;
}
.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 15px;
}
.player{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.player img{
  width: 250px;
  margin-bottom: 30px;
}
button {
  appearance: none;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
}
button:hover {
  opacity: 0.8;
}
.play,
.pause {
  font-size: 20px;
  font-weight: 700;
  padding: 15px 25px;
  margin: 0px 15px;
  border-radius: 8px;
  color: #fff;
  background-color: #cc2e5d;
}
.else{
  text-align: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.next,
.prev {
  font-size: 16px;
  font-weight: 700;
  padding: 10px 20px;
  margin: 0px 15px;
  border-radius: 6px;
  color: #fff;
  background-color: #ff5858;
}
.playlist {
  padding: 0px 30px;
}
.playlist h3 {
  color: #212121;
  font-size: 28px;
  font-weight: 400;
  margin-bottom: 30px;
  text-align: center;
}
.playlist .song {
  display: block;
  width: 100%;
  padding: 15px;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
}
.playlist .song:hover {
  color: #ff5858;
}
.playlist .song.playing {
  color: #fff;
  background-image: linear-gradient(to right, #cc2e5d, #ff5858);
} */
</style>
