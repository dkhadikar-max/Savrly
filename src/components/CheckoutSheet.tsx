import { useState } from 'react';
import { X, MapPin, CreditCard, Tag, Check } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { restaurants, addresses } from '@/data';
import { useLocale } from '@/hooks/useLocale';

const PLATFORM_FEE_USD = 0.2; // ≈ ₹3 for India via formatPrice

export function CheckoutSheet() {
  const { state, dispatch, navigate } = useApp();
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.id ?? '');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  if (!state.showCheckoutSheet) return null;

  const allRestaurants = [...restaurants, ...(state.discoveredRestaurants ?? [])];
  const cartRestaurant = state.cart.length > 0
    ? allRestaurants.find((r) => r.menuItems.some((m) => m.id === state.cart[0].menuItem.id))
    : null;

  const subtotal = state.cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const deliveryFee = cartRestaurant?.deliveryFee ?? 0;
  const discount = promoApplied ? subtotal * 0.2 : 0;
  const { formatPrice, locale } = useLocale();
  const taxRate = locale.countryCode === 'IN' ? 0.05 : 0.08;
  const tax = (subtotal - discount) * taxRate;
  const total = subtotal + deliveryFee + PLATFORM_FEE_USD + tax - discount;

  const handleClose = () => dispatch({ type: 'TOGGLE_CHECKOUT_SHEET', show: false });

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME50' || promoCode.toUpperCase() === 'SAVE20') {
      setPromoApplied(true);
    }
  };

  const handleStartSimulation = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch({
        type: 'ADD_ORDER',
        order: {
          id: `ORD-${Date.now().toString().slice(-6)}`,
          restaurantName: cartRestaurant?.name ?? 'Unknown Restaurant',
          items: [...state.cart],
          total,
          date: new Date().toISOString().split('T')[0],
          status: 'preparing',
          deliveryTime: cartRestaurant?.deliveryTime,
        },
      });
      dispatch({ type: 'TOGGLE_CHECKOUT_SHEET', show: false });
      dispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'SET_DELIVERY_STEP', step: 0 });
      dispatch({ type: 'SHOW_INTERVENTION', show: false });
      navigate('deliveryTracking');
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-[70] isolate">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[95%] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Checkout</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center active:bg-gray-200"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
          {/* Delivery Address */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
              <MapPin size={16} className="text-gray-500" />
              Delivery Address
            </h3>
            <div className="flex flex-col gap-2">
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-colors ${
                    selectedAddress === addr.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-100'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      selectedAddress === addr.id ? 'border-gray-900' : 'border-gray-300'
                    }`}
                  >
                    {selectedAddress === addr.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{addr.label}</p>
                    <p className="text-xs text-gray-500">{addr.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
              <CreditCard size={16} className="text-gray-500" />
              Payment Method
            </h3>
            <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-900 bg-gray-50">
              <div className="w-8 h-5 bg-gray-800 rounded" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{'••••'} 4242</p>
                <p className="text-xs text-gray-500">Expires 12/27</p>
              </div>
              <Check size={16} className="text-gray-900" />
            </div>
          </div>

          {/* Promo Code */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
              <Tag size={16} className="text-gray-500" />
              Promo Code
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none"
              />
              <button
                onClick={applyPromo}
                disabled={promoApplied || !promoCode}
                className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium disabled:opacity-50 active:scale-95 transition-transform"
              >
                {promoApplied ? 'Applied' : 'Apply'}
              </button>
            </div>
            {promoApplied && (
              <p className="text-xs text-green-600 mt-1">20% discount applied!</p>
            )}
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Delivery Instructions</h3>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Add any special instructions..."
              className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none resize-none h-20"
            />
          </div>

          {/* Bill Details — Swiggy style */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Bill Details</h3>
            <div className="flex flex-col gap-2 bg-gray-50 rounded-xl p-4">
              {state.cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity}× {item.menuItem.name}
                  </span>
                  <span className="text-gray-900">
                    {formatPrice(item.menuItem.price * item.quantity)}
                  </span>
                </div>
              ))}

              <div className="border-t border-gray-200 my-1" />

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Item total</span>
                <span className="text-gray-900">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Discount (20% off)</span>
                  <span className="text-green-600">- {formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery fee</span>
                <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : 'text-gray-900'}>
                  {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Platform fee</span>
                <span className="text-gray-900">{formatPrice(PLATFORM_FEE_USD)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {locale.countryCode === 'IN' ? 'GST & charges' : 'Tax & charges'}
                </span>
                <span className="text-gray-900">{formatPrice(tax)}</span>
              </div>

              <div className="border-t border-gray-200 my-1" />

              <div className="flex justify-between text-base font-bold">
                <span>To Pay</span>
                <span>{formatPrice(total)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-xs font-medium text-green-600 bg-green-50 rounded-lg px-3 py-2 mt-1">
                  <span>Your total savings</span>
                  <span>{formatPrice(discount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* ETA */}
          <div className="flex items-center justify-center gap-2 py-2 text-xs text-gray-500">
            <span>Estimated delivery:</span>
            <span className="font-semibold text-gray-700">
              {cartRestaurant?.deliveryTime ?? '30-40 min'}
            </span>
          </div>
        </div>

        {/* Place Order */}
        <div className="shrink-0 p-4 border-t border-gray-100 bg-white">
          <button
            onClick={handleStartSimulation}
            disabled={loading}
            className="w-full h-14 bg-gray-900 text-white rounded-full flex items-center justify-center gap-2 active:scale-[0.97] transition-transform disabled:opacity-70"
          >
            {loading ? (
              <img src="/images/savrly_logo_spinner.gif" alt="" className="w-6 h-6 object-contain" />
            ) : (
              <>
                <span className="text-sm font-semibold">Place Order</span>
                <span className="text-xs text-white/60">— {formatPrice(total)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
