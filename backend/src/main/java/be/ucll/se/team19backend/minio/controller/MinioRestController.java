package be.ucll.se.team19backend.minio.controller;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import be.ucll.se.team19backend.customexception.ServiceException;
import be.ucll.se.team19backend.minio.exception.MinioException;
import be.ucll.se.team19backend.minio.service.MinioService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;

import io.minio.messages.Item;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/media")
public class MinioRestController {

    @Autowired
    private MinioService minioService;

    @GetMapping("/all")
    public List<Item> getAllFiles() {
        return minioService.fullList();
    }

    @GetMapping("/{source}")
    public ResponseEntity<InputStreamResource> findFileById(@PathVariable("source") String source) throws MinioException {
            InputStream fileStream = minioService.get(source);

            // Set up headers
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + source);

            // Return ResponseEntity with InputStreamResource and headers
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .headers(headers)
                    .body(new InputStreamResource(fileStream));
    }

    @GetMapping("/{source}/{bucket}")
    public ResponseEntity<InputStreamResource> findFileById(@PathVariable("source") String source, @PathVariable("bucket") String bucket) throws MinioException {
            InputStream fileStream = minioService.get(source, bucket);

            // Set up headers
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + source);

            // Return ResponseEntity with InputStreamResource and headers
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .headers(headers)
                    .body(new InputStreamResource(fileStream));
    }

    @PostMapping("/add/{title}")
    public ResponseEntity<String> uploadMedia(@RequestPart("file") MultipartFile file, @PathVariable("title") String source) {
        try {
            minioService.upload(source, file.getInputStream());
            return ResponseEntity.ok("File uploaded successfully");
        } catch (MinioException e) {
            return ResponseEntity.status(500).body("MinioException: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Unexpected error: " + e.getMessage());
        }
    }
 
    @DeleteMapping("/delete/{source}")
    public void deleteMedia(@PathVariable("source")String source) throws MinioException{
        minioService.remove(source);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ ServiceException.class })
    public Map<String, String> handleServiceExceptions(ServiceException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put(ex.getField(), ex.getMessage());
        return errors;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({
            MethodArgumentNotValidException.class })
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getFieldErrors().forEach((error) -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }

}
