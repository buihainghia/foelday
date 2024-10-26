const Cart = require('../models/Cart');

module.exports = {
    addProductToCart: async (req, res) => {
        const userId = req.user.id;
        const { productId, quantity, totalPrice, additives } = req.body;
        let count;
        try {
            const existingProduct = await Cart.findOne({ userId: userId, productId: productId });
            count = await Cart.countDocuments({ userId: userId });

            if (existingProduct) {
                existingProduct.totalPrice += totalPrice * quantity;
                existingProduct.quantity += quantity;

                await existingProduct.save();
                return res.status(200).json({ message: 'Product added to cart successfully', count });
            } else {
                const newCartItem = new Cart({
                    userId,
                    productId,
                    totalPrice,
                    quantity,
                    additives
                });

                await newCartItem.save();
                count = await Cart.countDocuments({ userId: userId });

                return res.status(200).json({ message: 'Product added to cart successfully', count });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    removeCartItem: async (req, res) => {
        const cartItemId = req.params.id;
        const userId = req.user.id;

        try {
            await Cart.findByIdAndDelete({ _id: cartItemId });
            const count = await Cart.countDocuments({ userId });

            return res.status(200).json({ message: 'Item removed from cart', count });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    getCart: async (req, res) => {
        const userId = req.user.id;

        try {
            const cartItems = await Cart.find({ userId }).populate({
                path: 'productId',
                select: 'imageUrl title restaurant rating ratingCount'
            });
            return res.status(200).json({ cartItems });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    getCartCount: async (req, res) => {
        const userId = req.user.id;

        try {
            const count = await Cart.countDocuments({ userId });
            return res.status(200).json({ count });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    decrementProductQuantity: async (req, res) => {
        const userId = req.user.id;
        const id = req.params.id;

        try {
            const cartItem = await Cart.findById(id);

            if (cartItem) {
                const productPrice = cartItem.totalPrice / cartItem.quantity;

                if (cartItem.quantity > 1) {
                    cartItem.quantity -= 1;
                    cartItem.totalPrice -= productPrice;
                    await cartItem.save();
                    return res.status(200).json({ message: 'Product quantity decremented successfully' });
                } else {
                    await Cart.findByIdAndDelete({ _id: id });

                    return res.status(200).json({ message: 'Product removed from cart', count });
                }
            } else {
                return res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
