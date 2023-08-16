
const { EpisodeController } = require("../../../http/controllers/admin/course.controller/episode.controller");
const {uploadEpisodeVideo } = require("../../../utils/multerCreateEpisode");


const router = require("express").Router();
router.post("/add", uploadEpisodeVideo.single("video"), EpisodeController.addNewEpisode)
router.delete("/remove/:episodeID", EpisodeController.removeEpisode)
router.patch("/update/:episodeID", uploadEpisodeVideo.single("video"), EpisodeController.updateEpisode)
module.exports = {
    AdminEpisodeRoutes: router
}