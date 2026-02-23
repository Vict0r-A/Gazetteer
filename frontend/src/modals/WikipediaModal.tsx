import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useAppStore } from '../store/useAppStore'
//Logic that controls the Wikipedia modal
export default function WikipediaModal() {
  const open = useAppStore((s) => s.modals.wikipedia)
  const close = useAppStore((s) => s.closeModal)
  const c = useAppStore((s) => s.selectedCountry)

  return (
    <Modal show={open} onHide={() => close('wikipedia')} centered contentClassName="fg-modal-wiki">
      <Modal.Header closeButton>
        <Modal.Title className='text-white'>Wikipedia</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!c ? (
          <div className="text-muted">Select a country first.</div>
        ) : !c.wiki ? (
          <div className="text-muted">No Wikipedia summary available (check your GeoNames username).</div>
        ) : (
          <p className="mb-0">{c.wiki}</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        {c?.wikiUrl ? (
          <Button variant="secondary" onClick={() => window.open(c.wikiUrl!, '_blank', 'noreferrer')}>
            Open Article
          </Button>
        ) : null}
        <Button variant="outline-secondary" onClick={() => close('wikipedia')}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
