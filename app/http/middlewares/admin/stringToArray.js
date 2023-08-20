// tag1#tag2#tag_tagname#
// string   => [...values] || [value] || []
const createError = require("http-errors")

// undefined || null
//1- change value that client send as array
//2-filter the each element of array and delete bad elements
const stringToArray = function(...args) {
    let badValues=[""," ",null,undefined,NaN,"null","undefined","NaN"]
    return function(req, res, next) {
        try {
        const fields = args;
        fields.forEach(field => {
            if(req.body[field]){
                if(typeof req.body[field] == "string"){
                    if(req.body[field].indexOf("#") >=0){
                        req.body[field] = (req.body[field].split("#"))   
                    }else if(req.body[field].indexOf(",") >=0){
                        req.body[field] = (req.body[field].split(","))
                    }else{ 
                        req.body[field] = [req.body[field]]
                    }
                }
                if(Array.isArray(req.body[field])){
                    //remove the gap from start and end of each element
                    req.body[field] = req.body[field].map(item => item.trim())
                    //remove each element of array that contain one of bad values
                    req.body[field]=req.body[field].filter(item=>!badValues.includes(item))
                    //remove the duplicate value
                    req.body[field] = [... new Set(req.body[field])]
                }
            }else{
                req.body[field] = []
            }
        })
        next()
        } catch (error) {
            next(error)
        }
    }
}
module.exports = {
    stringToArray
}
