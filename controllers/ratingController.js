const Rating = require('../models/Rating');
const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');

module.exports = {
    addRating: async (req, res) => {
        const newRating = new Rating({
            userId: req.user.id,
            ratingType: req.body.ratingType,
            product: req.body.product,
            rating: req.body.rating
        });

        try {
            await newRating.save();

            if (req.body.ratingType === 'Restaurant') {
                const restaurant = await Rating.aggregate([
                    { $match: { ratingType: req.body.ratingType, product: req.body.product } },
                    { $group: { _id: '$product', averateRating: { $avg: '$rating' } } }
                ])

                if (restaurant.length > 0) {
                    const averateRating = restaurant[ 0 ].averateRating;
                    await Restaurant.findByIdAndUpdate(req.body.product, { rating: averateRating }, { new: true });
                }
            } else if (req.body.ratingType === 'Food') {
                const foods = await Rating.aggregate([
                    { $match: { ratingType: req.body.ratingType, product: req.body.product } },
                    { $group: { _id: '$product', averateRating: { $avg: '$rating' } } }
                ])

                if (foods.length > 0) {
                    const averateRating = foods[ 0 ].averateRating;
                    await Food.findByIdAndUpdate(req.body.product, { rating: averateRating }, { new: true });
                }
            }

            return res.status(201).json({ message: 'Rating added successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    checkUserRating: async (req, res) => {
        const ratingType = req.query.ratingType;
        const product = req.query.product;

        try {
            const existingRating = await Rating.findOne({ userId: req.user.id, ratingType: ratingType, product: product });

            if (existingRating) {
                return res.status(200).json({ message: 'User has already rated this product' });
            } else {
                return res.status(200).json({ message: 'User has not rated this product' });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });

        }
    }
}