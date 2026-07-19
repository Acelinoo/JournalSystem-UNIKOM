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

  const naskahList = await prisma.naskahJurnal.findMany({
    where: { editorId: user.editorId },
    include: {
      systemSetting: true,
      reviewer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const honorPerNaskah = 250000;
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

  const naskahList = await prisma.naskahJurnal.findMany({
    where: { reviewerId: user.reviewerId },
    include: {
      systemSetting: true,
      editor: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const honorPerNaskah = 300000;
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

  // Removed update to statusReview as the field does not exist in schema.
  // Ideally, add a status field to NaskahJurnal if needed.
  console.log("Submit review for", naskahId);

  revalidatePath("/dashboard/reviewer");
}

export async function getKaprodiDashboardData() {
  const user = await getSessionUser();
  if (!user || user.role !== "KAPRODI") {
    redirect("/login");
  }

  const pengajuanList = await prisma.pengajuanDana.findMany({
    include: {
      systemSetting: true,
    },
    orderBy: { createdAt: "desc" },
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
      digitalSignature: signatureHash,
      rejectionReason: null,
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
      rejectionReason: catatan.trim(),
      digitalSignature: null,
    },
  });

  revalidatePath("/dashboard/kaprodi");
}
