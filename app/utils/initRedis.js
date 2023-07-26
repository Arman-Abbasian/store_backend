//make a redis DB
const redisDB = require("redis");
//make a redis server
const redisClient = redisDB.createClient();
redisClient.connect();
//when server in connection
redisClient.on("connect", () => console.log("connect to redis"));
//when server connected
redisClient.on("ready", () => console.log("connected to redis and ready to use..."));
//when server not connected
redisClient.on("error", (err) => console.log("RedisError: ", err.message));
//when sever disconnected
redisClient.on("end", () => console.log("disconnected from redis...."))

module.exports = redisClient