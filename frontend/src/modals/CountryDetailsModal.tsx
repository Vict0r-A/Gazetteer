import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { useAppStore } from '../store/useAppStore'
//Logic that controls the Country Detals modal
function formatNumber(n: number | null | undefined) {
  if (n === null || n === undefined) return '—'
  return new Intl.NumberFormat().format(n)
}

export default function CountryDetailsModal() {
  const open = useAppStore((s) => s.modals.country)
  const close = useAppStore((s) => s.closeModal)
  const c = useAppStore((s) => s.selectedCountry)

  return (
    <Modal show={open} onHide={() => close('country')} centered size="lg" contentClassName="fg-modal-country">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center text-white gap-2">
          <FontAwesomeIcon icon={faGlobe} />
          Country Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!c ? (
          <div className="text-muted">Select a country first.</div>
        ) : (
          <>
            <div className="d-flex align-items-center gap-3 mb-3">
              {c.flagPng ? (
                <img src={c.flagPng} alt="flag" style={{ width: 56, height: 'auto', border: '1px solid rgba(0,0,0,0.1)' }} />
              ) : null}
              <div className="h4 mb-0">{c.name}</div>
            </div>

            <Table responsive className="mb-0" style={{ tableLayout: 'fixed' }}>
              <tbody>
                <tr>
                  <td className="fw-semibold" style={{ width: 180 }}>ISO2</td>
                  <td>{c.iso2 ?? '—'}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">ISO3</td>
                  <td>{c.iso3 ?? '—'}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Numeric Code</td>
                  <td>{c.numericCode ?? '—'}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Capital</td>
                  <td>{c.capital ?? '—'}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Population</td>
                  <td>{formatNumber(c.population)}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Area (km²)</td>
                  <td>{c.area_km2 ? formatNumber(Math.round(c.area_km2)) : '—'}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Region</td>
                  <td>{c.region ?? '—'}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Subregion</td>
                  <td>{c.subregion ?? '—'}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Currency</td>
                  <td>{c.currency ?? '—'}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Languages</td>
                  <td>{c.languages ? Object.values(c.languages).join(', ') : '—'}</td>
                </tr>
              </tbody>
            </Table>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-primary" onClick={() => close('country')}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
