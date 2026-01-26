import useEvents from "@/hooks/useEvents";
import Spinner from "../components/Spinner";
import { format } from "date-fns/format";
import { Calendar, MapPin, Search, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const categories = [
    "all",
    "concert",
    "conference",
    "food",
    "art",
    "sports",
    "entertainment",
    "music",
    "health",
    "technology",
    "business",
    "dj",
    "fashion",
    "cultural",
  ];

  const { data: events, error, isLoading } = useEvents();

  if (isLoading) return <Spinner />;
  if (error) return <p>{error.message}</p>;

  const filteredEvents = events?.filter((event) => {
    const name = event.name?.toLowerCase() || "";
    const desc = event.description?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    const matchSearch = name.includes(search) || desc.includes(search);

    const matchCategory =
      selectedCategory === "all" ||
      event.category.toLowerCase() === selectedCategory.toLowerCase();

    const eventDateOnly = event.eventDate?.slice(0, 10);
    const matchDate = !selectedDate || eventDateOnly === selectedDate;

    return matchSearch && matchCategory && matchDate;
  });

  return (
    <div>
      <div>
        <div className="flex flex-col justify-center items-center mt-30 gap-3">
          <span className="text-4xl font-bold tracking-wide">
            Explore{" "}
            <span className="bg-linear-to-r from-purple-800  to-rose-700 bg-clip-text text-transparent">
              Events
            </span>
          </span>
          <span className="text-muted-foreground">
            Find your next amazing experience
          </span>
        </div>
        <div className="grid hover:shadow-lg border-0 shadow-md shadow-popover/30 grid-cols-1 md:grid-cols-3  mx-5 md:mx-18 items-center my-9 rounded-2xl border-muted-foreground/20 p-5 bg-card">
          <div className="relative flex gap-3 border rounded-2xl border-muted-foreground/20 items-center mx-2  p-2 mb-3 md:mt-3 bg-background">
            <div>
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <input
                className="w-full bg-transparent outline-none line-height: leading-normal text-foreground min-w-5"
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="border rounded-2xl border-muted-foreground/20 bg-background mx-2 p-2 pl-4 my-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-background"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
          <div className="border rounded-2xl border-muted-foreground/20 mx-2 p-2 my-3 pl-4 bg-background">
            <input
              type="date"
              placeholder=""
              className="text-muted-foreground"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-2 md:mx-11">
            {filteredEvents?.map((event) => (
              <div className=" my-9 group" key={event.id}>
                <div className="border-0 shadow-md/20 group-hover:shadow-xl/30 shadow-popover rounded-2xl mx-7 overflow-clip flex flex-col bg-card ">
                  <div className="relative h-57 w-full overflow-hidden">
                    <img
                      src={event.image}
                      className="w-full h-full object-cover group-hover:scale-110 duration-300"
                    />
                    <div className="absolute top-4 left-4 text-white font-semibold bg-violet-600 rounded-xl  px-3">
                      {event.category}
                    </div>
                  </div>
                  <div className="mx-6">
                    <div>
                      <span className="text-xl font-bold line-clamp-1 my-5">
                        {event.name}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-sm mb-6">
                      <div className="  line-clamp-2 my-5">
                        <span>{event.description}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Calendar className="size-4 " />{" "}
                          <span>
                            {format(
                              new Date(event.eventDate.replace(" ", "T")),
                              "MMMM d, yyyy",
                            )}
                          </span>
                        </div>
                        <div className="flex gap-2 ">
                          <MapPin className="size-4 " />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex gap-2">
                          <Users className="size-4 " />
                          <span>{event.availableSeats} seats available</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center mb-7">
                      <Link to={`/events/${event.id}`} className="w-full block">
                        <button className="border-0 rounded-4xl bg-violet-600 w-full h-13 text-white font-bold hover:scale-105 cursor-pointer duration-300">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Events;
