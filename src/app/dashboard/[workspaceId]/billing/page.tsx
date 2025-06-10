import { getPaymentInfo } from '@/actions/user'
import { format } from 'date-fns'
import React from 'react'

type PaymentHistoryItem = {
  planType: 'PRO' | 'FREE'
  amount: number
  billingPeriod: string
  createdAt: string
}

type PaymentData = {
  data?: {
    subscription?: {
      plan: 'PRO' | 'FREE'
      payments: PaymentHistoryItem[]
    }
  }
  status: number
}

type Props = {}

const BillingPage = async (props: Props) => {
  const payment: PaymentData = await getPaymentInfo()

  return (
    <div className="flex flex-col gap-8">
      {/* Current Plan Section */}
      <div className="bg-[#1D1D1D] flex flex-col gap-y-6 p-5 rounded-xl">
        <div>
          <h2 className="text-2xl font-semibold">Current Plan</h2>
          <p className="text-[#9D9D9D]">Your current subscription details</p>
        </div>
        <div>
          <h2 className="text-3xl font-bold">
            ${payment?.data?.subscription?.plan === 'PRO' ? '29' : '0'}/month
          </h2>
          <p className="text-[#9D9D9D] text-lg">
            {payment?.data?.subscription?.plan === 'PRO' ? 'Pro Plan' : 'Free Plan'}
          </p>
        </div>
      </div>

      {/* Payment History Section */}
      <div className="bg-[#1D1D1D] flex flex-col gap-y-6 p-5 rounded-xl">
        <div>
          <h2 className="text-2xl font-semibold">Payment History</h2>
          <p className="text-[#9D9D9D]">Your previous transactions</p>
        </div>
        
        <div className="flex flex-col gap-y-4">
          {payment?.data?.subscription?.payments && payment.data.subscription.payments.length > 0 ? (
            payment.data.subscription.payments.map((historyItem: PaymentHistoryItem, index: number) => (
              <div key={index} className="flex items-center justify-between py-4 border-b border-white/10">
                <div>
                  <p className="text-white font-medium">
                    {historyItem.planType} {historyItem.billingPeriod.charAt(0).toUpperCase() + historyItem.billingPeriod.slice(1)}
                  </p>
                  <p className="text-[#9D9D9D] text-sm">
                    {format(new Date(historyItem.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
                <p className="text-white font-medium">${historyItem.amount}</p>
              </div>
            ))
          ) : (
            <p className="text-[#9D9D9D] text-center py-4">No payment history available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BillingPage