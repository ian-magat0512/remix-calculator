import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from 'recharts';

type RevenueData = {
  month: string;
  affiliateRevenue: number;
};

const AffiliateCalculator = () => {
  const [referredCustomers, setReferredCustomers] = useState<number>(0);
  const [avgNewProjects, setAvgNewProjects] = useState<number>(0);
  const [avgExistingProjects, setAvgExistingProjects] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [yearlyIncome, setYearlyIncome] = useState<number>(0);

  const calculateRevenue = async () => {
    setLoading(true);
    try {
      const response = await fetch('/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referredCustomers,
          avgNewProjects,
          avgExistingProjects,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      setRevenueData(data.revenueData);
      if (data.revenueData.length > 0) {
        const lastMonthIncome = data.revenueData[data.revenueData.length - 1].affiliateRevenue;
        setYearlyIncome(lastMonthIncome);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateRevenue();
  }, [referredCustomers, avgNewProjects, avgExistingProjects]);

  
  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Calculate Your Recurring Passive Income</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Controls on the left */}
        <div className="col-span-1 space-y-4">
          <h2 className="text-xl">
            Add in your expected referrals to see how much you could earn as a <span className="font-bold">Sunvoy</span> <span className="font-bold">Affiliate</span> in just 1 year
          </h2>
          <div className="mb-4">
            <label className="block mb-2 text-lg">Referred Customers per Month: {referredCustomers}</label>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={referredCustomers}
              onChange={(e) => setReferredCustomers(Number(e.target.value))}
              className="w-full"
            />
            
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-lg">Average New Projects per Month: {avgNewProjects}</label>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={avgNewProjects}
              onChange={(e) => setAvgNewProjects(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-lg">Average Existing Projects: {avgExistingProjects}</label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={avgExistingProjects}
              onChange={(e) => setAvgExistingProjects(Number(e.target.value))}
              className="w-full"
            />
          </div>
          {loading ? (
            <div className="flex justify-center items-center mb-4">
              <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            </div>
          ) : (
            <div className="mb-4">
              <h2 className="text-xl">
                Your <span className="font-bold">monthly income</span> after 1 year:
              </h2>
              <p className="text-2xl font-semibold">${yearlyIncome.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
            </div>
          )}
        </div>

        <div className="col-span-2">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={revenueData}>
              <CartesianGrid stroke="none" />
              <XAxis
                dataKey="month"
                angle={-30}
                textAnchor="end"
                tick={{ fontSize: 10 }} 
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              <Bar dataKey="affiliateRevenue" fill="#82ca9d">
                <LabelList
                  dataKey="affiliateRevenue"
                  position="top"
                  formatter={(value: number) => `$${Number(value).toFixed(2)}`}
                  content={(props) => {
                    const { x, y, value } = props;
                    return (
                      <text
                        x={x}
                        y={y} 
                        fill="#666"
                        fontSize={10} 
                      >
                        ${Number(value).toFixed(2)}
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AffiliateCalculator;
