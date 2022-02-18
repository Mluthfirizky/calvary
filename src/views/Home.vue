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
          <div
            :class="currentSlide == index ? 'current-slide' : 'slide'"
            v-for="(slide, index) in dataSlide"
            :key="index"
          >
            <img :src="slide.track.images.coverart" alt="" />
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
              <img src="../assets/search-icon.png" alt="" />
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
        <div class="kosong" v-else>
          {{typeof searchResult.track}}
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
export default {
  data() {
    return {
      search: "",
      searchResult: [],
      //slide data
      dataSlide: [],
      currentSlide: 0,
    };
  },
  name: "HelloWorld",
  props: {
    msg: String,
  },
  mounted() {},
  methods: {
    searchEnter(e) {
      if(e.key == "Enter"){
      fetch(
        `https://shazam.p.rapidapi.com/search?term=${this.search}&locale=en-US&offset=0&limit=5`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "shazam.p.rapidapi.com",
            "x-rapidapi-key":
              "d85c904f92msha153b0e15982992p14de15jsn4bc8ea37d711",
          },
        }
      )
      .then(response => response.json())
        .then(data => {
          this.searchResult = data.tracks.hits
          console.log(this.searchResult)
          
        })
        .catch((err) => {
          console.error(err);
        });
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
    fetch("https://shazam.p.rapidapi.com/search?term=rose&locale=en-US&offset=0&limit=5", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "shazam.p.rapidapi.com",
		"x-rapidapi-key": "d85c904f92msha153b0e15982992p14de15jsn4bc8ea37d711"
	}
})
.then(response => response.json())
.then(data => {
  this.dataSlide = data.tracks.hits
  console.log(data)
})
.catch(err => {
	console.error(err);
});
  }
};
</script>

<style>
a{
  text-decoration: none;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
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
  font-weight: 400;
}
.slider {
  display: flex;
  justify-content: center;
  height: 238px;
}
.slider .slider-items {
  gap: 40px;
  display: flex;
  position: relative;
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
  cursor: pointer;
  background-color: gray;
  transition: 0.3s;
  border-radius: 10px;
}
.slide img {
  border-radius: 10px;
  height: 100%;
  width: 100%;
}
.current-slide img {
  height: 100%;
  border-radius: 10px;
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
  margin-right: 12px;
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
  align-items: center;
}
.search-content .left h3 {
  font-size: 12px;
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
</style>