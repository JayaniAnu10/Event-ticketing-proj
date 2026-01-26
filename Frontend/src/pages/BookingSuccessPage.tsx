import useBookingSuccess from "@/hooks/useBookingSuccess";
import { Calendar, CheckCircle, Download, MapPin, Ticket } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import useDownloadTickets from "@/hooks/useDownloadPDF";

const BookingSuccessPage = () => {
  const [params] = useSearchParams();
  const bookingId = Number(params.get("booking_id"));
  const { mutate: downloadTickets, isPending } = useDownloadTickets();

  const { data: booking, error } = useBookingSuccess(bookingId);

  if (error) return <p>{error.message}</p>;

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10">
      <div className="">
        <div className="flex justify-center">
          <div className="bg-linear-to-r  from-violet-800 to-rose-500 rounded-full mt-10 inline-flex w-24 h-24 items-center justify-center animate-float ">
            <CheckCircle className="text-w text-violet-50 size-13 " />
          </div>
        </div>
        <div>
          <div>
            <div className="text-4xl font-bold text-center mt-4">
              Booking Confirmed!
            </div>
            <span className="text-lg text-center flex justify-center mx-2 text-gray-600 mt-4">
              Your tickets have been successfully booked. Check your email for
              confirmation.
            </span>
            <div className="mx-5 mt-6 text-center rounded-4xl ">
              <div className="md:mx-80 md:px-6 border-0 shadow-md/20 hover:shadow-xl/30 shadow-popover  rounded-4xl bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10">
                <div className="p-5">
                  <span className="text-2xl font-semibold ">
                    Booking Summary
                  </span>
                </div>
                <div className="mx-5 ">
                  <div className="pt-2">
                    <img
                      src={booking?.image}
                      className="bg-cover rounded-2xl w-full h-100"
                    />
                  </div>
                  <div className="mt-4 mb-5">
                    <p className="text-2xl font-bold">{booking?.eventName}</p>
                  </div>
                  <div className="flex gap-2 ">
                    <Calendar className="text-violet-500 size-5" />
                    {booking?.date ? (
                      <span className="text-gray-600">
                        {format(
                          new Date(booking.date.replace(" ", "T")),
                          "EEEE, MMMM d, yyyy",
                        )}
                      </span>
                    ) : (
                      <span>N/A</span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <MapPin className="text-violet-500 size-5" />
                    <span className="text-gray-600">{booking?.location}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Ticket className="text-violet-500 size-5" />
                    <span className="text-gray-600">
                      {booking?.quantity}x {booking?.ticketCategory}
                    </span>
                  </div>
                  <div className="mt-6 border border-muted-foreground/50"></div>
                  <div className="flex justify-between my-8 font-bold text-2xl mb-19">
                    <span className=" ">Total Paid</span>
                    <span className="text-violet-500  ">
                      Rs.{booking?.total! + 100}
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-5 justify-center text-center w-full">
                    <button
                      className="text-violet-500 flex gap-2 text-lg font-semibold border-2 justify-center rounded-4xl p-2 px-3 pt-3 border-violet-500 hover:text-violet-50 hover:bg-violet-500 duration-300 w-full"
                      onClick={() => downloadTickets(booking?.id!)}
                      disabled={isPending}
                    >
                      <Download />
                      {isPending ? "Downloading..." : "Download Tickets"}
                    </button>
                    <button className="bg-violet-500 text-violet-50 rounded-4xl p-3 font-semibold text-lg hover:scale-105 duration-300 w-full">
                      <Link to={"/profile"}>View My Bookings</Link>
                    </button>
                  </div>
                  <div className="mt-9 pb-10 mb-15">
                    <Link to="/events" className="text-violet-500">
                      Browse More Events
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
