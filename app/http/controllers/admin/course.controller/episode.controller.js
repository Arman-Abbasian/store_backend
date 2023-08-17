const {default: getVideoDurationInSeconds} = require("get-video-duration");

const path = require("path");
const {getTime, deleteInvalidPropertyInObject, deleteFileInPublic, copyObject, deleteOneImageInNestedTwoLevelFolder} = require("../../../../utils/functions");

const createHttpError = require("http-errors");
const {StatusCodes: HttpStatus} = require("http-status-codes");

const { createEpisodeSchema } = require("../../../validators/admin/course.validation/episode.validation");
const { CourseModel } = require("../../../../models/courses");
const { idPublicValidation } = require("../../../validators/public.validation");
const { Controller } = require("../../controller");
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
            const {
                id: episodeID
            } = await idPublicValidation.validateAsync({
                id: req.params.episodeID
            });
            await this.getOneEpisode(episodeID)
            const removeEpisodeResult = await CourseModel.updateOne({
                "chapters.episodes._id": episodeID,
            }, {
                $pull: {
                    "chapters.$.episodes": {
                        _id: episodeID
                    }
                }
            });

            if (removeEpisodeResult.modifiedCount == 0)
                throw new createHttpError.InternalServerError("حذف اپیزود انجام نشد")
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: "حذف اپیزود با موفقیت انجام شد"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updateEpisode(req, res, next) {
        try {
             const {episodeID} = req.params
            const episode = await this.getOneEpisode(episodeID)
            const { filename, fileUploadPath } = req.body
            let blackListFields = ["_id"]
            if(filename && fileUploadPath){
                const fileAddress = path.join(fileUploadPath, filename)
                req.body.videoAddress = fileAddress.replace(/\\/g, "/");
                const videoURL = `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${req.body.videoAddress}`
                const seconds = await getVideoDurationInSeconds(videoURL);
                req.body.time = getTime(seconds);
                blackListFields.push("filename")
                blackListFields.push("fileUploadPath")
            }else{
                blackListFields.push("time")
                blackListFields.push("videoAddress")
            }
            const data = req.body;
            deleteInvalidPropertyInObject(data, blackListFields)
            const newEpisode = {
                ...episode,
                ...data
            }
            const editEpisodeResult = await CourseModel.updateOne({
                "chapters.episodes._id": episodeID
            }, {
                $set: {
                    "chapters.$.episodes": newEpisode
                }
            })
            if (!editEpisodeResult.modifiedCount)
                throw new createHttpError.InternalServerError("ویرایش اپیزود انجام نشد")
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: "ویرایش اپیزود با موفقیت انجام شد"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getOneEpisode(episodeID){
        const course = await CourseModel.findOne({"chapters.episodes._id": episodeID}, {
            "chapters.$.episodes": 1
        })
        if(!course) throw new createHttpError.NotFound("اپیزودی یافت نشد")
        const episode = await course?.chapters?.[0]?.episodes?.[0]
        if(!episode) throw new createHttpError.NotFound("اپیزودی یافت نشد")
        return copyObject(episode)
    }
}
module.exports = {
    EpisodeController: new EpisodeController()
}