const createError = require("http-errors");
const { StatusCodes:HttpStatus} = require("http-status-codes");
const mongoose = require("mongoose");
const { CategoryModel } = require("../../../models/categories");
const { Controller } = require("../controller");
const { idPublicValidation } = require("../../validators/public.validation");

class CategoryController extends Controller {
  async getAllCategory(req, res, next) {
    try {
      // const category = await CategoryModel.aggregate([
      //     {
      //         $lookup : {
      //             from : "categories",
      //             localField : "_id",
      //             foreignField : "parent",
      //             as : "children",

      //         }
      //     },
      //     {
      //         $project : {
      //             __v : 0,
      //             "children.__v" : 0,
      //             "children.parent" : 0
      //         }
      //     },
      //     {
      //         $match : {
      //             parent : undefined
      //         }
      //     }
      // ])
      // const categories = await CategoryModel.aggregate([
      //     {
      //         $graphLookup : {
      //             from : "categories",
      //             startWith : "$_id",
      //             connectFromField : "_id",
      //             connectToField : "parent",
      //             maxDepth : 5,
      //             depthField : "depth",
      //             as : "children",

      //         }
      //     },
      //     {
      //         $project : {
      //             __v : 0,
      //             "children.__v" : 0,
      //             "children.parent" : 0
      //         }
      //     },
      //     {
      //         $match : {
      //             parent : undefined
      //         }
      //     }
      // ])
      const categories = await CategoryModel.find(
        { parent: undefined },
        { __v: 0 }
      );
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          categories,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getCategoryById(req, res, next) {
    try {
      await idPublicValidation.validateAsync(req.params)
      const {id} = req.params;
      //instead of findOne use from aggregate
      const category = await CategoryModel.aggregate([
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
        {
          $project: 
          {
            __v: 0,
            "children.__v": 0,
            "children.__v": 0,
            
          },
        },
      ]);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          category,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  //get all the categoies that do not have any parent (their parent field is undefined)
  async getAllParents(req, res, next) {
    try {
      const parents = await CategoryModel.find(
        { parent: undefined },
        { __v: 0 }
      );
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          parents,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  //get the children of a specific parent
  async getchildOfParents(req, res, next) {
    try {
      await idPublicValidation.validateAsync(req.params)
      const { id } = req.params;
      const category = await this.checkExistCategory(id);
      const children = await CategoryModel.find(
        { parent:id },
        { __v: 0, parent: 0 }
      );
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          children,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllCategoryWithoutPopulate(req, res, next) {
    try {
      const categories = await CategoryModel.aggregate(
        [
          //just get the main parent
          { 
            $match: 
            {
              parent:undefined
            } 
          },
          //add a field with the name of children that have all children of main parent with the number of level(depth)
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
          {
            $project:
            {
              __v:0,
              "children.__v":0,
            }
          }
        
        ]);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          categories,
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
