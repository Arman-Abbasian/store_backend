const {StatusCodes: HttpStatus} = require("http-status-codes")
const createHttpError = require("http-errors");

const { PermissionsModel } = require("../../../../models/permission")
const { copyObject, deleteInvalidPropertyInObject } = require("../../../../utils/functions");
const { Controller } = require("../../controller");
const { addPermissionSchema, editPermissionSchema } = require("../../../validators/admin/RBAC.validation/permission.validation");
const { default: mongoose } = require("mongoose");

class PermissionControlller extends Controller {
    async getAllPermissions(req, res, next){
        try {
            const permissions = await PermissionsModel.find({})
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    permissions
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async removePermission(req, res, next){
        try {
            const {id} = req.params;
            await this.findPermissionWithID(id)
            const removePermissionResult = await PermissionsModel.deleteOne({_id: id})
            if(!removePermissionResult.deletedCount) throw createHttpError.InternalServerError("server error")
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: "permission removed successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async createNewPermission(req,res, next){
        try {
            const {name, description} = await addPermissionSchema.validateAsync(req.body);
            //check if the name is exist before(because name must be unique)
            await this.findPermissionWithName(name)
            const permission = await PermissionsModel.create({ name, description })
            if(!permission) throw createHttpError.InternalServerError("server error")
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                data : {
                    message: "permission created successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updatePermissionByID(req, res, next){
        try {
            const {id} = req.params;
            await this.findPermissionWithID(id)
            await editPermissionSchema.validateAsync(req.body)
            const data = copyObject(req.body)
            const validData=deleteInvalidPropertyInObject(data, ["_id"])
            const updatePermissionResult = await PermissionsModel.updateOne({_id : id}, {
                $set: validData
            });
            if(!updatePermissionResult.modifiedCount) throw createHttpError.InternalServerError("server error")
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data : {
                    message: "permission edited successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async findPermissionWithName(name){
        const permission =  await PermissionsModel.findOne({name});
        if(permission) throw createHttpError.BadRequest("name is existed before")
    }
    async findPermissionWithID(_id){
        if(!mongoose.isValidObjectId(_id)) throw createHttpError.BadRequest("param is not true")
        const permission =  await PermissionsModel.findOne({_id});
        if(!permission) throw createHttpError.NotFound("permission not found")
        return permission
    }
}
module.exports = {
    PermissionControlller : new PermissionControlller()
}