import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAddEvent from "@/hooks/useAddEvent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdminSidebar, AdminMobileHeader } from "@/components/AdminSidebar";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UploadButton from "@/components/ui/UploadButton";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";

interface TicketType {
  type: string;
  price: string;
  available: string;
}

type FormValues = {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  image: File | null;
  totalSeats: string;
};

const AdminAddEvent = () => {
  const navigate = useNavigate();
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { type: "", price: "", available: "" },
  ]);

  const addTicketType = () => {
    setTicketTypes((prev) => [...prev, { type: "", price: "", available: "" }]);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTicketChange = (
    index: number,
    field: keyof TicketType,
    value: string,
  ) => {
    setTicketTypes((prev) =>
      prev.map((ticket, i) =>
        i === index ? { ...ticket, [field]: value } : ticket,
      ),
    );
  };

  const { mutate, isPending } = useAddEvent();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      category: "",
      image: null,
      totalSeats: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    const validTickets = ticketTypes.filter(
      (t) => t.type && t.price && t.available,
    );

    const hasInvalidTickets = ticketTypes.some(
      (t) =>
        (t.type || t.price || t.available) &&
        (!t.type || !t.price || !t.available),
    );

    if (hasInvalidTickets) {
      toast.error("Please complete all ticket category fields");
      return;
    }

    if (validTickets.length === 0) {
      toast.error("Add at least one ticket category");
      return;
    }

    // 4. Duplicate category name check
    const hasDuplicateTypes =
      new Set(validTickets.map((t) => t.type)).size !== validTickets.length;

    if (hasDuplicateTypes) {
      toast.error("Ticket category names must be unique");
      return;
    }

    const ticketCategory = ticketTypes.map((t) => ({
      name: t.type,
      totalSeats: Number(t.available),
      unitPrice: Number(t.price),
    }));

    mutate(
      {
        name: data.title,
        location: data.location,
        description: data.description,
        totalSeats: Number(data.totalSeats),
        eventDate: data.date,
        category: data.category,
        image: data.image ?? undefined,
        ticketCategory,
      },
      {
        onSuccess: () => {
          toast.success("Event created successfully!");
          reset();
          setTicketTypes([{ type: "", price: "", available: "" }]);
          navigate("/admin/events");
        },
        onError: () => {
          toast.error("Failed to create event");
        },
      },
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <AdminMobileHeader />
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8 animate-fade-in-up">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              Add New Event
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Create a new event for users to book
            </p>
          </div>

          <Card className="border-gray-400/30 p-2 bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Calendar className="w-6 h-6 text-primary " />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      placeholder="Summer Music Festival 2024"
                      {...register("title", { required: true })}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm">Title is required</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Controller
                      control={control}
                      name="category"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Concert">Concert</SelectItem>
                            <SelectItem value="Conference">
                              Conference
                            </SelectItem>
                            <SelectItem value="Food">Food & Dining</SelectItem>
                            <SelectItem value="Art">Art & Culture</SelectItem>
                            <SelectItem value="Sports">Sports</SelectItem>
                            <SelectItem value="Entertainment">
                              Entertainment
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.category && (
                      <p className="text-red-500 text-sm">
                        Category is required
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your event..."
                    rows={4}
                    {...register("description", { required: true })}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      Description is required
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Event Date *</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      {...register("date", { required: true })}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm">Date is required</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Central Park, New York"
                    {...register("location", { required: true })}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm">Location is required</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seats">Total Seats</Label>
                  <Input
                    id="seats"
                    type="number"
                    min={1}
                    placeholder="1000"
                    {...register("totalSeats", { required: true })}
                  />
                  {errors.totalSeats && (
                    <p className="text-red-500 text-sm">
                      Total seats is required
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Event Image</Label>
                  <Controller
                    control={control}
                    name="image"
                    render={({ field }) => (
                      <div className="flex gap-2 items-center">
                        <Input
                          id="image"
                          value={field.value ? field.value.name : ""}
                          readOnly
                          placeholder="Upload image"
                        />
                        <UploadButton
                          onChange={(file) => field.onChange(file)}
                        />
                      </div>
                    )}
                  />
                </div>

                {/* Ticket Categories */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      Ticket Categories *
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTicketType}
                      className="gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Category
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {ticketTypes.map((ticket, index) => (
                      <Card
                        key={index}
                        className="p-4 bg-muted/30 border-gray-300"
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1 space-y-2">
                            <Label htmlFor={`ticket-type-${index}`}>
                              Category Name
                            </Label>
                            <Input
                              id={`ticket-type-${index}`}
                              placeholder="e.g., General Admission, VIP, Early Bird"
                              value={ticket.type}
                              onChange={(e) =>
                                handleTicketChange(
                                  index,
                                  "type",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="w-full md:w-32 space-y-2">
                            <Label htmlFor={`ticket-price-${index}`}>
                              Price (LKR)
                            </Label>
                            <Input
                              id={`ticket-price-${index}`}
                              type="number"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              value={ticket.price}
                              onChange={(e) =>
                                handleTicketChange(
                                  index,
                                  "price",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="w-full md:w-32 space-y-2">
                            <Label htmlFor={`ticket-available-${index}`}>
                              Available
                            </Label>
                            <Input
                              id={`ticket-available-${index}`}
                              type="number"
                              placeholder="100"
                              min="1"
                              value={ticket.available}
                              onChange={(e) =>
                                handleTicketChange(
                                  index,
                                  "available",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTicketType(index)}
                              disabled={ticketTypes.length === 1}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {ticketTypes.some(
                    (t) => t.type && t.price && t.available,
                  ) && (
                    <div className="space-y-2 p-4 bg-background rounded-lg border border-gray-300">
                      {ticketTypes
                        .filter((t) => t.type && t.price && t.available)
                        .map((t, index) => (
                          <div
                            key={index}
                            className="text-sm flex justify-between"
                          >
                            <span className="font-medium">{t.type}</span>
                            <span>
                              LKR {t.price} • {t.available} seats
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-6 flex-col md:flex-row">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 hover:scale-101 bg-violet-600 p-4"
                    disabled={isPending}
                  >
                    Create Event
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/admin/events")}
                  >
                    Cancel
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

export default AdminAddEvent;
