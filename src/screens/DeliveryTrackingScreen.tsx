import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Clock, Package, ChevronRight, FlaskConical } from 'lucide-react';
import { useApp } from '@/store/AppContext';

const STEPS = [
  { label: 'Order Confirmed',        detail: 'Your order has been received',              duration: 2000 },
  { label: 'Restaurant Notified',    detail: 'The restaurant has been sent your order',   duration: 4000 },
  { label: 'Preparing Your Order',   detail: 'Your food is being freshly prepared',       duration: 9000 },
  { label: 'Order Ready for Pickup', detail: 'Your order is packed and waiting',          duration: 3000 },
  { label: 'Courier Dispatched',     detail: 'A courier has been assigned',               duration: 4000 },
  { label: 'Order Collected',        detail: 'Courier has picked up your order',          duration: 5000 },
  { label: 'Out for Delivery',       detail: 'Your order is on its way to you',           duration: 9000 },
  { label: 'Almost There',           detail: 'Your order is nearly at your address',      duration: 4000 },
  { label: 'Delivered',              detail: 'Your order has arrived — enjoy!',           duration: 1000 },
];

export function DeliveryTrackingScreen() {
  const { navigate, dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(35);
  const [showComplete, setShowComplete] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const etaRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const toastRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (currentStep < STEPS.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentStep((s) => s + 1);
        setShowToast(true);
        toastRef.current = setTimeout(() => setShowToast(false), 2800);
      }, STEPS[currentStep].duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (toastRef.current) clearTimeout(toastRef.current);
    };
  }, [currentStep]);

  useEffect(() => {
    const p = (currentStep / (STEPS.length - 1)) * 100;
    setProgress(p);
    if (currentStep === STEPS.length - 1) {
      setTimeout(() => setShowComplete(true), 800);
    }
  }, [currentStep]);

  useEffect(() => {
    etaRef.current = setInterval(() => {
      setEta((e) => {
        if (e <= 1) {
          if (etaRef.current) clearInterval(etaRef.current);
          return 0;
        }
        return e - 1;
      });
    }, (STEPS.reduce((s, x) => s + x.duration, 0) / 35));
    return () => {
      if (etaRef.current) clearInterval(etaRef.current);
    };
  }, []);

  const handleDone = () => {
    dispatch({ type: 'SHOW_INTERVENTION', show: true });
    navigate('intervention');
  };

  const step = STEPS[currentStep];

  return (
    <div className="flex flex-col h-full relative">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <img src="/images/map-bg.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Simulation badge */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow">
          <FlaskConical size={11} className="text-purple-500" />
          <span className="text-[10px] font-semibold text-purple-600 tracking-wide">SIMULATED</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top Info Bar */}
        <div className="bg-white/90 backdrop-blur-md px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Estimated delivery</p>
              <p className="text-2xl font-bold text-gray-900">
                {eta <= 0 ? 'Arrived!' : `~${eta} min`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500">
                Step {currentStep + 1} of {STEPS.length}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Current Status */}
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-sm font-semibold text-gray-900">{step.label}</p>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 pl-4">{step.detail}</p>
        </div>

        <div className="flex-1" />

        {/* Bottom Card */}
        <div className="bg-white rounded-t-3xl shadow-2xl">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          <div className="px-4 pb-4">
            {/* Order summary row */}
            <div className="flex items-center gap-3 py-3 border-b border-gray-100">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
                <Package size={20} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Your Order</p>
                <p className="text-xs text-gray-400">Delivery simulation in progress</p>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="py-3">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Delivery Progress
              </h3>
              <div className="flex flex-col gap-0">
                {STEPS.map((s, i) => {
                  const isDone = i < currentStep;
                  const isCurrent = i === currentStep;
                  const isUpcoming = i > currentStep + 1;

                  if (isUpcoming) return null;

                  return (
                    <div key={s.label} className="flex items-start gap-3 py-1.5">
                      <div className="flex flex-col items-center shrink-0">
                        <div
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            isDone
                              ? 'bg-green-500'
                              : isCurrent
                              ? 'bg-green-500 ring-4 ring-green-100'
                              : 'bg-gray-200'
                          }`}
                        />
                        {i < STEPS.length - 1 && (
                          <div
                            className={`w-0.5 h-5 transition-colors duration-500 ${
                              i < currentStep ? 'bg-green-400' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <p
                          className={`text-xs transition-colors ${
                            isCurrent
                              ? 'font-semibold text-gray-900'
                              : isDone
                              ? 'text-gray-500'
                              : 'text-gray-300'
                          }`}
                        >
                          {s.label}
                        </p>
                        {isCurrent && (
                          <p className="text-[10px] text-gray-400 mt-0.5">{s.detail}</p>
                        )}
                        {isDone && (
                          <CheckCircle2 size={10} className="text-green-500 mt-0.5" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Done Button */}
            {showComplete && (
              <button
                onClick={handleDone}
                className="w-full h-14 bg-gray-900 text-white rounded-full flex items-center justify-center gap-2 active:scale-[0.97] transition-transform mt-2"
              >
                <span className="text-sm font-semibold">Order Complete</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status Toast */}
      {showToast && currentStep > 0 && currentStep < STEPS.length - 1 && (
        <div className="absolute top-[88px] left-4 right-14 z-20 animate-in slide-in-from-top duration-300">
          <div className="bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center shrink-0">
              <Clock size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">{step.label}</p>
              <p className="text-[10px] text-gray-400">{step.detail}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
