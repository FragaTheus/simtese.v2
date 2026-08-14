package br.com.matheusfragadev.api.domain.accounts.aggregate;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.function.BiFunction;
import java.util.function.Function;

@Getter
@Embeddable
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Password {

    @Column(name = "password", nullable = false)
    private String value;

    public static Password of(String rawPassword, Function<String, String> hasher) {
        return new Password(hash(rawPassword, hasher));
    }

    public boolean matches(String rawPassword, BiFunction<String, String, Boolean> matcher) {
        return matcher.apply(rawPassword, this.value);
    }

    private static String hash(String rawPassword, Function<String, String> hasher){
        return hasher.apply(rawPassword);
    }
}
