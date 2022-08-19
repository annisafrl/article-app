const express = require("express");
const userModel = require("../../models/userModel");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { hash } = require("bcrypt");
const { decode } = require("jsonwebtoken");
require('dotenv').config();
const Topic = require("../../models/topicModel");
const { sign } = require("jsonwebtoken");
const mongoose = require("mongoose");
const cloudinary = require("../../middlewares/cloudinary")
const upload =  require("../../middlewares/multer");

router.post("/createTopic", upload.single('image'), async function (req, res, next) {
    try {
        const {
            topicTitle,
            bodyOfContent,
        } = req.body;
        

        const decodeToken = req.decode;

        console.log(JSON.stringify({ decodeToken }));
        const result = await cloudinary.v2.uploader.upload(req.file.path)
        await Topic.create({ user: decodeToken.userid, topicTitle, bodyOfContent, topicImages : result.secure_url});

        res.status(200).json({
            success: true,
            message: "topic created!",
            result
        })

    } catch (error) {
        next(error)
    }
})

router.post("/:idTopic/uploadImage", upload.single('image'), async function (req, res, next) {
    try {
        const decodeToken = req.decode;
        const result = await cloudinary.v2.uploader.upload(req.file.path)
        await Topic.findByIdAndUpdate(req.params.idTopic,{user: decodeToken.userid, topicImages : result.secure_url});
        
        res.status(200).json({
            success: true,
            message: "image has been uploaded!",
            result
        })

    } catch (error) {
        next(error)
    }
})

router.get("/", async function (req, res, next) {
    try {
        const getTopic = await Topic.find().populate("user");

        res.status(200).json({
            success: true,
            data: getTopic,
            message: "data has been retrieved successfully!"
        })
    } catch (error) {
        next(error)
    }
})

router.get("/", async function (req, res, next) {
    try {
        const getTopic = await Topic.find().populate("user");

        res.status(200).json({
            success: true,
            data: getTopic,
            message: "data has been retrieved successfully!"
        })
    } catch (error) {
        next(error)
    }
})

router.get("/getComment/:idTopic/:idComment", async function (req, res, next) {
    try {
        const decodeToken = req.decode;
        const topic = await Topic.findById(req.params.idTopic).lean();
        console.log(topic)
        const currentComment = topic.comment.find(obj => obj._id.toString() === req.params.idComment);

        console.log(currentComment)

        if(!currentComment) {
            res.status(404).json({
                success: false,
                message: "comment is not found!"
            })
            return;
        }
        if (currentComment.postedBy.toString() === decodeToken.userid) {
            const resultTopic = await Topic.findOne({"_id": req.params.idTopic, "comment._id": req.params.idComment}).populate({
                path: 'comment.postedBy',
                model: 'users' }
            ).lean()
            const data= resultTopic.comment.find(obj=> obj._id.toString() === req.params.idComment);
            res.status(200).json({
                success:true,
                data
            })
            
        } else {
            res.status(403).json({
                success: false,
                message: "you can't access other's comment!"
            })
        }
    } catch (error) {
        next(error)
    }
})

router.post("/:id/commentTopic", async function (req, res, next) {

    try {
            const {textComment} = req.body
            const decodeToken = req.decode;
            const topic = await Topic.findById(req.params.id)
            if (!topic.comment.includes(decodeToken.userid)) {
                await Topic.findByIdAndUpdate(req.params.id, { $push: {comment: { postedBy: decodeToken.userid , textComment}}})
                res.status(200).json({
                    success: true,
                    message: "topic has been comment"
                })
            } else {
                res.status(403).json({
                    success: false,
                    message: "failed to comment!"
                })
            }
        

    } catch (error) {
        next(error)
    }
})

router.post("/:idTopic/:idComment/updateComment", async function (req, res, next) {

    try {
        const {textComment} = req.body
        const decodeToken = req.decode;
        const topic = await Topic.findById(req.params.idTopic).lean();
        console.log(topic)
        const currentComment = topic.comment.find(obj => obj._id.toString() === req.params.idComment);

        console.log(currentComment)

        if(!currentComment) {
            res.status(404).json({
                success: false,
                message: "comment is not found!"
            })
            return;
        }
        if (currentComment.postedBy.toString() === decodeToken.userid) {
            await Topic.findOneAndUpdate({_id:req.params.idTopic, "comment._id": req.params.idComment},
            { "$set": {"comment.$.textComment":textComment } })
            res.status(200).json({
                success: true,
                message: "comment has been update"
            })
        } else {
            res.status(403).json({
                success: false,
                message: "you can't update other's comment!"
            })
        }
    

} catch (error) {
    next(error)
}
})

router.delete("/:idTopic/:idComment/deleteComment", async function (req, res, next) {

    try {
        const decodeToken = req.decode;
        const topic = await Topic.findById(req.params.idTopic).lean();
        console.log(topic)
        const currentComment = topic.comment.find(obj => obj._id.toString() === req.params.idComment);

        console.log(currentComment)

        if(!currentComment) {
            res.status(404).json({
                success: false,
                message: "comment is not found!"
            })
            return;
        }
        if (currentComment.postedBy.toString() === decodeToken.userid) {
            await Topic.findByIdAndUpdate(req.params.idTopic, {$pull: {comment: { _id: req.params.idComment }}})
            res.status(200).json({
                success: true,
                message: "comment has been delete"
            })
        } else {
            res.status(403).json({
                success: false,
                message: "you can't delete other's comment!"
            })
        }
    

} catch (error) {
    next(error)
}
})

router.put("/:idTopic/updateTopic", async function (req, res, next) {
    try {
        const {
            topicTitle,
            bodyOfContent
        } = req.body;

        const decodeToken = req.decode;
        await Topic.findByIdAndUpdate(req.params.idTopic, {user: decodeToken.userid,topicTitle, bodyOfContent });

        res.status(200).json({
            success: true,
            message: "topic has been update!",
        })

    } catch (error) {
        next(error)
    }
})

router.delete("/:idTopic/deleteTopic", async function (req, res, next) {
    try {

        const decodeToken = req.decode;
        await Topic.findByIdAndDelete(req.params.idTopic,{user: decodeToken.userid});

        res.status(200).json({
            success: true,
            message: "topic has been delete!",
        })

    } catch (error) {
        next(error)
    }
})


module.exports = router;