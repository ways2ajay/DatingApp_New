using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }
    public DbSet<Member> Members { get; set; }
    public DbSet<Photo> Photos{ get; set; }

    public DbSet<MemberLike> Likes { get; set; }

    // public DbSet<Message> Messages {get; set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // modelBuilder.Entity<MemberLike>()
        // .HasKey(e=>new {e.SourceMemberId, e.TargetMemberId});
        //commented above code as same composite key can be provided using the attribute in the class using
        //[PrimaryKey(nameof(SourceMemberId),nameof(TargetMemberId))]

        // modelBuilder.Entity<Message>()
        // .HasOne(x=>x.Recipient)
        // .WithMany(m=>m.MessagesReceived)
        // .OnDelete(DeleteBehavior.Restrict);

        // modelBuilder.Entity<Message>()
        // .HasOne(x=>x.Sender)
        // .WithMany(m=>m.MessagesSent)
        // .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<MemberLike>()
        .HasOne(s=>s.SourceMember)
        .WithMany(t => t.LikedMembers)
        .HasForeignKey(s => s.SourceMemberId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MemberLike>()
        .HasOne(s=>s.TargetMember)
        .WithMany(t=>t.LikedByMembers)
        .HasForeignKey(x=>x.TargetMemberId)
        .OnDelete(DeleteBehavior.NoAction);

        var dateTimeConverter = new ValueConverter<DateTime,DateTime>(
            v => v.ToUniversalTime(),
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
        );

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach(var property in entityType.GetProperties())
            {
                if(property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dateTimeConverter);
                }
            }
        }
    }
}