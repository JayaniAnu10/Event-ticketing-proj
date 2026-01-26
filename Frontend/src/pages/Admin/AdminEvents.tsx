import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminSidebar, AdminMobileHeader } from "@/components/AdminSidebar";
import { Calendar, Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import useAdminEvents from "@/hooks/useAdminEvents";
import Spinner from "@/components/Spinner";
import useAdminDel from "@/hooks/useAdminDel";

const AdminEvents = () => {
  const { data, isLoading, error } = useAdminEvents();
  const { mutate: deleteEvent } = useAdminDel();

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteEvent(id);
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <p>Something went wrong</p>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <AdminMobileHeader />
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                Manage Events
              </h1>
              <p className="text-md md:text-lg text-muted-foreground">
                View, edit, and delete events
              </p>
            </div>
            <Link to="/admin/add-event">
              <Button size="default" className="gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                Add New Event
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:gap-6">
            {data?.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden bg-background border-gray-400/30 md:h-70"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="h-48 md:h-auto md:w-1/4">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full md:h-70 object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg md:text-2xl font-bold">
                            {event.name}
                          </h3>
                          <span className="px-2 md:px-3 py-1 bg-primary/10 text-violet-600 text-sm font-semibold rounded-full">
                            {event.category}
                          </span>
                        </div>
                        <p className="text-sm md:text-base text-muted-foreground line-clamp-3 mb-3 md:mb-4">
                          {event.description}
                        </p>

                        <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                            {new Date(event.eventDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="truncate max-w-[250px]">
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <Link to={`/admin/edit-event/${event.id}`}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 md:h-10 md:w-10"
                          >
                            <Edit className="w-3 h-3 md:w-4 md:h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 md:h-10 md:w-10 text-white"
                          onClick={() => handleDelete(event.id, event.name)}
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 md:gap-4 pt-3 md:pt-4 border-t border-gray-300">
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Price
                        </p>
                        {event.ticketCategories.map((category) => (
                          <p
                            key={category.ticketCategoryId}
                            className="text-base md:text-lg font-bold text-primary"
                          >
                            {category.type} LKR {category.unitPrice}
                          </p>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Available
                        </p>
                        <p className="text-base md:text-lg font-bold">
                          {event.availableSeats}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Total
                        </p>
                        <p className="text-base md:text-lg font-bold">
                          {event.totalSeats}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminEvents;
