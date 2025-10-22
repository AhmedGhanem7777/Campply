// src/Service/api/basket.ts
import { api } from "../../lib/api";

export type BasketItemDto = {
  productId: string;
  productName: string;
  pictureUrl?: string;
  unitPrice: number;
  currency: string; 
  nights: number;
  units: number;
  lineSubtotal: number;
  lineTotal: number;
};

export type CustomerBasketDto = {
  id: string;
  buyerId: string;
  items: BasketItemDto[];
  subTotal: number;
  grandTotal: number;
  currency: string;
};

function getBasketId() {
  const uid = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  if (uid) return uid;
  let gid = localStorage.getItem("guestBasketId");
  if (!gid) {
    gid = crypto.randomUUID();
    localStorage.setItem("guestBasketId", gid);
  }
  return gid;
}

// جلب السلة (وفق تعريفاتك الحالية: id بالـ query وليس path)
export async function getBasket(): Promise<CustomerBasketDto | null> {
  const id = getBasketId();
  try {
    const { data } = await api.get(`/api/Basket`, { params: { id } });
    return data ?? null;
  } catch (err: any) {
    if (err?.response?.status === 404) return null;
    throw err;
  }
}

export async function getOrCreateBasket(currency = "USD"): Promise<CustomerBasketDto> {
  const existing = await getBasket();
  if (existing && existing.id) return existing;

  const id = getBasketId();
  const basket: CustomerBasketDto = {
    id,
    buyerId: id,
    items: [],
    subTotal: 0,
    grandTotal: 0,
    currency,
  };
  const { data } = await api.post(`/api/Basket`, basket);
  return data as CustomerBasketDto;
}

// تحديث (upsert) السلة كاملة عبر POST
export async function updateBasket(basket: CustomerBasketDto): Promise<CustomerBasketDto> {
  const { data } = await api.post(`/api/Basket`, basket);
  return data;
}

export async function deleteBasket(): Promise<void> {
  const id = getBasketId();
  await api.delete(`/api/Basket`, { params: { id } });
}

export async function addItemToBasket(input: {
  campId: number;
  title: string;
  pictureUrl?: string;
  price: number;
  currency?: string;
  nights?: number;
  units?: number;
}): Promise<CustomerBasketDto> {
  const currency = input.currency ?? "USD";
  const nights = Math.max(1, input.nights ?? 1);
  const units = Math.max(1, input.units ?? 1);
  const current = await getOrCreateBasket(currency);

  if (current.items.length > 0 && current.currency !== currency) {
    throw new Error("لا يمكن خلط عملات مختلفة داخل نفس السلة.");
  }

  const idx = current.items.findIndex(
    it => it.productId === String(input.campId) && it.unitPrice === input.price && it.nights === nights
  );

  if (idx >= 0) {
    const prev = current.items[idx];
    const nextUnits = prev.units + units;
    const nextSubtotal = input.price * nights * nextUnits;
    current.items[idx] = {
      ...prev,
      units: nextUnits,
      lineSubtotal: nextSubtotal,
      lineTotal: nextSubtotal,
    };
  } else {
    const lineSubtotal = input.price * nights * units;
    current.items.push({
      productId: String(input.campId),
      productName: input.title,
      pictureUrl: input.pictureUrl,
      unitPrice: input.price,
      currency,
      nights,
      units,
      lineSubtotal,
      lineTotal: lineSubtotal,
    });
  }

  current.subTotal = current.items.reduce((s, x) => s + x.lineSubtotal, 0);
  current.grandTotal = current.subTotal;

  return updateBasket(current);
}
