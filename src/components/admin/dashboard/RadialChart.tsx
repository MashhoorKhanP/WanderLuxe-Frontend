import React from "react";
import { RadialBarDatum, ResponsiveRadialBar } from "@nivo/radial-bar";
import moment from "moment";

interface RadialBarChartProps {
  bookings: any;
}

const RadialBarChart: React.FC<RadialBarChartProps> = ({ bookings }) => {
  const filteredBookings = bookings.filter(
    (booking: any) => moment(booking.createdAt).year() >= 2022
  );
  // Group bookings by hotelName and year
  const bookingsByHotelYear: {
    [hotelName: string]: { [year: number]: any[] };
  } = {};
  filteredBookings.forEach((booking: any) => {
    const hotelName = booking.hotelName;
    const year = moment(booking.createdAt).year();

    if (!bookingsByHotelYear[hotelName]) {
      bookingsByHotelYear[hotelName] = {};
    }

    if (!bookingsByHotelYear[hotelName][year]) {
      bookingsByHotelYear[hotelName][year] = [];
    }

    bookingsByHotelYear[hotelName][year].push(booking);
  });

  // Get unique hotel names
  const hotelNames = Object.keys(bookingsByHotelYear);

  // Get unique years from 2022 to the current year
  const currentYear = moment().year();
  const years = Array.from(
    { length: currentYear - 2021 },
    (_, index) => 2022 + index
  );

  // Calculate total income for each hotel and year
  const data: RadialBarDatum[] | any = [];

  hotelNames.forEach((hotelName) => {
    const yearlyData: { [year: number]: number } = {};

    years.forEach((year) => {
      if (bookingsByHotelYear[hotelName][year]) {
        bookingsByHotelYear[hotelName][year].forEach((booking: any) => {
          yearlyData[year] =
            (yearlyData[year] || 0) + parseFloat(booking.totalAmount);
        });
      } else {
        yearlyData[year] = 0;
      }
    });

    data.push({
      id: hotelName,
      data: Object.entries(yearlyData).map(([x, y]) => ({ x: parseInt(x), y })),
    });
  });

  return (
    <ResponsiveRadialBar
      data={data}
      theme={{
        background: "#1b2537",
        text: {
          fontSize: 11,
          fill: "#333333",
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
              outlineWidth: 0,
              outlineColor: "transparent",
            },
          },
          ticks: {
            line: {
              stroke: "#777777",
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
            fill: "#f5f5f5",
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
      valueFormat=">-.2f"
      padding={0.4}
      cornerRadius={2}
      margin={{ top: 40, right: 120, bottom: 40, left: 40 }}
      colors={{ scheme: "paired" }}
      radialAxisStart={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
      circularAxisOuter={{ tickSize: 5, tickPadding: 12, tickRotation: 0 }}
      labelsTextColor="#000000"
      legends={[
        {
          anchor: "right",
          direction: "column",
          justify: false,
          translateX: 80,
          translateY: 0,
          itemsSpacing: 6,
          itemDirection: "left-to-right",
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          symbolSize: 18,
          symbolShape: "square",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#f5f5f5",
              },
            },
          ],
        },
      ]}
    />
  );
};

export default RadialBarChart;
