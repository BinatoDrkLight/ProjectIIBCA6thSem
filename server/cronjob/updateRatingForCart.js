import Product from "../models/Product.js";
import User from "../models/User.js";
import glickoTwo from "../utils/glickotwo.js";

export const updateRatingForCart = () => {
    setInterval(async () => {
        try {
            const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);

            // Fetch all users
            const users = await User.find();

            for (const user of users) {
                const cartEntries = Object.entries(user.cartItems);

                // Filter items older than threshold
                const oldItems = cartEntries.filter(
                    ([, item]) => new Date(item.date) <= fiveHoursAgo
                );

                for (const [key, item] of oldItems) {
                    const product = await Product.findById(key);

                    // Skip if product doesn't exist OR already updated
                    if (!product || product.addToCartFlag?.[user._id] === true) continue;

                    // Update rating using glickoTwo
                    await glickoTwo({
                        winnerId: key,
                        loserIds: item.opponents || [],
                        weightForWin: 0.6,
                        weightForLoss: 0.12,
                        userId: user._id
                    });
                }
            }
        } catch (err) {
            console.error("Update Rating for cart item failed", err);
        }
    }, 5 * 60 * 60 * 1000);
};