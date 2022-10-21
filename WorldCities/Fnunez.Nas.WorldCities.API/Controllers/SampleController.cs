using Microsoft.AspNetCore.Mvc;

namespace Fnunez.Nas.WorldCities.API.Controllers;

public class SampleController : ControllerBase
{
    public SampleController()
    {
        Serilog.Log.Information("SampleController initialized.");
    }
}