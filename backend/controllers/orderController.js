import { validationResult } from "express-validator"
import Order from "../models/Order.js"
import Product from "../models/Product.js"

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Order.countDocuments({ user: req.user.id })

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get user orders error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.status) {
      filter.status = req.query.status
    }
    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus
    }

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Order.countDocuments(filter)

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get all orders error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name images price")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json({ order })
  } catch (error) {
    console.error("Get order error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Create order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { items, shippingAddress, billingAddress, paymentMethod, paymentDetails, user } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" })
    }

    // Validate and calculate order totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product)

      if (!product) {
        return res.status(404).json({ 
          message: `Product ${item.product} not found`,
          productId: item.product
        })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
          available: product.stock,
          requested: item.quantity
        })
      }

      const itemTotal = product.discountedPrice * item.quantity
      subtotal += itemTotal

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.discountedPrice,
        color: item.color,
        size: item.size,
      })

      // Update product stock
      product.stock -= item.quantity
      await product.save()
    }

    // Calculate tax and shipping
    const tax = subtotal * 0.08
    const shippingCost = subtotal > 50 ? 0 : 9.99
    const total = subtotal + tax + shippingCost

    const order = new Order({
      user: user || req.user.id, // Use either provided user or authenticated user
      items: orderItems,
      subtotal,
      tax,
      shipping: {
        cost: shippingCost,
        method: req.body.shippingMethod || "standard",
      },
      total,
      paymentMethod,
      paymentDetails,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
    })

    await order.save()

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name images price")

    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
      orderNumber: order.orderNumber,
    })
  } catch (error) {
    console.error("Create order error:", error)
    res.status(500).json({ 
      message: "Order creation failed",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, tracking } = req.body

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    order.status = status

    if (tracking) {
      order.tracking = tracking
    }

    if (status === "delivered") {
      order.actualDeliveryDate = new Date()
    }

    await order.save()

    res.json({
      message: "Order status updated successfully",
      order,
    })
  } catch (error) {
    console.error("Update order status error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
