"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, isValidatedChecker } = require("../middleware/auth");
// const jobs = require("../models/jobs");
const { route } = require("./users");
const Jobs = require("../models/jobs");

// const jobsNewSchema = require("../schemas/jobNew.json");
// const jobsUpdateSchema = require("../schemas/jobUpdate.json");

const router = new express.Router(); 


/** Viewing all Jobs **/
router.get('/', async function(req, res, next){

let {title, minSalary, hasEquity} = req.query
console.log([title, minSalary, hasEquity])



const allJobs = await Jobs.findAll()
// console.log(allJobs)
if (!title && !minSalary && !hasEquity){
    return res.json({ allJobs })}

let filteredJobs = []
    for (let job of allJobs){
        let iFA = []
        let filter_count = 0
        // console.log(job)
    if(title){
        // console.log('intitle')
        // console.log(job.title) 
        filter_count = filter_count + 1
        if(job.title.toLowerCase().indexOf(title.toLowerCase()) !== -1){
            // console.log('titlepushed')
            iFA.push(job)
            // console.log(job)
            
        }
    }
    // console.log(filter_count)
    if(minSalary){
        filter_count = filter_count + 1

        if(job.salary >= minSalary){
            // console.log('salary')
            iFA.push(job)
        
        }
    }
    // console.log(filter_count)
    if(hasEquity){
        filter_count = filter_count + 1
    if(hasEquity === 'true'){
        
        if(Math.abs(job.equity) > 0){
            // console.log(job)
            iFA.push(job)
            
        }
    }}
    // console.log([iFA.length, filter_count])
    if(iFA.length === filter_count){
        if(iFA.length !== 0){
        console.log('push final')
        filteredJobs.push(iFA[0])}
    }

}
// console.log(filteredJobs)


res.json(filteredJobs)
})


/** Creating a new Job **/

router.post('/', isValidatedChecker, async function(req, res, next){

const result = Jobs.create(req.body)


res.json({'Job Added': result})
})

/** Viewing a single Job **/
router.get('/:id', async function(req, res, next){
    
   try{ const singleJob = await Jobs.get(req.params.id)
    console.log(singleJob)
} catch(err){
    throw new BadRequestError(err)
}
    

return res.json(singleJob)
})

/** Updating an already created job **/
router.patch('/:id', isValidatedChecker, async function(req, res, next){
    console.log(req.body)
    let updatedJob = await Jobs.update(req.params.id, req.body)
    console.log(updatedJob)


res.json({'Updated Job': updatedJob})
})

/** Deleting a job **/
router.delete('/:id', isValidatedChecker, async function(req, res, next){
    const deletedJob = Jobs.remove(req.params.id)

res.json({'Job Deleted': deletedJob})
})







module.exports = router