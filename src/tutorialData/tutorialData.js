// tutorialData.js

// tutorial information 1
const tutorialData = [
  {
    stageName: "Basic Navigation",
    startingPage: "/",
    tooltips: [
      {
        type: "action",
        page: "/",
        targetElement: "#open-drawer-button",
        targetAreaElement: "#open-drawer-button",
        title: "",
        content: "Click on the sidebar icon to open/close the sidebar",
      },
      {
        type: "informative",
        page: "/",
        targetElement: "#sidebar-styled-drawer",
        targetAreaElement: "#sidebar-styled-drawer",
        title: "Sidebar",
        content:
          "The sidebar menu is your main source of navigation.\nHere you can find and navigate to all the different pages in the application.",
      },
      {
        type: "action",
        page: "/",
        targetElement: "#open-drawer-button",
        targetAreaElement: "#open-drawer-button",
        title: "",
        content: "Close the sidebar.",
      },
    ],
    test: [
      {
        text: "Open the menu sidebar",
        clickElements: [
          {
            elementId: "#open-drawer-button",
            textInputElements: [],
          },
        ],
      },
      {
        text: "Navigate to the devices page",
        clickElements: [
          {
            elementId: "#sidebar-devices-item",
            textInputElements: [],
          },
        ],
      },
      {
        text: "Navigate to the users and alerts page",
        clickElements: [
          {
            elementId: "#sidebar-users-item",
            textInputElements: [],
          },
          {
            elementId: "#sidebar-alerts-item",
            textInputElements: [],
          },
        ],
      },
    ],
  },
  {
    stageName: "The Dashboard",
    tooltips: [
      {
        type: "informative",
        page: "/",
        targetElement: "#home-page",
        targetAreaElement: "#home-page",
        title: "The Dashboard Page",
        content:
          "The dashboard page is like your home page, your starting page.\nThere are two main features to notice on the dashboard...",
      },
      {
        type: "informative",
        page: "/",
        targetElement: "#dashboard-map",
        targetAreaElement: "#dashboard-map",
        title: "Map",
        content:
          "The first feature is the map. This map shows all the existing nodes in your network and where they are located.\nFeel free to scroll around the map and look for Ocean View!",
      },
      {
        type: "informative",
        page: "/",
        targetElement: "#overview-stack",
        targetAreaElement: "#overview-stack",
        title: "Node Information",
        content:
          "The second feature is the basic, yet important overview information about the nodes.\n4 important pieces of node information health are given",
      },
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
        targetElement: "#overview-stack-online",
        targetAreaElement: "#overview-stack-online",
        title: "Online Nodes",
        content:
          "These are the nodes that are actually currently up and running - the nodes that are online.",
      },
    ],
    test: [],
  },
  {
    stageName: "Device Basics",
    tooltips: [
      {
        type: "informative",
        page: "/",
        targetElement: "#element5",
        targetAreaElement: "#element5",
        title: "Feature 6",
        content: "This is the first feature of Stage 3.",
      },
      {
        type: "informative",
        page: "/",
        targetElement: "#element6",
        targetAreaElement: "#element6",
        title: "Feature 7",
        content: "This is the second feature of Stage 3.",
      },
    ],
    test: [],
  },
  {
    stageName: "Deleting Devices",
    tooltips: [
      {
        type: "informative",
        page: "/",
        targetElement: "#element7",
        targetAreaElement: "#element7",
        title: "Feature 8",
        content: "This is the first feature of Stage 4.",
      },
      {
        type: "informative",
        page: "/",
        targetElement: "#element0",
        targetAreaElement: "#element0",
        title: "Feature 9",
        content: "This is the second feature of Stage 4.",
      },
    ],
    test: [],
  },
  {
    stageName: "Dealing with Alerts",
    tooltips: [
      {
        type: "informative",
        page: "/",
        targetElement: "#element8",
        targetAreaElement: "#element8",
        title: "Feature 10",
        content: "This is the first feature of Stage 4.",
      },
      {
        type: "informative",
        page: "/",
        targetElement: "#element7",
        targetAreaElement: "#element7",
        title: "Feature 11",
        content: "This is the second feature of Stage 4.",
      },
    ],
    test: [],
  },
  // Add more stages as needed
];

// tutorial information 2
// const tutorialData = [
//   {
//     stageName: "Navigate to Page 1",
//     startingPage: "/page1",
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
//     test: [
//       {
//         text: "Open the sidebar menu and navigate to Page 1",
//         clickElements: [
//           {
//             elementId: "#nav-page1",
//             textInputElements: [],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     stageName: "Interact with Page 1",
//     startingPage: "/page1",
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
//     test: [
//       {
//         text: "Click on Button 1",
//         clickElements: [
//           {
//             elementId: "#button1",
//             textInputElements: [],
//           },
//         ],
//       },
//       {
//         text: 'Enter "Sample text" into Input 1, then click button 1',
//         clickElements: [
//           {
//             elementId: "#button1",
//             textInputElements: [
//               {
//                 elementId: "#input1",
//                 requiredInput: "Sample text",
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     stageName: "Interact with Page 2",
//     startingPage: "/page2",
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
//     test: [
//       {
//         text: "Open the sidebar menu and navigate to Page 2",
//         clickElements: [
//           {
//             elementId: "#nav-page2",
//             textInputElements: [],
//           },
//         ],
//       },
//       {
//         text: "Click on Button 2",
//         clickElements: [
//           {
//             elementId: "#button2",
//             textInputElements: [],
//           },
//         ],
//       },
//       {
//         text: "Enter text into Input 2",
//         clickElements: [
//           {
//             elementId: "#input2",
//             textInputElements: [
//               {
//                 elementId: "#input2",
//                 requiredInput: "Another sample text",
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];

export default tutorialData;
