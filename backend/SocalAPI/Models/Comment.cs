using SocalAPI.Models;

// Comment.cs
public class Comment
{
    public int Id { get; set; }

    // Post it belongs to
    public int PostId { get; set; }


    public Post Post { get; set; }

    // Self-reference → null means a top-level comment
    public int? ParentCommentId { get; set; }
    public Comment ParentComment { get; set; }
    public ICollection<Comment> Replies { get; set; } = new List<Comment>();

    // Author + body
    public int UserId { get; set; }
    public User User { get; set; }
    public string Content { get; set; }

    // Book-keeping
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
