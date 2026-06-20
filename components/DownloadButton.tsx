import { api } from "../services/api";

interface Props {
  reportId: number;
}

export function DownloadButton({ reportId }: Props) {
  const handleClick = async () => {
    const res = await api.get(`/reports/${reportId}`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `report-${reportId}.pdf`;
    link.click();
  };

  return <button onClick={handleClick}>Download Report</button>;
}


