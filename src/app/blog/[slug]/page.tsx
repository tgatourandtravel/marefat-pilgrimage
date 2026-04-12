import type { Metadata } from "next";
import Link from "next/link";

type BlogPost = {
  slug: string;
  title: string;
  category: string;
  readingTime: string;
  author: string;
  date: string;
  image: string;
  introduction: string;
  sections: Array<{
    title: string;
    content: string[];
    listItems?: string[];
  }>;
  conclusion: string;
};

const POSTS: BlogPost[] = [
  {
    slug: "practical-tips-umrah-every-pilgrim",
    title: "Practical Tips for Umrah: What Every Pilgrim Should Know",
    category: "Umrah Tips",
    readingTime: "5 min read",
    author: "Marefat Team",
    date: "April 12, 2026",
    image:
      "https://images.unsplash.com/photo-1770786106021-52580470e31e?w=1200&h=600&fit=crop",
    introduction:
      "Preparing for Umrah can feel overwhelming, especially if it is your first time. With the right preparation and a few steady habits, your journey can be much smoother and more comfortable. This guide focuses purely on **practical** steps — so you stay organized and avoid the most common problems pilgrims face.",
    sections: [
      {
        title: "Before you travel",
        content: [
          "A calm, organized start makes everything that follows easier. Tend to documents and logistics well before your departure date — not the night before.",
        ],
        listItems: [
          "**Double-check passport, visa, and all required documents** — confirm expiry dates and make sure names match exactly.",
          "**Keep digital and printed copies** of every key document in separate places (phone, luggage, and with a trusted contact).",
          "**Pack light but smart** — you will walk long distances every day; extra weight compounds quickly.",
          "**Inform your bank about travel** so cards are not flagged or blocked abroad.",
          "**Learn the Umrah steps in advance** — understanding what you are doing before you arrive removes significant pressure.",
        ],
      },
      {
        title: "Packing essentials",
        content: [
          "Prioritize comfort, hygiene, and daily-use items. Anything available locally can be bought there — do not overpack.",
        ],
        listItems: [
          "**Comfortable shoes or sandals** that you have already broken in",
          "**Ihram** and appropriate modest everyday clothing",
          "**Unscented toiletries** — important while in the state of Ihram",
          "**Personal medications** with prescriptions and sufficient supply",
          "**Small backpack** for day visits",
          "**Power bank** and the correct charging cables",
          "**Reusable water bottle** — staying hydrated is non-negotiable",
          "**Turba** (prayer tablet) if used for prostration in holy sites",
        ],
      },
      {
        title: "At the airport and on arrival",
        content: [
          "The first 24 hours set the tone. Keep documents accessible, follow your group, and resist the urge to rush.",
        ],
        listItems: [
          "**Arrive early** — rushing causes simple mistakes",
          "**Keep documents within easy reach** at immigration and security",
          "**Stay hydrated** during and after long flights",
          "**Follow your group leader's timing and instructions** — meeting points matter",
        ],
      },
      {
        title: "Managing crowds",
        content: [
          "The Haram and its surroundings are busy almost around the clock. Patience and predictable movement keep you safer and less fatigued.",
        ],
        listItems: [
          "**Stay calm** — crowds move in waves; resist pushing",
          "**Avoid peak hours** when you have flexibility in your schedule",
          "**Stay close to your group** to prevent separation",
          "**Move with the flow** — do not force your way against dense crowd movement",
        ],
      },
      {
        title: "Staying healthy",
        content: [
          "Small daily habits prevent the dehydration, blisters, and fatigue that turn a meaningful trip into a difficult one.",
        ],
        listItems: [
          "**Drink water consistently** throughout the day, not just when thirsty",
          "**Avoid heavy meals** before long walks or rituals",
          "**Get adequate rest** between activities",
          "**Wear footwear you trust** — do not test new shoes in Makkah",
          "**Use hand sanitizer frequently**, especially after touching shared surfaces",
        ],
      },
      {
        title: "During Tawaf and Sa'i",
        content: [
          "These rites require focus and steady pacing. Secure your belongings and do not be afraid to take a moment.",
        ],
        listItems: [
          "**Keep a steady, comfortable pace** — rushing adds nothing",
          "**Take breaks** on the sidelines if you feel dizzy or exhausted",
          "**Stay aware** of the people directly around you",
          "**Secure your belongings** — a front-worn waist bag is ideal",
        ],
      },
      {
        title: "Communication tips",
        content: [
          "Staying reachable reassures your family and helps your group find you if separated.",
        ],
        listItems: [
          "**Learn a few basic Arabic phrases** — directions, greetings, and polite requests",
          "**Save your hotel's address offline** on your phone map",
          "**Use a local SIM or roaming plan** that you have tested",
          "**Share your general itinerary** with family or a trusted contact at home",
        ],
      },
      {
        title: "Money and safety",
        content: [
          "Carry just enough cash for daily needs; keep cards and documents protected at all times.",
        ],
        listItems: [
          "**Carry moderate cash** for smaller purchases and markets",
          "**Use a secure, concealed bag** — front-worn or under-clothing pouches work well",
          "**Leave unnecessary valuables** in the hotel safe",
          "**Remain alert in crowded markets** and near entry points",
        ],
      },
      {
        title: "Common mistakes to avoid",
        content: [
          "Most difficulties come from inadequate preparation or underestimating the physical demands of the trip.",
        ],
        listItems: [
          "**Overpacking** — less is genuinely more on this journey",
          "**Not preparing physically** for extensive walking and long standing periods",
          "**Losing track of documents** — secure and double-check them daily",
          "**Ignoring hydration** until feeling unwell",
          "**Relying entirely on others** — know your own basics",
        ],
      },
    ],
    conclusion:
      "With the right preparation, Umrah becomes much more manageable. Stay organized, be patient, and keep your focus on the worship itself — the logistics should be invisible by the time you arrive.",
  },
  {
    slug: "umrah-journey-shia-guide",
    title: "Everything You Need to Know Before Your Umrah Journey (Shia Guide)",
    category: "Umrah Tips",
    readingTime: "8 min read",
    author: "Marefat Team",
    date: "April 12, 2026",
    image:
      "https://images.unsplash.com/photo-1513072064285-240f87fa81e8?w=1200&h=600&fit=crop",
    introduction:
      "Preparing for Umrah is more than booking a flight — it is preparing your heart, your mind, and your actions. Whether it is your first time or you have performed Umrah before, understanding the journey properly can transform your experience. This guide covers **spiritual readiness**, **essential documents and packing**, and a **clear step-by-step outline of Umrah according to Shia jurisprudence** — including Tawaf al-Nisa. For detailed rulings and edge cases, always follow the guidance of your marja.",
    sections: [
      {
        title: "One important reminder",
        content: [
          "Imam Jaʿfar al-Ṣādiq (AS) said: \u201cComplete your Hajj and Umrah as Allah has commanded.\u201d \u2014 Al-K\u0101f\u012b, Vol. 4, Book of Hajj",
          "This is a simple but profound reminder: Umrah is not only about traveling — it is about performing it with knowledge, sincerity, and in the way Allah has commanded.",
        ],
      },
      {
        title: "Key considerations",
        content: [
          "Preparation works on two levels simultaneously: the inner and the outer. Both matter equally.",
        ],
        listItems: [
          "**Spiritual preparation** — Begin weeks in advance. Increase your prayers, engage in tawbah (repentance), and set a sincere, clear intention (niyyah).",
          "**Physical preparation** — There is a great deal of walking on uneven surfaces and in heat. Build your stamina and ensure you are in sound health before traveling.",
          "**Documentation** — Double-check passport validity, visa, and all required papers well in advance — not the week before departure.",
          "**Packing** — Keep it simple and purposeful. Avoid unnecessary weight.",
        ],
      },
      {
        title: "Before travel — essentials checklist",
        content: [
          "Use this as a starting reference and adjust according to your scholar's rulings and airline restrictions.",
        ],
        listItems: [
          "**Ihram clothing** in the form specified by your marja",
          "**Passport and visa** — plus copies stored separately",
          "**Unscented toiletries** appropriate for the state of Ihram",
          "**Personal medications** with sufficient supply for the whole trip",
          "**A compact duʿāʾ book** you can carry comfortably",
          "**Turba** for prostration on natural earth, as applicable to your practice",
        ],
      },
      {
        title: "Step 1 — Ihram (at Miqat)",
        content: [
          "Ihram is the sacred state of consecration entered at the prescribed miqāt for your travel route. Follow your marja's detailed guidance on clothing, the recommended prayers, and the form of talbiyah.",
        ],
        listItems: [
          "Perform ghusl at or before the miqāt as recommended or required",
          "Wear Ihram in the correct prescribed form",
          "Make a clear, sincere **niyyah** specifically for Umrah al-Mufradah",
          "Recite the **Talbiyah** as taught by your school of jurisprudence",
        ],
      },
      {
        title: "Step 2 — Tawaf",
        content: [
          "Perform seven complete circuits (ashwāt) around the Kaʿbah, beginning and ending at the Black Stone (Hajar al-Aswad). Maintain wuḍūʾ throughout and focus on the spiritual significance of each round.",
        ],
        listItems: [
          "Complete **seven full circuits** with the correct starting and ending point",
          "**Maintain wuḍūʾ** as required throughout",
          "Stay calm and measured — avoid unnecessary rushing in crowded conditions",
        ],
      },
      {
        title: "Step 3 — Salat al-Tawaf",
        content: [
          "After completing Tawaf, perform the two rakʿahs of Ṣalāt al-Tawaf — ideally behind Maqām Ibrāhīm when the crowd allows, or anywhere in the Masjid al-Haram. This prayer is **obligatory** in the Umrah sequence.",
        ],
      },
      {
        title: "Step 4 — Sa'y (Safa and Marwa)",
        content: [
          "Walk seven times between the hills of Ṣafā and Marwah — starting at Ṣafā and ending at Marwah. Recite the appropriate duʿāʾ at each point as per your marja's guidance.",
        ],
      },
      {
        title: "Step 5 — Taqsir",
        content: [
          "After Sa'y, perform taqsīr: cut a small portion of hair from your head (for men and women as specified by your school of jurisprudence). This act marks the release from the state of Ihram for ʿUmrah al-Mufradah.",
        ],
      },
      {
        title: "Step 6 — Tawaf al-Nisa",
        content: [
          "In **Shia jurisprudence, Tawaf al-Nisāʾ is obligatory** for ʿUmrah al-Mufradah. After taqsīr, perform another seven circuits around the Kaʿbah with the same conditions as the first Tawaf. Skipping this step is a significant error — confirm all details with your marja.",
        ],
      },
      {
        title: "Step 7 — Salat of Tawaf al-Nisa",
        content: [
          "Complete the sequence with the two rakʿahs of Ṣalāt of Tawaf al-Nisāʾ, performed after the seventh circuit. With this prayer, the complete sequence of ʿUmrah al-Mufradah in Shia jurisprudence is fulfilled.",
          "Always consult a qualified scholar for questions about specific circumstances — illness, inability to complete certain acts, or situations not covered by general guidance.",
        ],
      },
      {
        title: "Practical tips for the journey",
        content: [
          "Knowledge and preparation before you arrive frees your attention for the worship itself.",
        ],
        listItems: [
          "**Learn all steps and the key duʿāʾs before you depart** — do not be learning from scratch in the Haram",
          "**Be patient** in crowds and with your own pace",
          "**Carry a compact duʿāʾ book** for reference",
          "**Stay well hydrated** — especially in warm months",
          "**Keep document copies** separate from originals",
          "**Learn basic Arabic phrases** for common needs and courtesy",
        ],
      },
      {
        title: "Common mistakes to avoid",
        content: [
          "Most errors come from insufficient preparation or approaching Umrah too casually.",
        ],
        listItems: [
          "**Skipping Tawaf al-Nisāʾ** or its obligatory prayer — in Shia fiqh, this invalidates the completion of Umrah",
          "**Forgetting Ṣalāt al-Tawaf** after the first Tawaf",
          "**Not learning the steps and sequence beforehand**",
          "**Treating Umrah like ordinary tourism** — missing the adab (etiquette) and spiritual focus required",
        ],
      },
    ],
    conclusion:
      "For many, Umrah is a once-in-a-lifetime journey. Prepare well, follow your marja's rulings carefully, and keep your heart present in every step. May your Umrah be accepted and full of blessings.",
  },
  {
    slug: "complete-guide-first-umrah",
    title: "Complete Guide to Your First Umrah",
    category: "Umrah Tips",
    readingTime: "7 min read",
    author: "Sheikh Ahmad",
    date: "December 15, 2024",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
    introduction:
      "Everything you need to know before embarking on your first Umrah journey. From spiritual preparation to practical tips. Pilgrimage is one of the most profound spiritual experiences a Muslim can undertake. Whether you're planning your first Umrah or preparing for the sacred journey of Hajj, proper preparation can make all the difference.",
    sections: [
      {
        title: "Key Considerations",
        content: [
          "When preparing for your pilgrimage, there are several important factors to keep in mind:",
        ],
        listItems: [
          "**Spiritual Preparation** — Begin your spiritual preparation weeks before your journey. Increase your prayers, read about the significance of each ritual, and set your intentions clearly.",
          "**Physical Preparation** — The journey can be physically demanding. Start a walking routine to build stamina, and ensure you're in good health before traveling.",
          "**Documentation** — Ensure all your travel documents are in order well in advance. This includes your passport, visa, vaccination certificates, and travel insurance.",
          "**Packing Essentials** — Pack light but don't forget the essentials: comfortable shoes, appropriate clothing, personal medications, and prayer items.",
        ],
      },
      {
        title: "Practical Tips",
        content: [
          "Here are some practical tips that experienced pilgrims recommend:",
        ],
        listItems: [
          "Start learning the duas and rituals before you leave",
          "Carry a small prayer book for reference",
          "Stay hydrated, especially during hot months",
          "Keep copies of important documents",
          "Learn basic Arabic phrases for communication",
        ],
      },
    ],
    conclusion:
      "Your pilgrimage is a once-in-a-lifetime experience for many. Take the time to prepare properly, and you'll be able to focus entirely on the spiritual aspects of your journey. May your pilgrimage be accepted and blessed.",
  },
  {
    slug: "understanding-ihram-rituals",
    title: "Understanding the Ihram: Rules and Spiritual Significance",
    category: "Ihram & Rituals",
    readingTime: "8 min read",
    author: "Ustadh Omar",
    date: "December 10, 2024",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
    introduction:
      "A comprehensive guide to the state of Ihram, its requirements, and the deep spiritual meaning behind this sacred practice. The state of Ihram is not merely a physical condition but a spiritual transformation that prepares the heart and soul for the sacred rites ahead.",
    sections: [
      {
        title: "What is Ihram?",
        content: [
          "Ihram is the sacred state that pilgrims enter before performing Umrah or Hajj. It involves wearing specific clothing and observing certain prohibitions. The word 'Ihram' itself means 'prohibition' or 'restriction,' reflecting the sacred boundaries one enters during this time.",
        ],
      },
      {
        title: "Ihram Requirements",
        content: [
          "For men, Ihram consists of two white, seamless cloths: one wrapped around the waist and one draped over the shoulder. For women, it means wearing modest clothing that covers the body appropriately, leaving the face and hands uncovered. Both men and women must observe the following:",
        ],
        listItems: [
          "No cutting of hair or nails",
          "No use of perfumes or scented products",
          "No hunting or killing of animals",
          "No sexual relations or marriage proposals",
          "Maintaining a state of ritual purity",
        ],
      },
      {
        title: "The Spiritual Dimension",
        content: [
          "Beyond the physical requirements, Ihram represents a state of spiritual equality and humility. All pilgrims, regardless of their social or economic status, wear similar simple garments, reminding us that we stand equal before Allah. This physical simplicity helps focus the heart and mind on the spiritual purpose of the journey.",
        ],
      },
    ],
    conclusion:
      "Entering Ihram with understanding and intention transforms the entire experience. It is a sacred transition that prepares you not just physically, but spiritually, for the profound rituals of Umrah and Hajj. Approach it with reverence and mindfulness.",
  },
  {
    slug: "essential-packing-list-pilgrimage",
    title: "Essential Packing List for Pilgrimage",
    category: "Packing",
    readingTime: "6 min read",
    author: "Marefat Team",
    date: "December 8, 2024",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=600&fit=crop",
    introduction:
      "Don't forget these important items! A comprehensive packing guide for Umrah, Hajj, and Ziyarat trips. Packing wisely ensures comfort and peace of mind, allowing you to focus on the spiritual aspects of your journey rather than worrying about forgotten essentials.",
    sections: [
      {
        title: "Essential Items",
        content: [
          "Here's what you should definitely include in your luggage:",
        ],
        listItems: [
          "**Travel Documents** — Passport, visa, vaccination certificates, travel insurance, and multiple copies stored separately",
          "**Ihram Clothing** — Two white seamless cloths for men, appropriate modest clothing for women",
          "**Comfortable Footwear** — Slip-on shoes that are easy to remove when entering mosques",
          "**Prayer Items** — Prayer mat, compass (Qibla finder), and a small Quran or dua book",
          "**Personal Medications** — Bring enough for the entire trip plus extra, with prescriptions",
        ],
      },
      {
        title: "Comfort & Health",
        content: [
          "Items to help you stay comfortable and healthy:",
        ],
        listItems: [
          "Lightweight, breathable clothing suitable for the climate",
          "Sunscreen and hat for sun protection",
          "Water bottle (collapsible is ideal)",
          "Hand sanitizer and wet wipes",
          "Basic first aid kit",
        ],
      },
      {
        title: "What to Leave Behind",
        content: [
          "Remember that simplicity is key. Avoid bringing:",
        ],
        listItems: [
          "Unnecessary valuables or expensive jewelry",
          "Too many changes of clothes",
          "Heavy books or excessive electronics",
          "Items that are readily available at your destination",
        ],
      },
    ],
    conclusion:
      "Pack thoughtfully, focusing on essentials. Remember, you can always purchase items locally if needed. The goal is to travel light, comfortably, and with peace of mind, allowing you to fully immerse yourself in the spiritual journey.",
  },
  {
    slug: "womens-guide-pilgrimage",
    title: "Women's Guide to Pilgrimage",
    category: "Women's Guide",
    readingTime: "7 min read",
    author: "Dr. Aisha Khan",
    date: "December 5, 2024",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
    introduction:
      "Special considerations, tips, and guidance for women traveling for Umrah, Hajj, and Ziyarat journeys. This guide addresses the unique needs and concerns of women pilgrims, ensuring a comfortable and spiritually fulfilling experience.",
    sections: [
      {
        title: "Dress Code & Modesty",
        content: [
          "Women should dress modestly throughout the journey, covering their entire body except the face and hands. Choose loose-fitting, breathable fabrics in neutral colors. Abayas or long dresses are ideal, and headscarves should be comfortable and secure.",
        ],
      },
      {
        title: "Health Considerations",
        content: [
          "It's essential to plan ahead for health and hygiene needs:",
        ],
        listItems: [
          "Pack sufficient feminine hygiene products for the duration of your trip",
          "Consult with your doctor about travel during menstruation if applicable",
          "Carry hand sanitizer and maintain good hygiene practices",
          "Stay hydrated and take breaks when needed",
        ],
      },
      {
        title: "Practical Tips",
        content: [
          "Additional considerations for a comfortable journey:",
        ],
        listItems: [
          "Wear comfortable, closed-toe shoes that are easy to remove",
          "Carry a small bag for personal items during prayers",
          "Take advantage of designated women's prayer areas",
          "Travel with a companion or group for safety and support",
          "Plan your schedule around prayer times and rest periods",
        ],
      },
    ],
    conclusion:
      "With proper preparation and awareness, women can fully participate in and benefit from the spiritual experience of pilgrimage. Remember that millions of women have made this journey before you, and it is a blessed and accepted act of worship for all Muslims, regardless of gender.",
  },
  {
    slug: "visa-requirements-countries",
    title: "Visa Requirements: Saudi Arabia and Iraq",
    category: "Visa & Documents",
    readingTime: "4 min read",
    author: "Marefat Team",
    date: "December 3, 2024",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=600&fit=crop",
    introduction:
      "An overview of visa requirements, documentation needed, and processing timelines for pilgrimage destinations. Proper documentation is crucial for a smooth journey, and requirements can vary significantly by nationality and destination.",
    sections: [
      {
        title: "Saudi Arabia (Umrah & Hajj)",
        content: [
          "For Umrah and Hajj visas, requirements typically include:",
        ],
        listItems: [
          "Valid passport with at least 6 months validity remaining",
          "Completed visa application form",
          "Recent passport-sized photographs",
          "Proof of vaccination (requirements may change)",
          "Confirmed travel itinerary and hotel reservations",
          "For Hajj, authorization through the official Hajj quota system",
        ],
      },
      {
        title: "Iraq (Ziyarat)",
        content: [
          "Requirements for visiting holy sites in Iraq:",
        ],
        listItems: [
          "Valid passport",
          "Visa application (processing times vary by nationality)",
          "Supporting documents as required by Iraqi consulate",
          "Travel itinerary and accommodation details",
          "Some nationalities may require sponsorship",
        ],
      },
      {
        title: "Important Notes",
        content: [
          "Always check the latest requirements with the relevant embassies or consulates, as visa policies can change. Our team provides updated documentation lists at the time of booking and assists with the visa application process.",
        ],
      },
    ],
    conclusion:
      "Start your visa application process early — ideally 6-8 weeks before travel, and earlier during peak seasons. Proper documentation ensures a smooth start to your spiritual journey.",
  },
  {
    slug: "spiritual-journey-maximizing-pilgrimage",
    title: "The Spiritual Journey: Maximizing Your Pilgrimage",
    category: "Spiritual",
    readingTime: "9 min read",
    author: "Sheikh Ibrahim",
    date: "December 1, 2024",
    image: "https://images.unsplash.com/photo-1515595968323-4964db3a2218?w=1200&h=600&fit=crop",
    introduction:
      "Deep insights into making the most of your spiritual journey, focusing on intention, presence, and reflection. Pilgrimage is not merely a physical journey but a profound spiritual transformation that requires preparation of the heart and mind.",
    sections: [
      {
        title: "Setting Your Intention",
        content: [
          "The foundation of a meaningful pilgrimage begins with sincere intention (niyyah). Your intention should be purely for the sake of Allah, seeking His pleasure and forgiveness. Take time before departure to reflect on what you hope to achieve spiritually and what you seek to leave behind.",
        ],
      },
      {
        title: "Presence and Mindfulness",
        content: [
          "During your journey, practice being fully present:",
        ],
        listItems: [
          "Leave worldly concerns behind and focus on the spiritual moment",
          "Engage deeply with each ritual, understanding its significance",
          "Minimize distractions and unnecessary conversations",
          "Take time for personal reflection and dua",
          "Observe and absorb the spiritual atmosphere of the holy sites",
        ],
      },
      {
        title: "Making Dua",
        content: [
          "Pilgrimage is a time when duas are especially accepted. Prepare a list of duas in advance, but also speak from your heart. Remember to pray not just for yourself, but for your family, community, and all Muslims worldwide. Include prayers for guidance, forgiveness, and blessings.",
        ],
      },
      {
        title: "Reflection and Transformation",
        content: [
          "Use the journey as an opportunity for self-reflection. Consider what changes you want to make in your life upon returning. The spiritual insights gained during pilgrimage are meant to be carried forward, not left behind at the holy sites.",
        ],
      },
    ],
    conclusion:
      "A successful pilgrimage is measured not by the distance traveled, but by the transformation of the heart. May your journey be one of deep spiritual growth, forgiveness, and renewed commitment to your faith. Return as a better person, carrying the blessings of your journey into every aspect of your life.",
  },
  {
    slug: "preparing-for-your-first-umrah",
    title: "Preparing for your first Umrah: a calm, practical guide",
    category: "Umrah Tips",
    readingTime: "7 min read",
    author: "Sheikh Ahmad",
    date: "November 28, 2024",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&h=600&fit=crop",
    introduction:
      "For many guests, their first Umrah is a long‑awaited moment. Preparing calmly can help you arrive with a clear mind and heart. This guide addresses the common concerns and questions of first-time pilgrims.",
    sections: [
      {
        title: "Before You Travel",
        content: [
          "Begin with your intention and schedule. If possible, choose dates that allow you to travel without rushing, with a small margin before and after the core program. Organise your key documents — passport, visas, medical confirmations, and travel insurance — in a simple wallet or pouch you can keep with you at all times.",
        ],
      },
      {
        title: "Learning the Rituals",
        content: [
          "We encourage you to review the basics of Ihram, Tawaf, and Sa'i with a trusted scholar or through our pre‑departure materials so that, once you arrive, technical questions are mostly settled. However, don't worry about perfection — focus on understanding the essence and meaning of each step.",
        ],
        listItems: [
          "Study the steps of Umrah rituals in advance",
          "Practice making the necessary duas",
          "Understand the significance of each action",
          "Know where to ask for help if needed",
        ],
      },
    ],
    conclusion:
      "Remember that every experienced pilgrim was once a first-timer. Trust in your preparation, remain calm, and know that guidance is always available. Your sincerity and intention matter more than perfect execution of every detail.",
  },
  {
    slug: "visa-checklist-for-pilgrims",
    title: "Visa & document checklist for pilgrims",
    category: "Visa & Documents",
    readingTime: "5 min read",
    author: "Marefat Team",
    date: "November 25, 2024",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop",
    introduction:
      "Requirements change from time to time, but several elements are usually constant for most pilgrims. Having your documents organized and ready is essential for a stress-free journey.",
    sections: [
      {
        title: "Essential Documents",
        content: [
          "Ensure your passport has sufficient validity beyond your travel dates and that it is in good physical condition. Have recent passport‑sized photographs ready in case they are needed for visa or local registrations.",
        ],
        listItems: [
          "Passport (valid for at least 6 months)",
          "Visa(s) for your destination(s)",
          "Travel insurance certificate",
          "Vaccination records",
          "Hotel confirmation documents",
          "Flight tickets and itinerary",
        ],
      },
      {
        title: "Organization Tips",
        content: [
          "Keep both original documents and copies in separate locations. Consider storing digital copies in a secure cloud service accessible from your phone. Our team will provide you with an updated list specific to your nationality and destination at the time of booking.",
        ],
      },
    ],
    conclusion:
      "Double-check everything before departure. It's better to verify requirements multiple times than to face complications at the airport or border. When in doubt, consult with your travel agent or embassy.",
  },
  {
    slug: "what-to-pack-for-umrah",
    title: "What to pack for Umrah without overpacking",
    category: "Packing",
    readingTime: "6 min read",
    author: "Marefat Team",
    date: "November 22, 2024",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=600&fit=crop",
    introduction:
      "Pilgrims often find that they brought far more than they used. A light, thoughtful list can make movement between cities simpler and your journey more comfortable.",
    sections: [
      {
        title: "The Essentials",
        content: [
          "Focus on breathable, modest clothing suitable for the expected temperatures, and a few comfortable pairs of footwear. Remember that you'll be doing a lot of walking, so prioritize comfort over style.",
        ],
        listItems: [
          "Ihram clothing (for men) or appropriate modest attire",
          "2-3 sets of comfortable everyday clothing",
          "Comfortable walking shoes and sandals",
          "Basic toiletries (unscented during Ihram)",
          "Prayer mat and compass",
        ],
      },
      {
        title: "What to Avoid",
        content: [
          "Leave space in your luggage for items you may wish to bring home, and avoid carrying valuables that are not strictly necessary. Remember that most essential items can be purchased locally if needed.",
        ],
      },
    ],
    conclusion:
      "The lighter you travel, the easier your journey will be. Focus on essentials and leave room for the meaningful items you'll want to bring back as reminders of your blessed journey.",
  },
];

type Props = {
  params: { slug: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) {
    return {
      title: "Guide not found – Marefat Pilgrimage",
    };
  }
  return {
    title: `${post.title} – Marefat Pilgrimage`,
    description: post.introduction.split(".")[0],
  };
}

export default function BlogArticlePage({ params }: Props) {
  const post = POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="rounded-2xl border border-charcoal/5 bg-ivory/50 p-8 text-center">
          <p className="text-sm text-charcoal/70">
            This guide could not be found. Please return to the{" "}
            <Link
              href="/blog"
              className="font-medium text-gold underline-offset-4 transition hover:underline"
            >
              Marefat guides
            </Link>
            .
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-ivory">
      <article className="mx-auto max-w-4xl px-6 pb-16 pt-8 sm:px-8 lg:px-12">
        {/* Header Section */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
            {post.category}
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-charcoal sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-charcoal/60">
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readingTime}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mb-10 h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-charcoal/10 via-charcoal/5 to-gold-soft/30 sm:h-[500px]">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Introduction */}
        <div className="mb-10 space-y-4">
          <div className="prose prose-sm max-w-none text-base leading-relaxed text-charcoal/80">
            {post.introduction.split(/(?<=\.) /).map((sentence, idx) => (
              <p key={idx} className={idx === 0 ? "text-lg font-medium text-charcoal" : ""}>
                {sentence}
              </p>
            ))}
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-10">
          {post.sections.map((section, sectionIdx) => (
            <section key={sectionIdx} className="space-y-4">
              <h2 className="text-xl font-semibold text-charcoal sm:text-2xl">
                {section.title}
              </h2>
              <div className="prose prose-sm max-w-none space-y-3 text-sm leading-relaxed text-charcoal/75">
                {section.content.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
                {section.listItems && (
                  <ul className="mt-4 space-y-2.5 pl-5">
                    {section.listItems.map((item, itemIdx) => {
                      const isBold = item.startsWith("**");
                      const parts = item.split("**");
                      return (
                        <li key={itemIdx} className="relative pl-2">
                          <span className="absolute left-[-12px] text-gold">•</span>
                          <span>
                            {parts.map((part, partIdx) => {
                              if (partIdx % 2 === 1) {
                                return (
                                  <strong key={partIdx} className="font-semibold text-charcoal">
                                    {part}
                                  </strong>
                                );
                              }
                              return <span key={partIdx}>{part}</span>;
                            })}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Conclusion */}
        <section className="mt-12 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold-soft/10 via-ivory to-gold/5 p-6 sm:p-8">
          <h2 className="mb-4 text-lg font-semibold text-charcoal sm:text-xl">
            Conclusion
          </h2>
          <p className="text-sm leading-relaxed text-charcoal/75">
            {post.conclusion}
          </p>
        </section>

        {/* Back Link */}
        <div className="mt-12 border-t border-charcoal/5 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-medium text-charcoal/70 transition hover:text-charcoal"
          >
            <span>←</span>
            <span>Back to All Articles</span>
          </Link>
        </div>
      </article>
    </main>
  );
}


