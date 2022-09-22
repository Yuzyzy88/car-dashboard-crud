const express = require('express');
const multer = require('multer');
const { Car } = require("../models");
const { imageFilter } = require('../helpers')
const router = express.Router();

// define the storage location for our images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/');
    },
    // by default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

async function create(req, res) {
    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('image');
    upload(req, res, function (err) {
        Car.create({
            name: req.body.name,
            price: req.body.price,
            size: req.body.size,
            image: req.file ? req.file.originalname : "",
        })
        res.redirect('/');
    })
}

async function list(req, res) {
    try {

        const data = await Car.findAll();
        return res.status(200).json({
            success: true,
            error: false,
            data: data,
            message: " Data successfully populated"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: true,
            data: null,
            message: error
        });
    }
}

async function destroy(req, res) {

    try {
        const data = await Car.destroy({ where: { id: req.params.id } });
        return res.status(200).json({
            success: true,
            error: false,
            data: data,
            message: " Data successfully deleted"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: true,
            data: null,
            message: error
        });
    }
}


async function update(req, res,) {
    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('image');
    const { id } = req.params;
    upload(req, res, async (err) => {
        await Car.findOne({
            where: { id: req.params.id }
        }).then(car => {
            console.log('masuk', req.body);
            car.update({
                name: req.body.name,
                price: req.body.price,
                size: req.body.size,
                image: req.file ? req.file.originalname : car.image
            });
        });

    });
    res.json({
        message: "Berhasil Update"
    })
}

router.post("/", create);
router.get("/", list);
router.delete("/delete/:id", destroy);
router.put("/update/:id", update);

module.exports = { carsRouter: router };