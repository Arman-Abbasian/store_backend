async function foldername(req,res,next){
try {
   req.body.f="ali";
   console.log(1)
   return next()
} catch (error) {
    next(error)
}
}
module.exports={
    foldername
}