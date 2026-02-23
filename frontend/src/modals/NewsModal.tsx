import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

import { useAppStore } from '../store/useAppStore'
import { fetchNews } from '../api/endpoints'
//Logic that controls the News modal
export default function NewsModal() {
  const open = useAppStore((s) => s.modals.news)
  const close = useAppStore((s) => s.closeModal)
  const c = useAppStore((s) => s.selectedCountry)
  const news = useAppStore((s) => s.news)
  const setNews = useAppStore((s) => s.setNews)

  const [loadingMore, setLoadingMore] = useState(false)

  const loadMore = async () => {
    if (!c || !news?.next_page) return
    setLoadingMore(true)
    try {
      const next = await fetchNews(c.code, news.next_page, '', 'en', '')
      setNews({ ...next, articles: [...(news.articles ?? []), ...(next.articles ?? [])] })
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <Modal show={open} onHide={() => close('news')} centered size="lg" scrollable contentClassName="fg-modal-news">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2 text-white">
          <FontAwesomeIcon icon={faNewspaper} /> Latest Headlines
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!c ? (
          <div className="text-muted">Select a country first.</div>
        ) : !news ? (
          <div className="text-muted">No news available (check your WorldNews API key).</div>
        ) : news.articles.length === 0 ? (
          <div className="text-muted">No articles found.</div>
        ) : (
          <div className="d-flex flex-column">
            {news.articles.map((a, idx) => (
              <div key={idx} className="py-2 border-bottom">
                <div className="d-flex gap-3">
                  {a.image_url ? (
                    <img src={a.image_url} alt="" style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                  ) : (
                    <div style={{ width: 90, height: 60 }} />
                  )}
                  <div className="flex-grow-1">
                    <div className="fw-semibold">
                      <a href={a.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                        {a.title}
                      </a>
                    </div>
                    <div className="small text-muted">{a.source}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        {news?.next_page ? (
          <Button variant="secondary" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <Spinner size="sm" /> Loading…
              </span>
            ) : (
              'Load more'
            )}
          </Button>
        ) : null}
        <Button variant="outline-secondary" onClick={() => close('news')}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
