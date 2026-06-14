import { Tooltip as MantineTooltip } from '@mantine/core';

export const Tooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <MantineTooltip
        label={`${data.name}: ${data.value} ใบ (${data.percentage}%)`}
        opened
        withArrow
        position="top"
        color="black"
        transitionProps={{ transition: 'pop', duration: 150 }}
      >
        <div style={{ width: 1, height: 1 }} />
      </MantineTooltip>
    );
  }
  return null;
};