"use client"

const OrderHistory = () => {
  // Mock data
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "Delivered",
      total: 89.99,
      items: ["Cozy Pink Blanket"],
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "Shipped",
      total: 34.99,
      items: ["Cute Teddy Bear"],
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">Order {order.id}</h3>
                <p className="text-sm text-gray-600">{order.date}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Items: {order.items.join(", ")}</p>
            <p className="font-semibold">${order.total}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderHistory
