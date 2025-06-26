namespace SocalAPI.Models.DTOs;

public record PostDto(
    int Id,
    string Content,
    string MediaUrl,
    string MediaType,
    DateTime CreatedAt,
    int UserId,
    string UserName,
    string UserEmail
);