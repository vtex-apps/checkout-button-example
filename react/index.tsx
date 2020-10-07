import React, { Component } from 'react'

import CustomButton from './components/CustomButton'

class CheckoutButtonExample extends Component<{}, CheckoutButtonExampleState> {
  /**
   * This component is the one that is referenced in the extension point. To use it
   * as an example, we add an event listener, which updates the state every time the
   * order form changes. This order form is then passed to its children so as to render
   * a table with the items.
   */
  constructor(props: any) {
    super(props)
    this.state = {
      orderForm: null,
    }
  }

  setOrderForm = (_: any, orderForm: OrderForm) => {
    this.setState({ orderForm })
  }

  componentDidMount() {
    $(window).on('orderFormUpdated.vtex', this.setOrderForm)
  }

  componentWillUnmount() {
    $(window).off('orderFormUpdated.vtex', this.setOrderForm)
  }

  render() {
    console.log(window.vtex.i18n.getLocale())

    return <CustomButton {...this.state.orderForm!} />
  }
}

interface CheckoutButtonExampleProps {}

interface CheckoutButtonExampleState {
  orderForm: OrderForm | null
}

export default CheckoutButtonExample
