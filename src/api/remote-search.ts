import request from '@/utils/request'

export interface TransactionData {
  order_no: string
  price: number
  status: string
}

export interface TransactionResponse {
  code: number
  data: {
    total: number
    items: TransactionData[]
  }
}

// Mock data for transaction list
const mockTransactions: TransactionData[] = [
  {
    order_no: 'TX-20220001',
    price: 1999.99,
    status: 'success'
  },
  {
    order_no: 'TX-20220002',
    price: 2999.99,
    status: 'pending'
  },
  {
    order_no: 'TX-20220003',
    price: 3999.99,
    status: 'success'
  },
  {
    order_no: 'TX-20220004',
    price: 4999.99,
    status: 'pending'
  },
  {
    order_no: 'TX-20220005',
    price: 5999.99,
    status: 'success'
  },
  {
    order_no: 'TX-20220006',
    price: 6999.99,
    status: 'pending'
  },
  {
    order_no: 'TX-20220007',
    price: 7999.99,
    status: 'success'
  },
  {
    order_no: 'TX-20220008',
    price: 8999.99,
    status: 'pending'
  },
  {
    order_no: 'TX-20220009',
    price: 9999.99,
    status: 'success'
  },
  {
    order_no: 'TX-20220010',
    price: 10999.99,
    status: 'pending'
  }
]

// Mock implementation of transaction list API
export function transactionList(): Promise<TransactionResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 20000,
        data: {
          total: mockTransactions.length,
          items: mockTransactions
        }
      })
    }, 500)
  })
}

// This would be the actual API call if we had a backend
// export function transactionList() {
//   return request({
//     url: '/transaction/list',
//     method: 'get'
//   })
// } 