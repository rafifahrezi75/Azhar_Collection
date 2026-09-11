import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth'
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from './config'
import {
  portfolioProducts,
  clientsData,
  servicesData,
  testimonialsData,
  newsData,
  companyInfo
} from '../data/siteData'

const defaultTestimonials = testimonialsData.map((t) => ({
  id: t.id,
  clientName: t.name,
  role: t.institution,
  comment: t.quote,
  rating: t.rating || 5
}))

const defaultNews = newsData.map((n) => ({
  id: String(n.id),
  slug: n.slug,
  title: n.title,
  date: n.date,
  readTime: n.readTime,
  category: n.category,
  author: n.author,
  image: n.image,
  excerpt: n.excerpt,
  content: Array.isArray(n.content) ? n.content.map((p) => `<p>${p}</p>`).join('') : n.content
}))

const LOCAL_STORAGE_KEY_PREFIX = 'azhar_admin_'
const DATA_VERSION_KEY = 'azhar_admin_data_seeded_v8'

if (typeof window !== 'undefined' && !localStorage.getItem(DATA_VERSION_KEY)) {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'products')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'clients')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'services')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'testimonials')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'inquiries')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'news')
    localStorage.setItem(DATA_VERSION_KEY, 'true')
  } catch (e) {
    void e
  }
}

const getLocalData = (key, defaultData) => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key)
    if (raw) return JSON.parse(raw)
  } catch {
    return defaultData
  }
  return defaultData
}

const setLocalData = (key, data) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, JSON.stringify(data))
  } catch {
    return
  }
}

export const clearAllAdminData = async () => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'products')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'clients')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'services')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'testimonials')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'inquiries')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'news')
    setLocalData('products', [])
    setLocalData('clients', [])
    setLocalData('services', [])
    setLocalData('testimonials', [])
    setLocalData('inquiries', [])
    setLocalData('news', [])
  } catch {
    void 0
  }

  if (isFirebaseConfigured && db) {
    try {
      const collections = ['products', 'clients', 'services', 'testimonials', 'inquiries', 'news']
      for (const colName of collections) {
        const snap = await getDocs(collection(db, colName))
        for (const d of snap.docs) {
          await deleteDoc(doc(db, colName, d.id))
        }
      }
    } catch {
      return
    }
  }
}

export const loginAdmin = async (email, password, rememberMe = true) => {
  if (isFirebaseConfigured && auth) {
    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      )
    } catch (e) {
      void e
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName || 'Admin Azhar Collection'
    }
  }

  if (email.trim() && password.trim().length >= 5) {
    const mockUser = {
      uid: 'demo-admin-uid',
      email: email.trim(),
      displayName: 'Admin Azhar Collection (Demo)'
    }
    if (rememberMe) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'current_user', JSON.stringify(mockUser))
      sessionStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'current_user')
    } else {
      sessionStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'current_user', JSON.stringify(mockUser))
      localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'current_user')
    }
    return mockUser
  }

  throw new Error('Email atau password tidak valid')
}

export const logoutAdmin = async () => {
  if (isFirebaseConfigured && auth) {
    await signOut(auth)
  }
  localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'current_user')
  sessionStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'current_user')
}

export const subscribeToAuth = (callback) => {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Admin Azhar Collection'
        })
      } else {
        callback(null)
      }
    })
  }

  const getMockUser = () => {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'current_user')
      if (local) return JSON.parse(local)
      const session = sessionStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'current_user')
      if (session) return JSON.parse(session)
    } catch {
      return null
    }
    return null
  }

  callback(getMockUser())
  return () => {}
}

export const getKatalogList = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      }
    } catch {
      return getLocalData('products', portfolioProducts)
    }
  }
  return getLocalData('products', portfolioProducts)
}

export const saveKatalogItem = async (item) => {
  const payload = {
    ...item,
    updatedAt: new Date().toISOString()
  }

  if (isFirebaseConfigured && db) {
    try {
      if (item.id) {
        const ref = doc(db, 'products', item.id)
        await setDoc(ref, payload, { merge: true })
        return item.id
      }
      const colRef = collection(db, 'products')
      const docRef = await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp()
      })
      return docRef.id
    } catch {
      return saveLocalKatalog(payload)
    }
  }
  return saveLocalKatalog(payload)
}

const saveLocalKatalog = (payload) => {
  const current = getLocalData('products', portfolioProducts)
  if (payload.id) {
    const updated = current.map((p) => (p.id === payload.id ? { ...p, ...payload } : p))
    setLocalData('products', updated)
    return payload.id
  }
  const newId = `PROD-${Date.now()}`
  const newItem = { ...payload, id: newId }
  setLocalData('products', [newItem, ...current])
  return newId
}

export const deleteKatalogItem = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'products', id))
    } catch {
      deleteLocalKatalog(id)
    }
  }
  deleteLocalKatalog(id)
}

const deleteLocalKatalog = (id) => {
  const current = getLocalData('products', portfolioProducts)
  const filtered = current.filter((p) => p.id !== id)
  setLocalData('products', filtered)
}

export const getKlienList = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'clients'))
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      }
    } catch {
      return getLocalData('clients', clientsData)
    }
  }
  return getLocalData('clients', clientsData)
}

export const saveKlienItem = async (client) => {
  const payload = {
    ...client,
    updatedAt: new Date().toISOString()
  }

  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'clients', client.id)
      await setDoc(ref, payload, { merge: true })
      return client.id
    } catch {
      return saveLocalKlien(payload)
    }
  }
  return saveLocalKlien(payload)
}

const saveLocalKlien = (payload) => {
  const current = getLocalData('clients', clientsData)
  const index = current.findIndex((c) => c.id === payload.id)
  if (index >= 0) {
    const updated = [...current]
    updated[index] = { ...updated[index], ...payload }
    setLocalData('clients', updated)
    return payload.id
  }
  const newId = payload.id || `klien-${Date.now()}`
  const newItem = { ...payload, id: newId }
  setLocalData('clients', [...current, newItem])
  return newId
}

export const deleteKlienItem = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'clients', id))
    } catch {
      deleteLocalKlien(id)
    }
  }
  deleteLocalKlien(id)
}

const deleteLocalKlien = (id) => {
  const current = getLocalData('clients', clientsData)
  setLocalData('clients', current.filter((c) => c.id !== id))
}

export const getLayananList = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'services'))
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      }
    } catch {
      return getLocalData('services', servicesData)
    }
  }
  return getLocalData('services', servicesData)
}

export const saveLayananItem = async (service) => {
  const payload = {
    ...service,
    updatedAt: new Date().toISOString()
  }

  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'services', service.id)
      await setDoc(ref, payload, { merge: true })
      return service.id
    } catch {
      return saveLocalLayanan(payload)
    }
  }
  return saveLocalLayanan(payload)
}

const saveLocalLayanan = (payload) => {
  const current = getLocalData('services', servicesData)
  const index = current.findIndex((s) => s.id === payload.id)
  if (index >= 0) {
    const updated = [...current]
    updated[index] = { ...updated[index], ...payload }
    setLocalData('services', updated)
    return payload.id
  }
  const newId = payload.id || payload.slug || `layanan-${Date.now()}`
  const newItem = { ...payload, id: newId }
  setLocalData('services', [...current, newItem])
  return newId
}

export const deleteLayananItem = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'services', id))
    } catch {
      deleteLocalLayanan(id)
    }
  }
  deleteLocalLayanan(id)
}

const deleteLocalLayanan = (id) => {
  const current = getLocalData('services', servicesData)
  setLocalData('services', current.filter((s) => s.id !== id))
}

const initialInquiries = [
  {
    id: 'INQ-101',
    name: 'Budi Raharjo',
    institution: 'SMK Negeri 1 Surabaya',
    whatsapp: '081234567890',
    category: 'Seragam Sekolah',
    estimatedQty: '450 Setel',
    message: 'Mohon info penawaran pengadaan seragam OSIS dan seragam kejuruan untuk 450 siswa baru.',
    status: 'Baru',
    createdAt: '2026-09-08T09:30:00.000Z'
  },
  {
    id: 'INQ-102',
    name: 'Dewi Anggraeni',
    institution: 'PT Nusantara Jaya Logistik',
    whatsapp: '081398765432',
    category: 'Kemeja PDH / PDL',
    estimatedQty: '200 Pcs',
    message: 'Perusahaan kami ingin memesan polo shirt dan kemeja kerja bordir komputer logo perusahaan.',
    status: 'Dihubungi',
    createdAt: '2026-09-07T14:15:00.000Z'
  },
  {
    id: 'INQ-103',
    name: 'Ahmad Fauzi',
    institution: 'Universitas Airlangga (BEM)',
    whatsapp: '085712349988',
    category: 'Jas Almamater',
    estimatedQty: '600 Pcs',
    message: 'Konsultasi bahan twist tebal dan sampel bordir emblem untuk jaket almamater fakultas.',
    status: 'Deal',
    createdAt: '2026-09-05T11:00:00.000Z'
  }
]

export const getInquiriesList = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      }
    } catch {
      return getLocalData('inquiries', initialInquiries)
    }
  }
  return getLocalData('inquiries', initialInquiries)
}

export const saveInquiry = async (inquiry) => {
  const payload = {
    ...inquiry,
    createdAt: new Date().toISOString()
  }

  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'inquiries')
      const docRef = await addDoc(colRef, payload)
      return docRef.id
    } catch {
      return saveLocalInquiry(payload)
    }
  }
  return saveLocalInquiry(payload)
}

const saveLocalInquiry = (payload) => {
  const current = getLocalData('inquiries', initialInquiries)
  const newId = `INQ-${Date.now()}`
  const newItem = { ...payload, id: newId }
  setLocalData('inquiries', [newItem, ...current])
  return newId
}

export const updateInquiryStatus = async (id, status) => {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'inquiries', id), { status })
    } catch {
      updateLocalInquiryStatus(id, status)
    }
  }
  updateLocalInquiryStatus(id, status)
}

const updateLocalInquiryStatus = (id, status) => {
  const current = getLocalData('inquiries', initialInquiries)
  const updated = current.map((item) => (item.id === id ? { ...item, status } : item))
  setLocalData('inquiries', updated)
}

export const deleteInquiry = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'inquiries', id))
    } catch {
      deleteLocalInquiry(id)
    }
  }
  deleteLocalInquiry(id)
}

const deleteLocalInquiry = (id) => {
  const current = getLocalData('inquiries', initialInquiries)
  setLocalData('inquiries', current.filter((item) => item.id !== id))
}

export const getTestimonialList = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'testimonials'))
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      }
    } catch {
      return getLocalData('testimonials', defaultTestimonials)
    }
  }
  return getLocalData('testimonials', defaultTestimonials)
}

export const getTestimoniList = getTestimonialList

export const saveTestimonialItem = async (testi) => {
  const payload = {
    ...testi,
    updatedAt: new Date().toISOString()
  }

  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'testimonials', String(testi.id))
      await setDoc(ref, payload, { merge: true })
      return testi.id
    } catch {
      return saveLocalTestimonial(payload)
    }
  }
  return saveLocalTestimonial(payload)
}

const saveLocalTestimonial = (payload) => {
  const current = getLocalData('testimonials', defaultTestimonials)
  const index = current.findIndex((t) => t.id === payload.id)
  if (index >= 0) {
    const updated = [...current]
    updated[index] = { ...updated[index], ...payload }
    setLocalData('testimonials', updated)
    return payload.id
  }
  const newId = payload.id || Date.now()
  const newItem = { ...payload, id: newId }
  setLocalData('testimonials', [...current, newItem])
  return newId
}

export const deleteTestimonialItem = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'testimonials', String(id)))
    } catch {
      deleteLocalTestimonial(id)
    }
  }
  deleteLocalTestimonial(id)
}

const deleteLocalTestimonial = (id) => {
  const current = getLocalData('testimonials', defaultTestimonials)
  setLocalData('testimonials', current.filter((t) => t.id !== id))
}

export const getCompanySettings = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'settings'))
      if (!snap.empty) {
        const found = snap.docs.find((d) => d.id === 'general')
        if (found) return found.data()
      }
    } catch {
      return getLocalData('settings', companyInfo)
    }
  }
  return getLocalData('settings', companyInfo)
}

export const saveCompanySettings = async (settings) => {
  const payload = {
    ...settings,
    updatedAt: new Date().toISOString()
  }

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'settings', 'general'), payload, { merge: true })
    } catch {
      setLocalData('settings', payload)
    }
  }
  setLocalData('settings', payload)
}

export const seedInitialDataToFirestore = async () => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Konfigurasi Firebase belum aktif di file .env')
  }

  const results = {
    products: 0,
    clients: 0,
    services: 0,
    testimonials: 0,
    news: 0
  }

  for (const p of portfolioProducts) {
    await setDoc(doc(db, 'products', p.id), {
      ...p,
      createdAt: serverTimestamp()
    })
    results.products += 1
  }

  for (const c of clientsData) {
    await setDoc(doc(db, 'clients', c.id), {
      ...c,
      createdAt: serverTimestamp()
    })
    results.clients += 1
  }

  for (const s of servicesData) {
    await setDoc(doc(db, 'services', s.id), {
      ...s,
      createdAt: serverTimestamp()
    })
    results.services += 1
  }

  for (const t of defaultTestimonials) {
    await setDoc(doc(db, 'testimonials', String(t.id)), {
      ...t,
      createdAt: serverTimestamp()
    })
    results.testimonials += 1
  }

  for (const n of defaultNews) {
    await setDoc(doc(db, 'news', String(n.id)), {
      ...n,
      createdAt: serverTimestamp()
    })
    results.news += 1
  }

  await setDoc(doc(db, 'settings', 'general'), {
    ...companyInfo,
    updatedAt: serverTimestamp()
  })

  return results
}

export const getKatalogById = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'products', id))
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() }
      }
    } catch {
      const list = getLocalData('products', portfolioProducts)
      return list.find((item) => String(item.id) === String(id)) || null
    }
  }
  const list = getLocalData('products', portfolioProducts)
  return list.find((item) => String(item.id) === String(id)) || null
}

export const getKlienById = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'clients', id))
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() }
      }
    } catch {
      const list = getLocalData('clients', clientsData)
      return list.find((item) => String(item.id) === String(id)) || null
    }
  }
  const list = getLocalData('clients', clientsData)
  return list.find((item) => String(item.id) === String(id)) || null
}

export const getLayananById = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'services', id))
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() }
      }
    } catch {
      const list = getLocalData('services', servicesData)
      return list.find((item) => String(item.id) === String(id)) || null
    }
  }
  const list = getLocalData('services', servicesData)
  return list.find((item) => String(item.id) === String(id)) || null
}

export const getTestimonialById = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'testimonials', String(id)))
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() }
      }
    } catch {
      const list = getLocalData('testimonials', defaultTestimonials)
      return list.find((item) => String(item.id) === String(id)) || null
    }
  }
  const list = getLocalData('testimonials', defaultTestimonials)
  return list.find((item) => String(item.id) === String(id)) || null
}

export const getInquiryById = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'inquiries', id))
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() }
      }
    } catch {
      const list = getLocalData('inquiries', initialInquiries)
      return list.find((item) => String(item.id) === String(id)) || null
    }
  }
  const list = getLocalData('inquiries', initialInquiries)
  return list.find((item) => String(item.id) === String(id)) || null
}

export const getBeritaList = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      }
    } catch {
      return getLocalData('news', defaultNews)
    }
  }
  return getLocalData('news', defaultNews)
}

export const getBeritaById = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'news', String(id)))
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() }
      }
    } catch {
      const list = getLocalData('news', defaultNews)
      return list.find((item) => String(item.id) === String(id)) || null
    }
  }
  const list = getLocalData('news', defaultNews)
  return list.find((item) => String(item.id) === String(id)) || null
}

export const getBeritaBySlug = async (slug) => {
  const list = await getBeritaList()
  return list.find((item) => item.slug === slug || String(item.id) === String(slug)) || null
}

export const saveBeritaItem = async (item) => {
  const payload = {
    ...item,
    updatedAt: new Date().toISOString()
  }

  if (isFirebaseConfigured && db) {
    try {
      if (item.id) {
        const ref = doc(db, 'news', String(item.id))
        await setDoc(ref, payload, { merge: true })
        return item.id
      }
      const colRef = collection(db, 'news')
      const docRef = await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp()
      })
      return docRef.id
    } catch {
      return saveLocalBerita(payload)
    }
  }
  return saveLocalBerita(payload)
}

const saveLocalBerita = (payload) => {
  const current = getLocalData('news', defaultNews)
  if (payload.id) {
    const updated = current.map((p) => (String(p.id) === String(payload.id) ? { ...p, ...payload } : p))
    setLocalData('news', updated)
    return payload.id
  }
  const newId = `NEWS-${Date.now()}`
  const newItem = { ...payload, id: newId }
  setLocalData('news', [newItem, ...current])
  return newId
}

export const deleteBeritaItem = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'news', String(id)))
    } catch {
      deleteLocalBerita(id)
    }
  }
  deleteLocalBerita(id)
}

const deleteLocalBerita = (id) => {
  const current = getLocalData('news', defaultNews)
  const filtered = current.filter((p) => String(p.id) !== String(id))
  setLocalData('news', filtered)
}

