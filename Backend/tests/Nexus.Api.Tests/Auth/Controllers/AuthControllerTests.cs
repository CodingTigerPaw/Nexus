using Amazon.CognitoIdentityProvider.Model;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Nexus.Api.Auth.Contracts;
using Nexus.Api.Auth.Controllers;
using Nexus.Api.Auth.Services;
using Xunit;

namespace Nexus.Api.Tests.Auth.Controllers;

public class AuthControllerTests
{
    private readonly Mock<ICognitoAuthenticationService> _cognitoAuthenticationServiceMock = new();

    [Fact]
    public async Task Login_ReturnsOk_WithLoginResponse_WhenAuthenticationSucceeds()
    {
        var controller = CreateController();
        var request = new LoginRequest
        {
            Username = "user@example.com",
            Password = "Password123!",
        };

        _cognitoAuthenticationServiceMock
            .Setup(service => service.AuthenticateAsync(request.Username, request.Password, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new CognitoAuthenticationResult
            {
                IsAuthenticated = true,
                AccessToken = "access-token",
                IdToken = "id-token",
                RefreshToken = "refresh-token",
                TokenType = "Bearer",
                ExpiresIn = 3600,
            });

        var result = await controller.Login(request, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<LoginResponse>(okResult.Value);
        Assert.Equal("access-token", response.AccessToken);
        Assert.Equal("id-token", response.IdToken);
        Assert.Equal("refresh-token", response.RefreshToken);
        Assert.Equal("Bearer", response.TokenType);
        Assert.Equal(3600, response.ExpiresIn);
    }

    [Fact]
    public async Task Login_ReturnsConflict_WithRequiredAction_WhenNewPasswordIsRequired()
    {
        var controller = CreateController();
        var request = new LoginRequest
        {
            Username = "user@example.com",
            Password = "Temporary123!",
        };

        _cognitoAuthenticationServiceMock
            .Setup(service => service.AuthenticateAsync(request.Username, request.Password, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new CognitoAuthenticationResult
            {
                IsAuthenticated = false,
                ChallengeName = "NEW_PASSWORD_REQUIRED",
                Session = "challenge-session",
            });

        var result = await controller.Login(request, CancellationToken.None);

        var conflictResult = Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal("Authentication requires an additional Cognito challenge.", GetPropertyValue<string>(conflictResult.Value, "message"));
        Assert.Equal("NEW_PASSWORD_REQUIRED", GetPropertyValue<string>(conflictResult.Value, "challengeName"));
        Assert.Equal("challenge-session", GetPropertyValue<string>(conflictResult.Value, "session"));
        Assert.Equal("COMPLETE_NEW_PASSWORD", GetPropertyValue<string>(conflictResult.Value, "requiredAction"));
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_WhenCredentialsAreInvalid()
    {
        var controller = CreateController();
        var request = new LoginRequest
        {
            Username = "user@example.com",
            Password = "wrong",
        };

        _cognitoAuthenticationServiceMock
            .Setup(service => service.AuthenticateAsync(request.Username, request.Password, It.IsAny<CancellationToken>()))
            .ThrowsAsync(new NotAuthorizedException("Invalid login"));

        var result = await controller.Login(request, CancellationToken.None);

        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal("Invalid username or password.", GetPropertyValue<string>(unauthorizedResult.Value, "message"));
    }

    [Fact]
    public async Task Login_ReturnsBadRequest_WhenCognitoRejectsParameters()
    {
        var controller = CreateController();
        var request = new LoginRequest
        {
            Username = "user@example.com",
            Password = "Password123!",
        };

        _cognitoAuthenticationServiceMock
            .Setup(service => service.AuthenticateAsync(request.Username, request.Password, It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidParameterException("USER_PASSWORD_AUTH flow not enabled for this client"));

        var result = await controller.Login(request, CancellationToken.None);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(
            "USER_PASSWORD_AUTH flow not enabled for this client",
            GetPropertyValue<string>(badRequestResult.Value, "message"));
    }

    [Fact]
    public async Task Login_ReturnsInternalServerError_WhenConfigurationIsInvalid()
    {
        var controller = CreateController();
        var request = new LoginRequest
        {
            Username = "user@example.com",
            Password = "Password123!",
        };

        _cognitoAuthenticationServiceMock
            .Setup(service => service.AuthenticateAsync(request.Username, request.Password, It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("Authentication:Cognito:AppClientId is not configured."));

        var result = await controller.Login(request, CancellationToken.None);

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, objectResult.StatusCode);
        Assert.Equal(
            "Authentication:Cognito:AppClientId is not configured.",
            GetPropertyValue<string>(objectResult.Value, "message"));
    }

    private AuthController CreateController()
    {
        return new AuthController(_cognitoAuthenticationServiceMock.Object);
    }

    private static T GetPropertyValue<T>(object? instance, string propertyName)
    {
        Assert.NotNull(instance);

        var property = instance.GetType().GetProperty(propertyName);
        Assert.NotNull(property);

        return Assert.IsType<T>(property.GetValue(instance));
    }
}
