package io.blackbeat.opendoors.api.response;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor(staticName = "of")
public class CommonDto <T>{
    private final String resultCode;
    private final String message;
    private final T data;
}
