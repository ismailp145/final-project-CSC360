using System.ComponentModel.DataAnnotations;

namespace SocalAPI.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property for posts
    public ICollection<Post> Posts { get; set; } = new List<Post>();
}
