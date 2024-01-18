import { ResponsiveLine } from "@nivo/line";
import moment from "moment";
import React, { useState } from "react";
interface LineChartProps {
  bookings: any;
}

const LineChart: React.FC<LineChartProps> = ({ bookings }) => {
  // Create an object to store data points for each hotel
  const hotelData: { [hotelName: string]: { [month: string]: number } } = {};
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const filteredBookings = selectedYear
    ? bookings.filter(
        (booking: any) => moment(booking.createdAt).year() === selectedYear
      )
    : bookings;
  // Iterate over bookings to populate the hotelData object
  bookings.forEach((booking: any) => {
    const hotelName = booking.hotelName;
    // Use correct format for parsing the date
    const month = moment(booking.createdAt, "YYYY-MM-DDTHH:mm:ss.SSSZ").format(
      "MMMM YYYY"
    );

    // Initialize the object for the hotel if not already present
    if (!hotelData[hotelName]) {
      hotelData[hotelName] = {};
    }

    // Initialize the income for the month if not already present
    if (!hotelData[hotelName][month]) {
      hotelData[hotelName][month] = 0;
    }

    // Add the totalAmount to the income for the month
    hotelData[hotelName][month] += booking.totalAmount;
  });

  // Get the current month and the previous 4 months
  const currentDate = moment();
  const sortedMonths = Array.from({ length: 5 }, (_, index) =>
    currentDate.clone().subtract(index, "months").format("MMMM YYYY")
  ).reverse();

  // Convert the hotelData object into an array of series for the chart
  const data = Object.entries(hotelData).map(([hotelName, monthlyData]) => ({
    id: hotelName,
    data: sortedMonths.map((month) => ({
      x: month,
      y: monthlyData[month] || 0, // Set income to 0 if data is missing for the month
    })),
  }));

  return (
    <ResponsiveLine
      data={data}
      theme={{
        background: "#1b2537",
        text: {
          fontSize: 11,
          fill: "#f5f5f5",
          outlineWidth: 0,
          outlineColor: "transparent",
        },
        axis: {
          domain: {
            line: {
              stroke: "#777777",
              strokeWidth: 1,
            },
          },
          legend: {
            text: {
              fontSize: 12,
              fill: "#f5f5f5",
              translate: -10,
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
          ticks: {
            line: {
              stroke: "#f5f5f5",
              strokeWidth: 1,
            },
            text: {
              fontSize: 11,
              fill: "#f5f5f5",
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
        },
        grid: {
          line: {
            stroke: "#dddddd",
            strokeWidth: 1,
          },
        },
        legends: {
          title: {
            text: {
              fontSize: 11,
              fill: "#f5f5f5",
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
          text: {
            fontSize: 11,
            fill: "#f5f5f5",
            outlineWidth: 0,
            outlineColor: "transparent",
          },
          ticks: {
            line: {},
            text: {
              fontSize: 10,
              fill: "#333333",
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
        },
        annotations: {
          text: {
            fontSize: 13,
            fill: "#333333",
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
          link: {
            stroke: "#000000",
            strokeWidth: 1,
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
          outline: {
            stroke: "#000000",
            strokeWidth: 2,
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
          symbol: {
            fill: "#000000",
            outlineWidth: 2,
            outlineColor: "#ffffff",
            outlineOpacity: 1,
          },
        },
        tooltip: {
          container: {
            background: "#ffffff",
            fontSize: 12,
            color: "#000000",
          },
          basic: {},
          chip: {},
          table: {},
          tableCell: {},
          tableCellValue: {},
        },
      }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: 0,
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Month",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 4,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Total Income",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      colors={{ scheme: "nivo" }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      enableArea={true}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: -400,
          translateY: -10,
          itemsSpacing: 0,
          itemDirection: "right-to-left",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
