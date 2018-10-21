const orderList = [
  {
    key: 'OS1',
    value: 'New Order',
    labelUser: 'Order Received',
    labelAdmin: 'New Order'
  },
  {
    key: 'OS2',
    value: 'In transit',
    labelUser: 'Shipped',
    labelAdmin: 'In transit'
  },
  {
    key: 'OS3',
    value: 'Completed',
    labelUser: 'Arrived',
    labelAdmin: 'Completed'
  }
]

const paymentList = [
  {
    key: 'PS1',
    value: 'Invoiced',
    labelUser: 'Invoiced',
    labelAdmin: 'Pending '
  },
  {
    key: 'PS2',
    value: 'Paid',
    labelUser: 'Paid',
    labelAdmin: 'Paid'
  }
]

const initialValue = {
  order: orderList[0].key,
  payment: paymentList[0].key
}

export { orderList, paymentList, initialValue }
