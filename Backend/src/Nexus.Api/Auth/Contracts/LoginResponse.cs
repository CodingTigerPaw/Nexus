namespace Nexus.Api.Auth.Contracts;

public class LoginResponse
{
    public string AccessToken { get; init; } = string.Empty;

    public string IdToken { get; init; } = string.Empty;

    public string? RefreshToken { get; init; }

    public string TokenType { get; init; } = string.Empty;

    public int ExpiresIn { get; init; }
}
