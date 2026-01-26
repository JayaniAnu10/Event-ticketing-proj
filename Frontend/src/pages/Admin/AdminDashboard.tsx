import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSidebar, AdminMobileHeader } from "@/components/AdminSidebar";
import { Calendar, Users, Ticket, DollarSign } from "lucide-react";
import useAdminDash from "@/hooks/useAdminDash";
import Spinner from "@/components/Spinner";

const AdminDashboard = () => {
  const { data, isLoading, error } = useAdminDash();

  const stats = [
    {
      title: "Total Events",
      value: data?.totEvents,
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Users",
      value: data?.totUsers,
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Total Bookings",
      value: data?.totBookings,
      icon: Ticket,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Revenue",
      value: `LKR ${data?.revenue}`,
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
  ];

  if (isLoading) {
    <Spinner />;
  }

  if (error) {
    <p>Failed to load data</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <AdminMobileHeader />
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-500">
              Welcome back! Here's what's happening with your events.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="overflow-hidden bg-background  hover:scale-105 transition-all border-gray-400/30"
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div
                      className={`p-2 md:p-3 rounded-xl md:rounded-2xl bg-linear-to-br ${stat.color}`}
                    >
                      <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm md:text-lg text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-xl md:text-3xl font-bold ">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className=" gap-4 md:gap-6">
            <Card className=" border-gray-400/30 p-4 bg-background">
              <CardHeader className="p-4 md:px-7 mb-3">
                <CardTitle className="flex items-center gap-2 text-base md:text-xl">
                  <Calendar className="w-4 h-4 md:w-7 md:h-7 text-primary" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <div className="space-y-3 md:space-y-4">
                  {data?.upcomingEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 pb-3 md:pb-4 border-b border-gray-300 last:border-0"
                    >
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-10 h-10 md:w-15 md:h-15 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-md truncate">
                          {event.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold">
                          {event.availableSeats}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          available
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
