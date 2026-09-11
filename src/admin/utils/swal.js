import Swal from 'sweetalert2'

export const showDeleteConfirm = async ({
  title = 'Konfirmasi Hapus Data',
  text = 'Apakah Anda yakin ingin menghapus data ini? Data yang dihapus tidak dapat dipulihkan.'
} = {}) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Hapus Data',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    focusCancel: true
  })
}

export const showSuccessAlert = async (title = 'Berhasil', text = 'Data berhasil disimpan ke sistem.') => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 1500,
    showConfirmButton: false
  })
}

export const showErrorAlert = async (title = 'Terjadi Kesalahan', text = 'Gagal memproses data.') => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#6366f1',
    confirmButtonText: 'Tutup'
  })
}

export const showToast = ({ icon = 'success', title = 'Berhasil' } = {}) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  })
  return Toast.fire({
    icon,
    title
  })
}

export default Swal
