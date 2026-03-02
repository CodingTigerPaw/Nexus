namespace Nexus.Api.Services;

public interface ICognitoAuthenticationService
{
    Task<CognitoAuthenticationResult> AuthenticateAsync(string username, string password, CancellationToken cancellationToken);

    Task<CognitoAuthenticationResult> CompleteNewPasswordAsync(string username, string newPassword, string session, CancellationToken cancellationToken);
}
