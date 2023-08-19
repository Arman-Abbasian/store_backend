const { StatusCodes: HttpStatus } = require("http-status-codes");
const { Controller } = require("../controller");
const { UserModel } = require("../../../models/users");

class UserController extends Controller{
    async getAllUsers(req, res, next){
        try {
            const {search} = req.query;
            const databaseQuery = {};
            if(search) databaseQuery['$text'] = {$search : search}
            console.log(databaseQuery)
            const users = await UserModel.find(databaseQuery);
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data : {
                    users
                }
            })
        } catch (error) {
            next(error)
        }
    }
}
module.exports = {
    UserController : new UserController(),
}