package com.example.social_wall.dto;

import com.example.social_wall.model.Post;

import java.time.LocalDateTime;

public class PostResponse {

    private Long id;
    private String content;
    private String imageUrl;
    private String author;
    private LocalDateTime createdAt;

    public PostResponse(
            Long id,
            String content,
            String imageUrl,
            String author,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.content = content;
        this.imageUrl = imageUrl;
        this.author = author;
        this.createdAt = createdAt;
    }

    public static PostResponse from(Post post) {

        String imageUrl = post.getImagePath() == null
                ? null
                : "/uploads/" + post.getImagePath();

        return new PostResponse(
                post.getId(),
                post.getContent(),
                imageUrl,
                post.getAuthor().getUsername(),
                post.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getAuthor() {
        return author;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}