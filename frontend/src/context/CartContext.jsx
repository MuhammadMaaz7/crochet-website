"use client"

import { createContext, useContext, useReducer, useEffect } from "react"

const CartContext = createContext()

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_CART":
      return {
        ...state,
        items: action.payload,
        loading: false,
      }

    case "ADD_TO_CART":
      const existingItem = state.items.find(
        (item) =>
          item.product._id === action.payload.product._id &&
          item.color === action.payload.color &&
          item.size === action.payload.size,
      )

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product._id === action.payload.product._id &&
            item.color === action.payload.color &&
            item.size === action.payload.size
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        }
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, id: Date.now() }],
        }
      }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
        ),
      }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      }

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }

    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    loading: true,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: cartItems })
      } catch (error) {
        console.error("Error loading cart:", error)
        dispatch({ type: "LOAD_CART", payload: [] })
      }
    } else {
      dispatch({ type: "LOAD_CART", payload: [] })
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem("cart", JSON.stringify(state.items))
    }
  }, [state.items, state.loading])

  const addToCart = (product, quantity = 1, color = "", size = "") => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product,
        quantity,
        color,
        size,
        price: product.discountedPrice || product.price,
      },
    })
  }

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity },
      })
    }
  }

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    items: state.items,
    loading: state.loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
