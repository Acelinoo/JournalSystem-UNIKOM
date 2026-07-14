import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Clean existing data to avoid duplication bugs
  await prisma.naskah.deleteMany({})
  await prisma.pengajuanDana.deleteMany({})
  await prisma.editor.deleteMany({})
  await prisma.reviewer.deleteMany({})
  await prisma.pengaturanTarif.deleteMany({})
  await prisma.edisiJurnal.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('🧹 Database cleaned successfully.')

  // 2. Seed Users (Pengelola & Kaprodi)
  const admin = await prisma.user.create({
    data: {
      username: 'adminjurnal',
      password: 'password123', // In production, this would be hashed
      role: 'PENGELOLA',
    },
  })

  const kaprodi = await prisma.user.create({
    data: {
      username: 'kaprodi',
      password: 'password123',
      role: 'KAPRODI',
    },
  })

  // 3. Seed Pengaturan Tarif & Pajak Default
  const tarif = await prisma.pengaturanTarif.create({
    data: {
      honorEditor: 250000,     // Rp 250.000 per naskah
      honorReviewer: 300000,   // Rp 300.000 per naskah
      persentasePajak: 2.5,    // Pajak 2.5%
    },
  })

  // 4. Seed Edisi Jurnal (Aktif)
  const edisiAktif = await prisma.edisiJurnal.create({
    data: {
      volume: 9,
      nomor: 2,
      bulan: 'April',
      tahun: 2026,
      isAktif: true,
    },
  })

  // 5. Seed Data Master Editors
  const editor1 = await prisma.editor.create({
    data: {
      nama: 'Dr. Rian Hadi, M.T.',
      nidn: '0412038501',
      noRekening: '1310014567890',
      namaBank: 'Bank Mandiri',
      npwp: '12.345.678.9-401.000',
    },
  })

  const editor2 = await prisma.editor.create({
    data: {
      nama: 'Siti Aminah, M.Kom.',
      nidn: '0422088902',
      noRekening: '0023456789',
      namaBank: 'BCAS',
      npwp: null,
    },
  })

  // 6. Seed Data Master Reviewers
  const reviewer1 = await prisma.reviewer.create({
    data: {
      nama: 'Prof. Ahmad Subagja, Ph.D.',
      institusi: 'Universitas Indonesia',
      noRekening: '0123456781',
      namaBank: 'BNI',
      npwp: '98.765.432.1-101.000',
    },
  })

  const reviewer2 = await prisma.reviewer.create({
    data: {
      nama: 'Eko Prasetyo, M.Sc.',
      institusi: 'Institut Teknologi Bandung',
      noRekening: '5220123456',
      namaBank: 'BCA',
      npwp: null,
    },
  })

  // 7. Seed Naskah Jurnal & Ploting Data
  const naskah1 = await prisma.naskah.create({
    data: {
      judul: 'Penerapan Arsitektur Microservices Menggunakan Next.js dan Prisma untuk Skalabilitas Aplikasi',
      author: 'Budi Darmawan',
      edisiId: edisiAktif.id,
      editorId: editor1.id,
      reviewerId: reviewer1.id,
    },
  })

  const naskah2 = await prisma.naskah.create({
    data: {
      judul: 'Analisis Keamanan Autentikasi Berbasis JWT pada Platform E-Commerce Sistem Informasi Jurnal',
      author: 'Dewi Lestari',
      edisiId: edisiAktif.id,
      editorId: editor2.id,
      reviewerId: reviewer2.id,
    },
  })

  const naskah3 = await prisma.naskah.create({
    data: {
      judul: 'Rancang Bangun Sistem Keuangan Internal Kampus Menggunakan Database Ringan SQLite',
      author: 'Fajar Nugraha',
      edisiId: edisiAktif.id,
      editorId: editor1.id,
      reviewerId: reviewer2.id,
    },
  })

  // 8. Seed Default Pengajuan Dana (Awal Status PENDING)
  // Math: 3 naskah dibagikan ke Editor & Reviewer.
  // Editor 1 handle 2 naskah, Editor 2 handle 1 naskah. Total Honor Editor = (2*250rb) + (1*250rb) = 750,000
  // Reviewer 1 handle 1 naskah, Reviewer 2 handle 2 naskah. Total Honor Reviewer = (1*300rb) + (2*300rb) = 900,000
  // Total Bruto = 750,000 + 900,000 = 1,650,000
  // Pajak 2.5% = 41,250
  // Netto = 1,608,750
  const bruto = 1650000
  const pajakTotal = bruto * (2.5 / 100)
  const netto = bruto - pajakTotal

  await prisma.pengajuanDana.create({
    data: {
      edisiId: edisiAktif.id,
      totalHonorBruto: bruto,
      totalPotonganPajak: pajakTotal,
      totalHonorNetto: netto,
      status: 'PENDING',
      catatanRevisi: null,
      tandaTanganKaprodi: null,
    },
  })

  console.log('🌱 Database seeding completed successfully with perfect mock data!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
