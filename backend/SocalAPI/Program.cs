using SocalAPI.Models;
using SocalAPI.Models.DTOs;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using SocalAPI.Data;
using SocalAPI.Services;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);

// Add JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found")))
    };
});

// Add Authorization
builder.Services.AddAuthorization();

// Add CORS support
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite's default port
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Socal API", Version = "v1" });

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));

// Register JwtService
builder.Services.AddScoped<JwtService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        options.JsonSerializerOptions.MaxDepth = 64;
    });

var app = builder.Build();

// Configure middleware
app.UseCors("AllowReactApp");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/api/auth/login", async (LoginRequest request, HttpContext context) =>
{
    // Get database context
    var dbContext = context.RequestServices.GetRequiredService<ApplicationDbContext>();

    // Find user by email
    var user = await dbContext.Users
        .FirstOrDefaultAsync(u => u.Email == request.Email);

    // If user not found or password doesn't match
    if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
    {
        return Results.Unauthorized();
    }

    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found"));

    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, "User")
        }),
        Expires = DateTime.UtcNow.AddHours(1),
        Issuer = builder.Configuration["Jwt:Issuer"],
        Audience = builder.Configuration["Jwt:Audience"],
        SigningCredentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256Signature)
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);

    return Results.Ok(new
    {
        accessToken = tokenHandler.WriteToken(token),
        refreshToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray())
    });
});

app.MapPost("/api/auth/signup", async (SignUpRequest request, HttpContext context) =>
{
    // Validate request
    if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.Username))
    {
        return Results.BadRequest(new { success = false, message = "All fields are required" });
    }

    // Check if user already exists
    var existingUser = await context.RequestServices.GetRequiredService<ApplicationDbContext>()
        .Users
        .FirstOrDefaultAsync(u => u.Email == request.Email || u.UserName == request.Username);

    if (existingUser != null)
    {
        return Results.BadRequest(new { success = false, message = "User already exists" });
    }

    // Hash password
    var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

    // Create new user
    var newUser = new User
    {
        Email = request.Email,
        UserName = request.Username,
        PasswordHash = passwordHash,
        CreatedAt = DateTime.UtcNow
    };

    // Save to database
    var dbContext = context.RequestServices.GetRequiredService<ApplicationDbContext>();
    await dbContext.Users.AddAsync(newUser);
    await dbContext.SaveChangesAsync();

    // Generate JWT token
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found"));

    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, newUser.Id.ToString()),
            new Claim(ClaimTypes.Name, newUser.UserName),
            new Claim(ClaimTypes.Email, newUser.Email),
            new Claim(ClaimTypes.Role, "User")
        }),
        Expires = DateTime.UtcNow.AddHours(1),
        Issuer = builder.Configuration["Jwt:Issuer"],
        Audience = builder.Configuration["Jwt:Audience"],
        SigningCredentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256Signature)
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);

    return Results.Ok(new
    {
        success = true,
        message = "User registered successfully",
        accessToken = tokenHandler.WriteToken(token),
        refreshToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray())
    });
});


app.MapGet("/api/posts", async (ApplicationDbContext db) =>
 await db.Posts
         .OrderByDescending(p => p.CreatedAt)
         .Select(p => new PostDto(
             p.Id, p.Content, p.MediaUrl, p.MediaType,
             p.CreatedAt, p.UserId, p.User.UserName, p.User.Email))
         .ToListAsync());

app.MapGet("/api/posts/{id:int}", async (int id, ApplicationDbContext db) =>
{
    var post = await db.Posts
                       .Include(p => p.User)
                       .FirstOrDefaultAsync(p => p.Id == id);

    return post is null ? Results.NotFound() : Results.Ok(post);
})
.WithName("GetPostById")
.RequireAuthorization();

// POST /api/posts          — create post
app.MapPost("/api/posts", async (
        Post post,
        ClaimsPrincipal principal,         // who is logged in
        ApplicationDbContext db) =>
{
    // tie the post to the logged-in user
    post.UserId = int.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)!);
    post.CreatedAt = DateTime.UtcNow;

    db.Posts.Add(post);
    await db.SaveChangesAsync();

    // Fetch the user information
    var user = await db.Users.FindAsync(post.UserId);

    // Return the post with user information
    return Results.Created($"/api/posts/{post.Id}", new PostDto(
        post.Id, post.Content, post.MediaUrl, post.MediaType,
        post.CreatedAt, post.UserId, user!.UserName, user.Email
    ));
})
.WithName("AddPost")
.RequireAuthorization();


// PUT  /api/posts/{id}     — full update
app.MapPut("/api/posts/{id:int}", async (
        int id,
        Post updated,
        ClaimsPrincipal principal,
        ApplicationDbContext db) =>
{
    var post = await db.Posts.FindAsync(id);
    if (post is null) return Results.NotFound();
    if (post.UserId != int.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)!))
        return Results.Forbid();              // prevent editing other users' posts

    post.Content = updated.Content;
    post.MediaUrl = updated.MediaUrl;
    post.MediaType = updated.MediaType;

    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("UpdatePost")
.RequireAuthorization();

// PATCH /api/posts/{id}/availability — toggle flag (add a bool IsAvailable to Post)
app.MapPatch("/api/posts/{id:int}/availability", async (
        int id, bool isAvailable, ApplicationDbContext db) =>
{
    var post = await db.Posts.FindAsync(id);
    if (post is null) return Results.NotFound();

    post.IsAvailable = isAvailable;
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("UpdatePostAvailability")
.RequireAuthorization();

// DELETE /api/posts/{id}   — delete post
app.MapDelete("/api/posts/{id:int}", async (
        int id,
        ClaimsPrincipal principal,
        ApplicationDbContext db) =>
{
    var post = await db.Posts.FindAsync(id);
    if (post is null) return Results.NotFound();
    if (post.UserId != int.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)!))
        return Results.Forbid();

    db.Posts.Remove(post);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("DeletePost")
.RequireAuthorization();

// GET /api/users/profile - Get current user profile
app.MapGet("/api/users/profile", async (ClaimsPrincipal principal, ApplicationDbContext db) =>
{
    var userId = int.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var user = await db.Users.FindAsync(userId);

    if (user is null) return Results.NotFound();

    return Results.Ok(new { userName = user.UserName, email = user.Email, id = user.Id });
})
.WithName("GetUserProfile")
.RequireAuthorization();

// record CreateCommentDto(string Content, int? ParentCommentId);

// GET all root comments (includes nested replies)
app.MapGet("/api/posts/{postId:int}/comments", async (int postId, ApplicationDbContext db) =>
{
    var comments = await db.Comments
        .Where(c => c.PostId == postId && c.ParentCommentId == null)
        .Include(c => c.User)
        .Include(c => c.Replies)
            .ThenInclude(r => r.User)
        .OrderByDescending(c => c.CreatedAt)
        .Select(c => new
        {
            id = c.Id,
            postId = c.PostId,
            parentCommentId = c.ParentCommentId,
            content = c.Content,
            createdAt = c.CreatedAt,
            userName = c.User.UserName,
            replies = c.Replies.Select(r => new
            {
                id = r.Id,
                postId = r.PostId,
                parentCommentId = r.ParentCommentId,
                content = r.Content,
                createdAt = r.CreatedAt,
                userName = r.User.UserName,
                replies = new List<object>() // Empty list for replies to prevent circular reference
            }).ToList()
        })
        .ToListAsync();

    return Results.Ok(comments);
})
.WithName("GetComments");

// POST a new comment OR reply
app.MapPost("/api/posts/{postId:int}/comments", async (int postId, CommentCreateDto commentDto, ApplicationDbContext db, HttpContext context) =>
{
    var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userId))
        return Results.Unauthorized();

    var comment = new Comment
    {
        Content = commentDto.Content,
        PostId = postId,
        UserId = int.Parse(userId),
        ParentCommentId = commentDto.ParentCommentId,
        CreatedAt = DateTime.UtcNow
    };

    db.Comments.Add(comment);
    await db.SaveChangesAsync();

    // Load the comment with its relationships
    var createdComment = await db.Comments
        .Include(c => c.User)
        .Include(c => c.Replies)
            .ThenInclude(r => r.User)
        .Where(c => c.Id == comment.Id)
        .Select(c => new
        {
            id = c.Id,
            postId = c.PostId,
            parentCommentId = c.ParentCommentId,
            content = c.Content,
            createdAt = c.CreatedAt,
            userName = c.User.UserName,
            replies = c.Replies.Select(r => new
            {
                id = r.Id,
                postId = r.PostId,
                parentCommentId = r.ParentCommentId,
                content = r.Content,
                createdAt = r.CreatedAt,
                userName = r.User.UserName,
                replies = new List<object>() // Empty list for replies to prevent circular reference
            }).ToList()
        })
        .FirstOrDefaultAsync();

    return Results.Created($"/api/comments/{comment.Id}", createdComment);
})
.WithName("CreateComment");

app.MapGet("/api", (HttpContext context) =>
{
    return Results.Ok("Hello World");
});

app.Run();