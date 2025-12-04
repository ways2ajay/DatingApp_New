using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting.Internal;

public class Seed
{
    public static async Task SeedUsers(AppDbContext context, IHostEnvironment hostEnvironment)
    {
        if (await context.Users.AnyAsync()) return;
        var path = Path.Combine(hostEnvironment.ContentRootPath, "/Data/UserSeedData.json");
        var memberData = await File.ReadAllTextAsync(hostEnvironment.ContentRootPath+ "/Data/UserSeedData.json");
        var memebers = JsonSerializer.Deserialize<List<SeedUserDto>>(memberData);

        if (memebers == null) return;

        foreach (var member in memebers)
        {
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                Id = member.Id,
                Email = member.Email,
                DisplayName = member.DisplayName,
                ImageUrl = member.ImageUrl,
                PasswordSalt = hmac.Key,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("P@ssw0rd")),

                Member = new Member
                {
                    Id = member.Id,
                    DisplayName = member.DisplayName,
                    Description = member.Description,
                    DateOfBirth = member.DateOfBirth,
                    ImageUrl = member.ImageUrl,
                    Gender = member.Gender,
                    City = member.City,
                    Country = member.Country,
                    Created = member.Created,
                    LastActive = member.LastActive,
                }
            };
            user.Member.Photos.Add(new Photo
            {
                MemberId = member.Id,
                Url = member.ImageUrl
            });

            context.Users.Add(user);
        }
        await context.SaveChangesAsync();
    }
}