Vue.component('streams-detail', {
  props: ['video'],
  template: `
    <div class="detail">
      <div>
        <a :href="'https://www.youtube.com/watch?v=' + video.video_id">
          <img :src="video.max_thumbnail_url"/>
        </a>
      </div>
      <div>{{ video.title }}</div>
      <div>{{ video.author }}</div>
      <div>{{ time }}</div>
    </div>
  `,
  computed: {
    time () {
      var date = new Date(null)
      date.setSeconds(this.video.length_seconds)
      return date.toISOString().substr(11, 8)
    }
  }
})


Vue.component('streams-content', {
  props: ['streams', 'title'],
  template: `
    <div class="content">
      <h2>{{ title }}</h2>
      <div v-for="stream in streams">
        <a :href="stream.url" target="_blank">
          <span>Download</span>
          <span>{{ stream.container }}</span>
          <span>{{ stream.video_resolution }}</span>
          <span>{{ stream.audio_encoding }}</span>
        </a>
      </div>
    </div>
  `
})

Vue.component('github-footer', {
  props: ['github_url'],
  template: `
    <footer>
      <a :href="github_url">
        <i class="icon github"></i>
      </a>
    </footer>
  `
})

new Vue({
  el: '#youtube',
  data: {
    url: "",
    github_url: "https://github.com/akiicat/kemal_youtube_retriever",
    video: {
      title: "",
      author: "",
      length_seconds: "",
      streams: []
    }
  },
  computed: {
  },
  methods: {
    getStreams (type = "default") {
      return this.video.streams.filter(s => s.comment === type)
    },
    send () {
      let video_id_m = /^((?:https?:\/\/|\/\/)(?:(?:(?:(?:www\.)?youtube\.com\/)(?:(?:(?:v|embed|e)\/(?!videoseries))|(?:(?:(?:watch|movie)\/?)?(?:\?)v=)))|(?:youtu\.be)\/))?([0-9A-Za-z_-]{11})/m
      let video_id = video_id_m.exec(this.url)[2]
      
      axios.get('/api/v1/json/watch?v=' + video_id)
        .then((response) => {
            this.video = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
  }
})

Vue.config.devtools = false

