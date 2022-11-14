import sql from "../config/db.js";

//Constructor
const YouTubeVideo = function (youtubevideo) {
  this.video_id = youtubevideo.videoid;
  this.title = youtubevideo.title;
  this.channel_title = youtubevideo.channelTitle;
  this.default_audio_language = youtubevideo.defaultAudioLanguage;
  this.published_at = new Date(youtubevideo.publishedAt)
    .toISOString()
    .substring(0, 10);
  this.submitted_by = youtubevideo.userid;
};

YouTubeVideo.add = (newYouTubeVideo, result) => {
  sql.query("INSERT INTO youtubevideos SET ?", newYouTubeVideo, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("added youtube video: ", {
      id: res.insertId,
      ...newYouTubeVideo,
    });
    result(null, { id: res.insertId, ...newYouTubeVideo });
  });
};

YouTubeVideo.getUserVideos = async (userid) => {
  let [videos, _] = await sql
    .promise()
    .query(`SELECT * FROM youtubevideos WHERE submitted_by = ${userid}`);
  return videos;
};

YouTubeVideo.getVideoByID = async (youtubevideoid) => {
  let [video, _] = await sql.promise.query(
    `SELECT * FROM youtubevideos WHERE youtube_video_id = ${youtubevideoid}`
  );
  return video;
};

YouTubeVideo.remove = async (youtubevideoid) => {
  let [result] = await sql
    .promise()
    .query(
      `DELETE FROM youtubevideos WHERE youtube_video_id = ${youtubevideoid}`
    );
  let msg = result.affectedRows > 0 ? "" : "Not_found";
  return msg;
};

export default YouTubeVideo;
