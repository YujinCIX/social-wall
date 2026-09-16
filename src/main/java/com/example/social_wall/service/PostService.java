package com.example.social_wall.service;

import com.example.social_wall.dto.PostResponse;
import com.example.social_wall.model.Post;
import com.example.social_wall.model.User;
import com.example.social_wall.repository.PostRepository;
import com.example.social_wall.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PostService {

    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;

    private static final List<String> ALLOWED_IMAGE_TYPES = List.of(
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp"
    );

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final Path uploadDirectory;

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository,
            @Value("${app.uploads.directory}") String uploadDirectory
    ) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.uploadDirectory = Paths.get(uploadDirectory);
    }

    public PostResponse createPost(
            String username,
            String content,
            MultipartFile image
    ) throws IOException {

        String normalizedContent =
                content == null ? "" : content.trim();

        boolean hasContent = !normalizedContent.isBlank();
        boolean hasImage = image != null && !image.isEmpty();

        if (!hasContent && !hasImage) {
            throw new IllegalArgumentException(
                    "Post must contain text or an image"
            );
        }

        if (hasImage) {
            validateImage(image);
        }

        User author = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        String imagePath = null;

        if (hasImage) {
            imagePath = saveImage(image);
        }

        Post post = new Post(
                hasContent ? normalizedContent : "",
                imagePath,
                LocalDateTime.now(),
                author
        );

        return PostResponse.from(postRepository.save(post));
    }

    public List<PostResponse> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(PostResponse::from)
                .toList();
    }

    public List<PostResponse> getMyPosts(String username) {

        User author = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        return postRepository.findByAuthorOrderByCreatedAtDesc(author)
                .stream()
                .map(PostResponse::from)
                .toList();
    }

    private void validateImage(MultipartFile image) {

        if (image.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException(
                    "Image size must not exceed 5 MB"
            );
        }

        String contentType = image.getContentType();

        if (contentType == null ||
                !ALLOWED_IMAGE_TYPES.contains(contentType)) {

            throw new IllegalArgumentException(
                    "Only JPEG, PNG, GIF and WebP images are allowed"
            );
        }
    }

    private String saveImage(MultipartFile image) throws IOException {

        Files.createDirectories(uploadDirectory);

        String originalFilename = image.getOriginalFilename();

        String extension = getExtension(originalFilename);

        String filename = UUID.randomUUID() + extension;

        Path targetPath = uploadDirectory.resolve(filename);

        Files.copy(
                image.getInputStream(),
                targetPath,
                StandardCopyOption.REPLACE_EXISTING
        );

        return filename;
    }

    private String getExtension(String filename) {

        if (filename == null || !filename.contains(".")) {
            throw new IllegalArgumentException(
                    "Image file must have an extension"
            );
        }

        String extension =
                filename.substring(filename.lastIndexOf('.'))
                        .toLowerCase();

        return switch (extension) {
            case ".jpg", ".jpeg" -> ".jpg";
            case ".png" -> ".png";
            case ".gif" -> ".gif";
            case ".webp" -> ".webp";
            default -> throw new IllegalArgumentException(
                    "Unsupported image extension"
            );
        };
    }
}