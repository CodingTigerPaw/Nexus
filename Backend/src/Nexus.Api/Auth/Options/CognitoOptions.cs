namespace Nexus.Api.Auth.Options;

public class CognitoOptions
{
    public const string SectionName = "Authentication:Cognito";

    public string Region { get; set; } = string.Empty;

    public string UserPoolId { get; set; } = string.Empty;

    public string AppClientId { get; set; } = string.Empty;

    public string? AppClientSecret { get; set; }
}
