import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';

export default function PhotoUpload({ onPhotoSelect }) {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                onPhotoSelect(file); // Pass the raw file (blob) back
            };
            reader.readAsDataURL(file);
        }
    };

    const clearPhoto = () => {
        setPreview(null);
        onPhotoSelect(null);
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label className="input-label">Foto (Opzionale)</label>

            {!preview ? (
                <label className="btn btn-secondary" style={{ width: '100%', border: '2px dashed var(--color-border)', justifyContent: 'center' }}>
                    <Camera size={20} />
                    <span>Scatta/Carica Foto</span>
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </label>
            ) : (
                <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
                    <button
                        type="button"
                        onClick={clearPhoto}
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
