package br.com.matheusfragadev.api.application.filestorageservice;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface FileStorageService {

    String save(MultipartFile file);

    InputStream find(String fileName);

    void delete(String fileName);
}
