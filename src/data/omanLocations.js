export const omanGovernorates = [
  { id: 'muscat', name: 'مسقط' },
  { id: 'dhofar', name: 'ظفار' },
  { id: 'musandam', name: 'مسندم' },
  { id: 'buraimi', name: 'البريمي' },
  { id: 'dakhiliyah', name: 'الداخلية' },
  { id: 'north_batinah', name: 'شمال الباطنة' },
  { id: 'south_batinah', name: 'جنوب الباطنة' },
  { id: 'south_sharqiyah', name: 'جنوب الشرقية' },
  { id: 'north_sharqiyah', name: 'شمال الشرقية' },
  { id: 'dhahirah', name: 'الظاهرة' },
  { id: 'wusta', name: 'الوسطى' },
];

const wilayats = {
  muscat: ['مسقط', 'مطرح', 'بوشر', 'السيب', 'العامرات', 'قريات'],
  dhofar: ['صلالة', 'طاقة', 'مرباط', 'سدح', 'شليم وجزر الحلانيات', 'مقشن', 'ثمريت', 'المزيونة', 'رخيوت', 'ضلكوت'],
  musandam: ['خصب', 'بخا', 'دبا', 'مدحاء'],
  buraimi: ['البريمي', 'محضة', 'السنينة'],
  dakhiliyah: ['نزوى', 'بهلاء', 'منح', 'الحمراء', 'أدم', 'إزكي', 'سمائل', 'بدبد'],
  north_batinah: ['صحار', 'شناص', 'لوى', 'صحم', 'الخابورة', 'السويق'],
  south_batinah: ['الرستاق', 'العوابي', 'نخل', 'وادي المعاول', 'بركاء', 'المصنعة'],
  south_sharqiyah: ['صور', 'الكامل والوافي', 'جعلان بني بو حسن', 'جعلان بني بو علي', 'مصيرة'],
  north_sharqiyah: ['إبراء', 'المضيبي', 'بدية', 'القابل', 'وادي بني خالد', 'دماء والطائيين'],
  dhahirah: ['عبري', 'ينقل', 'ضنك'],
  wusta: ['هيما', 'محوت', 'الدقم', 'الجازر'],
};

export const getWilayats = (governorateId) => {
  return wilayats[governorateId] || [];
};