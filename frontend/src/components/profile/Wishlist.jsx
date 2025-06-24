"use client"

const Wishlist = () => {
  const wishlist = [
    {
      id: 1,
      name: "Rainbow Baby Blanket",
      price: 65.99,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Vintage Doily Set",
      price: 28.99,
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="font-semibold mb-2">{item.name}</h3>
            <p className="text-pink-600 font-bold">${item.price}</p>
            <button className="w-full mt-3 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
