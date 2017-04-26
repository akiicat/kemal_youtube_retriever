class YoutubeRetriever extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      title: "hello",
      length: "0",
    };
    this.video = {
      url: "",
      id: "",
    }
  }

  getVideoId() {
    var video_id_m = /^((?:https?:\/\/|\/\/)(?:(?:(?:(?:www\.)?youtube\.com\/)(?:(?:(?:v|embed|e)\/(?!videoseries))|(?:(?:(?:watch|movie)\/?)?(?:\?)v=)))|(?:youtu\.be)\/))?([0-9A-Za-z_-]{11})/m
    this.video.url = document.getElementById('video_url').value
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
        // document.getElementById('video_info').innerHTML =
        var rsp = JSON.parse(xhr.responseText)
        this.state.title = rsp.title
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

  render() {
    return React.createElement('div', null,
      React.createElement('input', { id: 'video_url', autofocus: true, placeholder: 'Youtube URL', type: 'text', ref: 'video_url', onKeyUp: this.sendVideoUrlWithEnter.bind(this) }),
      React.createElement('button', { type: 'button', onClick: this.sendVideoUrl.bind(this) }, 'Send'),
      React.createElement('div', { id: 'video_info' }, this.state.title)
    );
  }
}
ReactDOM.render(React.createElement(YoutubeRetriever, null), document.getElementById('youtube-retriever'));
