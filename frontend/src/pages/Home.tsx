import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LatestDestinationCard";
import { HotelType } from "../../../backend/src/shared/types";

const Home = () => {
  const { data: hotels } = useQuery({
    queryKey: ["fetchHotels"],
    queryFn: apiClient.fetchHotels,
  });

  const hotelArray = Array.isArray(hotels) ? hotels : [];

  const topRowHotels = hotelArray.slice(0, 2);
  const bottomRowHotels = hotelArray.slice(2);

  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-bold">Latest Destinations</h2>
      <p>Most recent destinations added by our hosts</p>
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {topRowHotels.map((hotel: HotelType) => (
            <LatestDestinationCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {bottomRowHotels.map((hotel: HotelType) => (
            <LatestDestinationCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
