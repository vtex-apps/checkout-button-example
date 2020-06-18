import React, { Component } from 'react'

import { OrderFormItem } from '../typings/orderForm'

class Table extends Component<TableProps> {
  constructor(props: any) {
    super(props)
  }
  render() {
    const { items } = this.props
    return (
      <div>
        {items.map(item => (
          <p>{item.name}</p>
        ))}
      </div>
    )
  }
}

interface TableProps {
  items: OrderFormItem[]
}

export default Table
