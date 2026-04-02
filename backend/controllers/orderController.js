const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

const formatMoney = (amount) => `₱${Number(amount || 0).toFixed(2)}`;

// Create new order
const addOrderItems = async (req, res) => {
  try {
    const {
      user,
      customerName,
      customerEmail,
      customerPhone,
      orderType,
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      const order = new Order({
        user,
        customer: {
          name: customerName || '',
          email: customerEmail || '',
          phone: customerPhone || '',
        },
        orderType: orderType || '',
        items: orderItems,
        shippingAddress,
        paymentMethod,
        paymentDetails,
        totalPrice,
      });

      const createdOrder = await order.save();
      if (customerEmail) {
        const itemsText = Array.isArray(orderItems)
          ? orderItems.map((x) => `${x.quantity}x ${x.name} (${formatMoney(x.price)})`).join('\n')
          : '';
        const orderIdShort = String(createdOrder._id).slice(-6).toUpperCase();
        const subject = `ChillBites Order Confirmation #${orderIdShort}`;
        const lines = [
          `Thank you for your order, ${customerName || ''}`.trim(),
          '',
          `Order ID: ${orderIdShort}`,
          `Order Type: ${orderType || ''}`.trim(),
          `Payment Method: ${paymentMethod}`,
          '',
          'Items:',
          itemsText,
          '',
          `Total: ${formatMoney(totalPrice)}`,
          '',
          'If you need help, reply to this email.',
        ].filter(Boolean);
        sendEmail({
          to: customerEmail,
          subject,
          text: lines.join('\n'),
        }).catch(() => {});
      }
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'username email');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged in user orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id username');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
};
