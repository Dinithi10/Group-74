import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCartIcon,
  TrashIcon,
  ArrowRightIcon,
  PackageIcon } from
'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';
export function CartPage() {
  const { cart, removeFromCart } = useApp();
  const navigate = useNavigate();
  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const handleRemove = (id: string) => {
    removeFromCart(id);
    toast.success('Removed from cart');
  };
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    navigate('/checkout');
  };
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
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
            {cart.length} design{cart.length !== 1 ? 's' : ''} in cart
          </p>
        </div>
      </div>

      {cart.length > 0 ?
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, i) =>
          <motion.div
            key={item.id}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.08
            }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {item.designName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {item.furnitureItems.length} furniture items
                    </p>
                  </div>
                  <button
                onClick={() => handleRemove(item.id)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">

                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">
                      Furniture
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">
                      Design Service
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      ${item.designCharge.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">
                      Tax
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      ${item.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      ${item.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
          )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-slate-400">
                    Items
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {cart.length}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Grand Total
                  </span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25">

                Proceed to Checkout
                <ArrowRightIcon className="w-4 h-4" />
              </button>

              <p className="text-xs text-gray-500 dark:text-slate-400 text-center mt-4">
                Secure checkout powered by FurnishViz
              </p>
            </div>
          </div>
        </div> :

      <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <ShoppingCartIcon className="w-8 h-8 text-gray-300 dark:text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Cart is Empty
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mb-6">
            Add designs to your cart to proceed with checkout
          </p>
          <button
          onClick={() => navigate('/saved')}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all">

            Browse Designs
          </button>
        </div>
      }
    </motion.div>);

}