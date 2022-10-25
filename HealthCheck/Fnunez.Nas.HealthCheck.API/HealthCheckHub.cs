using Microsoft.AspNetCore.SignalR;

namespace Fnunez.Nas.HealthCheck.API;

public class HealthCheckHub : Hub
{
    public async Task ClientUpdate(string message) =>
        await Clients.All.SendAsync("ClientUpdate", message);
}