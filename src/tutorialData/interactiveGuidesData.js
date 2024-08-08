// interactiveGuidesData.js

// Guides data 1
// const guidesData = [
//   {
//     name: "Navigate to Page 1",
//     page: "/page1",
//     tooltips: [
//       {
//         type: "informative",
//         page: "/page1",
//         targetElement: "#sidebar",
//         targetAreaElement: "#sidebar",
//         title: "Sidebar Menu",
//         content:
//           "This is your sidebar menu. From here, you can navigate to all the main pages in the application.",
//       },
//       {
//         type: "action",
//         page: "/page1",
//         targetElement: "#nav-page1",
//         targetAreaElement: "#nav-page1",
//         title: "Page 1 Navigation",
//         content: "Click here to navigate to Page 1.",
//       },
//     ],
//   },
//   {
//     name: "Interact with Page 1",
//     page: "/page1",
//     tooltips: [
//       {
//         type: "informative",
//         page: "/page1",
//         targetElement: "#page1-title",
//         targetAreaElement: "#page1-title",
//         title: "Page 1 Title",
//         content: "This is the title of Page 1.",
//       },
//       {
//         type: "informative",
//         page: "/page1",
//         targetElement: "#button1",
//         targetAreaElement: "#button1",
//         title: "Button 1",
//         content: "This is Button 1. Click on it to interact with it.",
//       },
//       {
//         type: "informative",
//         page: "/page1",
//         targetElement: "#input1",
//         targetAreaElement: "#input1",
//         title: "Input 1",
//         content: "This is Input 1. Enter some text to interact with it.",
//       },
//     ],
//   },
//   {
//     name: "Interact with Page 2",
//     page: "/page2",
//     tooltips: [
//       {
//         type: "informative",
//         page: "/page1",
//         targetElement: "#nav-page2",
//         targetAreaElement: "#nav-page2",
//         title: "Page 2 Navigation",
//         content: "Click here to navigate to Page 2.",
//       },
//       {
//         type: "informative",
//         page: "/page2",
//         targetElement: "#page2-title",
//         targetAreaElement: "#page2-title",
//         title: "Page 2 Title",
//         content: "This is the title of Page 2.",
//       },
//       {
//         type: "informative",
//         page: "/page2",
//         targetElement: "#button2",
//         targetAreaElement: "#button2",
//         title: "Button 2",
//         content: "This is Button 2. Click on it to interact with it.",
//       },
//       {
//         type: "informative",
//         page: "/page2",
//         targetElement: "#input2",
//         targetAreaElement: "#input2",
//         title: "Input 2",
//         content: "This is Input 2. Enter some text to interact with it.",
//       },
//     ],
//   },
//   // add more guides
// ];

// Guides data 2
const guidesData = [
  {
    name: "Dashboard Information",
    page: "/",
    tooltips: [
      {
        type: "informative",
        page: "/",
        targetElement: "#overview-stack-geopositioned",
        targetAreaElement: "#overview-stack-geopositioned",
        title: "Geopositioned Nodes",
        content: "Geopositioned nodes are all the nodes that we have set a location for.",
      },
      {
        type: "informative",
        page: "/",
        targetElement: "#overview-stack-ok",
        targetAreaElement: "#overview-stack-ok",
        title: "OK Nodes",
        content: "OK nodes are all the nodes with a health status above OK.",
      },
      {
        type: "informative",
        page: "/",
        targetElement: "#overview-stack-online",
        targetAreaElement: "#overview-stack-online",
        title: "Online Nodes",
        content: "Online nodes are all the nodes that are online.",
      },
      {
        type: "informative",
        page: "/",
        targetElement: "#overview-stack-registered",
        targetAreaElement: "#overview-stack-registered",
        title: "Registered Nodes",
        content: "Registered nodes are all the nodes that we have registered.",
      },
    ],
  },
  {
    name: "Adding a Device",
    page: "/",
    tooltips: [
      {
        type: "informative",
        page: "/",
        targetElement: "#overview-stack-geopositioned",
        targetAreaElement: "#overview-stack-geopositioned",
        title: "Geopositioned Nodes",
        content: "Geopositioned nodes are all the nodes that we have set a location for.",
      },
    ],
  },
  {
    name: "Dealing with Devices",
    page: "/devices",
    tooltips: [],
  },
  // add more guides
];

export default guidesData;
