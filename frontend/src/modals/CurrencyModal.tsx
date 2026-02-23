import { useMemo, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useAppStore } from '../store/useAppStore'
//Logic that controls the Currency modal
function currencyNameAndCode(currencyText: string): { name: string; code: string | null } {
  
  const m = currencyText.match(/^(.*)\s*\(([A-Z]{3})\)\s*$/)
  if (!m) return { name: currencyText, code: null }
  return { name: m[1].trim(), code: m[2] }
}

export default function CurrencyModal() {
  const open = useAppStore((s) => s.modals.currency)
  const close = useAppStore((s) => s.closeModal)
  const fx = useAppStore((s) => s.fx)
  const country = useAppStore((s) => s.selectedCountry)

  const [usd, setUsd] = useState('1')

  const { name: toName, code: toCode } = useMemo(
    () => (country?.currency ? currencyNameAndCode(country.currency) : { name: '—', code: null }),
    [country?.currency]
  )

  const rate = fx?.rate ?? null
  const usdNum = Number(usd)
  const result = rate && Number.isFinite(usdNum) ? usdNum * rate : null

  return (
    <Modal show={open} onHide={() => close('currency')} centered contentClassName="fg-modal-currency">
      <Modal.Header closeButton>
        <Modal.Title className='text-white'>Currency calculator</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!country ? (
          <div className="text-muted">Select a country first.</div>
        ) : !fx || !rate ? (
          <div className="text-muted">No exchange rate available (check your OpenExchangeRates key).</div>
        ) : (
          <>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>From USD</Form.Label>
                <Form.Control
                  value={usd}
                  onChange={(e) => setUsd(e.target.value)}
                  inputMode="decimal"
                  
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Convert to</Form.Label>
                <Form.Select value={toCode ?? ''} disabled>
                  <option value={toCode ?? ''}>{toName}{toCode ? ` (${toCode})` : ''}</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Result</Form.Label>
                <Form.Control value={result === null ? '' : result.toFixed(2)} readOnly />
                <div className="small text-muted mt-1">Rate: 1 USD = {rate} {toCode ?? ''}</div>
              </Form.Group>
            </Form>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-dark" onClick={() => close('currency')}>
          CLOSE
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
