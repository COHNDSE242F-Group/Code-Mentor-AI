// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, DownloadIcon, AlertTriangleIcon, CheckIcon, XIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}
interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  instructors: number | string;
  students: number | string;
  storage: string;
  features: {
    name: string;
    included: boolean;
  }[];
}
export const BillingManagement: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  // In a real app, these would come from your state management
  const currentPlan: Plan = {
    id: 'standard',
    name: 'Standard',
    description: 'Ideal for mid-sized departments and schools',
    monthlyPrice: 999,
    instructors: 15,
    students: 500,
    storage: '200 GB',
    features: [{
      name: 'Basic AI code assistance',
      included: true
    }, {
      name: 'Assignment grading',
      included: true
    }, {
      name: 'Student progress tracking',
      included: true
    }, {
      name: 'Email support',
      included: true
    }, {
      name: 'Custom branding',
      included: true
    }, {
      name: 'Advanced analytics',
      included: true
    }, {
      name: 'LMS integration',
      included: false
    }, {
      name: 'Dedicated account manager',
      included: false
    }]
  };
  const nextRenewalDate = new Date(Date.now() + 23 * 24 * 60 * 60 * 1000); // 23 days from now
  const daysUntilRenewal = Math.ceil((nextRenewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const invoices: Invoice[] = [{
    id: 'INV-2023-001',
    date: new Date(2023, 8, 1),
    amount: 999,
    status: 'paid'
  }, {
    id: 'INV-2023-002',
    date: new Date(2023, 9, 1),
    amount: 999,
    status: 'paid'
  }, {
    id: 'INV-2023-003',
    date: new Date(2023, 10, 1),
    amount: 999,
    status: 'paid'
  }, {
    id: 'INV-2023-004',
    date: new Date(2023, 11, 1),
    amount: 999,
    status: 'pending'
  }];
  const plans: Plan[] = [{
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small departments and pilot programs',
    monthlyPrice: 499,
    instructors: 5,
    students: 100,
    storage: '50 GB',
    features: [{
      name: 'Basic AI code assistance',
      included: true
    }, {
      name: 'Assignment grading',
      included: true
    }, {
      name: 'Student progress tracking',
      included: true
    }, {
      name: 'Email support',
      included: true
    }, {
      name: 'Custom branding',
      included: false
    }, {
      name: 'Advanced analytics',
      included: false
    }, {
      name: 'LMS integration',
      included: false
    }, {
      name: 'Dedicated account manager',
      included: false
    }]
  }, {
    id: 'standard',
    name: 'Standard',
    description: 'Ideal for mid-sized departments and schools',
    monthlyPrice: 999,
    instructors: 15,
    students: 500,
    storage: '200 GB',
    features: [{
      name: 'Basic AI code assistance',
      included: true
    }, {
      name: 'Assignment grading',
      included: true
    }, {
      name: 'Student progress tracking',
      included: true
    }, {
      name: 'Email support',
      included: true
    }, {
      name: 'Custom branding',
      included: true
    }, {
      name: 'Advanced analytics',
      included: true
    }, {
      name: 'LMS integration',
      included: false
    }, {
      name: 'Dedicated account manager',
      included: false
    }]
  }, {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large universities with advanced needs',
    monthlyPrice: 2499,
    instructors: 'Unlimited',
    students: 'Unlimited',
    storage: '1 TB',
    features: [{
      name: 'Basic AI code assistance',
      included: true
    }, {
      name: 'Assignment grading',
      included: true
    }, {
      name: 'Student progress tracking',
      included: true
    }, {
      name: 'Email support',
      included: true
    }, {
      name: 'Custom branding',
      included: true
    }, {
      name: 'Advanced analytics',
      included: true
    }, {
      name: 'LMS integration',
      included: true
    }, {
      name: 'Dedicated account manager',
      included: true
    }]
  }];

  useEffect(() => {
    const uniIdStr = localStorage.getItem('university_id');
    if (!uniIdStr) {
      setError('No university selected. Please register first.');
      return;
    }
    const uniId = Number(uniIdStr);
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    setLoading(true);
    Promise.all([
      fetch(`${apiUrl}/packages/uni/${uniId}/subscriptions`).then(r => r.ok ? r.json() : Promise.reject(r)),
      fetch(`${apiUrl}/packages/uni/${uniId}/payment-methods`).then(r => r.ok ? r.json() : Promise.reject(r))
    ]).then(([subs, pms]) => {
      setSubscriptions(subs || []);
      setPaymentMethods(pms || []);
    }).catch(err => {
      console.error(err);
      setError((err && err.message) || 'Failed to load billing data');
    }).finally(() => setLoading(false));
  }, []);
  return <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <button onClick={() => navigate('/dashboard')} className={`py-2 px-4 rounded-md font-medium ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
          Back to Dashboard
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
              <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Subscription Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Current Plan
                  </h3>
                  <p className="text-2xl font-bold">{currentPlan.name}</p>
                  <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    ${currentPlan.monthlyPrice}/month
                  </p>
                </div>
                <div>
                  <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Next Renewal
                  </h3>
                  <div className="flex items-center">
                    <CalendarIcon size={18} className="mr-2 text-blue-500" />
                    <p className="font-medium">
                      {nextRenewalDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    </p>
                  </div>
                  {daysUntilRenewal <= 30 && <div className={`mt-2 text-sm ${daysUntilRenewal <= 7 ? 'text-red-500' : 'text-yellow-500'}`}>
                      <AlertTriangleIcon size={14} className="inline mr-1" />
                      Renews in {daysUntilRenewal} days
                    </div>}
                </div>
              </div>
              <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="font-medium">Plan Details</h3>
                    <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {currentPlan.instructors} instructors,{' '}
                      {currentPlan.students} students, {currentPlan.storage}{' '}
                      storage
                    </p>
                  </div>
                  <div>
                    <button onClick={() => setShowUpgradeModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                      Upgrade Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Subscriptions</h2>
              {loading && <div>Loading billing data…</div>}
              {error && <div className="text-sm text-red-600">{error}</div>}
              {!loading && !error && <div className="space-y-4">
                {subscriptions.length === 0 && <div className="text-sm text-gray-500">No subscriptions found.</div>}
                {subscriptions.map((s:any) => <div key={s.subscription_id} className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{s.plan?.name || s.plan?.plan_key}</div>
                        <div className="text-sm text-gray-500">{s.billing_cycle} • {s.status}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div>${s.plan ? (s.billing_cycle === 'yearly' ? s.plan.yearly_price : s.plan.monthly_price) : '0'}</div>
                        <div className="text-gray-500">Created {new Date(s.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>)}
              </div>}
            </div>
          </div>
        </div>
        <div>
          <div className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className={`p-4 rounded-md mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h3 className="text-sm font-medium mb-2">Saved Payment Methods</h3>
                {!loading && paymentMethods.length === 0 && <div className="text-sm text-gray-500">No payment methods saved.</div>}
                {!loading && paymentMethods.map(pm => <div key={pm.payment_method_id} className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-10 h-6 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} mr-3`}></div>
                      <div>
                        <p className="font-medium">{pm.card_last4 ? `•••• •••• •••• ${pm.card_last4}` : pm.provider_payment_method_id}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{pm.provider}</p>
                      </div>
                    </div>
                    {pm.is_default && <span className={`px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : ''}`}>Default</span>}
                  </div>)}
              </div>
              <button className={`w-full py-2 px-4 rounded-md font-medium ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
                Update Payment Method
              </button>
            </div>
          </div>
          <div className={`mt-6 rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h3 className="font-medium mb-1">Billing Questions?</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Contact our billing team for any questions related to your
                    subscription.
                  </p>
                  <a href="mailto:billing@codementorai.com" className={`inline-block mt-2 text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                    billing@codementorai.com
                  </a>
                </div>
                <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h3 className="font-medium mb-1">Cancel Subscription</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Need to cancel your subscription? Please contact our support
                    team.
                  </p>
                  <button className={`mt-2 text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                    Request Cancellation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showUpgradeModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`max-w-4xl w-full rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
                <button onClick={() => setShowUpgradeModal(false)} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                  <XIcon size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => <div key={plan.id} className={`rounded-lg overflow-hidden ${plan.id === currentPlan.id ? 'border-2 border-blue-500' : theme === 'dark' ? 'border border-gray-700' : 'border border-gray-200'}`}>
                    <div className={`p-4 ${plan.id === 'standard' ? 'bg-blue-600 text-white' : ''}`}>
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <p className={`text-sm ${plan.id === 'standard' ? 'text-blue-100' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {plan.description}
                      </p>
                      <div className="mt-2">
                        <span className="text-2xl font-bold">
                          ${plan.monthlyPrice}
                        </span>
                        <span>/month</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Instructors:
                          </span>
                          <span className="font-medium">
                            {plan.instructors}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Students:
                          </span>
                          <span className="font-medium">{plan.students}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Storage:
                          </span>
                          <span className="font-medium">{plan.storage}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {plan.features.map((feature, index) => <div key={index} className="flex items-center">
                            {feature.included ? <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> : <XIcon className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} mr-2 flex-shrink-0`} />}
                            <span className={`text-sm ${feature.included ? '' : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                              {feature.name}
                            </span>
                          </div>)}
                      </div>
                    </div>
                    <div className="p-4">
                      {plan.id === currentPlan.id ? <div className={`text-center py-2 px-4 rounded-md font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                          Current Plan
                        </div> : <button className={`w-full py-2 px-4 rounded-md font-medium ${plan.id === 'enterprise' ? 'bg-blue-600 hover:bg-blue-700 text-white' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
                          {plan.id === 'starter' ? 'Downgrade' : 'Upgrade'}
                        </button>}
                    </div>
                  </div>)}
              </div>
              <div className="mt-6 text-center">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Need a custom plan?{' '}
                  <a href="#" className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>
                    Contact us
                  </a>{' '}
                  for enterprise pricing.
                </p>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};