import './spinner.css';

/**
 * A reusable, aesthetic loading spinner.
 * @param {Object} props
 * @param {boolean} props.fullPage - If true, displays the spinner as a full-screen overlay.
 * @param {string} props.size - Optional size override ('sm', 'md', 'lg').
 * @param {string} props.message - Optional message to display below the spinner.
 */
export function Spinner({ fullPage = false, size = 'md', message = '' }) {
  const content = (
    <div className={`spinner-container ${size} ${!fullPage ? 'inline' : ''}`} role="status">
      <div className="modern-spinner" />
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="spinner-overlay" aria-label="Cargando...">
        {content}
      </div>
    );
  }

  return content;
}
