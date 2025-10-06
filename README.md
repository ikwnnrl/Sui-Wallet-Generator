# 🔑 SUI Wallet Toolkit Interaktif

Toolkit **Node.js** sederhana untuk membuat, mengonversi, dan membaca dompet **SUI** secara massal.  
Mendukung pembuatan banyak wallet sekaligus, konversi seed phrase menjadi private key, serta menampilkan daftar alamat SUI secara otomatis.

---

## 🚀 Fitur Utama

- **Buat Dompet Baru (Massal)**  
  Membuat banyak dompet SUI sekaligus lengkap dengan mnemonic, address, dan private key (Base64).  
  Hasil disimpan di folder `hasil/`.

- **Konversi Seed → Private Key (Otomatis)**  
  Mengonversi semua *seed phrase* di `hasil/seedpharse.txt` menjadi file `hasil/pk_from_seed.txt`.

- **Lihat Alamat dari File Default (Otomatis)**  
  Membaca dan menampilkan semua address dari `seedpharse.txt` dan `suipriv.txt`.

- **Tanpa Input Manual untuk Opsi 2 & 3**  
  Proses konversi dan pembacaan dijalankan otomatis tanpa perlu interaksi tambahan.

---

## ⚙️ Persyaratan

### 1. Instalasi Modul
Pastikan Node.js versi 18+ telah terinstal, lalu jalankan:
```bash
npm install @mysten/sui bip39
```

---

## 🧩 Cara Menjalankan

1. Jalankan skrip:
   ```bash
   node wallet.js
   ```

2. Pilih menu yang tersedia:
   ```
   1. Buat Dompet SUI Baru (Massal)
   2. Konversi 'seedpharse.txt' -> 'pk_from_seed.txt' (Otomatis)
   3. Lihat Alamat dari File Default (Otomatis)
   4. Keluar
   ```

3. Hasil akan otomatis tersimpan di folder:
   ```
   hasil/
   ├── seedpharse.txt
   ├── address.txt
   ├── suipriv.txt
   └── pk_from_seed.txt
   ```

---

## 📂 Contoh Struktur Folder & File

### Folder Output: `hasil/`
| File | Keterangan |
|------|-------------|
| `seedpharse.txt` | Berisi daftar *mnemonic phrase* (12 kata) dari dompet yang dibuat. |
| `address.txt` | Berisi daftar alamat SUI hasil dari pembuatan dompet. |
| `suipriv.txt` | Berisi daftar *private key* (Base64) yang dihasilkan. |
| `pk_from_seed.txt` | Berisi *private key* hasil konversi dari file seed. |

---

## 📄 Contoh Isi File

### `seedpharse.txt`
```
===== SUI Seed Phrases =====

ripple assume clog medal gap magnet split betray seven picnic truck swift
mimic faculty lunch coin turtle device foam bridge dirt tone fade defy
```

### `address.txt`
```
===== SUI Addresses =====

0x3f2b8f1f0aa6bbdcb6ee35f7f88d1723d5a62d89
0x11c89abf23e13ef2dca62a81a22f31f1e657acb4
```

### `suipriv.txt`
```
===== SUI Private Keys (Base64) =====

EjWm4vTudB2gHoHW7nDHyW98z6pEqgH02lpgaj0dCzk=
DqvI2X+aaPmbUWRHt7R6F+W2RryBDb7g28SpInQlFas=
```

### `pk_from_seed.txt`
```
===== SUI Private Keys (Base64) - Hasil Konversi =====

6tZYd8JZQOUL7T8kEU2QFvhqEmcSAbFGWz7shgRxAwc=
NzcG3b8hPW9AT6u7sM9dm6DRXQFq8Yj3U4+Wptbt2JA=
```

---

## 🧠 Catatan Teknis

- Setiap private key disimpan dalam format **Base64**.  
- Derivasi wallet menggunakan `Ed25519Keypair` dari paket `@mysten/sui`.  
- Mnemonic dihasilkan menggunakan `bip39.generateMnemonic()`.  
- Semua file otomatis dibuat di folder `hasil/` jika belum ada.

---

## ⚠️ Peringatan Keamanan

> - **Jangan pernah membagikan file `seedpharse.txt`, `suipriv.txt`, atau `pk_from_seed.txt` ke siapa pun.**  
> - Simpan semua file hasil di lokasi yang aman dan terenkripsi.  
> - File tersebut berisi *private key* dan *seed phrase* yang dapat digunakan untuk mengakses aset Anda.  
> - Script ini hanya untuk keperluan **eksperimen dan pengujian**.

---

## 👨‍💻 Pembuat
**SUI Wallet Toolkit Interaktif**  
Dibuat oleh: **iwwwit**  
Lisensi: **MIT License**
