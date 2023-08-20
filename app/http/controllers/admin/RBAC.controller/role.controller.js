const {StatusCodes: HttpStatus} = require("http-status-codes")
const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");

const { RoleModel } = require("../../../../models/role")
const { copyObject, deleteInvalidPropertyInObject } = require("../../../../utils/functions");
const { addRoleSchema,editRoleSchema } = require("../../../validators/admin/RBAC.validation/role.validation");
const { Controller } = require("../../controller");

class RoleControlller extends Controller {
    async getAllRoles(req,res, next){
        try {
            const roles = await RoleModel.find({});
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data : {
                    roles
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async createNewRole(req,res, next){
        try {
            //1- validate the client data body
            const {title,description, permissions} = await addRoleSchema.validateAsync(req.body);
            //check the title is repetitiv or not
            await this.checkIfTitleIsRepetitiv(title)
            const role = await RoleModel.create({ title,description, permissions })
            if(!role) throw createHttpError.InternalServerError("server error")
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                data : {
                    message: "role made successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async removeRole(req, res, next){
        try {
            const {field} = req.params;
            const role = await this.findRoleWithIdOrTitle(field)
            const removeRoleResult = await RoleModel.deleteOne({_id : role._id});
            if(!removeRoleResult.deletedCount) throw createHttpError.InternalServerError("server error")
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data : {
                    message: "role deleted successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updateRoleByID(req, res, next){
        try {
            //get the params from client
            const {id} = req.params;
            //find the role in DB with title or _id of a role
            const role = await this.findRoleWithIdOrTitle(id)
            //get a clone from sent body data
            const data = copyObject(req.body)
            //validation the data
            await editRoleSchema.validateAsync(data)
            //remove the bad value(in string fields and array fields) and remove forbidden fields
            const validData=deleteInvalidPropertyInObject(data, ["_id"])
            const updateRoleResult = await RoleModel.updateOne({_id : role._id}, {
                $set: validData
            });
            if(!updateRoleResult.modifiedCount) throw createHttpError.InternalServerError("server error")
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data : {
                    message: "role edited successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    //check if the title exist before or not
    async checkIfTitleIsRepetitiv(title){
        const role =  await RoleModel.findOne({title});
        if(role) throw createHttpError.BadRequest("title existed before")
    } 
//because here title is also unique=> we can use _id or title to find in DB
    async findRoleWithIdOrTitle(field){
        let findQuery = mongoose.isValidObjectId(field)? {_id: field} : {title: field}
        const role = await RoleModel.findOne(findQuery)
        if(!role) throw createHttpError.NotFound("role no found")
        return role
    }
}
module.exports = {
    RoleController : new RoleControlller()
}