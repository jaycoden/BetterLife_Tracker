'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage/localStorage';

interface GroceryItem {
  id: string;
  text: string;
  checked: boolean;
  category?: string;
}

export default function GroceryList() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['Produce', 'Meat', 'Dairy', 'Pantry', 'Frozen', 'Other'];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const saved = storage.get('lifeos_grocery_list') || [];
    setItems(saved);
  };

  const saveItems = (updatedItems: GroceryItem[]) => {
    storage.set('lifeos_grocery_list', updatedItems);
    setItems(updatedItems);
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const item: GroceryItem = {
      id: Date.now().toString(),
      text: newItem.trim(),
      checked: false,
      category: selectedCategory || 'Other',
    };

    const updated = [...items, item];
    saveItems(updated);
    setNewItem('');
    setSelectedCategory('');
  };

  const toggleItem = (id: string) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    saveItems(updated);
  };

  const deleteItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    saveItems(updated);
  };

  const clearChecked = () => {
    const updated = items.filter(item => !item.checked);
    saveItems(updated);
  };

  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  const uncheckedCount = items.filter(i => !i.checked).length;
  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🛒</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Grocery List</h2>
            <p className="text-sm text-gray-600">
              {uncheckedCount} items to get {checkedCount > 0 && `· ${checkedCount} checked off`}
            </p>
          </div>
        </div>
        {checkedCount > 0 && (
          <button
            onClick={clearChecked}
            className="text-sm text-red-600 hover:text-red-700 font-medium underline"
          >
            Clear Checked
          </button>
        )}
      </div>

      {/* Add Item Form */}
      <form onSubmit={addItem} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add item (e.g., Milk, Bread, Apples...)"
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="">Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
      </form>

      {/* Grouped Items */}
      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500 mb-2">Your list is empty</p>
          <p className="text-sm text-gray-400">Add items to start your grocery list</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category} className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {category}
              </h3>
              <div className="space-y-2">
                {categoryItems.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      item.checked
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span
                      className={`flex-1 ${
                        item.checked
                          ? 'text-gray-500 line-through'
                          : 'text-gray-900 font-medium'
                      }`}
                    >
                      {item.text}
                    </span>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Delete item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {items.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border-2 border-blue-300">
            <p className="text-3xl font-bold text-blue-600">{uncheckedCount}</p>
            <p className="text-sm text-gray-600 mt-1">Items remaining</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border-2 border-green-300">
            <p className="text-3xl font-bold text-green-600">{checkedCount}</p>
            <p className="text-sm text-gray-600 mt-1">Items checked</p>
          </div>
        </div>
      )}
    </div>
  );
}
