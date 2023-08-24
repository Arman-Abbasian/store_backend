const { graphQLSchema } = require("../graphql/index.graphql")

function graphqlConfig(req, res){
    return {
        schema: graphQLSchema,
        //permission to use graphql playground in chrome
        graphiql: true,
        context: {req, res}
    }
}

module.exports = {
    graphqlConfig
}