import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['bags', 'clothing', 'accessories', 'home-decor', 'toys', 'other', 'blankets']
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  colors: [{
    name: String,
    hex: String,
    available: {
      type: Boolean,
      default: true
    }
  }],
  sizes: [{
    name: String,
    measurements: String,
    available: {
      type: Boolean,
      default: true
    }
  }],
  materials: [String],
  careInstructions: String,
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  tags: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative']
  },
  saleEndDate: Date,
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  estimatedTime: String,
  pattern: {
    included: {
      type: Boolean,
      default: false
    },
    downloadUrl: String
  }
}, {
  timestamps: true
})

// Index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' })
productSchema.index({ category: 1, subcategory: 1 })
productSchema.index({ price: 1 })
productSchema.index({ 'rating.average': -1 })
productSchema.index({ isFeatured: 1 })
productSchema.index({ isActive: 1 })

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.salePrice && this.saleEndDate && this.saleEndDate > new Date()) {
    return this.salePrice
  }
  return this.price
})

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.price < this.originalPrice) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
  }
  return 0
})

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true })

export default mongoose.model('Product', productSchema)
