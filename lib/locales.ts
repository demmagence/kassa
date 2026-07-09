// Bahasa Indonesia translations
const id: Record<string, string> = {
  // Navbar
  "Dashboard Overview": "Ikhtisar Dashboard",
  "Transaction Log": "Log Transaksi",
  "Cash Flow Analytics": "Analisis Arus Kas",
  "System Settings": "Pengaturan Sistem",
  "Financial Dashboard": "Dashboard Keuangan",
  "Manage, analyze and track your real-time revenue operations.": "Kelola, analisis, dan lacak operasi pendapatan real-time Anda.",
  "Search transactions...": "Cari transaksi...",
  "New Transaction": "Transaksi Baru",
  "Notifications": "Notifikasi",
  "new": "baru",
  "No notifications": "Tidak ada notifikasi",

  // Sidebar
  "Dashboard": "Dashboard",
  "Transactions": "Transaksi",
  "Analytics": "Analitik",
  "Settings": "Pengaturan",
  "Finance Suite": "Suite Keuangan",

  // Date & Time
  "Just now": "Baru saja",
  "minutes ago": "menit yang lalu",
  "hours ago": "jam yang lalu",
  "day ago": "hari yang lalu",
  "days ago": "hari yang lalu",
  "vs last month": "vs bulan lalu",

  // Stat Cards
  "Net Balance": "Saldo Bersih",
  "Total Income": "Total Pendapatan",
  "Total Expenses": "Total Pengeluaran",
  "Savings Rate": "Tingkat Tabungan",

  // Transaction Table
  "Recent Transactions": "Transaksi Terbaru",
  "Monitor and audit all cash flow operations": "Pantau dan audit semua operasi arus kas",
  "all": "semua",
  "income": "pemasukan",
  "expense": "pengeluaran",
  "Transaction": "Transaksi",
  "Category": "Kategori",
  "Date": "Tanggal",
  "Amount": "Jumlah",
  "Status": "Status",
  "Completed": "Selesai",
  "Pending": "Menunggu",
  "Failed": "Gagal",
  "No transactions found matching the selected filters.": "Tidak ada transaksi yang cocok dengan filter yang dipilih.",
  "ID:": "ID:",

  // Cash Flow Chart
  "Cash Flow Trend": "Tren Arus Kas",
  "Income vs. Expense visualization over time": "Visualisasi Pendapatan vs Pengeluaran dari waktu ke waktu",
  "Monthly": "Bulanan",
  "Weekly": "Mingguan",
  "Income": "Pemasukan",
  "Expense": "Pengeluaran",
  "Net Flow:": "Arus Bersih:",

  // Smart Insights
  "Smart Insights": "Wawasan Cerdas",
  "No transactions recorded for the current billing cycle. Add new income or expenses to generate smart financial insights.": "Belum ada transaksi untuk periode ini. Tambahkan pemasukan atau pengeluaran untuk mendapatkan wawasan keuangan.",
  "Once data is logged, we will analyze your spending patterns, cash runway, and savings margin.": "Setelah data masuk, kami akan menganalisis pola pengeluaran, ketahanan kas, dan margin tabungan Anda.",
  "Your net balance is": "Saldo bersih Anda adalah",
  "this month. This is driven by": "bulan ini. Ini didorong oleh",
  "in total revenue against": "total pendapatan dibandingkan",
  "in operational expenses.": "pengeluaran operasional.",
  "Based on your current spending patterns, we project your next month expenses to be around": "Berdasarkan pola pengeluaran saat ini, kami memproyeksikan pengeluaran bulan depan sekitar",
  "leaving an estimated savings rate of": "dengan perkiraan tingkat tabungan",
  "Monthly budget limit status:": "Status batas anggaran bulanan:",
  "Remaining": "Tersisa",
  "Good": "Baik",
  "Warning": "Peringatan",
  "Critical": "Kritis",

  // Settings - General
  "General Configuration": "Konfigurasi Umum",
  "Settings Panel": "Panel Pengaturan",
  "Configure your personal and corporate preferences.": "Konfigurasikan preferensi pribadi dan perusahaan Anda.",
  "Account Name": "Nama Akun",
  "Corporate Email": "Email Perusahaan",
  "Base Currency": "Mata Uang Dasar",
  "Language Preference": "Preferensi Bahasa",
  "Cancel Changes": "Batalkan Perubahan",
  "Save Changes": "Simpan Perubahan",
  "General Configuration saved successfully!": "Konfigurasi umum berhasil disimpan!",
  "Changes discarded.": "Perubahan dibatalkan.",

  // Settings - Security
  "Manage authentication, session controls, and access policies.": "Kelola autentikasi, kontrol sesi, dan kebijakan akses.",
  "Change Password": "Ubah Kata Sandi",
  "Current Password": "Kata Sandi Saat Ini",
  "New Password": "Kata Sandi Baru",
  "Confirm New Password": "Konfirmasi Kata Sandi Baru",
  "Update Password": "Perbarui Kata Sandi",
  "Password updated successfully!": "Kata sandi berhasil diperbarui!",
  "Session Management": "Manajemen Sesi",
  "Two-Factor Authentication": "Autentikasi Dua Faktor",
  "Add an extra layer of security to your account": "Tambahkan lapisan keamanan ekstra ke akun Anda",
  "Disabled": "Nonaktif",
  "Active Sessions": "Sesi Aktif",
  "active session on this device": "sesi aktif di perangkat ini",
  "Revoke All": "Cabut Semua",
  "Auto-Lock Timeout": "Batas Waktu Kunci Otomatis",
  "Automatically lock after inactivity": "Kunci otomatis setelah tidak ada aktivitas",
  "minutes": "menit",

  // Settings - Database
  "Monitor database connection, sync status, and data management.": "Pantau koneksi database, status sinkronisasi, dan manajemen data.",
  "Connection Status": "Status Koneksi",
  "MongoDB Atlas": "MongoDB Atlas",
  "Connected": "Terhubung",
  "Last Sync": "Sinkronisasi Terakhir",
  "Automatic sync every 5 minutes": "Sinkronisasi otomatis setiap 5 menit",
  "Storage Used": "Penyimpanan Digunakan",
  "Free tier: 512 MB available": "Tingkat gratis: 512 MB tersedia",
  "Data Management": "Manajemen Data",
  "Force Sync": "Sinkronisasi Paksa",
  "Manually trigger a database sync": "Picu sinkronisasi database secara manual",
  "Export Data": "Ekspor Data",
  "Download transactions as JSON/CSV": "Unduh transaksi sebagai JSON/CSV",
  "Create Backup": "Buat Cadangan",
  "Snapshot current database state": "Ambil snapshot status database saat ini",
  "Clear All Data": "Hapus Semua Data",
  "Permanently delete all transactions": "Hapus semua transaksi secara permanen",
  "Syncing database...": "Menyinkronkan database...",
  "Database synchronized successfully!": "Database berhasil disinkronkan!",
  "Sync completed with warnings. Check connection.": "Sinkronisasi selesai dengan peringatan. Periksa koneksi.",
  "Sync simulated. Backend is currently offline.": "Sinkronisasi simulasi. Backend sedang offline.",
  "2FA configuration will be available in a future update.": "Konfigurasi 2FA akan tersedia di pembaruan mendatang.",
  "All other sessions have been terminated.": "Semua sesi lainnya telah dihentikan.",
  "Export feature will be available in a future update.": "Fitur ekspor akan tersedia di pembaruan mendatang.",
  "Backup created successfully!": "Cadangan berhasil dibuat!",
  "This action is disabled for safety. Use the backend API directly.": "Tindakan ini dinonaktifkan demi keamanan. Gunakan API backend secara langsung.",

  // Transaction Modal
  "Add New Transaction": "Tambah Transaksi Baru",
  "Create a real-time ledger entry.": "Buat entri buku besar real-time.",
  "Expense (Pengeluaran)": "Pengeluaran",
  "Income (Pemasukan)": "Pemasukan",
  "Description": "Deskripsi",
  "e.g. Cloud Server Hosting": "mis. Hosting Server Cloud",
  "Cancel": "Batal",
  "Add Transaction": "Tambah Transaksi",
  "Saving...": "Menyimpan...",
  "Please enter a valid amount greater than 0": "Masukkan jumlah yang valid dan lebih besar dari 0",
  "Error connecting to database. Please make sure MongoDB Atlas network whitelist is active.": "Gagal terhubung ke database. Pastikan whitelist jaringan MongoDB Atlas aktif.",

  // Toast notifications
  "success": "berhasil",
  "info": "info",
  "warning": "peringatan",

  // Income/Expense notification messages
  "Income of": "Pemasukan",
  "Expense of": "Pengeluaran",
  "recorded successfully.": "berhasil dicatat.",
  "Warning: Based on current burn rate, cash runway is under 30 days.": "Peringatan: Berdasarkan tingkat pembakaran saat ini, ketahanan kas di bawah 30 hari.",
  "Invoice INV-2026-004 to Client A is overdue by 5 days.": "Faktur INV-2026-004 ke Klien A telah jatuh tempo 5 hari.",
  "Successfully synchronized database with MongoDB Atlas.": "Berhasil menyinkronkan database dengan MongoDB Atlas.",

  // Notification bell
  "Toggle Menu": "Buka/Tutup Menu",

  // Month Names
  "January": "Januari",
  "February": "Februari",
  "March": "Maret",
  "April": "April",
  "May": "Mei",
  "June": "Juni",
  "July": "Juli",
  "August": "Agustus",
  "September": "September",
  "October": "Oktober",
  "November": "November",
  "December": "Desember",

  // Weekdays (short)
  "Su": "Min",
  "Mo": "Sen",
  "Tu": "Sel",
  "We": "Rab",
  "Th": "Kam",
  "Fr": "Jum",
  "Sa": "Sab",

  // Chart months (short)
  "Jan": "Jan",
  "Feb": "Feb",
  "Mar": "Mar",
  "Apr": "Apr",
  "Jun": "Jun",
  "Jul": "Jul",
  "Aug": "Agt",
  "Sep": "Sep",
  "Oct": "Okt",
  "Nov": "Nov",
  "Dec": "Des",

  // Chart weeks
  "Week 1": "Minggu 1",
  "Week 2": "Minggu 2",
  "Week 3": "Minggu 3",
  "Week 4": "Minggu 4",

  // Transaction Categories
  "Infrastructure": "Infrastruktur",
  "Freelance": "Pekerjaan Lepas",
  "Rent & Facilities": "Sewa & Fasilitas",
  "Design Resources": "Sumber Daya Desain",
  "Consulting": "Konsultasi",
  "Software": "Perangkat Lunak",
  "Development": "Pengembangan",
  "Utilities": "Utilitas",
  "Marketing": "Pemasaran",
  "Refunds": "Pengembalian Dana",
  "SaaS Subscription": "Langganan SaaS",
  "Salary": "Gaji",

  // Datepicker footer buttons
  "Today": "Hari Ini",
  "Close": "Tutup",
};

const en: Record<string, string> = {};

/**
 * Simple translation function.
 * Falls back to the English key if no translation is found.
 */
export function t(key: string, lang: string): string {
  if (lang === "ID" && id[key]) {
    return id[key];
  }
  return key;
}

/**
 * Get relative time string (translated).
 */
export function getRelativeTime(dateStr: string, lang: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return t("Just now", lang);
  if (diffMins < 60) return `${diffMins} ${t("minutes ago", lang)}`;
  if (diffHours < 24) return `${diffHours} ${t("hours ago", lang)}`;
  if (diffDays === 1) return `1 ${t("day ago", lang)}`;
  if (diffDays < 7) return `${diffDays} ${t("days ago", lang)}`;
  return date.toLocaleDateString(lang === "ID" ? "id-ID" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
