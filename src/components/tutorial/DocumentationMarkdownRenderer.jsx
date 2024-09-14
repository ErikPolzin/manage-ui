import React from "react";
import { Typography, Box, Link } from "@mui/material";

// Function to parse the documentation text and render UI elements
const parseDocumentation = (text) => {
  // Regular expression to match the symbolic notation
  const regex =
    /\$(pageHeading|heading1|heading2|heading3|body1|body2|link|image|video)\{([^}]*)\}\{([^}]*)\}(?:\{([^}]*)\})?/g;

  // Replace the notation with the corresponding UI elements
  return text.split("\n").map((line, index) => {
    const parts = [];
    let match;

    // Loop through all matches
    while ((match = regex.exec(line)) !== null) {
      const [fullMatch, type, id, content, url] = match;

      switch (type) {
        case "pageHeading":
          parts.push(null);
          break;
        case "heading1":
          parts.push(
            <Typography
              key={index + "-" + id}
              id={id}
              variant="h4"
              sx={{ marginTop: "25px", color: "#2C3E50" }}
            >
              {content}
            </Typography>,
          );
          break;
        case "heading2":
          parts.push(
            <Typography
              key={index + "-" + id}
              id={id}
              variant="h5"
              sx={{ marginTop: "15px", color: "#3A526A" }}
            >
              {content}
            </Typography>,
          );
          break;
        case "heading3":
          parts.push(
            <Typography
              key={index + "-" + id}
              id={id}
              variant="h6"
              sx={{ marginTop: "5px", color: "#5E82A6" }}
            >
              {content}
            </Typography>,
          );
          break;
        case "body1":
          parts.push(
            <Typography key={index + "-" + id} id={id} variant="body1">
              {content}
            </Typography>,
          );
          break;
        case "body2":
          parts.push(
            <Typography key={index + "-" + id} id={id} variant="body2">
              {content}
            </Typography>,
          );
          break;
        case "link":
          parts.push(
            <Link key={index + "-" + id} href={id} target="_blank" rel="noopener noreferrer">
              {content}
            </Link>,
          );
          break;
        case "image":
          parts.push(
            <Box key={index + "-" + id} id={id} sx={{ margin: "20px 0", textAlign: "center" }}>
              <img src={url} alt={content} style={{ maxWidth: "100%" }} />
              <Typography variant="caption">{content}</Typography>
            </Box>,
          );
          break;
        case "video":
          parts.push(
            <Box key={index + "-" + id} id={id} sx={{ margin: "20px 0" }}>
              <Typography variant="h6">{content}</Typography>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${url}`}
                title={content}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                role="iframe"
              ></iframe>
            </Box>,
          );
          break;
        default:
          break;
      }
    }

    // Return the line with replaced parts
    return <div key={index}>{parts.length ? parts : line}</div>;
  });
};

const DocumentationMarkdownRenderer = ({ text }) => {
  return <>{parseDocumentation(text)}</>;
};

export default DocumentationMarkdownRenderer;
