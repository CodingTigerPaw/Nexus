using System.ComponentModel.DataAnnotations;

namespace Nexus.Api.Auth.Contracts;

public class CompleteNewPasswordRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string NewPassword { get; set; } = string.Empty;

    [Required]
    public string Session { get; set; } = string.Empty;
}
