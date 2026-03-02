using System.Security.Cryptography;
using System.Text;
using Amazon;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using Microsoft.Extensions.Options;
using Nexus.Api.Options;

namespace Nexus.Api.Services;

public class CognitoAuthenticationService : ICognitoAuthenticationService
{
    private readonly CognitoOptions _options;

    public CognitoAuthenticationService(IOptions<CognitoOptions> options)
    {
        _options = options.Value;
    }

    public async Task<CognitoAuthenticationResult> AuthenticateAsync(string username, string password, CancellationToken cancellationToken)
    {
        ValidateConfiguration();

        using var client = CreateClient();
        var authParameters = new Dictionary<string, string>
        {
            ["USERNAME"] = username,
            ["PASSWORD"] = password,
        };

        AddSecretHash(authParameters, username);

        var response = await client.InitiateAuthAsync(new InitiateAuthRequest
        {
            AuthFlow = AuthFlowType.USER_PASSWORD_AUTH,
            ClientId = _options.AppClientId,
            AuthParameters = authParameters,
        }, cancellationToken);

        return MapAuthenticationResult(response.AuthenticationResult, response.ChallengeName?.Value, response.Session);
    }

    public async Task<CognitoAuthenticationResult> CompleteNewPasswordAsync(string username, string newPassword, string session, CancellationToken cancellationToken)
    {
        ValidateConfiguration();

        using var client = CreateClient();
        var challengeResponses = new Dictionary<string, string>
        {
            ["USERNAME"] = username,
            ["NEW_PASSWORD"] = newPassword,
        };

        AddSecretHash(challengeResponses, username);

        var response = await client.RespondToAuthChallengeAsync(new RespondToAuthChallengeRequest
        {
            ClientId = _options.AppClientId,
            ChallengeName = ChallengeNameType.NEW_PASSWORD_REQUIRED,
            ChallengeResponses = challengeResponses,
            Session = session,
        }, cancellationToken);

        return MapAuthenticationResult(response.AuthenticationResult, response.ChallengeName?.Value, response.Session);
    }

    private AmazonCognitoIdentityProviderClient CreateClient()
    {
        return new AmazonCognitoIdentityProviderClient(RegionEndpoint.GetBySystemName(_options.Region));
    }

    private CognitoAuthenticationResult MapAuthenticationResult(AuthenticationResultType? authenticationResult, string? challengeName, string? session)
    {
        if (authenticationResult is null)
        {
            return new CognitoAuthenticationResult
            {
                IsAuthenticated = false,
                ChallengeName = challengeName,
                Session = session,
            };
        }

        return new CognitoAuthenticationResult
        {
            IsAuthenticated = true,
            AccessToken = authenticationResult.AccessToken,
            IdToken = authenticationResult.IdToken,
            RefreshToken = authenticationResult.RefreshToken,
            TokenType = authenticationResult.TokenType,
            ExpiresIn = authenticationResult.ExpiresIn ?? 0,
        };
    }

    private void ValidateConfiguration()
    {
        if (string.IsNullOrWhiteSpace(_options.Region))
        {
            throw new InvalidOperationException("Authentication:Cognito:Region is not configured.");
        }

        if (string.IsNullOrWhiteSpace(_options.AppClientId))
        {
            throw new InvalidOperationException("Authentication:Cognito:AppClientId is not configured.");
        }
    }

    private void AddSecretHash(IDictionary<string, string> parameters, string username)
    {
        var secretHash = CreateSecretHash(username);
        if (!string.IsNullOrWhiteSpace(secretHash))
        {
            parameters["SECRET_HASH"] = secretHash;
        }
    }

    private string? CreateSecretHash(string username)
    {
        if (string.IsNullOrWhiteSpace(_options.AppClientSecret))
        {
            return null;
        }

        var key = Encoding.UTF8.GetBytes(_options.AppClientSecret);
        var message = Encoding.UTF8.GetBytes($"{username}{_options.AppClientId}");

        using var hmac = new HMACSHA256(key);
        return Convert.ToBase64String(hmac.ComputeHash(message));
    }
}
