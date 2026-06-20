import ScanDetailPage from './client-page';

export async function generateStaticParams() {
  return Array.from({ length: 50 }, (_, i) => ({
    scanid: String(i + 1),
  }));
}

export const dynamicParams = false;

export default function Page() {
  return <ScanDetailPage />;
}