using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("server-error")] //500
    public IActionResult GetServerError()
    {
        throw new Exception("This is a server error");
    }

    [HttpGet("Auth")] //401
    public IActionResult GetAuthError()
    {
        return Unauthorized();
    }

     [HttpGet("not-found")] //404
    public IActionResult GetNotFound()
    {
        return NotFound();
    }

     [HttpGet("bad-request")] //400
    public IActionResult GetBadRequest()
    {
        return BadRequest();
    }

}