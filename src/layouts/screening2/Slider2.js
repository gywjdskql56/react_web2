import React from "react";
import { Range, getTrackBackground } from "react-range";

const STEP = 10;
const MIN = 0;
const MAX = 100;

export default class SliderARIA extends React.Component {
  state = {
    values: [50]
  };

  render() {
    return (
      <fieldset>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            margin: "2em"
          }}
        >
        <legend>Value</legend>
          <Range
            values={this.state.values}
            step={STEP}
            min={MIN}
            max={MAX}
            onChange={(values) => this.setState({ values })}
            renderTrack={({ props, children }) => (
              <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{
                  ...props.style,
                  height: "36px",
                  display: "flex",
                  width: "100%"
                }}
              >
                <div
                  ref={props.ref}
                  style={{
                    height: "5px",
                    width: "100%",
                    borderRadius: "4px",
                    background: getTrackBackground({
                      values: this.state.values,
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
            renderThumb={({ props, isDragged }) => (
              <div
                {...props}
                style={{
                  ...props.style,
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
          <output style={{ marginTop: "30px" }} id="output">
            {this.state.values[0].toFixed(1)}
          </output>
        </div>
      </fieldset>
    );
  }
}
