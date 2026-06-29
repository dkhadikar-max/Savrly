import { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { restaurants } from '@/data';
import { useLocale } from '@/hooks/useLocale';

export function ProductSheet() {
  const { state, dispatch } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});

  if (!state.showProductSheet || !state.selectedRestaurantId || !state.selectedMenuItemId) {
    return null;
  }

  const restaurant = restaurants.find((r) => r.id === state.selectedRestaurantId);
  const item = restaurant?.menuItems.find((m) => m.id === state.selectedMenuItemId);

  if (!item) return null;

  const { formatPrice } = useLocale();

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_PRODUCT_SHEET', show: false });
    setQuantity(1);
    setSelectedChoices({});
  };

  const handleAdd = () => {
    const options = Object.entries(selectedChoices).map(([optionId, choiceId]) => ({
      optionId,
      choiceId,
    }));
    dispatch({
      type: 'ADD_TO_CART',
      item: {
        menuItem: item,
        quantity,
        selectedOptions: options,
      },
    });
    handleClose();
  };

  const extraPrice = item.options
    ? item.options.reduce((sum, opt) => {
        const choice = opt.choices.find((c) => c.id === selectedChoices[opt.id]);
        return sum + (choice?.price ?? opt.choices[0].price);
      }, 0)
    : 0;

  const totalPrice = (item.price + extraPrice) * quantity;

  return (
    <div className="absolute inset-0 z-[60] isolate">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85%] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center active:bg-gray-200"
        >
          <X size={16} className="text-gray-600" />
        </button>

        {/* Image */}
        <div className="px-4 pb-3">
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-100">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4">
          <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
          <p className="text-lg font-bold text-gray-900 mt-2">{formatPrice(item.price)}</p>

          {/* Customization Options */}
          {item.options?.map((option) => (
            <div key={option.id} className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">
                {option.name}
                <span className="text-xs font-normal text-gray-400 ml-1">(Required)</span>
              </h3>
              <div className="flex flex-col gap-1 mt-2">
                {option.choices.map((choice) => (
                  <button
                    key={choice.id}
                    className="flex items-center gap-3 py-2.5 px-1 text-left active:bg-gray-50 rounded-lg"
                    onClick={() =>
                      setSelectedChoices((prev) => ({ ...prev, [option.id]: choice.id }))
                    }
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedChoices[option.id] === choice.id
                          ? 'border-gray-900'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedChoices[option.id] === choice.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                      )}
                    </div>
                    <span className="flex-1 text-sm text-gray-700">{choice.name}</span>
                    {choice.price > 0 && (
                      <span className="text-xs text-gray-500">+{formatPrice(choice.price)}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="mt-4 pt-4 border-t border-gray-100 pb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center active:bg-gray-100"
              >
                <Minus size={18} className="text-gray-600" />
              </button>
              <span className="text-lg font-semibold w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center active:bg-gray-100"
              >
                <Plus size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Add Button */}
        <div className="shrink-0 p-4 border-t border-gray-100 bg-white">
          <button
            onClick={handleAdd}
            className="w-full h-14 bg-gray-900 text-white rounded-full flex items-center justify-between px-6 active:scale-[0.97] transition-transform"
          >
            <span className="text-sm font-semibold">Add to order</span>
            <span className="text-sm font-semibold">{formatPrice(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
