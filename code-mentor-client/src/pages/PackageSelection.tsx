// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, XIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
interface PlanFeature {
  name: string;
  included: boolean;
}
interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  instructors: number;
  students: number;
  storage: string;
  features: PlanFeature[];
}
const plans: Plan[] = [{
  id: 'starter',
  name: 'Starter',
  description: 'Perfect for small departments and pilot programs',
  monthlyPrice: 499,
  yearlyPrice: 5388,
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
  yearlyPrice: 10789,
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
  yearlyPrice: 26989,
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
export const PackageSelection: React.FC = () => {
  const {
    theme
  } = useTheme();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const handleSelectPlan = (planId: string) => {
    // In a real app, you'd save the selected plan to state/context
    console.log(`Selected plan: ${planId}, billing: ${billingCycle}`);
    navigate('/checkout');
  };
  return <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">
          Choose Your Subscription Plan
        </h1>
        <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Select the plan that best fits your university's needs. All plans
          include our core AI-powered coding education platform.
        </p>
        <div className="flex items-center justify-center mt-8">
          <div className={`p-1 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} inline-flex`}>
            <button onClick={() => setBillingCycle('monthly')} className={`py-2 px-4 rounded-full text-sm font-medium ${billingCycle === 'monthly' ? 'bg-blue-600 text-white' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Monthly
            </button>
            <button onClick={() => setBillingCycle('yearly')} className={`py-2 px-4 rounded-full text-sm font-medium ${billingCycle === 'yearly' ? 'bg-blue-600 text-white' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Yearly (Save 10%)
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {plans.map(plan => <div key={plan.id} className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-lg'} transition-all duration-300 hover:shadow-xl hover:scale-105`}>
            <div className={`p-6 ${plan.id === 'standard' ? 'bg-blue-600 text-white' : ''}`}>
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className={`mt-1 text-sm ${plan.id === 'standard' ? 'text-blue-100' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {plan.description}
              </p>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  $
                  {billingCycle === 'monthly' ? plan.monthlyPrice : (plan.yearlyPrice / 12).toFixed(0)}
                </span>
                <span className={plan.id === 'standard' ? 'text-blue-100' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                  /month
                </span>
              </div>
              {billingCycle === 'yearly' && <div className="mt-1 text-sm">
                  <span className={`${plan.id === 'standard' ? 'text-blue-100' : 'text-green-500'}`}>
                    Billed annually (${plan.yearlyPrice}/year)
                  </span>
                </div>}
            </div>
            <div className="p-6 border-t border-b border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <div className="flex items-center">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Instructors:
                  </span>
                  <span className="ml-auto font-medium">
                    {plan.instructors}
                  </span>
                </div>
                <div className="flex items-center mt-2">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Students:
                  </span>
                  <span className="ml-auto font-medium">{plan.students}</span>
                </div>
                <div className="flex items-center mt-2">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Storage:
                  </span>
                  <span className="ml-auto font-medium">{plan.storage}</span>
                </div>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => <li key={index} className="flex items-start">
                    {feature.included ? <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> : <XIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} mr-2 flex-shrink-0`} />}
                    <span className={feature.included ? '' : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                      {feature.name}
                    </span>
                  </li>)}
              </ul>
            </div>
            <div className="p-6">
              <button onClick={() => handleSelectPlan(plan.id)} className={`w-full py-3 px-4 rounded-md font-medium transition duration-300 ${plan.id === 'standard' ? 'bg-blue-600 text-white hover:bg-blue-700' : theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                Select Plan
              </button>
            </div>
          </div>)}
      </div>
    </div>;
};