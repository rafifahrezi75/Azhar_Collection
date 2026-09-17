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
  serverTimestamp,
  writeBatch
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

const defaultNews = [
  {
    id: "berita-1",
    title: "Tips Memilih Bahan Kain Seragam Sekolah yang Awet dan Tidak Panas",
    slug: "tips-memilih-bahan-kain-seragam-sekolah",
    author: "Admin Azhar Collection",
    summary: "Panduan lengkap memilih jenis kain Famatex, Oxford, dan Cotton Combed untuk kenyamanan siswa belajar seharian.",
    content: "<p>Memilih bahan kain seragam sekolah merupakan keputusan penting bagi pihak sekolah maupun koperasi. Bahan kain yang berkualitas tidak hanya nyaman digunakan seharian oleh siswa, tetapi juga memiliki daya tahan tinggi terhadap pencucian berulang.</p><p>Beberapa jenis kain unggulan yang direkomendasikan antara lain Kain Famatex untuk celana dan rok, Kain Oxford Super untuk kemeja seragam, serta Cotton Combed untuk kaos olahraga.</p>",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
    date: "12 September 2024"
  },
  {
    id: "berita-2",
    title: "Keunggulan Bordir Komputer Multi-Head untuk Emblem Instansi",
    slug: "keunggulan-bordir-komputer-emblem-instansi",
    author: "Tim Redaksi",
    summary: "Mengapa mesin bordir komputer 12 kepala menghasilkan logo sekolah & dinas lebih presisi dan tahan lama.",
    content: "<p>Dalam produksi seragam dinas dan instansi, kerapatan benang serta presisi logo merupakan hal utama. Dengan teknologi bordir komputer multi-head, proses pembordiran logo instansi dan nama siswa dapat diselesaikan dalam jumlah besar secara cepat dan konsisten.</p>",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    date: "05 September 2024"
  }
]

const defaultServices = [
  {
    id: "layanan-1",
    title: "Jahitan Rapi & Berstandar Mutu",
    shortDesc: "Layanan jahit seragam olahraga, busana muslim, dan mukena dengan standar QC ketat, jahitan obras ganda, serta kelim rapi presisi.",
    moq: "12 Pcs",
    leadTime: "7 - 14 Hari",
    materials: "Katun Combed, Polyester, Rayon, Toyobo, Wolfis",
    fullDesc: "<p>Menghadirkan layanan penjahitan berkualitas tinggi yang dikerjakan oleh tenaga penjahit terampil dan berpengalaman. Setiap helai pakaian melalui proses inspeksi Quality Control (QC) menyeluruh guna memastikan jahitan kokoh, lurus, tidak mudah robek, dan nyaman dikenakan untuk pemakaian jangka panjang.</p><ul><li>Jahitan obras dan kelim rapi presisi di setiap sisi</li><li>Pemeriksaan QC ketat pada ukuran, kerapian benang, dan kekuatan sambungan</li><li>Finishing lipat rapi dan pengemasan terstandarisasi</li></ul>",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    icon: "Shirt"
  },
  {
    id: "layanan-2",
    title: "DTF Sablon (Digital Transfer Film)",
    shortDesc: "Jasa cetak sablon digital DTF resolusi tinggi yang lentur, warna tajam, dan memiliki ketahanan cuci maksimal.",
    moq: "12 Pcs",
    leadTime: "3 - 7 Hari",
    materials: "Film DTF Premium, Tinta Pigment DTF, Hot Melt Adhesive Powder",
    fullDesc: "<p>Solusi sablon modern untuk kaos, seragam olahraga, maupun atribut komunitas. Menggunakan teknologi transfer film digital berpresisi tinggi yang mampu mencetak gradasi warna rumit dan logo instansi secara mendetail dengan daya rekat serat kain yang kuat serta tahan lama.</p><ul><li>Warna cerah, tajam, dan tidak mudah retak atau mengelupas saat dicuci</li><li>Cocok untuk penempatan logo sekolah, nama instansi, hingga desain grafis custom</li><li>Proses press panas optimal untuk hasil menempel sempurna</li></ul>",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    icon: "Cpu"
  },
  {
    id: "layanan-3",
    title: "Kustom Sesuai Permintaan",
    shortDesc: "Layanan kustomisasi penuh mulai dari pemilihan pola, kombinasi warna bahan, penentuan ukuran bertingkat, hingga model khusus.",
    moq: "24 Pcs",
    leadTime: "7 - 14 Hari",
    materials: "Pilihan Material Sesuai Request (Katun, Drill, Polyester, Kain Perca Upcycle)",
    fullDesc: "<p>Fleksibilitas produksi penuh yang disesuaikan dengan kebutuhan dan spesifikasi unik pelanggan, baik untuk kebutuhan sekolah, komunitas, majelis, maupun suvenir kreatif. Kami membantu mewujudkan konsep desain Anda mulai dari pembuatan pola awal hingga produk jadi siap pakai.</p><ul><li>Bebas tentukan desain model kerah, lengan, pola kombinasi, dan variasi saku</li><li>Tersedia rentang ukuran kustom lengkap (anak-anak hingga dewasa/big size)</li><li>Konsultasi pemilihan bahan baku dan aksesori pendukung</li></ul>",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    icon: "Scissors"
  }
]

const LOCAL_STORAGE_KEY_PREFIX = 'azhar_admin_'
const DATA_VERSION_KEY = 'azhar_admin_data_seeded_v19'

if (typeof window !== 'undefined' && !localStorage.getItem(DATA_VERSION_KEY)) {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'products')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'clients')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'services')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'testimonials')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'inquiries')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'news')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'settings')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'timeline')
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'marketing')
    localStorage.setItem(DATA_VERSION_KEY, 'true')

    if (isFirebaseConfigured && db) {
      getDocs(collection(db, 'services')).then(async (snap) => {
        for (const d of snap.docs) {
          await deleteDoc(doc(db, 'services', d.id)).catch(() => {})
        }
        for (const s of defaultServices) {
          await setDoc(doc(db, 'services', s.id), s).catch(() => {})
        }
      }).catch(() => {})
    }
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
  if (!email || !email.trim()) {
    throw new Error('Email administrator wajib diisi. Silakan masukkan alamat email Anda.')
  }
  if (!password || password.trim().length < 5) {
    throw new Error('Kata sandi wajib diisi minimal 5 karakter.')
  }

  if (isFirebaseConfigured && auth) {
    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      )
    } catch (e) {
      void e
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password)
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || 'Admin Azhar Collection'
      }
    } catch (err) {
      const code = err?.code || ''
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        throw new Error('Email atau kata sandi yang Anda masukkan salah. Silakan periksa kembali data login Anda.')
      }
      if (code === 'auth/invalid-email') {
        throw new Error('Format email tidak valid. Pastikan penulisan email sudah benar (contoh: admin@azharcollection.com).')
      }
      if (code === 'auth/too-many-requests') {
        throw new Error('Terlalu banyak percobaan masuk yang gagal. Akses ditahan sementara demi keamanan, silakan coba beberapa saat lagi.')
      }
      if (code === 'auth/network-request-failed') {
        throw new Error('Koneksi jaringan terputus. Pastikan perangkat Anda terhubung ke internet.')
      }
      if (code === 'auth/user-disabled') {
        throw new Error('Akun administrator ini telah dinonaktifkan. Silakan hubungi pengelola sistem.')
      }
      throw new Error(err?.message || 'Terjadi kesalahan saat melakukan verifikasi login.')
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

  throw new Error('Email atau kata sandi tidak valid (minimal 5 karakter).')
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
      if (client.id) {
        const ref = doc(db, 'clients', String(client.id))
        await setDoc(ref, payload, { merge: true })
        saveLocalKlien(payload)
        return client.id
      }
      const colRef = collection(db, 'clients')
      const docRef = await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp()
      })
      saveLocalKlien({ ...payload, id: docRef.id })
      return docRef.id
    } catch {
      return saveLocalKlien(payload)
    }
  }
  return saveLocalKlien(payload)
}

const saveLocalKlien = (payload) => {
  const current = getLocalData('clients', clientsData)
  if (payload.id) {
    const exists = current.some((c) => String(c.id) === String(payload.id))
    if (exists) {
      const updated = current.map((c) => (String(c.id) === String(payload.id) ? { ...c, ...payload } : c))
      setLocalData('clients', updated)
    } else {
      setLocalData('clients', [payload, ...current])
    }
    return payload.id
  }
  const newId = `klien-${Date.now()}`
  const newItem = { ...payload, id: newId }
  setLocalData('clients', [newItem, ...current])
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
      return getLocalData('services', defaultServices)
    }
  }
  return getLocalData('services', defaultServices)
}

export const saveLayananItem = async (service) => {
  const payload = {
    ...service,
    createdAt: service.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  if (isFirebaseConfigured && db) {
    try {
      if (service.id) {
        const ref = doc(db, 'services', String(service.id))
        await setDoc(ref, payload, { merge: true })
        saveLocalLayanan(payload)
        return service.id
      }
      const colRef = collection(db, 'services')
      const docRef = await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp()
      })
      saveLocalLayanan({ ...payload, id: docRef.id })
      return docRef.id
    } catch {
      return saveLocalLayanan(payload)
    }
  }
  return saveLocalLayanan(payload)
}

const saveLocalLayanan = (payload) => {
  const current = getLocalData('services', defaultServices)
  if (payload.id) {
    const exists = current.some((s) => String(s.id) === String(payload.id))
    if (exists) {
      const updated = current.map((s) => (String(s.id) === String(payload.id) ? { ...s, ...payload } : s))
      setLocalData('services', updated)
    } else {
      setLocalData('services', [payload, ...current])
    }
    return payload.id
  }
  const newId = payload.slug || `layanan-${Date.now()}`
  const newItem = { ...payload, id: newId }
  setLocalData('services', [newItem, ...current])
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
  const current = getLocalData('services', defaultServices)
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
      if (testi.id) {
        const ref = doc(db, 'testimonials', String(testi.id))
        await setDoc(ref, payload, { merge: true })
        saveLocalTestimonial(payload)
        return testi.id
      }
      const colRef = collection(db, 'testimonials')
      const docRef = await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp()
      })
      saveLocalTestimonial({ ...payload, id: docRef.id })
      return docRef.id
    } catch {
      return saveLocalTestimonial(payload)
    }
  }
  return saveLocalTestimonial(payload)
}

const saveLocalTestimonial = (payload) => {
  const current = getLocalData('testimonials', defaultTestimonials)
  if (payload.id) {
    const exists = current.some((t) => String(t.id) === String(payload.id))
    if (exists) {
      const updated = current.map((t) => (String(t.id) === String(payload.id) ? { ...t, ...payload } : t))
      setLocalData('testimonials', updated)
    } else {
      setLocalData('testimonials', [...current, payload])
    }
    return payload.id
  }
  const newId = `TESTI-${Date.now()}`
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

const defaultCompanySettings = {
  name: 'Azhar Collection',
  legalName: 'CV. Azhar Collection Konveksi',
  tagline: 'Produsen Konveksi & Jahit Kustom Terpercaya - Garansi Mutu Nomor 1',
  phonePrimary: '+6281330666807',
  phoneSecondary: '+6287855476538',
  contactPersonPrimary: 'Ach. Haris',
  contactPersonSecondary: 'Lazuardi',
  phone: '+6281330666807',
  whatsapp: '6281330666807',
  email: 'azharcollection@gmail.com',
  address: 'Damarsi Rt.03 Rw.01, Kec. Buduran, Kab. Sidoarjo, Jawa Timur 61252',
  workingHours: 'Senin - Sabtu: 08.00 - 17.00 WIB',
  hours: 'Senin - Sabtu: 08.00 - 17.00 WIB',
  city: 'Sidoarjo',
  regency: 'Kabupaten Sidoarjo',
  province: 'Jawa Timur',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sAzhar+Collection+Buduran!6i17',
  mapsUrl: 'https://maps.app.goo.gl/BAAqNXmsJQaVS2pn6',
  socials: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    whatsapp: 'https://wa.me/6281330666807'
  },
  vision: 'Menjadi perusahaan konveksi nasional terpercaya untuk seragam olahraga sekolah serta didukung lini mukena, jilbab serta produk hiasan dari kain perca yang berkelanjutan (sustain). Memberdayakan ekonomi masyarakat sekitar dengan jangkauan pasar ke seluruh pulau di Indonesia pada tahun 2032.',
  mission: `Menjamin kualitas seragam olahraga nomor satu melalui kontrol bahan baku dan proses jahit yang ketat serta sertifikasi standar mutu.
Menciptakan desain seragam yang timeless (tidak mengikuti fast fashion) sehingga bisa dipakai minimal 3 tahun tanpa perlu ganti model.
Memperluas pasar ke luar pulau melalui promosi digital dan kemitraan dengan dinas pendidikan.
Merekrut dan melatih ulang karyawan rumahan dengan sistem insentif berdasarkan ketepatan waktu, bukan hanya jumlah jahitan.
Memberdayakan minimal 20 ibu-ibu tetangga sebagai penjahit & perajin hiasan dari kain perca.
Menjalankan pemasaran digital terintegrasi (Instagram, TikTok, WhatsApp Business, website).`
}

const defaultTimeline = [
  {
    id: "karir-1",
    year: "Sebelum 1980-an",
    title: "Warisan Usaha Jahit Keluarga",
    badge: "Warisan Keluarga",
    desc: "Usaha dimulai sebagai kelanjutan usaha keluarga, menjahit celana dan seragam militer (termasuk seragam Brimob) hingga sekitar 1.000 potong per pesanan.",
    order: 1
  },
  {
    id: "karir-2",
    year: "Akhir 1990-an (±1998)",
    title: "Usaha Mandiri & Spesialisasi Bolero",
    badge: "Langkah Mandiri",
    desc: "Pemilik merintis usaha sendiri (busana muslim & kaos) dengan spesialisasi desain bolero; pesanan mulai berkembang ke skala 30 potong per order di awal 2000-an.",
    order: 2
  },
  {
    id: "karir-3",
    year: "Tahun 2005",
    title: "Pindah ke Lokasi Produksi Saat Ini",
    badge: "Fondasi Baru",
    desc: "Usaha pindah dari Sidokare ke lokasi workshop sekarang, mulai dikelola bersama oleh pemilik dan iparnya.",
    order: 3
  },
  {
    id: "karir-4",
    year: "Tahun 2010 - 2016",
    title: "Penambahan Tim & Perluasan Pasar Luar Pulau",
    badge: "Ekspansi Pasar",
    desc: "Jumlah karyawan bertambah menjadi 6 orang (2010); jangkauan pasar meluas hingga NTB, Riau, dan Banjarmasin (2016).",
    order: 4
  },
  {
    id: "karir-5",
    year: "Tahun 2019 - Sekarang",
    title: "Skala Produksi Besar & Menuju Zero Waste",
    badge: "Menuju Berkelanjutan",
    desc: "Mencapai pesanan hingga 1.000 stel dalam satu order (2019); kini mengembangkan lini produk zero waste dari kain perca menuju visi ekspansi nasional 2032.",
    order: 5
  }
]

export const getCompanySettings = async () => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'settings'))
      if (!snap.empty) {
        const found = snap.docs.find((d) => d.id === 'general')
        if (found) {
          const data = found.data()
          setLocalData('settings', { ...defaultCompanySettings, ...data })
          return { ...defaultCompanySettings, ...data }
        }
      }
    } catch {
      return getLocalData('settings', defaultCompanySettings)
    }
  }
  return getLocalData('settings', defaultCompanySettings)
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
      const list = getLocalData('services', defaultServices)
      return list.find((item) => String(item.id) === String(id)) || null
    }
  }
  const list = getLocalData('services', defaultServices)
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

// --- BERITA / ARTIKEL CRUD ---
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
      const list = getLocalData('news', defaultNews)
      return list && list.length > 0 ? list : defaultNews
    }
  }
  const list = getLocalData('news', defaultNews)
  return list && list.length > 0 ? list : defaultNews
}

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
      const list = getLocalData('news', defaultNews)
      const effectiveList = list && list.length > 0 ? list : defaultNews
      return effectiveList.find((item) => String(item.id) === String(id)) || null
    }
  }
  const list = getLocalData('news', defaultNews)
  const effectiveList = list && list.length > 0 ? list : defaultNews
  return effectiveList.find((item) => String(item.id) === String(id)) || null
}

export const getBeritaBySlug = async (slug) => {
  const list = await getBeritaList()
  return list.find((item) => item.slug === slug || String(item.id) === String(slug)) || null
}

export const saveBeritaItem = async (item) => {
  const payload = {
    ...item,
    title: item.title || '',
    author: item.author || 'Admin Azhar Collection',
    summary: item.summary || '',
    content: item.content || '',
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
  const current = getLocalData('news', defaultNews)
  const effectiveCurrent = current && current.length > 0 ? current : defaultNews
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
  const newId = `BERITA-${Date.now()}`
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
  const current = getLocalData('news', defaultNews)
  const effectiveCurrent = current && current.length > 0 ? current : defaultNews
  const filtered = effectiveCurrent.filter((p) => String(p.id) !== String(id))
  setLocalData('news', filtered)
}

// --- GALERI FOTO CRUD ---
export const getGalleryList = async () => {
  if (isFirebaseConfigured && db) {
    try {
      let docs = []
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        if (!snap.empty) {
          docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        }
      } catch {
        void 0
      }

      if (docs.length === 0) {
        const snap = await getDocs(collection(db, 'gallery'))
        if (!snap.empty) {
          docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        }
      }

      if (docs.length > 0) {
        setLocalData('gallery', docs)
        return docs
      }
    } catch {
      const list = getLocalData('gallery', defaultGallery)
      return list && list.length > 0 ? list : defaultGallery
    }
  }
  const list = getLocalData('gallery', defaultGallery)
  return list && list.length > 0 ? list : defaultGallery
}

export const getGalleryById = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'gallery', String(id)))
      if (snap.exists()) {
        const item = { id: snap.id, ...snap.data() }
        saveLocalGallery(item)
        return item
      }
    } catch {
      const list = getLocalData('gallery', defaultGallery)
      const effectiveList = list && list.length > 0 ? list : defaultGallery
      return effectiveList.find((item) => String(item.id) === String(id)) || null
    }
  }
  const list = getLocalData('gallery', defaultGallery)
  const effectiveList = list && list.length > 0 ? list : defaultGallery
  return effectiveList.find((item) => String(item.id) === String(id)) || null
}

export const saveGalleryItem = async (item) => {
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
        const ref = doc(db, 'gallery', String(item.id))
        await setDoc(ref, payload, { merge: true })
        saveLocalGallery(payload)
        return item.id
      }
      const colRef = collection(db, 'gallery')
      const docRef = await addDoc(colRef, {
        ...payload,
        createdAt: serverTimestamp()
      })
      saveLocalGallery({ ...payload, id: docRef.id })
      return docRef.id
    } catch {
      return saveLocalGallery(payload)
    }
  }
  return saveLocalGallery(payload)
}

const saveLocalGallery = (payload) => {
  const current = getLocalData('gallery', defaultGallery)
  const effectiveCurrent = current && current.length > 0 ? current : defaultGallery
  if (payload.id) {
    const exists = effectiveCurrent.some((p) => String(p.id) === String(payload.id))
    if (exists) {
      const updated = effectiveCurrent.map((p) => (String(p.id) === String(payload.id) ? { ...p, ...payload } : p))
      setLocalData('gallery', updated)
    } else {
      setLocalData('gallery', [payload, ...effectiveCurrent])
    }
    return payload.id
  }
  const newId = `GALERI-${Date.now()}`
  const newItem = { ...payload, id: newId }
  setLocalData('gallery', [newItem, ...effectiveCurrent])
  return newId
}

export const deleteGalleryItem = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'gallery', String(id)))
    } catch {
      deleteLocalGallery(id)
    }
  }
  deleteLocalGallery(id)
}

const deleteLocalGallery = (id) => {
  const current = getLocalData('gallery', defaultGallery)
  const effectiveCurrent = current && current.length > 0 ? current : defaultGallery
  const filtered = effectiveCurrent.filter((p) => String(p.id) !== String(id))
  setLocalData('gallery', filtered)
}

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

// --- PERJALANAN KARIR / TIMELINE CRUD ---
export const getTimelineList = async () => {
  if (isFirebaseConfigured && db) {
    try {
      let docs = []
      try {
        const q = query(collection(db, 'timeline'), orderBy('order', 'asc'))
        const snap = await getDocs(q)
        if (!snap.empty) {
          docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        }
      } catch {
        void 0
      }

      if (docs.length === 0) {
        const snap = await getDocs(collection(db, 'timeline'))
        if (!snap.empty) {
          docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        }
      }

      if (docs.length > 0) {
        setLocalData('timeline', docs)
        return docs
      }
    } catch {
      return getLocalData('timeline', defaultTimeline)
    }
  }
  return getLocalData('timeline', defaultTimeline)
}

export const getTimelineById = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'timeline', String(id)))
      if (snap.exists()) {
        const item = { id: snap.id, ...snap.data() }
        saveLocalTimeline(item)
        return item
      }
    } catch {
      const list = getLocalData('timeline', defaultTimeline)
      return list.find((item) => String(item.id) === String(id)) || null
    }
  }
  const list = getLocalData('timeline', defaultTimeline)
  return list.find((item) => String(item.id) === String(id)) || null
}

export const saveTimelineItem = async (item) => {
  const currentList = await getTimelineList()
  const payloadId = item.id || `KARIR-${Date.now()}`
  const requestedOrder = Number(item.order) || (currentList.length + 1)

  const payload = {
    ...item,
    id: payloadId,
    year: item.year || '',
    title: item.title || '',
    badge: item.badge || '',
    desc: item.desc || '',
    order: requestedOrder,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const existingFiltered = currentList.filter((t) => String(t.id) !== String(payloadId))
  const insertIndex = Math.max(0, Math.min(requestedOrder - 1, existingFiltered.length))
  existingFiltered.splice(insertIndex, 0, payload)

  const normalized = existingFiltered.map((t, index) => ({
    ...t,
    order: index + 1
  }))

  await reorderTimelineList(normalized)
  return payloadId
}

const saveLocalTimeline = (payload) => {
  const current = getLocalData('timeline', defaultTimeline)
  if (payload.id) {
    const exists = current.some((p) => String(p.id) === String(payload.id))
    if (exists) {
      const updated = current.map((p) => (String(p.id) === String(payload.id) ? { ...p, ...payload } : p))
      setLocalData('timeline', updated)
    } else {
      setLocalData('timeline', [...current, payload])
    }
    return payload.id
  }
  const newId = `KARIR-${Date.now()}`
  const newItem = { ...payload, id: newId }
  setLocalData('timeline', [...current, newItem])
  return newId
}

export const deleteTimelineItem = async (id) => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'timeline', String(id)))
    } catch {
      deleteLocalTimeline(id)
    }
  }
  deleteLocalTimeline(id)
}

const deleteLocalTimeline = (id) => {
  const current = getLocalData('timeline', defaultTimeline)
  const filtered = current.filter((p) => String(p.id) !== String(id))
  setLocalData('timeline', filtered)
}

export const reorderTimelineList = async (items) => {
  const updatedItems = items.map((item, index) => ({
    ...item,
    order: index + 1
  }))

  setLocalData('timeline', updatedItems)

  if (isFirebaseConfigured && db) {
    try {
      const batch = writeBatch(db)
      updatedItems.forEach((item) => {
        if (item.id) {
          const ref = doc(db, 'timeline', String(item.id))
          batch.set(ref, item, { merge: true })
        }
      })
      await batch.commit()
    } catch {
      void 0
    }
  }

  return updatedItems
}



