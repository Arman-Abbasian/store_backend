const { Controller } = require("../controller");


class HomeController extends Controller{
    async indexPage(req, res, next) {
        try {
          return res.status(200).send("Index Page Store"+ this.testMethod());
        } catch (error) {
          next(error);
        }
      }

}
module.exports={
    homeController:new HomeController()
}