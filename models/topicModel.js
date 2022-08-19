const mongoose = require("mongoose");
const Schema = mongoose.Schema

const TopicSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    topicImages: {
        type: String,
        require: true,
    },
    topicTitle: {
        type: String,
        require: true,
    },
    bodyOfContent: {
        type: String,
        require: true,
    },
    createdByUser: {
        type: String,
        require: true,
    },
    likes: {
        type: Array,
        require: true,
    },
    comment: [
        {
            postedBy: {
                type: Schema.Types.ObjectId,
                ref: 'users',
                required: true
            },
            textComment: {
                type : String,
                require: true,
            }
        }
    ]


}, {
    timestamps: true
})

const topicModel = mongoose.model("topic", TopicSchema)

module.exports = topicModel