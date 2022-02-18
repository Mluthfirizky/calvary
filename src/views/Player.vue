<template>
  <div class="player">
    <header id="top">
      <img @click="$router.go(-1)" src="../assets/back.png" alt="" />
      <h1>Now Playing</h1>
    </header>
    <main>
      <div class="disk-wrapper" :class="{ 'disk-wrapper-rotate': isPlaying }">
        <div class="disk-album" :style="file">
          <div class="disk-texture">
            <!-- <div class="disk-hole"></div> -->
          </div>
        </div>
      </div>

      <div class="music-detail">
        <h1 class="title">{{ song.title }}</h1>
        <h3 class="singer">{{ song.subtitle }}</h3>
        <p class="release">Released &ensp;<span> 1960</span></p>
      </div>
      <div id="waveform">
        <div class="hide"></div>
      </div>

      <div class="controls">
        <div
          @click="speaker"
          class="sound"
          :class="sound ? 'speaker' : 'mute'"
        ></div>
        <div class="prev"></div>
        <div @click="isPlaying = !isPlaying" class="play-wrapper">
          <img
            v-if="!isPlaying"
            class="play plays"
            @click="play"
            src="../assets/play.png"
            alt=""
          />
          <img
            @click="pause"
            v-else
            class="play"
            src="../assets/pause.png"
            alt=""
          />
        </div>
        <div class="next"></div>
        <div @click="replay" class="replay"></div>
      </div>
      <div class="arm-wrapper" :class="{ 'arm-wrapper-rotate': isPlaying }">
        <img class="arm" src="../assets/arm.png" alt="" />
      </div>
      <a href="#lyric">
      <div class="go-btn">
        <label>Lyrics</label>
        <div class="arrow"></div>
      </div>
      </a>
      <section class="lyrics">
        <label class="yt-label">Full version</label>
        <iframe
        v-if="typeof song.sections != 'undefined'"
          width="368"
          height="240"
          :src="typeof song.sections[2].youtubeurl != 'undefined' ?
            song.sections[2].youtubeurl.actions[0].uri.replace(
              'https://youtu.be/',
              'https://www.youtube.com/embed/'
            ) : song.sections[1].youtubeurl.actions[0].uri.replace(
              'https://youtu.be/',
              'https://www.youtube.com/embed/'
            )
          "
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>

        <label id="lyric" class="lyric-label"> Lyrics </label>
        <div v-if="typeof song.sections != 'undefined' && typeof song.sections[1].text != 'undefined'" class="lyric-wrapper">
        <p v-for="lyric in song.sections[1].text" :key="lyric.index"  class="lyrics">{{lyric}}</p>
        </div>
        <div v-else><h1>----------</h1></div>
        <div class="link">
          <label class="link-label">Open in:</label>
          <div class="grid-container">
            <a v-if="typeof song.hub != 'undefined'" :href="song.hub.providers[0].actions[0].uri">
            <div class="grid-link">
              <img src="../assets/spotify.png" alt="" />
            </div>
            </a>

            <a href="">
            <div class="grid-link">
              <img src="../assets/deezer.png" alt="" />
            </div>
            </a>

            <a href="">
            <div class="grid-link">
              <img src="../assets/apple.png" alt="" />
            </div>
            </a>

            <a href="">
            <div class="grid-link">
              <img src="../assets/shazam.png" alt="" />
            </div>
            </a>
          </div>
        </div>
        <a href="#top">
        <div class="up-btn">
          
          <label>Go up</label>
          <div class="arrow"></div>
          
        </div>
        </a>
      </section>
    </main>
  </div>
</template>

<script>
import WaveSurfer from "wavesurfer.js";
// import VueWaveSurfer from "wavesurfer.js-vue";
// import WaveSurferVue from 'wavesurfer.js-vue/src/WaveSurferVue.vue';
import Cursor from "wavesurfer.js/dist/plugin/wavesurfer.cursor";
export default {
  components: {
    // VueWaveSurfer
  },
  data() {
    return {
      song: {},
      sound: true,
      time: null,
      waveSurfer: {},
      isPlaying: false,
      waveOptions: {
        backgroundColor: "#FFF",
        mediaControls: true,
        waveColor: "violet",
        loaderColor: "purple",
        cursorColor: "navy",
        plugins: [Cursor.create()],
        barWidth: 2,
        barHeight: 1,
      },
      file: "",
    };
  },
  beforeMount() {
    fetch(
      `https://shazam.p.rapidapi.com/songs/get-details?key=${this.$route.params.id}&locale=en-US`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "shazam.p.rapidapi.com",
          "x-rapidapi-key":
            "d85c904f92msha153b0e15982992p14de15jsn4bc8ea37d711",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.song = data;
        this.file = this.imageAlbum();

        this.$nextTick(() => {
          this.waveSurfer = WaveSurfer.create({
            container: document.querySelector("#waveform"),
            mediaControls: true,
            waveColor: "#8C8C8C",
            progressColor: "black",
            height: 80,
            barWidth: 5,
            barRadius: 5,
            barHeight: 0.8,
            cursorWidth: 3,
            autoCenter: true,
            barGap: 4,
          });
          this.waveSurfer.load(this.song.hub.actions[1].uri);
        });
      })

      .catch((err) => {
        console.error(err);
      });
  },
  methods: {
    play() {
      this.waveSurfer.play();
      this.isPlaying = false;
      console.log(this.song.images);
      setInterval(() => {
        this.isPlaying = this.waveSurfer.isPlaying()
      }, 0);
    },
    pause() {
      this.waveSurfer.pause();
    },
    speaker() {
      this.waveSurfer.setMute(this.sound);
      this.sound = !this.sound;
      console.log(this.sound);
    },
    replay() {
      this.waveSurfer.stop();
      this.waveSurfer.play();
      console.log(this.waveSurfer.getDuration());
    },
    imageAlbum() {
      return {
        "background-image": `url(${this.song.images.coverart})`,
      };
    },
  },
  mounted() {},
  computed: {
    
  },
};
</script>

<style>
#waveform {
  margin-top: 38px;
  position: relative;
  overflow: hidden;
  width: 60%;
}
.hide {
  width: 100%;
  height: 35px;
  background-color: #edf2f4;
  position: absolute;
  z-index: 1000;
  bottom: 0px;
}
.arm {
  width: 170px;
  height: 215px;
  top: 110px;
}
.arm-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  position: absolute;
  margin-left: 385px;
  transition: 0.3s;
  height: 350px;
  width: 260px;
  transform: rotate(-20deg);
  top: -20px;
}
@keyframes spin1 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.arm-wrapper-rotate {
  transform: rotate(0deg);
}
header img {
  width: 28px;
  position: absolute;
  height: auto;
  cursor: pointer;
  left: 35px;
}
.player header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 35px;
  padding: 0 35px;
}
.player header h1 {
  font-family: "Montserrat", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  color: #000000;
}
.player main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  justify-content: center;
}
.lyric-wrapper{
  width: 100%;
  margin-top: 15px;
}
.disk-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: 100%;
  transform: 0.3s;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.205);
  width: 300px;
  height: 300px;
}
.disk-wrapper-rotate {
  animation: spin1 4s infinite linear;
}
.disk-texture {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("../assets/disk.png");
  background-size: contain;
  mix-blend-mode: hard-light;
  opacity: 65%;
  width: 100%;
  border-radius: 100%;
  height: 100%;
}

a label{
  color: black;
}
.disk-album {
  width: 100%;
  height: 100%;
  border-radius: 100%;
  /* background-color: black; */
  background-size: contain;
}
.disk-hole {
  width: 10%;
  height: 10%;
  border-radius: 100%;
  background-color: white;
  border: 5px black solid;
  position: relative;
  opacity: 100%;
}
.music-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 35px;
}
.music-detail .title {
  font-size: 35px;
  font-weight: 500;
}
.music-detail .singer {
  margin-top: 7px;
  font-size: 25px;
  font-weight: 400;
  margin-bottom: 14px;
}
.music-detail .release {
  font-size: 15px;
  font-weight: 400;
}
.controls {
  display: flex;
  align-items: center;
  margin-top: 30px;
  justify-content: center;
}
.controls div {
  cursor: pointer;
}
.controls .speaker {
  background-image: url("../assets/speaker-on.png");
}
.controls .sound {
  width: 30px;
  height: 26px;
  background-size: contain;
  transition: 0.3s;
  background-repeat: no-repeat;
}
.controls .mute {
  background-image: url("../assets/speaker-silent.png");
}
.controls .prev {
  background-image: url("../assets/next.png");
  width: 23px;
  height: 26px;
  background-size: contain;
  margin-left: 40px;
  background-repeat: no-repeat;
}
.controls .next {
  background-image: url("../assets/prev.png");
  width: 23px;
  height: 26px;
  background-size: contain;
  margin-right: 40px;
  background-repeat: no-repeat;
}
.controls .replay {
  background-image: url("../assets/replay.png");
  width: 24px;
  height: 30px;
  background-size: contain;
  background-repeat: no-repeat;
}
.controls .play-wrapper {
  display: flex;
  justify-content: center;
  margin: 0 25px;
  align-items: center;
  transition: 0.1s;
  background-color: #2b2d42;
  border-radius: 100%;
  width: 65px;
  height: 65px;
}
.controls .play-wrapper:hover {
  background-color: #494d68;
}
.controls .play-wrapper:active {
  background-color: #253758;
}
.play-wrapper .play {
  width: 46px;
  height: auto;
}
.plays {
  margin-left: 5px;
}
.go-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 40px;
}
.go-btn .arrow {
  width: 0;
  height: 0;
  transition: 0.3s;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 12px solid #2b2d42;
  border-radius: 1px;
}
.go-btn:hover > .arrow {
  transform: translateY(5px);
}

.go-btn label,
.up-btn label {
  cursor: pointer;
  font-size: 20px;
}
.up-btn {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  gap: 8px;
}
.up-btn:hover .arrow {
  transform: translateY(-5px);
}
.up-btn .arrow {
  width: 0;
  height: 0;
  cursor: pointer;
  transition: 0.3s;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 12px solid #2b2d42;
  border-radius: 1px;
}
section {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 30px;
}
section .yt-label {
  font-size: 25px;
  width: 100%;
  font-weight: 400;
  text-align: left;
}
iframe {
  margin-top: 10px;
  width: 100%;
  height: 52vw;
}
section .lyric-label {
  font-size: 25px;
  text-align: left;
  width: 100%;
  margin-top: 48px;
  font-weight: 500;
}
section .lyrics {
  font-size: 17px;
  white-space: pre-wrap;
  line-height: 40px;
  color: #000000;
}
.link {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
}
.link label {
  font-size: 25px;
  font-weight: 500;
  text-align: center;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 20px;
  margin-top: 30px;
  padding: 0 55px;
  width: 100vw;
  column-gap: 40px;
}
.grid-container a{
  width: 100%;
}
.grid-link {
  background-color: white;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  width: 100%;
  justify-content: center;
  transition: 0.2s;
  align-items: center;
  padding: 10px 13px;
}
.grid-link:hover {
  background: #c5eeff;
}
.grid-link img {
  width: 135px;
  height: auto;
}
</style>
