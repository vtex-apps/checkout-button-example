import React, { Component } from 'react'
import CustomButton from './components/CustomButton'
import { OrderForm } from './typings/orderForm'

class CheckoutButtonExample extends Component<
  CheckoutButtonExampleProps,
  CheckoutButtonExampleState
> {
  constructor(props: any) {
    super(props)
    this.state = {
      orderForm: null,
    }
  }

  listenOrderFormUpdated = () => {
    $(window).on('orderFormUpdated.vtex', (_: any, orderForm: OrderForm) =>
      this.setState({ orderForm })
    )
  }

  componentDidMount() {
    this.listenOrderFormUpdated()
  }

  render() {
    return <CustomButton {...this.state.orderForm!} />
  }
}

interface CheckoutButtonExampleProps {}

interface CheckoutButtonExampleState {
  orderForm: OrderForm | null
}

export default CheckoutButtonExample
