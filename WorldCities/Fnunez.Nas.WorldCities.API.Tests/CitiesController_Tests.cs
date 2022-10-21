using Fnunez.Nas.WorldCities.API.Controllers;
using Fnunez.Nas.WorldCities.API.Data;
using Fnunez.Nas.WorldCities.API.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Fnunez.Nas.WorldCities.API.Tests;

public class CitiesController_Tests
{
    /// <summary>
    /// Test the GetCity() method
    /// </summary>
    [Fact]
    public async Task GetCity()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "WorldCities")
            .Options;

        using var context = new ApplicationDbContext(options);
        context.Add(new City
        {
            Id = 1,
            CountryId = 1,
            Lat = 1,
            Lon = 1,
            Name = "TestCity1"
        });

        context.SaveChanges();

        var controller = new CitiesController(context);

        City cityExisting = null;
        
        City cityNotExisting = null;

        // Act
        cityExisting = (await controller.GetCity(1)).Value;
        cityNotExisting = (await controller.GetCity(2)).Value;

        // Assert
        Assert.NotNull(cityExisting);
        Assert.Null(cityNotExisting);
    }
}