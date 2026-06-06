using AutoMapper;
using TaskManager.API.DTOs;
using TaskManager.API.Models;

namespace TaskManager.API.Mapping
{
    /// <summary>
    /// AutoMapper profile for mapping between models and DTOs.
    /// </summary>
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // TaskItem -> TaskResponseDto
            CreateMap<TaskItem, TaskResponseDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => src.Priority.ToString()))
                .ForMember(dest => dest.AssignedUserName,
                    opt => opt.MapFrom(src => src.AssignedUser != null ? src.AssignedUser.FullName : ""));

            // TaskCreateDto -> TaskItem
            CreateMap<TaskCreateDto, TaskItem>();

            // TaskUpdateDto -> TaskItem (ignore Id, CreatedAt, AssignedUserId)
            CreateMap<TaskUpdateDto, TaskItem>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.AssignedUserId, opt => opt.Ignore())
                .ForMember(dest => dest.AssignedUser, opt => opt.Ignore());

            // ApplicationUser -> UserProfileDto
            CreateMap<ApplicationUser, UserProfileDto>();
        }
    }
}
