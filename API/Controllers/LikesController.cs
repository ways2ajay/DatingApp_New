using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController(ILikeRepository likeRepository):BaseApiController
{
    [HttpPost("{targetMemberId}")]
    public async Task<ActionResult> ToggleLike(string targetMemberId)
    {
        var currentMemberId = User.GetMemberId();
        if(currentMemberId == targetMemberId) return BadRequest("You can not like yourself");

        var existingLike = await likeRepository.GetMemberLike(currentMemberId,targetMemberId);
        if(existingLike == null)
        {
            var like = new MemberLike{ SourceMemberId=currentMemberId, TargetMemberId=targetMemberId};
            likeRepository.AddLike(like);
        }
        else
        {
            likeRepository.DeleteLike(existingLike);
        }
        if(await likeRepository.SaveAllChanges()) return Ok();

        return BadRequest("Error updating like.");
    }

    
    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
    {
        var currentMemberId = User.GetMemberId();
        return Ok(await likeRepository.GetCurrentMemberLikeIds(currentMemberId));
    }
    
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMemberLikes([FromQuery]LikesParams likesParams)
    {
        likesParams.MemberId = User.GetMemberId();
        var memberLikes = await likeRepository.GetMemberLikes(likesParams);
        return Ok(memberLikes);
    }
}