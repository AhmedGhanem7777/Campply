import React from "react";
import AllCamps from "./AllCamps";

export default function AllCampsPage() {
  return (
    <div dir="rtl">
      <section className="bg-muted/40 border-b">
        <div className="container py-8">
          <h1 className="text-2xl md:text-3xl font-bold">جميع المخيمات</h1>
          <p className="text-sm text-muted-foreground mt-2">
            استكشف جميع المخيمات المتاحة وفلتر النتائج بحسب الموقع والسعر والتقييم والمبيت.
          </p>
        </div>
      </section>

      <AllCamps />
    </div>
  );
}
