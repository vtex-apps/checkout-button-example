import React, { Component } from 'react'

import Table from './Table'

import { OrderFormItem } from '../typings/orderForm'

class CustomButton extends Component<CustomButtonProps> {
  constructor(props: any) {
    super(props)
  }
  render() {
    const { items } = this.props

    return items ? (
      <div>
        <Table items={items} />
      </div>
    ) : (
      <div>Loading...</div>
    )
  }
}

interface CustomButtonProps {
  items: OrderFormItem[]
}

export default CustomButton
