import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Ticket,
  User as UserIcon,
  Mail,
  Download,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { getUserFromToken } from "@/utils/getUserFromToken";
import useHistory from "@/hooks/useHistory";
import Spinner from "../components/Spinner";
import { useEffect } from "react";
import useDownloadTickets from "@/hooks/useDownloadPDF";
import useUserDetails from "@/hooks/useUserDetails";

const Profile = () => {
  const navigate = useNavigate();
  const { data: bookings = [], isLoading, isError } = useHistory();
  const { mutate: downloadTickets, isPending } = useDownloadTickets();
  const token = localStorage.getItem("accessToken");
  const userFromToken = token ? getUserFromToken(token) : null;

  const userId = Number(userFromToken?.sub);

  const { data: user, isLoading: detailsLoading } = useUserDetails(userId);

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
    }
  }, [token, user, navigate]);

  if (!token || !user) {
    return null;
  }

  if (detailsLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Profile Header */}
          <Card className="mb-12 border/15 shadow-lg md:p-4">
            <CardContent className="p-4 px-8">
              <div className="md:flex items-center md:gap-6 grid grid-rows-3 justify-center ">
                <div className="w-24 h-24 rounded-full bg-linear-to-r from-primary to-violet-300 flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="hover:text-white text-violet-600 border-violet-600 "
                >
                  <Link to={`/edit/${user.id}`}>Edit Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          {isLoading && <Spinner />}
          {isError && (
            <p className="text-red-500 text-center">
              Failed to load booking history
            </p>
          )}
          {/* Booking History */}
          <div className="animate-scale-in">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Ticket className="w-8 h-8 text-primary" />
              My Bookings
            </h2>

            {bookings.length === 0 ? (
              <Card className="border/15 shadow-lg ">
                <CardContent className="p-12 text-center b">
                  <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No bookings yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start exploring amazing events and book your first tickets!
                  </p>
                  <Button
                    onClick={() => navigate("/events")}
                    className="cursor-pointer hover:scale-105 text-white"
                  >
                    Browse Events
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-10">
                {bookings.map((booking, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-xl transition-all border/25 shadow-sm"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={booking.image}
                          alt={booking.name}
                          className="w-full h-70 object-cover"
                        />
                      </div>
                      <CardContent className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold mb-2">
                              {booking.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.eventDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              {booking.location}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              LKR {booking.totalPayment.toFixed(2)}
                            </div>
                            <div className="text-lg text-muted-foreground">
                              {booking.totalTickets} x {booking.eventTicket}
                            </div>
                          </div>
                        </div>

                        <div className=" grid md:grid-cols-2 gap-3 pt-4 border-t border-gray-500/30">
                          <div>
                            <p className="text-sm text-muted-foreground mt-4">
                              Booked on{" "}
                              {new Date(booking.bookingDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                          <Button
                            variant="default"
                            className="flex-1 rounded-4xl py-5  border-violet-600 text-white"
                            onClick={() => downloadTickets(booking.id)}
                            disabled={isPending}
                          >
                            <Download />
                            {isPending ? "Downloading..." : "Download Tickets"}
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
