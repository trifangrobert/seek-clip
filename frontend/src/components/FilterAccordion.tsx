import React, { useCallback, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Box,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { topicColorMap } from "../utils/TopicColors";
import FastSlider from "./FastSlider";

interface FilterAccordionProps {
  selectedTopics: string[];
  onApplyFilters: (topics: string[], popularityRange: number[]) => void;
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({
  selectedTopics,
  onApplyFilters,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [stagedTopics, setStagedTopics] = useState<string[]>(selectedTopics);
  const [stagedPopularityRange, setStagedPopularityRange] = useState<number[]>([
    0, 100,
  ]);

  const handleToggleAccordion = () => {
    setExpanded((prev) => !prev);
  };

  const handleApplyFilters = () => {
    onApplyFilters(stagedTopics, stagedPopularityRange);
  };

  const handleToggleTopic = (topic: string) => {
    setStagedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
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
                  variant={stagedTopics.includes(topic) ? "filled" : "outlined"}
                  sx={{
                    bgcolor: stagedTopics.includes(topic)
                      ? `${topicColorMap[topic]}CC`
                      : undefined,
                  }}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="subtitle1">Popularity Range:</Typography>
            <FastSlider
              setValue={setStagedPopularityRange}
              startValue={0}
              endValue={100}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyFilters}
            sx={{ mt: 2 }}
          >
            Apply Filters
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default FilterAccordion;
