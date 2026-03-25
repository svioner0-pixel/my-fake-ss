'use client';

import { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleGenerate = async () => {
    if (!image) {
      alert('Önce bir görsel seç!');
      return;
    }

    setLoading(true);
    setStatus('Sistemimizde hazirlaniyor...');
    setResult(null);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt || 'make this image more realistic and detailed');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Hata oldu');

      const blob = await res.blob();
      setResult(URL.createObjectURL(blob));
      setStatus('Tamamlandı!');
    } catch (err) {
      alert('Bir hata oldu: ' + (err as Error).message);
      setStatus('Hata!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <h1 className="text-5xl font-bold text-center mb-10">Sahte SS Oluşturucu</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Görsel yükle</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>

          {preview && (
            <div>
              <p className="text-sm mb-2">Seçtiğin görsel:</p>
              <img src={preview} alt="preview" className="rounded-xl max-h-96 mx-auto border border-zinc-700" />
            </div>
          )}

          <div>
            <label className="block text-sm mb-2">Ekstra talimat (opsiyonel)</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Örn: telefon ekranı yap, daha gerçekçi olsun"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-600"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !image}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 py-5 rounded-2xl font-bold text-xl transition-all"
          >
            {loading ? 'Oluşturuluyor... Lütfen bekle' : 'Oluştur'}
          </button>

          {status && <p className="text-center text-purple-400">{status}</p>}

          {result && (
            <div className="pt-8">
              <h2 className="text-2xl font-semibold mb-4 text-center">Sonuç Görsel</h2>
              <img src={result} alt="result" className="rounded-2xl mx-auto border border-zinc-700 shadow-2xl" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}