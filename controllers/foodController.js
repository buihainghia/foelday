const Food = require('../models/Food');

module.exports = {
    addFood: async (req, res) => {
        const { title, foodTags, category, code, restaurant, description, time, price, additives, imageUrl } = req.body;

        if (!title || !foodTags || !category || !code || !restaurant || !description || !time || !price || !additives || !imageUrl) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        try {
            const newFood = new Food(req.body);

            await newFood.save();
            return res.status(201).json(newFood);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    getFoodById: async (req, res) => {
        const foodId = req.params.id;
        try {
            const food = await Food.findById(foodId);
            if (!food) {
                return res.status(404).json({ message: 'Food not found' });
            }
            return res.status(200).json(food);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    getRandomFood: async (req, res) => {
        try {
            let randomFoodList = [];
            if (req.params.code) {
                randomFoodList = await Food.aggregate([
                    { $match: { code: req.params.code, isAvailable: true } },
                    { $sample: { size: 3 } },
                    { $project: { __v: 0 } }
                ]);
            }
            if (!randomFoodList.length) {
                randomFoodList = await Food.aggregate([
                    { $match: { isAvailable: true } },
                    { $sample: { size: 5 } },
                    { $project: { __v: 0 } }
                ]);
            }

            if (randomFoodList.length) {
                return res.status(200).json(randomFoodList);
            } else {
                return res.status(404).json({ message: 'No food found' });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });

        }
    },

    getFoodsByRestaurant: async (req, res) => {
        const id = req.params.id;

        try {
            const foods = await Food.find({ restaurant: id });
            if (foods.length === 0) {
                return res.status(200).json([]);
            }
            return res.status(200).json(foods);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getFoodsByCategoryAndCode: async (req, res) => {
        const { category, code } = req.params;

        try {
            const foods = await Food.aggregate([
                { $match: { category: category, code: code, isAvailable: true } },
                { $project: { __v: 0 } }
            ]);
            if (foods.length === 0) {
                return res.status(200).json([]);
            }
            return res.status(200).json(foods);
        } catch (error) {
            return res.status(500).json({ message: error.message });

        }
    },

    searchFoods: async (req, res) => {
        const search = req.params.search;

        try {
            const results = await Food.aggregate([
                {
                    $search: {
                        index: 'foods',
                        text: {
                            query: search,
                            path: {
                                wildcard: '*'
                            }
                        }
                    }
                }
            ]);

            return res.status(200).json(results);
        } catch (error) {

            return res.status(500).json({ message: error.message });
        }
    },

    getRandomFoodsByCategoryAndCode: async (req, res) => {
        const { category, code } = req.params;

        try {
            let foods;
            foods = await Food.aggregate([
                { $match: { category: category, code: code, isAvailable: true } },
                { $sample: { size: 3 } }
            ]);
            if (!foods || foods.length === 0) {
                foods = await Food.aggregate([
                    { $match: { code: code, isAvailable: true } },
                    { $sample: { size: 3 } }
                ])
            } else if (!foods || foods.length === 0) {
                foods = await Food.aggregate([
                    { $match: { isAvailable: true } },
                    { $sample: { size: 3 } }
                ])
            }
            return res.status(200).json(foods);
        } catch (error) {
            return res.status(500).json({ message: error.message });

        }
    },
    getAllFoodsByCode: async (req, res) => {
        const code = req.params.code;

        try {
            const foods = await Food.find({ code: code });
            if (foods.length === 0) {
                return res.status(200).json([]);
            }
            return res.status(200).json(foods);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}
