package com.jayanianu.eventticketing.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;

@AllArgsConstructor
@Service
public class EmailService {
    private final JavaMailSender  mailSender;

    public void sendTicketEmail(String to, String subject, String text, List<File> attachments) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text);

        for (File file : attachments) {
            helper.addAttachment(file.getName(), file);
        }


        mailSender.send(message);
    }
}
