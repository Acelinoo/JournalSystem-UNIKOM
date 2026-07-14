import { getEditorList, getReviewerList } from "@/app/actions";
import DataMasterClient from "@/app/components/DataMasterClient";

export default async function DataMasterPage() {
  const [editors, reviewers] = await Promise.all([
    getEditorList(),
    getReviewerList(),
  ]);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Data Master</h2>
        <p>Kelola data editor dan reviewer jurnal</p>
      </div>

      <DataMasterClient
        editors={JSON.parse(JSON.stringify(editors))}
        reviewers={JSON.parse(JSON.stringify(reviewers))}
      />
    </div>
  );
}
