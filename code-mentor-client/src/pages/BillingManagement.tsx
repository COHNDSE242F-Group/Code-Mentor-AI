// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  yearlyPrice?: number;
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
  // track which plan is currently being upgraded so only that button shows processing
  const [upgradingPlanId, setUpgradingPlanId] = useState<string | null>(null);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  // Always prompt for university lookup when visiting billing page.
  // Do not auto-read `university_id` from localStorage so the lookup form appears.
  const [uniId, setUniId] = useState<number | null>(null);
  const [lookupName, setLookupName] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
  // derive current plan from subscriptions if available
  const activeSub = subscriptions && subscriptions.find((s:any) => s.status === 'active') || subscriptions[0] || null;
  const currentPlanFromSub = activeSub && activeSub.plan ? {
    id: activeSub.plan.plan_key || 'custom',
    name: activeSub.plan.name || (activeSub.plan.plan_key || 'Custom Plan'),
    description: activeSub.plan.description || '',
    monthlyPrice: activeSub.plan.monthly_price || 0,
    instructors: activeSub.plan.instructors ?? '—',
    students: activeSub.plan.students ?? '—',
    storage: activeSub.plan.storage || '—',
    features: activeSub.plan.features ? (Array.isArray(activeSub.plan.features) ? activeSub.plan.features : []) : []
  } : null;
  // Next renewal approximated from subscription created_at + billing cycle (if available)
  let nextRenewalDate = new Date(Date.now() + 23 * 24 * 60 * 60 * 1000); // fallback
  if (activeSub && activeSub.created_at) {
    const created = new Date(activeSub.created_at);
    if (activeSub.billing_cycle === 'yearly') {
      nextRenewalDate = new Date(created.getFullYear() + 1, created.getMonth(), created.getDate());
    } else {
      nextRenewalDate = new Date(created.getFullYear(), created.getMonth() + 1, created.getDate());
    }
  }
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
  // SAMPLE_PLANS is a local fallback for development/offline mode.
  
  const SAMPLE_PLANS: Plan[] = [{
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small departments and pilot programs',
    monthlyPrice: 499,
    yearlyPrice: 4990,
    instructors: 5,
    students: 100,
    storage: '50 GB',
    features: [{ name: 'Basic AI code assistance', included: true }, { name: 'Assignment grading', included: true }, { name: 'Student progress tracking', included: true }, { name: 'Email support', included: true }, { name: 'Custom branding', included: false }, { name: 'Advanced analytics', included: false }, { name: 'LMS integration', included: false }, { name: 'Dedicated account manager', included: false }]
  }, {
    id: 'standard',
    name: 'Standard',
    description: 'Ideal for mid-sized departments and schools',
    monthlyPrice: 999,
    yearlyPrice: 9990,
    instructors: 15,
    students: 500,
    storage: '200 GB',
    features: [{ name: 'Basic AI code assistance', included: true }, { name: 'Assignment grading', included: true }, { name: 'Student progress tracking', included: true }, { name: 'Email support', included: true }, { name: 'Custom branding', included: true }, { name: 'Advanced analytics', included: true }, { name: 'LMS integration', included: false }, { name: 'Dedicated account manager', included: false }]
  }, {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large universities with advanced needs',
    monthlyPrice: 2499,
    yearlyPrice: 24990,
    instructors: 'Unlimited',
    students: 'Unlimited',
    storage: '1 TB',
    features: [{ name: 'Basic AI code assistance', included: true }, { name: 'Assignment grading', included: true }, { name: 'Student progress tracking', included: true }, { name: 'Email support', included: true }, { name: 'Custom branding', included: true }, { name: 'Advanced analytics', included: true }, { name: 'LMS integration', included: true }, { name: 'Dedicated account manager', included: true }]
  }];

  const [plans, setPlans] = useState<Plan[]>(SAMPLE_PLANS);
  const [plansLoading, setPlansLoading] = useState(false);
  const location = useLocation();
  const [justConfirmed, setJustConfirmed] = useState(false);

  useEffect(() => {
    // Load plans from server if available and map them into our Plan shape.
    const fetchPlans = async () => {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      setPlansLoading(true);
      try {
        const res = await fetch(`${apiUrl}/packages`);
        if (!res.ok) throw new Error(`Failed to load plans: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Unexpected plans response');
        const mapped: Plan[] = data.map((p: any) => ({
          id: p.plan_key || p.id || String(p.id),
          name: p.name || p.plan_key || 'Plan',
          description: p.description || '',
          monthlyPrice: p.monthly_price ?? p.monthlyPrice ?? 0,
          yearlyPrice: p.yearly_price ?? p.yearlyPrice,
          instructors: p.instructors ?? '—',
          students: p.students ?? '—',
          storage: p.storage ?? '—',
          features: Array.isArray(p.features) ? p.features : []
        }));
        if (mapped.length) setPlans(mapped);
      } catch (err) {
        // Keep SAMPLE_PLANS as fallback; log the error for debugging.
        // console.warn('Could not load plans from API, using SAMPLE_PLANS', err);
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // fetch subscriptions + payment methods for a university id
  const fetchUniData = async (id: number) => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    setLoading(true);
    setError(null);
    try {
      const [subsRes, pmsRes] = await Promise.all([
        fetch(`${apiUrl}/packages/uni/${id}/subscriptions`),
        fetch(`${apiUrl}/packages/uni/${id}/payment-methods`)
      ]);
      if (!subsRes.ok) throw new Error(`Failed to load subscriptions: ${subsRes.status}`);
      if (!pmsRes.ok) throw new Error(`Failed to load payment methods: ${pmsRes.status}`);
      const subs = await subsRes.json();
      const pms = await pmsRes.json();
      setSubscriptions(subs || []);
      setPaymentMethods(pms || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uniId) fetchUniData(uniId);
  }, [uniId]);

  // If we arrived here after confirming a subscription, the Checkout page navigates back
  // with state { justConfirmed: true, subscription }. Detect that and refresh.
  useEffect(() => {
    const state: any = location && (location as any).state;
    if (state && state.justConfirmed) {
      // Show the lightweight success banner, but do NOT auto-select a university.
      // The user should always perform the lookup (name + email) when visiting /billing.
      setJustConfirmed(true);
      // clear the navigation state so banner doesn't persist on refresh
      try { window.history.replaceState({}, document.title); } catch (e) {}
    }
    // Do not read from localStorage or navigation state to auto-populate `uniId`.
    // The lookup form should always be shown first.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // clear success banner after a short time
  useEffect(() => {
    if (!justConfirmed) return;
    const id = setTimeout(() => setJustConfirmed(false), 4000);
    return () => clearTimeout(id);
  }, [justConfirmed]);

  useEffect(() => {
    const loadForUni = async (id: number) => {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      setLoading(true);
      setError(null);
      try {
        const [subsRes, pmsRes] = await Promise.all([
          fetch(`${apiUrl}/packages/uni/${id}/subscriptions`),
          fetch(`${apiUrl}/packages/uni/${id}/payment-methods`)
        ]);
        if (!subsRes.ok) throw new Error(`Failed to load subscriptions: ${subsRes.status}`);
        if (!pmsRes.ok) throw new Error(`Failed to load payment methods: ${pmsRes.status}`);
        const subs = await subsRes.json();
        const pms = await pmsRes.json();
        setSubscriptions(subs || []);
        setPaymentMethods(pms || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load billing data');
      } finally {
        setLoading(false);
      }
    };

    if (uniId) {
      loadForUni(uniId);
    }
  }, [uniId]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    // client-side validation
    const errors: Record<string,string> = {};
    const name = (lookupName || '').trim();
    const email = (lookupEmail || '').trim();
    if (!name) errors.lookupName = 'University name is required';
    else if (name.length < 3) errors.lookupName = 'Enter the full university name';
    const validateEmail = (v: string) => /\S+@\S+\.\S+/.test(v);
    if (!email) errors.lookupEmail = 'Contact email is required';
    else if (!validateEmail(email)) errors.lookupEmail = 'Enter a valid email address';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/welcome/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universityName: name, contactEmail: email })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Lookup failed: ${res.status}`);
      }
      const data = await res.json();
      const id = data.university_id;
      setUniId(id);
      try { localStorage.setItem('university_id', String(id)); localStorage.setItem('university_name', data.university_name); } catch (e) {}
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planKey: string, billingCycle: 'monthly' | 'yearly' = 'monthly') => {
    setUpgradeError(null);
    if (!uniId) {
      setUpgradeError('Select or lookup a university first');
      return;
    }
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    setUpgradingPlanId(planKey);
    try {
      const res = await fetch(`${apiUrl}/packages/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uni_id: uniId, plan_key: planKey, billing_cycle: billingCycle })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Subscribe failed: ${res.status}`);
      }
      const data = await res.json();
      // navigate to checkout with the new subscription id
      try { localStorage.setItem('university_id', String(uniId)); } catch (e) {}
      navigate('/checkout', { state: { subscriptionId: data.subscription_id, plan: data.plan, university_name: localStorage.getItem('university_name') } });
    } catch (err: any) {
      console.error(err);
      setUpgradeError(err.message || String(err));
    } finally {
      setUpgradingPlanId(null);
    }
  };
  // If we don't have a university selected, show a simple lookup form
  if (!uniId) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-lg p-8 bg-white shadow-md">
          <h1 className="text-2xl font-bold mb-4">Find your university billing</h1>
          <p className="mb-4 text-sm text-gray-600">Enter your university name and contact email used during registration to view billing information.</p>
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">University name</label>
              <input value={lookupName} onChange={e => setLookupName(e.target.value)} className="w-full rounded-md border px-3 py-2" placeholder="e.g. Stanford University" />
              {fieldErrors.lookupName && <p className="mt-1 text-sm text-red-600">{fieldErrors.lookupName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact email</label>
              <input value={lookupEmail} onChange={e => setLookupEmail(e.target.value)} className="w-full rounded-md border px-3 py-2" placeholder="billing@youruni.edu" />
              {fieldErrors.lookupEmail && <p className="mt-1 text-sm text-red-600">{fieldErrors.lookupEmail}</p>}
            </div>
            <div>
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2 px-4 rounded-md">Find billing info</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {justConfirmed && (
        <div className="mb-4 p-4 rounded-md bg-green-50 border border-green-200 text-green-800">Subscription updated successfully.</div>
      )}

        <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Billing &amp; Subscription</h1>
        <button onClick={() => navigate('/university-dashboard')} className={`py-2 px-4 rounded-md font-medium ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Subscription Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Current Plan</h3>
                  <p className="text-2xl font-bold">{currentPlanFromSub ? currentPlanFromSub.name : 'No plan selected'}</p>
                  <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{currentPlanFromSub ? `$${currentPlanFromSub.monthlyPrice}/month` : '—'}</p>
                </div>
                <div>
                  <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Next Renewal</h3>
                  <div className="flex items-center">
                    <CalendarIcon size={18} className="mr-2 text-blue-500" />
                    <p className="font-medium">{nextRenewalDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  {daysUntilRenewal <= 30 && (
                    <div className={`mt-2 text-sm ${daysUntilRenewal <= 7 ? 'text-red-500' : 'text-yellow-500'}`}>
                      <AlertTriangleIcon size={14} className="inline mr-1" />
                      Renews in {daysUntilRenewal} days
                    </div>
                  )}
                </div>
              </div>

              <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="font-medium">Plan Details</h3>
                    <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{currentPlanFromSub ? `${currentPlanFromSub.instructors} instructors, ${currentPlanFromSub.students} students, ${currentPlanFromSub.storage} storage` : 'No subscription data.'}</p>
                  </div>
                  <div>
                    <button onClick={() => setShowUpgradeModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">Upgrade Plan</button>
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
              {!loading && !error && (
                <div className="space-y-4">
                  {subscriptions.length === 0 && <div className="text-sm text-gray-500">No subscriptions found.</div>}
                  {subscriptions.map((s:any) => (
                    <div key={s.subscription_id} className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className={`mt-6 rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h3 className="font-medium mb-1">Billing Questions?</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Contact our billing team for any questions related to your subscription.</p>
                  <a href="mailto:billing@codementorai.com" className={`inline-block mt-2 text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>billing@codementorai.com</a>
                </div>

                <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h3 className="font-medium mb-1">Cancel Subscription</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Need to cancel your subscription? Please contact our support team.</p>
                  <a href="tel:+94324567898" className={`mt-2 inline-block text-sm font-medium ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Request Cancellation - +94324567898</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`max-w-4xl w-full rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
                <button onClick={() => setShowUpgradeModal(false)} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}><XIcon size={20} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                  <div key={plan.id} className={`rounded-lg overflow-hidden ${plan.id === (currentPlanFromSub?.id ?? 'standard') ? 'border-2 border-blue-500' : theme === 'dark' ? 'border border-gray-700' : 'border border-gray-200'}`}>
                    <div className={`p-4 ${plan.id === 'standard' ? 'bg-blue-600 text-white' : ''}`}>
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <p className={`text-sm ${plan.id === 'standard' ? 'text-blue-100' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{plan.description}</p>
                      <div className="mt-2"><span className="text-2xl font-bold">${plan.monthlyPrice}</span><span>/month</span></div>
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1"><span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Instructors:</span><span className="font-medium">{plan.instructors}</span></div>
                        <div className="flex items-center justify-between mb-1"><span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Students:</span><span className="font-medium">{plan.students}</span></div>
                        <div className="flex items-center justify-between"><span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Storage:</span><span className="font-medium">{plan.storage}</span></div>
                      </div>
                      <div className="space-y-2">{plan.features.map((feature, index) => (<div key={index} className="flex items-center">{feature.included ? <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> : <XIcon className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} mr-2 flex-shrink-0`} /> }<span className={`text-sm ${feature.included ? '' : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{feature.name}</span></div>))}</div>
                    </div>
                    <div className="p-4">
                      {plan.id === (currentPlanFromSub?.id ?? 'standard') ? (
                        <div className={`text-center py-2 px-4 rounded-md font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>Current Plan</div>
                      ) : (
                        <button onClick={() => handleUpgrade(plan.id, billingCycle)} className={`w-full py-2 px-4 rounded-md font-medium ${plan.id === 'enterprise' ? 'bg-blue-600 hover:bg-blue-700 text-white' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>{plan.id === 'starter' ? 'Downgrade' : 'Upgrade'}</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center"><p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Need a custom plan? <a href="#" className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>Contact us</a> for enterprise pricing.</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};