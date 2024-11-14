package be.ucll.se.team19backend.authentication.service;

public class AccountLockedException extends RuntimeException {
    public AccountLockedException(String message) {
        super(message);
    }
}