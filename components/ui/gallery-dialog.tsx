export default function GalleryDialog ({ isOpen, onClose, children } : { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay container mx-auto px-4 py-4" onClick={onClose}>
      <div className="dialog-content w-full h-full relative overflow-hidden" onClick={(e) => e.stopPropagation()} > 
        {/* onClick={(e) => e.stopPropagation()} remove to make auto close if the div is clicked */}
        {children}
        <button className="dialog-close-button" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};