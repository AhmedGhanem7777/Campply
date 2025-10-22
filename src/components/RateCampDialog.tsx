import { useState } from 'react';

export default function RateCampDialog({ campId, open, onClose }: { campId: string; open: boolean; onClose: () => void; }) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const submit = async () => {
    await fetch(`/api/camps/${campId}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stars, comment }),
    });
    onClose();
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 space-y-4">
        <h3 className="text-xl font-bold">قيّم المخيم</h3>
        <div className="flex gap-2">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setStars(n)} className={n <= stars ? 'text-yellow-500' : 'text-gray-300'}>★</button>
          ))}
        </div>
        <textarea className="w-full border rounded-lg p-3" placeholder="اكتب تعليقك" value={comment} onChange={e => setComment(e.target.value)} />
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">إلغاء</button>
          <button onClick={submit} className="px-4 py-2 rounded-md bg-primary text-primary-foreground">إرسال</button>
        </div>
      </div>
    </div>
  );
}
