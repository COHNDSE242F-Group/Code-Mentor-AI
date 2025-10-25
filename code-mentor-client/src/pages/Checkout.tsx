
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCardIcon, BuildingIcon, TagIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Checkout: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'paypal' | 'bank-transfer'>('credit-card');
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [subscription, setSubscription] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);

  // Billing form state
  const [contactName, setContactName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState(localStorage.getItem('country') || 'United States');
  const [vatNumber, setVatNumber] = useState('');

  // Payment (demo tokenization)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpMonth, setCardExpMonth] = useState('');
  const [cardExpYear, setCardExpYear] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string,string>>({});

  // subscriptionId passed via navigation state or query param
  const subscriptionIdFromState = (location && (location as any).state && (location as any).state.subscriptionId) || null;
  const urlParams = new URLSearchParams(window.location.search);
  const subscriptionIdFromQuery = urlParams.get('subscriptionId');
  const subscriptionId = subscriptionIdFromState || subscriptionIdFromQuery;

  const handleApplyCoupon = () => {
    if (couponCode.trim() !== '') setIsCouponApplied(true);
  };

  useEffect(() => {
    if (!subscriptionId) {
      setFetchError('No subscription selected. Please choose a plan first.');
      return;
    }
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    setLoading(true);
    setFetchError(null);
    fetch(`${apiUrl}/packages/subscription/${subscriptionId}`).then(async res => {
      if (!res.ok) throw new Error(`Failed to load subscription: ${res.status}`);
      const data = await res.json();
      setSubscription(data);
      setPlan(data.plan || null);
    }).catch(err => {
      console.error(err);
      setFetchError(err.message || String(err));
    }).finally(() => setLoading(false));
  }, [subscriptionId]);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    if (!subscriptionId) {
      setFetchError('No subscription to confirm.');
      return;
    }

    // Basic validation
    const errors: Record<string,string> = {};
    if (!contactName.trim()) errors.contactName = 'Contact name is required';
    if (!billingEmail.trim() || !validateEmail(billingEmail)) errors.billingEmail = 'Valid billing email is required';
    if (!addressLine1.trim()) errors.addressLine1 = 'Address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!postalCode.trim()) errors.postalCode = 'Postal/Zip code is required';
    if (!country) errors.country = 'Country is required';

    if (paymentMethod === 'credit-card') {
      const digits = (cardNumber || '').replace(/\D/g, '');
      if (digits.length < 12) errors.cardNumber = 'Enter a valid card number';
      const month = Number(cardExpMonth);
      const year = Number(cardExpYear);
      if (!month || month < 1 || month > 12) errors.cardExpMonth = 'Invalid month';
      if (!year || year < 22) errors.cardExpYear = 'Invalid year';
      if (!cardCvc || !(cardCvc.length === 3 || cardCvc.length === 4)) errors.cardCvc = 'Invalid CVC';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Build payload: simulate tokenization for demo
    const digits = (cardNumber || '').replace(/\D/g, '');
    const last4 = digits.slice(-4);
    const fakeToken = cardNumber ? `fake_tok_${last4}_${Date.now()}` : '';

    const body: any = {};
    body.billing_profile = {
      contact_name: contactName,
      contact_email: billingEmail,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state_province: stateProvince,
      postal_code: postalCode,
      country,
      vat_number: vatNumber
    };
    if (paymentMethod === 'credit-card') {
      body.payment_method = {
        provider: 'fake',
        provider_payment_method_id: fakeToken,
        type: 'card',
        card_brand: cardNumber && cardNumber.trim().startsWith('4') ? 'visa' : undefined,
        card_last4: last4,
        card_exp_month: Number(cardExpMonth) || undefined,
        card_exp_year: Number(cardExpYear) || undefined,
        is_default: true
      };
    } else {
      body.payment_method = {
        provider: paymentMethod,
        provider_payment_method_id: `manual_${Date.now()}`,
        type: paymentMethod
      };
    }

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/packages/subscription/${subscriptionId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.message || `Confirm failed: ${res.status}`);
      }
      const payload = await res.json().catch(() => ({}));
      // store selected country for convenience
      try { localStorage.setItem('country', country); } catch (e) {}
      // pass subscription and plan info to confirmation page
      navigate('/confirmation', { state: { subscription: payload, plan, university_name: localStorage.getItem('university_name') } });
    } catch (err: any) {
      setFetchError(err.message || String(err));
    } finally {
      setSubmitting(false);
    }
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
                    <input type="text" defaultValue={localStorage.getItem('university_name') || ''} className={`pl-10 block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="e.g. Stanford University" />
                  </div>
                </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Billing Contact Name
                    </label>
                    <input value={contactName} onChange={e => setContactName(e.target.value)} type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="e.g. John Doe" />
                    {formErrors.contactName && <p className="mt-1 text-sm text-red-600">{formErrors.contactName}</p>}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Billing Email
                    </label>
                    <input value={billingEmail} onChange={e => setBillingEmail(e.target.value)} type="email" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="e.g. billing@stanford.edu" />
                    {formErrors.billingEmail && <p className="mt-1 text-sm text-red-600">{formErrors.billingEmail}</p>}
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Billing Address
                  </label>
                  <input value={addressLine1} onChange={e => setAddressLine1(e.target.value)} type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="Street address" />
                  {formErrors.addressLine1 && <p className="mt-1 text-sm text-red-600">{formErrors.addressLine1}</p>}
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      City
                    </label>
                    <input value={city} onChange={e => setCity(e.target.value)} type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} />
                    {formErrors.city && <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      State/Province
                    </label>
                    <input value={stateProvince} onChange={e => setStateProvince(e.target.value)} type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Zip/Postal Code
                    </label>
                    <input value={postalCode} onChange={e => setPostalCode(e.target.value)} type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} />
                    {formErrors.postalCode && <p className="mt-1 text-sm text-red-600">{formErrors.postalCode}</p>}
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Country
                  </label>
                  <select value={country} onChange={e => setCountry(e.target.value)} className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>India</option>
                    <option>France</option>
                    <option>Spain</option>
                    <option>Italy</option>
                    <option>Netherlands</option>
                    <option>Brazil</option>
                    <option>Mexico</option>
                    <option>Japan</option>
                    <option>China</option>
                    <option>South Korea</option>
                    <option>SriLanka</option>
                    <option>New Zealand</option>
                    <option>Singapore</option>
                    <option>Other</option>
                  </select>
                  {formErrors.country && <p className="mt-1 text-sm text-red-600">{formErrors.country}</p>}
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
                          <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="•••• •••• •••• ••••" />
                          {formErrors.cardNumber && <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              Expiration Month
                            </label>
                            <input value={cardExpMonth} onChange={e => setCardExpMonth(e.target.value)} type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="MM" />
                            {formErrors.cardExpMonth && <p className="mt-1 text-sm text-red-600">{formErrors.cardExpMonth}</p>}
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              Expiration Year
                            </label>
                            <input value={cardExpYear} onChange={e => setCardExpYear(e.target.value)} type="text" className={`block w-full rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="YYYY" />
                            {formErrors.cardExpYear && <p className="mt-1 text-sm text-red-600">{formErrors.cardExpYear}</p>}
                          </div>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            CVC
                          </label>
                          <input value={cardCvc} onChange={e => setCardCvc(e.target.value)} type="text" className={`block w-32 rounded-md py-2 px-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} focus:ring-blue-500 focus:border-blue-500`} placeholder="CVC" />
                          {formErrors.cardCvc && <p className="mt-1 text-sm text-red-600">{formErrors.cardCvc}</p>}
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
                <button type="submit" disabled={loading || submitting || !!fetchError} className={`w-full ${loading || submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-3 px-4 rounded-md transition duration-300`}>
                  {submitting ? 'Confirming…' : 'Subscribe Now'}
                </button>
                {fetchError && <div className="mt-2 text-sm text-red-600">{fetchError}</div>}
              </div>
            </form>
          </div>
        </div>
        <div>
          <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className={`p-4 rounded-md mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              {loading && <div>Loading subscription…</div>}
              {fetchError && <div className="text-sm text-red-600">{fetchError}</div>}
              {!loading && !fetchError && plan && subscription && <>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{plan.name} Plan</span>
                  <span>${(subscription.billing_cycle === 'yearly' ? plan.yearly_price : plan.monthly_price)}{subscription.billing_cycle === 'monthly' ? '/mo' : '/yr'}</span>
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex justify-between mb-1">
                    <span>Instructors</span>
                    <span>{plan.instructors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Students</span>
                    <span>{plan.students}</span>
                  </div>
                </div>
              </>}
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
                <span>${plan ? Number(subscription && subscription.billing_cycle === 'yearly' ? plan.yearly_price : plan.monthly_price).toFixed(2) : '0.00'}</span>
              </div>
              {isCouponApplied && <div className="flex justify-between mb-2 text-green-500">
                  <span>Discount (10%)</span>
                  <span>-${plan ? (Number(subscription && subscription.billing_cycle === 'yearly' ? plan.yearly_price : plan.monthly_price) * 0.1).toFixed(2) : '0.00'}</span>
                </div>}
              <div className="flex justify-between mb-2">
                <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tax
                </span>
                <span>${plan ? ((Number(subscription && subscription.billing_cycle === 'yearly' ? plan.yearly_price : plan.monthly_price) * (isCouponApplied ? 0.9 : 1)) * 0.08).toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total</span>
                <span>
                  ${plan ? ((Number(subscription && subscription.billing_cycle === 'yearly' ? plan.yearly_price : plan.monthly_price) * (isCouponApplied ? 0.9 : 1) * 1.08)).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {subscription && subscription.billing_cycle === 'monthly' ? 'Billed monthly' : 'Billed annually'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};