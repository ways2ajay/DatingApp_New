using System.Runtime.CompilerServices;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikeRepository(AppDbContext dbContext) : ILikeRepository
{
    public async void AddLike(MemberLike like)
    {
        if(await dbContext.Likes.AnyAsync(l=> (l.SourceMemberId == like.SourceMemberId 
            && l.TargetMemberId == like.TargetMemberId)))
            throw new InvalidOperationException("Like already exists.") ;//BadRequest("like already exists.");

        dbContext.Likes.Add(like);
        //return Ok();
    }

    public void DeleteLike(MemberLike like)
    {
        dbContext.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
    {
        // var member = await dbContext.Members.SingleOrDefaultAsync(m=> m.Id == memberId);
        // if(member ==null) return new List<string>(){};

        // var memberLikeIds= member.LikedMembers.Select(l=>l.TargetMemberId).ToList();
        // return memberLikeIds;
        return await dbContext.Likes
            .Where(l => l.SourceMemberId == memberId)
            .Select(l => l.TargetMemberId).ToListAsync();
    }

    public async Task<MemberLike?> GetMemberLike(string SourceMemberId, string TargetMemberId)
    {
        var memberLike = await dbContext.Likes.FindAsync(SourceMemberId , TargetMemberId);
    
        return memberLike;
    }

    public async Task<PaginatedResult<Member>> GetMemberLikes(LikesParams likesParams)
    {
        var query = dbContext.Likes.AsQueryable();
        IQueryable<Member> result ;
        switch (likesParams.Predicate.ToLower())
        {
            case "likedby":
                 result =  query.Where(l => l.TargetMemberId == likesParams.MemberId)
                    .Select(l => l.SourceMember);
                    break;
               
            case "liked":
                 result = query.Where(l => l.SourceMemberId == likesParams.MemberId)
                .Select(l=> l.TargetMember);
                break;
            default: //mutual
                var likeIds = await GetCurrentMemberLikeIds(likesParams.MemberId);
                 result = query.Where(l=> l.TargetMemberId == likesParams.MemberId &&
                    likeIds.Contains(l.SourceMemberId) )
                    .Select(l=>l.SourceMember);
                    break; 
                
        }

        return await PaginationHelper.CreateAsync<Member>(result, likesParams.pageNumber, likesParams.PageSize);
       // return await dbContext.Members.Where(m => memberIds.Contains(m.Id) ).ToListAsync();
    }

    public async Task<bool> SaveAllChanges()
    {
        return await dbContext.SaveChangesAsync()>0;
    }
}