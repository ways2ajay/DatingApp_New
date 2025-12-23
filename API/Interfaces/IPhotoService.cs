using CloudinaryDotNet.Actions;

namespace API.Interfaces;
public interface IPhotoService
{
    Task<DeletionResult> DeletePhotoAsync(string photoId);
    Task<UploadResult> UploadPhotoAsync(IFormFile file);
}