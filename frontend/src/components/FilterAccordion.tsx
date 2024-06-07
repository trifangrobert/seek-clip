import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Box,
  Slider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { topicColorMap } from "../utils/TopicColors";

interface FilterAccordionProps {
  selectedTopics: string[];
  onToggleTopic: (topic: string) => void;
  onPopularityChange: (popularityRange: number[]) => void;
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({
  selectedTopics,
  onToggleTopic,
  onPopularityChange,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [popularityRange, setPopularityRange] = useState<number[]>([0, 1000]);

  const handleToggleAccordion = () => {
    setExpanded((prev) => !prev);
  };

  const handleToggleTopic = (topic: string) => {
    onToggleTopic(topic);
  };

  return (
    <Accordion expanded={expanded} onChange={handleToggleAccordion}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Choose filters</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="subtitle1">Select Topics:</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {Object.keys(topicColorMap).map((topic) => (
                <Chip
                  key={topic}
                  label={topic}
                  clickable
                  onClick={() => handleToggleTopic(topic)}
                  color="primary"
                  variant={
                    selectedTopics.includes(topic) ? "filled" : "outlined"
                  }
                  sx={{
                    bgcolor: selectedTopics.includes(topic)
                      ? `${topicColorMap[topic]}CC`
                      : undefined,
                  }}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="subtitle1">Popularity Range:</Typography>
            <Slider
              value={popularityRange}
              onChange={(event, newValue) => {
                setPopularityRange(newValue as number[]);
                onPopularityChange(newValue as number[]);
              }}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              marks
              sx={{ width: 300 }} // Adjust the width to fit within the layout
            />
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default FilterAccordion;
