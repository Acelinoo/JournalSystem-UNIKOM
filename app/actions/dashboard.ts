"use server";

import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  
  if (!token) return null;
  
  try {
    const jsonString = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
}

export async function getEditorDashboardData() {
  const user = await getSessionUser();
  if (!user || user.role !== "EDITOR" || !user.editorId) {
    redirect("/login");
  }

  const naskahList = await prisma.naskah.findMany({
    where: { editorId: user.editorId },
    include: {
      edisiJurnal: true,
      reviewer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const tarif = await prisma.pengaturanTarif.findFirst();
  const honorPerNaskah = tarif?.honorEditor || 250000;
  const totalHonor = naskahList.length * honorPerNaskah;

  return {
    editorName: user.nama,
    naskahList,
    totalHonor,
    honorPerNaskah
  };
}

export async function getReviewerDashboardData() {
  const user = await getSessionUser();
  if (!user || user.role !== "REVIEWER" || !user.reviewerId) {
    redirect("/login");
  }

  const naskahList = await prisma.naskah.findMany({
    where: { reviewerId: user.reviewerId },
    include: {
      edisiJurnal: true,
      editor: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const tarif = await prisma.pengaturanTarif.findFirst();
  const honorPerNaskah = tarif?.honorReviewer || 300000;
  const totalHonor = naskahList.length * honorPerNaskah;

  return {
    reviewerName: user.nama,
    naskahList,
    totalHonor,
    honorPerNaskah
  };
}

export async function submitReviewAction(naskahId: string) {
  const user = await getSessionUser();
  if (!user || user.role !== "REVIEWER" || !user.reviewerId) {
    throw new Error("Unauthorized");
  }

  await prisma.naskah.update({
    where: { id: naskahId },
    data: { statusReview: "Approved with Revision" },
  });

  revalidatePath("/dashboard/reviewer");
}

export async function getKaprodiDashboardData() {
  const user = await getSessionUser();
  if (!user || user.role !== "KAPRODI") {
    redirect("/login");
  }

  const pengajuanList = await prisma.pengajuanDana.findMany({
    include: {
      edisiJurnal: true,
    },
    orderBy: { tanggalPengajuan: "desc" },
  });

  return {
    kaprodiName: user.nama,
    pengajuanList,
  };
}

export async function approveAndSignAction(pengajuanId: string) {
  const user = await getSessionUser();
  if (!user || user.role !== "KAPRODI") {
    throw new Error("Unauthorized");
  }

  const timestamp = new Date().toISOString();
  const signatureHash = `SIGNED-${user.nama.replace(/\s+/g, "_").toUpperCase()}-${timestamp.slice(0, 10)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  await prisma.pengajuanDana.update({
    where: { id: pengajuanId },
    data: {
      status: "APPROVED",
      tandaTanganKaprodi: signatureHash,
      catatanRevisi: null,
    },
  });

  revalidatePath("/dashboard/kaprodi");
}

export async function rejectFundRequestAction(pengajuanId: string, catatan: string) {
  const user = await getSessionUser();
  if (!user || user.role !== "KAPRODI") {
    throw new Error("Unauthorized");
  }

  if (!catatan || catatan.trim() === "") {
    throw new Error("Catatan revisi/penolakan wajib diisi.");
  }

  await prisma.pengajuanDana.update({
    where: { id: pengajuanId },
    data: {
      status: "REJECTED",
      catatanRevisi: catatan.trim(),
      tandaTanganKaprodi: null,
    },
  });

  revalidatePath("/dashboard/kaprodi");
}
