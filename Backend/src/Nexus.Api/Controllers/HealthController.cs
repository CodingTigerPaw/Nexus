using Microsoft.AspNetCore.Mvc;

namespace Nexus.Api.Controllers;

[ApiController]
[Route("health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "ok",
            service = "Nexus.Api",
            timestamp = DateTimeOffset.UtcNow,
        });
    }
}
