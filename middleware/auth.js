"use strict";

/** Convenience middleware to handle common auth cases in routes. */

// const jwt = require("jsonwebtoken");
const { rawListeners } = require("superagent");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");
const jwt = require('jsonwebtoken')

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    // console.log(res.locals.user)
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

// THIS FUNCTION CHECKS TO SEE IF THE USER HAS ADMIN QUALIFICATIONS
// THIS FUNCTION ALSO CHECKS IF A USER HAS THE SAME USERNAME AS THE SPECIFIC PAGE IF THEY ARENT ADMIN
function isValidatedChecker(req, res, next) {
  try {
    console.log(SECRET_KEY)
    // console.log(user)
    
    const { token } = req.headers
    if(!token) throw new UnauthorizedError()
    console.log(token)
    let payload = jwt.verify(token, SECRET_KEY)
    console.log(payload)
    if(payload){
      // console.log()
      if (token.isAdmin !== false){
        return next()
      } else if(token.username === req.params.username){
        return next()
      }
      res.redirect('/auth/register')
    }
    // console.log(res.locals.user)
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  isValidatedChecker
};
