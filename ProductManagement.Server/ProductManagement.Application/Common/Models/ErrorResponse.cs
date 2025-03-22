namespace ProductManagement.Application.Common.Models
{
    public class ErrorResponse
    {
        public string Message { get; set; }
        public string Type { get; set; }
        public string Details { get; set; }
        public int StatusCode { get; set; }
        public string TraceId { get; set; }

        public ErrorResponse(string message, string type, string details, int statusCode, string traceId)
        {
            Message = message;
            Type = type;
            Details = details;
            StatusCode = statusCode;
            TraceId = traceId;
        }
    }
}