const Order = require('../models/Order');

module.exports = {
    placeOrder: async (req, res, next) => {
        const newOrder = new Order({
            ...req.body,
            userId: req.user.id,
        });

        try {
            await newOrder.save();

            const orderId = newOrder._id;
            res.status(201).json({ orderId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getUserOrders: async (req, res, next) => {
        const userId = req.user.id;
        const { paymentStatus, orderStatus } = req.query;

        let query = { userId };

        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        if (orderStatus === orderStatus) {
            query.orderStatus = orderStatus;
        }

        try {
            const orders = await Order.find(query).populate({
                pathL: 'orderItems.foodId',
                select: 'imageUrl title rating time'
            })

            res.status(200).json({ orders });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}