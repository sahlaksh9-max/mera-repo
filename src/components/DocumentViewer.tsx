import { useState } from 'react';
import { X, ZoomIn, ZoomOut, Printer, Share2, Download, RotateCw, MoreVertical, Copy } from 'lucide-react';
import { Button } from './ui/button-variants';

interface DocumentViewerProps {
  documentUrl: string;
  documentName: string;
  onClose: () => void;
}

const DocumentViewer = ({ documentUrl, documentName, onClose }: DocumentViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print ${documentName}</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; }
              img { max-width: 100%; height: auto; }
              @media print {
                body { margin: 0; }
                img { max-width: 100%; page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <img src="${documentUrl}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        // For base64 images, convert to blob first
        if (documentUrl && documentUrl.startsWith('data:')) {
          const response = await fetch(documentUrl);
          const blob = await response.blob();
          const file = new File([blob], `${documentName}.png`, { type: blob.type });

          await navigator.share({
            title: documentName,
            text: `Sharing ${documentName}`,
            files: [file]
          });
        } else {
          await navigator.share({
            title: documentName,
            text: `Sharing ${documentName}`,
            url: documentUrl || ''
          });
        }
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback: copy link to clipboard
        handleCopyLink();
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (!documentUrl) {
      alert('No document URL available');
      return;
    }
    
    if (documentUrl.startsWith('data:')) {
      alert('Document is stored locally. Use the download option to save it.');
    } else {
      navigator.clipboard.writeText(documentUrl);
      alert('Link copied to clipboard!');
    }
  };

  const handleCopyImage = async () => {
    try {
      if (!documentUrl) {
        alert('No document URL available');
        return;
      }
      
      if (documentUrl.startsWith('data:')) {
        const response = await fetch(documentUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        alert('Image copied to clipboard!');
      } else {
        await navigator.clipboard.writeText(documentUrl);
        alert('Image link copied to clipboard!');
      }
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Could not copy image. Please try download instead.');
    }
    setShowDownloadMenu(false);
  };

  const handleDownload = () => {
    if (!documentUrl) {
      alert('No document URL available');
      return;
    }
    
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      
      // If it's a base64 image, convert it to blob first
      if (documentUrl.startsWith('data:')) {
        // Extract the image format from the data URL
        const mimeType = documentUrl.substring(documentUrl.indexOf(':') + 1, documentUrl.indexOf(';'));
        const extension = mimeType.split('/')[1] || 'png';
        
        // Convert base64 to blob
        fetch(documentUrl)
          .then(res => res.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            link.download = `${documentName.replace(/[^a-z0-9]/gi, '_')}.${extension}`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            window.URL.revokeObjectURL(url);
            
            // Show success message
            alert(`Image downloaded successfully!`);
            setShowDownloadMenu(false);
          })
          .catch(error => {
            console.error('Download failed:', error);
            alert('Download failed. Please try again.');
          });
      } else {
        // For regular URLs
        link.href = documentUrl;
        link.download = `${documentName.replace(/[^a-z0-9]/gi, '_')}.jpg`;
        link.target = '_blank';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert(`Image download started!`);
        setShowDownloadMenu(false);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try copying the image instead.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black flex flex-col"
      style={{ 
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black'
      }}
      onClick={(e) => {
        onClose();
        setShowDownloadMenu(false);
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Header with controls */}
      <div className="bg-black border-b border-white/10 p-2 sm:p-4" onClick={(e) => e.stopPropagation()}>
        <div className="container-wide flex items-center justify-between gap-2">
          <h3 className="text-white font-semibold text-sm sm:text-lg truncate flex-1 min-w-0">{documentName}</h3>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Zoom Out */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 25}
              className="text-white hover:bg-white/10 h-8 w-8 sm:h-10 sm:w-10 p-0"
              title="Zoom Out"
            >
              <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            {/* Zoom Level */}
            <span className="text-white text-xs sm:text-sm min-w-[40px] sm:min-w-[60px] text-center">
              {zoom}%
            </span>

            {/* Zoom In */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 300}
              className="text-white hover:bg-white/10 h-8 w-8 sm:h-10 sm:w-10 p-0"
              title="Zoom In"
            >
              <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            {/* Mobile: Individual Action Buttons */}
            <div className="sm:hidden flex items-center gap-1">
              {/* Rotate */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRotate}
                className="text-white hover:bg-white/10 h-8 w-8 p-0"
                title="Rotate"
              >
                <RotateCw className="h-3 w-3" />
              </Button>

              {/* Download Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="text-white hover:bg-white/10 h-8 w-8 p-0"
                  title="Download Options"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
                
                {/* Download Dropdown Menu */}
                {showDownloadMenu && (
                  <div 
                    className="absolute right-0 top-full mt-1 bg-black/90 border border-white/20 rounded-lg shadow-lg z-50 min-w-[120px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between p-2 border-b border-white/20">
                      <span className="text-white text-xs font-medium">Options</span>
                      <button
                        onClick={() => setShowDownloadMenu(false)}
                        className="text-white hover:bg-white/10 rounded p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        handleDownload();
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-white hover:bg-white/10 text-xs"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                    <button
                      onClick={handleCopyImage}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-white hover:bg-white/10 text-xs"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </button>
                  </div>
                )}
              </div>

              {/* Print */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="text-white hover:bg-white/10 h-8 w-8 p-0"
                title="Print"
              >
                <Printer className="h-3 w-3" />
              </Button>

              {/* Share */}
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  try {
                    // Share functionality
                    if (navigator.share && navigator.canShare) {
                      await navigator.share({
                        title: documentName,
                        text: `Check out this document: ${documentName}`,
                        url: window.location.href
                      });
                    } else {
                      // Fallback: copy to clipboard
                      await navigator.clipboard.writeText(documentUrl);
                      alert('Document link copied to clipboard!');
                    }
                  } catch (err) {
                    console.error('Share failed:', err);
                    // Fallback for any errors
                    try {
                      await navigator.clipboard.writeText(documentUrl);
                      alert('Document link copied to clipboard!');
                    } catch (clipErr) {
                      alert('Unable to share or copy link');
                    }
                  }
                }}
                className="text-white hover:bg-white/10 h-8 w-8 p-0"
                title="Share"
              >
                <Share2 className="h-3 w-3" />
              </Button>
            </div>

            {/* Desktop: Individual Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Rotate */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRotate}
                className="text-white hover:bg-white/10"
                title="Rotate"
              >
                <RotateCw className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-white/20 mx-2" />

              {/* Download Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="text-white hover:bg-white/10 flex items-center gap-1"
                  title="Download Options"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden lg:inline">Download</span>
                </Button>
                
                {/* Desktop Download Dropdown */}
                {showDownloadMenu && (
                  <div 
                    className="absolute right-0 top-full mt-1 bg-black/90 border border-white/20 rounded-lg shadow-lg z-50 min-w-[160px]"
                    onClick={(e) => e.stopPropagation()}
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between p-3 border-b border-white/20">
                      <span className="text-white text-sm font-medium">Download Options</span>
                      <button
                        onClick={() => setShowDownloadMenu(false)}
                        className="text-white hover:bg-white/10 rounded p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 w-full px-4 py-3 text-left text-white hover:bg-white/10 text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Download Image
                    </button>
                    <button
                      onClick={handleCopyImage}
                      className="flex items-center gap-2 w-full px-4 py-3 text-left text-white hover:bg-white/10 text-sm"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Image
                    </button>
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-white/20 mx-2" />

              {/* Print */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="text-white hover:bg-white/10 flex items-center gap-1"
                title="Print"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden lg:inline">Print</span>
              </Button>

              {/* Share */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-white hover:bg-white/10 flex items-center gap-1"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden lg:inline">Share</span>
              </Button>

              {/* Close */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/10 flex items-center gap-1"
                title="Close"
              >
                <X className="h-4 w-4" />
                <span className="hidden lg:inline">Close</span>
              </Button>
            </div>

            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="sm:hidden text-white hover:bg-white/10 h-8 w-8 p-0"
              title="Close"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
        <div 
          className="relative max-w-full max-h-full flex items-center justify-center"
          style={{ 
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transition: 'transform 0.2s ease'
          }}
          onWheel={(e) => e.stopPropagation()}
        >
          <img 
            src={documentUrl} 
            alt={documentName}
            className="max-w-full max-h-[calc(100vh-140px)] sm:max-h-[calc(100vh-160px)] object-contain"
            onWheel={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Footer with instructions */}
      <div className="bg-black border-t border-white/10 p-2 text-center">
        <p className="text-white/70 text-xs">
          {zoom !== 100 ? `Zoom: ${zoom}% • ` : ''}
          {rotation !== 0 ? `Rotation: ${rotation}° • ` : ''}
          Click outside to close
        </p>
      </div>
    </div>
  );
};

export default DocumentViewer;