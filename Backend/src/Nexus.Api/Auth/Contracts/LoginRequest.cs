using System.ComponentModel.DataAnnotations;

namespace Nexus.Api.Auth.Contracts;

public class LoginRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
