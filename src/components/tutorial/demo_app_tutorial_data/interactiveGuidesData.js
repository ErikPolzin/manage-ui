// interactiveGuidesData.js

const demoGuidesData = [
  {
    name: "Navigate to Page 1",
    starting_page: "/page1",
    tooltips: [
      {
        type: "informative",
        page: "/page1",
        target_element_id: "sidebar",
        target_area_element_id: "sidebar",
        title: "Sidebar Menu",
        content:
          "This is your sidebar menu. From here, you can navigate to all the main pages in the application.",
      },
      {
        type: "action",
        page: "/page1",
        target_element_id: "nav-page1",
        target_area_element_id: "nav-page1",
        title: "Page 1 Navigation",
        content: "Click here to navigate to Page 1.",
      },
    ],
  },
  {
    name: "Interact with Page 1",
    page: "/page1",
    tooltips: [
      {
        type: "informative",
        page: "/page1",
        target_element_id: "page1-title",
        target_area_element_id: "page1-title",
        title: "Page 1 Title",
        content: "This is the title of Page 1.",
      },
      {
        type: "informative",
        page: "/page1",
        target_element_id: "button1",
        target_area_element_id: "button1",
        title: "Button 1",
        content: "This is Button 1. Click on it to interact with it.",
      },
      {
        type: "informative",
        page: "/page1",
        target_element_id: "input1",
        target_area_element_id: "input1",
        title: "Input 1",
        content: "This is Input 1. Enter some text to interact with it.",
      },
    ],
  },
  {
    name: "Interact with Page 2",
    starting_page: "/page2",
    tooltips: [
      {
        type: "informative",
        page: "/page1",
        target_element_id: "nav-page2",
        target_area_element_id: "nav-page2",
        title: "Page 2 Navigation",
        content: "Click here to navigate to Page 2.",
      },
      {
        type: "informative",
        page: "/page2",
        target_element_id: "page2-title",
        target_area_element_id: "page2-title",
        title: "Page 2 Title",
        content: "This is the title of Page 2.",
      },
      {
        type: "informative",
        page: "/page2",
        target_element_id: "button2",
        target_area_element_id: "button2",
        title: "Button 2",
        content: "This is Button 2. Click on it to interact with it.",
      },
      {
        type: "informative",
        page: "/page2",
        target_element_id: "input2",
        target_area_element_id: "input2",
        title: "Input 2",
        content: "This is Input 2. Enter some text to interact with it.",
      },
    ],
  },
  // add more guides
];

// const guidesData = [
//   {
//     name: "Getting Started",
//     starting_page: "/dashboard",
//     tooltips: [
//       {
//         type: "informative",
//         target_element_id: "element0",
//         target_area_element_id: "element0",
//         title: "Sidebar menu",
//         content:
//           "This is your side bar menu. From here, you can navigate to all the main pages in the application.\nYou can also access the application settings and your account details.",
//       },
//       {
//         type: "informative",
//         target_element_id: "element1",
//         target_area_element_id: "element1",
//         title: "Feature 2",
//         content: "This is the second feature of Stage 1.",
//       },
//       {
//         type: "action",
//         target_element_id: "element2",
//         target_area_element_id: "element2",
//         title: "Feature 3",
//         content: "Click on feature 2",
//       },
//       {
//         type: "informative",
//         target_element_id: "element4",
//         target_area_element_id: "element4",
//         title: "Take a look",
//         content: "Investigate all the search options by using this feature.",
//       },
//     ],
//   },
//   {
//     name: "Navigation",
//     starting_page: "/dashboard",
//     tooltips: [],
//   },
//   {
//     name: "Dealing with Devices",
//     starting_page: "devices",
//     tooltips: [],
//   },
//   // add more guides
// ];

export default demoGuidesData;
