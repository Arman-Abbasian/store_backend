const createHttpError = require("http-errors");

const { PermissionsModel } = require("../../../models/permission");
const { RoleModel } = require("../../../models/role");
const { PERMISSIONS } = require("../../../utils/constans");



function checkPermission(requiredPermissions = []) {
    return async function (req, res, next) {
      try {
        const allPermissions = requiredPermissions.flat(2)
        const user = req.user;
        const role = await RoleModel.findOne({title: user.Role})
        const permissions = await PermissionsModel.find({_id: {$in : role.permissions}})
        const userPermissions = permissions.map(item => item.name)
        const hasPermission = allPermissions.every(permission => {
            return userPermissions.includes(permission)
        })
        if(userPermissions.includes(PERMISSIONS.ALL)) return next()
        if (allPermissions.length == 0 || hasPermission) return next();
        throw createHttpError.Forbidden("you could not access to this section");
      } catch (error) {
        next(error);
      }
    };
  }
  //get the name of permission a input=>for example: "add one product"
  function permissionGuard(permission) {
    return async function (req, res, next) {
      try {
        //find the user.Role by verifyAccessToken middleware
        const {Role} = req.user;
        //find the role of the user in RoleModel
        const role = await RoleModel.findOne({title:Role}).populate([{path:"permissions"}])
        console.log(role)
        if(!role) throw createHttpError.BadRequest("role not found")
        const roleNameArray= role.permissions.map(permission=>permission.name)
        //check if the permission input is existed in the permissions field of found role in Role model
        const isAllowed=roleNameArray.includes(permission)
        if(!isAllowed) throw createHttpError.Forbidden("you could not access to this section");
      return next();
      } catch (error) {
        next(error);
      }
    };
  }
  module.exports = {
    checkPermission,
    permissionGuard
  }