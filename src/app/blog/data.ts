export type BlogVisual = {
  src: string;
  alt: string;
  caption?: string;
  layout?: "full" | "half" | "third";
};

export type BlogSection = {
  title: string;
  content: string[];
  listItems?: string[];
  visuals?: BlogVisual[];
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  readingTime: string;
  author: string;
  date: string;
  image: string;
  excerpt: string;
  introduction: string;
  sections: BlogSection[];
  conclusion: string;
};

export const BLOG_CATEGORIES = [
  "All",
  "Umrah Tips",
  "Packing",
  "Health",
  "Visa & Documents",
  "Spiritual",
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "travel-documentation-visa-essentials",
    title: "Travel Documentation and Visa Essentials for Pilgrims",
    category: "Visa & Documents",
    readingTime: "6 min read",
    author: "Marefat Team",
    date: "April 17, 2026",
    image:
      "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-11.jpeg",
    excerpt:
      "A clear, practical guide to passports, visas, insurance, and the documents that make Umrah and Ziyarat travel smooth from day one.",
    introduction:
      "Most travel stress is not caused by flights. It is caused by small document issues that were missed early. A calm pilgrimage starts with a clean paperwork system. When your passport, visa, and supporting files are ready, your focus stays on worship, not airport counters.",
    sections: [
      {
        title: "Start with a document system, not a pile of papers",
        content: [
          "Keep your originals in one travel folder and your backups in a second location. Save digital copies in a secure cloud folder that you can access offline.",
          "This simple setup prevents panic if a paper is lost or your phone battery dies.",
        ],
        listItems: [
          "Passport with at least 6 months of validity",
          "Printed visa approval and digital copy",
          "Flight itinerary and hotel confirmations",
          "Emergency contacts and travel insurance details",
        ],
        visuals: [
          {
            src: "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-12.jpeg",
            alt: "Travel documents neatly organized on a desk",
            caption:
              "A simple folder structure saves time at every checkpoint.",
            layout: "full",
          },
        ],
      },
      {
        title: "Know destination rules before you book",
        content: [
          "Visa rules can change, especially around busy seasons. Always verify requirements using official sources or your licensed travel partner before final payment.",
          "Saudi pilgrimage travel and Iraq ziyarat travel each have their own processes, and nationality can change what is required.",
        ],
        listItems: [
          "Check entry rules for your passport nationality",
          "Confirm vaccination or health-entry requirements",
          "Verify whether you need visa-on-arrival or pre-approval",
          "Keep return ticket details easy to present",
        ],
      },
      {
        title: "Final pre-departure checklist",
        content: [
          "Review your documents 48 hours before departure. Do not wait until airport day. If anything is missing, you still have time to correct it.",
        ],
        listItems: [
          "Printed and digital copies match exactly",
          "Passport name matches all bookings",
          "Insurance is active for full travel dates",
          "Family contact has your itinerary",
        ],
      },
    ],
    conclusion:
      "Documentation may feel administrative, but it is part of travel discipline. Do it well once, and the rest of your journey becomes lighter, calmer, and more focused.",
  },
  {
    slug: "makkah-holy-sites-refined-guide",
    title: "Makkah Holy Sites: A Grounded Guide for a Meaningful Visit",
    category: "Spiritual",
    readingTime: "7 min read",
    author: "Marefat Team",
    date: "April 16, 2026",
    image:
      "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-1.jpeg",
    excerpt:
      "A spiritually focused and practical walk-through of the major holy sites in and around Makkah, including adab and reflection points.",
    introduction:
      "Makkah is not only a destination on a map. It is a place that reorders your attention. The best visits combine correct logistics, respectful conduct, and quiet reflection at each sacred site.",
    sections: [
      {
        title: "Masjid al-Haram and the Kaaba",
        content: [
          "For many pilgrims, this is the emotional center of the journey. Slow your pace as you enter, keep your voice low, and stay aware of others in crowded spaces.",
          "During tawaf, consistency matters more than speed. A steady rhythm helps you stay present and avoid unnecessary fatigue.",
        ],
        visuals: [
          {
            src: "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-2.jpeg",
            alt: "Pilgrims around the Kaaba in Masjid al-Haram",
            caption:
              "Moving steadily helps preserve both focus and energy in tawaf.",
            layout: "full",
          },
          {
            src: "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-3.jpeg",
            alt: "View of Masjid al-Haram courtyard",
            caption: "Arrive early when possible to avoid peak crowd pressure.",
            layout: "half",
          },
          {
            src: "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-4.jpeg",
            alt: "Night view of the Kaaba and surrounding mosque",
            caption: "Night hours often provide a calmer atmosphere for prayer.",
            layout: "half",
          },
        ],
      },
      {
        title: "Safa, Marwah, and Maqam Ibrahim",
        content: [
          "Sa'i teaches disciplined effort. You walk, pause, and continue with intention. Keep hydration close and avoid carrying unnecessary items.",
          "At Maqam Ibrahim and nearby prayer areas, be mindful of flow and avoid blocking pathways.",
        ],
      },
      {
        title: "Mina, Arafat, and Muzdalifah",
        content: [
          "These stations ask for patience, planning, and endurance. The spiritual value is deep, but so is the physical demand.",
        ],
        listItems: [
          "Sleep and hydration are part of ibadah preparation",
          "Use a small day bag with only essentials",
          "Agree on meeting points with your group in advance",
        ],
      },
    ],
    conclusion:
      "A meaningful visit to Makkah is built on adab, awareness, and balance. Move gently, plan wisely, and let each site deepen your intention.",
  },
  {
    slug: "madinah-holy-sites-ahlulbayt-guide",
    title: "Madinah Holy Sites: Visiting with Adab and Presence",
    category: "Spiritual",
    readingTime: "6 min read",
    author: "Marefat Team",
    date: "April 15, 2026",
    image: "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-4.jpeg",
    excerpt:
      "A practical and reflective guide to Al-Masjid an-Nabawi, Quba, Qiblatayn, and Jannat al-Baqi for pilgrims seeking a calmer Madinah experience.",
    introduction:
      "Madinah has a different rhythm. It invites stillness. Most pilgrims benefit from slowing down their schedule, reducing noise, and giving each location enough time for sincere prayer and reflection.",
    sections: [
      {
        title: "Al-Masjid an-Nabawi",
        content: [
          "Plan your visits around less crowded windows when possible. Keep expectations realistic for movement and waiting times.",
          "Use short, heartfelt duas and stay attentive to local guidelines and crowd management instructions.",
        ],
        visuals: [
          {
            src: "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-5.jpeg",
            alt: "Courtyard umbrellas at Al-Masjid an-Nabawi",
            caption:
              "A slower schedule in Madinah often leads to deeper focus.",
            layout: "full",
          },
        ],
      },
      {
        title: "Quba, Qiblatayn, and the historic mosque corridor",
        content: [
          "These visits are easier when grouped in one well-planned route. Leave buffer time for traffic and prayer pauses.",
        ],
        listItems: [
          "Carry water and light snacks",
          "Wear comfortable footwear for repeated walking",
          "Keep your group communication simple and consistent",
        ],
      },
      {
        title: "Jannat al-Baqi",
        content: [
          "This is a place for humility, not spectacle. Keep your visit quiet and intentional. A brief, sincere salam is often more meaningful than a long hurried stay.",
        ],
      },
    ],
    conclusion:
      "In Madinah, less urgency often creates more depth. A respectful pace, clear intention, and practical planning can transform the entire visit.",
  },
  {
    slug: "iraq-holy-cities-ziyarat-guide",
    title: "Iraq Holy Cities: A Practical Ziyarat Guide with Spiritual Depth",
    category: "Spiritual",
    readingTime: "7 min read",
    author: "Marefat Team",
    date: "April 14, 2026",
    image:
      "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-9.jpeg",
    excerpt:
      "How to prepare for Najaf, Karbala, Kadhimayn, and Samarra with better logistics, stronger adab, and a more meaningful ziyarat routine.",
    introduction:
      "Ziyarat in Iraq can be deeply moving, but it also requires practical preparation. Distances, crowds, and weather can be demanding. Good planning protects your energy so your attention remains on worship.",
    sections: [
      {
        title: "Najaf and Karbala",
        content: [
          "These cities are often the emotional center of the trip. Build your day around prayer windows and rest intervals rather than trying to fit everything into one stretch.",
        ],
        listItems: [
          "Set clear meeting points with your group",
          "Keep valuables minimal and secure",
          "Use a lightweight day bag for shrine visits",
        ],
        visuals: [
          {
            src: "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-10.jpeg",
            alt: "Pilgrims visiting a shrine courtyard in Iraq",
            caption:
              "A light day plan leaves space for reflection and worship.",
            layout: "full",
          },
        ],
      },
      {
        title: "Kadhimayn and Samarra",
        content: [
          "Travel logistics matter more here because of timing and road conditions. Keep your documents and local contact details accessible throughout the day.",
          "If your group schedule is tight, prioritize quality over quantity in each visit.",
        ],
      },
      {
        title: "Adab that improves the whole journey",
        content: [
          "Small habits shape the tone of ziyarat: lowering your voice, avoiding unnecessary phone use inside sacred spaces, and making room for others in crowded lines.",
        ],
      },
    ],
    conclusion:
      "Iraq's holy cities reward both devotion and discipline. When planning and adab come together, ziyarat becomes calmer, safer, and spiritually richer.",
  },
  {
    slug: "health-wellbeing-pilgrimage-guide",
    title: "Health and Wellbeing During Pilgrimage: A Smart, Sustainable Approach",
    category: "Health",
    readingTime: "6 min read",
    author: "Marefat Team",
    date: "April 13, 2026",
    image:
      "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-5.jpeg",
    excerpt:
      "Stay strong through Umrah and Ziyarat with a realistic health plan covering hydration, sleep, foot care, infection prevention, and recovery.",
    introduction:
      "Pilgrimage is physically demanding, even for healthy travelers. Long walks, heat, crowd density, and irregular schedules can wear you down quickly. A simple health plan protects your stamina and helps you remain present in worship.",
    sections: [
      {
        title: "Prepare before departure",
        content: [
          "Two weeks before travel, begin walking daily and improve your sleep pattern. If you have a medical condition, ask your doctor for a travel note and medication plan.",
        ],
        listItems: [
          "Pack daily medicine in original packaging",
          "Carry a small first-aid and blister kit",
          "Bring oral rehydration packets for hot days",
        ],
      },
      {
        title: "Protect your energy during the trip",
        content: [
          "Hydration and rest are not optional extras. They are part of your ability to complete rituals well.",
        ],
        listItems: [
          "Drink water regularly, not only when thirsty",
          "Choose light meals before heavy activity",
          "Take short recovery breaks between major rituals",
          "Avoid new shoes on pilgrimage days",
        ],
        visuals: [
          {
            src: "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-4.jpeg",
            alt: "Water bottle, fruit, and healthy snacks for travel",
            caption:
              "Small nutrition choices make long worship days easier.",
            layout: "half",
          },
          {
            src: "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-6.jpeg",
            alt: "Comfortable walking shoes prepared for travel",
            caption:
              "Foot care is one of the strongest predictors of trip comfort.",
            layout: "half",
          },
        ],
      },
      {
        title: "Know when to ask for help",
        content: [
          "Do not ignore warning signs such as dizziness, high fever, chest discomfort, or persistent cough. Early treatment prevents bigger setbacks.",
        ],
      },
    ],
    conclusion:
      "Good health habits do not reduce spirituality; they support it. When your body is cared for, your heart and mind can stay focused on what truly matters.",
  },
  {
    slug: "ziyarat-iraq-packing-guide",
    title: "Ziyarat Iraq: A Refined Packing Guide for a Sacred Journey",
    category: "Packing",
    readingTime: "6 min read",
    author: "Marefat Team",
    date: "April 16, 2026",
    image: "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-1.jpeg",
    excerpt:
      "What to bring, what to leave behind, and how to prepare for the journey to Najaf, Karbala, Kadhimayn, and Samarra.",
    introduction:
      "A good Iraq ziyarat starts before you arrive at the shrine. Smart packing reduces stress, protects your energy, and helps you stay focused on worship. The goal is simple: carry what serves the journey, leave what distracts from it.",
    sections: [
      {
        title: "Clothing that supports long shrine days",
        content: [
          "Most pilgrimage days include long walking periods, shoe removal, and changing weather. Choose modest, practical items that keep you comfortable from morning to night.",
        ],
        listItems: [
          "Loose, breathable clothing in simple tones",
          "Comfortable walking shoes that are already broken in",
          "A light scarf, weather layers, and extra socks",
        ],
        visuals: [
          {
            src: "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-1.jpeg",
            alt: "Pilgrims in modest travel clothing near an Iraqi shrine",
            caption:
              "Simple, comfortable clothing helps you stay focused on worship.",
            layout: "full",
          },
          {
            src: "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-2.jpeg",
            alt: "Comfortable walking shoes prepared for ziyarat",
            caption: "Foot comfort matters more than most people expect.",
            layout: "half",
          },
          {
            src: "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-3.jpeg",
            alt: "Travel layers arranged for shrine visits",
            caption:
              "Weather-ready layers make long days smoother and easier.",
            layout: "half",
          },
        ],
      },
      {
        title: "Documents, health, and daily essentials",
        content: [
          "Keep documents, medication, and daily essentials in a fixed system. You should be able to find everything quickly, even in crowded or rushed moments.",
        ],
        listItems: [
          "Passport, visa, and printed plus digital copies",
          "A small secure pouch for money and valuables",
          "First-aid basics, blister care, and personal medication",
          "Reusable water bottle and light snacks",
        ],
        visuals: [
          {
            src: "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-4.jpeg",
            alt: "Travel health items and snacks laid out for pilgrimage",
            caption:
              "Small preparations protect your energy in crowded conditions.",
            layout: "third",
          },
          {
            src: "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-5.jpeg",
            alt: "Water bottle and essentials for a long walking day",
            caption: "Hydration is one of the most important daily habits.",
            layout: "third",
          },
          {
            src: "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-6.jpeg",
            alt: "Compact first aid and blister kit",
            caption: "A small kit can prevent a large problem later.",
            layout: "third",
          },
        ],
      },
      {
        title: "Keep your day bag light and intentional",
        content: [
          "Carry only what you need for the next few hours. A lighter bag reduces fatigue, improves movement in crowds, and keeps your mind calmer.",
        ],
        listItems: [
          "Phone, ID, money, and key documents only",
          "Dua booklet, tasbih, and one small prayer item",
          "Avoid carrying backup items you will not use",
        ],
      },
    ],
    conclusion:
      "Packing is not the goal of ziyarat, but it shapes your experience. When your essentials are clear and your load is light, your attention returns to devotion, gratitude, and presence.",
  },
  {
    slug: "ziyarat-imam-ali-al-ridha-divine-generosity",
    title: "Ziyarat of Imam Ali al-Ridha (AS): A Journey into Divine Generosity",
    category: "Spiritual",
    readingTime: "7 min read",
    author: "Marefat Team",
    date: "April 16, 2026",
    image:
      "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-1.jpeg",
    excerpt:
      "A reflective guide to visiting Imam Ali al-Ridha (AS) in Mashhad, with practical adab, worship focus, and the spiritual meaning of ziyarat.",
    introduction:
      "The journey to Mashhad is a journey of presence. Pilgrims often describe it as a visit filled with mercy, calm, and clarity. With proper adab and a focused routine, your ziyarat can be both spiritually deep and emotionally grounding.",
    sections: [
      {
        title: "Enter the haram with calm and adab",
        content: [
          "Before entering the shrine, slow down your pace and gather your intention. A quiet entry helps the heart settle and makes the whole visit more meaningful.",
        ],
        listItems: [
          "Begin with salam and sincere intention",
          "Keep your voice low and phone use minimal",
          "Move gently and make space for others",
        ],
        visuals: [
          {
            src: "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-1.jpeg",
            alt: "Wide view of the shrine of Imam Ali al-Ridha in Mashhad",
            caption:
              "A calm entry often shapes the quality of the entire ziyarat.",
            layout: "full",
          },
          {
            src: "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-2.jpeg",
            alt: "Detailed interior architecture of Imam Reza shrine",
            caption: "The beauty of the haram invites reflection and humility.",
            layout: "half",
          },
          {
            src: "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-3.jpeg",
            alt: "Pilgrims in the courtyard of Imam Reza shrine",
            caption:
              "Presence, not haste, gives the visit its real depth.",
            layout: "half",
          },
        ],
      },
      {
        title: "Keep your ziyarat focused",
        content: [
          "A shorter, sincere routine can be more powerful than a long distracted one. Keep the visit simple and intentional.",
        ],
        listItems: [
          "Recite the ziyarat text with understanding",
          "Offer personal dua with honesty and hope",
          "Set aside moments of silence for reflection",
        ],
      },
      {
        title: "Carry the impact beyond the trip",
        content: [
          "The purpose of ziyarat is not limited to one place or one day. Let the lessons of patience, humility, and remembrance continue in your daily life.",
        ],
        visuals: [
          {
            src: "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-4.jpeg",
            alt: "Pilgrims walking through the shrine courtyard in Mashhad",
            caption: "Real ziyarat continues through character after you return.",
            layout: "third",
          },
          {
            src: "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-5.jpeg",
            alt: "Calligraphy and sacred interior space in Mashhad shrine",
            caption: "Quiet reflection often leaves the deepest impression.",
            layout: "third",
          },
          {
            src: "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-6.jpeg",
            alt: "Night panorama of Imam Reza shrine",
            caption: "Leave with a calmer heart and a clearer direction.",
            layout: "third",
          },
        ],
      },
    ],
    conclusion:
      "Ziyarat of Imam al-Ridha (AS) is measured by sincerity, not duration. A focused visit, done with adab, can stay with you long after the journey ends.",
  },
  {
    slug: "umrah-essentials-seamless-journey",
    title: "Umrah Essentials: What You Truly Need for a Seamless Journey",
    category: "Packing",
    readingTime: "6 min read",
    author: "Marefat Team",
    date: "April 13, 2026",
    image:
      "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-1.jpeg",
    excerpt:
      "A refined essentials checklist for Umrah: what to carry, what to skip, and how to stay light, organized, and spiritually focused.",
    introduction:
      "Umrah becomes easier when your packing is simple and intentional. You do not need more items, you need the right items. A clean essentials list protects your comfort and keeps your attention on worship.",
    sections: [
      {
        title: "Core essentials to prepare first",
        content: [
          "Start with documents and worship essentials before clothes. This order prevents last-minute stress and missed items.",
        ],
        listItems: [
          "Passport, visa, and printed plus digital copies",
          "Ihram items and unscented personal care products",
          "Personal medication and a small first-aid kit",
        ],
        visuals: [
          {
            src: "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-2.jpeg",
            alt: "Neatly arranged travel essentials on a bed",
            caption: "Start with essentials, then pack the rest around them.",
            layout: "full",
          },
        ],
      },
      {
        title: "Keep your daily carry light",
        content: [
          "For tawaf and sa'i days, a lighter bag means easier movement and less fatigue. Carry only what you need for a few hours.",
        ],
        listItems: [
          "Water bottle and light snack",
          "Phone, charging cable, and power bank",
          "Small dua booklet, tasbih, and prayer basics",
        ],
        visuals: [
          {
            src: "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-7.jpeg",
            alt: "Small day bag and travel accessories on a table",
            caption:
              "A compact day bag keeps movement smooth during rituals.",
            layout: "half",
          },
          {
            src: "/images/blog/ziyarat-iraq-packing-guide/ziyarat-iraq-packing-8.jpeg",
            alt: "Travel wallet, passport, and phone laid out",
            caption:
              "Keep your critical items in fixed, easy-to-reach places.",
            layout: "half",
          },
        ],
      },
      {
        title: "What to leave behind",
        content: [
          "Most overpacking happens from uncertainty. Skip duplicate items and things you can easily buy at your destination.",
        ],
      },
    ],
    conclusion:
      "Good packing is part of good ibadah preparation. When your bag is lighter and more organized, your mind is calmer and your focus stays where it should.",
  },
  {
    slug: "practical-tips-umrah-every-pilgrim",
    title: "Practical Tips for Umrah: What Every Pilgrim Should Know",
    category: "Umrah Tips",
    readingTime: "5 min read",
    author: "Marefat Team",
    date: "April 12, 2026",
    image:
      "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-5.jpeg",
    excerpt:
      "Smart habits for documents, packing, crowds, and health so your Umrah stays organized and less stressful.",
    introduction:
      "Most Umrah difficulties are preventable. A few steady habits can save you from common stress points such as document issues, crowd pressure, and fatigue.",
    sections: [
      {
        title: "Before you travel",
        content: [
          "Confirm your paperwork early and review the Umrah sequence before travel day. Preparation brings calm, especially for first-time pilgrims.",
        ],
        listItems: [
          "Verify passport, visa, and booking details",
          "Keep printed and digital copies in separate places",
          "Break in your footwear before departure",
          "Inform your bank about travel dates",
        ],
      },
      {
        title: "During tawaf, sa'i, and daily movement",
        content: [
          "Move at a steady pace and avoid unnecessary rushing in dense crowds. Protecting your energy helps you complete rituals with better focus.",
        ],
        listItems: [
          "Hydrate regularly throughout the day",
          "Take short breaks between major activities",
          "Use simple meeting points with your group",
          "Keep belongings secured in a small front bag",
        ],
        visuals: [
          {
            src: "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-6.jpeg",
            alt: "Crowd movement in a large public walkway",
            caption:
              "A steady pace and situational awareness reduce stress in crowds.",
            layout: "half",
          },
          {
            src: "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-4.jpeg",
            alt: "Traveler drinking water during a long walking day",
            caption: "Hydration and short breaks protect your stamina.",
            layout: "half",
          },
        ],
      },
      {
        title: "Safety and communication habits",
        content: [
          "Keep your hotel location and emergency contacts easy to access. Staying reachable solves many problems before they grow.",
        ],
        listItems: [
          "Save your hotel pin offline",
          "Use a local SIM or a reliable roaming package",
          "Share your rough daily plan with family",
        ],
      },
    ],
    conclusion:
      "Small practical decisions make a big difference during Umrah. Stay organized, move patiently, and protect your energy for worship.",
  },
  {
    slug: "umrah-journey-shia-guide",
    title: "Everything You Need to Know Before Your Umrah Journey (Shia Guide)",
    category: "Umrah Tips",
    readingTime: "8 min read",
    author: "Marefat Team",
    date: "April 12, 2026",
    image:
      "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-2.jpeg",
    excerpt:
      "Spiritual and practical preparation, an essentials checklist, and step-by-step Umrah according to Shia jurisprudence, including Tawaf al-Nisa.",
    introduction:
      "For Shia pilgrims, Umrah preparation has two sides: inner readiness and precise understanding of the ritual sequence. Learning the steps before travel prevents confusion and helps protect your focus in the Haram.",
    sections: [
      {
        title: "Prepare spiritually and practically",
        content: [
          "Begin with sincere intention, repentance, and a clear plan to follow your marja's rulings. Then complete your practical checklist early.",
        ],
        listItems: [
          "Passport, visa, and travel documents",
          "Ihram items and unscented toiletries",
          "Medication, dua booklet, and prayer essentials",
        ],
      },
      {
        title: "Know the sequence before departure",
        content: [
          "The key sequence is: Ihram, Tawaf, Salat al-Tawaf, Sa'i, Taqsir, Tawaf al-Nisa, then Salat of Tawaf al-Nisa.",
          "Review each step beforehand and consult a scholar for personal rulings or edge cases.",
        ],
        visuals: [
          {
            src: "/images/blog/ziyarat-imam-ali-al-ridha/ziyarat-imam-ali-al-ridha-3.jpeg",
            alt: "Pilgrims in prayer near the Grand Mosque",
            caption:
              "Clarity in sequence helps you perform each act with confidence.",
            layout: "full",
          },
        ],
      },
      {
        title: "Avoid common errors",
        content: [
          "Most mistakes happen because of rushing or incomplete study, especially around obligatory prayers after tawaf and the final steps.",
        ],
        listItems: [
          "Do not skip Tawaf al-Nisa and its prayer",
          "Do not delay learning the sequence until arrival",
          "Keep a concise checklist for each ritual day",
        ],
      },
    ],
    conclusion:
      "A strong Umrah experience combines knowledge, patience, and sincerity. Learn the method early, follow your marja's guidance, and stay present in every step.",
  },
];
