"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);





// ************************************************************************
// ************************************************************************
// ************************************************************************
// ************************************************************************

describe("POST /jobs", function () {
  const newJob = {
    title: 'test4',
        salary: 180111, 
        equity: '0.0', 
        company_handle:'c2'
  };
// These need to have the authentication from the token during verifying. 
  test("Adding a Job to the Database", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("token", ` ${u2Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({'Job Added': {}});
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/companies")
        .send({
          handle: "new",
          numEmployees: 10,
        })
        .set("token", ` ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/companies")
        .send({
          ...newJob,
          logoUrl: "not-a-url",
        })
        .set("token", ` ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
})

// ************************************************************************
// ************************************************************************
// ************************************************************************
// ************************************************************************
/************************************** GET /companies */

describe("GET /jobs", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({allJobs:[{
        title: 'test1',
            salary: 101111, 
            equity: '0.1', 
            company_handle:'c1'
      },
      {
        title: 'test2',
            salary: 50111, 
            equity: '0.1', 
            company_handle:'c1'
      },
      {
        title: 'test3',
            salary: 80111, 
            equity: '0.0', 
            company_handle:'c3'
      }
    ]});
  });

  test('with title filter', async function(){
    const resp = await request(app).get("/jobs?title=test2")
    expect(resp.body).toEqual([{
        title: 'test2',
            salary: 50111, 
            equity: '0.1', 
            company_handle:'c1'
      }])
  })


  test('with min salary', async function(){
    const resp = await request(app).get("/jobs?minSalary=100000")
    expect(resp.body).toEqual([{
        title: 'test1',
            salary: 101111, 
            equity: '0.1', 
            company_handle:'c1'
      }])
  })
  
  
  test('with has equity', async function(){
    const resp = await request(app).get("/jobs?hasEquity=true")
    expect(resp.body).toEqual([{
        title: 'test1',
            salary: 101111, 
            equity: '0.1', 
            company_handle:'c1'
      },
      {
        title: 'test2',
            salary: 50111, 
            equity: '0.1', 
            company_handle:'c1'
      }])
  })
  test('with all filter', async function(){
    const resp = await request(app).get("/jobs?title=test1&minSalary=70000&hasEquity=true")
    expect(resp.body).toEqual([{
        title: 'test1',
            salary: 101111, 
            equity: '0.1', 
            company_handle:'c1'
      }],)
  })
  test('with all filter & no equity', async function(){
    const resp = await request(app).get("/jobs?title=test1&minSalary=70000&hasEquity=false")
    expect(resp.body).toEqual([])
  })
})


// ************************************************************************
// ************************************************************************
// ************************************************************************
// ************************************************************************
/************************************** GET /companies/:handle */

describe("GET /jobs/:handle", function () {
// mock a function to get job

  // test("works", async function () {
  //   const resp = await request(app).get(`/jobs/1`);
  //   expect(resp.body).toEqual();
  //   done()
  // });
  test("works for anon: company w/o jobs", async function () {
    const resp = await request(app).get(`/companies/c2`);
    expect(resp.body).toEqual({
      company: {
        available_jobs: {
          "job":[]
        },
        handle: "c2",
        name: "C2",
        description: "Desc2",
        numEmployees: 2,
        logoUrl: "http://c2.img",
      },
    });
  });

  // test("not found for no such job", async function () {
  //   const resp = await request(app).get(`/jobs/nope`);
  //   expect(resp.statusCode).toEqual(404);
  //   // done()

// });


// ************************************************************************
// ************************************************************************
// ************************************************************************
// ************************************************************************
/************************************** PATCH /companies/:handle */

describe("PATCH /companies/:handle", function () {
  test("works for users", async function () {
    const resp = await request(app)
        .patch(`/companies/c1`)
        .send({
          name: "C1-new",
        })
        .set("token", ` ${u1Token}`);
    expect(resp.body).toEqual({
      company: {
        handle: "c1",
        name: "C1-new",
        description: "Desc1",
        numEmployees: 1,
        logoUrl: "http://c1.img",
      },
    });
  });
  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/companies/c1`)
        .send({
          name: "C1-new",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such company", async function () {
    const resp = await request(app)
        .patch(`/companies/nope`)
        .send({
          name: "new nope",
        })
        .set("token", ` ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on handle change attempt", async function () {
    const resp = await request(app)
        .patch(`/companies/c1`)
        .send({
          handle: "c1-new",
        })
        .set("token", ` ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
        .patch(`/companies/c1`)
        .send({
          logoUrl: "not-a-url",
        })
        .set("token", ` ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});



// ************************************************************************
// ************************************************************************
// ************************************************************************
// ************************************************************************
/************************************** DELETE /companies/:handle */


  function newFunction() {
    describe("DELETE /jobs/:handle", function () {
      test("works for users", async function () {
        const resp = await request(app)
          .delete(`/jobs/1`)
          .set("token", ` ${u2Token}`);
        expect(resp.body).toEqual({ "Job Deleted": {} });
      });

      test("unauth for anon", async function () {
        const resp = await request(app)
          .delete(`/companies/c1`);
        expect(resp.statusCode).toEqual(401);
      });

      test("not found for no such company", async function () {
        const resp = await request(app)
          .delete(`/companies/nope`)
          .set("token", ` ${u2Token}`);
        expect(resp.statusCode).toEqual(404);
      });
    });
  }
})
