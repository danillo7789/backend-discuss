const Room = require('../models/room.js');
const Topic = require('../models/topic.js');

exports.topicFeed = async (req, res, next) => {
    try {
        const uniqueTopicNames = await Topic.distinct('name'); // to avoid duplicates
        const uniqueTopicsCount = uniqueTopicNames.length;
        const topicsObject = await Room.aggregate([
            {
                $group: {
                    _id: '$topic',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'topics',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'topicDetails'
                }
            },
            {
                $unwind: '$topicDetails'
            },
            {
                $project: {
                    _id: 0,
                    topic: '$topicDetails.name',
                    count: 1
                }
            },
            {
                $sort: { topic: 1 } // sorting by alphabetical order
            }
        ]);

        if (!topicsObject) {
            res.status(404);
            throw new Error('No topics found');
        }

        return res.status(200).json({
            uniqueTopicsCount,
            topicsObject
        })
    } catch (error) {
        console.log('Error occurred in topicComp', error);
        res.status(500);
        return next(new Error('Error occurred in topicComp.'));
    }
}