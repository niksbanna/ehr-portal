import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import Layout from '../components/layout/Layout';
import { format } from 'date-fns';

const BillingPage = () => {
  const { data: bills, isLoading } = useQuery({
    queryKey: ['bills'],
    queryFn: () => api.getBills(),
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600 mt-1">Patient billing and invoices</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <div className="grid gap-6">
            {bills?.map((bill) => (
              <div key={bill.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Bill {bill.id}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Patient: {bill.patientName}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      bill.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : bill.status === 'partially-paid'
                        ? 'bg-yellow-100 text-yellow-800'
                        : bill.status === 'pending'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {bill.status}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{format(new Date(bill.date), 'PPp')}</p>
                </div>

                <div className="border-t border-b py-4 mb-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-600">
                        <th className="pb-2">Description</th>
                        <th className="pb-2 text-right">Qty</th>
                        <th className="pb-2 text-right">Unit Price</th>
                        <th className="pb-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {bill.items.map((item, index) => (
                        <tr key={index} className="text-sm">
                          <td className="py-2">{item.description}</td>
                          <td className="py-2 text-right">{item.quantity}</td>
                          <td className="py-2 text-right">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                          <td className="py-2 text-right font-medium">₹{item.total.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{bill.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (18% GST)</span>
                    <span className="font-medium">₹{bill.tax.toLocaleString('en-IN')}</span>
                  </div>
                  {bill.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-₹{bill.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>₹{bill.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {bill.status === 'paid' && bill.paymentMethod && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium">{bill.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Amount Paid</span>
                      <span className="font-medium text-green-600">
                        ₹{bill.paidAmount?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}

                {bill.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                      Process Payment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BillingPage;
