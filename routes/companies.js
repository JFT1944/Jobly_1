"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, isValidatedChecker } = require("../middleware/auth");
const Company = require("../models/company");
const db = require('../db.js')

const companyNewSchema = require("../schemas/companyNew.json");
const companyUpdateSchema = require("../schemas/companyUpdate.json");

const router = new express.Router();


/** POST / { company } =>  { company }
 *
 * company should be { handle, name, description, numEmployees, logoUrl }
 *
 * Returns { handle, name, description, numEmployees, logoUrl }
 *
 * Authorization required: login
 */

router.post("/", isValidatedChecker, async function (req, res, next) {
  try {
    console.log(req.query)
    const validator = jsonschema.validate(req.query, companyNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
console.log(req.query)
    const company = await Company.create(req.query);
    return res.status(201).json({ company });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */
// ######################
// ######################
// you need to write a loop or a filter function that removes all but the suggested
// query string
// ######################
// ######################
router.get("/", async function (req, res, next) {
  try {
    let {name, minEmployees, maxEmployees} = req.query
    console.log([name, minEmployees, maxEmployees])
    
    // // console.log(companies)
    // if (!name && !minEmployees && ! maxEmployees){
    //   return res.json({ companies });
    // }
    if (minEmployees > maxEmployees){
      return res.statusCode(400).json({Error: 'minEmployees cannot be greater than maxEmployeer'})
    }
    const companies = await Company.findAll(name, minEmployees, maxEmployees);



    console.log(companies)
    // console.log(filteredCompanies)
    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});

/** GET /[handle]  =>  { company }
 *
 *  Company is { handle, name, description, numEmployees, logoUrl, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

router.get("/:handle", async function (req, res, next) {
  try {
    const company = await Company.get(req.params.handle);
    const jobs = await db.query(`Select title, salary, equity from jobs where company_handle=$1`, [req.params.handle])
    console.log(jobs)
    company.available_jobs = {job:jobs.rows}
   
   
    return res.json({ company });

  } catch (err) {
    return next(err);
  }
});

/** PATCH /[handle] { fld1, fld2, ... } => { company }
 *
 * Patches company data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: login
 */

router.patch("/:handle", isValidatedChecker, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, companyUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.update(req.params.handle, req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: login
 */

router.delete("/:handle", isValidatedChecker, async function (req, res, next) {
  try {
    await Company.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
