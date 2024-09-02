import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.json();
    const referredCustomers = Number(formData.referredCustomers);
    const avgNewProjects = Number(formData.avgNewProjects);
    let avgExistingProjects = Number(formData.avgExistingProjects);

    const churnRate = 0.02;
    const referralPayoutRate = 0.2;
    const newProjectFee = 95;
    const existingProjectFee = 0.25;

    let totalCustomers = 0;
    const revenueData = [];

    const now = new Date();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear(); 

    for (let i = 0; i < 13; i++) {
      totalCustomers += referredCustomers;

      const newProjectsRevenue = avgNewProjects * newProjectFee;
      const existingProjectsRevenue = avgExistingProjects * existingProjectFee;
      const monthlyRevenuePerCustomer = newProjectsRevenue + existingProjectsRevenue;
      const totalMonthlyRevenue = monthlyRevenuePerCustomer * totalCustomers;
      const affiliateRevenue = totalMonthlyRevenue * referralPayoutRate;

      const date = new Date(currentYear, currentMonth + i, 1);
      const monthLabel = date.toLocaleString('default', { month: 'short' });
      const yearLabel = (currentMonth + i >= 12) ? currentYear + Math.floor((currentMonth + i) / 12) : currentYear;
      const formattedMonthLabel = `${monthLabel} ${yearLabel}`;

      revenueData.push({
        month: formattedMonthLabel,
        affiliateRevenue: Number(affiliateRevenue.toFixed(2)),
      });

      totalCustomers *= (1 - churnRate);
      avgExistingProjects += avgNewProjects;
    }

    const totalIncome = revenueData.reduce((sum, data) => sum + data.affiliateRevenue, 0);

    return json({ revenueData, totalIncome: Number(totalIncome.toFixed(2)) });
  } catch (error) {
    console.error("Error processing request:", error);
    return json({ error: "Invalid data" }, { status: 400 });
  }
};
