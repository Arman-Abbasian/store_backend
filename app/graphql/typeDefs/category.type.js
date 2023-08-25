const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");
const { AnyType, PublicCategoryType } = require("./public.types");

const CategoryType  = new GraphQLObjectType({
    name: "CategoryType",
    fields : {
        _id : {type: GraphQLString},
        title: {type: GraphQLString},
        children : {type: new GraphQLList(PublicCategoryType)}
    }
})
module.exports = {
    CategoryType
}