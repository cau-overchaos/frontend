import "@fontsource/libre-franklin/600.css";

type Props = {
  level: number;
  className?: string;
};

export default function SolvedAcTier(props: Props) {
  /**
   * - Unrated (= lv.0)
   * - Bronze
   * - Silver
   * - Gold
   * - Platinum
   * - Diamond
   * - Ruby
   */

  let background: string = "darkgray";
  let level: number = -1;

  if (props.level == 0) {
    level = 0;
  } else {
    level = props.level % 5;
    if (level == 0) level = 5;
  }

  if (1 <= props.level && props.level <= 5) {
    background = "sienna";
  } else if (5 < props.level && props.level <= 10) {
    background = "silver";
  } else if (10 < props.level && props.level <= 15) {
    background = "goldenrod";
  } else if (15 < props.level && props.level <= 20) {
    background = "lightgreen";
  } else if (20 < props.level && props.level <= 25) {
    background = "deepskyblue";
  } else if (25 < props.level) {
    background = "hotpink";
  }

  return (
    <svg
      width="76.322922mm"
      height="116.32246mm"
      viewBox="0 0 76.322922 116.32246"
      version="1.1"
      className={props.className}
    >
      <defs id="defs1" />
      <g id="layer1" transform="translate(-66.838542)">
        <path
          id="rect1"
          style={{
            fill: background,
            fillOpacity: 0.715517,
            stroke: "#fffefe",
            strokeWidth: 1.32292,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            paintOrder: "markers stroke fill"
          }}
          d="M 67.500005,0.66145998 H 142.5 l -4.6e-4,100.00000002 -37.5,14.99954 -37.499535,-15 z"
        />
        <path
          id="path1"
          style={{
            fill: "#ffffff",
            fillOpacity: 0.969642,
            stroke: "#fffefe",
            strokeWidth: 1.32292,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            paintOrder: "markers stroke fill"
          }}
          d="m 67.500005,76.553771 37.499815,15 37.50018,-15 -4.5e-4,10.000114 -37.49973,15.000025 -37.499815,-15.000005 z"
        />
        <text
          xmlSpace="preserve"
          transform="scale(1, 0.8)"
          style={{
            fill: "#ffffff",
            fillOpacity: 1,
            stroke: "#fffefe",
            strokeWidth: 0,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            paintOrder: "markers stroke fill"
          }}
          x="80.674187"
          y="80.502472"
          id="text1"
        >
          <tspan
            id="tspan1"
            style={{
              fontStyle: "normal",
              fontVariant: "normal",
              fontWeight: "normal",
              fontStretch: "40%",
              fontSize: "81.1389px",
              fontFamily: "Libre Franklin",
              fontVariantLigatures: "normal",
              fontVariantCaps: "normal",
              fontVariantNumeric: "normal",
              fontVariantEastAsian: "normal",
              strokeWidth: 1.32292
            }}
            x={80.674187 + (level <= 1 ? 5.0 : 0.0)}
            y="80.502472"
          >
            {level == 0 ? "?" : level}
          </tspan>
        </text>
      </g>
    </svg>
  );
}
