# Sistem Manajemen Perpustakaan

Aplikasi web untuk mengelola perpustakaan dengan fitur manajemen buku, anggota, dan peminjaman.

## Teknologi yang Digunakan

### Backend
- Spring Boot
- MySQL
- JPA/Hibernate
- Maven

### Frontend
- React.js
- Material-UI
- Axios

## Fitur

- Manajemen Buku
  - Tambah buku baru
  - Lihat daftar buku
  - Edit informasi buku
  - Hapus buku

- Manajemen Anggota
  - Pendaftaran anggota baru
  - Lihat daftar anggota
  - Edit informasi anggota
  - Hapus anggota

- Manajemen Peminjaman
  - Peminjaman buku
  - Pengembalian buku
  - Riwayat peminjaman

## Cara Menjalankan Aplikasi

### Persiapan
1. Install Java JDK 17
2. Install Node.js
3. Install XAMPP
4. Buat database `library_db` di MySQL

### Backend
1. Buka folder `backend`
2. Jalankan aplikasi Spring Boot
```bash
./mvnw spring-boot:run