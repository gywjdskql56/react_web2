import React, { useState } from "react";
import { Range, getTrackBackground } from "react-range";


const STEP = 10;
const MIN = 0;
const MAX = 100;

export default function SliderARIA(props) {
  const [state, setState] = useState({values: [50]});

    return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            margin: "2em"
          }}
        >
        <h4 align="left">{props.title}</h4>
          <Range
            values={state.values}
            step={STEP}
            min={MIN}
            max={MAX}
            onChange={(values) => {setState({ values }); console.log(values);}}
            renderTrack={({ propss, children }) => (
              <div
                aria-hidden="true"
                onMouseDown={propss.onMouseDown}
                onTouchStart={propss.onTouchStart}
                style={{
                  ...propss.style,
                  height: "36px",
                  display: "flex",
                  width: "100%"
                }}
              >
                <div
                  ref={propss.ref}
                  style={{
                    height: "5px",
                    width: "100%",
                    borderRadius: "4px",
                    background: getTrackBackground({
                      values: state.values,
                      colors: ["blue", "black"],
                      min: MIN,
                      max: MAX
                    }),
                    alignSelf: "center"
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ pprops, isDragged }) => (
              <div
                {...pprops}
                style={{
                  ...pprops.style,
                  height: "42px",
                  width: "42px",
                  borderRadius: "4px",
                  backgroundColor: "#FFF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0px 2px 6px #AAA"
                }}
              >
                <div
                  style={{
                    height: "16px",
                    width: "5px",
                    backgroundColor: isDragged ? "#548BF4" : "#CCC"
                  }}
                />
              </div>
            )}
          />
          <output style={{ marginTop: "2px" }} id="output">
            {Math.trunc(state.values[0].toFixed(1)*0.1)/10}
          </output>
        </div>

    );

}