package com.jayanianu.eventticketing.services;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.jayanianu.eventticketing.entities.Booking;
import com.jayanianu.eventticketing.entities.Ticket;
import com.jayanianu.eventticketing.exceptions.PDFGenerationException;
import org.springframework.stereotype.Service;


import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
public class TicketPDFGeneratorService {

    public static File generatePDF(Booking booking, Ticket ticket) throws IOException, DocumentException {
        try{
            File file = File.createTempFile("ticket_" + booking.getId(), ".pdf");
            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream(file));
            document.open();


            Font titleFont = new Font(Font.FontFamily.HELVETICA, 24, Font.BOLD, new BaseColor(0, 102, 204)); // deep blue
            Font subtitleFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);
            Font normalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
            Font smallGrayFont = new Font(Font.FontFamily.HELVETICA, 10, Font.ITALIC, BaseColor.GRAY);


            Paragraph title = new Paragraph("EVENT TICKET", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            LineSeparator line = new LineSeparator();
            line.setLineColor(new BaseColor(200, 200, 200));
            document.add(new Chunk(line));
            document.add(Chunk.NEWLINE);


            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);
            table.setSpacingAfter(10);
            table.getDefaultCell().setBorder(Rectangle.NO_BORDER);

            table.addCell(new Phrase("Ticket Code:", subtitleFont));
            table.addCell(new Phrase(ticket.getTicketCode(), normalFont));

            table.addCell(new Phrase("Booking ID:", subtitleFont));
            table.addCell(new Phrase(String.valueOf(booking.getId()), normalFont));

            table.addCell(new Phrase("Payment ID:", subtitleFont));
            table.addCell(new Phrase(booking.getTransactionId() != null ? booking.getTransactionId() : "N/A", normalFont));

            table.addCell(new Phrase("Event:", subtitleFont));
            table.addCell(new Phrase(booking.getEvent().getName(), normalFont));

            table.addCell(new Phrase("Date:", subtitleFont));
            table.addCell(new Phrase(booking.getEvent().getEventDate().toString(), normalFont));

            table.addCell(new Phrase("Venue:", subtitleFont));
            table.addCell(new Phrase(booking.getEvent().getLocation(), normalFont));

            document.add(table);


            Paragraph message = new Paragraph("Thank you for your booking!\nWe look forward to seeing you at the event.", normalFont);
            message.setAlignment(Element.ALIGN_CENTER);
            message.setSpacingBefore(15);
            message.setSpacingAfter(10);
            document.add(message);

            document.add(new Chunk(line));
            Paragraph footer = new Paragraph("© 2025 Event Ticketing System", smallGrayFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(5);
            document.add(footer);
            document.close();

            return file;
        }catch(Exception e){
            throw new PDFGenerationException(e.getMessage());
        }

    }
}
