require "./spec_helper"

it "render /" do
  get "/"
  response.status_code.should eq 200
end

describe "api" do
  describe "v1" do
    describe "json" do
      it "watch" do
        get "/api/v1/json/watch?v=iDfZua4IS4A"
        response.body.should contain "title"
      end

      it "video" do
        get "/api/v1/json/video?v=iDfZua4IS4A"
        response.body.should contain "url"
      end

      it "audio" do
        get "/api/v1/json/audio?v=iDfZua4IS4A"
        response.body.should contain "url"
      end

      it "watch" do
        get "/api/v1/json/video_info?v=iDfZua4IS4A"
        response.body.should contain "title"
      end
    end

    describe "link" do
      it "video" do
        get "/api/v1/link/video?v=iDfZua4IS4A"
        response.headers["Location"].should contain "signature"
      end

      it "audio" do
        get "/api/v1/link/audio?v=iDfZua4IS4A"
        response.headers["Location"].should contain "signature"
      end
    end
  end
end
