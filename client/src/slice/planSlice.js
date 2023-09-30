import { createSlice } from '@reduxjs/toolkit';

import { getCurrentPageData } from '../../utils/getCurrentPageData';
import { extendedApi } from '../payments/paymentAction';
import { planApi } from './planAction';

const initialState = {
 plans: {
  plansList: [],
  currentPagePlans: [],
  partnerPlans: null,
  activePlans: [],
 },
 stripePaymentMethod: {},
 plansFeatures: [],
 stripeBillingHistory: {},
 cancelStripeSubscription: {},
};

const planSlice = createSlice({
 name: 'plan',
 initialState,
 reducers: {},
 extraReducers: (builder) => {
  builder.addMatcher(
   planApi.endpoints.getPlanList.matchFulfilled,
   (state, action) => {
let allPlans = [];
let planData = action?.payload?.plans || [];
if (action?.payload?.partnerCompanyId) {
 state.plans.partnerPlans = planData.result.sort(
  (a, b) => parseInt(a.price) - parseInt(b.price)
 );
}
if (planData && planData.length > 0) {
 allPlans = allPlans.concat(planData);
 const activePlanData = planData.filter((plan) => plan.active);
 state.plans = {
  ...state.plans,
  plansList: allPlans.sort(
   (a, b) => parseInt(a.price) - parseInt(b.price)
  ),
 };
 state.plans.activePlans = activePlanData;
 planData = getCurrentPageData(
  allPlans,
  planData.planCurrentPage || 1,
  5
 );

 state.plans.currentPagePlans = planData;
} else {
 state.plans.currentPagePlans = [];
}
   }
  );

  builder.addMatcher(
   extendedApi.endpoints.updateStripePaymentMethod.matchFulfilled,
   (state, action) => {
const stripePaymentMethod = action.payload?.result;
if (action.payload?.nextBillingDate) {
 const newStripePaymentObj = { ...stripePaymentMethod };
 newStripePaymentObj.nextBillingDate = action.payload?.nextBillingDate;
 state.stripePaymentMethod = newStripePaymentObj;
}
   }
  );
 },
});

export default planSlice.reducer;