import { useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, Package, Truck, CheckCircle2, Clock } from "lucide-react";

export function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsTracking(true);
    setTrackingResult(null);

    try {
      const res = await fetch(`https://frugoo.onrender.com/api/orders/${orderId.trim()}`);
      const data = await res.json();

      if (data.success && data.order) {
        const orderDate = new Date(data.order.date);
        const estDelivery = new Date(orderDate);
        estDelivery.setDate(estDelivery.getDate() + 2);

        setTrackingResult({
          orderId: data.order.id,
          status: data.order.status,
          estimatedDelivery: estDelivery.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
          currentLocation: data.order.status === 'Delivered' ? "Delivered to " + data.order.customer : "Frugoo Distribution Center",
          timeline: [
            { status: "Order Placed", date: orderDate.toLocaleString('en-IN'), completed: true },
            { status: "Processing", date: "Preparing your fresh fruits", completed: data.order.status !== 'Pending' },
            { status: "Out for Delivery", date: "On the way", completed: data.order.status === 'Shipped' || data.order.status === 'Delivered' },
            { status: "Delivered", date: "Successfully Delivered", completed: data.order.status === 'Delivered' }
          ]
        });
      } else {
        alert("Order not found. Please check the order ID.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to track order");
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-green-50 to-lime-50 py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-green-900 mb-4">Track Your Order</h1>
          <p className="text-lg text-gray-700">Enter your order ID to track your delivery</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <form onSubmit={handleTrack} className="space-y-6">
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium mb-2">
                  Order ID
                </label>
                <div className="flex gap-3">
                  <Input
                    id="orderId"
                    type="text"
                    placeholder="Enter your order ID (e.g., FRG123456)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isTracking || !orderId.trim()}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {isTracking ? "Tracking..." : "Track"}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Your order ID can be found in your order confirmation email
                </p>
              </div>
            </form>
          </Card>

          {trackingResult && (
            <div className="mt-8 space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Order #{trackingResult.orderId}</h2>
                    <p className="text-gray-600">Current Status: <span className="text-green-600 font-semibold">{trackingResult.status}</span></p>
                  </div>
                  <Truck className="h-12 w-12 text-green-600" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
                    <Clock className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-semibold">{trackingResult.estimatedDelivery}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Current Location</p>
                      <p className="font-semibold">{trackingResult.currentLocation}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Order Timeline</h3>
                <div className="space-y-4">
                  {trackingResult.timeline.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.completed ? 'bg-green-600' : 'bg-gray-300'
                        }`}>
                          {item.completed ? (
                            <CheckCircle2 className="h-6 w-6 text-white" />
                          ) : (
                            <Clock className="h-6 w-6 text-white" />
                          )}
                        </div>
                        {index < trackingResult.timeline.length - 1 && (
                          <div className={`w-1 h-16 ${item.completed ? 'bg-green-600' : 'bg-gray-300'}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <h4 className={`font-semibold mb-1 ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {item.status}
                        </h4>
                        <p className="text-sm text-gray-600">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
