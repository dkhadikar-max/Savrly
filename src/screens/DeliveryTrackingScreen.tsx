import { useState, useEffect, useRef } from 'react';
import { Phone, MessageCircle, Clock, ChevronRight, Bike } from 'lucide-react';
import { useApp } from '@/store/AppContext';

const STEPS = [
  { label: 'Order Accepted', duration: 2000 },
  { label: 'Restaurant Preparing', duration: 2500 },
  { label: 'Chef Cooking', duration: 2500 },
  { label: 'Packing', duration: 2000 },
  { label: 'Delivery Partner Assigned', duration: 1500 },
  { label: 'Heading to Restaurant', duration: 2000 },
  { label: 'Order Picked Up', duration: 1500 },
  { label: 'On the Way', duration: 3000 },
  { label: 'Nearby', duration: 2000 },
  { label: 'Delivered', duration: 1000 },
];

export function DeliveryTrackingScreen() {
  const { navigate, dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(35);
  const [showComplete, setShowComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const etaRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    const runSteps = () => {
      if (currentStep < STEPS.length - 1) {
        timerRef.current = setTimeout(() => {
          setCurrentStep((s) => s + 1);
        }, STEPS[currentStep].duration);
      }
    };
    runSteps();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
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
    }, 2000);
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
        <img
          src="/images/map-bg.jpg"
          alt="Map"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top Info Bar */}
        <div className="bg-white/90 backdrop-blur-md px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Estimated arrival</p>
              <p className="text-2xl font-bold text-gray-900">
                {eta <= 0 ? 'Arrived!' : `${eta} min`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:bg-gray-200">
                <Phone size={18} className="text-gray-700" />
              </button>
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:bg-gray-200">
                <MessageCircle size={18} className="text-gray-700" />
              </button>
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
            <Bike size={16} className="text-green-600" />
            <p className="text-sm font-semibold text-gray-900">{step.label}</p>
          </div>
        </div>

        {/* Rider Card */}
        <div className="flex-1" />

        {/* Bottom Card */}
        <div className="bg-white rounded-t-3xl shadow-2xl">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          <div className="px-4 pb-4">
            {/* Delivery Partner */}
            <div className="flex items-center gap-3 py-3 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <Bike size={20} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Alex R.</p>
                <p className="text-xs text-gray-500">Your delivery partner</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone size={16} className="text-green-600" />
                </button>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="py-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Delivery Status
              </h3>
              <div className="flex flex-col gap-0">
                {STEPS.slice(0, Math.min(currentStep + 2, STEPS.length)).map((s, i) => {
                  const isDone = i < currentStep;
                  const isCurrent = i === currentStep;
                  const isVisible = i <= currentStep + 1;
                  if (!isVisible) return null;

                  return (
                    <div key={s.label} className="flex items-start gap-3 py-1.5">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isDone
                              ? 'bg-green-500'
                              : isCurrent
                              ? 'bg-green-500 ring-4 ring-green-200'
                              : 'bg-gray-300'
                          }`}
                        />
                        {i < STEPS.length - 1 && (
                          <div
                            className={`w-0.5 h-5 ${
                              i < currentStep ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                      <p
                        className={`text-xs pt-0.5 ${
                          isCurrent ? 'font-semibold text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {s.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Done Button - shows when complete */}
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

      {/* Delivery Notification Simulation */}
      {currentStep > 0 && currentStep < STEPS.length - 1 && (
        <div className="absolute top-20 left-4 right-4 z-20 animate-in slide-in-from-top duration-500">
          <div className="bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <Clock size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Status Update</p>
              <p className="text-xs text-gray-500">{step.label}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
