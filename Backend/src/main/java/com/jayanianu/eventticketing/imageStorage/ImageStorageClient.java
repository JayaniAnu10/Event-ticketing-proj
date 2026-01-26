package com.jayanianu.eventticketing.imageStorage;

import java.io.IOException;
import java.io.InputStream;

public interface ImageStorageClient {
    String uploadImage(String containerName, String originalName, InputStream inputStream,String contentType) throws IOException;
    void deleteImage(String imageUrl);
}
