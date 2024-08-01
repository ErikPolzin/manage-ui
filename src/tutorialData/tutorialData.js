// tutorialData.js
const tutorial = [
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
