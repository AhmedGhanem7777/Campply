import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { X, Upload, Star, Trash2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { mockLocations, mockUsers } from "../../lib/mockData";
import strings from "../../lib/strings.ar.json";

const campFormSchema = z.object({
  title: z.string().min(3, "يجب أن يكون العنوان 3 أحرف على الأقل"),
  shortDescription: z.string().min(10, "يجب أن يكون الوصف المختصر 10 أحرف على الأقل"),
  fullDescription: z.string().min(20, "يجب أن يكون الوصف الكامل 20 حرف على الأقل"),
  owner: z.string().min(1, "المالك مطلوب"),
  approvalStatus: z.enum(["pending", "approved", "rejected"]),
  country: z.string().min(1, "الدولة مطلوبة"),
  state: z.string().min(1, "المنطقة مطلوبة"),
  city: z.string().min(1, "المدينة مطلوبة"),
  priceWeekdays: z.number().min(0, "السعر يجب أن يكون 0 أو أكثر"),
  priceHolidays: z.number().min(0, "السعر يجب أن يكون 0 أو أكثر"),
  hasAccommodation: z.boolean(),
  rentalPolicy: z.string().optional(),
  videoUrl: z.string().url("رابط غير صالح").optional().or(z.literal("")),
  facebookUrl: z.string().url("رابط فيسبوك غير صالح").optional().or(z.literal("")),
  instagramUrl: z.string().url("رابط انستجرام غير صالح").optional().or(z.literal("")),
});

type CampFormValues = z.infer<typeof campFormSchema>;

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  dayType: "weekday" | "holiday";
}

interface CampFormProps {
  camp?: any;
  userRole: "admin" | "vendor" | "customer";
  currentUserId?: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const availableServices = [
  "واي فاي",
  "مواقف سيارات",
  "حمامات",
  "مطعم",
  "مسبح",
  "ملعب أطفال",
  "مكان للشواء",
  "كهرباء",
  "مياه",
  "أمن"
];

export function CampForm({ camp, userRole, currentUserId, onSubmit, onCancel }: CampFormProps): JSX.Element {
  const isEditMode = !!camp;
  const [images, setImages] = useState<Array<{ url: string; isCover: boolean; file?: File }>>(
    camp?.images?.map((url: string, idx: number) => ({ url, isCover: idx === 0 })) || []
  );
  const [selectedServices, setSelectedServices] = useState<string[]>(camp?.services || []);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    camp?.timeSlots || [{ id: "1", startTime: "", endTime: "", dayType: "weekday" }]
  );

  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CampFormValues>({
    resolver: zodResolver(campFormSchema),
    defaultValues: {
      title: camp?.title || "",
      shortDescription: camp?.shortDescription || "",
      fullDescription: camp?.fullDescription || "",
      owner: camp?.owner || (userRole === "vendor" ? currentUserId : ""),
      approvalStatus: camp?.approvalStatus || "pending",
      country: camp?.country || "",
      state: camp?.state || "",
      city: camp?.city || "",
      priceWeekdays: camp?.priceWeekdays || 0,
      priceHolidays: camp?.priceHolidays || 0,
      hasAccommodation: camp?.hasAccommodation || false,
      rentalPolicy: camp?.rentalPolicy || "",
      videoUrl: camp?.videoUrl || "",
      facebookUrl: camp?.socialMedia?.facebook || "",
      instagramUrl: camp?.socialMedia?.instagram || "",
    },
  });

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  useEffect(() => {
    const uniqueCountries = [...new Set(mockLocations.filter(l => l.type === "country").map(l => l.name))];
    setCountries(uniqueCountries);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const countryLocation = mockLocations.find(l => l.name === selectedCountry && l.type === "country");
      if (countryLocation) {
        const stateList = mockLocations.filter(l => l.parentId === countryLocation.id && l.type === "state");
        setStates(stateList.map(s => s.name));
      }
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      const stateLocation = mockLocations.find(l => l.name === selectedState && l.type === "state");
      if (stateLocation) {
        const cityList = mockLocations.filter(l => l.parentId === stateLocation.id && l.type === "city");
        setCities(cityList.map(c => c.name));
      }
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
        isCover: images.length === 0,
        file,
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number): void => {
    const newImages = images.filter((_, i) => i !== index);
    if (newImages.length > 0 && images[index]?.isCover) {
      newImages[0].isCover = true;
    }
    setImages(newImages);
  };

  const setCoverImage = (index: number): void => {
    setImages(images.map((img, i) => ({ ...img, isCover: i === index })));
  };

  const toggleService = (service: string): void => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const addTimeSlot = (): void => {
    setTimeSlots(prev => [...prev, { id: Date.now().toString(), startTime: "", endTime: "", dayType: "weekday" }]);
  };

  const removeTimeSlot = (id: string): void => {
    setTimeSlots(prev => prev.filter(slot => slot.id !== id));
  };

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string): void => {
    setTimeSlots(prev => prev.map(slot => (slot.id === id ? { ...slot, [field]: value } : slot)));
  };

  const onFormSubmit = (data: CampFormValues): void => {
    const formData = {
      ...data,
      images: images.map(img => img.url),
      mainCoverImage: images.find(img => img.isCover)?.url || images[0]?.url,
      services: selectedServices,
      timeSlots,
      socialMedia: {
        facebook: data.facebookUrl,
        instagram: data.instagramUrl,
      },
    };
    onSubmit(formData);
  };

  const vendors = mockUsers.filter(u => u.role === "vendor");

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <ScrollArea className="h-[70vh]">
        <div className="space-y-6 p-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">المعلومات الأساسية</h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="title">العنوان *</Label>
              {/* cast register to any for custom Input UI type compatibility */}
              <Input id="title" {...(register("title") as any)} placeholder="أدخل عنوان المخيم" />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">الوصف المختصر *</Label>
              {/* Textarea often doesn't accept register props typings — cast to any */}
              <Textarea
                id="shortDescription"
                {...(register("shortDescription") as any)}
                placeholder="وصف مختصر للمخيم"
                rows={2}
              />
              {errors.shortDescription && (
                <p className="text-sm text-destructive">{errors.shortDescription.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription">الوصف الكامل *</Label>
              <Textarea
                id="fullDescription"
                {...(register("fullDescription") as any)}
                placeholder="وصف تفصيلي للمخيم"
                rows={4}
              />
              {errors.fullDescription && (
                <p className="text-sm text-destructive">{errors.fullDescription.message}</p>
              )}
            </div>

            {userRole === "admin" && (
              <div className="space-y-2">
                <Label htmlFor="owner">المالك *</Label>
                <Select onValueChange={(value: string) => setValue("owner", value)} defaultValue={watch("owner")}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المالك" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map(vendor => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.owner && <p className="text-sm text-destructive">{errors.owner.message}</p>}
              </div>
            )}

            {userRole === "admin" && (
              <div className="space-y-2">
                <Label htmlFor="approvalStatus">حالة الموافقة</Label>
                <Select
                  onValueChange={(value: string) => setValue("approvalStatus", value as any)}
                  defaultValue={watch("approvalStatus")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">قيد المراجعة</SelectItem>
                    <SelectItem value="approved">موافق عليه</SelectItem>
                    <SelectItem value="rejected">مرفوض</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">الموقع</h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="country">الدولة *</Label>
              <Select
                onValueChange={(value: string) => {
                  setValue("country", value);
                  setValue("state", "");
                  setValue("city", "");
                }}
                defaultValue={watch("country")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">المنطقة / الولاية *</Label>
              <Select
                onValueChange={(value: string) => {
                  setValue("state", value);
                  setValue("city", "");
                }}
                defaultValue={watch("state")}
                disabled={!selectedCountry}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنطقة" />
                </SelectTrigger>
                <SelectContent>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">المدينة *</Label>
              <Select onValueChange={(value: string) => setValue("city", value)} defaultValue={watch("city")} disabled={!selectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المدينة" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
            </div>
          </div>

          {/* Pricing & Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">الأسعار والسياسات</h3>
            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceWeekdays">سعر أيام الأسبوع *</Label>
                <Input
                  id="priceWeekdays"
                  type="number"
                  {...(register("priceWeekdays", { valueAsNumber: true }) as any)}
                  placeholder="0"
                />
                {errors.priceWeekdays && <p className="text-sm text-destructive">{errors.priceWeekdays.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceHolidays">سعر أيام العطل *</Label>
                <Input
                  id="priceHolidays"
                  type="number"
                  {...(register("priceHolidays", { valueAsNumber: true }) as any)}
                  placeholder="0"
                />
                {errors.priceHolidays && <p className="text-sm text-destructive">{errors.priceHolidays.message}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="hasAccommodation"
                checked={watch("hasAccommodation")}
                onCheckedChange={(checked: boolean | "indeterminate") => setValue("hasAccommodation", checked === true)}
              />
              <Label htmlFor="hasAccommodation" className="cursor-pointer">
                يوجد إقامة
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rentalPolicy">سياسة التأجير</Label>
              <Textarea id="rentalPolicy" {...(register("rentalPolicy") as any)} placeholder="أدخل سياسة التأجير" rows={3} />
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">الوسائط</h3>
            <Separator />

            <div className="space-y-2">
              <Label>الصور</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">اضغط لرفع الصور</span>
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img src={image.url} alt={`صورة ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverImage(index)}
                          className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${image.isCover ? "bg-primary text-primary-foreground" : "bg-background text-foreground"}`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      </div>
                      {image.isCover && (
                        <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          صورة الغلاف
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">رابط الفيديو (اختياري)</Label>
              <Input id="videoUrl" {...(register("videoUrl") as any)} placeholder="https://youtube.com/..." />
              {errors.videoUrl && <p className="text-sm text-destructive">{errors.videoUrl.message}</p>}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">الخدمات</h3>
            <Separator />

            <div className="grid grid-cols-2 gap-3">
              {availableServices.map(service => (
                <div key={service} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={service}
                    checked={selectedServices.includes(service)}
                    onCheckedChange={() => toggleService(service)}
                  />
                  <Label htmlFor={service} className="cursor-pointer">
                    {service}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">وسائل التواصل الاجتماعي</h3>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="facebookUrl">رابط فيسبوك</Label>
              <Input id="facebookUrl" {...(register("facebookUrl") as any)} placeholder="https://facebook.com/..." />
              {errors.facebookUrl && <p className="text-sm text-destructive">{errors.facebookUrl.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagramUrl">رابط انستجرام</Label>
              <Input id="instagramUrl" {...(register("instagramUrl") as any)} placeholder="https://instagram.com/..." />
              {errors.instagramUrl && <p className="text-sm text-destructive">{errors.instagramUrl.message}</p>}
            </div>
          </div>

          {/* TimeSlots */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">الأوقات المتاحة</h3>
              <Button type="button" variant="outline" size="sm" onClick={addTimeSlot}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة وقت
              </Button>
            </div>
            <Separator />

            <div className="space-y-3">
              {timeSlots.map(slot => (
                <div key={slot.id} className="flex gap-2 items-start">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">وقت البداية</Label>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={e => updateTimeSlot(slot.id, "startTime", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">وقت النهاية</Label>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={e => updateTimeSlot(slot.id, "endTime", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">نوع اليوم</Label>
                      <Select
                        value={slot.dayType}
                        onValueChange={(value: string) => updateTimeSlot(slot.id, "dayType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekday">يوم عادي</SelectItem>
                          <SelectItem value="holiday">يوم عطلة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {timeSlots.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTimeSlot(slot.id)}
                      className="mt-6"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end p-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit">{isEditMode ? "تحديث" : "حفظ"}</Button>
      </div>
    </form>
  );
}
