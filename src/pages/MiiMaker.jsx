// src/pages/MiiMaker.jsx
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import { Howl } from 'howler';

export default function MiiMaker() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Premium sound effects with positional audio
  const playSound = (sound, options = {}) => {
    const sfx = new Howl({
      src: [`/sounds/${sound}.mp3`],
      volume: options.volume || 0.3,
      rate: options.rate || 1,
      stereo: options.pan || 0,
      onend: options.onEnd
    });
    sfx.play();
  };

  const handleFileChange = useCallback((e) => {
    const f = e.target.files?.[0];
    if (f && f.type.match('image.*')) {
      if (f.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        playSound('error', { pan: -0.5 });
        return;
      }
      
      playSound('click', { volume: 0.4, rate: 1.2 });
      if (preview) URL.revokeObjectURL(preview);
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setGenerated(null);
      setError(null);
    } else {
      setError('Please select a valid image file (JPG, PNG)');
      playSound('error', { pan: 0.5 });
    }
  }, [preview]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove('drag-active');
    
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.match('image.*')) {
      fileInputRef.current.files = e.dataTransfer.files;
      handleFileChange({ target: fileInputRef.current });
    } else {
      setError('Please drop a valid image file');
      playSound('error', { pan: 0 });
    }
  }, [handleFileChange]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.add('drag-active');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove('drag-active');
  };

  const handleGenerate = async () => {
  if (!file) {
    setError('Please select an image first');
    playSound('error', { pan: 0, volume: 0.5 });
    return;
  }

  setLoading(true);
  setProgress(0);
  playSound('startup', { volume: 0.4 });

  const interval = setInterval(() => {
    setProgress(prev => {
      const newVal = prev + Math.random() * 10;
      return newVal > 90 ? 90 : newVal;
    });
  }, 300);

  try {
    const reader = new FileReader();
    reader.onloadend = async () => {
    const base64Image = reader.result.split(',')[1]; // removes "data:image/png;base64,"

      const response = await fetch(
  import.meta.env.PROD
    ? '/api/generate-mii'   // Vercel path
    : 'http://localhost:3001/api/generate-mii', // Local dev path
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image })
  }
);


      const data = await response.json();

      if (data.miiImage) {
        setGenerated(data.miiImage);
        playSound('success', { volume: 0.5, rate: 1.1 });
      } else {
        throw new Error(data.error || 'Unknown error');
      }

      setLoading(false);
      clearInterval(interval);
    };
    reader.readAsDataURL(file);
  } catch (err) {
    setError('Failed to generate Mii. Please try again.');
    setLoading(false);
    clearInterval(interval);
    playSound('error', { volume: 0.6, rate: 0.9 });
  }
};


  const resetForm = () => {
    playSound('back', { pan: -0.3 });
    setFile(null);
    setPreview(null);
    setGenerated(null);
    setError(null);
    fileInputRef.current.value = '';
  };

  const handleSaveMii = () => {
  if (!generated) return;
  
  playSound('click', { volume: 0.4, rate: 1.1 });
  const link = document.createElement('a');
  link.href = `data:image/png;base64,${generated}`;
  link.download = 'my-mii-avatar.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleShareOnX = () => {
  if (!generated) return;
  
  playSound('click', { volume: 0.4, rate: 1.2 });
  const text = "Check out my new Mii avatar! Created with the Mii Avatar Generator";
  const url = `data:image/png;base64,${generated}`;
  
  // Twitter's Web Intent URL
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  
  window.open(twitterUrl, '_blank', 'width=550,height=420');
};

  return (
<div className="wii-menu">
      <div className="wii-content-container">
        <div className="wii-content-box glass-panel">
          <motion.div 
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className="header-section"
          >
            <div className="title-wrapper">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="premium-title"
              >
                Mii Avatar Generator
              </motion.h1>
            </div>
            <p className="wii-subtitle premium-subtitle">
              Transform your photo into a Mii-Avatar
            </p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="wii-error-message premium-error"
              >
                <div className="error-icon">⚠️</div>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="creation-flow">
            {!generated ? (
              <>
                <motion.div 
                  ref={dropZoneRef}
                  className="wii-drop-zone premium-drop-zone"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current.click()}
                  whileHover={{ scale: 1.01 }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden-input"
                  />
                  
                  {preview ? (
                    <div className="preview-container">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="preview-image" 
                      />
                      <div className="preview-overlay">
                        <span>Click to change photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="drop-instructions">
                      <div className="upload-icon-container">
                        <img 
                          src="/upload-premium.png" 
                          alt="Upload" 
                          className="upload-icon" 
                        />
                        <div className="pulse-ring"></div>
                      </div>
                      <p className="drop-title">Drag & Drop Your Photo</p>
                      <p className="small-text">or click to browse files</p>
                      <p className="file-requirements">JPG, PNG (Max 5MB)</p>
                    </div>
                  )}
                </motion.div>

                {loading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="progress-container"
                  >
                    <div className="progress-bar">
                      <motion.div 
                        className="progress-fill"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: 'spring', damping: 10 }}
                      />
                    </div>
                    <div className="progress-text">
                      <span>Creating your Mii...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="loading-spinner">
                      <div className="spinner-circle"></div>
                      <div className="spinner-circle"></div>
                      <div className="spinner-circle"></div>
                    </div>
                  </motion.div>
                )}

                <div className="button-container">
                  {preview && !loading && (
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(90, 176, 255, 0.4)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGenerate}
                      className="wii-button generate-button premium-generate"
                    >
                      <span className="button-icon">✨</span>
                      Generate Mii
                    </motion.button>
                  )}

                  {preview && !loading && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetForm}
                      className="wii-button secondary-button premium-secondary"
                    >
                      Start Over
                    </motion.button>
                  )}
                </div>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="result-container premium-result"
              >
                <div className="result-header">
                  <h2 className="result-title">Your Mii Character</h2>
                  <div className="result-badge">NEW</div>
                </div>
                
                <div className="mii-display">
                  <div className="mii-frame">
                    <img
                      src={`data:image/png;base64,${generated}`}
                      alt="Generated Mii"
                      className="generated-image"
                    />
                    <div className="frame-decoration top"></div>
                    <div className="frame-decoration bottom"></div>
                  </div>
            
                </div>

                <div className="share-section">
                  <h3 className="share-title">Share Your Creation</h3>
                  <div className="share-buttons">
  <motion.button
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={handleSaveMii}
    className="wii-button share-button premium-share"
  >
    <span className="button-icon">💾</span>
    Save Mii
  </motion.button>
  <motion.button
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={handleShareOnX}
    className="wii-button share-button twitter-button premium-twitter"
  >
    <span className="button-icon">𝕏</span>
    Share on X
  </motion.button>
</div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetForm}
                  className="create-another-button"
                >
                  + Create Another Mii
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer premium={true} />
    </div>
  );
}