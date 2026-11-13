import { useRef, useState } from 'react';
import { analyzeFood } from '../../services/scannerService.js';
import { useNutrition } from '../../context/NutritionContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../ui/Button.jsx';

const STATES = { empty: 'empty', preview: 'preview', scanning: 'scanning', result: 'result' };

export default function FoodScanner() {
  const [stage, setStage] = useState(STATES.empty);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);
  const { logMeal } = useNutrition();
  const { success, error } = useToast();

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      error('Please upload an image file.');
      return;
    }
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setResult(null);
    setStage(STATES.preview);
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  }

  async function handleScan() {
    setStage(STATES.scanning);
    try {
      const data = await analyzeFood(imageFile);
      setResult(data);
      setStage(STATES.result);
    } catch {
      error('Scan failed. Please try again.');
      setStage(STATES.preview);
    }
  }

  function handleAdd() {
    if (!result) return;
    logMeal({
      name: result.name,
      type: 'snack',
      time: new Date().toTimeString().slice(0, 5),
      kcal: result.kcal,
      p: result.p,
      c: result.c,
      f: result.f,
    });
    success(`${result.name} added to today's log!`);
    setStage(STATES.empty);
    setImageUrl(null);
    setImageFile(null);
    setResult(null);
  }

  function handleReset() {
    setStage(STATES.empty);
    setImageUrl(null);
    setImageFile(null);
    setResult(null);
  }

  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      {/* Drop zone / preview */}
      <div
        className={`scan-stage ${imageUrl ? 'has-image' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => stage === STATES.empty && fileRef.current?.click()}
        style={{ cursor: stage === STATES.empty ? 'pointer' : 'default' }}
        role={stage === STATES.empty ? 'button' : 'img'}
        aria-label={imageUrl ? 'Food image preview' : 'Click or drag to upload food image'}
      >
        {imageUrl && (
          <>
            <img src={imageUrl} alt="Food to scan" />
            <div className="scan-stage__overlay" />
          </>
        )}

        {stage === STATES.scanning && (
          <>
            <div className="scan-line" aria-hidden="true" />
            <div className="scan-corner tl" aria-hidden="true" />
            <div className="scan-corner tr" aria-hidden="true" />
            <div className="scan-corner bl" aria-hidden="true" />
            <div className="scan-corner br" aria-hidden="true" />
            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff', padding: '1rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Analysing food…</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>AI is reading the image</div>
            </div>
          </>
        )}

        {stage === STATES.empty && (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📷</div>
            <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>Upload a food photo</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Click or drag & drop · JPG, PNG, WEBP</div>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label="Upload food image"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {stage === STATES.empty && (
          <Button onClick={() => fileRef.current?.click()} block>📷 Choose Image</Button>
        )}
        {stage === STATES.preview && (
          <>
            <Button onClick={handleScan} style={{ flex: 1 }}>🔍 Scan Food</Button>
            <Button variant="ghost" onClick={handleReset}>✕ Clear</Button>
          </>
        )}
        {stage === STATES.scanning && (
          <Button disabled block loading>Scanning…</Button>
        )}
        {stage === STATES.result && result && (
          <>
            <Button onClick={handleAdd} style={{ flex: 1 }}>+ Add to Today</Button>
            <Button variant="ghost" onClick={handleReset}>Scan Another</Button>
          </>
        )}
      </div>

      {/* Result panel */}
      {stage === STATES.result && result && (
        <div className="card card--glow" style={{ animation: 'popIn 0.4s ease' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {result.label}
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{result.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginBottom: '1rem' }}>
            Confidence: {Math.round(result.confidence * 100)}%
          </div>
          <div className="macro-pills">
            {[
              { label: 'kcal', value: result.kcal, color: 'var(--accent)' },
              { label: 'Protein', value: `${result.p}g`, color: 'var(--accent-2)' },
              { label: 'Carbs', value: `${result.c}g`, color: 'var(--accent-3)' },
              { label: 'Fat', value: `${result.f}g`, color: 'var(--warn)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="macro-pill" style={{ borderColor: color + '55' }}>
                <strong style={{ color }}>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
