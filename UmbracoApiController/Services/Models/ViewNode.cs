using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;
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
        public string HostName { get; set; }
        public List<ViewNode> Children { get; set; } 

        public static ViewNode Create(Node node)
        {
            var viewNode =  new ViewNode
            {
                NiceUrl = node.NiceUrl,
                TemplateId = node.template,
                Name = node.Name,
                Level = node.Level,
                Id = node.Id,
                Properties = node.PropertiesAsList,
                StatusMessage = new StatusMessage { Success = true },
                HostName = GetHostname()
            };

            GetChildrenRecursive(node, viewNode);

            return viewNode;
        }

        private static void GetChildrenRecursive(INode node, ViewNode viewNode)
        {
            viewNode.Children = new List<ViewNode>();

            foreach (var child in node.ChildrenAsList)
            {
                var temp = new ViewNode
                {
                    NiceUrl = child.NiceUrl,
                    TemplateId = child.template,
                    Name = child.Name,
                    Level = child.Level,
                    Id = child.Id,
                    Properties = child.PropertiesAsList,
                    StatusMessage = new StatusMessage {Success = true},
                    HostName = GetHostname(),
                    Children = new List<ViewNode>()
                };

                viewNode.Children.Add(temp);

                if(child.ChildrenAsList.Any())
                    GetChildrenRecursive(child, temp);
            }
        }

        private static string GetHostname()
        {
            if (HttpContext.Current == null)
                return "";

            return HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority;
        }
    }    
}