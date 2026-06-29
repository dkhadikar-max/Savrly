import { Receipt, RotateCcw } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { restaurants } from '@/data';
import { useLocale } from '@/hooks/useLocale';

export function OrdersScreen() {
  const { state, navigate } = useApp();
  const { formatPrice } = useLocale();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="sticky top-0 z-40 bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {state.orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Receipt size={28} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400">No orders yet</p>
            <p className="text-xs text-gray-300 mt-1">Your order history will appear here</p>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-3">
            {state.orders.map((order) => (
              <div key={order.id} className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-mono text-gray-400">{order.id}</p>
                    <h3 className="text-sm font-semibold text-gray-900 mt-0.5">
                      {order.restaurantName}
                    </h3>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                  <button
                    className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-white px-3 py-1.5 rounded-full active:bg-gray-100"
                    onClick={() => {
                      const r = restaurants.find((x) => x.name === order.restaurantName);
                      if (r) navigate('restaurantDetail', { restaurantId: r.id });
                    }}
                  >
                    <RotateCcw size={12} />
                    Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
