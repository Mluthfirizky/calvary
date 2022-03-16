<template>
  <div class="home">
    <div class="head">
      <div class="greetings">
        <h3>Good Morning!</h3>
        <h2>Alikka Calista</h2>
      </div>
      <!-- <nav role="navigation">
        <div id="menuToggle">
          <input type="checkbox" />
          <span></span>
          <span></span>
          <span></span>

          <ul id="menu">
            <a href="#"><li>Home</li></a>
            <a href="#"><li>About</li></a>
            <a href="#"><li>Info</li></a>
            <a href="#"><li>Contact</li></a>
            <a href="https://erikterwan.com/" target="_blank"
              ><li>Show me more</li></a
            >
          </ul>
        </div>
      </nav> -->
    </div>

    <main>
      <div class="top-label">
        <h3>Trending musics</h3>
        <h5>See all</h5>
      </div>
      <div class="slider">
        <div :class="'slide-' + currentSlide" class="slider-items">
          <div @click="trendingMusic(slide.key)"
            :class="currentSlide == index ? 'current-slide' : 'slide'"
            v-for="(slide, index) in dataSlide.slice(0,5)"
            :key="index"
          >
            <img :class="currentSlide == index ? 'current-image' : 'image'" :src="slide.images.coverart" alt="" />
            <div :class="currentSlide == index ? 'current-player' : 'hidden'">
              <div class="listen-now">
                <label>Listen now</label>

               <span class="material-icons-round button">
                play_circle_outline
                </span>
              </div>

              <div class="song-name">
                <h2>{{slide.title}}</h2>
                <h3>{{slide.subtitle}}</h3>
              </div>
            </div>
          </div>
        </div>
        <div class="btn">
          <img
            @click="prevTrend"
            class="left"
            src="../assets/left.png"
            alt=""
          />

          <img class="right" @click="nextTrend" src="../assets/slide-arrow.png" alt="" />
        </div>
      </div>

      <div class="search-content">
        <div class="search-top">
          <h3>Search musics</h3>
          <div class="search">
            <div class="search-bar">
              <input @keypress="searchEnter" v-model="search" type="text" />
              <img @click="searchIcon" style="cursor: pointer;" src="../assets/search-icon.png" alt="" />
            </div>
          </div>
        </div>

        <div v-if="searchResult.length > 0" class="search-result">
          
          <div
            v-for="data in searchResult"
            :key="data.index"
            class="search-music"
          >
          <router-link :to="'/player/' + data.track.key">
            <div class="left">
              <div class="music-image">
                <img :src="data.track.images.coverart" alt="" />
              </div>
              <h3>{{data.track.title}} - {{data.track.subtitle}}</h3>
            </div>
            <div class="icons">
              <img src="../assets/add.png" alt="" />
              <img src="../assets/book.png" alt="" />
            </div>
            </router-link>
          </div>
        </div>
        <div v-loading="loading" class="kosong" v-else>
          <div class="text">
            <h1 class="in">Search millions of music</h1>
            <h1 class="out">Search millions of music</h1>
            <h1 class="in">Search millions of music</h1>
            <h1 class="out">Search millions of music</h1>
            <h1 class="in">Search millions of music</h1>
            <h1 class="out">Search millions of music</h1>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
// import WaveSurfer from "wavesurfer.js";
// import VueWaveSurfer from "wavesurfer.js-vue";
// import Cursor from "wavesurfer.js/dist/plugin/wavesurfer.cursor";
import header from '../components/header'
export default {
  data() {
    return {
      search: "",
      searchResult: [],
      //slide data
      dataSlide: [],
      currentSlide: 0,
      loading: false
    };
  },
  name: "HelloWorld",
  props: {
    msg: String,
  },
  mounted() {},
  methods: {
    trendingMusic(key){
      this.$router.push('/player/' + key)
    },
    searchIcon(){
      if(this.search.length > 0){
      this.loading = true
      fetch(
        `https://shazam.p.rapidapi.com/search?term=${this.search}&locale=en-US&offset=0&limit=5`,
        {
          method: "GET",
          headers: header
        }
      )
      .then(response => response.json())
        .then(data => {
          if(data.tracks){
          this.searchResult = data.tracks.hits
          console.log(this.searchResult)
          this.loading = false
          }
          else{
            this.$message({
              message: 'Music not found',
              type: 'warning'
            })
          }
        })
        .catch((err) => {
          console.error(err);
        });
      }else{
        this.searchResult = []
      }
    },
    searchEnter(e) {
      if(e.key == "Enter"){
      if(this.search.length > 0){
      this.loading = true
      fetch(
        `https://shazam.p.rapidapi.com/search?term=${this.search}&locale=en-US&offset=0&limit=5`,
        {
          method: "GET",
          headers: header
        }
      )
      .then(response => response.json())
        .then(data => {
          if(data.tracks){
          this.searchResult = data.tracks.hits
          console.log(this.searchResult)
          this.loading = false
          }
          else{
            this.$message({
              message: 'Music not found',
              type: 'warning'
            })
          }
        })
        .catch((err) => {
          console.error(err);
        });
      }else{
        this.searchResult = []
      }
      }
    },
    nextTrend() {
      this.currentSlide++;
      if (this.currentSlide > 4) {
        this.currentSlide = 0;
      }
    },
    prevTrend() {
      this.currentSlide--;
      if (this.currentSlide < 0) {
        this.currentSlide = 4;
      }
    },
  },
  beforeMount(){
    fetch("https://shazam.p.rapidapi.com/charts/track?locale=en-US&pageSize=20&startFrom=0", {
	method: "GET",
	headers: header,
})
.then(response => response.json())
.then(data => {
  this.dataSlide = data.tracks
  console.log(data)
})
.catch(err => {
	console.error(err);
});
  }
};
</script>

<style>
.hidden{
  display: none;
}
a{
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}
.current-player .listen-now .button{
  font-size: 85px;
  margin-top: 30px;
  border-radius: 100%;
}
.listen-now{
  display: flex;
  transition: 0.3s;
  align-items: center;
  flex-direction: column;
  opacity: 0;
  justify-content: center;
}
.current-slide:hover .listen-now{
  opacity: 1;
}
.current-slide:hover img{
  filter: brightness(0.5);
}

.current-slide:active .listen-now{
  opacity: 1;
}
.current-slide:active img{
  filter: brightness(0.5);
}
.song-name h2{
  margin-bottom: 6px;
  overflow: hidden;
  max-width: 100%;
  max-height: 25px;
  white-space: pre-wrap;
  text-overflow: ellipsis;
  font-size: 20px;
}
.song-name h3{
  font-size: 17px;
  max-height: 23px;
  white-space: pre-wrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 500;
}
.listen-now label{
  font-size: 17px;
}
.current-player{
  position: absolute;
  top: 0;
  text-align: center;
  height: 100%;
  align-items: center;
  padding: 25px 32px 20px 32px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
}

.button img{
  opacity: 1;
}
.head {
  margin: 38px 30px 0 22px;
  display: flex;
  justify-content: space-between;
}
.head .greetings h3 {
  font-size: 20px;
  font-weight: 400;
}
.greetings h2 {
  font-size: 25px;
  margin-top: 3px;
  font-weight: 500;
}
main {
  display: flex;
  flex-direction: column;
  align-items: center;
    position: relative;
  overflow-x: hidden;
}
main .top-label {
  width: 100%;
  padding: 30px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.top-label h3 {
  font-size: 18px;
  font-weight: 600;
}
.top-label h5 {
  font-size: 14px;
  cursor: pointer;
  font-weight: 400;
}
.slider {
  display: flex;
  justify-content: center;
  height: 255px;
}
.slider .slider-items {
  gap: 40px;
  display: flex;
  position: relative;
  overflow-x: hidden;
  width: 100%;
  transition: 0.3s;
  align-items: center;
  justify-content: center;
}
.slide-0 {
  left: 40.2%;
}
.slide-1 {
  left: 20.2%;
}
.slide-2 {
  left: 0%;
}
.slide-3 {
  left: -20%;
}
.slide-4 {
  left: -40.2%;
}
.slider .slider-items:hover {
}
/* .slider .slider-items:hover >  .slide{
  width: 238px;
  height: 238px;
  cursor: pointer;
  background-color: gray;
  transition: 0.3s;
  opacity: 1;
  border-radius: 10px;
} */
.slider .current-slide {
  opacity: 1;
  width: 245px;
  height: 245px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  z-index: 10;
  background-color: gray;
  transition: 0.3s;
  display: flex;
  justify-content: center;
  border-radius: 10px;
}
.slide img {
  border-radius: 10px;
  height: 100%;
  width: 100%;
}
.current-slide img {
  height: 100%;
  transition: 0.2s;
  border-radius: 10px;
  filter: brightness(0.7);
  width: 100%;
}
.slider .slide {
  border-radius: 10px;
  transition: 0.3s;
  background-color: gray;
  cursor: pointer;
  width: 180px;
  height: 180px;
  opacity: 0.35;
}

.btn{
  display: flex;
  margin-top: 90px;
  padding: 0 22px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: absolute;
}

.btn .left:active{
  transform: scale(0.9);
  filter: brightness(110%);
}
.btn .right:active{
  transform: scale(0.9);
  filter: brightness(110%);
}
.btn img {
  -moz-user-select:none;
  user-select:none;
  -webkit-user-select:none;
  transition: 0.2s;
  width: 52px;
  height: auto;
  cursor: pointer;
}
.search{
  width: 100%;
}
.search-content {
  display: flex;
  width: 100%;
  padding: 0 33px;
  align-items: center;
  flex-direction: column;
  margin-top: 70px;
}
.search-content h3 {
  font-size: 18px;
  white-space: nowrap;
  margin-right: 15px;
  font-weight: 600;
}
.search-content .search-bar {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
}
.search-content .search-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.search-bar input {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  width: 100%;
  outline: none;
  background-color: #8d99ae4a;
}

.search-bar img {
  width: 15px;
  height: auto;
  right: 45px;
  position: absolute;
}
.search-result {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 18px 0;
}
.search-music {
  display: flex;
  border-radius: 8px;
  padding: 12px 25px 12px 12px;
  transition: 0.2s;
  cursor: pointer;
  background-color: #8d99ae;
  align-items: center;
  justify-content: space-between;
}
.search-music:hover{
  background-color: #515f77;

}
.search-content .left {
  display: flex;
  max-width: 90%;
  align-items: center;
}
.search-content .left h3 {
  font-size: 12px;
  white-space: pre-wrap;
  font-weight: 400;
  color: white;
}
.search-music .music-image {
  height: 50px;
  width: 50px;
  margin-right: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: white;
}
.music-image img {
  height: 50px;
  border-radius: 5px;
  width: 50px;
}
.search-music .icons {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
}
.icons img {
  width: 15px;
  height: auto;
}
.kosong{
  background-image: url("../assets/albums.jpg");
  background-size: cover;
  width: 100%;
  padding: 44px 38px;
  margin: 30px;
  border-radius: 10px;
  cursor: pointer;
}
.kosong .text{
  display: flex;
  gap: 10px;
  -moz-user-select:none;
  user-select:none;
  -webkit-user-select:none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  text-align: center;
}
.text .in{
  color: white;
  
}
.text .out{
  color: transparent;
  -webkit-text-stroke: 1.2px white;
}

@media (max-width: 500px){
  .slider .current-slide {
  opacity: 1;
  width: 225px;
  height: 225px;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 10px;
}
.slider .slide {
  border-radius: 10px;
  transition: 0.3s;
  background-color: gray;
  cursor: pointer;
  width: 160px;
  height: 160px;
  opacity: 0.35;
}
}

@media (max-width: 480px) {
  .search-content {
  margin-top: 50px;
}
  .search-content .left h3 {
  font-size: 11px;
  white-space: pre-wrap;
  margin-left: -10px;
  text-overflow: ellipsis;
  overflow: hidden; 
  font-weight: 500;
}
  .kosong .text{
  font-weight: 600;
  font-size: 12px;
}
.kosong{
  padding: 30px 22px;
}
  .slide-0 {
  left: 39.5%;
}
.slide-1 {
  left: 19.5%;
}
.slide-2 {
  left: -0%;
}
.slide-3 {
  left: -19.6%;
}
.slide-4 {
  left: -39%;
}
}
@media (max-width: 420px) {
  .search-content {
  margin-top: 30px;
}
  .song-name h2{
  font-size: 18px;
}
.song-name h3{
  font-size: 15px;
  max-height: 21px;
  font-weight: 500;
}
.listen-now label{
  font-size: 15px;
}
.current-player{
  padding: 10px 20px 20px 20px;
}
  .current-player .listen-now .button{
  font-size: 65px;
  margin-top: 25px;
}
    .kosong .text{
  font-weight: 700;
  font-size: 10px;
}
    .slider .current-slide {
  opacity: 1;
  width: 48.6vw;
  height: 48.6vw;
}
.slider .slide {
  width: 34.2vw;
  height: 34.2vw;
  opacity: 0.35;
}
}
@media (max-width: 380px) {
   .song-name h2{
  font-size: 17px;
  max-height: 23px;
}
.song-name h3{
  font-size: 15px;
  max-height: 23px;
  font-weight: 500;
}
.listen-now label{
  font-size: 15px;
}
.current-player{
  padding: 10px 20px 20px 20px;
}
  .current-player .listen-now .button{
  font-size: 60px;
  margin-top: 20px;
}
    .kosong .text{
  font-weight: 700;
  font-size: 10px;
}
.slide-0 {
  left: 39.9%;
}
.slide-1 {
  left: 19.9%;
}
.slide-2 {
  left: -0%;
}
.slide-3 {
  left: -19.9%;
}
.slide-4 {
  left: -39.8%;
}
}
</style>