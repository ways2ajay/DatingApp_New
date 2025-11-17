
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;


public class MembersController(AppDbContext dbContext) : BaseApiController
{

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
    {
        var members = await dbContext.Users.ToListAsync();
        return members;
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<AppUser>> GetMember(string id)
    {
        var member = await dbContext.Users.FindAsync(id);
        if (member == null)
        {
            return NotFound();
        }
        return member;
    }

}