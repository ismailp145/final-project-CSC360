namespace SocalAPI.Models;

public class CommentCreateDto
{
    public string Content { get; set; } = string.Empty;
    public int? ParentCommentId { get; set; }
}