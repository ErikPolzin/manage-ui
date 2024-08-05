// tutorialData.js

// tutorial information 1
const tutorialData = [
  {
    stageName: "Basic Navigation",
    tooltips: [
      {
        type: "informative",
        targetElement: "#resources-title",
        targetAreaElement: "#resources-title",
        title: "Resource Tile",
        content: "This is the page title that tells you the title of the page",
      },
      {
        type: "informative",
        targetElement: "#resources-subtitle",
        targetAreaElement: "#resources-subtitle",
        title: "Subtitle",
        content: "Subtitles give you a great  indication of what is coming next",
      },
      {
        type: "action",
        targetElement: "#resources-subtitle",
        targetAreaElement: "#resources-subtitle",
        title: "",
        content: "Click on the resource subtitle",
      },
      {
        type: "informative",
        targetElement: "#resources-description",
        targetAreaElement: "#resources-description",
        title: "Last Element",
        content: "This is the last element of stage 1. It is the body that explains the tutorial",
      },
    ],
    test: [
      {
        text: "Open the menu sidebar",
        clickElements: [
          {
            elementId: "#menu-sidebar",
            textInputElements: [],
          },
        ],
      },
      {
        text: "Navigate to the devices and dashboard page please",
        clickElements: [
          {
            elementId: "#sidebar-devices-page",
            textInputElements: [],
          },
          {
            elementId: "#sidebar-dashboard-page",
            textInputElements: [],
          },
        ],
      },
    ],
  },
  {
    stageName: "Mapping Nodes",
    tooltips: [
      {
        type: "informative",
        targetElement: "#create-device-button",
        targetAreaElement: "#create-device-button",
        title: "Feature 4",
        content: "This is the first feature of Stage 2.",
      },
      {
        type: "informative",
        targetElement: "#device-type-inputbox",
        targetAreaElement: "#device-type-inputbox",
        title: "Feature 5",
        content: "This is the second feature of Stage 2.",
      },
    ],
    test: [],
  },
  {
    stageName: "Device Basics",
    tooltips: [
      {
        type: "informative",
        targetElement: "#element5",
        targetAreaElement: "#element5",
        title: "Feature 6",
        content: "This is the first feature of Stage 3.",
      },
      {
        type: "informative",
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
        targetElement: "#element7",
        targetAreaElement: "#element7",
        title: "Feature 8",
        content: "This is the first feature of Stage 4.",
      },
      {
        type: "informative",
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
        targetElement: "#element8",
        targetAreaElement: "#element8",
        title: "Feature 10",
        content: "This is the first feature of Stage 4.",
      },
      {
        type: "informative",
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
