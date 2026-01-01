import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe"
import User from "../models/User.js"
import crypto from "crypto"
import { v4 as uuidv4 } from 'uuid';

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if(!address || items.length === 0){
            return res.json({ success: false, message: "Invalid Data" })
        }

        //Calculate Amount Using Items
        let amount = await items.reduce(async(acc, item)=>{
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        return res.json({ success: true, message: "Order Placed Successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


// Place Order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const {origin} = req.headers;

        if(!address || items.length === 0){
            return res.json({ success: false, message: "Invalid Data" })
        }

        let productData = [];

        //Calculate Amount Using Items
        let amount = await items.reduce(async(acc, item)=>{
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online - Stripe",
        });

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // Create Line items for Stripe
        const line_items = productData.map((item)=>{
            return {
                price_data: {
                    currency: "aud",
                    product_data:{
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                },
                quantity: item.quantity,
            }
        })

        // create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })

        return res.json({ success: true, url: session.url });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Stripe Webhooks to Verify Payments Action : /stripe
export const stripeWebhooks = async (request, response)=>{
    // Stripe Gateway Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        response.status(400).send(`Webhook Error: ${error.message}`)
    }
    // Handle The Event
    switch (event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId, userId } = session.data[0].metadata;
            // Mark Payment as Paid
            await Order.findByIdAndUpdate(orderId, {isPaid: true,  paymentStatus: "Completed"})
            //Clear user cart
            await User.findByIdAndUpdate(userId, {cartItems: {}});
            break;
        }
            
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId } = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            break;
        }

        default:
            console.error(`Unhandled event type ${event.type}`)
            break;
    }
    response.json({received: true})
}

// Place Order Esewa ----------------------------------------------------------------------------------------------
// Create signature
const generateHmacSHA256 = (message, secret) => {
  return crypto.createHmac("sha256", secret).update(message).digest("base64");
};

// Verify Esewa Signature
const verifyEsewaSignature = (jsonData) => {
  try {
    // Read field order exactly as eSewa signed it
    const signedFieldNames = jsonData.signed_field_names?.split(",") || [];

    // Reconstruct the same message string eSewa signed
    const message = signedFieldNames
      .map((field) => `${field}=${jsonData[field]}`)
      .join(",");

    const expectedSignature = generateHmacSHA256(message, process.env.ESEWA_SECRET_KEY);

    return {
      ok: expectedSignature === jsonData.signature,
      message,
      expectedSignature,
    };
  } catch (err) {
    console.error("Signature verification error:", err);
    return { ok: false, message: "", expectedSignature: "" };
  }
};


// Success Response Esewa : /api/order/esewa/success
export const successResEsewa = async (req, res) => {
  try {
    let { orderId, data } = req.query;

    // Handle ?data= duplication
    if (orderId && orderId.includes("?data=")) {
      const [idPart, dataPart] = orderId.split("?data=");
      orderId = idPart;
      data = dataPart;
    }

    if (!data) {
      console.error("Missing data from eSewa success response");
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/my-orders?success=false`);
    }

    // Decode and parse JSON
    const decoded = Buffer.from(data, "base64").toString("utf-8");
    const jsonData = JSON.parse(decoded);

    // Verify signature dynamically
    const { ok } = verifyEsewaSignature(jsonData);
    if (!ok) {
      console.error("Signature mismatch!");
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/my-orders?success=false`);
    }

   // Check payment status
    const successStatuses = ["SUCCESS", "COMPLETE"];
    if (!successStatuses.includes(jsonData.status)) {
        console.error("Payment not successful:", jsonData.status);
        return res.redirect(`${process.env.FRONTEND_BASE_URL}/my-orders?success=false`);
    }

    // Update DB
    const { transaction_uuid, transaction_code, total_amount } = jsonData;
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        isPaid: true,
        transaction_uuid,
        transaction_code,
        amount_paid: total_amount,
        paymentStatus: "Completed",
      },
      { new: true }
    );

    if (order?.userId) {
      await User.findByIdAndUpdate(order.userId, { cartItems: {} });
    }

    return res.redirect(`${process.env.FRONTEND_BASE_URL}/loader?next=my-orders&success=true`);
  } catch (error) {
    console.error("Error in eSewa success route:", error);
    return res.redirect(`${process.env.FRONTEND_BASE_URL}/my-orders?success=false`);
  }
};

// Failure Response Esewa : /api/order/esewa/failure
export const failureResEsewa = async (req, res) => {
  try {
    let { orderId, data } = req.query;

    // Handle ?data= duplication
    if (orderId && orderId.includes("?data=")) {
      const [idPart, dataPart] = orderId.split("?data=");
      orderId = idPart;
      data = dataPart;
    }

    if (!data) {
      console.error("Missing data from eSewa failure response");
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/my-orders?success=false`);
    }

    // Decode base64 data from eSewa
    const decoded = Buffer.from(data, "base64").toString("utf-8");
    const jsonData = JSON.parse(decoded);

    // Verify signature dynamically
    const { ok, message, expectedSignature } = verifyEsewaSignature(jsonData);
    if (!ok) {
      console.error("Signature mismatch on failure response!");
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/my-orders?success=false`);
    }

    // Extract fields
    const { transaction_uuid, total_amount, status } = jsonData;

    // Update database: mark as Failed or Pending
    const order = await Order.findById(orderId);
    if (order) {
      await Order.findByIdAndUpdate(orderId, {
        status:
          status === "FAILED" || status === "CANCELLED"
            ? "Failed"
            : "Pending",
        transaction_uuid,
        amount_paid: total_amount || 0,
        isPaid: false,
      });
    }

    return res.redirect(`${process.env.FRONTEND_BASE_URL}/my-orders?success=false`);
  } catch (error) {
    console.error("Error in eSewa failure route:", error);
    return res.redirect(`${process.env.FRONTEND_BASE_URL}/my-orders?success=false`);
  }
};


// Place Order Esewa : /api/order/esewa
export const placeOrderEsewa = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if(!address || items.length === 0){
            return res.json({ success: false, message: "Invalid Data" })
        }

        let amount = 0;
        let productData = [];

        for (const item of items) {
        const product = await Product.findById(item.product);
        productData.push({
            name: product.name,
            price: product.offerPrice,
            quantity: item.quantity,
        });
        amount += product.offerPrice * item.quantity;
        }

        // Add Tax Charge (2%)
        let taxRate = 0.02;
        let taxAmount = parseFloat((amount * taxRate).toFixed(2));
        let totalAmount = parseFloat((amount + taxAmount).toFixed(2));
        let transactionUuid = uuidv4();

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online - eSewa",
        });

        const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;

        // Generate the signature using the function
        const signature = generateHmacSHA256(message, process.env.ESEWA_SECRET_KEY);

        return res.json({
            success: true,
            paymentData: {
                amount,
                tax_amount: taxAmount,
                total_amount: totalAmount,
                transaction_uuid: transactionUuid,
                product_code: process.env.ESEWA_PRODUCT_CODE,
                product_service_charge: "0",
                product_delivery_charge: "0",
                success_url: `${process.env.BACKEND_BASE_URL}/api/order/esewa/success?orderId=${order._id}`,
                failure_url: `${process.env.BACKEND_BASE_URL}/api/order/esewa/failure?orderId=${order._id}`,
                signed_field_names: "total_amount,transaction_uuid,product_code",
                signature,
                payment_url: process.env.ESEWA_PAYMENT_URL,
            }
        })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


// Get Order by User ID : /api/order/user -------------------------------------------------------------------------------------
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find({
            userId,
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, orders })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Get All Orders (for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, orders });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Update order/package status : /api/order/update-orderstatus
export const updateOrderStatus = async (req, res) => { 
  try{
    const { orderId, orderStatus } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus }, {new: true})
    if(!updatedOrder){
      return res.json.status(404)({ success: false, message: "no order found" });
    } else {
       return res.json({ success: true, message: "success" });
    }
  } catch (error){
    return res.json({ success: false, message: error.message });
  }
}