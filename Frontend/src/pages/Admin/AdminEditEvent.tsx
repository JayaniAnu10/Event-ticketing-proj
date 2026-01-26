import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminSidebar, AdminMobileHeader } from "@/components/AdminSidebar";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, useFieldArray } from "react-hook-form";
import useEditEvent from "@/hooks/useEditEvent";
import toast from "react-hot-toast";
import { useEffect } from "react";
import useEventDetails from "@/hooks/useEventDetails";

type FormValues = {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  image?: FileList;
  tickets: {
    type: string;
    price: string;
    available: string;
  }[];
};

const AdminEditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const eventId = Number(id);

  const { data: event, isLoading } = useEventDetails(eventId);
  const { mutate: editEvent, isPending } = useEditEvent();

  const { register, control, handleSubmit, reset, setValue } =
    useForm<FormValues>({
      defaultValues: {
        tickets: [{ type: "", price: "", available: "" }],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  useEffect(() => {
    if (!event?.eventDate) return;

    const dateTime = new Date(event.eventDate);
    const formatted = dateTime.toISOString().slice(0, 16);

    reset({
      title: event.name,
      description: event.description,
      date: formatted,
      location: event.location,
      category: event.category,
      image: undefined,
      tickets: event.ticketCategories.map((t: any) => ({
        type: t.type,
        price: String(t.unitPrice),
        available: String(t.availableQty),
      })),
    });
  }, [event, reset]);

  const onSubmit = (data: FormValues) => {
    const validTickets = data.tickets.filter(
      (t) => t.type && t.price && t.available,
    );

    if (validTickets.length === 0) {
      toast.error("Please add at least one ticket category");
      return;
    }

    const payload = {
      name: data.title,
      description: data.description,
      location: data.location,
      category: data.category,
      eventDate: data.date,
      totalSeats: validTickets.reduce((sum, t) => sum + Number(t.available), 0),
      ticketCategory: validTickets.map((t) => ({
        name: t.type,
        totalSeats: Number(t.available),
        unitPrice: Number(t.price),
      })),
    };

    const formData = new FormData();
    formData.append(
      "event",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    editEvent(
      { id: eventId, data: formData },
      {
        onSuccess: () => {
          toast.success("Event updated successfully");
          navigate("/admin/events");
        },
        onError: () => toast.error("Failed to update event"),
      },
    );
  };

  if (isLoading) {
    return <div className="p-10 text-center">Loading event...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <AdminMobileHeader />
      <AdminSidebar />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Link to="/admin/events">
              <Button variant="outline" size="icon">
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Edit Event</h1>
          </div>

          <Card className="bg-background border-gray-300 md:p-2">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title & Category */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>Event Title</Label>
                    <Input
                      {...register("title", { required: true })}
                      placeholder="Event Title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select onValueChange={(v) => setValue("category", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Concert",
                          "Conference",
                          "Food",
                          "Art",
                          "Sports",
                          "Entertainment",
                        ].map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    {...register("description")}
                    placeholder="Description"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="datetime-local"
                      {...register("date", { required: true })}
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input {...register("location")} placeholder="Location" />
                  </div>
                </div>

                {/* Image */}
                <div className="space-y-2">
                  <Label>Event Image</Label>

                  {event?.image && (
                    <p className="text-sm text-muted-foreground break-all">
                      Current image:{" "}
                      <span className="font-medium ">{event.image}</span>
                    </p>
                  )}

                  <Input type="file" {...register("image")} />
                </div>

                {/* Tickets */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Ticket Categories</Label>
                    <Button
                      type="button"
                      onClick={() =>
                        append({ type: "", price: "", available: "" })
                      }
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      <p className="md:block hidden"> Add Category</p>
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-4 gap-2">
                      <div className="space-y-1">
                        <Label>Type</Label>
                        <Input
                          {...register(`tickets.${index}.type`)}
                          placeholder="Type"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label>Price</Label>
                        <Input
                          type="number"
                          {...register(`tickets.${index}.price`)}
                          placeholder="Price"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label>Seats</Label>
                        <Input
                          type="number"
                          {...register(`tickets.${index}.available`)}
                          placeholder="Seats"
                        />
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                        className="self-end rounded-full w-11 h-11 text-white"
                      >
                        <Trash2 className="" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="grid md:grid-cols-2 gap-5">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-violet-600"
                  >
                    Update Event
                  </Button>

                  <Button variant="outline" asChild className="w-full">
                    <Link to="/admin/events">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminEditEvent;
