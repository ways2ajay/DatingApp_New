using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    public required string DisplayName { get; set; } = "";
    [EmailAddress]
    public required string Email { get; set; } = "";
    [MinLength(4)]
    public required string Password { get; set; }="";

    public required DateOnly DateOfBirth { get; set; }
    public required string Gender { get; set; }

    public required string City { get; set; }
    public required string Country { get; set; }
}