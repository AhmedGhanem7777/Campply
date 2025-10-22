// تخزين مفضلة بسيطة في localStorage
const KEY = 'favorites:camps';

export function getFavorites() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  // بث حدث عام لتحديث الواجهة عند الحاجة (اختياري)
  window.dispatchEvent(new Event('favorites-changed'));
}

export function isFavorite(id) {
  const list = getFavorites();
  return list.some(x => String(x.id) === String(id));
}

// campSummary: { id, title, imageUrl?, price?, location? }
export function toggleFavorite(campSummary) {
  const list = getFavorites();
  const idx = list.findIndex(x => String(x.id) === String(campSummary.id));
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(campSummary);
  }
  saveFavorites(list);
  return list;
}
