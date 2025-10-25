
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon, CalendarIcon, UsersIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Confirmation: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Expecting navigate state from Checkout: { subscription, plan, university_name }
  const navState: any = (location && (location as any).state) || {};
  const universityName = navState.university_name || localStorage.getItem('university_name') || 'Your Institution';

  const [subscription, setSubscription] = useState<any>(navState.subscription || null);
  const [plan, setPlan] = useState<any>(navState.plan || (navState.subscription && navState.subscription.plan) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If we don't have plan details (confirm endpoint returns a thin payload), fetch the full subscription
  useEffect(() => {
    const ensurePlan = async () => {
      if (plan) return; // we already have plan details
      const subId = subscription && subscription.subscription_id ? subscription.subscription_id : navState && navState.subscriptionId ? navState.subscriptionId : null;
      if (!subId) return;
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiUrl}/packages/subscription/${subId}`);
        if (!res.ok) throw new Error(`Failed to load subscription: ${res.status}`);
        const data = await res.json();
        setSubscription(data);
        setPlan(data.plan || null);
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    ensurePlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derive some display values
  const billingCycle = subscription && subscription.billing_cycle ? subscription.billing_cycle : 'monthly';
  const price = plan ? (billingCycle === 'yearly' ? plan.yearly_price : plan.monthly_price) : null;
  const createdAt = subscription && subscription.created_at ? new Date(subscription.created_at) : new Date();

  return <div className="max-w-3xl mx-auto text-center">
      <div className={`rounded-lg p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon size={48} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome {universityName} 🎉</h1>
        <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Your subscription has been successfully set up and is now active.
        </p>
        <div className={`rounded-lg p-6 mb-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h2 className="text-xl font-semibold mb-4">Subscription Summary</h2>
          {loading && <div className="mb-4 text-sm text-gray-500">Loading subscription details…</div>}
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 ${theme === 'dark' ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Plan</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {plan && plan.name ? plan.name : '—'}
              </p>
            </div>
            <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 ${theme === 'dark' ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <UsersIcon size={20} />
              </div>
              <h3 className="font-medium mb-1">Seats</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {plan && (plan.instructors !== undefined && plan.instructors !== null) ? plan.instructors : '—'} instructors
                <br />
                {plan && (plan.students !== undefined && plan.students !== null) ? plan.students : '—'} students
              </p>
            </div>
            <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-3 ${theme === 'dark' ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <CalendarIcon size={20} />
              </div>
              <h3 className="font-medium mb-1">Started</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              </p>
            </div>
          </div>
          {price !== null && <div className="mt-4 text-sm text-gray-700">Price: ${price} ({billingCycle})</div>}
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <button onClick={() => navigate('/university-dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-300">
              Go to Dashboard
            </button>
            <button onClick={() => navigate('/billing')} className={`py-3 px-6 rounded-md font-medium transition duration-300 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
              Manage Billing
            </button>
          </div>
        </div>
      </div>
    </div>;
};