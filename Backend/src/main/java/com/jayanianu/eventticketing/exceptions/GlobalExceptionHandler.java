package com.jayanianu.eventticketing.exceptions;

import com.jayanianu.eventticketing.dtos.ErrorDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(SoldOutException.class)
    public ResponseEntity<Map<String, String>> handleSoldOutException(SoldOutException e){
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage())) ;
    }

    @ExceptionHandler(CustomBlobStorageException.class)
    public ResponseEntity<Map<String, String>> handleImageStorage(CustomBlobStorageException e){
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage())) ;
    }

    @ExceptionHandler(HandleBadCredentials.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(HandleBadCredentials e){
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", e.getMessage())) ;
    }

    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleBadBooking(BookingNotFoundException e){
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage())) ;
    }

    @ExceptionHandler(PaymentException.class)
    public ResponseEntity<?> handlePaymentException(){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorDto("ERROR CREATING A CHECKOUT SESSION"));
    }

    @ExceptionHandler(PDFGenerationException.class)
    public ResponseEntity<?> PDFGenerationException(PDFGenerationException e){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorDto("ERROR CREATING A PDF FOR TICKET"));
    }
}
