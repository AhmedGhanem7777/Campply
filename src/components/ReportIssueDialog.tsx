import { useState } from 'react';

export default function ReportIssueDialog({ campId, open, onClose }: { campId: string; open: boolean; onClose: () => void; }) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const submit = async () => {
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campId, title, description: details }),
    });
    onClose();
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 space-y-4">
        <h3 className="text-xl font-bold">أبلغ عن مشكلة</h3>
        <input className="w-full border rounded-lg p-3" placeholder="عنوان المشكلة" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className="w-full border rounded-lg p-3" placeholder="وصف المشكلة" value={details} onChange={e => setDetails(e.target.value)} />
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">إلغاء</button>
          <button onClick={submit} className="px-4 py-2 rounded-md bg-destructive text-white">إرسال</button>
        </div>
      </div>
    </div>
  );
}
