using API.Entities;
using API.Helpers;
using System.Collections.Generic;

namespace API.Interfaces;

public interface IMemberRepository
{
    void Update(Member member);
    Task<bool> SaveAllAsync();
    Task<Member?> GetMemberByIdAsync(string id);
    Task<Member?> GetMemberForUpdate(string id);
    Task<PaginatedResult<Member>> GetMembersAsync(MemberParams pagingParams);
    Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId);

}