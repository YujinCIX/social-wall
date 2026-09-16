package com.example.social_wall.controller;

import com.example.social_wall.dto.PostResponse;
import com.example.social_wall.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<PostResponse> createPost(
            @RequestParam(required = false) String content,
            @RequestPart(required = false) MultipartFile image,
            Authentication authentication
    ) throws IOException {

        PostResponse response = postService.createPost(
                authentication.getName(),
                content,
                image
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {

        return ResponseEntity.ok(
                postService.getAllPosts()
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<PostResponse>> getMyPosts(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                postService.getMyPosts(
                        authentication.getName()
                )
        );
    }
}