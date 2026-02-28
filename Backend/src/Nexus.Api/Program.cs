var builder = WebApplication.CreateBuilder(args);

const string FrontendDevOrigin = "http://localhost:5173";

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend-dev", policy =>
    {
        policy.WithOrigins(FrontendDevOrigin)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseCors("frontend-dev");
}

app.UseHttpsRedirection();
app.MapGet("/health", () => Results.Ok(new
{
    status = "ok",
    service = "Nexus.Api",
    timestamp = DateTimeOffset.UtcNow
}));

app.MapGet("/api/info", () => Results.Ok(new
{
    name = "Nexus API",
    frontendOrigin = FrontendDevOrigin,
    environment = app.Environment.EnvironmentName
}));

app.Run();
