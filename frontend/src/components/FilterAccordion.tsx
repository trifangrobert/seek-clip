import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Box,
  Button,
  Grid,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  SelectChangeEvent,
  Slider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { topicColorMap } from "../utils/TopicColors";

interface FilterAccordionProps {
  defaultFilters: {
    topics: string[];
    popularityRange: number[];
    sortCriteria: string;
  };
  onApplyFilters: (
    topics: string[],
    popularityRange: number[],
    sortCriteria: string
  ) => void;
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({
  defaultFilters,
  onApplyFilters,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [stagedTopics, setStagedTopics] = useState<string[]>(
    defaultFilters.topics
  );
  const [stagedPopularityRange, setStagedPopularityRange] = useState<number[]>(
    defaultFilters.popularityRange
  );
  const [sortCriteria, setSortCriteria] = useState<string>(
    defaultFilters.sortCriteria
  );

  const handleToggleAccordion = () => {
    setExpanded((prev) => !prev);
  };

  const handleApplyFilters = () => {
    onApplyFilters(stagedTopics, stagedPopularityRange, sortCriteria);
  };

  const handleResetFilters = () => {
    setStagedTopics(defaultFilters.topics);
    setStagedPopularityRange(defaultFilters.popularityRange);
    setSortCriteria(defaultFilters.sortCriteria);
    onApplyFilters(
      defaultFilters.topics,
      defaultFilters.popularityRange,
      defaultFilters.sortCriteria
    );
  };

  const handleToggleTopic = (topic: string) => {
    setStagedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortCriteria(event.target.value as string);
  };

  return (
    <Accordion expanded={expanded} onChange={handleToggleAccordion}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Choose filters and sorting</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                      stagedTopics.includes(topic) ? "filled" : "outlined"
                    }
                    sx={{
                      bgcolor: stagedTopics.includes(topic)
                        ? `${topicColorMap[topic]}CC`
                        : undefined,
                    }}
                  />
                ))}
              </Box>
              <Typography variant="subtitle1">Popularity Range:</Typography>
              <Slider
                defaultValue={defaultFilters.popularityRange}
                value={stagedPopularityRange}
                onChange={(event, newValue) => {
                  setStagedPopularityRange(newValue as number[]);
                }}
                valueLabelDisplay="auto"
                min={defaultFilters.popularityRange[0]}
                max={defaultFilters.popularityRange[1]}
                sx={{ width: 300 }} // Adjust the width to fit within the layout
              ></Slider>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "70%",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="sort-label">Sort By</InputLabel>
                <Select
                  labelId="sort-label"
                  id="sort-select"
                  value={sortCriteria}
                  label="Sort By"
                  onChange={handleSortChange}
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                  <MenuItem value="most-viewed">Most Viewed</MenuItem>
                  <MenuItem value="least-viewed">Least Viewed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyFilters}
            size="small"
          >
            Apply Filters
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleResetFilters}
            size="small"
          >
            Reset Filters
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default FilterAccordion;
