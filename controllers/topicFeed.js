const Room = require('../models/room.js');

exports.topicFeed = async (req, res) => {
    try {
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
                    count: 1 //this is the output
                }
            },
            {
                $sort: { topic: 1 } // sorting by alphabetical order
            }
        ]);

        if (!topicsObject) {
            return res.status(404).json({ message: 'No topics found' });
        }
        const uniqueTopicsCount = topicsObject.length

        return res.status(200).json({
            uniqueTopicsCount,
            topicsObject
        })
    } catch (error) {
        logger.error('Error occured in topicComp', {error});
        return res.status(500).json({ message: 'Error occurred in topicComp.' });
    }
}