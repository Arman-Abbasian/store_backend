const createError = require("http-errors");
const { StatusCodes:HttpStatus} = require("http-status-codes");
const mongoose = require("mongoose");
const { CategoryModel } = require("../../../models/categories");
const { Controller } = require("../controller");

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
      const { id: _id } = req.params;
      const category = await CategoryModel.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(_id) },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "parent",
            as: "children",
          },
        },
        {
          $project: {
            __v: 0,
            "children.__v": 0,
            "children.parent": 0,
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
  async getchildOfParents(req, res, next) {
    try {
      const { parent } = req.params;
      const children = await CategoryModel.find(
        { parent },
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
      const categories = await CategoryModel.aggregate([{ $match: {} }]);
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
}
module.exports = {
  CategoryController: new CategoryController(),
};
