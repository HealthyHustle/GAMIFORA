export type DiagramKind =
  | { type: 'chain'; items: { emoji: string; label: string }[]; caption: string }
  | { type: 'flowsymbols' };

export interface MaterialSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface Material {
  id: number;
  title: string;
  short: string;
  image?: string;
  accent: string;
  intro: string;
  sections: MaterialSection[];
  diagram: DiagramKind;
  example: { title: string; body: string[] };
  summary: string[];
}

export const MATERIALS: readonly Material[] = [
  {
    id: 1,
    title: 'Dasar-Dasar Informatika',
    short: 'Pengertian, data, informasi, dan peran informatika.',
    image: '/assets/icon_informatika.png',
    accent: '#f59e0b',
    intro:
      'Pernahkah kamu membuka aplikasi peta untuk mencari jalan, atau mengirim pesan kepada teman? Semua itu bisa terjadi berkat informatika.',
    sections: [
      {
        heading: 'Apa itu informatika?',
        paragraphs: [
          'Informatika adalah ilmu yang mempelajari cara mengolah data menjadi informasi menggunakan komputer dan teknologi digital. Informatika juga melatih kita berpikir logis dan sistematis untuk menyelesaikan masalah.',
          'Informatika tidak hanya tentang "mengoperasikan komputer". Kita juga belajar merancang langkah penyelesaian masalah (algoritma), menjaga keamanan data, dan memanfaatkan teknologi secara bijak.',
        ],
      },
      {
        heading: 'Peran informatika dalam kehidupan sehari-hari',
        bullets: [
          'Komunikasi: pesan singkat, panggilan video, dan surel.',
          'Transportasi: aplikasi peta dan pemesanan ojek atau tiket kereta.',
          'Belanja dan keuangan: toko daring, dompet digital, dan ATM.',
          'Hiburan: video, musik, dan permainan.',
          'Kesehatan: pendaftaran berobat daring dan pencatatan rekam medis.',
        ],
      },
      {
        heading: 'Data dan informasi',
        paragraphs: [
          'Data adalah fakta atau angka mentah yang belum diolah dan belum memiliki makna utuh. Contohnya: 80, 75, 90, 85.',
          'Informasi adalah hasil pengolahan data sehingga bermakna dan berguna untuk mengambil keputusan. Contohnya: "Rata-rata nilai kelas adalah 82,5 sehingga kelas ini tergolong baik."',
        ],
        bullets: [
          'Data: nilai ujian tiap siswa, daftar harga, suhu tiap jam.',
          'Informasi: rata-rata nilai kelas, harga termurah, perkiraan cuaca hari ini.',
        ],
      },
      {
        heading: 'Contoh penerapan di sekolah dan di rumah',
        bullets: [
          'Sekolah: mengakses materi lewat aplikasi pembelajaran, mengumpulkan tugas daring, dan mencari referensi lewat internet.',
          'Sekolah: guru memakai spreadsheet untuk menghitung nilai rapor.',
          'Rumah: video call dengan keluarga, mengatur alarm di ponsel, dan menonton tutorial memasak.',
          'Rumah: Wi-Fi yang menghubungkan banyak perangkat sekaligus.',
        ],
      },
    ],
    diagram: {
      type: 'chain',
      items: [
        { emoji: '🔢', label: 'Data (fakta mentah)' },
        { emoji: '⚙️', label: 'Diolah komputer' },
        { emoji: '💡', label: 'Informasi (bermakna)' },
      ],
      caption: 'Data yang diolah akan menjadi informasi.',
    },
    example: {
      title: 'Contoh: nilai ulangan kelas',
      body: [
        'Guru mengumpulkan nilai 5 siswa: 70, 80, 90, 60, 100 (ini adalah data).',
        'Komputer menghitung rata-rata: (70 + 80 + 90 + 60 + 100) / 5 = 80.',
        'Guru memperoleh informasi: "Rata-rata kelas adalah 80, sudah memenuhi target 75."',
      ],
    },
    summary: [
      'Informatika mempelajari pengolahan data menjadi informasi dengan komputer dan teknologi digital.',
      'Informatika hadir di sekolah, rumah, dan kehidupan sehari-hari.',
      'Data adalah fakta mentah, sedangkan informasi adalah hasil olahan yang bermakna.',
    ],
  },
  {
    id: 2,
    title: 'Perangkat Keras dan Perangkat Lunak',
    short: 'Hardware, software, contoh, dan perbedaannya.',
    image: '/assets/icon_hardware.png',
    accent: '#3b82f6',
    intro:
      'Komputer seperti tubuh dan pikiran manusia. Ada bagian yang bisa disentuh, dan ada "otak" yang memberi perintah. Keduanya harus bekerja bersama.',
    sections: [
      {
        heading: 'Perangkat keras (hardware)',
        paragraphs: [
          'Perangkat keras adalah semua komponen fisik komputer yang dapat dilihat dan disentuh.',
        ],
        bullets: [
          'Keyboard: memasukkan huruf, angka, dan perintah (perangkat input).',
          'Mouse: menggerakkan penunjuk di layar (perangkat input).',
          'Monitor: menampilkan hasil secara visual (perangkat output).',
          'Printer: mencetak dokumen ke kertas (perangkat output).',
          'CPU (prosesor): "otak" komputer yang memproses data dan menjalankan instruksi.',
        ],
      },
      {
        heading: 'Perangkat lunak (software)',
        paragraphs: [
          'Perangkat lunak adalah kumpulan program atau instruksi yang membuat perangkat keras bisa bekerja. Perangkat lunak tidak berwujud fisik.',
        ],
        bullets: [
          'Sistem operasi (Windows, Android, Linux): mengelola sumber daya komputer dan menjalankan aplikasi.',
          'Pengolah kata (Microsoft Word, Google Docs): menulis dan menyunting dokumen.',
          'Browser (Chrome, Firefox, Edge): membuka halaman web.',
        ],
      },
      {
        heading: 'Perbedaan hardware dan software',
        bullets: [
          'Wujud: hardware berwujud fisik, software berupa program.',
          'Interaksi: hardware dapat disentuh, software dijalankan lewat hardware.',
          'Ketergantungan: hardware tanpa software tidak dapat berfungsi, dan software tanpa hardware tidak dapat dijalankan.',
          'Contoh: keyboard, monitor, printer (hardware) dan Word, browser, sistem operasi (software).',
        ],
      },
    ],
    diagram: {
      type: 'chain',
      items: [
        { emoji: '⌨️', label: 'Perangkat input' },
        { emoji: '🧠', label: 'CPU + software' },
        { emoji: '🖥️', label: 'Perangkat output' },
      ],
      caption: 'Hardware dan software bekerja sama: input, proses, lalu output.',
    },
    example: {
      title: 'Contoh: mengetik tugas',
      body: [
        'Kamu menekan keyboard (perangkat keras, input).',
        'Microsoft Word (perangkat lunak) menerima huruf yang diketik, dan CPU memprosesnya.',
        'Huruf muncul di monitor (perangkat keras, output). Kamu mencetaknya dengan printer.',
      ],
    },
    summary: [
      'Hardware: komponen fisik seperti keyboard, mouse, monitor, CPU, dan printer.',
      'Software: program seperti sistem operasi, pengolah kata, dan browser.',
      'Keduanya saling membutuhkan agar komputer dapat bekerja.',
    ],
  },
  {
    id: 3,
    title: 'Jaringan Komputer dan Internet',
    short: 'Jaringan, internet, browser, mesin pencari, manfaat dan risiko.',
    image: '/assets/icon_internet.png',
    accent: '#0ea5e9',
    intro:
      'Saat kamu menonton video atau mengirim pesan ke teman di kota lain, ada jaringan besar yang bekerja di belakang layar.',
    sections: [
      {
        heading: 'Apa itu jaringan komputer?',
        paragraphs: [
          'Jaringan komputer adalah hubungan antara dua perangkat atau lebih (komputer, ponsel, printer) yang saling terhubung agar dapat berkomunikasi, bertukar data, dan berbagi sumber daya.',
          'Contoh: beberapa komputer di laboratorium sekolah memakai satu printer yang sama melalui jaringan.',
        ],
      },
      {
        heading: 'Apa itu internet?',
        paragraphs: [
          'Internet (interconnected network) adalah jaringan dari jutaan jaringan di seluruh dunia yang saling terhubung. Lewat internet, kita dapat mengakses halaman web, mengirim surel, dan berkomunikasi secara global.',
        ],
      },
      {
        heading: 'Browser dan mesin pencari',
        bullets: [
          'Browser adalah aplikasi untuk membuka dan menampilkan halaman web, misalnya Chrome, Firefox, dan Edge.',
          'Mesin pencari adalah layanan untuk mencari informasi di internet berdasarkan kata kunci, misalnya Google dan Bing.',
          'Tips: gunakan kata kunci singkat dan jelas, misalnya "pengertian algoritma".',
        ],
      },
      {
        heading: 'Manfaat dan risiko internet',
        bullets: [
          'Manfaat: belajar dari banyak sumber, berkomunikasi cepat, mengakses hiburan, dan mencari informasi.',
          'Risiko: penipuan, informasi palsu (hoaks), perundungan siber, konten tidak pantas, dan kecanduan layar.',
          'Cara menyikapi: bijak memilih situs, menjaga data pribadi, dan membatasi waktu layar.',
        ],
      },
    ],
    diagram: {
      type: 'chain',
      items: [
        { emoji: '📱', label: 'Perangkat kamu' },
        { emoji: '📡', label: 'Jaringan' },
        { emoji: '🌍', label: 'Internet' },
      ],
      caption: 'Perangkat terhubung ke jaringan, lalu jaringan terhubung ke internet.',
    },
    example: {
      title: 'Contoh: mencari bahan tugas',
      body: [
        'Kamu membuka browser, lalu mengetik kata kunci "manfaat internet" di mesin pencari.',
        'Mesin pencari menampilkan daftar halaman web yang relevan.',
        'Kamu membuka beberapa sumber tepercaya dan membandingkannya sebelum menyalin ringkasannya dengan kata-katamu sendiri.',
      ],
    },
    summary: [
      'Jaringan komputer menghubungkan perangkat untuk berkomunikasi dan berbagi sumber daya.',
      'Internet adalah jaringan global dari banyak jaringan.',
      'Browser membuka halaman web, mesin pencari mencari informasi dari kata kunci.',
      'Internet bermanfaat, tetapi memiliki risiko yang perlu diwaspadai.',
    ],
  },
  {
    id: 4,
    title: 'Keamanan Digital',
    short: 'Password kuat, data pribadi, phishing, etika, dan cek informasi.',
    image: '/assets/icon_security.png',
    accent: '#16a34a',
    intro:
      'Di dunia digital, data pribadimu sangat berharga. Mari belajar menjaganya seperti kamu menjaga harta karun di hutan petualangan!',
    sections: [
      {
        heading: 'Password yang kuat',
        bullets: [
          'Panjang (minimal 12 karakter) dengan kombinasi huruf besar, huruf kecil, angka, dan simbol.',
          'Tidak memakai data yang mudah ditebak, seperti nama sendiri, tanggal lahir, atau "12345678".',
          'Gunakan password yang berbeda untuk setiap akun.',
          'Jangan membagikan password kepada siapa pun, termasuk teman dekat.',
          'Aktifkan verifikasi dua langkah jika tersedia.',
        ],
      },
      {
        heading: 'Perlindungan data pribadi',
        paragraphs: [
          'Data pribadi adalah informasi yang dapat mengenali dirimu. Contohnya nama lengkap, alamat rumah, nomor telepon, tanggal lahir, foto kartu identitas, dan kode OTP.',
        ],
        bullets: [
          'Jangan menyebarkan alamat rumah, kode OTP, atau foto dokumen penting di media sosial.',
          'Atur akun media sosial menjadi privat.',
          'Hindari transaksi sensitif saat memakai Wi-Fi publik.',
          'Keluar (logout) dari akun saat memakai komputer bersama.',
        ],
      },
      {
        heading: 'Phishing dan penipuan digital',
        paragraphs: [
          'Phishing adalah upaya menipu pengguna agar menyerahkan informasi sensitif, seperti password atau kode OTP, dengan menyamar sebagai pihak tepercaya.',
        ],
        bullets: [
          'Ciri-ciri: pesan mendesak ("segera!"), tautan aneh, hadiah yang tidak masuk akal, dan permintaan password atau OTP.',
          'Cara menghindari: periksa pengirim, jangan klik tautan mencurigakan, dan hubungi pihak resmi lewat kanal resmi.',
        ],
      },
      {
        heading: 'Etika berkomunikasi di internet',
        bullets: [
          'Gunakan bahasa yang sopan dan hormati pendapat orang lain.',
          'Jangan merundung, menghina, atau menyebarkan aib orang lain.',
          'Hargai hak cipta: cantumkan sumber saat memakai karya orang lain.',
          'Pikirkan dulu sebelum mengunggah, karena jejak digital sulit dihapus.',
        ],
      },
      {
        heading: 'Memeriksa informasi sebelum membagikannya',
        bullets: [
          'Baca isinya sampai selesai, jangan hanya membaca judul.',
          'Periksa sumber dan tanggal publikasi.',
          'Bandingkan dengan sumber tepercaya (situs resmi atau media terkemuka).',
          'Waspadai judul yang provokatif atau berlebihan.',
          'Jika ragu, jangan dibagikan.',
        ],
      },
    ],
    diagram: {
      type: 'chain',
      items: [
        { emoji: '🧐', label: 'Baca & periksa' },
        { emoji: '🔎', label: 'Bandingkan sumber' },
        { emoji: '✅', label: 'Baru bagikan' },
      ],
      caption: 'Alur aman sebelum membagikan informasi.',
    },
    example: {
      title: 'Contoh: pesan hadiah palsu',
      body: [
        'Kamu menerima pesan: "Selamat! Kamu menang HP baru. Klik tautan ini dan masukkan password akunmu."',
        'Tanda bahaya: hadiah tidak jelas, ada tautan asing, dan meminta password.',
        'Tindakan tepat: jangan klik, jangan isi data apa pun, lalu laporkan atau hapus pesan itu.',
      ],
    },
    summary: [
      'Password kuat itu panjang, unik, dan dirahasiakan.',
      'Lindungi data pribadi seperti alamat, nomor telepon, dan kode OTP.',
      'Phishing adalah penipuan untuk mencuri informasi sensitif.',
      'Berkomunikasilah dengan sopan dan periksa informasi sebelum membagikannya.',
    ],
  },
  {
    id: 5,
    title: 'Algoritma dan Logika',
    short: 'Urutan instruksi, input-proses-output, percabangan, pengulangan.',
    image: '/assets/icon_algorithm.png',
    accent: '#8b5cf6',
    intro:
      'Setiap pagi kamu sudah memakai algoritma: bangun, mandi, sarapan, lalu berangkat. Langkah-langkah itu punya urutan yang jelas.',
    sections: [
      {
        heading: 'Apa itu algoritma?',
        paragraphs: [
          'Algoritma adalah urutan langkah yang logis, jelas, dan terbatas untuk menyelesaikan suatu masalah. Jika urutannya dibalik atau ada langkah yang hilang, hasilnya bisa salah.',
        ],
      },
      {
        heading: 'Urutan instruksi',
        paragraphs: ['Komputer mengerjakan instruksi satu per satu, dari atas ke bawah.'],
        bullets: [
          'Contoh membuat teh: 1) Rebus air. 2) Masukkan kantong teh ke gelas. 3) Tuang air panas. 4) Tunggu 3 menit. 5) Angkat kantong teh.',
          'Tukar langkah 3 dan 1, maka tehnya tidak akan jadi.',
        ],
      },
      {
        heading: 'Input, proses, dan output',
        bullets: [
          'Input: data yang dimasukkan (misalnya tiga nilai ulangan).',
          'Proses: pengolahan data (menghitung rata-rata).',
          'Output: hasil akhir (menampilkan "Lulus" atau "Belum Lulus").',
        ],
      },
      {
        heading: 'Percabangan dan pengulangan sederhana',
        bullets: [
          'Percabangan: memilih langkah berdasarkan kondisi. Contoh: JIKA hujan MAKA bawa payung, JIKA TIDAK pakai topi.',
          'Pengulangan: mengerjakan langkah berulang sampai syarat terpenuhi. Contoh: SELAMA gelas belum penuh, tuangkan air.',
        ],
      },
      {
        heading: 'Algoritma dalam kegiatan sehari-hari',
        bullets: [
          'Resep masakan, langkah mencuci tangan, dan rute berangkat ke sekolah.',
          'Menarik uang di ATM: masukkan kartu, masukkan PIN, pilih jumlah, ambil uang.',
        ],
      },
    ],
    diagram: {
      type: 'chain',
      items: [
        { emoji: '📥', label: 'Input' },
        { emoji: '⚙️', label: 'Proses' },
        { emoji: '📤', label: 'Output' },
      ],
      caption: 'Setiap algoritma memiliki input, proses, dan output.',
    },
    example: {
      title: 'Contoh: menentukan genap atau ganjil',
      body: [
        '1) Masukkan sebuah bilangan (input).',
        '2) Hitung sisa bagi bilangan itu dengan 2 (proses).',
        '3) JIKA sisanya 0 MAKA tampilkan "Bilangan Genap" (output).',
        '4) JIKA TIDAK, tampilkan "Bilangan Ganjil" (output).',
      ],
    },
    summary: [
      'Algoritma adalah urutan langkah logis untuk menyelesaikan masalah.',
      'Instruksi dikerjakan berurutan; urutan yang salah menghasilkan jawaban yang salah.',
      'Algoritma terdiri dari input, proses, dan output.',
      'Percabangan memilih langkah berdasarkan kondisi, pengulangan mengerjakan langkah berkali-kali.',
    ],
  },
  {
    id: 6,
    title: 'Flowchart',
    short: 'Simbol, arah alur, dan contoh flowchart sederhana.',
    accent: '#14b8a6',
    intro:
      'Flowchart (diagram alir) adalah cara menggambar algoritma agar mudah dibaca. Seperti peta petualangan, ia menunjukkan jalan dari awal sampai akhir.',
    sections: [
      {
        heading: 'Apa itu flowchart?',
        paragraphs: [
          'Flowchart adalah diagram yang menggambarkan alur langkah-langkah algoritma menggunakan simbol-simbol standar yang dihubungkan dengan panah.',
        ],
      },
      {
        heading: 'Simbol-simbol flowchart',
        bullets: [
          'Terminator (oval): menandai Mulai dan Selesai.',
          'Proses (persegi panjang): perhitungan atau pengolahan data.',
          'Input/Output (jajar genjang): memasukkan data atau menampilkan hasil.',
          'Keputusan/Decision (belah ketupat): pertanyaan dengan dua jalur, YA dan TIDAK.',
          'Panah: menunjukkan arah alur dan urutan langkah.',
        ],
      },
      {
        heading: 'Aturan membaca alur',
        bullets: [
          'Mulai dari simbol Mulai, lalu ikuti arah panah.',
          'Simbol keputusan selalu memiliki dua jalur, yaitu YA dan TIDAK.',
          'Setelah jalur bercabang selesai, alur biasanya bertemu kembali di Selesai.',
          'Satu flowchart hanya memiliki satu titik Mulai.',
        ],
      },
    ],
    diagram: { type: 'flowsymbols' },
    example: {
      title: 'Contoh flowchart: genap atau ganjil',
      body: [
        'Mulai → Masukkan bilangan → Apakah bilangan mod 2 = 0?',
        'Jika YA → Tampilkan "Bilangan Genap".',
        'Jika TIDAK → Tampilkan "Bilangan Ganjil".',
        'Kedua jalur lalu menuju Selesai. Kamu akan menyusunnya sendiri di Level 3!',
      ],
    },
    summary: [
      'Flowchart menggambarkan algoritma dengan simbol dan panah.',
      'Oval = Mulai/Selesai, persegi panjang = proses, jajar genjang = input/output, belah ketupat = keputusan.',
      'Keputusan memiliki dua cabang: YA dan TIDAK.',
    ],
  },
];

export function getMaterial(id: number): Material | undefined {
  return MATERIALS.find((m) => m.id === id);
}
