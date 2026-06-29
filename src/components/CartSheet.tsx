import { X, Minus, Plus, ChevronRight } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { restaurants } from '@/data';
import { useLocale } from '@/hooks/useLocale';

export function CartSheet() {
  const { state, dispatch, navigate } = useApp();

  if (!state.showCartSheet) return null;

  const cartRestaurant = state.cart.length > 0
    ? restaurants.find((r) => r.menuItems.some((m) => m.id === state.cart[0].menuItem.id))
    : null;

  const subtotal = state.cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const deliveryFee = cartRestaurant?.deliveryFee ?? 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;
  const { formatPrice } = useLocale();

  const handleClose = () => dispatch({ type: 'TOGGLE_CART_SHEET', show: false });

  const handleCheckout = () => {
    dispatch({ type: 'TOGGLE_CART_SHEET', show: false });
    dispatch({ type: 'TOGGLE_CHECKOUT_SHEET', show: true });
  };

  return (
    <div className="absolute inset-0 z-[60] isolate">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90%] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Your Order</h2>
            {cartRestaurant && (
              <p className="text-xs text-gray-500">{cartRestaurant.name}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center active:bg-gray-200"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {state.cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-gray-400">Your cart is empty</p>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-2">
              {state.cart.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 py-3 border-b border-gray-50">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">{item.menuItem.name}</h3>
                    {item.selectedOptions.length > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.selectedOptions
                          .map((o) => {
                            const opt = item.menuItem.options?.find((x) => x.id === o.optionId);
                            const choice = opt?.choices.find((c) => c.id === o.choiceId);
                            return choice?.name;
                          })
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {formatPrice(item.menuItem.price * item.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => dispatch({ type: 'UPDATE_CART_QUANTITY', index: idx, delta: -1 })}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center active:bg-gray-100"
                    >
                      <Minus size={14} className="text-gray-600" />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => dispatch({ type: 'UPDATE_CART_QUANTITY', index: idx, delta: 1 })}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center active:bg-gray-100"
                    >
                      <Plus size={14} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add more items */}
              {cartRestaurant && (
                <button
                  onClick={() => {
                    handleClose();
                    navigate('restaurantDetail', { restaurantId: cartRestaurant.id });
                  }}
                  className="flex items-center gap-2 py-3 text-sm font-medium text-gray-600 active:text-gray-900"
                >
                  <Plus size={16} />
                  Add more items
                </button>
              )}

              {/* Bill Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery fee</span>
                    <span className="text-gray-900">
                      {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Taxes (8%)</span>
                    <span className="text-gray-900">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="shrink-0 p-4 border-t border-gray-100 bg-white">
              <button
                onClick={handleCheckout}
                className="w-full h-14 bg-gray-900 text-white rounded-full flex items-center justify-between px-6 active:scale-[0.97] transition-transform"
              >
                <span className="text-sm font-semibold">Checkout</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">{formatPrice(total)}</span>
                  <ChevronRight size={16} />
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
