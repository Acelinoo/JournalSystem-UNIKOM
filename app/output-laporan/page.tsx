import {
  getAllPengajuan,
  getSystemSettingList,
} from "@/app/actions";
import { prisma } from "@/app/lib/prisma";
import OutputLaporanClient from "@/app/components/OutputLaporanClient";

export default async function OutputLaporanPage() {
  const [pengajuanList, systemSettingList] = await Promise.all([
    getAllPengajuan(),
    getSystemSettingList(),
  ]);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Output Laporan</h2>
        <p>Surat pengajuan dana, sertifikat, dan panel persetujuan Kaprodi</p>
      </div>

      <OutputLaporanClient
        pengajuanList={JSON.parse(JSON.stringify(pengajuanList))}
        edisiList={JSON.parse(JSON.stringify(systemSettingList))}
      />
    </div>
  );
}
