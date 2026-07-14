"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

// =============================================
// EDISI JURNAL ACTIONS
// =============================================

export async function createEdisiJurnal(formData: FormData) {
  const volume = parseInt(formData.get("volume") as string);
  const nomor = parseInt(formData.get("nomor") as string);
  const bulan = formData.get("bulan") as string;
  const tahun = parseInt(formData.get("tahun") as string);

  await prisma.edisiJurnal.create({
    data: { volume, nomor, bulan, tahun, isAktif: true },
  });

  revalidatePath("/konfigurasi");
  revalidatePath("/");
}

export async function toggleEdisiJurnal(id: string) {
  const edisi = await prisma.edisiJurnal.findUnique({ where: { id } });
  if (!edisi) return;

  await prisma.edisiJurnal.update({
    where: { id },
    data: { isAktif: !edisi.isAktif },
  });

  revalidatePath("/konfigurasi");
  revalidatePath("/");
}

// =============================================
// PENGATURAN TARIF ACTIONS
// =============================================

export async function upsertPengaturanTarif(formData: FormData) {
  const honorEditor = parseFloat(formData.get("honorEditor") as string);
  const honorReviewer = parseFloat(formData.get("honorReviewer") as string);
  const persentasePajak = parseFloat(formData.get("persentasePajak") as string);

  const existing = await prisma.pengaturanTarif.findFirst();

  if (existing) {
    await prisma.pengaturanTarif.update({
      where: { id: existing.id },
      data: { honorEditor, honorReviewer, persentasePajak },
    });
  } else {
    await prisma.pengaturanTarif.create({
      data: { honorEditor, honorReviewer, persentasePajak },
    });
  }

  revalidatePath("/konfigurasi");
  revalidatePath("/");
}

// =============================================
// EDITOR ACTIONS
// =============================================

export async function createEditor(formData: FormData) {
  const nama = formData.get("nama") as string;
  const nidn = (formData.get("nidn") as string) || null;
  const noRekening = formData.get("noRekening") as string;
  const namaBank = formData.get("namaBank") as string;
  const npwp = (formData.get("npwp") as string) || null;

  await prisma.editor.create({
    data: { nama, nidn, noRekening, namaBank, npwp },
  });

  revalidatePath("/data-master");
  revalidatePath("/");
}

export async function deleteEditor(id: string) {
  await prisma.editor.delete({ where: { id } });
  revalidatePath("/data-master");
  revalidatePath("/");
}

// =============================================
// REVIEWER ACTIONS
// =============================================

export async function createReviewer(formData: FormData) {
  const nama = formData.get("nama") as string;
  const institusi = formData.get("institusi") as string;
  const noRekening = formData.get("noRekening") as string;
  const namaBank = formData.get("namaBank") as string;
  const npwp = (formData.get("npwp") as string) || null;

  await prisma.reviewer.create({
    data: { nama, institusi, noRekening, namaBank, npwp },
  });

  revalidatePath("/data-master");
  revalidatePath("/");
}

export async function deleteReviewer(id: string) {
  await prisma.reviewer.delete({ where: { id } });
  revalidatePath("/data-master");
  revalidatePath("/");
}

// =============================================
// NASKAH ACTIONS
// =============================================

export async function createNaskah(formData: FormData) {
  const judul = formData.get("judul") as string;
  const author = formData.get("author") as string;
  const editorId = formData.get("editorId") as string;
  const reviewerId = formData.get("reviewerId") as string;

  // Auto-map to the currently active EdisiJurnal
  const activeEdisi = await prisma.edisiJurnal.findFirst({
    where: { isAktif: true },
    orderBy: { createdAt: "desc" },
  });

  if (!activeEdisi) {
    throw new Error("Tidak ada edisi jurnal yang aktif. Silakan aktifkan edisi terlebih dahulu.");
  }

  await prisma.naskah.create({
    data: {
      judul,
      author,
      edisiId: activeEdisi.id,
      editorId,
      reviewerId,
    },
  });

  revalidatePath("/transaksi");
  revalidatePath("/");
}

// =============================================
// PENGAJUAN DANA ACTIONS
// =============================================

export async function generatePengajuanDana(edisiId: string) {
  // Count manuscripts for this edition
  const naskahCount = await prisma.naskah.count({
    where: { edisiId },
  });

  // Get the current tarif settings
  const tarif = await prisma.pengaturanTarif.findFirst();
  if (!tarif) {
    throw new Error("Pengaturan tarif belum dikonfigurasi. Silakan atur tarif terlebih dahulu.");
  }

  // Calculate financials
  // Each naskah has 1 editor + 1 reviewer
  const totalHonorEditorBruto = naskahCount * tarif.honorEditor;
  const totalHonorReviewerBruto = naskahCount * tarif.honorReviewer;
  const totalHonorBruto = totalHonorEditorBruto + totalHonorReviewerBruto;
  const totalPotonganPajak = totalHonorBruto * (tarif.persentasePajak / 100);
  const totalHonorNetto = totalHonorBruto - totalPotonganPajak;

  // Upsert the PengajuanDana (one per edisi because of @unique on edisiId)
  const existing = await prisma.pengajuanDana.findUnique({
    where: { edisiId },
  });

  if (existing) {
    await prisma.pengajuanDana.update({
      where: { id: existing.id },
      data: {
        totalHonorBruto,
        totalPotonganPajak,
        totalHonorNetto,
        status: "PENDING",
        catatanRevisi: null,
        tandaTanganKaprodi: null,
      },
    });
  } else {
    await prisma.pengajuanDana.create({
      data: {
        edisiId,
        totalHonorBruto,
        totalPotonganPajak,
        totalHonorNetto,
      },
    });
  }

  revalidatePath("/output-laporan");
  revalidatePath("/");
}

export async function approvePengajuan(pengajuanId: string, namaKaprodi: string) {
  const timestamp = new Date().toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  });

  await prisma.pengajuanDana.update({
    where: { id: pengajuanId },
    data: {
      status: "DISETUJUI",
      tandaTanganKaprodi: `Disetujui oleh ${namaKaprodi} pada ${timestamp}`,
      catatanRevisi: null,
    },
  });

  revalidatePath("/output-laporan");
  revalidatePath("/");
}

export async function rejectPengajuan(pengajuanId: string, catatan: string) {
  await prisma.pengajuanDana.update({
    where: { id: pengajuanId },
    data: {
      status: "DITOLAK",
      catatanRevisi: catatan,
      tandaTanganKaprodi: null,
    },
  });

  revalidatePath("/output-laporan");
  revalidatePath("/");
}

// =============================================
// DATA FETCHING HELPERS
// =============================================

export async function getDashboardStats() {
  const [totalEdisi, totalEditor, totalReviewer, totalNaskah, totalPengajuan] =
    await Promise.all([
      prisma.edisiJurnal.count(),
      prisma.editor.count(),
      prisma.reviewer.count(),
      prisma.naskah.count(),
      prisma.pengajuanDana.count(),
    ]);

  const activeEdisi = await prisma.edisiJurnal.findFirst({
    where: { isAktif: true },
    orderBy: { createdAt: "desc" },
  });

  const recentNaskah = await prisma.naskah.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      edisiJurnal: true,
      editor: true,
      reviewer: true,
    },
  });

  const pendingPengajuan = await prisma.pengajuanDana.count({
    where: { status: "PENDING" },
  });

  return {
    totalEdisi,
    totalEditor,
    totalReviewer,
    totalNaskah,
    totalPengajuan,
    pendingPengajuan,
    activeEdisi,
    recentNaskah,
  };
}

export async function getEdisiJurnalList() {
  return prisma.edisiJurnal.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { naskah: true } } },
  });
}

export async function getPengaturanTarif() {
  return prisma.pengaturanTarif.findFirst();
}

export async function getEditorList() {
  return prisma.editor.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getReviewerList() {
  return prisma.reviewer.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getNaskahByEdisi(edisiId: string) {
  return prisma.naskah.findMany({
    where: { edisiId },
    include: { editor: true, reviewer: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getActiveEdisi() {
  return prisma.edisiJurnal.findFirst({
    where: { isAktif: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPengajuanByEdisi(edisiId: string) {
  return prisma.pengajuanDana.findUnique({
    where: { edisiId },
    include: { edisiJurnal: true },
  });
}

export async function getAllPengajuan() {
  return prisma.pengajuanDana.findMany({
    orderBy: { tanggalPengajuan: "desc" },
    include: {
      edisiJurnal: {
        include: {
          naskah: {
            include: { editor: true, reviewer: true },
          },
        },
      },
    },
  });
}
