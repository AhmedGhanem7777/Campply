// src/pages/Dashboard/Locations.tsx
import { useEffect, useMemo, useState } from "react";
import { Plus, MoreVertical, Edit, Trash, Loader2, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import strings from "../lib/strings.ar.json";
import {
  getCountries, getStates, getCities,
  createCountry, updateCountry, deleteCountry,
  createState, updateState, deleteState,
  createCity, updateCity, deleteCity,
  type Country, type State, type City
} from "../Service/api/locations";

type LocType = "country" | "region" | "city";
type LocRow = {
  id?: number;
  name: string;
  type: LocType;
  parentName?: string;
  countryId?: number;
  stateId?: number;
};

export default function LocationsPage() {
  // Raw data
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // Loading/error
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialogs
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Editing / Deleting
  const [editing, setEditing] = useState<LocRow | null>(null);
  const [toDelete, setToDelete] = useState<LocRow | null>(null);

  const countryIdToName = useMemo(() => {
    const map: Record<number, string> = {};
    countries.forEach(c => { map[c.id] = c.name; });
    return map;
  }, [countries]);

  const stateIdToName = useMemo(() => {
    const map: Record<number, string> = {};
    states.forEach(s => { map[s.id] = s.name; });
    return map;
  }, [states]);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cRes, sRes, ciRes] = await Promise.all([getCountries(), getStates(), getCities()]);
      setCountries(cRes.data ?? []);
      setStates(sRes.data ?? []);
      setCities(ciRes.data ?? []);
    } catch {
      setError("فشل جلب البيانات من السيرفر");
      toast.error("فشل جلب البيانات من السيرفر");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const rowsCountries: LocRow[] = useMemo(
    () => (countries ?? []).map(c => ({ id: c.id, name: c.name, type: "country" })), [countries]
  );

  const rowsStates: LocRow[] = useMemo(
    () => (states ?? []).map(s => ({
      id: s.id,
      name: s.name,
      type: "region",
      parentName: s.country ?? (s.countryId ? countryIdToName[s.countryId] : "")
    })), [states, countryIdToName]
  );

  const rowsCities: LocRow[] = useMemo(
    () => (cities ?? []).map(ci => ({
      id: ci.id,
      name: ci.name,
      type: "city",
      parentName: ci.state ?? (ci.stateId ? stateIdToName[ci.stateId] : "")
    })), [cities, stateIdToName]
  );

  const openAdd = (type: LocType) => {
    setEditing({ type, name: "", parentName: "", countryId: undefined, stateId: undefined });
    setDialogOpen(true);
  };

  const openEdit = (row: LocRow) => {
    setEditing(row);
    setDialogOpen(true);
  };

  const askDelete = (row: LocRow) => {
    setToDelete(row);
    setDeleteDialogOpen(true);
  };

  const save = async () => {
    if (!editing?.name) { toast.error("الاسم مطلوب"); return; }
    try {
      setBusy(true);
      if (editing.id) {
        // Update
        if (editing.type === "country") await updateCountry(editing.id, editing.name);
        if (editing.type === "region") await updateState(editing.id, editing.name);
        if (editing.type === "city") await updateCity(editing.id, editing.name);
        toast.success("تم تحديث الموقع بنجاح");
      } else {
        // Create
        if (editing.type === "country") await createCountry(editing.name);
        if (editing.type === "region") {
const pid = (editing.stateId ?? Number((editing as any).parentId)) || 0;
          if (!pid) { toast.error("اختر الدولة"); setBusy(false); return; }
          await createState(editing.name, pid);
        }
        if (editing.type === "city") {
const pid = (editing.stateId ?? Number((editing as any).parentId)) || 0;
          if (!pid) { toast.error("اختر المنطقة"); setBusy(false); return; }
          await createCity(editing.name, pid);
        }
        toast.success("تم إضافة الموقع بنجاح");
      }
      await loadAll();
      setDialogOpen(false);
      setEditing(null);
    } catch {
      toast.error("فشل حفظ الموقع");
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete?.id) return;
    try {
      setBusy(true);
      if (toDelete.type === "country") await deleteCountry(toDelete.id);
      if (toDelete.type === "region") await deleteState(toDelete.id);
      if (toDelete.type === "city") await deleteCity(toDelete.id);
      toast.success("تم حذف الموقع بنجاح");
      await loadAll();
      setDeleteDialogOpen(false);
      setToDelete(null);
    } catch {
      toast.error("فشل حذف الموقع");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{strings.locations.title}</h1>
          <p className="text-muted-foreground mt-2">إدارة التسلسل الهرمي للمواقع الجغرافية</p>
        </div>
        <Button variant="outline" onClick={loadAll} disabled={loading} className="inline-flex items-center gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          تحديث
        </Button>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LocationCard
          title={strings.locations.country}
          items={rowsCountries}
          type="country"
          onAdd={() => openAdd("country")}
          onEdit={openEdit}
          onDelete={askDelete}
          loading={loading}
        />
        <LocationCard
          title={strings.locations.region}
          items={rowsStates}
          type="region"
          onAdd={() => openAdd("region")}
          onEdit={openEdit}
          onDelete={askDelete}
          loading={loading}
        />
        <LocationCard
          title={strings.locations.city}
          items={rowsCities}
          type="city"
          onAdd={() => openAdd("city")}
          onEdit={openEdit}
          onDelete={askDelete}
          loading={loading}
        />
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? strings.locations.editLocation : strings.locations.addLocation}</DialogTitle>
            <DialogDescription>املأ البيانات التالية لإضافة أو تعديل الموقع</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                value={editing?.name || ""}
                onChange={(e) => setEditing(prev => prev ? { ...prev, name: e.target.value } : prev)}
                placeholder="أدخل الاسم"
              />
            </div>

            {!editing?.id && editing?.type === "region" && (
              <div className="grid gap-2">
                <Label>{strings.locations.country}</Label>
                <Select
                  value={String(editing?.countryId || "")}
                  onValueChange={(value) => setEditing(prev => prev ? { ...prev, countryId: Number(value) } : prev)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={strings.locations.selectCountry} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {!editing?.id && editing?.type === "city" && (
              <div className="grid gap-2">
                <Label>{strings.locations.region}</Label>
                <Select
                  value={String(editing?.stateId || "")}
                  onValueChange={(value) => setEditing(prev => prev ? { ...prev, stateId: Number(value) } : prev)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={strings.locations.selectRegion} />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button onClick={save} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {strings.common.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{strings.confirmations.deleteTitle}</DialogTitle>
            <DialogDescription>{strings.confirmations.deleteMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {strings.common.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LocationCard({
  title, items, type, onAdd, onEdit, onDelete, loading
}: {
  title: string;
  items: LocRow[];
  type: LocType;
  onAdd: () => void;
  onEdit: (row: LocRow) => void;
  onDelete: (row: LocRow) => void;
  loading: boolean;
}) {
  const skeletons = new Array(6).fill(0);
  return (
    <Card className="bg-[#1B1D23]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button onClick={onAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          {strings.common.add}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {loading ? (
            skeletons.map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#1B1D23]">
                <div className="w-3/5 h-4 bg-[#22252b] rounded animate-pulse" />
                <div className="w-16 h-4 bg-[#22252b] rounded animate-pulse" />
              </div>
            ))
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">{strings.common.noData}</p>
          ) : (
            items.map(item => (
              <div
                key={`${type}-${item.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-[#1B1D23] hover:bg-[#21252B] transition-colors duration-300"
              >
                <div className="space-y-1">
                  <p className="font-medium">{item.name}</p>
                  {item.type !== "country" && (
                    <p className="text-sm text-muted-foreground">{item.parentName || ""}</p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(item)}>
                      <Edit className="ml-2 h-4 w-4" />
                      {strings.common.edit}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(item)} className="text-destructive">
                      <Trash className="ml-2 h-4 w-4" />
                      {strings.common.delete}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
