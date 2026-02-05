namespace API.DTOs;

public class MessageDto
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Content { get; set; }
    public DateTime? DateRead { get; set; }
    public DateTime MessegeSent { get; set; }=DateTime.UtcNow;

    public required string SenderId { get; set; }
    public string SenderDisplayName { get; set; }="";
    public string SenderImageUrl { get; set; } ="";
    public required string RecipientId { get; set; }
    public string RecipientDisplayName { get; set; } = "";
    public string RecipientImageUrl { get; set; } ="";
}