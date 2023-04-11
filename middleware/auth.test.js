"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
  isValidatedChecker

} = require("./auth");


const { SECRET_KEY } = require("../config");
const testJwt = jwt.sign({ username: "test", isAdmin: false }, SECRET_KEY);
const badJwt = jwt.sign({ username: "test", isAdmin: false }, "wrong");


describe("authenticateJWT", function () {
  test("works: via header", function () {
    expect.assertions(2);
     //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const req = { headers: { authorization: `Bearer ${testJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "test",
        isAdmin: false,
      },
    });
  });

  test("works: no header", function () {
    expect.assertions(2);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });

  test("works: invalid token", function () {
    expect.assertions(2);
    const req = { headers: { authorization: `Bearer ${badJwt}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });
});


describe("ensureLoggedIn", function () {
  test("works", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: "test", is_admin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureLoggedIn(req, res, next);
  });

  test("unauth if no login", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureLoggedIn(req, res, next);
  });
});

describe('isValidatedChecker', function(){
  test('checks if admin or account owner', function(){
    
    expect.assertions(1);
    const req = {header:{'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEyMzQ1Njc4OTAiLCJpc0FkbWluIjp0cnVlfQ.ZPUn_0_hAE3sibESRB60tDRkYCU8_9UvfSgQugh5fM0'}};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeFalsy();
    };
    isValidatedChecker(req, res, next)
    // expect(payload).toEqual({
    //   "username": "1234567890",
    //   "isAdmin": true
    // })

//   const payload = 
// // const mockToken = 'payload'
// const checker = isValidatedChecker()



  })
  // #################################################################
  // #################################################################
// I cannot get this to throw error even though the token piece - isAdmin: false
// #################################################################
  // #################################################################

  test('Not account owner or admin', function(){
    
    expect.assertions(1);
    const req = {header:{'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEyMzQ1Njc4OTAiLCJpc0FkbWluIjpmYWxzZX0.X4FL5tjH8jo97kBKNODB84L1lgMnoAfDx84zd0-8a24'}};
    const res = {  };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeFalsy();
    };
    console.log(isValidatedChecker(req, res, next))
    // expect(payload).toEqual({
    //   "username": "1234567890",
    //   "isAdmin": true
    // })

//   const payload = 
// // const mockToken = 'payload'
// const checker = isValidatedChecker()



  })
})