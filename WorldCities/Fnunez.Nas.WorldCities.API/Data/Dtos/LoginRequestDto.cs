using System.ComponentModel.DataAnnotations;

namespace Fnunez.Nas.WorldCities.API.Data.Dtos;

public class LoginRequestDto
{
    [Required(ErrorMessage = "Email is required.")]
    public string Email { get; set; } = null!;
    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; } = null!;
}