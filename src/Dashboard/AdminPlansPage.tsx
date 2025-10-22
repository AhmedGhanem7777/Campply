import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/dialog-alert";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { toast } from "../components/ui/use-toast";
import { Plus, Pencil, Trash2, Search, Loader2, Star, Eye, EyeOff } from "lucide-react";

interface Plan {
  id: number;
  name: string;
  price: number;
  currency: "OMR" | "SAR" | "AED" | "KWD" | "QAR" | "BHD" | string;
  billingCycle: "شهري" | "سنوي" | string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdOn: string;
}

interface PagedResponse<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

// Toggle يدعم RTL بدون تغيير الهيكل
function ToggleSwitch({
  checked,
  onCheckedChange,
  id,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  id?: string;
}) {
  const isRtl =
    (typeof document !== "undefined" &&
      (document.documentElement.getAttribute("dir") || (document as any).dir)) === "rtl";

  const justify = isRtl
    ? checked
      ? "justify-start"
      : "justify-end"
    : checked
    ? "justify-end"
    : "justify-start";

  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 cursor-pointer select-none">
      <div
        className={[
          "w-10 h-6 rounded-full transition-colors border border-border flex p-0.5",
          justify,
          checked ? "bg-primary/30 border-primary/40" : "bg-secondary",
        ].join(" ")}
      >
        <div className="w-5 h-5 bg-primary rounded-full transition-transform shadow" />
      </div>
      <input
        id={id}
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
      />
    </label>
  );
}

// API client
const api = axios.create({
  baseURL: (import.meta as any)?.env?.VITE_API_BASE_URL || "https://camply.runasp.net",
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

function authHeaders() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [cycleFilter, setCycleFilter] = useState<"الكل" | "شهري" | "سنوي">("الكل");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<Plan>>({
    name: "",
    price: 0,
    currency: "OMR",
    billingCycle: "شهري",
    features: [],
    isPopular: false,
    isActive: true,
  });
  const [featuresText, setFeaturesText] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch plans from API
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const params: any = {
        pageIndex: currentPage,
        pageSize,
      };
      if (debouncedSearch?.trim()) params.search = debouncedSearch.trim();
      if (cycleFilter !== "الكل") params.cycle = cycleFilter;
      if (showActiveOnly) params.active = true;

      const { data } = await api.get<PagedResponse<Plan>>("/api/admin/plans", {
        params,
        headers: { ...authHeaders() },
      });

      const withFeatures = (data?.data || []).map((p: any) => ({ features: [], ...p }));
      setPlans(withFeatures);
      setTotalCount(data?.count || 0);
    } catch (err: any) {
      toast({
        title: "خطأ",
        description: err?.response?.data?.message || "تعذر جلب الباقات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [debouncedSearch, cycleFilter, showActiveOnly, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [cycleFilter, showActiveOnly, pageSize]);

  const openAddModal = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      price: 0,
      currency: "OMR",
      billingCycle: "شهري",
      features: [],
      isPopular: false,
      isActive: true,
    });
    setFeaturesText("");
    setIsFormOpen(true);
  };

  const openEditModal = async (plan: Plan) => {
    try {
      setEditingPlan(plan);
      const { data } = await api.get(`/api/admin/plans/${plan.id}`, {
        headers: { ...authHeaders() },
      });
      const details = data as Plan;
      setFormData({
        id: details.id,
        name: details.name,
        price: details.price,
        currency: details.currency,
        billingCycle: details.billingCycle,
        isPopular: details.isPopular,
        isActive: details.isActive,
      });
      setFeaturesText((details.features || []).join("\n"));
      setIsFormOpen(true);
    } catch (err: any) {
      toast({
        title: "خطأ",
        description: err?.response?.data?.message || "تعذر جلب تفاصيل الباقة",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast({ title: "خطأ", description: "اسم الباقة مطلوب", variant: "destructive" });
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      toast({ title: "خطأ", description: "السعر يجب أن يكون أكبر من صفر", variant: "destructive" });
      return;
    }
    const features = featuresText.split("\n").map((f) => f.trim()).filter(Boolean);
    if (features.length === 0) {
      toast({ title: "خطأ", description: "يجب إدخال ميزة واحدة على الأقل", variant: "destructive" });
      return;
    }

    const dto = {
      name: formData.name!.trim(),
      price: Number(formData.price),
      currency: formData.currency!,
      billingCycle: formData.billingCycle!,
      features,
      isPopular: !!formData.isPopular,
      isActive: formData.isActive ?? true,
    };

    try {
      if (editingPlan) {
        await api.put(`/api/admin/plans/${editingPlan.id}`, dto, { headers: { ...authHeaders() } });
        toast({ title: "تم التعديل", description: "تم تحديث الباقة بنجاح" });
      } else {
        await api.post(`/api/admin/plans`, dto, { headers: { ...authHeaders() } });
        toast({ title: "تمت الإضافة", description: "تم إضافة الباقة بنجاح" });
      }
      setIsFormOpen(false);
      fetchPlans();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "تعذر حفظ الباقة";
      toast({ title: "خطأ", description: msg, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deletingPlan) return;
    try {
      await api.delete(`/api/admin/plans/${deletingPlan.id}`, { headers: { ...authHeaders() } });
      toast({ title: "تم الحذف", description: "تم حذف الباقة بنجاح" });
      setIsDeleteOpen(false);
      setDeletingPlan(null);
      if (plans.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
      else fetchPlans();
    } catch (err: any) {
      toast({
        title: "خطأ",
        description: err?.response?.data?.message || "تعذر حذف الباقة",
        variant: "destructive",
      });
    }
  };

  const togglePopular = async (plan: Plan) => {
    try {
      await api.put(`/api/admin/plans/${plan.id}/set-popular`, null, { headers: { ...authHeaders() } });
      toast({ title: "تم التعيين", description: "تم جعل الباقة شائعة (حصريًا)" });
      fetchPlans();
    } catch (err: any) {
      toast({
        title: "خطأ",
        description: err?.response?.data?.message || "تعذر تعيين الشيوع",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (plan: Plan) => {
    try {
      await api.put(`/api/admin/plans/${plan.id}/toggle-active`, null, { headers: { ...authHeaders() } });
      toast({
        title: plan.isActive ? "تم التعطيل" : "تم التفعيل",
        description: plan.isActive ? "تم تعطيل الباقة" : "تم تفعيل الباقة",
      });
      fetchPlans();
    } catch (err: any) {
      toast({
        title: "خطأ",
        description: err?.response?.data?.message || "تعذر تبديل التفعيل",
        variant: "destructive",
      });
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedPlans = plans;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">باقات الانضمام</h1>
        <p className="text-muted-foreground mt-1">إدارة الباقات والأسعار والمزايا</p>
      </div>

      <Separator />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث بالاسم"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-9"
            />
          </div>

          {/* Cycle filter */}
          <Select value={cycleFilter} onValueChange={(v: any) => setCycleFilter(v)}>
            <SelectTrigger className="w-full sm:w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="الكل">الكل</SelectItem>
              <SelectItem value="شهري">شهري</SelectItem>
              <SelectItem value="سنوي">سنوي</SelectItem>
            </SelectContent>
          </Select>

          {/* Active only toggle */}
          <div className="flex items-center gap-2 bg-card border rounded-md px-3 py-2">
            <ToggleSwitch checked={showActiveOnly} onCheckedChange={setShowActiveOnly} id="only-active" />
            <span className="text-sm font-medium">المفعّلة فقط</span>
          </div>
        </div>

        {/* Add button */}
        <Button onClick={openAddModal} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          إضافة باقة
        </Button>
      </div>

      {/* Plans Grid */}
      {paginatedPlans.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg">لا توجد باقات مطابقة</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPlans.map((plan, idx) => (
            <Card key={plan.id} className="flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex gap-1 flex-wrap">
                    {plan.isPopular && (
                      <Badge variant="default" className="gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        شائعة
                      </Badge>
                    )}
                    <Badge variant={plan.isActive ? "default" : "secondary"}>{plan.isActive ? "مفعّلة" : "معطّلة"}</Badge>
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.currency}</span>
                  <span className="text-sm text-muted-foreground">/ {plan.billingCycle}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {(plan.features || []).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(plan)} className="flex-1 transition-all duration-200 hover:scale-105">
                    <Pencil className="h-4 w-4" />
                    تعديل
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setDeletingPlan(plan);
                      setIsDeleteOpen(true);
                    }}
                    className="flex-1 transition-all duration-200 hover:scale-105"
                  >
                    <Trash2 className="h-4 w-4" />
                    حذف
                  </Button>
                </div>
                <div className="flex gap-2 w-full">
                  <Button variant="secondary" size="sm" onClick={() => togglePopular(plan)} className="flex-1 transition-all duration-200 hover:scale-105">
                    <Star className="h-4 w-4" />
                    {plan.isPopular ? "إزالة الشيوع" : "جعلها شائعة"}
                  </Button>
                  <Button variant="default" size="sm" onClick={() => toggleActive(plan)} className="flex-1 transition-all duration-200 hover:scale-105">
                    {plan.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {plan.isActive ? "تعطيل" : "تفعيل"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">عدد الصفوف:</span>
            <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
              <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="12">12</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">صفحة {currentPage} من {Math.max(1, Math.ceil(totalCount / pageSize))}</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="transition-all duration-200 hover:scale-105 active:scale-95"
            >
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil(totalCount / pageSize)), p + 1))}
              disabled={currentPage === Math.max(1, Math.ceil(totalCount / pageSize))}
              className="transition-all duration-200 hover:scale-105 active:scale-95"
            >
              التالي
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "تعديل باقة" : "إضافة باقة"}</DialogTitle>
            <DialogDescription>{editingPlan ? "قم بتعديل بيانات الباقة أدناه" : "أدخل بيانات الباقة الجديدة"}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم الباقة *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="مثال: الباقة الأساسية" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">السعر *</Label>
                <Input id="price" type="number" min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">العملة *</Label>
                <Select value={formData.currency} onValueChange={(v: any) => setFormData({ ...formData, currency: v })}>
                  <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OMR">OMR</SelectItem>
                    <SelectItem value="SAR">SAR</SelectItem>
                    <SelectItem value="AED">AED</SelectItem>
                    <SelectItem value="KWD">KWD</SelectItem>
                    <SelectItem value="QAR">QAR</SelectItem>
                    <SelectItem value="BHD">BHD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cycle">الدورة *</Label>
              <Select value={formData.billingCycle} onValueChange={(v: any) => setFormData({ ...formData, billingCycle: v })}>
                <SelectTrigger id="cycle"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="شهري">شهري</SelectItem>
                  <SelectItem value="سنوي">سنوي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">المزايا (اكتب كل سطر كميزة) *</Label>
              <Textarea id="features" value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder={"ميزة واحدة\nميزة ثانية\nميزة ثالثة"} rows={6} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="popular">شائعة</Label>
              <ToggleSwitch id="popular" checked={!!formData.isPopular} onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="active">مفعّلة</Label>
              <ToggleSwitch id="active" checked={formData.isActive ?? true} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave}>{editingPlan ? "حفظ التعديلات" : "إضافة"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف الباقة "{deletingPlan?.name}"؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
