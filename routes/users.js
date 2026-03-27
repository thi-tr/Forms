const express = require('express');
const router = express.Router();
  
router.route('/').get((req, res)=>{
    res.send('User List');
}).post((req,res) =>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const gender = req.body.gender;
    const age = req.body.age;
    
    const isValid = firstName !=="";
    if(isValid){
        console.log(`Adding User: ${firstName}, ${lastName}, ${gender}, ${age}`);
        users.push({firstName, lastName, gender, age})
        res.render('users/list', {users});
    }
    else{
        console.log("Error adding user!");
        res.render("/users/new", {firstName:firstName, lastName:lastName, gender:gender, age:age});
    }
});
router.get('/list', (req,res) =>{
    res.render('users/list', {users})
});
router.get('/new', (req, res)=>{ // /users/new
    res.render('users/new', {firstName: "First", lastName: "Last", gender: "M/F", age: "00"});
});
//router.get('/:id', (req, res)=>{
// res.send(`Getting User Data: ${req.params.id}`);
//});

router.route('/:id').get((req, res)=>{
    console.log(req.user);
    console.log('Getting user data!')
    res.send(`Getting User data for id: ${req.user['firstName']} ${req.user['lastName']},
                                        ${req.user['gender']}, ${req.user['age']}`);
}).delete((req, res)=>{
    res.send(`Deleting User data for id: ${req.params.id}`);
}).put((req, res)=>{
    res.send(`Updating User data for id: ${req.params.id}`);
});

const users = [{firstName: "Thi", lastName: "Tran", gender: "F", age: "22"}, 
               {firstName: "Danny", lastName: "Brown", gender: "M", age: "26"}];
router.param("id", (req, res, next, id) =>{
    req.user = users[id];
    next();
});

module.exports = router;