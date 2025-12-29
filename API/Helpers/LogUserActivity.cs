using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class LogUserActivity : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext = next();
        if(context.HttpContext.User.Identity?.IsAuthenticated != true) return;
        var memberId =resultContext.Result.HttpContext.User.GetMemberId();
        var dbContext =  resultContext.Result.HttpContext.RequestServices
            .GetRequiredService<AppDbContext>();

        await dbContext.Members.Where(x=>x.Id == memberId)
            .ExecuteUpdateAsync(setters => setters.SetProperty(x=>x.LastActive, DateTime.UtcNow));
    }
}