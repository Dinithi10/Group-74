import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CreditCardIcon,
  LockIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  PackageIcon } from
'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
export function CheckoutPage() {
  const { cart, clearCart } = useApp();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    email: ''
  });
  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsSuccess(true);
    // Clear cart after successful payment
    setTimeout(() => {
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/dashboard');
    }, 3000);
  };
  if (isSuccess) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="min-h-[calc(100vh-64px)] flex items-center justify-center p-8">

        <div className="text-center max-w-md">
          <motion.div
            initial={{
              scale: 0
            }}
            animate={{
              scale: 1
            }}
            transition={{
              delay: 0.2,
              type: 'spring',
              stiffness: 200
            }}
            className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">

            <CheckCircleIcon className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-500 dark:text-slate-400 mb-6">
            Your order has been placed successfully. You will receive a
            confirmation email shortly.
          </p>
          <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
              Order Total
            </p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              ${grandTotal.toFixed(2)}
            </p>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500">
            Redirecting to dashboard...
          </p>
        </div>
      </motion.div>);

  }
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.4
      }}
      className="p-8">

      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6">

        <ArrowLeftIcon className="w-4 h-4" />
        Back to Cart
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <CreditCardIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Payment Details
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Demo payment gateway
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value
                    })
                    }
                    placeholder="john@example.com"
                    required
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      cardNumber: e.target.value
                    })
                    }
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    required
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-mono" />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={formData.cardName}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      cardName: e.target.value
                    })
                    }
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />

                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={formData.expiry}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        expiry: e.target.value
                      })
                      }
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-mono" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        cvv: e.target.value
                      })
                      }
                      placeholder="123"
                      maxLength={3}
                      required
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-mono" />

                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 transition-all shadow-lg shadow-indigo-500/25 mt-6">

                  {isProcessing ?
                  <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </> :

                  <>
                      <LockIcon className="w-4 h-4" />
                      Pay ${grandTotal.toFixed(2)}
                    </>
                  }
                </button>

                <p className="text-xs text-gray-500 dark:text-slate-400 text-center mt-4">
                  🔒 This is a demo payment gateway. No real charges will be
                  made.
                </p>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                {cart.map((item) =>
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">

                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.designName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {item.furnitureItems.length} items
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${item.total.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">
                    Grand Total
                  </span>
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <PackageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-emerald-900 dark:text-emerald-300">
                        Free Delivery
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                        Estimated delivery: 5-7 business days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>);

}