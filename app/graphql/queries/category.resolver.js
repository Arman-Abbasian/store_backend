const { GraphQLList, GraphQLString } = require("graphql");
const { CategoryModel } = require("../../models/categories");
const { CategoryType } = require("../typeDefs/category.type");

const CategoriesParentResolver = {
    type: new GraphQLList(CategoryType),
    resolve : async () => {
        const categories = await CategoryModel.find({parent : undefined});
        return categories
    }
}
const CategoryChildResolver = {
    type: new GraphQLList(CategoryType),
    args : {
        parent : {type: GraphQLString},
    },
    resolve : async (_, args) => {
        const {parent} = args;
        console.log(args)
        console.log(parent)
        const categories = await CategoryModel.find({parent});
        return categories
    }
}

module.exports = {
    CategoriesParentResolver,
    CategoryChildResolver
}