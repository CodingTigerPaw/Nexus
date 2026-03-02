namespace Nexus.Api.Configuration;

public static class DotEnvLoader
{
    public static void Load()
    {
        foreach (var candidatePath in GetCandidatePaths())
        {
            if (!File.Exists(candidatePath))
            {
                continue;
            }

            LoadFile(candidatePath);
            return;
        }
    }

    private static IEnumerable<string> GetCandidatePaths()
    {
        var currentDirectory = Directory.GetCurrentDirectory();

        yield return Path.Combine(currentDirectory, ".env");
        yield return Path.Combine(currentDirectory, "src", "Nexus.Api", ".env");
        yield return Path.Combine(AppContext.BaseDirectory, ".env");

        var directory = new DirectoryInfo(currentDirectory);
        while (directory is not null)
        {
            yield return Path.Combine(directory.FullName, ".env");
            directory = directory.Parent;
        }
    }

    private static void LoadFile(string path)
    {
        foreach (var rawLine in File.ReadAllLines(path))
        {
            var line = rawLine.Trim();

            if (string.IsNullOrWhiteSpace(line) || line.StartsWith('#'))
            {
                continue;
            }

            var separatorIndex = line.IndexOf('=');
            if (separatorIndex <= 0)
            {
                continue;
            }

            var key = line[..separatorIndex].Trim();
            var value = line[(separatorIndex + 1)..].Trim();

            if (string.IsNullOrEmpty(key) || Environment.GetEnvironmentVariable(key) is not null)
            {
                continue;
            }

            Environment.SetEnvironmentVariable(key, TrimQuotes(value));
        }
    }

    private static string TrimQuotes(string value)
    {
        if (value.Length >= 2)
        {
            var hasDoubleQuotes = value.StartsWith('"') && value.EndsWith('"');
            var hasSingleQuotes = value.StartsWith('\'') && value.EndsWith('\'');

            if (hasDoubleQuotes || hasSingleQuotes)
            {
                return value[1..^1];
            }
        }

        return value;
    }
}
