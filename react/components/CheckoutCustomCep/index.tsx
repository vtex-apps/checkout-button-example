import React, { FC, useEffect } from 'react'
import { ISellers } from '../../typings/sellers'

const CheckoutCustomCep: FC = () => {
  const [postalCode, setPostalCode] = React.useState('')
  const [postalCodeFilled, setPostalCodeFilled] = React.useState(false)
  const [errorModal, setErrorModal] = React.useState(false)
  const [hasEditedAfterFill, setHasEditedAfterFill] = React.useState(false)

  const handleInputCep = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  let value = e.target.value

  value = value.replace(/\D/g, '')

  if (value.length > 5) {
    value = value.replace(/^(\d{5})(\d)/, '$1-$2')
  }

  if (value.length > 9) {
    value = value.slice(0, 9)
  }

  setPostalCode(value)

  if (postalCodeFilled) {
    setPostalCodeFilled(false)
    setHasEditedAfterFill(true)
  }
}

  const resetShippingData = (orderFormId: string | undefined) => {
    if (!orderFormId) {
      console.error('OrderFormId não encontrado.')
      return
    }

    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const body = JSON.stringify({
      clearAddressIfPostalCodeNotFound: true,
    })

    const requestOptions: RequestInit = {
      method: 'POST',
      headers,
      body,
      redirect: 'follow' as RequestRedirect,
    }

    fetch(
      `/api/checkout/pub/orderForm/${orderFormId}/attachments/shippingData`,
      requestOptions
    )
      .then(response => response.json())
      .then(data => console.log('Resposta do servidor:', data))
      .catch(error => console.error('Erro ao atualizar shippingData:', error))
  }

  const updateShippingData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const checkRegionServed = await fetch(
      `/api/checkout/pub/regions?country=BRA&postalCode=${postalCode}`
    )

    if (!checkRegionServed.ok) {
      throw new Error(`HTTP error ${checkRegionServed.status}`)
    }
    const sellersByRegion: ISellers[] = await checkRegionServed.json()
    const hasSellers = sellersByRegion[0].sellers.length > 0
    if (!hasSellers) {
      setErrorModal(true)
      return
    }
    //@ts-ignore
    const orderFormId = window?.vtexjs?.checkout?.orderFormId

    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      selectedAddresses: [
        {
          addressType: 'residential',
          country: 'BRA',
          postalCode: postalCode,
        },
      ],
      clearAddressIfPostalCodeNotFound: true,
      logisticsInfo: [
        {
          itemIndex: 0,
          selectedDeliveryChannel: 'delivery',
          selectedSla: 'ENTREGA CARAPRETA',
        },
      ],
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow' as RequestRedirect,
    }

    await fetch(
      `/api/checkout/pub/orderForm/${orderFormId}/attachments/shippingData`,
      requestOptions
    )
      .then(response => response.text())
      .then(result => {
        //@ts-ignore
        vtexjs.checkout.getOrderForm().done(function(orderForm: any) {})

        window?.localStorage?.setItem('userEnteredZipCode', 'true')

        const bodyElement = document.querySelector('body')
        bodyElement?.classList.remove('zip-code-not-entered')
        setPostalCodeFilled(true)
        setHasEditedAfterFill(false)
      })
      .catch(error => console.error('erro no cep', error))
  }

  const resetPostalCode = () => {
    //@ts-ignore
    resetShippingData(window?.vtexjs?.checkout?.orderFormId)
    window?.localStorage?.setItem('userEnteredZipCode', 'false')
    const bodyElement = document.querySelector('body')
    bodyElement?.classList.add('zip-code-not-entered')
    setPostalCodeFilled(false)
    setPostalCode('')
  }

  useEffect(() => {
    const userEnteredZipCode =
      window?.localStorage?.getItem('userEnteredZipCode') == 'true'

    if (!userEnteredZipCode) {
      //@ts-ignore
      const orderFormId = window?.vtexjs?.checkout?.orderFormId
      resetShippingData(orderFormId)
    }
  }, [])

  return (
    <>
      <div className="custom-cep-container">
        <form className="custom-cep-form" onSubmit={updateShippingData}>
  <label
    htmlFor="custom-ship-postalCode"
    className="custom-cep-label"
  >
    Digite o CEP para finalizar a compra*
  </label>

  <div className="custom-cep-container-input">
    <input
      type="text"
      className="custom-ship-postal-code"
      required
      placeholder="Digite seu CEP"
      value={postalCode}
      onChange={handleInputCep}
    />

    <button
  className="custom-cep-submit"
  type="button"
  onClick={() => {
    if (postalCodeFilled) {
      setPostalCode('')
      setPostalCodeFilled(false)
      setHasEditedAfterFill(true)
      return
    }

    document
      .querySelector('.custom-cep-form')
      ?.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      )
  }}
>
  <span className="custom-cep-span">
    {postalCodeFilled
      ? 'Alterar'
      : hasEditedAfterFill
      ? 'Adicionar'
      : 'Calcular'}
  </span>
</button>
  </div>

  <p className="custom-cep-alert">
    *Preenchimento obrigatório
  </p>

  <a
    className="custom-search-cep"
    href="https://buscacepinter.correios.com.br/app/endereco/index.php?t"
    target="_blank"
    rel="noopener noreferrer"
  >
    Não sei meu CEP
  </a>
</form>
      </div>
      {errorModal && (
        <div className="modal-zip-code-not-error-wrapper">
          <div className="modal-zip-code-not-entered-content">
            <button
              className="btn-close-modal"
              onClick={() => {
                setErrorModal(false)
                setPostalCode('')
              }}
            ></button>
            <h2>Desculpe</h2>
            <p>Ainda não atendemos a sua região</p>
            <button
              className="btn-try-again"
              onClick={() => {
                setErrorModal(false)
                setPostalCode('')
              }}
            >
              Tentar outro CEP
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default CheckoutCustomCep
