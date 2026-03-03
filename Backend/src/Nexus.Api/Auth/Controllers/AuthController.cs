using Amazon.CognitoIdentityProvider.Model;
using Microsoft.AspNetCore.Mvc;
using Nexus.Api.Auth.Contracts;
using Nexus.Api.Auth.Services;

namespace Nexus.Api.Auth.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ICognitoAuthenticationService _cognitoAuthenticationService;

    public AuthController(ICognitoAuthenticationService cognitoAuthenticationService)
    {
        _cognitoAuthenticationService = cognitoAuthenticationService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _cognitoAuthenticationService.AuthenticateAsync(request.Username, request.Password, cancellationToken);

            if (!result.IsAuthenticated)
            {
                return Conflict(CreateChallengeResponse(result));
            }

            return Ok(new LoginResponse
            {
                AccessToken = result.AccessToken,
                IdToken = result.IdToken,
                RefreshToken = result.RefreshToken,
                TokenType = result.TokenType,
                ExpiresIn = result.ExpiresIn,
            });
        }
        catch (NotAuthorizedException)
        {
            return Unauthorized(new
            {
                message = "Invalid username or password.",
            });
        }
        catch (UserNotFoundException)
        {
            return Unauthorized(new
            {
                message = "Invalid username or password.",
            });
        }
        catch (InvalidParameterException exception)
        {
            return BadRequest(new
            {
                message = exception.Message,
            });
        }
        catch (InvalidOperationException exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                message = exception.Message,
            });
        }
    }

    [HttpPost("complete-new-password")]
    public async Task<IActionResult> CompleteNewPassword([FromBody] CompleteNewPasswordRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _cognitoAuthenticationService.CompleteNewPasswordAsync(
                request.Username,
                request.NewPassword,
                request.Session,
                cancellationToken);

            if (!result.IsAuthenticated)
            {
                return Conflict(CreateChallengeResponse(result));
            }

            return Ok(new LoginResponse
            {
                AccessToken = result.AccessToken,
                IdToken = result.IdToken,
                RefreshToken = result.RefreshToken,
                TokenType = result.TokenType,
                ExpiresIn = result.ExpiresIn,
            });
        }
        catch (NotAuthorizedException)
        {
            return Unauthorized(new
            {
                message = "The Cognito session is invalid or expired.",
            });
        }
        catch (InvalidPasswordException exception)
        {
            return BadRequest(new
            {
                message = exception.Message,
            });
        }
        catch (InvalidParameterException exception)
        {
            return BadRequest(new
            {
                message = exception.Message,
            });
        }
        catch (InvalidOperationException exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                message = exception.Message,
            });
        }
    }

    private static object CreateChallengeResponse(CognitoAuthenticationResult result)
    {
        return new
        {
            message = "Authentication requires an additional Cognito challenge.",
            challengeName = result.ChallengeName,
            session = result.Session,
            requiredAction = MapRequiredAction(result.ChallengeName),
        };
    }

    private static string MapRequiredAction(string? challengeName)
    {
        return challengeName switch
        {
            "NEW_PASSWORD_REQUIRED" => "COMPLETE_NEW_PASSWORD",
            _ => "HANDLE_COGNITO_CHALLENGE",
        };
    }
}
