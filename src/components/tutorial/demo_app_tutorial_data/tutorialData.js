// tutorialData.js

// tutorial information 1
// const tutorialData = [
//   {
//     name: "Basic Navigation",
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
//     test_tasks: [
//       {
//         text: "Open the menu sidebar",
//         click_elements: [
//           {
//             element_id: "menu-sidebar",
//             text_input_elements: [],
//           },
//         ],
//       },
//       {
//         text: "Navigate to the devices and dashboard page please",
//         click_elements: [
//           {
//             element_id: "sidebar-devices-page",
//             text_input_elements: [],
//           },
//           {
//             element_id: "sidebar-dashboard-page",
//             text_input_elements: [],
//           },
//         ],
//       },
//       {
//         text: "Click the testing remove button",
//         click_elements: [
//           {
//             element_id: "el-remove-test-button",
//             text_input_elements: [],
//           },
//         ],
//       },
//       {
//         text: "Create a new Mesh device with a MAC of 127:69:0:1",
//         click_elements: [
//           {
//             element_id: "create-device-button",
//             text_input_elements: [
//               {
//                 element_id: "mac-address-inputbox",
//                 required_input: "127:69:0:1",
//               },
//               {
//                 element_id: "device-type-inputbox",
//                 required_input: "Mesh type",
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     name: "Mapping Nodes",
//     tooltips: [
//       {
//         type: "informative",
//         target_element_id: "create-device-button",
//         target_area_element_id: "create-device-button",
//         title: "Feature 4",
//         content: "This is the first feature of Stage 2.",
//       },
//       {
//         type: "informative",
//         target_element_id: "device-type-inputbox",
//         target_area_element_id: "device-type-inputbox",
//         title: "Feature 5",
//         content: "This is the second feature of Stage 2.",
//       },
//     ],
//     test_tasks: [],
//   },
//   {
//     name: "Device Basics",
//     tooltips: [
//       {
//         type: "informative",
//         target_element_id: "element5",
//         target_area_element_id: "element5",
//         title: "Feature 6",
//         content: "This is the first feature of Stage 3.",
//       },
//       {
//         type: "informative",
//         target_element_id: "element6",
//         target_area_element_id: "element6",
//         title: "Feature 7",
//         content: "This is the second feature of Stage 3.",
//       },
//     ],
//     test_tasks: [],
//   },
//   {
//     name: "Deleting Devices",
//     tooltips: [
//       {
//         type: "informative",
//         target_element_id: "element7",
//         target_area_element_id: "element7",
//         title: "Feature 8",
//         content: "This is the first feature of Stage 4.",
//       },
//       {
//         type: "informative",
//         target_element_id: "element0",
//         target_area_element_id: "element0",
//         title: "Feature 9",
//         content: "This is the second feature of Stage 4.",
//       },
//     ],
//     test_tasks: [],
//   },
//   {
//     name: "Dealing with Alerts",
//     tooltips: [
//       {
//         type: "informative",
//         target_element_id: "element8",
//         target_area_element_id: "element8",
//         title: "Feature 10",
//         content: "This is the first feature of Stage 4.",
//       },
//       {
//         type: "informative",
//         target_element_id: "element7",
//         target_area_element_id: "element7",
//         title: "Feature 11",
//         content: "This is the second feature of Stage 4.",
//       },
//     ],
//     test_tasks: [],
//   },
//   // Add more stages as needed
// ];

// tutorial information 2
const demoTutorialData = [
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
    test_tasks: [
      {
        description: "Open the sidebar menu and navigate to Page 1",
        click_elements: [
          {
            element_id: "nav-page1",
            text_input_elements: [],
          },
        ],
      },
    ],
  },
  {
    name: "Interact with Page 1",
    starting_page: "/page1",
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
    test_tasks: [
      {
        description: "Click on Button 1",
        click_elements: [
          {
            element_id: "button1",
            text_input_elements: [],
          },
        ],
      },
      {
        description: 'Enter "Sample text" into Input 1, then click button 1',
        click_elements: [
          {
            element_id: "button1",
            text_input_elements: [
              {
                element_id: "input1",
                required_input: "Sample text",
              },
            ],
          },
        ],
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
        type: "action",
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
      {
        type: "informative",
        page: "/page2",
        target_element_id: "element4",
        target_area_element_id: "element4",
        title: "Feature4",
        content: "This is Feature 4.\nIt is one of my favorite features ever.",
      },
      {
        type: "informative",
        page: "/page2",
        target_element_id: "nav-page7",
        target_area_element_id: "nav-page7",
        title: "Sidebar 7",
        content: "This is Feature 4. It is one of my favorite features ever.",
      },
      {
        type: "informative",
        target_element_id: "create-device-button",
        target_area_element_id: "create-device-button",
        title: "Feature 4",
        content: "This is the first feature of Stage 2.",
      },
      {
        type: "informative",
        target_element_id: "device-type-inputbox",
        target_area_element_id: "device-type-inputbox",
        title: "Feature 5",
        content: "This is the second feature of Stage 2.",
      },
    ],
    test_tasks: [
      {
        description: "Open the sidebar menu and navigate to Page 2",
        click_elements: [
          {
            element_id: "nav-page2",
            text_input_elements: [],
          },
        ],
      },
      {
        description: "Click on Button 2",
        click_elements: [
          {
            element_id: "button2",
            text_input_elements: [],
          },
        ],
      },
      {
        description: 'Enter "Another sample text" into Input 2, and click on button 2',
        click_elements: [
          {
            element_id: "button2",
            text_input_elements: [
              {
                element_id: "input2",
                required_input: "Another sample text",
              },
            ],
          },
        ],
      },
    ],
  },
  // {
  //   name: "Navigate to Page 1",
  //   starting_page: "/page1",
  //   tooltips: [
  //     {
  //       type: "informative",
  //       page: "/page1",
  //       target_element_id: "sidebar",
  //       target_area_element_id: "sidebar",
  //       title: "Sidebar Menu",
  //       content:
  //         "This is your sidebar menu. From here, you can navigate to all the main pages in the application.",
  //     },
  //     {
  //       type: "action",
  //       page: "/page1",
  //       target_element_id: "nav-page1",
  //       target_area_element_id: "nav-page1",
  //       title: "Page 1 Navigation",
  //       content: "Click here to navigate to Page 1.",
  //     },
  //   ],
  //   test_tasks: [
  //     {
  //       text: "Open the sidebar menu and navigate to Page 1",
  //       click_elements: [
  //         {
  //           element_id: "nav-page1",
  //           text_input_elements: [],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: "Navigate to Page 1",
  //   starting_page: "/page1",
  //   tooltips: [
  //     {
  //       type: "informative",
  //       page: "/page1",
  //       target_element_id: "sidebar",
  //       target_area_element_id: "sidebar",
  //       title: "Sidebar Menu",
  //       content:
  //         "This is your sidebar menu. From here, you can navigate to all the main pages in the application.",
  //     },
  //     {
  //       type: "action",
  //       page: "/page1",
  //       target_element_id: "nav-page1",
  //       target_area_element_id: "nav-page1",
  //       title: "Page 1 Navigation",
  //       content: "Click here to navigate to Page 1.",
  //     },
  //   ],
  //   test_tasks: [
  //     {
  //       text: "Open the sidebar menu and navigate to Page 1",
  //       click_elements: [
  //         {
  //           element_id: "nav-page1",
  //           text_input_elements: [],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: "Navigate to Page 1 pleeeesss",
  //   starting_page: "/page1",
  //   tooltips: [
  //     {
  //       type: "informative",
  //       page: "/page1",
  //       target_element_id: "sidebar",
  //       target_area_element_id: "sidebar",
  //       title: "Sidebar Menu",
  //       content:
  //         "This is your sidebar menu. From here, you can navigate to all the main pages in the application.",
  //     },
  //     {
  //       type: "action",
  //       page: "/page1",
  //       target_element_id: "nav-page1",
  //       target_area_element_id: "nav-page1",
  //       title: "Page 1 Navigation",
  //       content: "Click here to navigate to Page 1.",
  //     },
  //   ],
  //   test_tasks: [
  //     {
  //       text: "Open the sidebar menu and navigate to Page 1",
  //       click_elements: [
  //         {
  //           element_id: "nav-page1",
  //           text_input_elements: [],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: "Navigate to Page 1",
  //   starting_page: "/page1",
  //   tooltips: [
  //     {
  //       type: "informative",
  //       page: "/page1",
  //       target_element_id: "sidebar",
  //       target_area_element_id: "sidebar",
  //       title: "Sidebar Menu",
  //       content:
  //         "This is your sidebar menu. From here, you can navigate to all the main pages in the application.",
  //     },
  //     {
  //       type: "action",
  //       page: "/page1",
  //       target_element_id: "nav-page1",
  //       target_area_element_id: "nav-page1",
  //       title: "Page 1 Navigation",
  //       content: "Click here to navigate to Page 1.",
  //     },
  //   ],
  //   test_tasks: [
  //     {
  //       text: "Open the sidebar menu and navigate to Page 1",
  //       click_elements: [
  //         {
  //           element_id: "nav-page1",
  //           text_input_elements: [],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: "Navigate to Page 1",
  //   starting_page: "/page1",
  //   tooltips: [
  //     {
  //       type: "informative",
  //       page: "/page1",
  //       target_element_id: "sidebar",
  //       target_area_element_id: "sidebar",
  //       title: "Sidebar Menu",
  //       content:
  //         "This is your sidebar menu. From here, you can navigate to all the main pages in the application.",
  //     },
  //     {
  //       type: "action",
  //       page: "/page1",
  //       target_element_id: "nav-page1",
  //       target_area_element_id: "nav-page1",
  //       title: "Page 1 Navigation",
  //       content: "Click here to navigate to Page 1.",
  //     },
  //   ],
  //   test_tasks: [
  //     {
  //       text: "Open the sidebar menu and navigate to Page 1",
  //       click_elements: [
  //         {
  //           element_id: "nav-page1",
  //           text_input_elements: [],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: "Navigate to Page 1",
  //   starting_page: "/page1",
  //   tooltips: [
  //     {
  //       type: "informative",
  //       page: "/page1",
  //       target_element_id: "sidebar",
  //       target_area_element_id: "sidebar",
  //       title: "Sidebar Menu",
  //       content:
  //         "This is your sidebar menu. From here, you can navigate to all the main pages in the application.",
  //     },
  //     {
  //       type: "action",
  //       page: "/page1",
  //       target_element_id: "nav-page1",
  //       target_area_element_id: "nav-page1",
  //       title: "Page 1 Navigation",
  //       content: "Click here to navigate to Page 1.",
  //     },
  //   ],
  //   test_tasks: [
  //     {
  //       text: "Open the sidebar menu and navigate to Page 1",
  //       click_elements: [
  //         {
  //           element_id: "nav-page1",
  //           text_input_elements: [],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: "Navigate to Page 1",
  //   starting_page: "/page1",
  //   tooltips: [
  //     {
  //       type: "informative",
  //       page: "/page1",
  //       target_element_id: "sidebar",
  //       target_area_element_id: "sidebar",
  //       title: "Sidebar Menu",
  //       content:
  //         "This is your sidebar menu. From here, you can navigate to all the main pages in the application.",
  //     },
  //     {
  //       type: "action",
  //       page: "/page1",
  //       target_element_id: "nav-page1",
  //       target_area_element_id: "nav-page1",
  //       title: "Page 1 Navigation",
  //       content: "Click here to navigate to Page 1.",
  //     },
  //   ],
  //   test_tasks: [
  //     {
  //       text: "Open the sidebar menu and navigate to Page 1",
  //       click_elements: [
  //         {
  //           element_id: "nav-page1",
  //           text_input_elements: [],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: "Navigate to Page 1",
  //   starting_page: "/page1",
  //   tooltips: [
  //     {
  //       type: "informative",
  //       page: "/page1",
  //       target_element_id: "sidebar",
  //       target_area_element_id: "sidebar",
  //       title: "Sidebar Menu",
  //       content:
  //         "This is your sidebar menu. From here, you can navigate to all the main pages in the application.",
  //     },
  //     {
  //       type: "action",
  //       page: "/page1",
  //       target_element_id: "nav-page1",
  //       target_area_element_id: "nav-page1",
  //       title: "Page 1 Navigation",
  //       content: "Click here to navigate to Page 1.",
  //     },
  //   ],
  //   test_tasks: [
  //     {
  //       text: "Open the sidebar menu and navigate to Page 1",
  //       click_elements: [
  //         {
  //           element_id: "nav-page1",
  //           text_input_elements: [],
  //         },
  //       ],
  //     },
  //   ],
  // },
];

export default demoTutorialData;
