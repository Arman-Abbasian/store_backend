const {default: getVideoDurationInSeconds} = require("get-video-duration");

const path = require("path");
const {getTime, deleteInvalidPropertyInObject, deleteFileInPublic, copyObject} = require("../../../utils/functions");

const createHttpError = require("http-errors");
const {StatusCodes: HttpStatus} = require("http-status-codes");

const { CourseModel } = require("../../../models/courses");


const { idPublicValidation } = require("../../validators/public.validation");
const { Controller } = require("../controller");

class EpisodeController extends Controller {
    async getAllEpisodes(req, res, next) {
        try {
            
            const createEpisodeResult = await CourseModel.updateOne({
                _id: courseID,
                "chapters._id": chapterID
            }, {
                $push: {
                    "chapters.$.episodes": episode
                }
            });
            if (createEpisodeResult.modifiedCount == 0)
                throw new createHttpError.InternalServerError("افزودن اپیزود انجام نشد")
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                data: {
                    message: "افزودن اپیزود با موفقیت انجام شد"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getOneEpisodes(req, res, next) {
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