const Restaurant = require('../models/Restaurant')

module.exports = {
    addRestaurant: async (req, res) => {
        const { title, time, imageUrl, owner, code, logoUrl, coords } = req.body;
        if (!title || !time || !imageUrl || !owner || !code || !logoUrl || !coords || !coords.latitude || !coords.longitude || !coords.address || !coords.title) {
            return res.status(400).json({ error: 'Please provide all the required fields ' });
        }

        try {
            const restaurant = new Restaurant(req.body)
            await restaurant.save()
            res.status(201).send(restaurant)
        } catch (e) {
            res.status(400).send(e)
        }
    },
    getRestaurantById: async (req, res) => {
        const id = req.params.id;
        try {
            const restaurant = await Restaurant.findById(id)
            if (!restaurant) {
                return res.status(404).send()
            }
            res.status(200).send(restaurant);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllNearByRestaurants: async (req, res) => {
        const code = req.params.code;
        try {
            let allNearByRestaurants = [];

            if (code) {
                allNearByRestaurants = await Restaurant.aggregate([
                    { $match: { code: code, isAvailable: true } },
                    { $project: { __v: 0 } }
                ])
            }

            if (allNearByRestaurants.length === 0) {
                allNearByRestaurants = await Restaurant.aggregate([
                    { $match: { isAvailable: true } },
                    { $project: { __v: 0 } }
                ])
            }

            res.status(200).send(allNearByRestaurants)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getRandomByRestaurants: async (req, res) => {
        const code = req.params.code;
        try {
            let randomRestaurant = [];

            if (code) {
                randomRestaurant = await Restaurant.aggregate([
                    { $match: { code: code, isAvailable: true } },
                    { $sample: { size: 2 } },
                    { $project: { __v: 0 } }
                ]);
            }

            if (randomRestaurant.length === 0) {
                randomRestaurant = await Restaurant.aggregate([
                    { $match: { isAvailable: true } },
                    { $sample: { size: 2 } },
                    { $project: { __v: 0 } }
                ]);
            }

            res.status(200).send(randomRestaurant);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteRestaurant: async (req, res) => {
        const id = req.params.id;
        try {
            const restaurant = await Restaurant.findByIdAndDelete(id)
            if (!restaurant) {
                return res.status(404).send()
            }
            res.status(200).send("Restaurant deleted successfully");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllRestaurant: async (req, res) => {
        try {
            const allRestaurants = await Restaurant.find()
            res.status(200).json(allRestaurants)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}