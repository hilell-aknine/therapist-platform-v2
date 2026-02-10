export interface Lesson {
  id: string        // YouTube video ID
  title: string
  duration: string
}

export interface Module {
  id: number
  title: string
  lessons: Lesson[]
}

export interface Course {
  slug: string
  title: string
  description: string
  modules: Module[]
}

// ==========================================
// FREE COURSE — NLP Practitioner (51 lessons)
// ==========================================
export const nlpPractitioner: Course = {
  slug: 'nlp-practitioner',
  title: 'יסודות ה-NLP',
  description: 'למדו את עולם ה-NLP מאפס — קורס חינמי ומלא, פתוח לכולם',
  modules: [
    {
      id: 1,
      title: 'מבוא ל-NLP ויסודות',
      lessons: [
        { id: 'HdJTrqV-8kw', title: 'פתיחה והיכרות', duration: '12:30' },
        { id: 'I4r3oERlZpc', title: 'עקרונות יסוד', duration: '15:45' },
        { id: 'zGuxyfbYdUY', title: 'מודל התקשורת', duration: '18:20' },
        { id: 'fo90wrXPJjQ', title: 'מערכות ייצוג', duration: '14:10' },
        { id: 'kccllbuObhs', title: 'קריאת שפת גוף', duration: '16:55' },
        { id: 'ahN0Q2wGVa0', title: 'בניית ראפור', duration: '13:40' },
        { id: 'Nt8MK8CNvYo', title: 'התאמה והובלה', duration: '17:25' },
        { id: '-PMCuz1jiMk', title: 'סיכום המודול', duration: '10:15' },
      ],
    },
    {
      id: 2,
      title: 'עמדות תפיסה ומערכות יחסים',
      lessons: [
        { id: '3u52ghUdM9E', title: 'שלוש עמדות התפיסה', duration: '14:20' },
        { id: 'lfDEJFV3EO0', title: 'מבט מעיני האחר', duration: '16:35' },
        { id: 'ldz6Kb9hqW8', title: 'עמדת הצופה', duration: '12:50' },
        { id: '-qk4et9hKCc', title: 'תרגול מעשי', duration: '18:15' },
        { id: 'ZxpaiqBCN-A', title: 'יישום במערכות יחסים', duration: '15:40' },
        { id: 'NtzzbQKPfuQ', title: 'סיכום המודול', duration: '11:25' },
      ],
    },
    {
      id: 3,
      title: 'שאלות עוצמתיות והצבת מטרות',
      lessons: [
        { id: '5EEb8n1rkk8', title: 'כוחה של שאלה טובה', duration: '13:45' },
        { id: 'JlRGFcHIlaY', title: 'מטא-מודל בשפה', duration: '17:20' },
        { id: '9vOt4qMDErY', title: 'שאלות מעמיקות', duration: '15:10' },
        { id: 'M5WYHElp77Y', title: 'הגדרת מטרות SMART', duration: '16:35' },
        { id: '_8wvtMUInNg', title: 'Well-Formed Outcomes', duration: '14:50' },
        { id: 'HfeTbx94Z_A', title: 'תרגול מעשי', duration: '18:25' },
        { id: 'wxswFMy0FFs', title: 'סיכום המודול', duration: '10:40' },
      ],
    },
    {
      id: 4,
      title: 'השפה של המוח ומערכות ייצוג',
      lessons: [
        { id: 'bYgv5dLr5DU', title: 'איך המוח מעבד מידע', duration: '15:30' },
        { id: 'rfeUPA9HcU4', title: 'מערכת ויזואלית', duration: '13:45' },
        { id: 'deckGQrRYd4', title: 'מערכת אודיטורית', duration: '14:20' },
        { id: 'cSGrhFYSDmE', title: 'מערכת קינסטטית', duration: '16:10' },
        { id: 'gG-3I_TcHe4', title: 'זיהוי מערכת מועדפת', duration: '17:35' },
        { id: 'b_b4hhclmR8', title: 'התאמת תקשורת', duration: '15:50' },
        { id: 'itbteM8UjBE', title: 'סיכום המודול', duration: '11:15' },
      ],
    },
    {
      id: 5,
      title: 'צרכים אנושיים ומבנה האישיות',
      lessons: [
        { id: 'BNBPxr-Qec0', title: 'ששת הצרכים הבסיסיים', duration: '16:40' },
        { id: 'h7b8sX0z4nw', title: 'וודאות ומגוון', duration: '14:25' },
        { id: 'mphxQlNsGYM', title: 'משמעות וחיבור', duration: '15:50' },
        { id: 'Y8ulYYg5XDk', title: 'צמיחה ותרומה', duration: '17:15' },
        { id: 'dNKcCwvjVWk', title: 'מבנה האישיות', duration: '18:30' },
        { id: 'Gp7gT4TC1n8', title: 'עבודה עם חלקים', duration: '16:45' },
        { id: '5SDIvzco0K4', title: 'סיכום המודול', duration: '12:10' },
      ],
    },
    {
      id: 6,
      title: 'מסגור, שליטה ברגשות ועוגנים',
      lessons: [
        { id: 'EeGfP30AiLs', title: 'כוח המסגור', duration: '14:35' },
        { id: 'I_tnGW-RYmE', title: 'ריפריימינג', duration: '16:20' },
        { id: 'akbG-4zxER4', title: 'ניהול מצבים רגשיים', duration: '17:45' },
        { id: 'AO6lf_seCqs', title: 'מה הם עוגנים', duration: '13:50' },
        { id: 'NcSAnR6WWD4', title: 'יצירת עוגנים חיוביים', duration: '18:15' },
        { id: 'bceR1CAGv34', title: 'קריסת עוגנים שליליים', duration: '15:30' },
        { id: 'kndSAREj7qQ', title: 'עוגנים בטיפול', duration: '16:55' },
        { id: 'X9SUBv6maGs', title: 'סיכום המודול', duration: '11:40' },
      ],
    },
    {
      id: 7,
      title: 'אמונות וציר הזמן',
      lessons: [
        { id: '97cbIvdEz8Q', title: 'כוחן של אמונות', duration: '15:25' },
        { id: 'ieDGCAvev4w', title: 'זיהוי אמונות מגבילות', duration: '17:10' },
        { id: 'ySTzDrBml10', title: 'שינוי אמונות', duration: '18:35' },
        { id: 'zWKwwChuEfs', title: 'מבוא לציר הזמן', duration: '14:50' },
        { id: 'On9odKKss24', title: 'טיפול בעבר', duration: '16:20' },
        { id: 'BE5RLAj1Be4', title: 'בניית עתיד', duration: '17:45' },
        { id: 'K_JGmX8Cq-I', title: 'אינטגרציה', duration: '15:30' },
        { id: 'EeFCN9Tddh8', title: 'סיכום הקורס', duration: '12:55' },
      ],
    },
  ],
}

// ==========================================
// MASTER COURSE — NLP Master (7 sessions)
// ==========================================
export const nlpMaster: Course = {
  slug: 'nlp-master',
  title: 'NLP מתקדם — מאסטר',
  description: 'העמקה ברמה אחרת: עבודה עם טראומה, שינוי אמונות מגבילות ודפוסים עמוקים',
  modules: [
    {
      id: 1,
      title: 'קורס מאסטר',
      lessons: [
        { id: 'tLGTE_u3y2o', title: 'מבוא למאסטר ורמות לוגיות', duration: '45:00' },
        { id: 'master-2', title: 'שיעור 2 — טכניקות מתקדמות', duration: '42:00' },
        { id: 'master-3', title: 'שיעור 3 — עבודה עם טראומה', duration: '48:00' },
        { id: 'master-4', title: 'שיעור 4 — שינוי אמונות עמוקות', duration: '44:00' },
        { id: 'master-5', title: 'שיעור 5 — דפוסי שפה מתקדמים', duration: '46:00' },
        { id: 'master-6', title: 'שיעור 6 — אינטגרציה טיפולית', duration: '43:00' },
        { id: 'master-7', title: 'שיעור 7 — סיכום וסיום', duration: '40:00' },
      ],
    },
  ],
}

// Helper to get all courses
export const allCourses: Record<string, Course> = {
  'nlp-practitioner': nlpPractitioner,
  'nlp-master': nlpMaster,
}

// Flatten all lessons for a course
export function getAllLessons(course: Course): Lesson[] {
  return course.modules.flatMap(m => m.lessons)
}

// Get total lesson count
export function getTotalLessons(course: Course): number {
  return getAllLessons(course).length
}

// Find lesson + module by lesson ID
export function findLesson(course: Course, lessonId: string): { module: Module; lesson: Lesson; index: number } | null {
  let globalIndex = 0
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      if (lesson.id === lessonId) {
        return { module: mod, lesson, index: globalIndex }
      }
      globalIndex++
    }
  }
  return null
}

// Get next/previous lesson
export function getAdjacentLessons(course: Course, lessonId: string): { prev: Lesson | null; next: Lesson | null } {
  const all = getAllLessons(course)
  const idx = all.findIndex(l => l.id === lessonId)
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  }
}
