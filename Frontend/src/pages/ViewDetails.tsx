import useEventDetails from "@/hooks/useEventDetails";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Calendar, MapPin, Minus, Plus, Ticket, Users } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import useBookDetails from "@/hooks/useBookDetails";
import useCheckout from "@/hooks/useCheckout";
import useAuth from "@/hooks/useAuth";

const ViewDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState("");
  const [total, setTotal] = useState(0);
  const { data: user } = useAuth();

  const { mutate: bookingDetails } = useBookDetails();
  const { mutate: checkout } = useCheckout();

  const handleBooking = () => {
    interface BookingResponse {
      id: number;
      // add more fields if backend returns them
    }
    bookingDetails(
      {
        userId: user.id,
        ticketCategoryId: Number(selectedTicketType),
        eventId,
        quantity,
      },
      {
        onSuccess: (bookingRes: BookingResponse) => {
          console.log("booking success");
          setQuantity(1);
          setSelectedTicketType("");
          refetchEvent();
          const bookingId = bookingRes.id;

          checkout(bookingId, {
            onSuccess: (checkoutRes) => {
              console.log("Checkout session created:", checkoutRes);
              window.location.href = checkoutRes.checkoutUrl;
            },
            onError: (err) => {
              console.error("Checkout failed", err);
              alert("Something went wrong while redirecting to payment.");
            },
          });
        },

        onError: () => {
          console.log("booking failed");
        },
      },
    );
  };

  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const {
    data: event,
    isLoading,
    error,
    refetch: refetchEvent,
  } = useEventDetails(eventId);

  useEffect(() => {
    if (!selectedTicketType) {
      setTotal(0);
      return;
    }

    if (selectedTicketType) {
      const ticket = event?.ticketCategories.find(
        (t) => t.ticketCategoryId === Number(selectedTicketType),
      );
      if (ticket) {
        setTotal(Number(ticket.unitPrice) * Number(quantity));
      }
    }
  }, [selectedTicketType, quantity, event]);

  console.log(event);

  if (isLoading) return <Spinner />;
  if (error) return <p>{error.message}</p>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="mt-20 md:flex  ">
      <div className="my-9 md:w-180 group md:ml-15" key={event.id}>
        <div className="border-0 shadow-md/20 group-hover:shadow-xl/30 shadow-popover rounded-2xl mx-7 overflow-clip flex flex-col bg-card ">
          <div className="relative h-100 w-full overflow-hidden">
            <img
              src={event.image}
              className="w-full h-full object-cover group-hover:scale-110 duration-300"
            />
            <div className="absolute top-4 left-4 text-white font-semibold bg-violet-600 rounded-2xl  px-3 py-1">
              {event.category}
            </div>
          </div>
        </div>
        <div className="mx-7 mt-8 ">
          <div>
            <span className="font-bold text-4xl ">{event.name}</span>
          </div>
          <div className="text-muted-foreground">
            <div className="mt-5">
              <span className=" text-lg ">{event.description}</span>
            </div>
            <div className="mt-7 flex flex-col gap-3 font-semibold">
              <div className="flex gap-3">
                <Calendar className="text-violet-600 size-5" />
                <span>
                  {format(
                    new Date(event.eventDate.replace(" ", "T")),
                    "EEEE, MMMM d, yyyy",
                  )}
                </span>
              </div>
              <div className="flex gap-3">
                <MapPin className="text-violet-600 size-5" />
                <span>{event.location}</span>
              </div>
              <div className="flex gap-3 mb-7">
                <Users className="text-violet-600 size-5" />
                <span>
                  {event.availableSeats} of {event.totalSeats} seats available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card  shadow-md/20 hover:shadow-2xl/30 shadow-popover rounded-xl border-border/15 mx-7 p-2 px-4 py-13 md:px-8 md:mt-10 md:w-110 h-full">
        <div className="flex gap-2 mb-10">
          <Ticket className="text-violet-600 mt-1 md:size-8" />
          <span className="text-2xl md:text-3xl font-semibold">
            Book Your Tickets
          </span>
        </div>
        {event.ticketCategories.length > 0 && (
          <div className="">
            <p className="font-semibold mb-2 ">Ticket Type</p>
            <select
              value={selectedTicketType}
              onChange={(e) => setSelectedTicketType(e.target.value)}
              className="bg-background border border-muted-foreground/50 rounded-2xl p-2 text-sm "
            >
              <option value="">Select ticket type </option>
              {event.ticketCategories.map((ticket) => (
                <option
                  key={ticket.ticketCategoryId}
                  value={ticket.ticketCategoryId}
                >
                  {ticket.type}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="my-9 font-semibold flex flex-col gap-3">
          <div>
            <span>Quantity</span>
          </div>

          <div className="flex mx-2 gap-3">
            <div>
              <button
                disabled={quantity <= 1}
                onClick={() => {
                  setQuantity(quantity - 1);
                }}
              >
                <Minus className="cursor-pointer text-violet-600 size-10 mt-2 border-2 border-violet-600 hover:text-white hover:bg-violet-600 rounded-full" />
              </button>
            </div>
            <div>
              <input
                value={quantity}
                className="border w-20 h-13 p-3 pl-8 border-muted-foreground/50 rounded-2xl"
              />
            </div>

            <div>
              <button
                disabled={quantity >= 10}
                onClick={() => {
                  setQuantity(quantity + 1);
                }}
                className=""
              >
                <Plus className=" cursor-pointer mt-2 text-violet-600 size-10 border-2 border-violet-600 hover:text-white hover:bg-violet-600 rounded-full" />
              </button>
            </div>
          </div>
          <p className="text-muted-foreground text-sm font-medium mb-7">
            Maximum 10 tickets per booking
          </p>
          <div>
            <div className=" border-y dark:border-gray-600  my-3  flex flex-col gap-2">
              <div className="justify-between flex mt-4">
                <span>Subtotal</span>
                <span>LKR {total}</span>
              </div>
              <div className="justify-between flex mb-3">
                <span>Service Fee</span>
                <span>LKR 100</span>
              </div>
            </div>
            <div className="justify-between flex mb-3 text-2xl">
              <span>Total</span>
              <span>LKR {(total + 100).toFixed(2)}</span>
            </div>
            <button
              onClick={handleBooking}
              disabled={!selectedTicketType}
              className="text-white text-xl  border-violet-600 cursor-pointer bg-violet-600 rounded-4xl p-2 w-full h-15 mt-10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
