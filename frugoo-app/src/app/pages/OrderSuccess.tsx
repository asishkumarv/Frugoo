import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";
import { useCart } from "../context/CartContext";

export function OrderSuccess() {
  const { clearCart } = useCart();
  const [orderNumber] = useState(() => {
    // Generate order number only once when component mounts
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  });
  const [estimatedDelivery] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  });

  const location = useLocation();
  const orderId = location.state?.orderId || orderNumber;
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    clearCart();
    if (location.state?.orderId) {
      fetch(`http://localhost:3001/api/orders/${location.state.orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrderData(data.order);
          }
        })
        .catch(console.error);
    }
  }, [location.state?.orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-green-900 mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-gray-700">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="p-8 mb-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">Order Number</p>
              <p className="text-2xl font-bold text-green-700">#{orderId}</p>
            </div>
            
            {orderData && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Order Details</h3>
                <div className="space-y-2 mb-4">
                  {(orderData.items || []).map((item: string, i: number) => (
                    <div key={i} className="flex justify-between text-gray-700">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                  <span>Total Paid</span>
                  <span>₹{orderData.total}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Shipping To:</p>
                  <p className="text-sm text-gray-600">{orderData.customer}</p>
                  <p className="text-sm text-gray-600">{orderData.address}</p>
                </div>
              </div>
            )}

            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Estimated Delivery</h3>
                  <p className="text-gray-600">
                    {estimatedDelivery.toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to your registered email address with order details and tracking information.
              </p>
            </div>

            {/* Order Timeline */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg mb-4">What's Next?</h3>
              
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="w-0.5 h-12 bg-green-600"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h4 className="font-semibold">Order Confirmed</h4>
                  <p className="text-sm text-gray-600">Your order has been received and confirmed</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-100 border-2 border-green-600 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="w-0.5 h-12 bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h4 className="font-semibold">Processing</h4>
                  <p className="text-sm text-gray-600">We're preparing your fresh fruits</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gray-100 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-400">Out for Delivery</h4>
                  <p className="text-sm text-gray-400">Your order will be on its way soon</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-3">
                If you have any questions about your order, please contact our customer service team.
              </p>
              <Link to="/contact">
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </Link>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full h-12">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
            <Link to="/shop" className="flex-1">
              <Button className="w-full h-12 bg-green-600 hover:bg-green-700">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p className="mb-2">🎉 You've earned 50 reward points with this order!</p>
            <p>Track your order status anytime by visiting your account dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
