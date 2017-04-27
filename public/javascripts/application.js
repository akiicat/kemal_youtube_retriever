class YoutubeRetriever extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
    this.video = {}
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
        this.state.title = rsp.title
        this.state.author = rsp.author

        var date = new Date(null);
        date.setSeconds(rsp.length_seconds);
        this.state.length = date.toISOString().substr(11, 8);
        this.state.streams    = this.renderStreams(rsp.streams, "default")
        this.state.video_only = this.renderStreams(rsp.streams, "video only")
        this.state.audio_only = this.renderStreams(rsp.streams, "audio only")
        this.forceUpdate()
      }
    };

    this.getVideoId()
    xhr.open('GET', '/watch?v=' + this.video.id,  true);
    xhr.send();
  }

  sendVideoUrlWithEnter(e) {
    if (e.keyCode == 13) {
      this.sendVideoUrl();
    }
  }

  renderStreams(streams, selector) {
    return streams.filter((stream) => {
      return stream.comment == selector
    }).map((stream) => {
      return React.createElement('li', {},
        // url, itag, container, video_resolution, video_profile, video_bitrate, video_encoding, audio_bitrate, audio_encoding, comment
        React.createElement('a', { href: stream.url, target: '_blank' }, 'Download'),
        React.createElement('span', {}, stream.container),
        React.createElement('span', {}, stream.video_resolution),
        React.createElement('span', {}, stream.audio_encoding)
      )
    })
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
        React.createElement('div', { className: 'text-center' },
          React.createElement('div', {}, this.state.title ),
          React.createElement('div', {}, this.state.author ),
          React.createElement('div', {}, this.state.length )
        ),
        React.createElement('div', { className: 'container' }, this.state.streams),
        React.createElement('hr', {}, null),
        React.createElement('div', { className: 'text-center' }, 'video only'),
        React.createElement('div', { className: 'container' }, this.state.video_only),
        React.createElement('hr', {}, null),
        React.createElement('div', { className: 'text-center' }, 'music only'),
        React.createElement('div', { className: 'container' }, this.state.audio_only)
      )
    );
  }
}
ReactDOM.render(React.createElement(YoutubeRetriever, null), document.getElementById('youtube-retriever'));
