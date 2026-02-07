package com.jayanianu.eventticketing.services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Attachments;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class EmailService {
    private SendGrid sendGrid;

    @Value("${sendgrid.api-key}")
    private String sendGridApiKey;

    @PostConstruct
    public void init() {
        if (sendGridApiKey == null || sendGridApiKey.isEmpty()) {
            throw new RuntimeException("SendGrid API Key not set in environment variables or application.yml!");
        }
        sendGrid = new SendGrid(sendGridApiKey);
    }

    public void sendTicketEmail(String to, String subject, String text, List<File> attachments) {
        Mail mail = new Mail();
        Email from = new Email("jayanianuththara10@gmail.com"); // sender email
        mail.setFrom(from);
        mail.setSubject(subject);

        Personalization personalization = new Personalization();
        personalization.addTo(new Email(to));
        mail.addPersonalization(personalization);

        mail.addContent(new Content("text/plain", text));

        // Attach PDF files
        if (attachments != null) {
            for (File file : attachments) {
                try {
                    Attachments attachment = new Attachments();
                    byte[] bytes = Files.readAllBytes(file.toPath());
                    String encoded = Base64.getEncoder().encodeToString(bytes);
                    attachment.setContent(encoded);
                    attachment.setType("application/pdf");
                    attachment.setFilename(file.getName());
                    attachment.setDisposition("attachment");
                    mail.addAttachments(attachment);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sendGrid.api(request);

            System.out.println("📧 Email sent: status=" + response.getStatusCode());
        } catch (IOException ex) {
            ex.printStackTrace();
            System.err.println("❌ Failed to send email via SendGrid");
        }
    }
}
