
using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class MembersController(IMemberRepository memberRepository,
    IPhotoService photoService) : BaseApiController
{

    [HttpGet]
    public async Task<PaginatedResult<Member>> GetMembers([FromQuery]MemberParams memberParams)
    {
        memberParams.CurrentMemberId = User.GetMemberId();
       return await  memberRepository.GetMembersAsync(memberParams);
    }

    
    [HttpGet("{id}")]
    public async Task<ActionResult<Member>> GetMember(string id)
    {
        var member = await memberRepository.GetMemberByIdAsync(id);
        if (member == null)
        {
            return NotFound();
        }
        return member;
    }

    [HttpGet("{id}/photos")]
    public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
    {
        return Ok( await memberRepository.GetPhotosForMemberAsync(id));
    }

    [HttpPut()]
    public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
    {
        var memberId =  User.GetMemberId();
        //memberId = memberId + "-id";
        var member = await memberRepository.GetMemberForUpdate(memberId);
        if(member ==null) return BadRequest("Could not get member.");

        member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
        member.Description = memberUpdateDto.Description ?? member.Description;
        member.City = memberUpdateDto.City ?? member.City;
        member.Country = memberUpdateDto.Country ?? member.Country;

        member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

        if(await memberRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Failed to update member.");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<Photo>> AddPhoto([FromForm]IFormFile file)
    {
        var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
        if(member == null) return BadRequest("Can not update member.");

        var result = await photoService.UploadPhotoAsync(file);

        if(result.Error != null) return BadRequest(result.Error.Message);

        var photo = new Photo
        {
             MemberId = User.GetMemberId(),
             Url = result.SecureUrl.AbsoluteUri,
             PublicId = result.PublicId
        };

        if(member.ImageUrl == null)
        {
            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;
        }
        member.Photos.Add(photo);

        if(await memberRepository.SaveAllAsync()) return photo;

        return BadRequest("Problem adding photo.");

    }

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
        if(member ==null) return BadRequest("Can not get member from token.");

        var photo = member.Photos.FirstOrDefault(p=> p.Id == photoId);
        if(photo == null || member.ImageUrl == photo.Url) return BadRequest("Can not set photo as main.");

        member.User.ImageUrl = photo.Url;
        member.ImageUrl = photo.Url;
        if(await memberRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Problem setting photo.");
    }

    [HttpDelete("delete-photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
        if(member ==null) return BadRequest("Can not get member from token.");

        var photo = member.Photos.FirstOrDefault(p=> p.Id == photoId);
        if(photo==null || member.ImageUrl == photo.Url) return BadRequest("Main photo of member can not be deleted.");

        if(photo.PublicId != null)
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if(result.Error != null) return BadRequest(result.Error);
        }

        member.Photos.Remove(photo);
        if(await memberRepository.SaveAllAsync()) return Ok();
        return BadRequest("Error deleting photo.");
    }
}