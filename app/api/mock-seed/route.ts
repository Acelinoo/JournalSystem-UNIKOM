import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST() {
  try {
    // Basic fallback seeding for demo purposes
    let edisiAktif = await prisma.systemSetting.findFirst({ where: { isActive: true } });
    if (!edisiAktif) {
      edisiAktif = await prisma.systemSetting.create({
        data: {
          volume: 9,
          no: 2,
          bulan: "April",
          tahun: 2026,
          isActive: true,
          honorEditor: 250000,
          honorReviewer: 300000,
          taxRate: 2.5
        },
      });
    }

    // Skip Kaprodi user check as User model might not exist depending on the schema (if it does, we can leave it or remove it). Wait, the User model isn't in schema.prisma!
    // I will remove the kaprodi user creation.

    // Check if pengajuan already exists
    const existingPengajuan = await prisma.pengajuanDana.findUnique({
      where: { systemSettingId: edisiAktif.id }
    });

    if (!existingPengajuan) {
      const bruto = 1650000;
      const pajakTotal = bruto * (2.5 / 100);
      const netto = bruto - pajakTotal;

      await prisma.pengajuanDana.create({
        data: {
          systemSettingId: edisiAktif.id,
          totalHonorBruto: bruto,
          totalTax: pajakTotal,
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
