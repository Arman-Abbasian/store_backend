const { EpisodeController } = require("../../http/controllers/course/episode.controller");


const router = require("express").Router();
router.get("/getAllChapters/:chapterID", EpisodeController.getAllEpisodes)
router.get("/getOneChapter/:episodeID", EpisodeController.getOneEpisode)
module.exports = {
    episodeRoutes: router
}