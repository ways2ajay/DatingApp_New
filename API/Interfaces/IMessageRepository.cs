using API.DTOs;
using API.Entities;
using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Interfaces;
public interface IMessageRepository
{
    void Add(Message message);
    void Delete(Message message);

    Task<Message?> GetMessage(string messageId);

    Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParams messageParams);

    Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId, string RecipientId);

    Task<bool> SaveAllAsync();

}
