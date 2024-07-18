import React from "react";
import { format, parseISO } from "date-fns";

const PointsTable = (props) => {
  return (
    <>
      {console.log(props.dataAll, "newfilleee")}
      <table style={{ width: "100%" }}>
        <tr>
          <th>Event</th>
          <th>Date</th>
          <th>Points</th>
        </tr>

        {props.dataAll.length &&
          props.dataAll.map((elm) => {
            console.log();

            return (
              <>
                <tr>
                  <td style={{ fontSize: "12px" }}>
                    {elm.type === "order-placed"
                      ? "Points earned for purchas"
                      : elm.type === "expire"
                      ? "Points expired"
                      : elm.type === "shipped"
                      ? "Points Shipped"
                      : `Points adjusted by "admin"`}
                  </td>

                  <td style={{ fontSize: "12px" }}>
                    <p
                      style={{
                        borderBottom: "1px dotted #777",
                        width: "fit-content",
                        margin: "4px",
                      }}
                    >
                      {elm.date === "0000-00-00 00:00:00"
                        ? "-"
                        : format(new Date(elm.date), "MMMM dd, yyyy")}
                    </p>
                  </td>

                  <td style={{ fontSize: "12px" }}>
                    {elm.points.includes("-") ? elm.points : `+${elm.points}`}
                  </td>
                </tr>
              </>
            );
          })}
      </table>
    </>
  );
};

export default PointsTable;
