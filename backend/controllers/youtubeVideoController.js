import YouTubeVideo from "../models/youtubeVideoModel.js";
import axios from "axios";

export const createYouTubeVideo = async (req, res) => {
 
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const apiKey = "AIzaSyAZcMOK7ZgkSmVGKsm0Qta940E_HtbEB74";
  const apiUrl = "https://www.googleapis.com/youtube/v3";

  const url = `${apiUrl}/videos?id=${req.body.videoid}&key=${apiKey}&part=snippet`;

  const response = await axios.get(url);

  req.body.title = response.data.items[0].snippet.title;
  req.body.channelTitle = response.data.items[0].snippet.channelTitle;
  req.body.defaultAudioLanguage = response.data.items[0].snippet.defaultAudioLanguage;
  req.body.publishedAt = response.data.items[0].snippet.publishedAt;

  const youtubevideo = new YouTubeVideo({
    videoid: req.body.videoid,
    title: req.body.title,
    channelTitle: req.body.channelTitle,
    defaultAudioLanguage: req.body.defaultAudioLanguage,
    publishedAt: req.body.publishedAt,
    email: req.body.email
  });

  YouTubeVideo.create(youtubevideo, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the YouTube video."
      });
    else res.send(data);
  });
};

export const findAllYouTubeVideos = (req, res) => {
  YouTubeVideo.getAll(req.params.email, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the YouTube videos."
      });
    else res.send(data);
  });
};

export const deleteYouTubeVideo = (req, res) => {
  YouTubeVideo.remove(req.params.youtubeVideoId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found YouTubeVideo with id ${req.params.youtubeVideoId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete YouTubeVideo with id " + req.params.youtubeVideoId
        });
      }
    } else res.send({ message: `YouTubeVideo was deleted successfully!` });
  });
};