import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { useNavigate, Link } from "react-router";
import { ArrowLeft, CreditCard, Truck, Tag } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function Checkout() {
  const { cartItems, getSubtotal, getTax, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const subtotal = getSubtotal();
  const tax = getTax();
  
  // Calculate discount
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const total = subtotal + tax - discount;

  const handleApplyCoupon = async () => {
    const code = couponCode.toUpperCase().trim();
    if (!code) return;
    try {
      const res = await fetch(`https://frugoo.onrender.com/api/coupons/validate/${code}`);
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({ code, discount: data.discount });
        toast.success(`Coupon applied! You saved ${data.discount}%`);
      } else {
        toast.error(data.error || "Invalid coupon code");
      }
    } catch (err) {
      toast.error("Error validating coupon");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const customerName = `${formData.get('firstName')} ${formData.get('lastName')}`;
      const email = formData.get('email') as string;
      const phone = formData.get('phone') as string;
      
      const orderPayload = {
        customer: customerName,
        items: cartItems.map(item => `${item.quantity}x ${item.name}`),
        total,
        address: `${formData.get('address')}, ${formData.get('city')}, ${formData.get('state')} - ${formData.get('zip')}`,
        phone: phone,
        payment: paymentMethod === 'online' ? 'Online' : 'Cash on Delivery',
        couponCode: appliedCoupon ? appliedCoupon.code : undefined
      };

      if (paymentMethod === "online") {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          toast.error("Razorpay SDK failed to load. Are you connected to the internet?");
          setIsProcessing(false);
          return;
        }

        // Get the public key
        const keyRes = await fetch('https://frugoo.onrender.com/api/payment/razorpay/key');
        const keyData = await keyRes.json();
        
        if (!keyData.key) {
          toast.error("Razorpay is not configured on the server.");
          setIsProcessing(false);
          return;
        }

        // Create Order on Backend
        const orderRes = await fetch('https://frugoo.onrender.com/api/payment/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total, currency: "INR" })
        });
        const orderDataResult = await orderRes.json();

        if (!orderDataResult.success) {
          toast.error(orderDataResult.error || "Failed to initiate payment");
          setIsProcessing(false);
          return;
        }

        const options = {
          key: keyData.key,
          amount: orderDataResult.order.amount,
          currency: orderDataResult.order.currency,
          name: "Frugoo",
          description: "Fresh Fruits Delivery",
          order_id: orderDataResult.order.id,
          handler: async function (response: any) {
            // Verify payment
            try {
              const verifyRes = await fetch('https://frugoo.onrender.com/api/payment/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  orderData: orderPayload
                })
              });
              const verifyData = await verifyRes.json();

              if (verifyData.success) {
                toast.success("Payment successful!");
                clearCart();
                navigate('/order-success', { state: { orderId: verifyData.order.id } });
              } else {
                toast.error(verifyData.error || "Payment verification failed");
              }
            } catch (err) {
              toast.error("Error verifying payment");
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: customerName,
            email: email,
            contact: phone
          },
          theme: {
            color: "#16a34a"
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
              toast.info("Payment cancelled");
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          toast.error(response.error.description || "Payment failed");
          setIsProcessing(false);
        });
        rzp.open();
        
      } else {
        // COD Logic
        const res = await fetch('https://frugoo.onrender.com/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
        const data = await res.json();

        if (data.success) {
          toast.success("Order placed successfully!");
          clearCart();
          navigate('/order-success', { state: { orderId: data.order.id } });
        } else {
          toast.error(data.error || "Failed to place order");
        }
        setIsProcessing(false);
      }
    } catch (err) {
      toast.error("An error occurred");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate]);

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/cart" className="inline-flex items-center text-sm text-gray-600 hover:text-green-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Truck className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-bold">Shipping Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" name="firstName" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" name="lastName" required className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" required className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" type="tel" required className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input id="address" name="address" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province *</Label>
                    <Input id="state" name="state" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="zip">PIN Code *</Label>
                    <Input id="zip" name="zip" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input id="country" name="country" defaultValue="India" required className="mt-1" />
                  </div>
                </div>
              </Card>

              {/* Payment Information */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-bold">Payment Method</h2>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-6">
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer font-medium">
                      Online Payment (UPI, Credit/Debit Card)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer font-medium">
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "online" && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-center gap-3">
                    <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" className="h-6" />
                    <p className="text-sm text-green-800">
                      You will be redirected to Razorpay's secure checkout to complete your payment using UPI, Credit/Debit Card, or Netbanking.
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-green-700">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Coupon Code Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-gray-600" />
                    <h3 className="font-semibold">Have a coupon?</h3>
                  </div>
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <Button
                        type="button"
                        onClick={handleApplyCoupon}
                        variant="outline"
                        className="whitespace-nowrap"
                      >
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">{appliedCoupon.code}</span>
                        <span className="text-sm text-green-600">({appliedCoupon.discount}% off)</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Try: FRUGOO10, FRESH20, WELCOME15, or SAVE25
                  </p>
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount ({appliedCoupon.discount}%)</span>
                      <span className="font-medium text-green-600">-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-700">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 h-12"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our terms and conditions
                </p>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}