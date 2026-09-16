package com.example.social_wall.service;

import com.example.social_wall.model.User;
import com.example.social_wall.repository.PostRepository;
import com.example.social_wall.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mockito;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;

class PostServiceTest {

    @TempDir
    Path tempDirectory;

    @Test
    void shouldRejectEmptyPost() {

        PostRepository postRepository =
                Mockito.mock(PostRepository.class);

        UserRepository userRepository =
                Mockito.mock(UserRepository.class);

        PostService postService =
                new PostService(
                        postRepository,
                        userRepository,
                        tempDirectory.toString()
                );

        assertThrows(
                IllegalArgumentException.class,
                () -> postService.createPost(
                        "testuser",
                        "",
                        null
                )
        );
    }

    @Test
    void shouldRejectTooLargeImage() {

        PostRepository postRepository =
                Mockito.mock(PostRepository.class);

        UserRepository userRepository =
                Mockito.mock(UserRepository.class);

        User user =
                new User(
                        "testuser",
                        "test@example.com",
                        "password"
                );

        Mockito.when(
                userRepository.findByUsername("testuser")
        ).thenReturn(Optional.of(user));

        PostService postService =
                new PostService(
                        postRepository,
                        userRepository,
                        tempDirectory.toString()
                );

        MultipartFile image =
                Mockito.mock(MultipartFile.class);

        Mockito.when(image.isEmpty()).thenReturn(false);
        Mockito.when(image.getSize())
                .thenReturn(6L * 1024 * 1024);
        Mockito.when(image.getContentType())
                .thenReturn("image/png");

        assertThrows(
                IllegalArgumentException.class,
                () -> postService.createPost(
                        "testuser",
                        "Test post",
                        image
                )
        );
    }
}