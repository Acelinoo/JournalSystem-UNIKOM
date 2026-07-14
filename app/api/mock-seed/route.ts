import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST() {
  try {
    // Basic fallback seeding for demo purposes
    let tarif = await prisma.pengaturanTarif.findFirst();
    if (!tarif) {
      tarif = await prisma.pengaturanTarif.create({
        data: {
          honorEditor: 250000,
          honorReviewer: 300000,
          persentasePajak: 2.5,
        },
      });
    }

    let edisiAktif = await prisma.edisiJurnal.findFirst({ where: { isAktif: true } });
    if (!edisiAktif) {
      edisiAktif = await prisma.edisiJurnal.create({
        data: {
          volume: 9,
          nomor: 2,
          bulan: "April",
          tahun: 2026,
          isAktif: true,
        },
      });
    }

    let kaprodi = await prisma.user.findUnique({ where: { username: "kaprodi.if" } });
    if (!kaprodi) {
      await prisma.user.create({
        data: {
          username: "kaprodi.if",
          password: "kaprodi123",
          nama: "Prof. Dr. Ir. Eddy Soeryanto Soegoto, M.T.",
          role: "KAPRODI",
        },
      });
    }

    // Check if pengajuan already exists
    const existingPengajuan = await prisma.pengajuanDana.findUnique({
      where: { edisiId: edisiAktif.id }
    });

    if (!existingPengajuan) {
      const bruto = 1650000;
      const pajakTotal = bruto * (2.5 / 100);
      const netto = bruto - pajakTotal;

      await prisma.pengajuanDana.create({
        data: {
          edisiId: edisiAktif.id,
          totalHonorBruto: bruto,
          totalPotonganPajak: pajakTotal,
          totalHonorNetto: netto,
          status: "PENDING",
        },
      });
    }

    return NextResponse.json({ success: true, message: "Mock data created!" });
  } catch (error: any) {
    console.error("Mock seed error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
