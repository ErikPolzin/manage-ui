// tutorialData.js
const tutorial = [
  {
    stageName: "Basic Navigation",
    tooltips: [
      {
        type: "informative",
        targetElement: "#element0",
        targetAreaElement: "#element0",
        title: "Sidebar menu",
        content:
          "This is your side bar menu. From here, you can navigate to all the main pages in the application.\nYou can also access the application settings and your account details.",
      },
      {
        type: "informative",
        targetElement: "#element1",
        targetAreaElement: "#element1",
        title: "Feature 2",
        content: "This is the second feature of Stage 1.",
      },
      {
        type: "action",
        targetElement: "#element2",
        targetAreaElement: "#element2",
        title: "Feature 3",
        content: "Click on feature 2",
      },
      {
        type: "informative",
        targetElement: "#element4",
        targetAreaElement: "#element4",
        title: "Take a look",
        content: "Investigate all the search options by using this feature.",
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
      {
        text: "Click the testing remove button",
        clickElements: [
          {
            elementId: "#el-remove-test-button",
            textInputElements: [],
          },
        ],
      },
      {
        text: "Create a new Mesh device with a MAC of 127:69:0:1",
        clickElements: [
          {
            elementId: "#create-device-button",
            textInputElements: [
              {
                elementId: "#mac-address-inputbox",
                requiredInput: "127:69:0:1",
              },
              {
                elementId: "#device-type-inputbox",
                requiredInput: "Mesh type",
              },
            ],
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

export default tutorial;
