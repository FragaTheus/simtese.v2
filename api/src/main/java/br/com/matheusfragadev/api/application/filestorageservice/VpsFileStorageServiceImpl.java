package br.com.matheusfragadev.api.application.filestorageservice;

import br.com.matheusfragadev.api.application.result.FileException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class VpsFileStorageServiceImpl implements FileStorageService{

    private final Path resultsPath;

    public VpsFileStorageServiceImpl(@Value("${results.path}") Path resultsPath) {
        this.resultsPath = resultsPath;
    }

    public String save(MultipartFile file){
        try {
            Files.createDirectories(resultsPath);

            String fileName = UUID.randomUUID() + ".pdf";

            Path destination = resultsPath.resolve(fileName);

            file.transferTo(destination);

            return fileName;
        } catch (IOException e) {
            throw new FileException("Erro ao salvar arquivo: " + e.getMessage());
        }
    }

    public void delete(String fileName){
        try {
            Files.deleteIfExists(resultsPath.resolve(fileName));
        } catch (IOException e) {
            throw new RuntimeException("Erro ao deletar arquivo: " + e.getMessage(), e);
        }
    }

    @Override
    public InputStream find(String fileName) {
        Path path = resultsPath.resolve(fileName).normalize();

        if (!Files.exists(path)) {
            throw new FileException("Arquivo não encontrado");
        }

        try {
            return Files.newInputStream(path);
        } catch (IOException e) {
            throw new FileException("Erro ao ler arquivo: " + e.getMessage());
        }
    }
}
