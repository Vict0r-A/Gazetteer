import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudSun } from '@fortawesome/free-solid-svg-icons'
import { useAppStore } from '../store/useAppStore'
//Logic that controls the Weather modal
function fmtDay(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' })
  } catch {
    return dateStr
  }
}

export default function WeatherModal() {
  const open = useAppStore((s) => s.modals.weather)
  const close = useAppStore((s) => s.closeModal)
  const w = useAppStore((s) => s.weather)
  const f = useAppStore((s) => s.forecast)
  const c = useAppStore((s) => s.selectedCountry)

  const nextDays = (f?.forecast ?? []).slice(0, 3)

  return (
    <Modal show={open} onHide={() => close('weather')} centered size="lg" contentClassName="fg-modal-weather">
      <Modal.Header closeButton>
        <Modal.Title className="text-white d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faCloudSun} /> Weather
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!c ? (
          <div className="text-muted">Select a country first.</div>
        ) : !w ? (
          <div className="text-muted">No weather available (check your OpenWeather key).</div>
        ) : (
          <>
            <div className="border rounded p-3 mb-3">
              <div className="text-muted">Today</div>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="h5 mb-1">{w.desc ?? '—'}</div>
                  <div className="text-muted small">Updated just now</div>
                </div>
                <div className="display-6 fw-semibold">{Math.round(w.temp)}°C</div>
              </div>
            </div>

            {nextDays.length ? (
              <div className="row g-3">
                {nextDays.map((d) => (
                  <div className="col-12 col-md-4" key={d.date}>
                    <div className="border rounded p-3 text-center h-100">
                      <div className="fw-semibold">{fmtDay(d.date)}</div>
                      <div className="my-1">
                        <div className="h5 mb-0">{Math.round(d.max)}°C</div>
                        <div className="text-muted">{Math.round(d.min)}°C</div>
                      </div>
                      {d.icon ? <div style={{ fontSize: 22 }}>{d.icon}</div> : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-danger" onClick={() => close('weather')}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
