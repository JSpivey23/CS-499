const rateLimit = require("express-rate-limit");

const TRIPS_GET_RATE_LIMIT = 2;
const TRIPS_PUT_RATE_LIMIT = 2;
const TRIPS_POST_RATE_LIMIT = 1;
const IP_LOGIN_LIMIT = 3;
const USER_LOGIN_LIMIT = 3;


function makeLimiter({ windowMs, limit, key ="ip", message = {error: "Too many requests"}}){
  const keyGenerator = 
  typeof key === "function"
  ? key: key ==="token"
  ? (req) => (req.user && req.user.jti ? req.user.jti : req.ip)
  : key === "user"
  ? (req) => (req.user && req.user._id ? req.user._id.toString() : req.ip)
  : (req) => req.ip;

  return rateLimit({
    windowMs, 
    limit, 
    standardHeaders: "draft-7",
    legacyHeaders: false, 
    keyGenerator, 
    message,
  });
}

const tripsGetLimiter = makeLimiter({
  windowMs: 60 * 60 * 1000, // 1 HOUR RESET
  limit: TRIPS_GET_RATE_LIMIT, //NUMBER OF REQUESTS
  key: (req) => (req.user && req.user.jti ? req.user.jti : req.ip),
});

const tripsPutLimiter = makeLimiter({
  windowMs: 60 * 60 * 1000, 
  limit: TRIPS_PUT_RATE_LIMIT, 
  key: "token"
});

const tripsPostLimiter = makeLimiter({
  windowMs: 60 * 60 * 1000, 
  limit: TRIPS_POST_RATE_LIMIT, 
  key: "token"
});

const loginIpLimiter = makeLimiter({
    windowsMs: 10 * 60 * 1000,
    limit: IP_LOGIN_LIMIT, 
    key: "ip",
    message: {error: "Too many login attempts on this IP, please try again later."},
});

const loginUserLimiter = makeLimiter({
    windowMs:10 * 60 * 1000, 
    limit: USER_LOGIN_LIMIT,
    key: (req) => {
        const raw = (req.body && (req.body.email || req.body.username)) 
        const handle = String(raw).trim().toLowerCase();
        return handle ? `login:${handle}`:req.ip;
    },
    message: {error: "Too many login attempts (account), please try again later."}
})



module.exports = {makeLimiter, tripsGetLimiter, tripsPutLimiter, tripsPostLimiter, loginUserLimiter, loginIpLimiter};