# Panduan Integrasi Backend n8n: GAMIFORA

Dokumen ini menjelaskan integrasi webhook n8n dengan antarmuka FORA AI pada aplikasi web GAMIFORA.

## 1. Menaruh File Ekspor Workflow

Silakan ekspor workflow n8n milik Anda lalu simpan berkas JSON tersebut di folder ini dengan nama:
`backend/n8n-workflow.json`

Pastikan tidak ada kredensial, API key rahasia, token, atau kata sandi yang tertanam di dalam berkas ekspor tersebut sebelum diunggah ke repositori.

## 2. Cara Mengimpor Workflow ke n8n

1. Buka instance n8n Anda (lokal maupun server publik).
2. Buat alur kerja baru (*Add new workflow*).
3. Klik ikon menu titik tiga di kanan atas canvas n8n, lalu pilih **Import from file...**.
4. Pilih file `backend/n8n-workflow.json`.
5. Pastikan node Webhook dikonfigurasi:
   - **HTTP Method**: `POST`
   - **Path**: sesuaikan dengan path yang diinginkan (misalnya `ai-learning-informatika`)
   - **Response Mode**: `When Last Node Finishes` (atau *Using 'Respond to Webhook' Node*)
6. Aktifkan workflow (*Active = true*).

## 3. Kontrak Payload Request & Respons

### Request (Frontend -> n8n)
Aplikasi mengirim permintaan HTTP POST dalam format JSON:

```json
{
  "user_id": "nama_pengguna@email.com",
  "session_id": "session-550e8400-e29b-41d4-a716-446655440000",
  "message": "Apa itu algoritma?"
}
```

### Respons (n8n -> Frontend)
n8n harus mengembalikan status HTTP `200` dengan JSON:

```json
{
  "success": true,
  "reply": "Algoritma adalah urutan langkah logis untuk menyelesaikan suatu masalah..."
}
```

Frontend juga mendukung bidang `response`, `message`, `output`, atau `text` sebagai teks balasan jika workflow Anda memakai format standar tersebut.

## 4. Keamanan & Konfigurasi Produksi

- **CORS (Cross-Origin Resource Sharing)**: Karena webhook n8n dipanggil langsung dari peramban pengguna, pastikan CORS diizinkan untuk origin domain aplikasi web Anda (misalnya domain Vercel).
- **Rate Limiting**: Disarankan menambahkan node pengatur laju permintaan (*Rate Limit*) di n8n untuk mencegah pemanggilan berlebihan karena URL webhook terlihat di lingkungan klien peramban.
- **Environment Variable**: Atur URL webhook pada file `.env` di komputer lokal atau konfigurasi Environment Variables di dashboard hosting:
  ```env
  VITE_AI_LEARNING_WEBHOOK_URL=https://n8n-domain-kamu.com/webhook/ai-learning-informatika
  ```

