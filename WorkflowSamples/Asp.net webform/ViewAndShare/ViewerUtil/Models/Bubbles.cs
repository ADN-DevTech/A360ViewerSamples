using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ViewerUtil.Models
{
    public class BubbleViewable
    {
        public string guid { get; set; }
        public string type { get; set; }
        public List<double> camera { get; set; }
        public string hasThumbnail { get; set; }
        public string name { get; set; }
        public string role { get; set; }
        public string mime { get; set; }
        public string urn { get; set; }
    }

    public class BubbleGeometry
    {
        public string guid { get; set; }
        public string type { get; set; }
        public string hasThumbnail { get; set; }
        public string name { get; set; }
        public int order { get; set; }
        public string role { get; set; }
        public string status { get; set; }
        public List<BubbleViewable> children { get; set; }
        public string mime { get; set; }
        public string urn { get; set; }
    }

    public class Child2
    {
        public string guid { get; set; }
        public string type { get; set; }
        public string hasThumbnail { get; set; }
        public string name { get; set; }
        public string progress { get; set; }
        public string status { get; set; }
        public string success { get; set; }
        public List<BubbleGeometry> children { get; set; }
    }

    public class BubbleFolder
    {
        public string guid { get; set; }
        public string type { get; set; }
        public string hasThumbnail { get; set; }
        public string name { get; set; }
        public string progress { get; set; }
        public string role { get; set; }
        public string status { get; set; }
        public string success { get; set; }
        public string version { get; set; }
        public List<Child2> children { get; set; }
    }

    public class BubbleStatus
    {
        public string guid { get; set; }
        public string type { get; set; }
        public string hasThumbnail { get; set; }
        public string progress { get; set; }
        public string startedAt { get; set; }
        public string status { get; set; }
        public string success { get; set; }
        public string urn { get; set; }
   
    }
}
