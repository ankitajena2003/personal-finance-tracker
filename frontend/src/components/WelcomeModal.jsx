import { useEffect } from "react";

export default function WelcomeModal({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600
                   text-white rounded-3xl px-16 py-14
                   shadow-[0_0_80px_rgba(99,102,241,0.7)]
                   animate-scaleIn"
      >
        <h1 className="text-4xl font-bold text-center mb-4">
          🎉 Welcome!
        </h1>

        <p className="text-xl text-center opacity-95">
          {message}
        </p>
      </div>
    </div>
  );
}
