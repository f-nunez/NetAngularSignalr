using System.Security;
using Fnunez.Nas.WorldCities.API.Data;
using Fnunez.Nas.WorldCities.API.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;

namespace Fnunez.Nas.WorldCities.API.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class SeedController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public SeedController(
        IConfiguration configuration,
        ApplicationDbContext context,
        IWebHostEnvironment env,
        RoleManager<IdentityRole> roleManager,
        UserManager<ApplicationUser> userManager
        )
    {
        _configuration = configuration;
        _context = context;
        _env = env;
        _roleManager = roleManager;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult> CreateDefaultUsers()
    {
        string role_RegisteredUser = "RegisteredUser";
        string role_Administrator = "Administrator";

        if (await _roleManager.FindByNameAsync(role_RegisteredUser) == null)
            await _roleManager.CreateAsync(
                new IdentityRole(role_RegisteredUser));

        if (await _roleManager.FindByNameAsync(role_Administrator) == null)
            await _roleManager.CreateAsync(
                new IdentityRole(role_Administrator));

        var addedUserList = new List<ApplicationUser>();

        string emailForAdmin = "admin@email.com";
        if (await _userManager.FindByNameAsync(emailForAdmin) == null)
        {
            var userAsAdmin = new ApplicationUser()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = emailForAdmin,
                Email = emailForAdmin,
            };

            await _userManager.CreateAsync(
                userAsAdmin,
                _configuration["DefaultPasswords:Administrator"]
            );

            await _userManager.AddToRoleAsync(
                userAsAdmin,
                role_RegisteredUser
            );

            await _userManager.AddToRoleAsync(
                userAsAdmin,
                role_Administrator
            );

            userAsAdmin.EmailConfirmed = true;

            userAsAdmin.LockoutEnabled = false;

            addedUserList.Add(userAsAdmin);
        }

        string emailForUser = "user@email.com";
        if (await _userManager.FindByNameAsync(emailForUser) == null)
        {
            var userAsUser = new ApplicationUser()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = emailForUser,
                Email = emailForUser
            };

            await _userManager.CreateAsync(
                userAsUser,
                _configuration["DefaultPasswords:RegisteredUser"]
            );

            await _userManager.AddToRoleAsync(
                userAsUser,
                role_RegisteredUser
            );

            userAsUser.EmailConfirmed = true;

            userAsUser.LockoutEnabled = false;

            addedUserList.Add(userAsUser);
        }

        if (addedUserList.Count > 0)
            await _context.SaveChangesAsync();

        return new JsonResult(new
        {
            Count = addedUserList.Count,
            Users = addedUserList
        });
    }

    [HttpGet]
    public async Task<ActionResult> Import()
    {
        // prevents non-development environments from running this method
        if (!_env.IsDevelopment())
            throw new SecurityException("Not allowed");

        string path = Path.Combine(
            _env.ContentRootPath,
            "Data/Source/worldcities.xlsx"
        );

        using var stream = System.IO.File.OpenRead(path);
        using var excelPackage = new ExcelPackage(stream);

        // get the first worksheet 
        var worksheet = excelPackage.Workbook.Worksheets[0];

        // define how many rows we want to process 
        int nEndRow = worksheet.Dimension.End.Row;

        int numberOfCountriesAdded = 0;
        int numberOfCitiesAdded = 0;

        // create a lookup dictionary 
        // containing all the countries already existing 
        // into the Database (it will be empty on first run).
        var countriesByName = _context.Countries
            .AsNoTracking()
            .ToDictionary(x => x.Name, StringComparer.OrdinalIgnoreCase);

        // iterates through all rows, skipping the first one 
        for (int nRow = 2; nRow <= nEndRow; nRow++)
        {
            var row = worksheet.Cells[
                nRow,
                1,
                nRow,
                worksheet.Dimension.End.Column
            ];

            var countryName = row[nRow, 5].GetValue<string>();
            var iso2 = row[nRow, 6].GetValue<string>();
            var iso3 = row[nRow, 7].GetValue<string>();

            if (countriesByName.ContainsKey(countryName))
                continue;

            var country = new Country
            {
                Name = countryName,
                ISO2 = iso2,
                ISO3 = iso3
            };

            await _context.Countries.AddAsync(country);

            countriesByName.Add(countryName, country);

            numberOfCountriesAdded++;
        }

        if (numberOfCountriesAdded > 0)
            await _context.SaveChangesAsync();

        // create a lookup dictionary
        // containing all the cities already existing 
        // into the Database (it will be empty on first run). 
        var cities = _context.Cities
            .AsNoTracking()
            .ToDictionary(x => (
                Name: x.Name,
                Lat: x.Lat,
                Lon: x.Lon,
                CountryId: x.CountryId));

        // iterates through all rows, skipping the first one 
        for (int nRow = 2; nRow <= nEndRow; nRow++)
        {
            ExcelRange row = worksheet.Cells[
                nRow,
                1,
                nRow,
                worksheet.Dimension.End.Column
            ];

            var name = row[nRow, 1].GetValue<string>();
            var nameAscii = row[nRow, 2].GetValue<string>();
            var lat = row[nRow, 3].GetValue<decimal>();
            var lon = row[nRow, 4].GetValue<decimal>();
            var countryName = row[nRow, 5].GetValue<string>();

            int countryId = countriesByName[countryName].Id;

            if (cities.ContainsKey((
                Name: name,
                Lat: lat,
                Lon: lon,
                CountryId: countryId)))
                continue;

            var city = new City
            {
                Name = name,
                Lat = lat,
                Lon = lon,
                CountryId = countryId
            };

            _context.Cities.Add(city);

            numberOfCitiesAdded++;
        }

        if (numberOfCitiesAdded > 0)
            await _context.SaveChangesAsync();

        return new JsonResult(new
        {
            Cities = numberOfCitiesAdded,
            Countries = numberOfCountriesAdded
        });
    }
}