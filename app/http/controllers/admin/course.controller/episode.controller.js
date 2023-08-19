const {default: getVideoDurationInSeconds} = require("get-video-duration");

const path = require("path");
const {getTime, deleteInvalidPropertyInObject, deleteFileInPublic, copyObject, deleteOneImageInNestedTwoLevelFolder} = require("../../../../utils/functions");

const createHttpError = require("http-errors");
const {StatusCodes: HttpStatus} = require("http-status-codes");

const { createEpisodeSchema } = require("../../../validators/admin/course.validation/episode.validation");
const { CourseModel } = require("../../../../models/courses");
const { idPublicValidation } = require("../../../validators/public.validation");
const { Controller } = require("../../controller");
const { default: mongoose } = require("mongoose");
const { $_createError } = require("@hapi/joi/lib/base");
class EpisodeController extends Controller {
    async addNewEpisode(req, res, next) {
        try {
            await createEpisodeSchema.validateAsync(req.body);
            const {
                title,
                text,
                type,
                videoURL
            } = req.body
            const seconds = await getVideoDurationInSeconds(videoURL);
            const time = getTime(seconds);
            const episode = {
                title,
                text,
                type,
                time,
                videoURL
            }
            const createEpisodeResult = await CourseModel.updateOne({
                _id: req.body.courseID,
                "chapters._id": req.body.chapterID
            }, {
                $push: {
                    "chapters.$.episodes": episode
                }
            });
            if (createEpisodeResult.modifiedCount == 0)
                throw new createHttpError.InternalServerError("server error")
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                data: {
                    message: "episode created successfully"
                }
            })
        } catch (error) {
            deleteOneImageInNestedTwoLevelFolder("episodeVideos",req.body.courseID,req.body.chapterID,req.body.filename)
            next(error)
        }
    }
    async removeEpisode(req, res, next) {
        try {
            const {episodeID:id}=req.params
            const {videoURL}=await this.getOneEpisode(id);
            const removeEpisodeResult = await CourseModel.updateOne({
                "chapters.episodes._id": id,
            }, {
                $pull: {
                    "chapters.$.episodes": {
                        _id: id
                    }
                }
            });

            if (removeEpisodeResult.modifiedCount == 0) throw new createHttpError.InternalServerError("server error")
                const videoLinkArray=videoURL.split("/")
                const foldername1=videoLinkArray.at((videoLinkArray.length)-3);
                const foldername2=videoLinkArray.at((videoLinkArray.length)-2);
                const filename=videoLinkArray.at((videoLinkArray.length)-1);
                deleteOneImageInNestedTwoLevelFolder("episodeVideos",foldername1,foldername2,filename)
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: "episode removed successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updateEpisode(req, res, next) {
        try {
            //get params from client
             const {episodeID} = req.params
             //check if the episode existed
            const episode = await this.getOneEpisode(episodeID)
            //get the body from client
            const data = {...req.body};
            const eepisode={...episode}
            //list of the forbidden value to change by client
            let blackListFields = ["_id","videoURL","time"]
            deleteInvalidPropertyInObject(data, blackListFields)
            const newEpisode = {
                ...eepisode._doc,
                ...data
            }
            console.log(newEpisode)
            const editEpisodeResult = await CourseModel.updateOne({
                "chapters.episodes._id": episodeID
            }, {
                $set: {
                    "chapters.$.episodes": newEpisode
                }
            })
            if (!editEpisodeResult.modifiedCount)
                throw new createHttpError.InternalServerError("server error")
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: "episode updated successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getOneEpisode(episodeID){
        if(!mongoose.isValidObjectId(episodeID)) throw createHttpError.BadRequest("param is not true")
        const course = await CourseModel.findOne({"chapters.episodes._id": episodeID}, {
            "chapters.episodes.$": 1
        })
        if(!course) throw new createHttpError.NotFound("episode not found");
        const episodesOfChapter = course?.chapters[0].episodes;
        const episode=episodesOfChapter.find(obj=>obj._id.equals(episodeID))
        if(!episode) throw new createHttpError.NotFound("episode not found")
        return episode;
    }
}
module.exports = {
    EpisodeController: new EpisodeController()
}