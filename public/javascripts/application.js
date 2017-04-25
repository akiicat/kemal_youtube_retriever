var YoutubeRetriever = React.createClass({
  getInitialState: function () {
    return {
    };
  },

  getVideoId: function() {
    var video_url = document.getElementById('video_url').value
    var video_id_m = /^((?:https?:\/\/|\/\/)(?:(?:(?:(?:www\.)?youtube\.com\/)(?:(?:(?:v|embed|e)\/(?!videoseries))|(?:(?:(?:watch|movie)\/?)?(?:\?)v=)))|(?:youtu\.be)\/))?([0-9A-Za-z_-]{11})/m
    var video_id = video_id_m.exec(video_url)[2]
    return video_id
  },

  sendVideoUrl: function() {
    var xhr = null;
    if(window.XMLHttpRequest){
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById('video_info').innerHTML = this.responseText;
      }
    };

    video_id = this.getVideoId()
    xhr.open('GET', '/watch?v=' + video_id,  true);
    xhr.send();
  },

  sendVideoUrlWithEnter: function (e) {
    if (e.keyCode == 13) {
      this.sendVideoUrl();
    }
  },

  render: function () {
    return React.createElement('div', null,
      React.createElement('input', { id: 'video_url', autofocus: true, placeholder: 'Youtube URL', type: 'text', ref: 'video_url', onKeyUp: this.sendVideoUrlWithEnter }),
      React.createElement('button', { type: 'button', onClick: this.sendVideoUrl }, 'Send'),
      React.createElement('div', { id: 'video_info' }, null)
    );
  }
});

ReactDOM.render(React.createElement(YoutubeRetriever, null), document.getElementById('youtube-retriever'));
