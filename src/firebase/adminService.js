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

const defaultGallery = [
  {
    id: "galeri-1",
    title: "Proses Jahit & Pemotongan Bahan Seragam",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
    date: "10 September 2024"
  },
  {
    id: "galeri-2",
    title: "Bordir Komputer Emblem & Logo Instansi",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    date: "08 September 2024"
  },
  {
    id: "galeri-3",
    title: "Produksi Kemeja PDH / PDL Kerja",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
    date: "05 September 2024"
  },
  {
    id: "galeri-4",
    title: "Pemeriksaan Kualitas (Quality Control)",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
    date: "02 September 2024"
  },
  {
    id: "galeri-5",
    title: "Pengemasan & Finisihing Busana",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80",
    date: "28 Agustus 2024"
  }
]

const defaultNews = defaultGallery

const LOCAL_STORAGE_KEY_PREFIX = 'azhar_admin_'
const DATA_VERSION_KEY = 'azhar_admin_data_seeded_v10'

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
      let docs = []
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        if (!snap.empty) {
          docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        }
      } catch {
        void 0
      }
      if (docs.length === 0) {
        const snap = await getDocs(collection(db, 'products'))
        if (!snap.empty) {
          docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        }
      }
      if (docs.length > 0) {
        setLocalData('products', docs)
        return docs
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
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  if (isFirebaseConfigured && db) {
    try {
      if (item.id) {
        const ref = doc(db, 'products', String(item.id))
        await setDoc(ref, payload, { merge: true })
        saveLocalKatalog(payload)
        return item.id
      }
      const colRef = collection(db, 'products')
      const docRef = await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp()
      })
      saveLocalKatalog({ ...payload, id: docRef.id })
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
    const exists = current.some((p) => String(p.id) === String(payload.id))
    if (exists) {
      const updated = current.map((p) => (String(p.id) === String(payload.id) ? { ...p, ...payload } : p))
      setLocalData('products', updated)
    } else {
      setLocalData('products', [payload, ...current])
    }
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
      await deleteDoc(doc(db, 'products', String(id)))
    } catch {
      deleteLocalKatalog(id)
    }
  }
  deleteLocalKatalog(id)
}

const deleteLocalKatalog = (id) => {
  const current = getLocalData('products', portfolioProducts)
  const filtered = current.filter((p) => String(p.id) !== String(id))
  setLocalData('products', filtered)
}

export const getKlienList = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'clients'))
      if (!snap.empty) {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setLocalData('clients', docs)
        return docs
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
    createdAt: client.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'clients', String(client.id))
      await setDoc(ref, payload, { merge: true })
      saveLocalKlien(payload)
      return client.id
    } catch {
      return saveLocalKlien(payload)
    }
  }
  return saveLocalKlien(payload)
}

const saveLocalKlien = (payload) => {
  const current = getLocalData('clients', clientsData)
  const index = current.findIndex((c) => String(c.id) === String(payload.id))
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
      await deleteDoc(doc(db, 'clients', String(id)))
    } catch {
      deleteLocalKlien(id)
    }
  }
  deleteLocalKlien(id)
}

const deleteLocalKlien = (id) => {
  const current = getLocalData('clients', clientsData)
  setLocalData('clients', current.filter((c) => String(c.id) !== String(id)))
}

export const getLayananList = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'services'))
      if (!snap.empty) {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setLocalData('services', docs)
        return docs
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
    createdAt: service.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'services', String(service.id))
      await setDoc(ref, payload, { merge: true })
      saveLocalLayanan(payload)
      return service.id
    } catch {
      return saveLocalLayanan(payload)
    }
  }
  return saveLocalLayanan(payload)
}

const saveLocalLayanan = (payload) => {
  const current = getLocalData('services', servicesData)
  const index = current.findIndex((s) => String(s.id) === String(payload.id))
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
      await deleteDoc(doc(db, 'services', String(id)))
    } catch {
      deleteLocalLayanan(id)
    }
  }
  deleteLocalLayanan(id)
}

const deleteLocalLayanan = (id) => {
  const current = getLocalData('services', servicesData)
  setLocalData('services', current.filter((s) => String(s.id) !== String(id)))
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
      let docs = []
      try {
        const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        if (!snap.empty) {
          docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        }
      } catch {
        void 0
      }
      if (docs.length === 0) {
        const snap = await getDocs(collection(db, 'inquiries'))
        if (!snap.empty) {
          docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        }
      }
      if (docs.length > 0) {
        setLocalData('inquiries', docs)
        return docs
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
    createdAt: inquiry.createdAt || new Date().toISOString()
  }

  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'inquiries')
      const docRef = await addDoc(colRef, payload)
      saveLocalInquiry({ ...payload, id: docRef.id })
      return docRef.id
    } catch {
      return saveLocalInquiry(payload)
    }
  }
  return saveLocalInquiry(payload)
}

const saveLocalInquiry = (payload) => {
  const current = getLocalData('inquiries', initialInquiries)
  const newId = payload.id || `INQ-${Date.now()}`
  const newItem = { ...payload, id: newId }
  setLocalData('inquiries', [newItem, ...current])
  return newId
}

export const updateInquiryStatus = async (id, status) => {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'inquiries', String(id)), { status })
    } catch {
      updateLocalInquiryStatus(id, status)
    }
  }
  updateLocalInquiryStatus(id, status)
}

const updateLocalInquiryStatus = (id, status) => {
  const current = getLocalData('inquiries', initialInquiries)
  const updated = current.map((item) => (String(item.id) === String(id) ? { ...item, status } : item))
  setLocalData('inquiries', updated)
}

export const deleteInquiry = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'inquiries', String(id)))
    } catch {
      deleteLocalInquiry(id)
    }
  }
  deleteLocalInquiry(id)
}

const deleteLocalInquiry = (id) => {
  const current = getLocalData('inquiries', initialInquiries)
  setLocalData('inquiries', current.filter((item) => String(item.id) !== String(id)))
}

export const getTestimonialList = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'testimonials'))
      if (!snap.empty) {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setLocalData('testimonials', docs)
        return docs
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
    createdAt: testi.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'testimonials', String(testi.id))
      await setDoc(ref, payload, { merge: true })
      saveLocalTestimonial(payload)
      return testi.id
    } catch {
      return saveLocalTestimonial(payload)
    }
  }
  return saveLocalTestimonial(payload)
}

const saveLocalTestimonial = (payload) => {
  const current = getLocalData('testimonials', defaultTestimonials)
  const index = current.findIndex((t) => String(t.id) === String(payload.id))
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
  setLocalData('testimonials', current.filter((t) => String(t.id) !== String(id)))
}

export const getCompanySettings = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'settings'))
      if (!snap.empty) {
        const found = snap.docs.find((d) => d.id === 'general')
        if (found) {
          const data = found.data()
          setLocalData('settings', data)
          return data
        }
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
      setLocalData('settings', payload)
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
    await setDoc(doc(db, 'products', String(p.id)), {
      ...p,
      createdAt: serverTimestamp()
    })
    results.products += 1
  }

  for (const c of clientsData) {
    await setDoc(doc(db, 'clients', String(c.id)), {
      ...c,
      createdAt: serverTimestamp()
    })
    results.clients += 1
  }

  for (const s of servicesData) {
    await setDoc(doc(db, 'services', String(s.id)), {
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
      const snap = await getDoc(doc(db, 'products', String(id)))
      if (snap.exists()) {
        const item = { id: snap.id, ...snap.data() }
        saveLocalKatalog(item)
        return item
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
      const snap = await getDoc(doc(db, 'clients', String(id)))
      if (snap.exists()) {
        const item = { id: snap.id, ...snap.data() }
        saveLocalKlien(item)
        return item
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
      const snap = await getDoc(doc(db, 'services', String(id)))
      if (snap.exists()) {
        const item = { id: snap.id, ...snap.data() }
        saveLocalLayanan(item)
        return item
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
        const item = { id: snap.id, ...snap.data() }
        saveLocalTestimonial(item)
        return item
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
      const snap = await getDoc(doc(db, 'inquiries', String(id)))
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
      let docs = []
      try {
        const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        if (!snap.empty) {
          docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        }
      } catch {
        void 0
      }

      if (docs.length === 0) {
        const snap = await getDocs(collection(db, 'news'))
        if (!snap.empty) {
          docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        }
      }

      if (docs.length > 0) {
        setLocalData('news', docs)
        return docs
      }
    } catch {
      const list = getLocalData('news', defaultGallery)
      return list && list.length > 0 ? list : defaultGallery
    }
  }
  const list = getLocalData('news', defaultGallery)
  return list && list.length > 0 ? list : defaultGallery
}

export const getGalleryList = getBeritaList

export const getBeritaById = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'news', String(id)))
      if (snap.exists()) {
        const item = { id: snap.id, ...snap.data() }
        saveLocalBerita(item)
        return item
      }
    } catch {
      const list = getLocalData('news', defaultGallery)
      const effectiveList = list && list.length > 0 ? list : defaultGallery
      return effectiveList.find((item) => String(item.id) === String(id)) || null
    }
  }
  const list = getLocalData('news', defaultGallery)
  const effectiveList = list && list.length > 0 ? list : defaultGallery
  return effectiveList.find((item) => String(item.id) === String(id)) || null
}

export const getGalleryById = getBeritaById

export const getBeritaBySlug = async (slug) => {
  const list = await getBeritaList()
  return list.find((item) => item.slug === slug || String(item.id) === String(slug)) || null
}

export const saveBeritaItem = async (item) => {
  const payload = {
    ...item,
    title: item.title || '',
    image: item.image || '',
    date: item.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  if (item.id) {
    payload.id = String(item.id)
  }

  if (isFirebaseConfigured && db) {
    try {
      if (item.id) {
        const ref = doc(db, 'news', String(item.id))
        await setDoc(ref, payload, { merge: true })
        saveLocalBerita(payload)
        return item.id
      }
      const colRef = collection(db, 'news')
      const docRef = await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp()
      })
      saveLocalBerita({ ...payload, id: docRef.id })
      return docRef.id
    } catch {
      return saveLocalBerita(payload)
    }
  }
  return saveLocalBerita(payload)
}

const saveLocalBerita = (payload) => {
  const current = getLocalData('news', defaultGallery)
  const effectiveCurrent = current && current.length > 0 ? current : defaultGallery
  if (payload.id) {
    const exists = effectiveCurrent.some((p) => String(p.id) === String(payload.id))
    if (exists) {
      const updated = effectiveCurrent.map((p) => (String(p.id) === String(payload.id) ? { ...p, ...payload } : p))
      setLocalData('news', updated)
    } else {
      setLocalData('news', [payload, ...effectiveCurrent])
    }
    return payload.id
  }
  const newId = `GALERI-${Date.now()}`
  const newItem = { ...payload, id: newId }
  setLocalData('news', [newItem, ...effectiveCurrent])
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
  const current = getLocalData('news', defaultGallery)
  const effectiveCurrent = current && current.length > 0 ? current : defaultGallery
  const filtered = effectiveCurrent.filter((p) => String(p.id) !== String(id))
  setLocalData('news', filtered)
}

export const saveGalleryItem = saveBeritaItem
export const deleteGalleryItem = deleteBeritaItem

const defaultMarketing = [
  {
    id: "haris",
    name: "Ach. Haris",
    division: "Marketing & Pemesanan Tender",
    phone: "+6281330666807",
    waUrl: "https://wa.me/6281330666807?text=Halo%20Pak%20Haris%20Azhar%20Collection%2C%20saya%20ingin%20konsultasi%20pemesanan%20kustom%20seragam.",
    photo: "",
    status: "Online Siap Melayani",
    order: 1
  },
  {
    id: "lazuardi",
    name: "Lazuardi",
    division: "Customer Service & Operasional Produksi",
    phone: "+6287855476538",
    waUrl: "https://wa.me/6287855476538?text=Halo%20Mas%20Lazuardi%20Azhar%20Collection%2C%20saya%20ingin%20tanya%20informasi%20layanan%20konveksi.",
    photo: "",
    status: "Online Siap Melayani",
    order: 2
  }
]

export const getMarketingList = async () => {
  if (isFirebaseConfigured && db) {
    try {
      let docs = []
      try {
        const q = query(collection(db, 'marketing'), orderBy('order', 'asc'))
        const snap = await getDocs(q)
        if (!snap.empty) {
          docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        }
      } catch {
        void 0
      }

      if (docs.length === 0) {
        const snap = await getDocs(collection(db, 'marketing'))
        if (!snap.empty) {
          docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        }
      }

      if (docs.length > 0) {
        setLocalData('marketing', docs)
        return docs
      }
    } catch {
      return getLocalData('marketing', defaultMarketing)
    }
  }
  return getLocalData('marketing', defaultMarketing)
}

export const getMarketingById = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'marketing', String(id)))
      if (snap.exists()) {
        const item = { id: snap.id, ...snap.data() }
        saveLocalMarketing(item)
        return item
      }
    } catch {
      const list = getLocalData('marketing', defaultMarketing)
      return list.find((item) => String(item.id) === String(id)) || null
    }
  }
  const list = getLocalData('marketing', defaultMarketing)
  return list.find((item) => String(item.id) === String(id)) || null
}

export const saveMarketingItem = async (item) => {
  let cleanPhone = (item.phone || '').replace(/\D/g, '')
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1)
  }
  const defaultText = `Halo ${item.name} Azhar Collection, saya ingin konsultasi pemesanan seragam.`
  const waUrl = item.waUrl || `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultText)}`

  const payload = {
    ...item,
    phone: item.phone,
    waUrl,
    order: Number(item.order) || 1,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  if (isFirebaseConfigured && db) {
    try {
      if (item.id) {
        const ref = doc(db, 'marketing', String(item.id))
        await setDoc(ref, payload, { merge: true })
        saveLocalMarketing(payload)
        return item.id
      }
      const colRef = collection(db, 'marketing')
      const docRef = await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp()
      })
      saveLocalMarketing({ ...payload, id: docRef.id })
      return docRef.id
    } catch {
      return saveLocalMarketing(payload)
    }
  }
  return saveLocalMarketing(payload)
}

const saveLocalMarketing = (payload) => {
  const current = getLocalData('marketing', defaultMarketing)
  if (payload.id) {
    const exists = current.some((p) => String(p.id) === String(payload.id))
    if (exists) {
      const updated = current.map((p) => (String(p.id) === String(payload.id) ? { ...p, ...payload } : p))
      setLocalData('marketing', updated)
    } else {
      setLocalData('marketing', [...current, payload])
    }
    return payload.id
  }
  const newId = `MKT-${Date.now()}`
  const newItem = { ...payload, id: newId }
  setLocalData('marketing', [...current, newItem])
  return newId
}

export const deleteMarketingItem = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'marketing', String(id)))
    } catch {
      deleteLocalMarketing(id)
    }
  }
  deleteLocalMarketing(id)
}

const deleteLocalMarketing = (id) => {
  const current = getLocalData('marketing', defaultMarketing)
  const filtered = current.filter((p) => String(p.id) !== String(id))
  setLocalData('marketing', filtered)
}


