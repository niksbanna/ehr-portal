import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import Layout from '../components/layout/Layout';
import { formatINR } from '../schemas/fhir.schema';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { Bill } from '../types';

const BillingPage = () => {
  const { data: bills, isLoading } = useQuery({
    queryKey: ['bills'],
    queryFn: () => api.getBills(),
  });

  const generatePDF = (bill: Bill) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('EHR Portal', 20, 20);
    doc.setFontSize(12);
    doc.text('Indian Hospital System', 20, 28);
    
    // Invoice Title
    doc.setFontSize(18);
    doc.text(`Invoice ${bill.id}`, 20, 45);
    
    // Patient Info
    doc.setFontSize(11);
    doc.text(`Patient: ${bill.patientName}`, 20, 55);
    doc.text(`Date: ${bill.date}`, 20, 62);
    doc.text(`Status: ${bill.status.toUpperCase()}`, 20, 69);
    
    // Items Table Header
    let yPos = 85;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 20, yPos);
    doc.text('Qty', 120, yPos);
    doc.text('Unit Price', 140, yPos);
    doc.text('Total', 170, yPos);
    
    // Items
    yPos += 7;
    doc.setFont('helvetica', 'normal');
    bill.items.forEach((item) => {
      doc.text(item.description.substring(0, 40), 20, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(formatINR(item.unitPrice), 140, yPos);
      doc.text(formatINR(item.total), 170, yPos);
      yPos += 7;
    });
    
    // Totals
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', 140, yPos);
    doc.text(formatINR(bill.subtotal), 170, yPos);
    
    yPos += 7;
    doc.text('Tax (18% GST):', 140, yPos);
    doc.text(formatINR(bill.tax), 170, yPos);
    
    if (bill.discount > 0) {
      yPos += 7;
      doc.text('Discount:', 140, yPos);
      doc.text(`-${formatINR(bill.discount)}`, 170, yPos);
    }
    
    yPos += 10;
    doc.setFontSize(12);
    doc.text('TOTAL:', 140, yPos);
    doc.text(formatINR(bill.total), 170, yPos);
    
    // Payment Info
    if (bill.status === 'paid' && bill.paymentMethod) {
      yPos += 15;
      doc.setFontSize(10);
      doc.text(`Payment Method: ${bill.paymentMethod}`, 20, yPos);
      yPos += 7;
      doc.text(`Amount Paid: ${formatINR(bill.paidAmount || 0)}`, 20, yPos);
    }
    
    // Footer
    doc.setFontSize(8);
    doc.text('Thank you for your business!', 20, 280);
    doc.text('For queries, contact: billing@hospital.in', 20, 285);
    
    // Save PDF
    doc.save(`Invoice-${bill.id}.pdf`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Billing</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Patient billing and invoices</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        ) : (
          <div className="grid gap-6">
            {bills?.map((bill) => (
              <div key={bill.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Bill {bill.id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Patient: {bill.patientName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => generatePDF(bill)}
                      className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                      title="Download Invoice PDF"
                    >
                      <Download size={16} />
                      PDF
                    </button>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        bill.status === 'paid'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : bill.status === 'partially-paid'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : bill.status === 'pending'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {bill.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{bill.date}</p>
                </div>

                <div className="border-t border-b dark:border-gray-700 py-4 mb-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-600 dark:text-gray-400">
                        <th className="pb-2">Description</th>
                        <th className="pb-2 text-right">Qty</th>
                        <th className="pb-2 text-right">Unit Price</th>
                        <th className="pb-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                      {bill.items.map((item, index) => (
                        <tr key={index} className="text-sm">
                          <td className="py-2 text-gray-900 dark:text-gray-100">{item.description}</td>
                          <td className="py-2 text-right text-gray-900 dark:text-gray-100">{item.quantity}</td>
                          <td className="py-2 text-right text-gray-900 dark:text-gray-100">{formatINR(item.unitPrice)}</td>
                          <td className="py-2 text-right font-medium text-gray-900 dark:text-gray-100">{formatINR(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{formatINR(bill.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax (18% GST)</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{formatINR(bill.tax)}</span>
                  </div>
                  {bill.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>Discount</span>
                      <span className="font-medium">-{formatINR(bill.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t dark:border-gray-700">
                    <span className="text-gray-900 dark:text-gray-100">Total</span>
                    <span className="text-gray-900 dark:text-gray-100">{formatINR(bill.total)}</span>
                  </div>
                </div>

                {bill.status === 'paid' && bill.paymentMethod && (
                  <div className="mt-4 pt-4 border-t dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{bill.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600 dark:text-gray-400">Amount Paid</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {formatINR(bill.paidAmount || 0)}
                      </span>
                    </div>
                  </div>
                )}

                {bill.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t dark:border-gray-700">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
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
