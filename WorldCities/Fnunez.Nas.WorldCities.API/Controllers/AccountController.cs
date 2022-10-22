using System.IdentityModel.Tokens.Jwt;
using Fnunez.Nas.WorldCities.API.Data;
using Fnunez.Nas.WorldCities.API.Data.Dtos;
using Fnunez.Nas.WorldCities.API.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Fnunez.Nas.WorldCities.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtHandler _jwtHandler;

    public AccountController(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        JwtHandler jwtHandler
        )
    {
        _context = context;
        _userManager = userManager;
        _jwtHandler = jwtHandler;
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login(LoginRequestDto loginRequestDto)
    {
        ApplicationUser user = await _userManager
            .FindByNameAsync(loginRequestDto.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, loginRequestDto.Password))
            return Unauthorized(new LoginResultDto()
            {
                Success = false,
                Message = "Invalid Email or Password."
            });

        JwtSecurityToken secToken = await _jwtHandler
            .GetTokenAsync(user);

        string jwt = new JwtSecurityTokenHandler()
            .WriteToken(secToken);

        return Ok(new LoginResultDto()
        {
            Success = true,
            Message = "Login successful",
            Token = jwt
        });
    }
}