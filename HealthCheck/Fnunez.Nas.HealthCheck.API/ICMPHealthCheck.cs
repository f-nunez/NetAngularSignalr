using System.Net.NetworkInformation;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Fnunez.Nas.HealthCheck.API;

public class ICMPHealthCheck : IHealthCheck
{
    private readonly string _hostName;
    private readonly int _healthyRoundtripTime;

    public ICMPHealthCheck(string hostName, int healthyRoundtripTime)
    {
        _hostName = hostName;
        _healthyRoundtripTime = healthyRoundtripTime;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            using var ping = new Ping();
            PingReply reply = await ping.SendPingAsync(_hostName);
            switch (reply.Status)
            {
                case IPStatus.Success:
                    string msg = $"ICMP to {_hostName} took {reply.RoundtripTime} ms.";
                    return (reply.RoundtripTime > _healthyRoundtripTime)
                        ? HealthCheckResult.Degraded(msg)
                        : HealthCheckResult.Healthy(msg);
                default:
                    string err = $"ICMP to {_hostName} failed: {reply.Status}";
                    return HealthCheckResult.Unhealthy(err);
            }
        }
        catch (Exception e)
        {
            string err = $"ICMP to {_hostName} failed: {e.Message}";
            return HealthCheckResult.Unhealthy(err);
        }
    }
}