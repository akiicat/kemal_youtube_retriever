require "kemal"
require "youtube_retriever"

LOG.level = Logger::ERROR
BAD_REQUEST = {
  :status => "404",
  :message => "bad request"
}

error 404 do
  render "src/views/404.ecr"
end

before_get "/api/v1/json/*" do |env|
  env.response.content_type = "application/json; charset=utf-8"
end

before_get "/api/v1/*" do |env|
  request = env.request.resource.match(/\?(?<video_url>.+)/).try(&.["video_url"]).to_s
  env.set "video_url", URI.decode_www_form(request)["v"]?
end

get "/" do |env|
  render "src/views/index.ecr"
end

get "/api/v1/json/watch" do |env|
  begin
    Youtube::Retriever.dump_json(env.get("video_url").to_s).to_json
  rescue
    BAD_REQUEST.to_json
  end
end

get "/api/v1/json/video" do |env|
  begin
    Youtube::Retriever.get_video_urls(env.get("video_url").to_s).to_json
  rescue
    BAD_REQUEST.to_json
  end
end

get "/api/v1/json/audio" do |env|
  begin
    Youtube::Retriever.get_audio_urls(env.get("video_url").to_s).to_json
  rescue
    BAD_REQUEST.to_json
  end
end

get "/api/v1/json/video_info" do |env|
  begin
    Youtube::Retriever.video_info(env.get("video_url").to_s).to_json
  rescue
    BAD_REQUEST.to_json
  end
end

get "/api/v1/json/youtube-dl" do |env|
  begin
    io = IO::Memory.new
    Process.run("youtube-dl", ["-j", env.get("video_url").to_s], output: io)
    JSON.parse(io.to_s).to_json
  rescue
    BAD_REQUEST.to_json
  end
end

get "/api/v1/link/video" do |env|
  begin
    url = Youtube::Retriever.get_video_urls(env.get("video_url").to_s).first[:url]
    env.redirect url
  rescue
    env.response.status_code = 404
  end
end

get "/api/v1/link/audio" do |env|
  begin
    url = Youtube::Retriever.get_audio_urls(env.get("video_url").to_s).first[:url]
    env.redirect url
  rescue
    env.response.status_code = 404
  end
end

Kemal.run
