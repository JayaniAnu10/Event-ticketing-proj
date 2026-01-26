import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I book tickets for an event?",
      answer:
        "To book tickets, browse our events page, select your desired event, choose your ticket type and quantity, then click the 'Book Now' button. You'll be guided through a simple checkout process to complete your booking.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and digital payment methods. All transactions are secured with industry-standard encryption to protect your information.",
    },
    {
      question: "How will I receive my tickets?",
      answer:
        "After successful booking, you'll receive an email confirmation with your e-tickets. You can also download your tickets from your profile page. Simply present the Ticket code on your ticket at the event entrance.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
              <HelpCircle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-violet-500 to-violet-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about booking, payments, and our
              services
            </p>
          </div>

          {/* FAQ Accordion */}
          <Card className="p-6 bg-background border-gray-300/30 shadow-card">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-md hover:text-primary transition-colors">
                    <span className="font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
