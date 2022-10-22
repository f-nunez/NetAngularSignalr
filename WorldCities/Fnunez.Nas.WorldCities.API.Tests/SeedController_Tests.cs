using Fnunez.Nas.WorldCities.API.Controllers;
using Fnunez.Nas.WorldCities.API.Data;
using Fnunez.Nas.WorldCities.API.Data.Models;
using Fnunez.Nas.WorldCities.API.Tests.Helpers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;

namespace Fnunez.Nas.WorldCities.API.Tests;

public class SeedController_Tests
{
    /// <summary>
    /// Test the CreateDefaultUsers() method
    /// </summary>
    [Fact]
    public async Task CreateDefaultUsers()
    {
        // Arrange
        // create the option instances required by the
        // ApplicationDbContext
        var options = new
         DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "WorldCities")
            .Options;

        // create a IWebHost environment mock instance
        var mockEnv = Mock.Of<IWebHostEnvironment>();

        // create a IConfiguration mock instance
        var mockConfiguration = new Mock<IConfiguration>();
        mockConfiguration.SetupGet(x => x[It.Is<string>(s => s == "DefaultPasswords:RegisteredUser")])
            .Returns("M0ckP$$word");
        mockConfiguration.SetupGet(x => x[It.Is<string>(s => s == "DefaultPasswords:Administrator")])
            .Returns("M0ckP$$word");

        // create a ApplicationDbContext instance using the in-memory DB
        using var context = new ApplicationDbContext(options);
        // create a RoleManager instance
        var roleManager = IdentityHelper.GetRoleManager(new RoleStore<IdentityRole>(context));
        // create a UserManager instance
        var userManager = IdentityHelper.GetUserManager(new UserStore<ApplicationUser>(context));
        // create a SeedController instance
        var controller = new SeedController(
            mockConfiguration.Object,
            context,
            mockEnv,
            roleManager,
            userManager);

        // define the variables for the users we want to test
        ApplicationUser userAsAdmin = null!;
        ApplicationUser userAsUser = null!;
        ApplicationUser userNotExisting = null!;

        // Act
        // execute the SeedController's CreateDefaultUsers()
        // method to create the default users (and roles)
        await controller.CreateDefaultUsers();
        // retrieve the users
        userAsAdmin = await userManager.FindByEmailAsync("admin@email.com");
        userAsUser = await userManager.FindByEmailAsync("user@email.com");
        userNotExisting = await userManager.FindByEmailAsync("notexisting@email.com");

        // Assert
        Assert.NotNull(userAsAdmin);
        Assert.NotNull(userAsUser);
        Assert.Null(userNotExisting);
    }
}