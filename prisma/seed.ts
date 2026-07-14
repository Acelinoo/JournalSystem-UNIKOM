import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Clean existing data to avoid duplication bugs
  await prisma.naskah.deleteMany({})
  await prisma.pengajuanDana.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.editor.deleteMany({})
  await prisma.reviewer.deleteMany({})
  await prisma.pengaturanTarif.deleteMany({})
  await prisma.edisiJurnal.deleteMany({})

  console.log('🧹 Database cleaned successfully.')

  // 2. Seed Pengaturan Tarif & Pajak Default
  const tarif = await prisma.pengaturanTarif.create({
    data: {
      honorEditor: 250000,     // Rp 250.000 per naskah
      honorReviewer: 300000,   // Rp 300.000 per naskah
      persentasePajak: 2.5,    // Pajak 2.5%
    },
  })

  // 3. Seed Edisi Jurnal (Aktif)
  const edisiAktif = await prisma.edisiJurnal.create({
    data: {
      volume: 9,
      nomor: 2,
      bulan: 'April',
      tahun: 2026,
      isAktif: true,
    },
  })

  // 4. Seed Data Master Editors
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

  // 5. Seed Data Master Reviewers
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

  // 6. Seed Naskah Jurnal & Ploting Data
  await prisma.naskah.create({
    data: {
      judul: 'Penerapan Arsitektur Microservices Menggunakan Next.js dan Prisma untuk Skalabilitas Aplikasi',
      author: 'Budi Darmawan',
      edisiId: edisiAktif.id,
      editorId: editor1.id,
      reviewerId: reviewer1.id,
    },
  })

  await prisma.naskah.create({
    data: {
      judul: 'Analisis Keamanan Autentikasi Berbasis JWT pada Platform E-Commerce Sistem Informasi Jurnal',
      author: 'Dewi Lestari',
      edisiId: edisiAktif.id,
      editorId: editor2.id,
      reviewerId: reviewer2.id,
    },
  })

  await prisma.naskah.create({
    data: {
      judul: 'Rancang Bangun Sistem Keuangan Internal Kampus Menggunakan Database Ringan SQLite',
      author: 'Fajar Nugraha',
      edisiId: edisiAktif.id,
      editorId: editor1.id,
      reviewerId: reviewer2.id,
    },
  })

  // 7. Seed Default Pengajuan Dana (Awal Status PENDING)
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

  // 8. Seed User Accounts with Role-Based Access Control
  // ADMIN account (full access)
  await prisma.user.create({
    data: {
      username: 'admin',
      password: 'admin123',
      nama: 'Administrator Jurnal',
      role: 'ADMIN',
    },
  })

  // EDITOR account linked to Dr. Rian Hadi
  await prisma.user.create({
    data: {
      username: 'editor.rian',
      password: 'editor123',
      nama: 'Dr. Rian Hadi, M.T.',
      role: 'EDITOR',
      editorId: editor1.id,
    },
  })

  // REVIEWER account linked to Prof. Ahmad Subagja
  await prisma.user.create({
    data: {
      username: 'reviewer.ahmad',
      password: 'reviewer123',
      nama: 'Prof. Ahmad Subagja, Ph.D.',
      role: 'REVIEWER',
      reviewerId: reviewer1.id,
    },
  })

  // REVIEWER account linked to Eko Prasetyo
  await prisma.user.create({
    data: {
      username: 'reviewer.eko',
      password: 'reviewer123',
      nama: 'Eko Prasetyo, M.Sc.',
      role: 'REVIEWER',
      reviewerId: reviewer2.id,
    },
  })

  // KAPRODI account (Head of Department - digital signature authority)
  await prisma.user.create({
    data: {
      username: 'kaprodi.if',
      password: 'kaprodi123',
      nama: 'Prof. Dr. Ir. Eddy Soeryanto Soegoto, M.T.',
      role: 'KAPRODI',
    },
  })

  console.log('🌱 Database seeding completed successfully with RBAC user accounts!')
  console.log('')
  console.log('📋 Login Credentials:')
  console.log('   Admin:    admin / admin123')
  console.log('   Editor:   editor.rian / editor123')
  console.log('   Reviewer: reviewer.ahmad / reviewer123')
  console.log('   Reviewer: reviewer.eko / reviewer123')
  console.log('   Kaprodi:  kaprodi.if / kaprodi123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


