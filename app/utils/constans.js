module.exports = {
    MongoIDPattern : /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i ,
    //when you freeze a object, then you can change the property value of that object or can not add
    //new property to it
    ROLES : Object.freeze({
        //ordinary users
        USER : "USER",
        //admin of site
        ADMIN : "ADMIN",
        //super admin of site
        SUPERADMIN : "SUPERADMIN",
        // persons who just produce cotext(add products or write blogs)
        WRITER : "WRITER",
        //person who is the owner of a virtual product
        TEACHER : "TEACHER",
        // person who is the owner of a product
        SUPPLIER : "SUPPLIER",
         // person who is the front-end developer of the website
        DEVELOPER : "DEVELOPER",
    }),
    PERMISSIONS : Object.freeze({
        USER : ["profile"],
        ADMIN : ["all"],
        SUPERADMIN : ["all"],
        WRITER :[ "course", "blog", "category", "product"],
        TEACHER :[ "course", "blog"],
        SUPPLIER : ["product"],
        DEVELOPER:['developer'],
        ALL : "all"
    }),
    ACCESS_TOKEN_SECRET_KEY : "CCEBD888251E547C877C43A324B5DE12468F431EA0D19A259751E2C80EE35876",
    REFRESH_TOKEN_SECRET_KEY : "782285F688AC9B7CFF599230A39C49558A9D4B615B85AF706A80FAF52C897FB5",
    COOKIE_PARSER_SECRET_KEY : "F5B9A2C123ED6C11FFCC82D331681E25372112B817F76B28114993B57CAB3BC8"
}