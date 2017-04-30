class YoutubeRetriever extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
    this.video = {};
  }

  getVideoId() {
    var video_id_m = /^((?:https?:\/\/|\/\/)(?:(?:(?:(?:www\.)?youtube\.com\/)(?:(?:(?:v|embed|e)\/(?!videoseries))|(?:(?:(?:watch|movie)\/?)?(?:\?)v=)))|(?:youtu\.be)\/))?([0-9A-Za-z_-]{11})/m
    this.video.url = document.getElementById('video-url').value
    this.video.id = video_id_m.exec(this.video.url)[2]
    return this.video.id
  }

  sendVideoUrl() {
    var xhr = null;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    }
    else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var rsp = JSON.parse(xhr.responseText)

        if (rsp.status == "404" || rsp.author == "") {
          this.state.error = this.renderError()
          this.forceUpdate()
          return false
        }

        var date = new Date(null);
        date.setSeconds(rsp.length_seconds);
        this.state.error = null
        this.state.title = rsp.title
        this.state.author = rsp.author
        this.state.length = date.toISOString().substr(11, 8);
        this.state.streams = this.renderStreams(rsp.streams, "default")
        this.state.video_only = this.renderStreams(rsp.streams, "video only")
        this.state.audio_only = this.renderStreams(rsp.streams, "audio only")
        this.forceUpdate()
      }
    };

    this.getVideoId()
    xhr.open('GET', '/api/v1/watch?v=' + this.video.id,  true);
    xhr.send();
  }

  sendVideoUrlWithEnter(e) {
    if (e.keyCode == 13) {
      this.sendVideoUrl();
    }
  }

  renderError() {
    return React.createElement('div', { className: 'paragraph' },
      React.createElement('h4', { className: 'text-center' }, "Something Wrong" )
    )
  }

  renderStreams(streams, selector) {
    streams = streams.filter((stream) => {
      return stream.comment == selector
    })

    selector = (selector == "default") ? 'VIDEO + AUDIO' : selector.toUpperCase();

    return React.createElement('div', {},
      React.createElement('hr', {}, null),
      React.createElement('h2', { className: 'text-center' }, selector),
      React.createElement('table', {},
        React.createElement('tbody', {}, this.renderStreamsBody(streams))
      )
    )
  }

  renderStreamsBody(streams) {
    return streams.map((stream) => {
      return React.createElement('tr', {},
        // url, itag, container, video_resolution, video_profile, video_bitrate, video_encoding, audio_bitrate, audio_encoding, comment
        React.createElement('td', {},
          React.createElement('a', { href: stream.url, target: '_blank' }, 'Download')
        ),
        React.createElement('td', {}, stream.container),
        React.createElement('td', {}, stream.video_resolution),
        React.createElement('td', {}, stream.audio_encoding)
      )
    })
  }

  renderIcon(icon, link) {
    return React.createElement('a', { href: link },
      React.createElement('img', { className: 'icon', src: '/images/' + icon}, null)
    )
  }

  render() {
    return React.createElement('div', {},
      React.createElement('header', {},
        React.createElement('h1', { className: 'text-center' }, 'YOUTUBE RETRIEVER'),
        React.createElement('div', { id: 'url-input', className: 'text-center' },
          React.createElement('input', { id: 'video-url', autofocus: true, placeholder: 'Youtube URL', type: 'text', ref: 'video-url', onKeyUp: this.sendVideoUrlWithEnter.bind(this) }),
          React.createElement('button', { type: 'button', onClick: this.sendVideoUrl.bind(this) }, 'Send')
        )
      ),
      React.createElement('hr', {}, null),
      React.createElement('div', { id: 'response-content' },
        this.state.error,
        React.createElement('div', { className: 'paragraph' },
          React.createElement('div', { className: 'text-center title' }, this.state.title ),
          React.createElement('div', { className: 'text-center title' }, this.state.author ),
          React.createElement('div', { className: 'text-center title' }, this.state.length )
        ),
        React.createElement('div', { className: 'container' }, this.state.streams),
        React.createElement('div', { className: 'container' }, this.state.video_only),
        React.createElement('div', { className: 'container' }, this.state.audio_only)
      ),
      React.createElement('footer', {},
        React.createElement('div', { className: 'container text-center' },
          this.renderIcon('GitHub-Mark-Light-120px-plus.png', '//github.com/akiicat/youtube_retriever')
        )
      )
    );
  }
}
ReactDOM.render(React.createElement(YoutubeRetriever, null), document.getElementById('youtube-retriever'));
