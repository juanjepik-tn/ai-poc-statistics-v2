export type BillingPlan = {
  name: string;
  price: number;
  currency: string;
  dayLeft: number;
}

export type BillingStatus = "inactive" | "non_payment" | "active" | "freetrial";

export type BillingDTO = {
  billingPlan: BillingPlan;
  activeStatus: boolean;
  status: BillingStatus;
  isCostumerInvoice: boolean;
}