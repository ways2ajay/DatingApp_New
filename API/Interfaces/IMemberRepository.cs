using API.Entities;
using System.Collections.Generic;

namespace API.Interfaces;

public interface IMemberRepository
{
    void Update(Member member);
    Task<bool> SaveAllAsync();
    Task<Member?> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<Member>> GetMembersAsync();
    Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId);

}