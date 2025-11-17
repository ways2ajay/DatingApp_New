using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    public string DisplayName { get; set; } = "";
    [EmailAddress]
    [Required]
    public string Email { get; set; } = "";
    [MinLength(4)]
    [Required]
    public string Password { get; set; }="";
}