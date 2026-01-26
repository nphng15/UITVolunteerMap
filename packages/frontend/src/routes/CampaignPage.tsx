import { useParams, Link } from "react-router";

export default function CampaignPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Thông tin Chiến dịch {campaignId}</h1>
      {/* Mock Team's link in Campaign */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-3">
          Đội hình trong Chiến dịch
        </h2>
        <ul className="list-disc list-inside">
          <li>
            <Link to="team/a">Đội hình A</Link>
          </li>
          <li>
            <Link to="team/b">Đội hình B</Link>
          </li>
          <li>
            <Link to="team/c">Đội hình C</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
