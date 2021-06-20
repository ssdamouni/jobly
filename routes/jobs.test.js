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
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** POST /companies */

describe("POST /jobs", function () {
    const newJob = {
        title:"new job",
        salary: 100000,
        equity: "0",
        company_handle: "c1"
    }
  
    test("ok for users", async function () {
      const resp = await request(app)
          .post("/jobs")
          .send(newJob)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
        job: newJob,
      });
    });
  
    test("bad request with missing data", async function () {
      const resp = await request(app)
          .post("/jobs")
          .send({
            title:"newer"
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
    });
  
    test("bad request with invalid data", async function () {
      const resp = await request(app)
          .post("/jobs")
          .send({
            title:"new job",
            salary: "100000",
            equity: "0",
            company_handle: 1234
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
    });
  });


describe("GET /jobs", function () {
    test("ok for anon", async function () {
      const resp = await request(app).get("/jobs").set("authorization", `Bearer ${u1Token}`);;
      expect(resp.body).toEqual({
        jobs:
            [
              {
                id: resp.body.jobs[0].id,
                title:"title1",
                salary: 100000,
                equity: "0",
                company_handle: "c1"
              },
              {
                id: resp.body.jobs[1].id,
                title:"title2",
                salary: 100000,
                equity: "0",
                company_handle: "c2"
              },
              {
                id: resp.body.jobs[2].id,
                title:"title3",
                salary: 100000,
                equity: "0",
                company_handle: "c3"
              }
            ],
      });
    })
});


// DELETE route for Jobs
describe("DELETE /jobs/:id", function () {
    test("works for users", async function () {
      const fakeJob = await db.query("INSERT INTO jobs (id, title, salary, equity, company_handle) VALUES (999, 'fakeJob', 100000, '0', 'c1')")
      const resp = await request(app)
          .delete(`/jobs/999`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({ deleted: "999" });
    });
  
    test("unauth for anon", async function () {
      const resp = await request(app)
          .delete(`/jobs/999`);
      expect(resp.statusCode).toEqual(401);
    });
  
    test("not found for no such company", async function () {
      const resp = await request(app)
          .delete(`/jobs/1000`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(404);
    });
  });