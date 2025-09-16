import NewLocationClient from "./new-location";

export default async function NewLocation({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  return <NewLocationClient tripId={tripId} />;
}
