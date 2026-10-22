import React from 'react';

export const AuroraBackground: React.FC = () => {
  return (
    <div className="aurora-canvas-bg" aria-hidden="true">
      {/* 5 drifting pastel organic aurora blobs */}
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-blob aurora-blob-4" />
      <div className="aurora-blob aurora-blob-5" />
    </div>
  );
};

export default AuroraBackground;
