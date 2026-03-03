namespace Nexus.Api.Auth.Services;

public class CognitoAuthenticationResult
{
    public bool IsAuthenticated { get; init; }

    public string? ChallengeName { get; init; }

    public string? Session { get; init; }

    public string AccessToken { get; init; } = string.Empty;

    public string IdToken { get; init; } = string.Empty;

    public string? RefreshToken { get; init; }

    public string TokenType { get; init; } = string.Empty;

    public int ExpiresIn { get; init; }
}
