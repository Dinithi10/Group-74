import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  ShoppingCartIcon,
  DollarSignIcon,
  PackageIcon } from
'lucide-react';
import {
  furnitureCatalog,
  DESIGN_SERVICE_CHARGE,
  TAX_RATE,
  type FurnitureItem } from
'../../data/mockData';
interface PriceBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  designName: string;
  furnitureItems: FurnitureItem[];
  onAddToCart: () => void;
}
export function PriceBreakdownModal({
  isOpen,
  onClose,
  designName,
  furnitureItems,
  onAddToCart
}: PriceBreakdownModalProps) {
  // Calculate prices
  const itemsWithPrices = furnitureItems.map((item) => {
    const catalogItem = furnitureCatalog.find((c) => c.type === item.type);
    return {
      ...item,
      price: catalogItem?.price || 0
    };
  });
  const subtotal = itemsWithPrices.reduce((sum, item) => sum + item.price, 0);
  const designCharge = DESIGN_SERVICE_CHARGE;
  const tax = (subtotal + designCharge) * TAX_RATE;
  const total = subtotal + designCharge + tax;
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop */}
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />


          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl pointer-events-auto max-h-[90vh] overflow-hidden flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <DollarSignIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Price Breakdown
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {designName}
                    </p>
                  </div>
                </div>
                <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">

                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Furniture Items */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <PackageIcon className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Furniture Items
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {itemsWithPrices.map((item) =>
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">

                        <div className="flex items-center gap-3">
                          <div
                        className="w-8 h-8 rounded-lg"
                        style={{
                          backgroundColor: item.color
                        }} />

                          <span className="text-sm text-gray-900 dark:text-white">
                            {item.type}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                  )}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">
                      Subtotal
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">
                      Design Service
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${designCharge.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">
                      Tax ({(TAX_RATE * 100).toFixed(0)}%)
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 dark:border-slate-700">
                <button
                onClick={() => {
                  onAddToCart();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25">

                  <ShoppingCartIcon className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}