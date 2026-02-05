using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MessageRepository(AppDbContext context) : IMessageRepository
{
    public void Add(Message message)
    {
        context.Messages.Add(message);
    }

    public void Delete(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Message?> GetMessage(string messageId)
    {
        return await context.Messages.FindAsync(messageId);
    }

    public async Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParams messageParams)
    {
        var query = context.Messages.OrderByDescending(m=>m.MessegeSent).AsQueryable();

        query =   messageParams.Container switch
        {
            "Outbox" => query.Where(m=>m.SenderId == messageParams.MemberId 
                && m.SenderDeleted == false),
            _ => query.Where(m => m.RecipientId == messageParams.MemberId 
                && m.RecipientDeleted == false)
        };
        var messageQuery = query.Select(MessageExtensions.ToDtoProjection());

        return await PaginationHelper.CreateAsync(messageQuery, messageParams.pageNumber, messageParams.PageSize);
    }

    public async Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId, 
        string recipientId)
    {
        await context.Messages.Where(x=>x.RecipientId == currentMemberId 
            && x.SenderId == recipientId && x.DateRead == null && x.SenderDeleted == false)
            .ExecuteUpdateAsync(setter=> setter.SetProperty( m=>m.DateRead , DateTime.UtcNow));

        return await context.Messages.Where(x=> (x.RecipientId == currentMemberId 
                && x.SenderId == recipientId
                && x.RecipientDeleted == false) 
            || (x.SenderId == currentMemberId && x.RecipientId == recipientId 
                && x.SenderDeleted == false))
            .Select(MessageExtensions.ToDtoProjection())
            .ToListAsync();
            
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync()>0;
    }
}