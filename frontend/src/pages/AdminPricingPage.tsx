import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SearchIcon,
  DollarSignIcon,
  EditIcon,
  CheckIcon,
  XIcon } from
'lucide-react';
import { toast } from 'sonner';
import {
  furnitureCatalog,
  DESIGN_SERVICE_CHARGE,
  TAX_RATE } from
'../data/mockData';
interface PricingItem {
  type: string;
  icon: string;
  category: string;
  price: number;
}
export function AdminPricingPage() {
  const [pricing, setPricing] = useState<PricingItem[]>(
    furnitureCatalog.map((item) => ({
      type: item.type,
      icon: item.icon,
      category: item.category,
      price: item.price
    }))
  );
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [designCharge, setDesignCharge] = useState(DESIGN_SERVICE_CHARGE);
  const [taxRate, setTaxRate] = useState(TAX_RATE * 100);
  const filtered = pricing.filter(
    (item) =>
    item.type.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );
  const handleEdit = (type: string, currentPrice: number) => {
    setEditingId(type);
    setEditPrice(currentPrice.toString());
  };
  const handleSave = (type: string) => {
    const newPrice = parseFloat(editPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      toast.error('Invalid price');
      return;
    }
    setPricing((prev) =>
    prev.map((item) =>
    item.type === type ?
    {
      ...item,
      price: newPrice
    } :
    item
    )
    );
    setEditingId(null);
    toast.success('Price updated');
  };
  const handleCancel = () => {
    setEditingId(null);
    setEditPrice('');
  };
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Seating':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Tables':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'Bedroom':
        return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400';
      case 'Storage':
        return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-400';
      default:
        return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-400';
    }
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
            Furniture Pricing
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
            Manage furniture prices and service charges
          </p>
        </div>

        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search furniture..."
            className="w-56 pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />

        </div>
      </div>

      {/* Service Charges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <DollarSignIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Design Service Charge
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Flat fee per design
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-slate-400">$</span>
            <input
              type="number"
              value={designCharge}
              onChange={(e) => setDesignCharge(parseFloat(e.target.value))}
              className="flex-1 px-4 py-2 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />

          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <DollarSignIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Tax Rate
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Applied to total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value))}
              step="0.1"
              className="flex-1 px-4 py-2 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />

            <span className="text-gray-500 dark:text-slate-400">%</span>
          </div>
        </div>
      </div>

      {/* Furniture Pricing Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Furniture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filtered.map((item, i) =>
              <motion.tr
                key={item.type}
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.05
                }}
                className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getCategoryColor(item.category)}`}>

                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === item.type ?
                  <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-slate-400">
                          $
                        </span>
                        <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-24 px-2 py-1 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      autoFocus />

                      </div> :

                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${item.price.toFixed(2)}
                      </span>
                  }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {editingId === item.type ?
                  <div className="flex items-center justify-end gap-2">
                        <button
                      onClick={() => handleSave(item.type)}
                      className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">

                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                      onClick={handleCancel}
                      className="p-1.5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">

                          <XIcon className="w-4 h-4" />
                        </button>
                      </div> :

                  <button
                    onClick={() => handleEdit(item.type, item.price)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">

                        <EditIcon className="w-3 h-3" />
                        Edit
                      </button>
                  }
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>);

}