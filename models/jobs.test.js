"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./jobs");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("create", function () {
    const newJob = {
        title:"new job",
        salary: 100000,
        equity: "0",
        company_handle: "c1"
    };
  
    test("works", async function () {
      let job = await Job.create(newJob);
      expect(job).toEqual(newJob);
  
      const result = await db.query(
            `SELECT title, salary, equity, company_handle
             FROM jobs
             WHERE company_handle = 'c1'`);
      console.log(result.rows)
      expect(result.rows).toEqual([
        {
            title:"new job",
            salary: 100000,
            equity: "0",
            company_handle: "c1"
        },
      ]);
    });
  
    test("not a bad request with dupe", async function () {
      try {
        await Company.create(newJob);
        await Company.create(newJob);
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeFalsy();
      }
    });
  });
  