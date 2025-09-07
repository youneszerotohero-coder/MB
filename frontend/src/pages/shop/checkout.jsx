import { useState, useEffect } from "react"
import { Loader2, CheckCircle, AlertCircle, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import statesData from "../../utils/statesData"

// --- MOCK DATA ---
const staticCartItems = [
  {
    productId: 'prod_12345',
    quantity: 1,
    product: {
      name: "Omega Watch",
      price: 5500.00,
      imageUrl: "/placeholder-watch.jpg", 
    },
  },
];

export default function Checkout() {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [state, setState] = useState("")
  const [commune, setCommune] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [availableCommunes, setAvailableCommunes] = useState([])
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  const items = staticCartItems
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const shipping = subtotal > 0 ? 600 : 0 // example shipping
  const total = subtotal + shipping

  useEffect(() => {
    if (state) {
      const selectedState = statesData[state]
      if (selectedState && selectedState.baladiyas) {
        setAvailableCommunes(selectedState.baladiyas)
        setCommune("")
      } else {
        setAvailableCommunes([])
      }
    } else {
      setAvailableCommunes([])
    }
  }, [state])

  useEffect(() => {
    let timeoutId;
    if (notification.show) {
      timeoutId = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [notification.show]);

  const handleCheckout = async () => {
    if (!fullName || !phone) {
      setNotification({
        show: true,
        message: "Please fill out all required fields",
        type: "error"
      });
      return;
    }

    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setNotification({
        show: true,
        message: `Order #ABC-123 has been created successfully!`,
        type: "success"
      });
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${
          notification.type === 'success' 
            ? 'bg-[#F3EFE7] border border-[#C2A977]' 
            : 'bg-red-100 border border-red-200'
        } max-w-md`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2 text-[#C2A977]" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            )}
            <span className={notification.type === 'success' ? 'text-[#8A764C]' : 'text-red-800'}>
              {notification.message}
            </span>
          </div>
        </div>
      )}

      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-[#8A764C]">Checkout</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-sm text-gray-600 mb-1 block">
                  Full name *
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border border-gray-200 rounded-md h-10 focus:border-[#C2A977] focus:ring-0"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm text-gray-600 mb-1 block">
                  Phone number *
                </Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-gray-200 rounded-md h-10 focus:border-[#C2A977] focus:ring-0"
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-sm text-gray-600 mb-1 block">
                  Wilaya
                </Label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full border border-gray-200 rounded-md h-10 px-3 focus:border-[#C2A977] focus:ring-0"
                >
                  <option value="">Select Wilaya</option>
                  {Object.keys(statesData).map((code) => (
                    <option key={code} value={code}>
                      {statesData[code].wilaya_fr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="commune" className="text-sm text-gray-600 mb-1 block">
                  Commune
                </Label>
                <select
                  id="commune"
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className="w-full border border-gray-200 rounded-md h-10 px-3 focus:border-[#C2A977] focus:ring-0"
                  disabled={!state}
                >
                  <option value="">Select Commune</option>
                  {availableCommunes.map((baladia) => (
                    <option key={baladia} value={baladia}>
                      {baladia}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">* Required fields</p>
          </div>

          {/* Right Column */}
          <div className="bg-[#F9F7F2] p-6 rounded-lg border border-[#E8E2D3]">
            <h2 className="text-lg font-medium mb-4 text-[#8A764C]">Review your order</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium mt-1 text-[#8A764C]">
                      {item.product.price} DA
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4 bg-[#E8E2D3]" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{subtotal} DA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping} DA</span>
              </div>
            </div>

            <Separator className="my-4 bg-[#E8E2D3]" />

            <div className="flex justify-between font-medium mb-6 text-[#8A764C]">
              <span>Total</span>
              <span>{total} DA</span>
            </div>

            <Button
              className="w-full bg-[#C2A977] hover:bg-[#b39966] text-black font-medium h-12"
              onClick={handleCheckout}
              disabled={isProcessing || items.length === 0}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Order"
              )}
            </Button>

            <div className="flex items-center gap-2 mt-4 justify-center">
              <Check className="h-4 w-4 text-[#C2A977]" />
              <span className="text-xs text-gray-500">Secure Checkout • SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
