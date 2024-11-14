package be.ucll.se.team19backend.security;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import be.ucll.se.team19backend.user.model.CustomUserDetails;
import be.ucll.se.team19backend.user.model.Role;
import be.ucll.se.team19backend.user.model.UserModel;

import java.security.Key;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {
    private static final String SECRET_KEY = "4A404E635266556A586E327234753778214125442A472D4B6150645367566B59";
    public String extractUsername(String jwtToken) {
        return extractClaim(jwtToken, Claims::getSubject);
    }

    public <T> T extractClaim(String jwtToken, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(jwtToken);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserModel joske) {
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("roles", joske.getAuthorities().stream().map(GrantedAuthority::getAuthority).toArray());
        claims.put("username", joske.getUsername());
        claims.put("email", joske.getEmail());
        return generateToken(claims, joske);
    }
    


    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000*60*60*24))  //+1 day
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    public Boolean isTokenValid(String jwtToken, UserDetails userDetails) {
        final String username = extractUsername(jwtToken);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(jwtToken);
    }

    private boolean isTokenExpired(String jwtToken) {
        return extractExpiration(jwtToken).before(new Date());
    }

    private Date extractExpiration(String jwtToken) {
        return extractClaim(jwtToken, Claims::getExpiration);
    }

    private Claims extractAllClaims(String jwtToken) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(jwtToken)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);

    }

    public String extractEmail(String jwtToken) {
        return extractClaim(jwtToken, claims -> claims.get("email", String.class));
    }

    public List<Role> extractRoles(String jwtToken) {
        List<String> stringRoles =  extractClaim(jwtToken, claims -> claims.get("roles", List.class));
        List<Role> roles = new ArrayList<>();
        for (String role : stringRoles) {
            try {
                Role.valueOf(role);
            } catch (IllegalArgumentException e) {
                System.out.println("Role " + role + " is not a valid role");
                continue;
            }
            roles.add(Role.valueOf(role));
        }
        return roles;
    }
}
