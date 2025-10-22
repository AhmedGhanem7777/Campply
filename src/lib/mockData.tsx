// Mock data for Camply Dashboard

export const mockCamps = [
  {
    id: "1",
    title: "مخيم الصحراء الذهبية",
    shortDescription: "مخيم فاخر في قلب الصحراء مع جميع المرافق الحديثة",
    fullDescription: "مخيم الصحراء الذهبية يوفر تجربة فريدة من نوعها في قلب الصحراء السعودية. يتميز المخيم بمرافق عصرية وخدمات فاخرة تناسب العائلات والمجموعات. استمتع بالأجواء الصحراوية الأصيلة مع وسائل الراحة الحديثة.",
    owner: "أحمد محمد",
    ownerId: "1",
    country: "السعودية",
    state: "الرياض",
    city: "الرياض",
    priceWeekdays: 500,
    priceHolidays: 750,
    approvalStatus: "approved",
    numberOfBookings: 45,
    numberOfServices: 8,
    mainCoverImage: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800",
    images: ["https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800", "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800"],
    videoUrl: "https://example.com/video1.mp4",
    services: [
      "واي فاي عالي السرعة",
      "مطعم فاخر",
      "موقف سيارات واسع",
      "مسبح خارجي",
      "ألعاب أطفال",
      "شواء",
      "حراسة 24 ساعة",
      "تكييف هواء"
    ],
    socialMedia: {
      instagram: "https://instagram.com/golden_desert_camp",
      twitter: "https://twitter.com/golden_desert",
      facebook: "https://facebook.com/goldendesertcamp"
    },
    timeSlots: [
      { day: "السبت - الأربعاء", time: "3:00 م - 12:00 م" },
      { day: "الخميس - الجمعة", time: "2:00 م - 1:00 م" }
    ],
    rating: 4.8,
    reviews: 124,
    capacity: 50
  },
  {
    id: "2",
    title: "مخيم الواحة الخضراء",
    shortDescription: "مخيم عائلي مريح بجانب الشاطئ",
    fullDescription: "يقع مخيم الواحة الخضراء في موقع استراتيجي بجانب الشاطئ، مما يوفر إطلالة بانورامية خلابة. مثالي للعائلات الباحثة عن الهدوء والاسترخاء مع أنشطة مائية متنوعة.",
    owner: "فاطمة علي",
    ownerId: "2",
    country: "السعودية",
    state: "مكة المكرمة",
    city: "جدة",
    priceWeekdays: 350,
    priceHolidays: 500,
    approvalStatus: "approved",
    numberOfBookings: 32,
    numberOfServices: 5,
    mainCoverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
    images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800"],
    videoUrl: null,
    services: [
      "واي فاي مجاني",
      "منطقة شواء",
      "ملاعب أطفال",
      "كراسي شاطئ",
      "مظلات"
    ],
    socialMedia: {
      instagram: "https://instagram.com/green_oasis_camp",
      twitter: null,
      facebook: "https://facebook.com/greenoasiscamp"
    },
    timeSlots: [
      { day: "يومياً", time: "4:00 م - 11:00 ص" }
    ],
    rating: 4.5,
    reviews: 89,
    capacity: 30
  },
  {
    id: "3",
    title: "مخيم الجبال الشاهقة",
    shortDescription: "إطلالة جبلية خلابة مع أجواء باردة",
    fullDescription: "مخيم الجبال الشاهقة يوفر تجربة جبلية فريدة مع إطلالات خلابة على سلسلة جبال السروات. يتميز بأجواء باردة منعشة على مدار العام، مع أنشطة مغامرات متنوعة ورحلات جبلية مثيرة.",
    owner: "عبدالله سعيد",
    ownerId: "3",
    country: "السعودية",
    state: "عسير",
    city: "أبها",
    priceWeekdays: 600,
    priceHolidays: 900,
    approvalStatus: "approved",
    numberOfBookings: 58,
    numberOfServices: 10,
    mainCoverImage: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
    images: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"],
    videoUrl: "https://example.com/video3.mp4",
    services: [
      "واي فاي",
      "مطعم جبلي",
      "مواقد نار",
      "رحلات جبلية منظمة",
      "تلفريك",
      "مسارات مشي",
      "مرصد فلكي",
      "خيام فاخرة",
      "تدفئة مركزية",
      "خدمة الغرف"
    ],
    socialMedia: {
      instagram: "https://instagram.com/mountain_heights_camp",
      twitter: "https://twitter.com/mountain_heights",
      facebook: "https://facebook.com/mountainheightscamp"
    },
    timeSlots: [
      { day: "السبت - الأربعاء", time: "2:00 م - 12:00 م" },
      { day: "الخميس - الجمعة", time: "1:00 م - 1:00 م" }
    ],
    rating: 4.9,
    reviews: 156,
    capacity: 40
  },
  {
    id: "4",
    title: "مخيم النجوم الساطعة",
    shortDescription: "مخيم مثالي لمراقبة النجوم",
    fullDescription: "مخيم النجوم الساطعة يقدم تجربة فلكية فريدة مع سماء صافية ومعدات رصد حديثة. استمتع بليالٍ ساحرة تحت النجوم مع أنشطة ترفيهية متنوعة.",
    owner: "نورة خالد",
    ownerId: "4",
    country: "السعودية",
    state: "مكة المكرمة",
    city: "الطائف",
    priceWeekdays: 450,
    priceHolidays: 650,
    approvalStatus: "pending",
    numberOfBookings: 12,
    numberOfServices: 6,
    mainCoverImage: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800",
    images: ["https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800"],
    videoUrl: "https://example.com/video4.mp4",
    services: [
      "واي فاي",
      "تلسكوب فلكي",
      "جلسات خارجية مريحة",
      "مرشد فلكي",
      "مقهى",
      "موسيقى هادئة"
    ],
    socialMedia: {
      instagram: "https://instagram.com/stars_camp",
      twitter: null,
      facebook: null
    },
    timeSlots: [
      { day: "الخميس - السبت", time: "5:00 م - 2:00 ص" }
    ],
    rating: 4.3,
    reviews: 67,
    capacity: 35
  },
  {
    id: "5",
    title: "مخيم الشلالات",
    shortDescription: "مخيم طبيعي بجوار الشلالات",
    fullDescription: "استمتع بأصوات المياه الهادئة في مخيم فريد بجوار الشلالات الطبيعية.",
    owner: "خالد المطيري",
    ownerId: "1",
    country: "السعودية",
    state: "الباحة",
    city: "الباحة",
    priceWeekdays: 420,
    priceHolidays: 620,
    approvalStatus: "approved",
    numberOfBookings: 38,
    numberOfServices: 7,
    mainCoverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
    images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800"],
    videoUrl: null,
    services: ["واي فاي", "مطعم", "ألعاب أطفال", "شواء"],
    socialMedia: {
      instagram: "https://instagram.com/waterfall_camp",
      twitter: null,
      facebook: "https://facebook.com/waterfallcamp"
    },
    timeSlots: [
      { day: "يومياً", time: "3:00 م - 11:00 م" }
    ],
    rating: 4.6,
    reviews: 92,
    capacity: 42
  },
  {
    id: "6",
    title: "مخيم الكثبان الذهبية",
    shortDescription: "تجربة صحراوية أصيلة",
    fullDescription: "مخيم صحراوي يوفر تجربة بدوية أصيلة مع أنشطة صحراوية مميزة.",
    owner: "سارة الزهراني",
    ownerId: "2",
    country: "السعودية",
    state: "الشرقية",
    city: "الأحساء",
    priceWeekdays: 380,
    priceHolidays: 550,
    approvalStatus: "approved",
    numberOfBookings: 29,
    numberOfServices: 6,
    mainCoverImage: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
    images: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"],
    videoUrl: "https://example.com/video6.mp4",
    services: ["واي فاي", "رحلات سفاري", "شواء", "ألعاب تراثية"],
    socialMedia: {
      instagram: "https://instagram.com/golden_dunes",
      twitter: "https://twitter.com/golden_dunes",
      facebook: null
    },
    timeSlots: [
      { day: "يومياً", time: "4:00 م - 12:00 م" }
    ],
    rating: 4.4,
    reviews: 78,
    capacity: 38
  },
  {
    id: "7",
    title: "مخيم البحيرة الزرقاء",
    shortDescription: "مخيم هادئ على ضفاف البحيرة",
    fullDescription: "مخيم مميز على ضفاف بحيرة طبيعية جميلة مع أنشطة مائية متنوعة.",
    owner: "محمد القحطاني",
    ownerId: "3",
    country: "السعودية",
    state: "القصيم",
    city: "بريدة",
    priceWeekdays: 460,
    priceHolidays: 680,
    approvalStatus: "pending",
    numberOfBookings: 15,
    numberOfServices: 8,
    mainCoverImage: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800",
    images: ["https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800"],
    videoUrl: null,
    services: ["واي فاي", "قوارب", "صيد", "مطعم", "شواء"],
    socialMedia: {
      instagram: null,
      twitter: null,
      facebook: "https://facebook.com/bluelakecamp"
    },
    timeSlots: [
      { day: "يومياً", time: "3:00 م - 10:00 م" }
    ],
    rating: 4.2,
    reviews: 54,
    capacity: 44
  },
  {
    id: "8",
    title: "مخيم التراث الأصيل",
    shortDescription: "مخيم تراثي سعودي أصيل",
    fullDescription: "مخيم يعكس التراث السعودي الأصيل مع جميع التفاصيل التراثية.",
    owner: "عبدالرحمن العنزي",
    ownerId: "4",
    country: "السعودية",
    state: "حائل",
    city: "حائل",
    priceWeekdays: 400,
    priceHolidays: 580,
    approvalStatus: "approved",
    numberOfBookings: 52,
    numberOfServices: 9,
    mainCoverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
    images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800"],
    videoUrl: "https://example.com/video8.mp4",
    services: ["قهوة عربية", "مطعم تراثي", "عروض شعبية", "موسيقى تراثية"],
    socialMedia: {
      instagram: "https://instagram.com/heritage_camp",
      twitter: "https://twitter.com/heritage_camp",
      facebook: "https://facebook.com/heritagecamp"
    },
    timeSlots: [
      { day: "الخميس - الجمعة", time: "4:00 م - 1:00 ص" }
    ],
    rating: 4.7,
    reviews: 103,
    capacity: 48
  },
  {
    id: "9",
    title: "مخيم المغامرات",
    shortDescription: "مخيم للباحثين عن الإثارة",
    fullDescription: "مخيم مخصص لمحبي المغامرات والأنشطة الخارجية المثيرة.",
    owner: "ريم الشهري",
    ownerId: "1",
    country: "السعودية",
    state: "جازان",
    city: "جازان",
    priceWeekdays: 520,
    priceHolidays: 780,
    approvalStatus: "approved",
    numberOfBookings: 41,
    numberOfServices: 11,
    mainCoverImage: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
    images: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"],
    videoUrl: null,
    services: ["تسلق", "رماية", "دراجات جبلية", "رحلات استكشافية", "معدات كاملة"],
    socialMedia: {
      instagram: "https://instagram.com/adventure_camp",
      twitter: null,
      facebook: "https://facebook.com/adventurecamp"
    },
    timeSlots: [
      { day: "يومياً", time: "2:00 م - 11:00 م" }
    ],
    rating: 4.8,
    reviews: 115,
    capacity: 36
  },
  {
    id: "10",
    title: "مخيم الربيع",
    shortDescription: "مخيم محاط بالزهور والطبيعة",
    fullDescription: "مخيم جميل محاط بالحدائق والزهور الطبيعية في موسم الربيع.",
    owner: "ماجد الحربي",
    ownerId: "2",
    country: "السعودية",
    state: "تبوك",
    city: "تبوك",
    priceWeekdays: 390,
    priceHolidays: 560,
    approvalStatus: "approved",
    numberOfBookings: 34,
    numberOfServices: 5,
    mainCoverImage: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800",
    images: ["https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800"],
    videoUrl: null,
    services: ["واي فاي", "حدائق", "شواء", "ألعاب أطفال"],
    socialMedia: {
      instagram: "https://instagram.com/spring_camp",
      twitter: null,
      facebook: null
    },
    timeSlots: [
      { day: "يومياً", time: "3:00 م - 10:00 م" }
    ],
    rating: 4.3,
    reviews: 71,
    capacity: 40
  },
  {
    id: "11",
    title: "مخيم الشواطئ الذهبية",
    shortDescription: "مخيم ساحلي على شاطئ رملي ذهبي",
    fullDescription: "مخيم فاخر على شاطئ رملي ذهبي مع خدمات شاطئية متكاملة.",
    owner: "لطيفة الدوسري",
    ownerId: "3",
    country: "السعودية",
    state: "الشرقية",
    city: "الخبر",
    priceWeekdays: 580,
    priceHolidays: 850,
    approvalStatus: "rejected",
    numberOfBookings: 8,
    numberOfServices: 7,
    mainCoverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
    images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800"],
    videoUrl: null,
    services: ["واي فاي", "مطعم بحري", "ألعاب مائية", "كراسي شاطئ"],
    socialMedia: {
      instagram: null,
      twitter: null,
      facebook: null
    },
    timeSlots: [
      { day: "يومياً", time: "2:00 م - 11:00 م" }
    ],
    rating: 3.9,
    reviews: 43,
    capacity: 35
  },
  {
    id: "12",
    title: "مخيم الواحة الهادئة",
    shortDescription: "مخيم هادئ بعيد عن صخب المدينة",
    fullDescription: "مخيم مثالي للاسترخاء والهدوء في واحة طبيعية جميلة.",
    owner: "يوسف الغامدي",
    ownerId: "4",
    country: "السعودية",
    state: "المدينة المنورة",
    city: "المدينة المنورة",
    priceWeekdays: 440,
    priceHolidays: 650,
    approvalStatus: "approved",
    numberOfBookings: 47,
    numberOfServices: 8,
    mainCoverImage: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
    images: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"],
    videoUrl: "https://example.com/video12.mp4",
    services: ["واي فاي", "مطعم", "مسابح", "جلسات هادئة"],
    socialMedia: {
      instagram: "https://instagram.com/quiet_oasis",
      twitter: "https://twitter.com/quiet_oasis",
      facebook: null
    },
    timeSlots: [
      { day: "يومياً", time: "3:00 م - 11:00 م" }
    ],
    rating: 4.5,
    reviews: 86,
    capacity: 45
  },
  {
    id: "13",
    title: "مخيم السفاري الملكي",
    shortDescription: "مخيم فخم مع رحلات سفاري VIP",
    fullDescription: "تجربة سفاري فاخرة مع خدمات ملكية وأنشطة صحراوية حصرية.",
    owner: "سلطان السبيعي",
    ownerId: "1",
    country: "السعودية",
    state: "الرياض",
    city: "الخرج",
    priceWeekdays: 800,
    priceHolidays: 1200,
    approvalStatus: "approved",
    numberOfBookings: 63,
    numberOfServices: 12,
    mainCoverImage: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800",
    images: ["https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800"],
    videoUrl: "https://example.com/video13.mp4",
    services: ["سفاري VIP", "شيف خاص", "خدمة كاملة", "مرشدين", "سيارات فاخرة"],
    socialMedia: {
      instagram: "https://instagram.com/royal_safari",
      twitter: "https://twitter.com/royal_safari",
      facebook: "https://facebook.com/royalsafari"
    },
    timeSlots: [
      { day: "على مدار الأسبوع", time: "على مدار 24 ساعة" }
    ],
    rating: 4.9,
    reviews: 142,
    capacity: 55
  },
  {
    id: "14",
    title: "مخيم الوديان الخضراء",
    shortDescription: "مخيم في وادٍ أخضر جميل",
    fullDescription: "مخيم طبيعي في واد أخضر مليء بالأشجار والمياه الجارية.",
    owner: "هند الأحمدي",
    ownerId: "2",
    country: "السعودية",
    state: "عسير",
    city: "خميس مشيط",
    priceWeekdays: 410,
    priceHolidays: 600,
    approvalStatus: "approved",
    numberOfBookings: 39,
    numberOfServices: 6,
    mainCoverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
    images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800"],
    videoUrl: null,
    services: ["واي فاي", "شواء", "جولات طبيعية", "مواقف سيارات"],
    socialMedia: {
      instagram: "https://instagram.com/green_valleys",
      twitter: null,
      facebook: "https://facebook.com/greenvalleys"
    },
    timeSlots: [
      { day: "يومياً", time: "3:00 م - 10:00 م" }
    ],
    rating: 4.4,
    reviews: 68,
    capacity: 41
  },
  {
    id: "15",
    title: "مخيم الليالي القمرية",
    shortDescription: "مخيم رومانسي تحت ضوء القمر",
    fullDescription: "مخيم مصمم للأزواج والعائلات مع إضاءة رومانسية وأجواء ساحرة.",
    owner: "طارق البلوي",
    ownerId: "3",
    country: "السعودية",
    state: "الجوف",
    city: "سكاكا",
    priceWeekdays: 490,
    priceHolidays: 720,
    approvalStatus: "pending",
    numberOfBookings: 22,
    numberOfServices: 7,
    mainCoverImage: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
    images: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"],
    videoUrl: null,
    services: ["واي فاي", "مطعم", "إضاءة رومانسية", "موسيقى"],
    socialMedia: {
      instagram: "https://instagram.com/moonlit_nights",
      twitter: null,
      facebook: null
    },
    timeSlots: [
      { day: "الخميس - السبت", time: "5:00 م - 12:00 ص" }
    ],
    rating: 4.6,
    reviews: 57,
    capacity: 32
  },
  {
    id: "16",
    title: "مخيم الضيافة العربية",
    shortDescription: "ضيافة عربية أصيلة مع قهوة وتمر",
    fullDescription: "مخيم تقليدي يقدم ضيافة عربية أصيلة مع قهوة عربية وتمور فاخرة.",
    owner: "عائشة الخالدي",
    ownerId: "4",
    country: "السعودية",
    state: "نجران",
    city: "نجران",
    priceWeekdays: 370,
    priceHolidays: 540,
    approvalStatus: "approved",
    numberOfBookings: 44,
    numberOfServices: 5,
    mainCoverImage: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800",
    images: ["https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800"],
    videoUrl: null,
    services: ["قهوة عربية", "تمور", "مطعم تراثي", "جلسات أرضية"],
    socialMedia: {
      instagram: null,
      twitter: null,
      facebook: "https://facebook.com/arabichospitality"
    },
    timeSlots: [
      { day: "يومياً", time: "4:00 م - 11:00 م" }
    ],
    rating: 4.5,
    reviews: 79,
    capacity: 38
  },
  {
    id: "17",
    title: "مخيم الأطفال السعيدة",
    shortDescription: "مخيم مخصص للعائلات مع أطفال",
    fullDescription: "مخيم آمن وممتع مصمم خصيصاً للعائلات مع أطفال، يحتوي على ألعاب وأنشطة متنوعة.",
    owner: "منى العسيري",
    ownerId: "1",
    country: "السعودية",
    state: "الرياض",
    city: "الدلم",
    priceWeekdays: 430,
    priceHolidays: 630,
    approvalStatus: "approved",
    numberOfBookings: 56,
    numberOfServices: 9,
    mainCoverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
    images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800"],
    videoUrl: "https://example.com/video17.mp4",
    services: ["ألعاب أطفال", "مشرفين", "مطعم", "واي فاي", "مواقف سيارات"],
    socialMedia: {
      instagram: "https://instagram.com/happy_kids_camp",
      twitter: "https://twitter.com/happy_kids",
      facebook: "https://facebook.com/happykidscamp"
    },
    timeSlots: [
      { day: "يومياً", time: "3:00 م - 10:00 م" }
    ],
    rating: 4.7,
    reviews: 98,
    capacity: 50
  },
  {
    id: "18",
    title: "مخيم الفخامة الملكية",
    shortDescription: "تجربة تخييم فاخرة بمستوى فندق 5 نجوم",
    fullDescription: "مخيم فاخر يوفر تجربة فندقية بمستوى 5 نجوم في قلب الطبيعة.",
    owner: "فهد الراشد",
    ownerId: "2",
    country: "السعودية",
    state: "مكة المكرمة",
    city: "مكة المكرمة",
    priceWeekdays: 950,
    priceHolidays: 1400,
    approvalStatus: "approved",
    numberOfBookings: 71,
    numberOfServices: 14,
    mainCoverImage: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
    images: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"],
    videoUrl: "https://example.com/video18.mp4",
    services: ["خدمة غرف", "سبا", "مطعم فاخر", "خيام ملكية", "بتلر خاص", "سيارة مع سائق"],
    socialMedia: {
      instagram: "https://instagram.com/royal_luxury_camp",
      twitter: "https://twitter.com/royal_luxury",
      facebook: "https://facebook.com/royalluxurycamp"
    },
    timeSlots: [
      { day: "على مدار الأسبوع", time: "على مدار 24 ساعة" }
    ],
    rating: 5.0,
    reviews: 187,
    capacity: 60
  },
  {
    id: "19",
    title: "مخيم البساتين",
    shortDescription: "مخيم في بستان فواكه طبيعي",
    fullDescription: "مخيم جميل داخل بستان فواكه طبيعي مع إمكانية قطف الفواكه الموسمية.",
    owner: "غادة السلمي",
    ownerId: "3",
    country: "السعودية",
    state: "القصيم",
    city: "عنيزة",
    priceWeekdays: 360,
    priceHolidays: 520,
    approvalStatus: "approved",
    numberOfBookings: 33,
    numberOfServices: 6,
    mainCoverImage: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800",
    images: ["https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800"],
    videoUrl: null,
    services: ["واي فاي", "قطف فواكه", "شواء", "جلسات عائلية"],
    socialMedia: {
      instagram: "https://instagram.com/orchards_camp",
      twitter: null,
      facebook: "https://facebook.com/orchardscamp"
    },
    timeSlots: [
      { day: "يومياً", time: "3:00 م - 10:00 م" }
    ],
    rating: 4.3,
    reviews: 64,
    capacity: 36
  },
  {
    id: "20",
    title: "مخيم الصخور العجيبة",
    shortDescription: "مخيم بين التكوينات الصخرية الفريدة",
    fullDescription: "مخيم فريد محاط بتكوينات صخرية طبيعية عجيبة ومناظر جيولوجية مذهلة.",
    owner: "راكان العتيبي",
    ownerId: "4",
    country: "السعودية",
    state: "تبوك",
    city: "تيماء",
    priceWeekdays: 470,
    priceHolidays: 690,
    approvalStatus: "approved",
    numberOfBookings: 36,
    numberOfServices: 7,
    mainCoverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
    images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800"],
    videoUrl: "https://example.com/video20.mp4",
    services: ["واي فاي", "جولات جيولوجية", "مطعم", "تصوير فوتوغرافي"],
    socialMedia: {
      instagram: "https://instagram.com/rocks_camp",
      twitter: "https://twitter.com/rocks_camp",
      facebook: null
    },
    timeSlots: [
      { day: "يومياً", time: "3:00 م - 11:00 م" }
    ],
    rating: 4.6,
    reviews: 82,
    capacity: 43
  },
  {
    id: "21",
    title: "مخيم النخيل الباسقة",
    shortDescription: "مخيم في بستان نخيل واسع",
    fullDescription: "مخيم جميل تحيط به أشجار النخيل الباسقة التي توفر ظلاً طبيعياً وأجواء هادئة.",
    owner: "ليلى القرشي",
    ownerId: "1",
    country: "السعودية",
    state: "الشرقية",
    city: "القطيف",
    priceWeekdays: 390,
    priceHolidays: 570,
    approvalStatus: "pending",
    numberOfBookings: 18,
    numberOfServices: 5,
    mainCoverImage: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
    images: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"],
    videoUrl: null,
    services: ["واي فاي", "شواء", "جلسات ظليلة", "قهوة"],
    socialMedia: {
      instagram: null,
      twitter: null,
      facebook: null
    },
    timeSlots: [
      { day: "يومياً", time: "4:00 م - 11:00 م" }
    ],
    rating: 4.2,
    reviews: 48,
    capacity: 34
  },
  {
    id: "22",
    title: "مخيم الفنون والإبداع",
    shortDescription: "مخيم لمحبي الفن والرسم",
    fullDescription: "مخيم فريد يجمع بين التخييم والفن، يستضيف ورش رسم ومعارض فنية.",
    owner: "جواهر المالكي",
    ownerId: "2",
    country: "السعودية",
    state: "الباحة",
    city: "بلجرشي",
    priceWeekdays: 480,
    priceHolidays: 700,
    approvalStatus: "approved",
    numberOfBookings: 28,
    numberOfServices: 8,
    mainCoverImage: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800",
    images: ["https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800"],
    videoUrl: null,
    services: ["واي فاي", "ورش رسم", "معارض فنية", "مطعم", "مواد فنية"],
    socialMedia: {
      instagram: "https://instagram.com/art_camp",
      twitter: "https://twitter.com/art_camp",
      facebook: "https://facebook.com/artcamp"
    },
    timeSlots: [
      { day: "الخميس - السبت", time: "4:00 م - 11:00 م" }
    ],
    rating: 4.5,
    reviews: 73,
    capacity: 40
  },
  {
    id: "23",
    title: "مخيم الرياضات الشتوية",
    shortDescription: "مخيم جبلي للأنشطة الشتوية",
    fullDescription: "مخيم متخصص في الأنشطة والرياضات الشتوية في المرتفعات الجبلية.",
    owner: "نايف الزهراني",
    ownerId: "3",
    country: "السعودية",
    state: "عسير",
    city: "النماص",
    priceWeekdays: 610,
    priceHolidays: 900,
    approvalStatus: "approved",
    numberOfBookings: 42,
    numberOfServices: 10,
    mainCoverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
    images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800"],
    videoUrl: "https://example.com/video23.mp4",
    services: ["معدات تزلج", "تدفئة", "مطعم دافئ", "مدربين", "واي فاي"],
    socialMedia: {
      instagram: "https://instagram.com/winter_sports_camp",
      twitter: "https://twitter.com/winter_sports",
      facebook: null
    },
    timeSlots: [
      { day: "موسم الشتاء فقط", time: "9:00 ص - 6:00 م" }
    ],
    rating: 4.8,
    reviews: 106,
    capacity: 38
  },
  {
    id: "24",
    title: "مخيم البادية الأصيلة",
    shortDescription: "تجربة بدوية تقليدية كاملة",
    fullDescription: "مخيم يعيدك إلى أصالة البادية مع خيام تقليدية وحياة بدوية أصيلة.",
    owner: "ثامر الدوسري",
    ownerId: "4",
    country: "السعودية",
    state: "الحدود الشمالية",
    city: "عرعر",
    priceWeekdays: 340,
    priceHolidays: 500,
    approvalStatus: "approved",
    numberOfBookings: 37,
    numberOfServices: 4,
    mainCoverImage: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
    images: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800"],
    videoUrl: null,
    services: ["خيام تقليدية", "قهوة عربية", "جلسات أرضية", "أطباق شعبية"],
    socialMedia: {
      instagram: null,
      twitter: null,
      facebook: "https://facebook.com/authentic_bedouin"
    },
    timeSlots: [
      { day: "يومياً", time: "4:00 م - 11:00 م" }
    ],
    rating: 4.4,
    reviews: 61,
    capacity: 30
  },
  {
    id: "25",
    title: "مخيم الأمواج الهادئة",
    shortDescription: "مخيم ساحلي بشاطئ خاص",
    fullDescription: "مخيم ساحلي راقي مع شاطئ خاص وأنشطة بحرية متنوعة للعائلات.",
    owner: "بدر الخالدي",
    ownerId: "1",
    country: "السعودية",
    state: "مكة المكرمة",
    city: "رابغ",
    priceWeekdays: 540,
    priceHolidays: 800,
    approvalStatus: "approved",
    numberOfBookings: 49,
    numberOfServices: 9,
    mainCoverImage: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800",
    images: ["https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800"],
    videoUrl: "https://example.com/video25.mp4",
    services: ["واي فاي", "مطعم بحري", "ألعاب مائية", "غوص", "قوارب"],
    socialMedia: {
      instagram: "https://instagram.com/calm_waves_camp",
      twitter: "https://twitter.com/calm_waves",
      facebook: "https://facebook.com/calmwavescamp"
    },
    timeSlots: [
      { day: "يومياً", time: "2:00 م - 11:00 م" }
    ],
    rating: 4.7,
    reviews: 119,
    capacity: 52
  }
];

export const mockBookings = [
  {
    id: "B001",
    campName: "مخيم الصحراء الذهبية",
    customerName: "محمد عبدالرحمن",
    checkIn: "2025-10-15",
    checkOut: "2025-10-18",
    guests: 4,
    totalAmount: 1500,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2025-10-01"
  },
  {
    id: "B002",
    campName: "مخيم الواحة الخضراء",
    customerName: "سارة أحمد",
    checkIn: "2025-10-20",
    checkOut: "2025-10-22",
    guests: 2,
    totalAmount: 700,
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: "2025-10-05"
  },
  {
    id: "B003",
    campName: "مخيم الجبال الشاهقة",
    customerName: "خالد محمود",
    checkIn: "2025-10-10",
    checkOut: "2025-10-12",
    guests: 6,
    totalAmount: 1800,
    status: "completed",
    paymentStatus: "paid",
    createdAt: "2025-09-28"
  },
  {
    id: "B004",
    campName: "مخيم النجوم الساطعة",
    customerName: "ليلى حسن",
    checkIn: "2025-10-25",
    checkOut: "2025-10-27",
    guests: 3,
    totalAmount: 900,
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: "2025-10-06"
  },
  {
    id: "B005",
    campName: "مخيم الصحراء الذهبية",
    customerName: "عمر يوسف",
    checkIn: "2025-11-01",
    checkOut: "2025-11-03",
    guests: 5,
    totalAmount: 1000,
    status: "cancelled",
    paymentStatus: "refunded",
    createdAt: "2025-10-02"
  }
];

export const mockUsers = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966501234567",
    role: "vendor",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2025-10-06"
  },
  {
    id: "2",
    name: "فاطمة علي",
    email: "fatima@example.com",
    phone: "+966502345678",
    role: "vendor",
    status: "active",
    joinDate: "2024-03-20",
    lastActive: "2025-10-05"
  },
  {
    id: "3",
    name: "محمد عبدالرحمن",
    email: "mohammed@example.com",
    phone: "+966503456789",
    role: "customer",
    status: "active",
    joinDate: "2024-06-10",
    lastActive: "2025-10-06"
  },
  {
    id: "4",
    name: "سارة أحمد",
    email: "sara@example.com",
    phone: "+966504567890",
    role: "customer",
    status: "active",
    joinDate: "2024-07-22",
    lastActive: "2025-10-04"
  },
  {
    id: "5",
    name: "عبدالله المدير",
    email: "admin@example.com",
    phone: "+966505678901",
    role: "admin",
    status: "active",
    joinDate: "2023-01-01",
    lastActive: "2025-10-06"
  }
];

export const mockLocations = [
  {
    id: "1",
    type: "country",
    name: "السعودية",
    parentId: null
  },
  {
    id: "2",
    type: "region",
    name: "الرياض",
    parentId: "1"
  },
  {
    id: "3",
    type: "city",
    name: "الرياض",
    parentId: "2"
  },
  {
    id: "4",
    type: "region",
    name: "مكة المكرمة",
    parentId: "1"
  },
  {
    id: "5",
    type: "city",
    name: "جدة",
    parentId: "4"
  },
  {
    id: "6",
    type: "city",
    name: "الطائف",
    parentId: "4"
  },
  {
    id: "7",
    type: "region",
    name: "عسير",
    parentId: "1"
  },
  {
    id: "8",
    type: "city",
    name: "أبها",
    parentId: "7"
  }
];

export const mockNotifications = [
  {
    id: "1",
    type: "newBooking",
    title: "حجز جديد",
    message: "تم استلام حجز جديد لمخيم الصحراء الذهبية",
    time: "منذ 5 دقائق",
    read: false
  },
  {
    id: "2",
    type: "newCamp",
    title: "مخيم جديد",
    message: "تم إضافة مخيم جديد بانتظار الموافقة",
    time: "منذ ساعة",
    read: false
  },
  {
    id: "3",
    type: "bookingApproved",
    title: "تمت الموافقة على الحجز",
    message: "تمت الموافقة على حجز رقم B002",
    time: "منذ ساعتين",
    read: true
  },
  {
    id: "4",
    type: "bookingCancelled",
    title: "إلغاء حجز",
    message: "تم إلغاء حجز رقم B005",
    time: "منذ 3 ساعات",
    read: true
  }
];

export const mockKPIs = [
  {
    title: "إجمالي المخيمات",
    value: "24",
    change: "+12%",
    trend: "up"
  },
  {
    title: "الحجوزات النشطة",
    value: "156",
    change: "+23%",
    trend: "up"
  },
  {
    title: "إجمالي الإيرادات",
    value: "125,000 ريال",
    change: "+18%",
    trend: "up"
  },
  {
    title: "مستخدمين جدد",
    value: "89",
    change: "+8%",
    trend: "up"
  }
];
