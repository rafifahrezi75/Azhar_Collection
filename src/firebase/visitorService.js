import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './config'

const STORAGE_KEY = 'azhar_analytics_visitors_v2'
const SESSION_KEY = 'azhar_session_active'
const VISITOR_ID_KEY = 'azhar_visitor_id'
const LAST_DATE_KEY = 'azhar_last_visit_date'

const getTodayString = () => new Date().toISOString().split('T')[0]

const getInitialAnalytics = () => {
  const today = getTodayString()
  return {
    totalVisitors: 0,
    totalPageViews: 0,
    daily: {
      [today]: {
        uniqueVisitors: 0,
        pageViews: 0
      }
    },
    lastUpdated: new Date().toISOString()
  }
}

const getStoredAnalytics = () => {
  try {
    localStorage.removeItem('azhar_analytics_visitors')
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.totalVisitors >= 1482) {
        const fresh = getInitialAnalytics()
        saveStoredAnalytics(fresh)
        return fresh
      }
      return parsed
    }
  } catch {
    return getInitialAnalytics()
  }
  const initial = getInitialAnalytics()
  saveStoredAnalytics(initial)
  return initial
}

const saveStoredAnalytics = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    return
  }
}

export const trackPublicVisit = async () => {
  if (typeof window === 'undefined') return

  const today = getTodayString()
  const isSessionActive = sessionStorage.getItem(SESSION_KEY)
  const lastVisitDate = localStorage.getItem(LAST_DATE_KEY)
  let visitorId = localStorage.getItem(VISITOR_ID_KEY)

  if (!visitorId) {
    visitorId = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    localStorage.setItem(VISITOR_ID_KEY, visitorId)
  }

  let analytics = getStoredAnalytics()
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'analytics', 'visitors'))
      if (snap.exists()) {
        analytics = snap.data()
      }
    } catch {
      analytics = getStoredAnalytics()
    }
  }

  if (!analytics.daily) analytics.daily = {}
  if (!analytics.daily[today]) {
    analytics.daily[today] = { uniqueVisitors: 0, pageViews: 0 }
  }

  let hasChanged = false

  if (!isSessionActive) {
    sessionStorage.setItem(SESSION_KEY, String(Date.now()))

    if (lastVisitDate !== today) {
      analytics.totalVisitors = (analytics.totalVisitors || 0) + 1
      analytics.daily[today].uniqueVisitors = (analytics.daily[today].uniqueVisitors || 0) + 1
      localStorage.setItem(LAST_DATE_KEY, today)
      hasChanged = true
    }

    analytics.totalPageViews = (analytics.totalPageViews || 0) + 1
    analytics.daily[today].pageViews = (analytics.daily[today].pageViews || 0) + 1
    hasChanged = true
  }

  if (hasChanged) {
    analytics.lastUpdated = new Date().toISOString()
    saveStoredAnalytics(analytics)

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'analytics', 'visitors'), analytics, { merge: true })
      } catch {
        saveStoredAnalytics(analytics)
      }
    }
  }
}

const getLast7DaysStats = (dailyData = {}) => {
  const result = []
  const now = new Date()
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayName = dayNames[d.getDay()]
    const dateNum = d.getDate()
    const label = `${dayName}, ${dateNum}`

    const entry = dailyData[dateStr] || { uniqueVisitors: 0, pageViews: 0 }
    result.push({
      date: dateStr,
      label,
      visitors: entry.uniqueVisitors || 0,
      pageViews: entry.pageViews || 0
    })
  }

  return result
}

export const getVisitorStats = async () => {
  const today = getTodayString()
  let data = getStoredAnalytics()

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'analytics', 'visitors'))
      if (snap.exists()) {
        data = snap.data()
      }
    } catch {
      data = getStoredAnalytics()
    }
  }

  const todayStats = (data.daily && data.daily[today]) || { uniqueVisitors: 0, pageViews: 0 }

  return {
    totalVisitors: data.totalVisitors || 0,
    totalPageViews: data.totalPageViews || 0,
    todayVisitors: todayStats.uniqueVisitors || 0,
    todayPageViews: todayStats.pageViews || 0,
    recentDays: getLast7DaysStats(data.daily || {}),
    lastUpdated: data.lastUpdated || new Date().toISOString()
  }
}

export const resetVisitorStats = async () => {
  const fresh = getInitialAnalytics()
  saveStoredAnalytics(fresh)
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('azhar_analytics_visitors')
    localStorage.removeItem(LAST_DATE_KEY)
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
  }

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'analytics', 'visitors'), fresh)
    } catch {
    }
  }

  return fresh
}
