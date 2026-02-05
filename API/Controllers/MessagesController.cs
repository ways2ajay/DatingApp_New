using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessagesController(IMessageRepository messageRepository, 
        IMemberRepository memberRepository) : BaseApiController
    {
        [HttpPost]
        public async Task< ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var sender = await memberRepository.GetMemberByIdAsync(User.GetMemberId());
            var recipient = await memberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

            if( sender == null || recipient == null || sender.Id == recipient.Id)
                return BadRequest("Can not send this message.");
            
            var message = new Message
            {
                RecipientId = recipient.Id,
                SenderId = sender.Id,
                Content = createMessageDto.Content
            };

            messageRepository.Add(message);

            if(await messageRepository.SaveAllAsync()) return message.ToDto();
            
            return BadRequest("Failed to send message.");
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMessagesByContainer(
            [FromQuery]MessageParams messageParams)
        {
            messageParams.MemberId = User.GetMemberId();
            return await messageRepository.GetMessagesForMember(messageParams);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string recipientId)
        {
            return Ok( await messageRepository.GetMessageThread(User.GetMemberId(),recipientId));
        }

        [HttpDelete("{messageId}")]
        public async Task<ActionResult> DeleteMessage(string messageId)
        {
            string memberId = User.GetMemberId();
            if(memberId is null) return BadRequest("Incorrect token");

            Message?  message = await messageRepository.GetMessage(messageId);
            if(message == null) return BadRequest("Can not delete this message.");

            if(message.SenderId != memberId  && message.RecipientId != memberId)
                 return BadRequest("You can not delete the message.");
            
            if(message.SenderId == memberId)
                message.SenderDeleted = true;
            if(message.RecipientId == memberId)
                message.RecipientDeleted = true;
            if(message is {SenderDeleted: true, RecipientDeleted: true})
                messageRepository.Delete(message);

            if(await messageRepository.SaveAllAsync())
                return Ok();
            
            return BadRequest("Problem deleting the message.");
        }
    }

}
