package be.ucll.se.team19backend.customexception;

public class ServiceException extends Exception {

    private String field;

    public ServiceException(String field, String message) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }

}