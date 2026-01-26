package com.jayanianu.eventticketing.imageStorage;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.azure.storage.blob.models.BlobStorageException;
import com.jayanianu.eventticketing.exceptions.CustomBlobStorageException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AzureImageStorageClient implements ImageStorageClient{
    private final BlobServiceClient blobServiceClient;

    @Value("${imageContainer}")
    private String containerName;

    @Override
    public String uploadImage(String containerName, String originalName, InputStream data,String contentType) throws IOException {
        try{
            //Get the BlobContainerClient object to interact with the container
            BlobContainerClient blobContainerClient = blobServiceClient.getBlobContainerClient(containerName);

            //Rename the image file to a unique name
            String newImageName = UUID.randomUUID().toString() + originalName.substring(originalName.lastIndexOf('.'));

            //Get the BlobClient object to interact with the specified blob
            BlobClient blobClient = blobContainerClient.getBlobClient(newImageName);

            //Upload the image file to the blob
            blobClient.upload(data,true);

            BlobHttpHeaders headers = new BlobHttpHeaders().setContentType(contentType);
            blobClient.setHttpHeaders(headers);

            return blobClient.getBlobUrl();
        }catch (BlobStorageException e){
            throw new CustomBlobStorageException("Failed to upload the image to Azure blob storage");
        }

    }

    @Override
    public void deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }

        String blobName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
        BlobClient blobClient = blobServiceClient
                    .getBlobContainerClient(containerName)
                    .getBlobClient(blobName);

        blobClient.deleteIfExists();
    }
}
