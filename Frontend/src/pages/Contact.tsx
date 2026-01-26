import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "support@eventhub.com",
      subtext: "We respond within 24 hours",
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+94112456789",
      subtext: "Mon-Fri, 9am-6pm EST",
    },
    {
      icon: MapPin,
      title: "Address",
      details: "123 Gamini street",
      subtext: "Colombo 10",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Monday - Friday",
      subtext: "9:00 AM - 6:00 PM EST",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              <Mail className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Have a question or need assistance? We're here to help you with
              anything related to events and bookings.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="shadow-card  border-gray-300 bg-background dark:border-gray-400/30"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <info.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {info.title}
                        </h3>
                        <p className="text-foreground">{info.details}</p>
                        <p className="text-sm text-muted-foreground">
                          {info.subtext}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
