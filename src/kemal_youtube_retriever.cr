require "kemal"
require "youtube_retriever"

BAD_REQUEST = {
  :status => "404",
  :message => "bad request"
}

before_get "/api/v1/watch" do |env|
  env.response.content_type = "application/json; charset=utf-8"
  request = env.request.resource.match(/\?(?<video_url>.+)/).try(&.["video_url"]).to_s
  env.set "video_url", URI.decode_www_form(request)["v"]
end

before_get "/api/v1/youtube-dl" do |env|
  env.response.content_type = "application/json; charset=utf-8"
  request = env.request.resource.match(/\?(?<video_url>.+)/).try(&.["video_url"]).to_s
  env.set "video_url", URI.decode_www_form(request)["v"]
end

get "/" do |env|
  render "src/views/index.ecr"
end

get "/api/v1/watch" do |env|
  begin
    YoutubeRetriever.dump_json(env.get("video_url").to_s).to_json
  rescue
    BAD_REQUEST.to_json
  end
end

get "/api/v1/youtube-dl" do |env|
  begin
    io = IO::Memory.new
    Process.run("youtube-dl", ["-j", env.get("video_url").to_s], output: io)
    JSON.parse(io.to_s).to_json
  rescue
    BAD_REQUEST.to_json
  end
end

Kemal.run
