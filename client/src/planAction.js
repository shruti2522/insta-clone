import { api } from '../apiInterceptor';
import apiRoutes from '../apiRoutesConstants';

api.enhanceEndpoints({ addTagTypes: ['Payments'] });
export const planApi = api.injectEndpoints({
    endpoints: (build) => ({
    getPlanList: build.query({
    query: (data) => {
    return {
    url:
    apiRoutes.PLANS.basePath +
    apiRoutes.PLANS.endpoints.getPlansList.url,
    method: apiRoutes.PLANS.endpoints.getPlansList.method,
    params: data,
    };
    },
    }),

    getPlansByCompanyId: build.query({
    query: (data) => {
    return {
    url:
    apiRoutes.PLANS.basePath +
    apiRoutes.PLANS.endpoints.getPlansList.url,
    method: apiRoutes.PLANS.endpoints.getPlansList.method,
    params: data,
    };
    },
    }),

    getStripeSubscription: build.query({
    query: (params) => {
    return {
    url:
    apiRoutes.STRIPE.basePath +
    apiRoutes.STRIPE.endpoints.stripeSubscription.url,
    method: apiRoutes.STRIPE.endpoints.stripeSubscription.method,
    params: params,
    };
    },
    transformResponse: (res) => {
    return res;
    },
    }),

    getStripeBillingHistory: build.query({
    query: (data) => {
    return {
    url:
    apiRoutes.STRIPE.basePath +
    apiRoutes.STRIPE.endpoints.stripeBillingHistory.url,
    method: apiRoutes.STRIPE.endpoints.stripeBillingHistory.method,
    params: data,
    };
    },
    transformResponse: (res) => {
    return res?.stripeInvoices;
    },
    }),

    changePlan: build.mutation({
    query: (data) => {
    return {
    url:
    apiRoutes.PLANS.basePath + apiRoutes.PLANS.endpoints.changePlan.url,
    method: apiRoutes.PLANS.endpoints.changePlan.method,
    body: data,
    };
    },
    transformResponse: (response, meta, arg) => {
    return response;
    },
    }),

    addStripeCustomer: build.mutation({
    query: (data) => {
    return {
    url:
    apiRoutes.STRIPE.basePath +
    apiRoutes.STRIPE.endpoints.stripeCustomer.url,
    method: apiRoutes.STRIPE.endpoints.stripeCustomer.method,
    body: data,
    };
    },
    transformResponse: (response, meta, arg) => {
    return response?.nextPayment;
    },
    }),
    }),
    });

    export const {
    useLazyGetStripeSubscriptionQuery,
    useLazyGetPlanListQuery,
    useLazyGetPlansByCompanyIdQuery,
    useLazyGetStripeBillingHistoryQuery,
    useGetStripeBillingHistoryQuery,
    useChangePlanMutation,
    useAddStripeCustomerMutation,
    } = planApi;

export const {
endpoints: { getStripeSubscription, getStripeBillingHistory },
} = planApi;