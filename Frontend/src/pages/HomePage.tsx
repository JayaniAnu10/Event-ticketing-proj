import heroBackground from "@/assets/hero-background.jpg";
import { Calendar, MapPin, Star } from "lucide-react";
import { Sparkles } from "lucide-react";
import { ArrowDown } from "lucide-react";
import { Ticket } from "lucide-react";
import { Users } from "lucide-react";
import { Trophy } from "lucide-react";
import { format } from "date-fns";
import useEvents from "@/hooks/useEvents";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { data: events, error, isLoading } = useEvents();

  if (isLoading) return <Spinner />;
  if (error) return <p>{error.message}</p>;

  const limitedEvents = events?.slice(0, 3);

  return (
    <div>
      <section
        className="relative flex flex-col items-center justify-center h-[calc(100vh)]  bg-fixed bg-cover bg-center min-h-[400px]"
        style={{
          backgroundImage: `url(${heroBackground})`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-background/99 via-background/70 to-background/85 z-10" />
        <div className="absolute inset-0 bg-linear-to-r from-background/40 via-transparent to-background/40 z-10" />

        <div className="text-3xl mt-18 md:mt-17 relative z-20 font-extrabold lg:text-7xl md:text-5xl sm:text-4xl drop-shadow-2xl ">
          <span>Discover Your Next</span>
          <span
            className="block text-center bg-linear-to-r from-violet-900 via-accent-foreground to-violet-500 bg-clip-text text-transparent animate pt-2 pb-6 "
            style={{
              animation: "gradientAnimation 8s linear infinite",
              backgroundSize: "200% auto",
            }}
          >
            Amazing Event
          </span>
        </div>
        <div className="items-center text-1xl md:text-xl lg:3xl flex  mt-4 mx-4 md:mx-70">
          <p className="relative z-20 dark:text-gray-50 font-semibold text-gray-700 text-center">
            Join thousands of people experiencing unforgettable moments. Book
            your tickets now and create memories that last forever.
          </p>
        </div>
        <div className="relative  mt-4 md:mb-7 z-20  flex md:gap-14 gap-2 -mb-3">
          <div className="bg-background/50  p-1 hover:scale-110 transition-transform duration-300 border-2 border-primary/20 text-center  rounded-2xl md:px-8 md:py-5 items-center ">
            <span className="md:text-5xl font-extrabold bg-linear-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
              10K+
            </span>
            <span className="block  text-sm font-semibold ">
              Happy Customers
            </span>
          </div>
          <div className="relative hover:scale-110 transition-transform duration-300 border-2 border-primary/20 text-center p-1 bg-background/50 rounded-2xl md:px-8 md:py-5 items-center ">
            <span className="md:text-5xl font-extrabold bg-linear-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
              500+
            </span>
            <span className="block text-sm font-semibold ">Events</span>
          </div>
          <div className="relative hover:scale-110 transition-transform duration-300  border-2 border-primary/20 text-center p-1 bg-background/50  rounded-2xl  md:px-8 md:py-5 items-center ">
            <span className="md:text-5xl font-extrabold bg-linear-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
              4.9★
            </span>
            <span className="block  text-sm font-semibold ">
              Average Rating
            </span>
          </div>
        </div>
        <div className="relative mt-12 md:mt-2 z-20 flex md:gap-9 gap-4 mx-5 my-8">
          <Link to={"/events"}>
            <button className="group border-none bg-violet-600 text-white md:font-bold font-semibold md:p-3 p-2 rounded-4xl md:rounded-2xl md:text-xl flex md:gap-3 gap-1 my-1  hover:scale-110 transition-transform duration-300">
              <span className="md:ml-3">Explore Events</span>
              <Calendar className="md:w-5 md:h-5 w-4 h-4 md:mt-1 mt-3 mr-3 group-hover:rotate-12" />
            </button>
          </Link>
          <Link to={"/login"}>
            <button className="group md:font-bold font-semibold md:p-3 md:rounded-2xl rounded-4xl p-2  my-1 md:text-xl hover:scale-110 transition-transform duration-300 border-primary/40 border-2 bg-background/50 text-violet-600 flex md:gap-3 gap-1">
              <span className="md:ml-3">Get Started</span>
              <Sparkles className="w-5 h-5 md:mt-1 mt-3 mr-3 group-hover:rotate-12" />
            </button>
          </Link>
        </div>
        <div className="absolute flex flex-col bottom-0 animate-bounce z-20 items-center">
          <span className="text-sm">Scroll to explore</span>
          <ArrowDown />
        </div>
      </section>

      <section>
        <div>
          <div className="md:px-3.5 p-2 md:gap-4 pt-15 md:pt-30 flex flex-col items-center gap-2 text-center">
            <span className="text-3xl md:tracking-wide  md:text-5xl font-bold">
              Why Choose Eventra?
            </span>
            <p className="text-gray-500 md:mx-auto  md:text-lg">
              Experience the easiest way to discover and book amazing events
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 px-6 gap-15 md:gap-0 md:mt-18 mt-10 md:mx-8">
            <div className="bg-card flex flex-col rounded-2xl items-center shadow-sm hover:shadow-lg/50 shadow-popover gap-5 mx-3 ">
              <div className="flex md:mt-15 mt-8 items-center">
                <div className="group-hover:rotate-12 duration-300 bg-linear-to-br p-4 from-purple-500 to-pink-500 rounded-2xl ">
                  <Ticket className="w-8 h-8 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold">Easy Booking</span>
              <p className="text-zinc-500 mx-3 mb-6 text-center">
                Book your tickets in just a few clicks with our streamlined
                checkout process
              </p>
            </div>
            <div className="group bg-card flex flex-col rounded-2xl items-center shadow-sm hover:shadow-lg/50 shadow-popover gap-5 mx-3">
              <div className="flex mt-8 md:mt-15 items-center">
                <div className="group-hover:rotate-12 duration-300 bg-linear-to-br p-4 from-orange-500 to-red-500 rounded-2xl ">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold">Premium Events</span>
              <p className="text-zinc-500 mx-3 mb-6 text-center">
                Access to the best curated events with verified organizers and
                quality experiences
              </p>
            </div>
            <div className="group flex flex-col rounded-2xl items-center bg-card shadow-sm hover:shadow-lg/50 shadow-popover gap-5 mx-3">
              <div className="flex mt-8 md:mt-15 items-center">
                <div className="group-hover:rotate-12 duration-300 bg-linear-to-br p-4 from-cyan-500 to-blue-500 rounded-2xl ">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold">Trusted Community</span>
              <p className="text-zinc-500 mx-3 mb-6 text-center">
                Join thousands of happy customers who trust us for their event
                experiences
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="bg-card pb-20">
          <div className="md:px-3.5 p-2 md:gap-4 pt-15 mt-20 flex flex-col items-center gap-2 ">
            <span className="text-3xl md:tracking-wide  md:text-4xl font-bold">
              Event Categories
            </span>
            <p className="text-gray-500 md:mx-auto  md:text-lg">
              Find events that match your interests
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 px-6 gap-15 md:gap-0 md:mt-18 mt-10 md:mx-8">
            <div className="group flex flex-col rounded-2xl items-center shadow-sm hover:shadow-lg/50 shadow-popover gap-5 mx-3 ">
              <div className="flex md:mt-15 mt-8 items-center">
                <div className="group-hover:rotate-12 duration-300 bg-linear-to-br p-4 from-purple-500 to-pink-500 rounded-2xl ">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold">Concerts</span>
              <p className="text-zinc-500 mx-3 mb-6 text-center">
                Live music experiences
              </p>
            </div>
            <div className="group flex flex-col rounded-2xl items-center shadow-sm hover:shadow-lg/50 shadow-popover gap-5 mx-3">
              <div className="flex mt-8 md:mt-15 items-center">
                <div className="group-hover:rotate-12 duration-300 bg-linear-to-br p-4 from-orange-500 to-red-500 rounded-2xl ">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold">Festivals</span>
              <p className="text-zinc-500 mx-3 mb-6 text-center">
                Multi-day celebrations
              </p>
            </div>
            <div className="group flex flex-col rounded-2xl items-center shadow-sm hover:shadow-lg/50 shadow-popover gap-5 mx-3">
              <div className="flex mt-8 md:mt-15 items-center">
                <div className=" bg-linear-to-br p-4 from-cyan-500 to-blue-500 rounded-2xl group-hover:rotate-12 duration-300">
                  <Users className="w-8 h-8  text-white" />
                </div>
              </div>
              <span className="text-xl font-bold">Workshops</span>
              <p className="text-zinc-500 mx-3 mb-6 text-center">
                Learn new skills
              </p>
            </div>
            <div className="group flex flex-col rounded-2xl items-center shadow-sm hover:shadow-lg/50 shadow-popover gap-5 mx-3">
              <div className="flex mt-8 md:mt-15 items-center">
                <div className=" group-hover:rotate-12 duration-300 bg-linear-to-br p-4 from-yellow-500 to-green-500 rounded-2xl ">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold">Sports</span>
              <p className="text-zinc-500 mx-3 mb-6 text-center">
                Athletic competitions
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="md:px-3.5 p-2 md:gap-4  mt-15 flex flex-col items-center text-center gap-2">
            <span className="text-3xl md:tracking-wide  md:text-4xl font-bold">
              Featured Events
            </span>
            <span className="text-gray-500 md:mx-auto  md:text-lg">
              Don't miss out on these upcoming experiences
            </span>
          </div>
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-2 md:mx-11">
              {limitedEvents?.map((event) => (
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
                            <span className="line-clamp-1">
                              {event.location}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Users className="size-4 " />
                            <span>{event.availableSeats} seats available</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex  justify-center mb-7">
                        <Link
                          to={`/events/${event.id}`}
                          className="w-full block"
                        >
                          <button className="border rounded-4xl bg-violet-600 h-13 text-white font-bold hover:scale-105 cursor-pointer duration-300 w-full">
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
          <div className="mx-14 mt-2  flex justify-center">
            <Link to="/events">
              <button className="border-2 border-violet-600 rounded-4xl  w-50 h-14 text-violet-600 font-semibold hover:bg-violet-600 hover:text-white cursor-pointer duration-300 text-lg mb-20">
                View More Events
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
