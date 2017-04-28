require "kemal"
require "youtube_retriever"

BAD_REQUEST = {
  :status => "404",
  :message => "bad request"
}

get "/" do |env|
  render "src/views/index.ecr"
end

get "/api/v1/watch" do |env|
  env.response.content_type = "application/json; charset=utf-8"
  begin
    request = env.request.resource.match(/\?(?<video_url>.+)/).try(&.["video_url"]).to_s
    video_url = URI.decode_www_form(request)["v"]
    YoutubeRetriever.dump_json(video_url).to_json
  rescue
    BAD_REQUEST
  end
end

get "/api/v1/youtube-dl" do |env|
  env.response.content_type = "application/json; charset=utf-8"
  begin
    request = env.request.resource.match(/\?(?<video_url>.+)/).try(&.["video_url"]).to_s
    video_url = URI.decode_www_form(request)["v"]
    io = IO::Memory.new
    Process.run("youtube-dl", ["-j", video_url], output: io)
    JSON.parse(io.to_s).to_json
  rescue
    BAD_REQUEST
  end
end

Kemal.run
