const createError = require("http-errors");
const { StatusCodes:HttpStatus} = require("http-status-codes")
const mongoose = require("mongoose");



const { addCategorySchema,updateCategorySchema } = require("../../validators/admin/category.validation");
const { CategoryModel } = require("../../../models/categories");
const { Controller } = require("../controller");

class CategoryController extends Controller {
  async addCategory(req, res, next) {
    try {
        //validate title and parent that client sent
      await addCategorySchema.validateAsync(req.body);
      //destructure the body
      const { title, parent } = req.body;
      //check if the title is before existed
     const repetativTitle= await CategoryModel.findOne({title});
     if(repetativTitle) throw createError[400]("title is existed before")
     //create a new category in DB
        if (parent!==undefined){
            console.log(parent)
            const parentExistanceInCollection= await CategoryModel.findOne({_id:parent});
     if(!parentExistanceInCollection) throw createError[400]("parent is not existed")
        }
      const category = await CategoryModel.create({ title, parent });
      if (!category) throw createError.InternalServerError("server error");
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        data: {
          message: "category created successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async removeCategory(req, res, next) {
    try {
      const { id } = req.params;
      const category = await this.checkExistCategory(id);
      const deleteResult = await CategoryModel.deleteMany({
        $or: [{ _id: category._id }, { parent: category._id }],
      });
      if (deleteResult.deletedCount == 0)
        throw createError.InternalServerError("حدف دسته بندی انجام نشد");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "حذف دسته بندی با موفقیت انجام شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async editCategoryTitle(req, res, next) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const category = await this.checkExistCategory(id);
      await updateCategorySchema.validateAsync(req.body);
      const resultOfUpdate = await CategoryModel.updateOne(
        { _id: id },
        { $set: {title} }
      );
      if (resultOfUpdate.modifiedCount == 0)
        throw createError.InternalServerError("به روزرسانی انجام نشد");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "به روز رسانی با موفقیت انجام شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async checkExistCategory(id) {
    const category = await CategoryModel.findById(id);
    if (!category) throw createError.NotFound("دسته بندی یافت نشد");
    return category;
  }
}
module.exports = {
  CategoryController: new CategoryController(),
};
