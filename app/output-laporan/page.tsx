import {
  getAllPengajuan,
  getEdisiJurnalList,
  getPengaturanTarif,
} from "@/app/actions";
import { prisma } from "@/app/lib/prisma";
import OutputLaporanClient from "@/app/components/OutputLaporanClient";

export default async function OutputLaporanPage() {
  const [pengajuanList, tarif] = await Promise.all([
    getAllPengajuan(),
    getPengaturanTarif(),
  ]);

  // Fetch all edisi with full naskah + editor + reviewer data for certificates
  const edisiList = await prisma.edisiJurnal.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      naskah: {
        include: {
          editor: true,
          reviewer: true,
        },
      },
    },
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Output Laporan</h2>
        <p>Surat pengajuan dana, sertifikat, dan panel persetujuan Kaprodi</p>
      </div>

      <OutputLaporanClient
        pengajuanList={JSON.parse(JSON.stringify(pengajuanList))}
        edisiList={JSON.parse(JSON.stringify(edisiList))}
        tarif={tarif ? JSON.parse(JSON.stringify(tarif)) : null}
      />
    </div>
  );
}
