import React, { Component } from 'react'

import Table from './Table'

/**
 * This component is responsible for rendering the custom button itself. For instance,
 * we use it to render a table that contains the name of the items that are in the
 * order form.
 */
class CustomButton extends Component<CustomButtonProps, {}> {
  render() {
    const { items } = this.props

    return items ? (
      <div>
        <h2>This is a checkout button</h2>
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

interface CustomButtonState {}

export default CustomButton
