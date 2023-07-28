const createError = require("http-errors");
const { StatusCodes:HttpStatus} = require("http-status-codes")
const mongoose = require("mongoose");



const { addCategorySchema,updateCategorySchema } = require("../../validators/admin/category.validation");
const { CategoryModel } = require("../../../models/categories");
const { Controller } = require("../controller");
const { idPublicValidation } = require("../../validators/public.validation");

class CategoryController extends Controller {
  //make a new category
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
  //delete a category
  async removeCategory(req, res, next) {
    try {
      //check if the id param is a mongoID
      await idPublicValidation.validateAsync(req.params)
      const { id } = req.params;
      //check if the category with the id existed in collection or not
      const category = await this.checkExistCategory(id);
      //delete the category and all their children
      const categoryy = await CategoryModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        //add field with the name=>children then find all the documents in categories collection
        //that the _id field of them is equal to parent field of finded document
        {
          $graphLookup:
          {
            from:"categories",
            startWith:"$_id",
            connectFromField:"_id",
            connectToField:"parent",
            //maximum level
            maxDepth:5,
            // name of field that show the level
            depthField:"depth",
            //name of field
            as:"children"
          }
        },
      ]);
      //delete the category with all of it's children in every level
      const deleteResult=await CategoryModel.deleteMany({ _id: { $in: categoryy } })
      if (deleteResult.deletedCount == 0)
        throw createError.InternalServerError("server error");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "deleted successfully",
        },
     });
    } catch (error) {
      next(error);
    }
  }
  //edit the title of a catogory
  async editCategoryTitle(req, res, next) {
    try {
      await idPublicValidation.validateAsync(req.params);
      await updateCategorySchema.validateAsync(req.body);
      const { id } = req.params;
      const { title } = req.body;
      const category = await this.checkExistCategory(id);
      const resultOfUpdate = await CategoryModel.updateOne(
        { _id: id },
        { $set: {title} }
      );
      if (resultOfUpdate.modifiedCount == 0)
        throw createError.InternalServerError("server error");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "update successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async checkExistCategory(id) {
    const category = await CategoryModel.findById(id);
    if (!category) throw createError.NotFound("catrgory is not exist");
    return category;
  }
}
module.exports = {
  CategoryController: new CategoryController(),
};
