package be.ucll.se.team19backend.authentication.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EmailService {

    @Autowired
private JavaMailSender mailSender;

public void sendPasswordResetEmail(String payload, String token) {
    ObjectMapper mapper = new ObjectMapper();
    String email = "";
    try {
        Map<String, String> map = mapper.readValue(payload, Map.class);
        email = map.get("email");
    } catch (Exception e) {
        e.printStackTrace();
    }

    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(email);
    message.setSubject("Password Reset Request");
    message.setText("To reset your password, click the link below:\n" +
                    "http://localhost:3000/reset-password?token=" + token);

    mailSender.send(message);
}
    
}

