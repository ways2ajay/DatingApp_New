namespace API.Entities;
using Microsoft.EntityFrameworkCore;

[PrimaryKey(nameof(SourceMemberId),nameof(TargetMemberId))]
public class MemberLike
{
    public required string SourceMemberId{ get; set; }
    public required string TargetMemberId{ get; set;}

    public Member SourceMember{ get; set;}=null!;
    public Member TargetMember{ get; set;}=null!;


}