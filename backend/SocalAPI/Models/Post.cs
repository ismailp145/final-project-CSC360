using SocalAPI.Models;
namespace SocalAPI.Models;

public class Post
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public string MediaUrl { get; set; } = string.Empty;
    public string MediaType { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int UserId { get; set; }
    public User User { get; set; }
    public bool IsAvailable { get; set; } = true;
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
