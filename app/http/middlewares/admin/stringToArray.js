// tag1#tag2#tag_tagname#
// string                                => [...values] || [value] || []
// undefined || null
const stringToArray = function(...args) {
    return function(req, res, next) {
        const fields = args;
        fields.forEach(field => {
            //if that field sent by body 
            if(req.body[field]){
                //if the typeof that body field was string
                if(typeof req.body[field] == "string"){
                    //if the format of body was #tag1#tag2#tag3
                    if(req.body[field].indexOf("#") >=0){
                        req.body[field] = (req.body[field].split("#")).map(item => item.trim())
                         //remove the repetitive  tags
                        req.body[field] = [... new Set(req.body[field])]
                        //if the format of body was tag1,tag2,tag3
                    }else if(req.body[field].indexOf(",") >=0){
                        req.body[field] = (req.body[field].split(",")).map(item => item.trim())
                         //remove the repetitive  tags
                        req.body[field] = [... new Set(req.body[field])]
                    }else{ 
                        //if client send one tag=>put that tag in array
                        req.body[field] = [req.body[field]]
                    }
                }
                //if the format of body field was array
                if(Array.isArray(req.body[field])){
                    //trim the each element of array
                    req.body[field] = req.body[field].map(item => item.trim())
                    //remove the repetitive  tags
                    req.body[field] = [... new Set(req.body[field])]
                }
            }else{
                req.body[field] = []
            }
        })
        next()
    }
}
module.exports = {
    stringToArray
}