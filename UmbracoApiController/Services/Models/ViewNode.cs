using System.Collections.Generic;
using umbraco.interfaces;
using umbraco.NodeFactory;

namespace UmbracoTest.Services.Models
{
    public class ViewNode
    {
        public int TemplateId { get; set; }
        public int Id { get; set; }
        public int Level { get; set; }
        public string Name { get; set; }
        public string NiceUrl { get; set; }
        public IProperty BodyText { get; set; }
        public StatusMessage StatusMessage { get; set; }
        public List<IProperty> Properties { get; set; }

        public static ViewNode Create(Node node)
        {
            return new ViewNode
            {
                NiceUrl = node.NiceUrl,
                TemplateId = node.template,
                Name = node.Name,
                Level = node.Level,
                Id = node.Id,
                Properties = node.PropertiesAsList,
                StatusMessage = new StatusMessage { Success = true }
            };
        }
    }    
}