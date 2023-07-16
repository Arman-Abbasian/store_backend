function otherConfigs(){
    require('dotenv').config({ path: require('find-config')('.env') })
}
module.exports={
    otherConfigs
}