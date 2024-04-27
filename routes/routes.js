const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const fs=require('fs')

// Multer configuration for image uploading 
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() +file.originalname);
    }
});

const upload = multer({
    storage: storage,
}).single("image");



// Creating routes for other pages

router.get("/", (req, res) => {
    // res.render("home", { title: "Home-Page" })
    User.find().exec()
        .then(users => {
            res.render('home', {
                title: 'Home-Page',
                users: users
            });
        })
        .catch(err => {
            res.json({ message: err.message });
        });
});

//add the user

router.get("/add", (req, res) => {
    res.render("addUser", { title: "Add-User" })
});

router.post("/add", upload, async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename
    });

    try {
        const saveUser= await user.save();
        // console.log("User inserted Succesfully :",saveUser);
        req.session.message = {
            type: 'success',
            message: 'User added Successfully!'
        };
        res.redirect('/');
    } catch (error) {
        res.json({ message: error.message, type: 'danger' });
    }
});

router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    User.findById(id)
        .then(user => {
            if (!user) {
                res.redirect('/');
            } else {
                res.render('editUser', {
                    title: "Update-User",
                    user: user
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });
});

//update the user
router.post('/update/:id', upload, async (req, res) => {
    try {
        let id = req.params.id;
        let new_image = '';

        if (req.file) {
            new_image = req.file.filename;

            try {
                fs.unlinkSync("./uploads/" + req.body.old_image);
            } catch (err) {
                console.error(err);
            }
        } else {
            new_image = req.body.old_image;
        }

        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        });

        req.session.message = {
            type: 'success',
            message: 'User Updated Successfully!',
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

//delete the user

router.get('/delete/:id', async(req,res)=>{
    try{
        let id=req.params.id;
        let result=await User.findByIdAndDelete(id);
            if(result.image && result){
                try{
                    fs.unlinkSync('./uploads'+result.image)
                }catch(err){
                    console.log(err)
                }
            }
    
        req.session.message={
                type:'info',
                message:"User Deleted Successfully !"
            };
            res.redirect('/')
        }catch(err){
            res.json({message:err.message});
        }
});

router.get("/about", (req, res) => {
    res.render("about", { title: "About-Page" })
});
router.get("/contact", (req, res) => {
    res.render("contact", { title: "Contact-Page" })
});

module.exports = router;
