export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface QuizOption {
  key: OptionKey;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: readonly QuizOption[];
  answer: OptionKey;
  explanation: string;
}

export const POINTS_PER_QUESTION = 10;

const q = (
  id: string,
  text: string,
  options: [string, string, string, string],
  answer: OptionKey,
  explanation: string,
): QuizQuestion => ({
  id,
  text,
  options: [
    { key: 'A', text: options[0] },
    { key: 'B', text: options[1] },
    { key: 'C', text: options[2] },
    { key: 'D', text: options[3] },
  ],
  answer,
  explanation,
});

export const QUIZ_LEVEL_1: readonly QuizQuestion[] = [
  q(
    'l1-1',
    'Apa yang dimaksud dengan algoritma?',
    [
      'Kumpulan perangkat keras komputer.',
      'Urutan langkah logis untuk menyelesaikan masalah.',
      'Program untuk menggambar.',
      'Jaringan untuk menghubungkan komputer.',
    ],
    'B',
    'Algoritma adalah urutan langkah yang logis dan jelas untuk menyelesaikan suatu masalah, misalnya langkah membuat teh atau menghitung nilai rata-rata.',
  ),
  q(
    'l1-2',
    'Manakah yang termasuk perangkat keras?',
    ['Microsoft Word.', 'Sistem operasi.', 'Keyboard.', 'Browser.'],
    'C',
    'Keyboard adalah perangkat keras (hardware) karena berwujud fisik dan bisa disentuh. Word, sistem operasi, dan browser adalah perangkat lunak.',
  ),
  q(
    'l1-3',
    'Apa fungsi utama sistem operasi?',
    [
      'Mengelola sumber daya komputer dan menjalankan aplikasi.',
      'Membersihkan layar monitor.',
      'Menghubungkan komputer ke listrik saja.',
      'Mencetak dokumen secara langsung tanpa perangkat lain.',
    ],
    'A',
    'Sistem operasi (misalnya Windows, Android, Linux) mengatur memori, prosesor, penyimpanan, dan perangkat lain, sekaligus menjadi tempat aplikasi berjalan.',
  ),
  q(
    'l1-4',
    'Manakah contoh data?',
    [
      'Kesimpulan dari sebuah penelitian.',
      'Angka nilai ujian yang dikumpulkan.',
      'Penjelasan hasil analisis.',
      'Rekomendasi berdasarkan laporan.',
    ],
    'B',
    'Data adalah fakta mentah yang belum diolah, seperti angka nilai ujian. Kesimpulan, penjelasan, dan rekomendasi sudah merupakan informasi.',
  ),
  q(
    'l1-5',
    'Perangkat yang digunakan untuk menampilkan informasi secara visual adalah...',
    ['Keyboard.', 'Mouse.', 'Monitor.', 'Mikrofon.'],
    'C',
    'Monitor adalah perangkat keluaran (output) yang menampilkan teks, gambar, dan video. Keyboard, mouse, dan mikrofon adalah perangkat masukan.',
  ),
  q(
    'l1-6',
    'Apa fungsi utama mouse?',
    [
      'Memasukkan perintah melalui gerakan penunjuk.',
      'Menyimpan seluruh file komputer.',
      'Mencetak gambar.',
      'Menghasilkan koneksi internet secara otomatis.',
    ],
    'A',
    'Mouse menggerakkan penunjuk (kursor) di layar sehingga kita dapat memilih, mengeklik, dan memberi perintah kepada komputer.',
  ),
  q(
    'l1-7',
    'Manakah contoh perangkat lunak pengolah kata?',
    ['Monitor.', 'Microsoft Word.', 'Keyboard.', 'Printer.'],
    'B',
    'Microsoft Word adalah perangkat lunak pengolah kata untuk menulis dan menyunting dokumen. Tiga pilihan lain adalah perangkat keras.',
  ),
  q(
    'l1-8',
    'Apa yang dimaksud dengan input dalam sistem komputer?',
    [
      'Hasil akhir pemrosesan.',
      'Data yang dimasukkan untuk diproses.',
      'Perangkat untuk menampilkan gambar.',
      'Hasil cetakan printer.',
    ],
    'B',
    'Input adalah data atau perintah yang dimasukkan ke komputer untuk diproses. Hasil akhirnya disebut output.',
  ),
  q(
    'l1-9',
    'Manakah contoh penerapan informatika di sekolah?',
    [
      'Menggunakan aplikasi pembelajaran untuk mengakses materi.',
      'Menyimpan buku hanya di dalam lemari.',
      'Menulis tanpa menggunakan informasi apa pun.',
      'Mematikan semua perangkat digital sepanjang waktu.',
    ],
    'A',
    'Memakai aplikasi pembelajaran untuk mengakses materi adalah penerapan informatika: teknologi digital membantu proses belajar.',
  ),
  q(
    'l1-10',
    'Mengapa algoritma harus memiliki urutan langkah yang jelas?',
    [
      'Agar komputer selalu terlihat menarik.',
      'Agar penyelesaian masalah dapat dilakukan secara sistematis.',
      'Agar ukuran monitor bertambah besar.',
      'Agar internet tidak memerlukan jaringan.',
    ],
    'B',
    'Langkah yang jelas dan berurutan membuat masalah diselesaikan secara sistematis, dan hasilnya sama bila langkah diulang.',
  ),
];

export const QUIZ_LEVEL_2: readonly QuizQuestion[] = [
  q(
    'l2-1',
    'Manakah yang merupakan perangkat lunak?',
    ['Keyboard.', 'Monitor.', 'Microsoft Word.', 'Printer.'],
    'C',
    'Microsoft Word berupa program (perangkat lunak). Keyboard, monitor, dan printer adalah perangkat keras.',
  ),
  q(
    'l2-2',
    'Apa fungsi browser?',
    [
      'Membuka dan menampilkan halaman web.',
      'Memperbaiki perangkat keras secara otomatis.',
      'Menggantikan seluruh sistem operasi.',
      'Mengisi daya baterai.',
    ],
    'A',
    'Browser (Chrome, Firefox, Edge, dll.) adalah aplikasi untuk membuka dan menampilkan halaman web.',
  ),
  q(
    'l2-3',
    'Apa yang dimaksud dengan jaringan komputer?',
    [
      'Kumpulan gambar dalam sebuah folder.',
      'Hubungan antarkomputer atau perangkat untuk berkomunikasi dan berbagi sumber daya.',
      'Program untuk mengedit foto.',
      'Perangkat untuk mencetak dokumen.',
    ],
    'B',
    'Jaringan komputer menghubungkan dua perangkat atau lebih agar dapat bertukar data dan berbagi sumber daya seperti printer atau koneksi internet.',
  ),
  q(
    'l2-4',
    'Manakah contoh password yang relatif kuat?',
    ['12345678.', 'password.', 'namasendiri.', 'Kombinasi panjang huruf, angka, dan simbol yang unik.'],
    'D',
    'Password kuat itu panjang, memadukan huruf besar-kecil, angka, dan simbol, serta tidak mudah ditebak dan tidak dipakai di banyak akun.',
  ),
  q(
    'l2-5',
    'Apa yang harus dilakukan ketika menerima tautan mencurigakan dari orang tidak dikenal?',
    [
      'Langsung membuka tautan.',
      'Memasukkan password untuk memeriksanya.',
      'Memeriksa sumbernya dan tidak membuka jika mencurigakan.',
      'Meneruskan tautan ke semua teman.',
    ],
    'C',
    'Tautan mencurigakan bisa mengarah ke penipuan atau perangkat lunak berbahaya. Periksa dulu pengirimnya, dan jangan dibuka bila ragu.',
  ),
  q(
    'l2-6',
    'Apa yang dimaksud dengan phishing?',
    [
      'Teknik membuat ilustrasi digital.',
      'Upaya menipu pengguna untuk mendapatkan informasi sensitif.',
      'Proses mempercepat monitor.',
      'Metode membersihkan keyboard.',
    ],
    'B',
    'Phishing adalah penipuan digital yang menyamar sebagai pihak tepercaya untuk mencuri password, kode OTP, atau data pribadi.',
  ),
  q(
    'l2-7',
    'Informasi manakah yang harus dilindungi ketika menggunakan internet?',
    ['Password akun.', 'Informasi publik dari situs resmi.', 'Nama mata pelajaran.', 'Judul buku pelajaran.'],
    'A',
    'Password adalah data rahasia yang memberi akses ke akunmu. Jangan pernah dibagikan kepada siapa pun.',
  ),
  q(
    'l2-8',
    'Apa fungsi mesin pencari?',
    [
      'Mencari informasi di internet berdasarkan kata kunci.',
      'Menghapus seluruh jaringan.',
      'Mengganti perangkat keras.',
      'Mengisi daya perangkat.',
    ],
    'A',
    'Mesin pencari (misalnya Google atau Bing) menampilkan halaman web yang cocok dengan kata kunci yang kamu ketik.',
  ),
  q(
    'l2-9',
    'Bagaimana cara memeriksa kebenaran informasi digital?',
    [
      'Memercayai semua unggahan yang viral.',
      'Membagikan informasi tanpa membaca isinya.',
      'Membandingkan informasi dengan sumber tepercaya.',
      'Memercayai informasi hanya karena memiliki banyak komentar.',
    ],
    'C',
    'Informasi yang viral belum tentu benar. Bandingkan dengan sumber tepercaya sebelum memercayai atau membagikannya.',
  ),
  q(
    'l2-10',
    'Apa tindakan yang tepat saat menggunakan Wi-Fi publik?',
    [
      'Mengakses semua akun tanpa memeriksa keamanan.',
      'Membagikan password kepada pengguna lain.',
      'Mematikan semua pengaturan keamanan.',
      'Menghindari transaksi sensitif dan menggunakan koneksi yang aman.',
    ],
    'D',
    'Wi-Fi publik lebih mudah disadap, jadi hindari transaksi sensitif (perbankan, login penting) dan gunakan koneksi yang aman.',
  ),
];

export const QUIZZES: Record<1 | 2, readonly QuizQuestion[]> = {
  1: QUIZ_LEVEL_1,
  2: QUIZ_LEVEL_2,
};

export const QUIZ_RULES: Record<1 | 2, string> = {
  1: 'Kamu harus mendapat minimal 80 dari 100 poin (8 jawaban benar).',
  2: 'Kamu harus mendapat 100 dari 100 poin (10 jawaban benar) dalam satu percobaan.',
};
