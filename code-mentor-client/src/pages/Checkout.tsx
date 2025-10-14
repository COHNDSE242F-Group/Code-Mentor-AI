// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCardIcon, BuildingIcon, TagIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
export const Checkout: React.FC = () => {
  const {
    theme
  } = useTheme();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'paypal' | 'bank-transfer'>('credit-card');
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  // In a real app, these would come from your state management solution
  const selectedPlan = {
    name: 'Standard',
    price: 999,
    billing: 'monthly',
    instructors: 15,
    students: 500
  };
  const handleApplyCoupon = () => {
    if (couponCode.trim() !== '') {
      setIsCouponApplied(true);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process payment logic would go here
    navigate('/confirmation');
  };
  return <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Complete Your Subscription
      </h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
            <h2 className="text-xl font-semibold mb-6">Billing Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Institution Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BuildingIcon size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
                    </div>
                    <input type="text" className={`pl-10 block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="e.g. Stanford University" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Billing Contact Name
                    </label>
                    <input type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="e.g. John Doe" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Billing Email
                    </label>
                    <input type="email" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="e.g. billing@stanford.edu" />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Billing Address
                  </label>
                  <input type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="Street address" />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      City
                    </label>
                    <input type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      State/Province
                    </label>
                    <input type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Zip/Postal Code
                    </label>
                    <input type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Country
                  </label>
                  <select className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    {/* More countries would be here */}
                  </select>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Payment Method</h3>
                  <div className="space-y-4">
                    <div className={`flex items-center p-4 rounded-md border cursor-pointer ${paymentMethod === 'credit-card' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200'}`} onClick={() => setPaymentMethod('credit-card')}>
                      <input type="radio" checked={paymentMethod === 'credit-card'} onChange={() => setPaymentMethod('credit-card')} className="h-4 w-4 text-blue-600" />
                      <div className="ml-3">
                        <label className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                          Credit Card
                        </label>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Pay with Visa, Mastercard, or American Express
                        </p>
                      </div>
                      <div className="ml-auto">
                        <CreditCardIcon className="h-6 w-6 text-blue-500" />
                      </div>
                    </div>
                    {paymentMethod === 'credit-card' && <div className="p-4 border rounded-md space-y-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Card Number
                          </label>
                          <input type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="•••• •••• •••• ••••" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              Expiration Date
                            </label>
                            <input type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="MM/YY" />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              CVC
                            </label>
                            <input type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="CVC" />
                          </div>
                        </div>
                      </div>}
                    <div className={`flex items-center p-4 rounded-md border cursor-pointer ${paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200'}`} onClick={() => setPaymentMethod('paypal')}>
                      <input type="radio" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} className="h-4 w-4 text-blue-600" />
                      <div className="ml-3">
                        <label className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                          PayPal
                        </label>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Pay with your PayPal account
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center p-4 rounded-md border cursor-pointer ${paymentMethod === 'bank-transfer' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200'}`} onClick={() => setPaymentMethod('bank-transfer')}>
                      <input type="radio" checked={paymentMethod === 'bank-transfer'} onChange={() => setPaymentMethod('bank-transfer')} className="h-4 w-4 text-blue-600" />
                      <div className="ml-3">
                        <label className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                          Bank Transfer
                        </label>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Pay directly from your bank account
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-300">
                  Subscribe Now
                </button>
              </div>
            </form>
          </div>
        </div>
        <div>
          <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className={`p-4 rounded-md mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between mb-2">
                <span className="font-medium">{selectedPlan.name} Plan</span>
                <span>${selectedPlan.price}/mo</span>
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="flex justify-between mb-1">
                  <span>Instructors</span>
                  <span>{selectedPlan.instructors}</span>
                </div>
                <div className="flex justify-between">
                  <span>Students</span>
                  <span>{selectedPlan.students}</span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <TagIcon size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                <span className="ml-2 text-sm font-medium">Apply Coupon</span>
              </div>
              <div className="flex">
                <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} disabled={isCouponApplied} placeholder="Enter coupon code" className={`block w-full rounded-l-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} />
                <button onClick={handleApplyCoupon} disabled={isCouponApplied} className={`px-4 py-2 rounded-r-md font-medium ${isCouponApplied ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                  {isCouponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {isCouponApplied && <div className="mt-2 text-sm text-green-500">
                  Coupon applied! 10% discount added.
                </div>}
            </div>
            <div className={`pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-between mb-2">
                <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Subtotal
                </span>
                <span>${selectedPlan.price.toFixed(2)}</span>
              </div>
              {isCouponApplied && <div className="flex justify-between mb-2 text-green-500">
                  <span>Discount (10%)</span>
                  <span>-${(selectedPlan.price * 0.1).toFixed(2)}</span>
                </div>}
              <div className="flex justify-between mb-2">
                <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tax
                </span>
                <span>${(selectedPlan.price * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total</span>
                <span>
                  $
                  {(selectedPlan.price * (isCouponApplied ? 0.9 : 1) * 1.08).toFixed(2)}
                </span>
              </div>
              <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {selectedPlan.billing === 'monthly' ? 'Billed monthly' : 'Billed annually'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};